import eventBus from './eventBus'

const { spawn } = require('node:child_process')
const gdb=spawn('gdb',['-i=mi'])
let buffer=''

function formatSpecialPreFix(objectString){
    objectString=objectString.replaceAll('src_and_asm_line=','')
    // objectString=objectString.replaceAll('line_asm_insn=','')
    return objectString
}
function formatStringToObject(contentString){
    let object=''
    let objectList=contentString.split(',')
    let name=objectList[0]
    for(let i =1;i<objectList.length;i++){
        object+=objectList[i]+','
    }
    //fix strange bug
    if(name=='done'){
        object=formatSpecialPreFix(object)
    }
    object='{'+object+'}'
    object=object.replaceAll(':','\\:')
    object=object.replaceAll('=',':')
    object=object.replaceAll('-','_')
    object = eval(`( ${object} )`)
    return {name:name,content:object}
}
function format(data){
    let res={
        command:[],
        object:[],
        note:[],
        status:[],
        res:[],
    }
    let dataTmp=data.split('\n')
    for(let each of dataTmp){
        let contentString=each.substr(1,each.length)
        if(each.charAt(0)=='='){
            res.object.push(formatStringToObject(contentString))
            continue
        }
        if(each.charAt(0)=='&'){
            let obj = eval(`( ${contentString} )`);
            res.command.push(obj)
            continue
        }
        if(each.charAt(0)=='~'){
            let obj = eval(`( ${contentString} )`);
            res.note.push(obj)
            continue
        }
        if(each.charAt(0)=='*'){
            res.status.push(formatStringToObject(contentString))
            continue
        }
        if(each.charAt(0)=='^'){
            res.res.push(formatStringToObject(contentString))
            continue
        }
        if(each==''){
            continue
        }
        console.log('commond-line-output',each)

    }
    // console.log('format',res)
    return res
}

function isRow(each){
    if(each=='')return false
    if(each=='\n')return true
    let firstChar=each.charAt(0)
    let targetList=['*','^','=','&','~']
    for(let each of targetList){
        if(firstChar==each)return false
    }
    if(each=='(gdb)'||each=='(gdb)\r'||each=='(gdb) \r')return false
    return true
}

gdb.stderr.on('data',(data)=>{
    console.error('GDB错误',data.toString())
})
gdb.on('close',(code)=>{
    console.log('GDB进程退出,退出码',code)
})

export default{
    
    exec(cmd,count=1){
        let res=new Promise((reslove,reject)=>{
            let response=''
            let isDone=0
            let res=[]
            gdb.stdout.removeAllListeners('data')
            gdb.stdout.on('data',(data)=>{
                console.log(data.toString())
                const lineList=data.toString().trim().split('\n');
                lineList.forEach((line=>{
                    
                    // console.log('line-res:',line,line.endsWith('^done'))
                    if(line.endsWith('^done')||line.endsWith('^done\r')||line.endsWith('(gdb)')||line.endsWith('(gdb)\r')){
                        isDone++;
                        res.push(format(response))
                        response=''
                    }
                    if(isRow(line)){
                        console.log('----isLine',line)
                        eventBus.send(
                            eventBus.roleName.GDB,
                            eventBus.roleName.COMMAND_LINE,
                            eventBus.eventName.SHOW_OUTPUT_LINE,
                            line
                        )
                    }
                    if(isDone>=count){
                        gdb.stdout.removeAllListeners('data')
                        gdb.stdout.on('data',(data)=>{
                            console.log(data.toString())
                        })
                        
                        if(count<=1){
                            reslove(res[0])
                        }
                        else{
                            reslove(res)
                        }
                    }
                    else{
                        response+=line+'\n'
                    }
                }))
            })
        })
        gdb.stdin.write(cmd+'\n')

        return res
    },
    init(){
        this.exec('').then((res)=>{
        console.log('init message',res)})
    },
    setFile(){
    },
    batchUpdateBreakPoint(breakPointLineList){

    },
    mapBreakpointsToList(data){
        let res=[]
        if(!data||!(data.note)||data.note.length<3)return res
        let index=false
        let type=false
        let disp=false
        let enb=false
        let addr=false
        let func=false
        let file=false
        let line=false
        let hitCount=false
        let i=1
        while(i<data.note.length){
            let l1=data.note[i].split(' ').filter(e=>e!='')
            index=l1[0]
            type=l1[1]
            disp=l1[2]
            enb=l1[3]
            if(l1.length>=9){
                addr=l1[4]
                func=l1[6]
                let l2=l1[8].split('\n')[0].split(':')
                file=l2[0]
                line=l2[1]
            }
            else{
                addr=l1[5]
                func='/'
                file='/'
                line='/'
            }
            hitCount=0
            if((i+1<data.note.length) 
                && (data.note[i+1].charAt(0)=='\t')){
                i++
                let l2=data.note[i].split('\t')[1].split('\n')[0]
                let l3=l2.split(' ').filter(e=>e!='')
                hitCount=l3[3]
            }
            res.push({
                index:index,
                type:type,
                disp:disp,
                enb:enb,
                addr:addr,
                func:func,
                file:file,
                line:line,
                hitCount:hitCount,
            })
            i++
        }
        return res
    },
    mapInferiorsToId(data){
        if(!(data.note)||data.note.length<2)return -1
        let tokenList=data.note[1].split(' ').filter(e=>e!='')
        // console.log(tokenList)
        let res=tokenList[0]=='*'?tokenList[1]:tokenList[0]
        return parseInt(res)
    },
    mapRegistersToList(data){
        let res=[]
        if(!(data.note)||data.note.length<3)return res
        let i=0
        let status='getNameAndVal'
        let name=false
        let valHex=false
        let val=false
        while(i<data.note.length){
            if(status=='getNameAndVal'){
                let l1=data.note[i].split(' ').filter(e=>e!='')
                name=l1[0]
                valHex=l1[1]
                status='getHexVal'
            }
            else if(status=='getHexVal'){
                let l2=data.note[i].split('\t').filter(e=>e!='')
                val=l2[0]
                let l3=val.split('\n')
                if(l3.length>1){
                    val=l3[0]
                    status='getNameAndVal'
                }
                else{
                    status='getNextLine'
                }
                res.push({
                    name:name,
                    valHex:valHex,
                    val:val,
                })
                
            }
            else if(status=='getNextLine'){
                status='getNameAndVal'
            }
            i++
        }
        return res
    },
    mapCallStackToList(data){
        let res=[]
        let index=false
        let func=false
        let file=false
        let line=false
        if(!(data.note)||data.note.length<1)return res
        for(let i=0;i<data.note.length;i++){
            let l1=data.note[i].split(':').filter(e=>e!='')
            let l2=l1[0].split(' ').filter(e=>e!='')
            let l3=l1[1].split('\n')
            index=l2[0]
            func=''
            for(let j=1;j<l2.length-2;j++){
                func+=l2[j]+' '
            }
            file=l2[l2.length-1]
            line=l3[0]
            res.push({
                index:index,
                func:func,
                file:file,
                line:line,
            })
        }
        return res
    },
    mapMemoryShowToList(data){
        let res=[]
        let addr=false
        let pos=false
        if(!(data.note)||data.note.length<1)return res
        for(let i=0;i<data.note.length;i++){
            let l1=data.note[i].split(':').filter(e=>e!='')
            let l2=l1[0].split(' ').filter(e=>e!='')
            addr=l2[0]
            pos=l2[1]
            let l3=l1[1].split('\n')[0]
            let l4=l3.split('\t').filter(e=>e!='')
            let each={
                addr:addr,
                pos:pos,
            }
            for(let j=0;j<l4.length;j++){
                each['p'+j]=l4[j]
            }
            res.push(each)
        }
        return res
    },
    mapLocalVarToList(data){
        let res=[]
        if(!(data.note)||data.note.length<2)return res
        let status='getLine'
        let index=false
        let addr=false
        let func=false
        let param=false
        let file=false
        let line=false
        let varList=false
        let i=0
        while(i<data.note.length){
            if(status=='getLine'){
                let l1=data.note[i].split(' ').filter(e=>e!='')
                index=l1[0]
                let l2=l1[l1.length-1].split('\n')[0].split(':')
                file=l2[0]
                line=l2[1]
                addr=l1.length-6>=1?l1[1]:'/'
                func=l1[l1.length-4]
                param=l1[l1.length-3]
                if(i+1>=data.note.length
                    || data.note[i+1].charAt(0)=='N'
                ){
                    i++
                    res.push({
                        index:index,
                        addr:addr,
                        func:func,
                        param:param,
                        file:file,
                        line:line,
                        varList:[],
                    })    
                }
                else{
                    varList=[]
                    status='getVal'
                }
            }
            else if(status=='getVal'){
                let l1=data.note[i].split(' ').filter(e=>e!='')
                let varName=l1[0]
                let varValue=''
                for(let j=2;j<l1.length;j++){
                    if(j!=2)varValue+=' '
                    varValue+=l1[j]
                }
                varList.push({
                    varName:varName,
                    varValue:varValue,
                })
                status='getNext'
            }
            else if(status=='getNext'){
                if(i+1>=data.note.length
                || data.note[i+1].charAt(0)!=' '){
                    res.push({
                        index:index,
                        addr:addr,
                        func:func,
                        param:param,
                        file:file,
                        line:line,
                        varList:varList,
                    })
                    status='getLine'
                }
                else{
                    status='getVal'
                }
            }
            i++
        }
        return res
    },
    mapExpersionToString(data){
        let res=''
        if(!data||!(data.note)||data.note.length<1)return res
        let l1=data.note[0].split(' ').filter(e=>e!='')
        for(let j=2;j<l1.length;j++){
            if(j>2)res+=' '
            res+=l1[j]
        }
        res=res.split('\n')[0]
        return res
    },
    mapBreakPointCreateToId(data){
        if(!data || !(data.object) ||(data.object.length<1))return null
        let object=data.object[0]

        if( !(object.content)||!(object.content.bkpt) || !(object.content.bkpt.number))return null
        return object.content.bkpt.number
    },
    mapDissassembleToMap(data){
        let res=new Map()
        if(!data || !(data.res) ||(data.res.length<1))return res
        data=data.res[0]
        if(!(data.content) || !(data.content.asm_insns))return res
        data=data.content.asm_insns
        if(!(data.length)||(data.length<2))return res
        for(let i=0;i<data.length;i++){
            let line=parseInt(data[i].line)
            let lineAsmInsnList=data[i].line_asm_insn
            let asmList=[]
            for(let each of lineAsmInsnList){
                asmList.push({
                    address:each.address,
                    funcName:each.func_name,
                    offset:each.offset,
                    inst:each.inst,
                })
            }
            res.set(line,asmList)
        }
        return res
    },
}


