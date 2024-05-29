<template>
    <div>
        <el-collapse 
        v-model="activeNameListt"
        @change="collapseChangeHandler">
            <el-collapse-item 
            title="寄存器"
            name="reg"
            class="__title_collapse"
            >
                <div
                class="__content_collapse"
                >
                    <el-table
                    :data="regDataList"
                    style="width:100%"
                    :cell-style="regTableCellStyle"
                    >
                        <el-table-column prop="name" label="寄存器"/>
                        <el-table-column prop="valHex" label="十六进制"/>
                        <el-table-column prop="val" label="值"/>
                    </el-table>
                </div>
            </el-collapse-item>
            <el-collapse-item 
            title="函数栈"
            name="functionStack"
            class="__title_collapse"
            >
                <div
                class="__content_collapse"
                >
                    <el-table
                    :data="callStackDataList"
                    style="width:100%"
                    >
                        <el-table-column prop="index" label="序号"/>
                        <el-table-column prop="func" label="函数"/>
                        <el-table-column prop="file" label="源代码文件"/>
                        <el-table-column prop="line" label="源代码行"/>
                    </el-table>
                </div>
            </el-collapse-item>
            <el-collapse-item 
            title="局部变量"
            name="localVar"
            class="__title_collapse"
            >
                <div
                class="__content_collapse"
                >
                    <el-table
                    :data="loaclVarDataList"
                    style="width:100%"
                    >
                        <el-table-column type="expand">
                            <template #default="props">
                                <el-table
                                :data="props.row.varList"
                                >
                                    <el-table-column prop="varName" label="变量名"/>
                                    <el-table-column prop="varValue" label="变量值"/>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="index" label="序号"/>
                        <el-table-column prop="addr" label="作用域地址"/>
                        <el-table-column prop="func" label="作用域函数"/>
                        <el-table-column prop="param" label="作用域函数的参数"/>
                        <el-table-column prop="file" label="源代码文件"/>
                        <el-table-column prop="line" label="源代码行"/>
                    </el-table>
                </div>
            </el-collapse-item>
            <el-collapse-item 
            title="内存"
            name="memory"
            class="__title_collapse"
            >
                <div
                class="__content_collapse"
                >
                    <el-collapse>
                        <el-collapse-item
                        class="__sub_title_collapse"
                        title="设置"
                        name="memory_setting"
                        >
                            <el-select v-model="memoryShowLengthRadioSelect"
                            placeholder="请选择每个数据的长度"
                            >
                                <el-option
                                v-for="(item,index) in memoryShowLengthConstant" 
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-select v-model="memoryShowTypeRadioSelect"
                            placeholder="请选择数据的显示方式"
                            >
                                <el-option
                                v-for="(item,index) in memoryShowTypeConstant" 
                                :label="item.label"
                                :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <el-input 
                            v-model="memoryShowStartInput"
                            placeholder="请输入要查看的起始地址或函数名"
                            type="text"
                            />
                            <el-input 
                            v-model="memoryShowRangeInput"
                            placeholder="请输入要查看的数据数目"
                            type="text"
                            @input="(v)=>(memoryShowRangeInput=v.replace(/[^\d.]/g,''))"
                            />
                            <el-radio-group 
                            v-model="memoryShowAutoUpdateSelect"
                            style="display: inline;"
                            >
                                <el-radio-button label="true">启用自动刷新</el-radio-button>
                                <el-radio-button label="false">禁用自动刷新</el-radio-button>
                            </el-radio-group>
                            <el-button 
                            type="success"
                            style="margin-left: 10px;margin-top: 6.5px;"
                            @click="updateMemoryShow"
                            >立即访问
                            </el-button>
                        </el-collapse-item>
                    </el-collapse>
                    <el-table
                    :data="memoryShowDataList"
                    >
                        <el-table-column prop="addr" label="起始地址"/>
                        <el-table-column prop="pos" label="相对位置"/>
                        <el-table-column 
                        v-for="item of memoryShowDataLength"
                        :prop="'p'+(item-1)" :label="'+ '+(item-1)"/>
                    </el-table>
                </div>
            </el-collapse-item>
            <el-collapse-item 
            title="断点"
            name="breakpoint"
            class="__title_collapse"
            >
                <div
                class="__content_collapse"
                >
                    <el-table
                    :data="breakpointsDataList"
                    >
                        <el-table-column prop="index" label="GDB中序号"/>
                        <el-table-column prop="type" label="类型"/>
                        <el-table-column prop="disp" label="DISP"/>
                        <el-table-column prop="enb" label="是否启用"/>
                        <el-table-column prop="addr" label="地址"/>
                        <el-table-column prop="func" label="所在函数"/>
                        <el-table-column prop="file" label="源代码文件"/>
                        <el-table-column prop="line" label="源代码中行数"/>
                        <el-table-column prop="hitCount" label="命中次数"/>
                    </el-table>
                </div>
            </el-collapse-item>
            <el-collapse-item 
            title="表达式"
            name="experssion"
            class="__title_collapse"
            >
                <div
                class="__content_collapse"
                >
            
                    <el-collapse>
                        <el-collapse-item
                        class="__sub_title_collapse"
                        title="配置"
                        name="experssion_setting"
                        >
                            <el-select 
                            v-model="expersionTypeRadioSelect"
                            placeholder="请选择数据的显示方式"
                            >
                                <el-option
                                v-for="(item,index) in memoryShowTypeConstant" 
                                :label="item.label"
                                :value="item.value"
                                >
                                </el-option>
                            </el-select>
                            <el-select 
                            v-model="expersionAreaRadioSelect"
                            placeholder="请选择表达式的作用域"
                            type="text"
                            >
                                <el-option
                                label="全 局"
                                :value="''"
                                />
                                <el-option
                                v-for="(item,index) in loaclVarDataList" 
                                :label="item.func"
                                :value="item.func+'::'"
                                />
                            </el-select>
                            <el-input 
                            v-model="expersionInput"
                            placeholder="请输入表达式"
                            type="text"
                            />
                            <el-radio-group 
                            v-model="expersionAutoUpdateSelect"
                            style="display: inline;"
                            >
                                <el-radio-button label="true">启用自动刷新</el-radio-button>
                                <el-radio-button label="false">禁用自动刷新</el-radio-button>
                            </el-radio-group>
                            <el-button 
                            type="primary"
                            style="margin-left: 10px;margin-top: 6.5px;"
                            @click="createExpersion"
                            >新建表达式
                            </el-button>
                            <el-button 
                            type="success"
                            style="margin-left: 10px;margin-top: 6.5px;"
                            @click="updateExpersion"
                            >立即访问所有表达式
                            </el-button>
                        </el-collapse-item>
                    </el-collapse>
                    <el-table
                    :data="expersionDataList"
                    >
                        <el-table-column prop="name" label="表达式名"/>
                        <el-table-column prop="val" label="表达式值"/>
                        <el-table-column prop="method" label="操作">
                            <template #default="scope">
                                <el-button size="small"
                                @click="deleteExpersion(scope.row.index)"
                                type="danger"
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<script>
    import eventBus from './utils/eventBus'
    import gdbManager from './utils/gdbManager'
    
    export default{
        data(){
            return{
                activeNameListt:[],
                regDataList:[],
                callStackDataList:[],
                memoryShowLengthRadioSelect:'w',
                memoryShowTypeRadioSelect:'x',
                memoryShowLengthConstant:[
                    {label:'单字节',value:'b'},
                    {label:'双字节',value:'h'},
                    {label:'四字节',value:'w'},
                    {label:'八字节',value:'g'},
                ],
                memoryShowTypeConstant:[
                    {label:'十六进制',value:'x'},
                    {label:'十进制',value:'d'},
                    {label:'无符号',value:'u'},
                    {label:'八进制',value:'o'},
                    {label:'二进制',value:'t'},
                    {label:'地址',value:'a'},
                    {label:'指令',value:'i'},
                    {label:'字符',value:'c'},
                    {label:'浮点数',value:'f'},
                ],
                memoryShowRangeInput:'20',
                memoryShowStartInput:'main',
                memoryShowAutoUpdateSelect:'true',
                memoryShowDataList:[],
                memoryShowDataLength:0,
                breakpointsDataList:[],
                loaclVarDataList:[],
                expersionTypeRadioSelect:'x',
                expersionAreaRadioSelect:'',
                expersionInput:'',
                expersionDataList:[],
                expersionAutoUpdateSelect:'true',
                eventStruct:{
                    r:eventBus.roleName.WATCH_FRAME,
                    n:[
                        {
                            r:eventBus.roleName.HEAD_FRAME,
                            n:[
                                {
                                    m:eventBus.eventName.SEND_REG_DATA,
                                    h:(data)=>{
                                        this.updateRegData(data)
                                    }
                                },
                                {
                                    m:eventBus.eventName.SEND_CALL_STACK_DATA,
                                    h:(data)=>{
                                        this.callStackDataList.length=0
                                        for(let i=0;i<data.length;i++){
                                            this.callStackDataList.push(data[i])
                                        }
                                    }
                                },
                                {
                                    m:eventBus.eventName.UPDATE_MEMORY_SHOW_DATA,
                                    h:async (data)=>{
                                        if(this.memoryShowAutoUpdateSelect!='false'){ 
                                            await this.updateMemoryShow()
                                        }
                                        data.callback()
                                    }
                                },
                                {
                                    m:eventBus.eventName.UPDATE_EXPERSION_DATA,
                                    h:async (data)=>{
                                        if(this.expersionAutoUpdateSelect!='false'){
                                            await this.updateExpersion()
                                        }
                                        data.callback()
                                    }
                                },
                                {
                                    m:eventBus.eventName.SEND_BREAKPOINTS_DATA,
                                    h:(data)=>{
                                        this.breakpointsDataList.length=0
                                        for(let i=0;i<data.length;i++){
                                            this.breakpointsDataList.push(data[i])
                                        }
                                    }
                                },
                                {
                                    m:eventBus.eventName.SEND_LOCAL_VAR_DATA,
                                    h:(data)=>{
                                        this.loaclVarDataList.length=0
                                        for(let i=0;i<data.length;i++){
                                            this.loaclVarDataList.push(data[i])
                                        }
                                    }
                                },
                            ]
                        },
                    ]
                }
            }
        },
        methods:{
            collapseChangeHandler(){

            },
            regTableCellStyle({ row, column, rowIndex, columnIndex }) {
                if (row.isNew) {
                    return {'color':'red'}
                }
                return {};
            },
            updateRegData(dataList){
                for(let i=0;i<dataList.length && i<this.regDataList.length;i++){
                    if(dataList[i].name!=this.regDataList[i].name){
                        dataList[i].isNew=true
                    }
                    else if(dataList[i].valHex!=this.regDataList[i].valHex){
                        dataList[i].isNew=true
                    }
                    else if(dataList[i].val!=this.regDataList[i].val){
                        dataList[i].isNew=true
                    }
                    else dataList[i].isNew=false
                }
                this.regDataList.length=0
                for(let i=0;i<dataList.length;i++){
                    this.regDataList.push(dataList[i])
                }
            },
            async updateMemoryShow(){
                let command='x/'
                command+=this.memoryShowRangeInput
                command+=this.memoryShowTypeRadioSelect
                command+=this.memoryShowLengthRadioSelect
                command+=' '+this.memoryShowStartInput
                let res=false
                res=await gdbManager.exec(command)
                res=gdbManager.mapMemoryShowToList(res)
                switch(this.memoryShowLengthRadioSelect){
                    case 'b':this.memoryShowDataLength=8;break;
                    case 'h':this.memoryShowDataLength=8;break;
                    case 'w':this.memoryShowDataLength=4;break;
                    case 'g':this.memoryShowDataLength=2;break;
                    default:this.memoryShowDataLength=0;
                }
                this.memoryShowDataList.length=0
                for(let i=0;i<res.length;i++){
                    this.memoryShowDataList.push(res[i])
                }
            },
            createExpersion(){
                let command='p/'
                command+=this.expersionTypeRadioSelect
                command+=' '+this.expersionAreaRadioSelect
                command+=this.expersionInput
                this.expersionDataList.push({
                    index:this.expersionDataList.length,
                    command:command,
                    name:this.expersionInput,
                    val:null,
                })
                if(this.expersionAutoUpdateSelect=='false')return
                this.updateExpersion()
            },
            deleteExpersion(index){
                let tmp=[]
                for(let i=index+1;i<this.expersionDataList.length;i++){
                    this.expersionDataList[i].index=i-1
                    tmp.push(this.expersionDataList[i])
                }
                this.expersionDataList.length=index;
                for(let each of tmp){
                    this.expersionDataList.push(each)
                }
            },
            async updateExpersion(){
                for(let each of this.expersionDataList){
                    let res=await gdbManager.exec(each.command)
                    res=gdbManager.mapExpersionToString(res)
                    each.val=res
                }
            },
            async updateDisassembly(){
                let command='disassemble'
                command+=this.disassemblyFuncSelect
                let res=await gdbManager.exec(command)
                res= gdbManager.mapDisassembleToText(res)
                eventBus.send(
                    eventBus.roleName.WATCH_FRAME,
                    eventBus.roleName.MONACO_EDITOR,
                    eventBus.eventName.CHANGE_DISASSEMBLY_DATA,
                    res
                )
            },
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
    :deep(.__title_collapse .el-collapse-item__header) {
        padding-left: 10px;
        font-size: large;
        font-weight: bold;
    }
    :deep(.__sub_title_collapse .el-collapse-item__header) {
        padding-left: 10px;
        font-size: medium;
        font-weight: bold;
        color:rgb(0, 95, 204);
    }
    .__content_collapse{
        text-align: left;
        width: 100%;
        max-height: 50%;
        overflow: auto;
    }
    :deep(.__content_collapse .el-table__cell){
        font-family: monospace;
    }
</style>