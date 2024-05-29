<template>
    <div ref="editor"
    class="__monaco_editor_frame"
    ></div>
</template>

<script>
    import * as monaco from 'monaco-editor'
    import eventBus from './utils/eventBus'
    import gdbManager from './utils/gdbManager'
    import disassembleRender from './utils/disassembleRender'

    let editor=null
    let decorations=[]
    const editorAreaPosList=[
        {left:null,right:0,res:'undefined-left'},
        {left:0,right:40,res:'head'},
        {left:40,right:null,res:'body'},
    ]
    const BREAKPOINT_CLASSNAME='__monaco_editor_breakpoint'
    const BREAKPOINT_HOVER_CLASSNAME='__monaco_editor_breakpoint_hover'
    const CURRENT_BACK_GROUND='__monaco_editor_current_line_back_ground'
    let pathModelMap=new Map()
    let disassembleEnable=false
    let currentModelPath=false
    let currentRunFilePath=false
    let currentRunFileLine=false
    let currentRunFileAddr=false
    let lineAsmMap=new Map()
    let addrBreakpointMap=new Map()
    let pathLineBreakpointMap=new Map()

    export default {
        name: 'MonacoEditor',
        data(){
            return {
                eventStruct:{
                    r:eventBus.roleName.MONACO_EDITOR,
                    n:[
                        {
                            r:eventBus.roleName.FILE_TREE,
                            n:[ 
                                {
                                    m:eventBus.eventName.SET_TEXT,
                                    h:(data)=>{
                                        this.setText(data)
                                    }
                                },
                                {
                                    m:eventBus.eventName.GET_TEXT_REQUEST,
                                    h:(data)=>{
                                        if(!currentModelPath)return
                                        let callbackData={
                                            path:currentModelPath,
                                            text:this.getText(),
                                        }
                                        data.callback(callbackData)
                                    }
                                },
                        ]
                        },
                        {
                            r:eventBus.roleName.INDEX_PAGE,
                            n:[
                                {
                                    m:eventBus.eventName.OPEN_FILE,
                                    h:(data)=>{
                                        let model=monaco.editor.createModel(
                                            data.text,data.language)
                                        pathModelMap.set(data.path,model)
                                        currentModelPath=data.path
                                        editor.setModel(model)
                                        editor.updateOptions({readOnly: false})
                                    }
                                },
                                
                                {
                                    m:eventBus.eventName.CLOSE_FILE,
                                    h:(data)=>{
                                        pathModelMap.delete(data)
                                    }
                                },
                                {
                                    m:eventBus.eventName.CHANGE_FILE,
                                    h:(data)=>{
                                        if(!data){
                                            editor.setModel(null)
                                            return
                                        }
                                        currentModelPath=data
                                        if(disassembleEnable){
                                            this.disassembleViewChangeFileHandler()
                                        }
                                        editor.setModel(pathModelMap.get(data))
                                        editor.updateOptions({readOnly: false})
                                        
                                    }
                                }
                            ]
                        },
                        {
                            r:eventBus.roleName.HEAD_FRAME,
                            n:[
                                {
                                    m:eventBus.eventName.OPEN_DISASSEMBLY,
                                    h:async (data)=>{
                                        disassembleEnable=!disassembleEnable
                                        if(disassembleEnable){
                                            await this.updateDisassembleView()
                                            await this.disassembleViewChangeFileHandler()
                                        }
                                        else{
                                            await this.clearDisassembleView()
                                            await this.disassembleViewChangeFileHandler()
                                        }
                                        editor.updateOptions({readOnly: disassembleEnable})
                                    }
                                },
                                {
                                    m:eventBus.eventName.CHANGE_CURRENT_LINE,
                                    h:async (data)=>{
                                        if(data.path){
                                            this.updateModelCurrentLine(data.path,data.line)
                                            currentRunFileLine=data.line
                                            currentRunFilePath=data.path
                                            currentRunFileAddr=data.addr
                                            await this.updateDisassembleView()
                                            await this.disassembleViewChangeFileHandler()
                                            data.callback()
                                            return
                                        }
                                        //run is end.
                                        for(let [path,model] of pathModelMap){
                                            this.updateModelCurrentLine(path,null)
                                            currentRunFileLine=false
                                            currentRunFilePath=false
                                            currentRunFileAddr=false
                                            this.clearDisassembleView()
                                            await this.disassembleViewChangeFileHandler()
                                        }
                                        data.callback()
                                    }
                                },
                                {
                                    m:eventBus.eventName.UPDATE_BREAKPOINTS_STATUS,
                                    h:async (data)=>{
                                        let res
                                        let toDeleteKeyList=[]
                                        for(let entry of pathLineBreakpointMap){
                                            let key=entry[0]
                                            let value=entry[1]
                                            if(value.index==null && value.status==true){
                                                res=await gdbManager.exec('break '+key)
                                                res=gdbManager.mapBreakPointCreateToId(res)
                                                value.index=res
                                            }
                                            else if(value.index!=null && value.status==false){
                                                res=await gdbManager.exec('delete '+value.index)
                                                toDeleteKeyList.push(key)
                                            }
                                        }
                                        for(let each of toDeleteKeyList){
                                            pathLineBreakpointMap.delete(each)
                                        }
                                        data.callback()
                                    }
                                },
                                {
                                    m:eventBus.eventName.CLEAR_BREAKPOINT_BEFORE_RUN,
                                    h:async(data)=>{
                                        let res
                                        res=await gdbManager.exec('delete')
                                        res=this.getBreakPointLineList()
                                        pathLineBreakpointMap.clear()
                                        for(let each of res){
                                            let path=each.path
                                            for(let line of each.lineList){
                                                pathLineBreakpointMap.set(
                                                    path+':'+line,
                                                    {index:null,status:true}
                                                )
                                            }
                                        }
                                        data.callback()
                                    }
                                }
                            ]
                        },
                    ]
                },
            }
        },
        
        methods:{
            //call when select model changed and after run update.
            async disassembleViewChangeFileHandler(){
                if(!disassembleEnable)return
                if(!currentRunFilePath)return
                for(let entry of lineAsmMap){
                    let obj=entry[1]
                    let viewZoneIdList=obj.viewZoneIdList
                    for(let i=0;i<viewZoneIdList.length;i++){
                        await disassembleRender.removeViewZone(editor,viewZoneIdList[i])
                    }
                    viewZoneIdList.length=0
                }
                console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',currentRunFilePath,currentModelPath,currentRunFilePath!=currentModelPath)
                if(currentRunFilePath!=currentModelPath){
                    return
                }
                for(let entry of lineAsmMap){
                    let line=entry[0]
                    let data=entry[1]
                    data.viewZoneIdList=[]
                    let asmList=data.asmList
                    for(let i=0;i<asmList.length;i++){
                        let asm=asmList[i]
                        asm.isCurrentLine=asm.address==currentRunFileAddr
                        let res=await disassembleRender.addViewZone(editor,asm,line,i)
                        data.viewZoneIdList.push(res)
                    }
                    
                }
                console.log('lineAsmMap',lineAsmMap)
            },
            async clearDisassembleView(){
                for(let entry of lineAsmMap){
                    let viewZoneIdList=entry[1].viewZoneIdList
                    for(let i=0;i< viewZoneIdList.length;i++){
                        await disassembleRender.removeViewZone(editor,viewZoneIdList[i])
                    }
                    viewZoneIdList.length=0
                }
                lineAsmMap.clear()
            },
            //call after run and enable disassemble.
            async updateDisassembleView(){
                if(!disassembleEnable)return
                if(!currentModelPath || !currentRunFileLine)return
                let res=await gdbManager.exec(
                    '-data-disassemble -f '+currentRunFilePath+' -l '+currentRunFileLine+'  -- 1')
                res=gdbManager.mapDissassembleToMap(res)
                await this.clearDisassembleView()
                for(let entry of res){
                    lineAsmMap.set(entry[0],{
                        asmList:entry[1],
                        viewZoneIdList:[],
                    })
                }
            },
            //call when leave disassemble and afterRun
            

            getEditorMouseClicktArea(e){
                if(!e.target.detail||!e.target.detail.offsetX){
                    return false
                }
                let ox=e.target.detail.offsetX
                for(let index in editorAreaPosList){
                    let each = editorAreaPosList[index]
                    if(each.left!=null && !(each.left<=ox))continue
                    if(each.right!=null && !(each.right>ox))continue
                    return each.res
                }
                return false
            },
            hasBreakPoint(line){
                let decorationList=editor.getLineDecorations(line);
                for(let each of decorationList){
                    if(each.options.glyphMarginClassName==BREAKPOINT_CLASSNAME){
                        return true
                    }
                }
                return false
            },
            breakPointEnHover(line){
                let model=editor.getModel()
                if(this.hasBreakPoint(line))return;
                let newBPDList=[{
                    range: new monaco.Range(line, 1, line, 1),
                    options: {
                        isWholeLine: true,
                        glyphMarginClassName: BREAKPOINT_HOVER_CLASSNAME
                    },
                }]
                decorations=model.deltaDecorations(decorations,newBPDList)
            },
            breakPointDisHover(){
                let model=editor.getModel()
                decorations=model.deltaDecorations(decorations,[])
            },
            breakPointHover(line){
                if(!(editor.getModel()
                .getLineContent(line).trim()))return
                if(this.hasBreakPoint(line)){
                    return
                }
                this.breakPointEnHover(line)
            },
            getBreakPointLineList(){
                let resList=[]
                console.log(pathModelMap)
                pathModelMap.forEach((value,key,map)=>{
                    let lineList=[]
                    let decorationList=value.getAllDecorations()
                    for(let each of decorationList){
                        if(each.options.glyphMarginClassName==BREAKPOINT_CLASSNAME){
                            lineList.push(each.range.startLineNumber)
                        }
                    }
                    resList.push({path:key,lineList:lineList})
                })
                return resList
            },
            addBreakPoint(line){
                let model=editor.getModel()
                let newBPDList=[{
                    range: new monaco.Range(line, 1, line, 1),
                    options: {
                        isWholeLine: true,
                        glyphMarginClassName: BREAKPOINT_CLASSNAME
                    },
                },]
                model.deltaDecorations([],newBPDList)
                if(currentModelPath==false){
                    //is disassembly model
                    let content=model.getLineContent(line)
                    let addr=gdbManager.mapDissassembleLineToAddr(content)
                    if(addrBreakpointMap.has(addr)){
                        addrBreakpointMap.get(addr).status=true
                    }
                    else{
                        addrBreakpointMap.set(addr,{index:null,status:true})
                    }
                }
                else{
                    //is c model
                    let key=currentModelPath+':'+line
                    if(pathLineBreakpointMap.has(key)){
                        pathLineBreakpointMap.get(key).status=true
                    }
                    else{
                        pathLineBreakpointMap.set(key,{index:null,status:true})
                    }
                }
            },
            
            removeBreakPoint(line){
                let model=editor.getModel()
                let decorationList=false
                let idList=[]
                if(line!==null && line!==undefined){
                    decorationList=editor.getDecorationsInRange(new monaco.Range(line, 1, line, 1))
                }
                else{
                    decorationList=editor.getModel().getAllDecorations()
                }
                for(let each of decorationList){
                    if(each.options.glyphMarginClassName==BREAKPOINT_CLASSNAME){
                        idList.push(each.id);
                    }
                }
                if(idList && idList.length){
                    model.deltaDecorations(idList,[])
                }
                if(currentModelPath==false){
                    //is disassembly model
                    let content=model.getLineContent(line)
                    let addr=gdbManager.mapDissassembleLineToAddr(content)
                    if(addrBreakpointMap.has(addr)){
                        if(addrBreakpointMap.get(addr).index==null){
                            addrBreakpointMap.delete(addr)
                        }
                        else{
                            addrBreakpointMap.get(addr).status=false
                        }
                    }
                }
                else{
                    //is c model
                    let key=currentModelPath+':'+line
                    if(pathLineBreakpointMap.has(key)){
                        if(pathLineBreakpointMap.get(key).index==null){
                            pathLineBreakpointMap.delete(key)
                        }
                        else{
                            pathLineBreakpointMap.get(key).status=false
                        }
                    }
                }
            },

            updateBreakPoint(line){
                if(!(editor.getModel()
                .getLineContent(line).trim()))return
                if(this.hasBreakPoint(line)){
                    this.removeBreakPoint(line)
                    return
                }
                this.addBreakPoint(line)
            },
            updateSingleModelCurrentLine(model,line){
                let decorationList=model.getAllDecorations()
                let lineList=[]
                for(let each of decorationList){
                    if(each.options.className==CURRENT_BACK_GROUND){
                        lineList.push(each.id)
                    }
                }
                if(lineList && lineList.length){
                    model.deltaDecorations(lineList,[])
                }
                if(!line)return
                let newCBGList=[{
                    range: new monaco.Range(line, 1, line, 1),
                    options: {
                        isWholeLine: true,
                        className: CURRENT_BACK_GROUND
                    },
                },]
                model.deltaDecorations([],newCBGList)
            },
            updateModelCurrentLine(modelPath,line){
                if(!(pathModelMap.has(modelPath)))return
                let model=pathModelMap.get(modelPath)
                this.updateSingleModelCurrentLine(model,line)
            },
            updateDisassemblyCurrentLine(line){
                if(!disassemblyModel)return
                this.updateSingleModelCurrentLine(disassemblyModel,line)
            },

            initEditor(){
                editor=monaco.editor.create(this.$refs.editor, {
                    theme: 'vs', 
                    model:null,
                    automaticLayout: true,
                    glyphMargin: true,
                    lineNumbersMinChars: 2,
                })
            },
            initMouseFunction(){
                editor.onMouseDown(e=>{
                    var area=this.getEditorMouseClicktArea(e)
                    if(area=='head'){
                        let line=e.target.position.lineNumber
                        this.updateBreakPoint(line)
                        return
                    }
                })
                editor.onMouseMove(e=>{
                    this.breakPointDisHover()
                    var area=this.getEditorMouseClicktArea(e)
                    if(area=='head'){
                        let line=e.target.position.lineNumber
                        this.breakPointHover(line)
                        return
                    }
                    
                })
                
            },
            setText(text){
                editor.setValue(text)
            },
            getText(){
                return editor.getValue()
            }
        },
        mounted(){
            this.initEditor()
            this.initMouseFunction()
            eventBus.bind(this.eventStruct)
        },
        beforeUnmount(){
            eventBus.unbind(this.eventStruct)
        },
        beforeDestroy() {
            editor.dispose()
        },
    }
</script>
<style lang="less">
    // if scoped,break point is unable to show.
    .__monaco_editor_breakpoint_base(){
        clip-path: circle(20%);
        width: 20px;
    }
    .__monaco_editor_breakpoint{
        .__monaco_editor_breakpoint_base();
        background: red;
    }
    .__monaco_editor_breakpoint_hover{
        .__monaco_editor_breakpoint_base();
        background: lightcoral;
    }
    .__monaco_editor_current_line_back_ground{
        background: orange;
    }
</style>