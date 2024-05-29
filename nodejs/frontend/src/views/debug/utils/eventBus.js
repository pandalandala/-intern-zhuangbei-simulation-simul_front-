import mitt from 'mitt'
    const bus=mitt()

    function getEventName(from,to,method){
        return from+'__'+to+'__'+method
    }


export default {
    send:function(from,to,method,data){
        bus.emit(getEventName(from,to,method),data)
    },
    recv:function(from,to,method,handler){
        bus.on(getEventName(from,to,method),handler)
    },
    remove:function(from,to,method,handler){
        bus.off(getEventName(from,to,method),handler)
    },
    /**
     * r:String
     * n:[{
     *   r:String
     *   n:[{
     *     m:String
     *     h:function
     *   },...]
     * },...]
     * 
     */
    bind:function(bindData){
        for (let fromData of bindData.n){
            for(let func of fromData.n){
                this.recv(fromData.r,bindData.r,func.m,func.h)
            }
        }
    },
    unbind:function(bindData){
        for (let fromData of bindData.n){
            for(let func of fromData.n){
                this.remove(fromData.r,bindData.r,func.m,func.h)
            }
        }
    },
    roleName:{
        HEAD_FRAME:'__ROLE__HEAD_FRAME',
        MONACO_EDITOR:'__ROLE__MONACO_EDITOR',
        INDEX_PAGE:'__ROLE__INDEX_PAGE',
        FILE_TREE:'__ROLE__FILE_TREE',
        WATCH_FRAME:'__ROLE__WATCH_FRAME',
        COMMAND_LINE:'__ROLE__COMMAND_LINE',
        GDB:'__ROLE_GDB',
    },

    eventName:{
        SET_TEXT:'__EVENT_SET_TEXT',
        GET_TEXT_REQUEST:'__EVENT_GET_TEXT_REQUEST',
        GET_TEXT_RESOPNSE:'__EVENT_GET_TEXT_RESPONSE',
        CREATE_TAB:'__EVENT_CREATE_TAB',
        DESTORY_TAB:'__EVENT_DESTORY_TAB',
        GET_CURRENT_MODEL:'__EVENT_GET_CURRENT_MODEL',
        OPEN_FILE:'__EVENT_OPEN_FILE',
        CLOSE_FILE:'__EVENT_CLOSE_FILE',
        CHANGE_FILE:'__EVENT_CHANGE_FILE',
        GET_BREAKPOINT_LINE:'__EVENT_GET_BREAKPOINT_LINE',
        SET_BREAKPOINT_BATCH:'__EVENT_SET_BREAKPOINT_BATCH',
        GET_CURRENT_FILE_PATH:'__EVENT_GET_SELECT_FILE_PATH',
        SHOW_OUTPUT_LINE:'__SHOW_OUTPUT_LIEN',
        CLEAR_OUT_PUT:'__CLEAR_OUT_PUT',
        CHANGE_CURRENT_LINE:'__CHANGE_CURRENT_LINE',
        SEND_REG_DATA:'__SEND_REG_DATA',
        SEND_CALL_STACK_DATA:'__SEND_CALL_STACK_DATA',
        UPDATE_MEMORY_SHOW_DATA:'__UPDATE_MEMORY_SHOW_DATA',
        UPDATE_EXPERSION_DATA:'__UPDATE_EXPERSION_DATA',
        SEND_BREAKPOINTS_DATA:'__SEND_BREAKPOINTS_DATA',
        UPDATE_BREAKPOINTS_STATUS:'__UPDATE_BREAKPOINTS_STATUS',
        SEND_LOCAL_VAR_DATA:'__SEND_LOCAL_VAR_DATA',
        OPEN_DISASSEMBLY:'__OPEN_DISASSEMBLY',
        CLEAR_BREAKPOINT_BEFORE_RUN:'__CLEAR_BREAKPOINT_BEFORE_RUN',
    }
}