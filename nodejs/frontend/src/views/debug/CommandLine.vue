<template>
    <div>
        <el-tabs
        v-model="currentTabName"
        type="border-card"
        @tab-click="tabClickHandler"
        >
            <el-tab-pane
            v-for="(item,index) in tabDataList"
            :label="item.name"
            :name="item.id"
            :key="item.id"
            >
                <div v-for="(itemLine,indexLine) in output">
                    {{itemLine}}
                    <br>
                </div>                
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import gdbManager from './utils/gdbManager';
    import eventBus from './utils/eventBus';
    export default{
        data(){
            return{
                currentTabName:false,
                tabDataList:[
                    {id:'1',name:'输出',inputText:'',outputText:''}
                ],
                output:[],
            }
        },
        methods:{
        },
        mounted(){
            gdbManager.init()
            eventBus.bind({
                r:eventBus.roleName.COMMAND_LINE,
                n:[
                    {
                        r:eventBus.roleName.GDB,
                        n:[
                            {
                                m:eventBus.eventName.SHOW_OUTPUT_LINE,
                                h:(data)=>{
                                    this.output.push(data)
                                }
                            }
                        ]
                    },
                    {
                        r:eventBus.roleName.HEAD_FRAME,
                        n:[
                            {
                                m:eventBus.eventName.CLEAR_OUT_PUT,
                                h:(data)=>{
                                    this.output.length=0
                                    data.callback()
                                }
                            }
                        ]
                    }
                ]
            })
        },
    }
</script>
<style lang="less" scoped>
    .__base_frame(){
        min-height: 100%;
        float:left;
        overflow:auto;
    }
    
    @SpanHeight:10%;
    .__butt_area{
        min-height:1- @SpanHeight;
        min-width:100%;
        background-color: aqua;
    }
    .__top_span{
        height:@SpanHeight;
    }
</style>