<template>
    <div>
        <div class="__function_button_container">
            <div class="__function_button"
            v-for="(value,key,index) in functionButtonData"
            @click="functionButtonClickHandler(key)"
            >
                <img class="__icon_img"
                :src="this.svgNamePathMap(value[1])" 
                alt="">{{value[0]}}
                <br v-if="(index+1)%4==0">
            </div>
        </div>
        <input type="file" v-show="false"
        id="__unshow_file_input" @change="triggerFile"
        webkitdirectory directory
        />
        <div class="__file_tree_list"
        >
            <el-tree 
            :data="fileTreeData"
            :props="{
                children: 'children',
                label: 'label',
            }"
            @node-click="nodeClickHandler"
            ></el-tree>
        </div>
    </div>
</template>
<script>
    import fileReader from './utils/fileReader'
    import svgImageSet from './resource/svg/svgImporter'
    import eventBus from './utils/eventBus'
    import gdbManager from './utils/gdbManager'

    let selectedDir=false
    let selectTreeNodePath=false
    let selectNodeName=false
    let currentFilePath=false
    let monoEditorIdGenerator=0
    let textInitBuffer=[]
    export default{
        name:'FileTree',
        data(){
            return{
                fileTreeData:[],
                functionButtonData:{
                    load:['载入','file_circle_plus_solid'],
                    fresh:['刷新','rotate_left_solid'],
                    open:['打开','folder_solid'],
                    save:['保存','file_solid'],
                    
                },
                eventStruct:{
                    r:eventBus.roleName.FILE_TREE,
                    n:[
                        {
                            r:eventBus.roleName.HEAD_FRAME,
                            n:[
                                {
                                    m:eventBus.eventName.GET_SELECT_FILE_PATH,
                                    h:(data)=>{
                                        if(!(fileReader.isFile(selectTreeNodePath)))return false
                                        console.log('cfp:',selectTreeNodePath)
                                        data.callback(selectTreeNodePath)
                                    }
                                }
                            ]
                        },
                    ]
                },
            }
        },
        methods:{
            svgNamePathMap(svgName){
                return svgImageSet[svgName]
            },
            
            triggerFile(event) {
                let filePath=event.target.files[0].path
                filePath=filePath.replaceAll('\\','/')
                let relPath=event.target.files[0].webkitRelativePath
                relPath=relPath.replaceAll('\\','/')
                let path=filePath.split('/'+relPath)[0]
                let file=relPath.split('/')[0]
                selectedDir={
                    file:file,
                    path:path,
                }
                this.fileTreeDataLoad()
            },
            fileTreeDataLoad(){
                console.log(selectedDir)
                if(!selectedDir)return
                this.fileTreeData.length=0
                this.fileTreeData.push(
                    fileReader.buildFileTree(
                        selectedDir.path,
                        selectedDir.file,
                    )
                )
            },
            nodeClickHandler(data){
                selectTreeNodePath=data.nodePath
                selectNodeName=data.label
                console.log(selectTreeNodePath)
            },
            functionButtonClickHandler(buttonName){
                console.log('click',buttonName)
                if(buttonName=='load'){
                    if (!(selectTreeNodePath))return
                    if(!(fileReader.isFile(selectTreeNodePath)))return
                    currentFilePath=selectTreeNodePath
                    let data={
                        name:selectNodeName,
                        path:selectTreeNodePath,
                        text:fileReader.readFile(selectTreeNodePath).toString(),
                        language:'c',
                    }
                    eventBus.send(
                        eventBus.roleName.FILE_TREE,
                        eventBus.roleName.INDEX_PAGE,
                        eventBus.eventName.CREATE_TAB,
                        data
                    )
                    console.log('send-over')
                    return
                }
                if(buttonName=='fresh'){
                    if(!selectedDir)return
                    this.fileTreeDataLoad()
                    return
                }
                if(buttonName=='open'){
                    document.querySelector('#__unshow_file_input').click()
                    return
                }
                if(buttonName=='save'){
                    if(!(fileReader.isFile(currentFilePath)))return
                    console.log('save-start.')
                    //copy to avoid change frame during save.
                    
                    eventBus.send(
                        eventBus.roleName.FILE_TREE,
                        eventBus.roleName.MONACO_EDITOR,
                        eventBus.eventName.GET_TEXT_REQUEST,
                        //call back function
                        {
                            callback:(dataCallBack)=>{
                                console.log(dataCallBack)
                                fileReader.writeFile(dataCallBack.path,dataCallBack.text)
                                console.log('save-end.')
                            }
                        }
                    )
                    
                }
            },
            

        },
        mounted(){
            eventBus.bind(this.eventStruct)
        },
        unmounted(){
            eventBus.unbind(this.eventStruct)
        },
    }
</script>
<style lang="less" scoped>
    @FuncButtonContainerHeightRate:10%;
    .__function_button_container{
        height:@FuncButtonContainerHeightRate;
        min-width: 1000%;
        background-color: #1b4e37;
        line-height: 250%;
        flex-wrap: nowrap;

    }
    
    .__file_tree_list{
        // height:1 - @FuncButtonContainerHeightRate;
        min-width: 1000%;
        float: left;
    }
    .__file_tree_contain{
        height:1 - @FuncButtonContainerHeightRate;
        min-width: 1000%;
        float: left;
    }
    .__function_button{
        float: left;
        margin-left: 5px;
        color:white;

    }
    .__icon_img{
        // remove the src svg,then show its shadow to change color.
        @InfinityDistance:10000000px;
        color:white;
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-left: 5px;
        margin-right: 5px;
        filter: drop-shadow(white @InfinityDistance 0);
		transform: translateX(0px - @InfinityDistance);
    }
    

</style>