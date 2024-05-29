<template>
    <div>
        <div
        class="__function_button_container"
        >
            <div
            class="__function_button"
            v-for="(value,key,index) in functionButtonData"
            @click="functionButtonClickHandler(key)"
            >
                <img
                class="__icon_img"
                :src="this.svgNamePathMap(value[1])" 
                alt="">
                {{value[0]}}
            </div>
        </div>
    </div>
</template>
<script>
    import svgImageSet from './resource/svg/svgImporter'
    import  eventBus  from './utils/eventBus'
    import gdbManager from './utils/gdbManager'
    export default{
        data(){
            return{
                functionButtonData:{
                    run:['执行','play_solid'],
                    continue:['继续','pause_solid'],
                    stop:['停止','stop_solid'],
                    sil:['单步进入','turn_down_solid'],
                    sol:['单步跳过','share_solid'],
                    sfl:['单步跳出','rotate_left_solid'],
                    sni:['单指令进入','right_to_bracket_solid'],
                    soi:['单指令跳过','share_from_square_solid'],
                    disassembly:['反汇编','floppy_disk_solid'],
                },
            }
        },
        methods:{
            svgNamePathMap(svgName){
                return svgImageSet[svgName]
            },
            async beforeRunDeal(){
                let res
                //update breakpoints status(add/remove)
                res=await new Promise((resolve,reject)=>{
                    eventBus.send(
                        eventBus.roleName.HEAD_FRAME,
                        eventBus.roleName.MONACO_EDITOR,
                        eventBus.eventName.UPDATE_BREAKPOINTS_STATUS,
                        {data:res,callback:()=>resolve()}
                    )
                })
            },
            async runResultDeal(res){
                if(!res.status||res.status.length<1)return
                res=res.status[res.status.length-1]
                if(!(res.content.frame)){
                    console.log('end\n!')
                    res=await new Promise((reslove,reject)=>{
                        eventBus.send(
                            eventBus.roleName.HEAD_FRAME,
                            eventBus.roleName.MONACO_EDITOR,
                            eventBus.eventName.CHANGE_CURRENT_LINE,
                            {
                                path:null,
                                line:null,
                                addr:null,
                                callback:()=>{reslove()}
                            }
                        )
                    })
                    return
                }
                let frame=res.content.frame
                let path=frame.fullname?frame.fullname.replaceAll('\\','/'):null
                let line=frame.line?parseInt(frame.line):null
                let addr=frame.addr?frame.addr:null
                if(path!=null && line!=null){
                    res=await new Promise((reslove,reject)=>{
                        eventBus.send(
                            eventBus.roleName.HEAD_FRAME,
                            eventBus.roleName.MONACO_EDITOR,
                            eventBus.eventName.CHANGE_CURRENT_LINE,
                            {
                                path:path,
                                line:line,
                                addr:addr,
                                callback:()=>{reslove()}
                            }
                        )
                    })
                }
                //update reg
                res=await gdbManager.exec('info reg')
                eventBus.send(
                    eventBus.roleName.HEAD_FRAME,
                    eventBus.roleName.WATCH_FRAME,
                    eventBus.eventName.SEND_REG_DATA,
                    gdbManager.mapRegistersToList(res)
                )
                //update call stack
                res=await gdbManager.exec('backtrace')
                eventBus.send(
                    eventBus.roleName.HEAD_FRAME,
                    eventBus.roleName.WATCH_FRAME,
                    eventBus.eventName.SEND_CALL_STACK_DATA,
                    gdbManager.mapCallStackToList(res)
                )
                //update memory show
                res=await new Promise((resolve,reject)=>{
                    eventBus.send(
                        eventBus.roleName.HEAD_FRAME,
                        eventBus.roleName.WATCH_FRAME,
                        eventBus.eventName.UPDATE_MEMORY_SHOW_DATA,
                        {callback:()=>{resolve()}}
                    )
                })
                //update expersion
                res=await new Promise((resolve,reject)=>{
                    eventBus.send(
                        eventBus.roleName.HEAD_FRAME,
                        eventBus.roleName.WATCH_FRAME,
                        eventBus.eventName.UPDATE_EXPERSION_DATA,
                        {callback:()=>{resolve()}}
                    )
                })
                res=await gdbManager.exec('info breakpoints')
                res=gdbManager.mapBreakpointsToList(res)
                //deal breakpoints show
                eventBus.send(
                    eventBus.roleName.HEAD_FRAME,
                    eventBus.roleName.WATCH_FRAME,
                    eventBus.eventName.SEND_BREAKPOINTS_DATA,
                    res
                )
                
                //update local var
                res=await gdbManager.exec('bt full')
                eventBus.send(
                    eventBus.roleName.HEAD_FRAME,
                    eventBus.roleName.WATCH_FRAME,
                    eventBus.eventName.SEND_LOCAL_VAR_DATA,
                    gdbManager.mapLocalVarToList(res)
                )
                

            },
            async stop(){
                let res;
                res=await gdbManager.exec('interrupt')
                res=await gdbManager.exec('info inferiors')
                res=await gdbManager.exec('kill inferiors '+gdbManager.mapInferiorsToId(res))
                res=await new Promise((reslove,reject)=>{
                    eventBus.send(
                        eventBus.roleName.HEAD_FRAME,
                        eventBus.roleName.MONACO_EDITOR,
                        eventBus.eventName.CHANGE_CURRENT_LINE,
                        {
                            path:null,
                            line:null,
                            addr:null,
                            callback:()=>{reslove()}
                        }
                    )
                })
            },
            async functionButtonClickHandler(key){
                if(key=='run'){
                    let res=false
                    res=await new Promise((resolve,reject)=>{
                        eventBus.send(
                            eventBus.roleName.HEAD_FRAME,
                            eventBus.roleName.FILE_TREE,
                            eventBus.eventName.GET_SELECT_FILE_PATH,
                            {callback:(data)=>{resolve(data)}}
                        )
                    })
                    console.log(res)
                    if(!res)return
                    res=await gdbManager.exec('file '+res)
                    res=await new Promise((resolve,reject)=>{
                        eventBus.send(
                            eventBus.roleName.HEAD_FRAME,
                            eventBus.roleName.COMMAND_LINE,
                            eventBus.eventName.CLEAR_OUT_PUT,
                            {callback:(data)=>{resolve(data)}}
                        )
                    })
                    res= await new Promise((resolve,reject)=>{
                        eventBus.send(
                            eventBus.roleName.HEAD_FRAME,
                            eventBus.roleName.MONACO_EDITOR,
                            eventBus.eventName.CLEAR_BREAKPOINT_BEFORE_RUN,
                            {callback:()=>{resolve()}}
                        )
                    })
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('run',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    
                    return
                }
                else if(key=='continue'){
                    let res;
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('continue',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    return
                }
                else if(key=='stop'){
                    this.stop()
                    return
                }
                else if(key=='sil'){
                    let res;
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('step',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    return
                }
                else if(key=='sol'){
                    let res;
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('next',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    return
                }
                else if(key=='sfl'){
                    let res;
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('finish',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    return
                }
                else if(key=='sni'){
                    let res;
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('si',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    return
                }
                else if(key=='soi'){
                    let res;
                    res=await this.beforeRunDeal()
                    res=await gdbManager.exec('ni',2)
                    console.log(res)
                    await this.runResultDeal(res[1])
                    return
                }
                else if(key=='disassembly'){
                    eventBus.send(
                        eventBus.roleName.HEAD_FRAME,
                        eventBus.roleName.MONACO_EDITOR,
                        eventBus.eventName.OPEN_DISASSEMBLY,
                        null
                    )
                }
            },
        },
        mounted(){
        },
    }
</script>
<style lang="less" scoped>
    .__function_button_container{
        margin-left: 80px;
        overflow-x: auto;
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
    .__function_button{
        color:white;
        text-align: center;
        margin-left: 20px;
        line-height: 350%;
        float:left;
    }
</style>