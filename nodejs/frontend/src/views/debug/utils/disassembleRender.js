import { createApp } from 'vue';
import { h } from 'vue';
import DisassembleInst from '../DisassembleInst.vue';


export default{
    async addViewZone(editor,data,line,index){
        let viewZoneId=null
        await editor.changeViewZones((changeAccessor)=> {
            var domNode = document.createElement("div");
            const VIEW_ZONE_ID='__disassemble_view_zone_'+line+'_'+index
            domNode.setAttribute('id',VIEW_ZONE_ID);
            let app=createApp({
                render(){
                    return h(
                        DisassembleInst,
                        data
                    )
                }
            })
            viewZoneId = changeAccessor.addZone({
                afterLineNumber: line,
                heightInLines: 1,
                domNode: domNode,
            })
            app.mount('#'+VIEW_ZONE_ID)
        })
        return viewZoneId
    },
    async removeViewZone(editor,id){
        await editor.changeViewZones((changeAccessor)=> {
            changeAccessor.removeZone(id);
        })
    }
}