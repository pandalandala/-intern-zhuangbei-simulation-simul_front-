<template>
    <div>
        <div
        class="__text_color_address"
        :style="{backgroundColor: isCurrentLine?'#ffbb00':'#e6f2f9'}"
        >{{address}}</div>
        <div
        class="__text_color_offset"
        :style="{backgroundColor: isCurrentLine?'#ffbb00':'#e6f2f9'}"
        >{{funcName+' + '+offset.toString()}}</div>
        <div
        class="__text_color_inst"
        :style="{backgroundColor: isCurrentLine?'#ffbb00':'#e6f2f9'}"
        >{{inst}}</div>
    </div>
</template>
<script>
    export default {
        props:{
            address:String,
            funcName:String,
            offset:String,
            inst:String,
            isCurrentLine:Boolean,
        }
    }
</script>
<style scoped lang="less">
    .__text_area_base(){
        line-height: 18px;
        background-color: #e6f2f9;
        float: left;
        display: inline;
        vertical-align: middle;
    }
    .__text_color_address{
        .__text_area_base();
        width: 25%;
        color: blue;
    }
    .__text_color_offset{
        .__text_area_base();
        width: 25%;
        color:purple;
    }
    .__text_color_inst{
        .__text_area_base();
        width: 50%;
        color: darkblue;
    }
</style>