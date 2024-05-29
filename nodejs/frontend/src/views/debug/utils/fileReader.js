const fs=require("fs")

export default{
    filePathResource:'./frontend/src/views/effect/debug/resource/',

    getCurrentDir(){
        console.log(process.cwd())
    },
    listDir(path){
        var stat=fs.statSync(path)
        if(!(stat.isDirectory())){
            console.log('is not a dic!')
            return
        }
        fs.readdir(path,(err,fileList)=>{
            if(err){
                console.error('file-list-err',err)
                return
            }
            fileList.forEach((file)=>{
                console.log(file)
            })
            console.log()
        })
    },
    listCurrentDir(){
        this.listDir('.')
    },
    listResourceDir(){
        this.listDir(this.filePathResource)
    },
    readResource(fileName){
        return fs.readFileSync(this.filePathResource+fileName,'utf-8')
    },
    buildFileTree(path,fileName){
        let res={
            label:fileName,
            children:[],
            nodePath:''    
        }
        path=path+'/'+fileName
        res.nodePath=path
        let stat=fs.statSync(path)
        if(!(stat.isDirectory())){
            return res
        }
        let dicList=fs.readdirSync(path)
        for(let each of dicList){
            res.children.push(this.buildFileTree(path,each))
        }
        return res
    },
    isFile(path){
        var stat=fs.statSync(path)
        return stat.isFile()
    },
    readFile(path){
        return fs.readFileSync(path)
    },
    writeFile(path,text){
        fs.writeFileSync(path,text)
    }

}