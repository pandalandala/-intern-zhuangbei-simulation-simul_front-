<template>
    <div class="monaco-box">
        <HeadFrame
        class="__head_frame"
        />
        <FileTree
        class="__file_tree_frame"
        />
        <div class="__monaco_editor_frame">
            <el-tabs
            v-model="currentTabName"
            type='border-card' closable
            @tab-click="tabClickHandler"
            @tab-remove="tabRemoveHandler"
            >
                <el-tab-pane
                class="__unshow"
                v-for="(item,index) in tabDataList"
                :name="item.path"
                :key="item.path"
                :label="item.name"
                ></el-tab-pane>
                <el-tab-pane
                v-if="disassemblyEnable"
                :name="DISASSEMBLY_TYPE"
                :key="DISASSEMBLY_TYPE"
                label="反汇编界面"
                style="background-color: blue;"
                ></el-tab-pane>
            </el-tabs>
            <MonacoEditor
            class="__text_frame"
            />
            <CommandLine
            class="__command_frame"
            />
        </div>
        
        <WatchFrame
        class="__watch_frame"
        />
    </div>
</template>
<script>
    import MonacoEditor from './MonacoEditor.vue'
    import HeadFrame from './HeadFrame.vue'
    import FileTree from './FileTree.vue'
    import WatchFrame from './WatchFrame.vue'
    import commandLine from './commandLine.vue'
    import eventBus from './utils/eventBus'
    import CommandLine from './commandLine.vue'
    export default{
        name:"debugIndex",
        data(){
            return{
                /**
                 * {
                 *   path:String,
                 *   name:String,
                 * }
                 */
                tabDataList:[],
                currentTabName:false,
                disassemblyEnable:false,
                eventStruct:{
                    r:eventBus.roleName.INDEX_PAGE,
                    n:[
                        {
                            r:eventBus.roleName.FILE_TREE,
                            n:[
                                {
                                    m:eventBus.eventName.CREATE_TAB,
                                    h:(data)=>{
                                        for(let each of this.tabDataList){
                                            if(each.path==data.path){
                                                return
                                            }
                                        }
                                        this.tabDataList.push({
                                            path:data.path,
                                            name:data.name,
                                        })
                                        eventBus.send(
                                            eventBus.roleName.INDEX_PAGE,
                                            eventBus.roleName.MONACO_EDITOR,
                                            eventBus.eventName.OPEN_FILE,
                                            data
                                        )
                                        this.currentTabName=data.path
                                    }
                                },
                            ]
                        },
                    ]
                }
            }
        },
        methods:{
            tabClickHandler(target){
                console.log('tab-name',this.currentTabName)
                if(this.currentTabName==target.props.name)return
                eventBus.send(
                    eventBus.roleName.INDEX_PAGE,
                    eventBus.roleName.MONACO_EDITOR,
                    eventBus.eventName.CHANGE_FILE,
                    target.props.name
                )
            },
            tabRemoveHandler(tabName){
                let tmptabDataList=[]
                let findFlag=false
                for(let each of this.tabDataList){
                    if(each.path==tabName){
                        findFlag=true
                        continue
                    }
                    if(!findFlag){
                        this.currentTabName=each.path
                    }
                    tmptabDataList.push(each)
                }
                this.tabDataList.length=0
                for(let each of tmptabDataList){
                    this.tabDataList.push(each)
                }
                eventBus.send(
                    eventBus.roleName.INDEX_PAGE,
                    eventBus.roleName.MONACO_EDITOR,
                    eventBus.eventName.CLOSE_FILE,
                    tabName
                )
                eventBus.send(
                    eventBus.roleName.INDEX_PAGE,
                    eventBus.roleName.MONACO_EDITOR,
                    eventBus.eventName.CHANGE_FILE,
                    this.currentTabName
                )
            },
            
        },
        components:{
            MonacoEditor,
            HeadFrame,
            FileTree,
            WatchFrame,
            CommandLine
        },
        mounted(){
            eventBus.bind(this.eventStruct)
        },
        beforeUnmount(){
            eventBus.unbind(this.eventStruct)
        }
    }
</script>
<style lang="less" scoped>

    .__head_frame{
        height: 50px;
        width: 100%;
        text-align: left;
        background-color: #007bff;
        float:top;
    }

    @PageHeight:720px;
    .__base_frame(){
        height:@PageHeight;
        float:left;
        text-align: left;
        overflow:auto;
    }
    .__file_tree_frame{
        width:20%;
        .__base_frame();
        background-color: #f2d890;
    }
    .__monaco_editor_frame{
        width:50%;
        .__base_frame();
    }
    .__watch_frame{
        width:30%;
        .__base_frame();
        background-color: rgb(255, 255, 255);
        float:right;
    }
    .__text_frame{
        min-width:100%;
        height:70%;
        float:left;
    }
    .__command_frame{
        min-width: 100%;
        height:50%;
        float:left;
    }
    .__unshow{
        max-height:0px;
        max-width:0px;
    }
</style>
  