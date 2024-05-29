# 写svg的配置太累了！我写个脚本自动生成一下。
# 必须在svg当前目录启动运行。

import os
import re

def generateEach(fileName):
    fileNameTrans=fileName.replace('-','_')
    return [
        'import '+fileNameTrans+' from \'./'+fileName+'.svg?url\'\n',
        fileNameTrans+':'+fileNameTrans,
    ]

def generateMerge(resTmp):
    res=''
    for each in resTmp:
        res+=each[0]
    res+='export default{\n'
    for i in range(len(resTmp)):
        res+='\t'+resTmp[i][1]+',\n'
    res+='}\n'
    return res

def generate():
    allFileList=os.listdir()
    pattern=re.compile(r'^(.*)\.svg$')
    patternFileName=re.compile(r'^[^\.]*')
    
    resTmp=[]
    for eachFileName in allFileList:
        matchRes=pattern.match(eachFileName)
        if matchRes is None:continue
        fileName=patternFileName.match(eachFileName).group()
        resTmp.append(generateEach(fileName))
    if resTmp is None or len(resTmp)<=0:return

    res=generateMerge(resTmp)
    with open('./svgImporter.js','w',encoding='utf-8') as f:
        f.write(res)
        f.flush()
    return
if __name__=='__main__':
    generate()