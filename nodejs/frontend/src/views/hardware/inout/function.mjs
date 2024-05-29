// const ffi = require('ffi-napi')
// const ref = require('ref-napi')
// const ArrayType = require('ref-array-di')(ref);
import ffi from "ffi-napi"
import reff from "ref-napi"
import refArrayDi from "ref-array-di";
const ArrayType=refArrayDi(reff)
const libm = ffi.Library("./data_interaction.dll", {
    'NIRT_GetBuildInfo': ['int', ['char*', 'int*']],
    'NIRT_InitializeModel': ['int', ['double', 'double*', 'int*', 'int*', 'int*']],
    'NIRT_GetModelSpec': ['int', ['char*', 'int*', 'double*', 'int*', 'int*', 'int*']],
    'NIRT_GetExtIOSpec': ['int', ['int', 'int*', 'char*', 'int*', 'int*', 'int*', 'int*']],
    'NIRT_Schedule': ['int', ['double*', 'double*', 'double*', 'int*']],
    'NIRT_ModelUpdate': ['int', []],
    'NIRT_FinalizeModel': ['int', []],
    'NIRT_GetModelFrameworkVersion': ['int', ['int*', 'int*', 'int*', 'int*']],
    'NIRT_GetErrorMessageLength': ['int', ['void']],
    'NIRT_ModelError': ['int', ['char*', 'int*']],
    'NIRT_TaskTakeOneStep': ['int', ['int']],
    'NIRT_ProbeSignals': ['int', ['int*', 'int', 'double*', 'int*']],
    'NIRT_SetScalarParameterInline': ['int', ['int', 'int', 'double']],
    'NIRT_SetVectorParameter': ['int', ['int', 'double*', 'int']],
    'NIRT_SetParameter': ['int', ['int', 'int', 'double']],
    'NIRT_GetParameter': ['int', ['int', 'int', 'double*']],
    'NIRT_GetVectorParameter': ['int', ['int', 'double*', 'int']],
    'NIRT_TaskRunTimeInfo': ['int', ['int', 'int*', 'int*']],
    'NIRT_GetSimState': ['int', ['int*', 'char*', 'double*', 'int*', 'char*', 'double*', 'int*', 'char*', 'int*']],
    'NIRT_SetSimState': ['int', ['double*', 'double*', 'int*']],
    'NIRT_GetModelSpec': ['int', ['char*', 'int*', 'double*', 'int*', 'int*', 'int*']],
    'NIRT_GetParameterIndices': ['int', ['int*', 'int*']],
    'NIRT_GetParameterSpec': ['int', ['int*', 'char*', 'int*', 'char*', 'int*', 'int*', 'int*', 'int*']],
    'NIRT_GetSignalSpec': ['int', ['int*', 'char*', 'int*', 'char*', 'int*', 'int*', 'char*', 'int*', 'int*', 'int*', 'int*']],
    'NIRT_GetTaskSpec': ['int', ['int', 'int*', 'double*', 'double*']],
    'NIRT_ModelStart': ['int', ['void']],
    // 'NIRT_PostOutputs':['int',['double*']],
})

export function getFunctionName(){
    //模型初始化
    const finaltime = 2;
    const outTimeStep = new Buffer.alloc(8) // 初始化一个无类型的指针
    outTimeStep.type = reff.types.double
    const num_in = new Buffer.alloc(4)
    num_in.type = reff.types.int32
    const num_out = new Buffer.alloc(4)
    num_out.type = reff.types.int32
    const numtasks = new Buffer.alloc(4)
    numtasks.type = reff.types.int32
    let initializeRes = libm.NIRT_InitializeModel(finaltime, outTimeStep, num_in, num_out, numtasks)
    if (initializeRes == 1) {
        console.log("模型初始化失败！")
    } else {
        console.log("模型初始化成功！")
        console.log("输入端口个数：" + num_in.deref())
        console.log("输出端口个数：" + num_out.deref())
        let functionName =new Array(2);
        functionName[0]=new Array(30);
        functionName[1]=new Array(30)
        //获取输入输出端口端口信息
        for (let index = 0; index < 60; index++) {
            const idx = new Buffer.alloc(4)
            idx.type = reff.types.int32
            //       const Name = ArrayType(ref.types.char,16)
            //       let name = new Name()
            //       name[0] = 'H';
            // name[1] = 'e';
            // name[2] = 'l';
            // name[3] = 'l';
            // name[4] = 'o';
            //       console.log(name.buffer.toString())
            const CharArray128 = ArrayType(reff.types.char, 128) // 申明char[100]类型CharArray100
            const bufferValue = Buffer.from('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx') // Hello World转换Buffer
            const strArray = [...bufferValue] //需要将`Buffer`转换成`Array`
            const name = reff.alloc(CharArray128, strArray)
            // const name = Buffer.alloc(128, 0); 
            const tid = new Buffer.alloc(4)
            tid.writeInt32LE(1, 0)
            tid.type = reff.types.int32
            const type = new Buffer.alloc(4)
            type.type = reff.types.int32
            // const dims=new Buffer.alloc(4*10)
            const Dims = ArrayType(reff.types.int32, 22)
            const dims = reff.alloc(Dims)
            const numdims = new Buffer.alloc(4)
            numdims.writeInt32LE(-1, 0)
            numdims.type = reff.types.int32
            let res = libm.NIRT_GetExtIOSpec(index, idx, name, tid, type, dims, numdims)
            if (index < 30) {
                console.log("输入端口" + index + "：" + name)
                functionName[0][index]=name
            } else {
                functionName[1][index-30]=name
                console.log("输出端口" + index + "：" + name)
            }
        }
        let finalizeRes = libm.NIRT_FinalizeModel();
        if (finalizeRes == 0) {
            console.log("释放模型成功！")
            return functionName
        } else {
            console.log("释放模型失败！")
        }
    }
}
//获取模型名称
// const Name=refArray(ref.types.char,1024)
// const name = new Name()
// const namelen=new Buffer.alloc(4)
// namelen.writeInt32LE(3, 0)
// namelen.type=ref.types.int32
// const baseTimeStep = new Buffer.alloc(8)
// baseTimeStep.type=ref.types.double
// const outNumInports=new Buffer.alloc(4)
// outNumInports.type=ref.types.int32
// const outNumOutports=new Buffer.alloc(4)
// outNumOutports.type=ref.types.int32
// const num_tasks=new Buffer.alloc(4)
// num_tasks.type=ref.types.int32
// libm.NIRT_GetModelSpec(name.ref(),namelen,baseTimeStep,outNumInports,outNumOutports,num_tasks)
// console.log(name.buffer.toString())
// console.log(namelen.deref())
// console.log(baseTimeStep.deref())
// console.log(outNumInports.deref())
// console.log(outNumOutports.deref())
// console.log(num_tasks.deref())

