// const functionn=require("./function")
import {getFunctionName} from './function.mjs'
let res=[2][30]
res=getFunctionName()
for(let i=0;i<30;i++){
    console.log(res[0][i].toString())
}
let str1="\""
for(let i=0;i<30;i++){
    str1=str1+res[1][i].toString()+"\",\""
    console.log(res[1][i].toString())
}
console.log(str1)
export default getFunctionName