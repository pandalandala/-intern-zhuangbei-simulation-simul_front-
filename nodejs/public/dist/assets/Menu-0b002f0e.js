import{_ as e,r as a,o as t,c as n,w as i,a as r,b as o,d as m,F as s,g as l,t as p}from"./index-c99164bd.js";const u={framework:{menu_100:{icon:"profile",title:"通信",pageName:"FrameworkSocketIpc",params:{}},menu_101:{icon:"profile",title:"http服务",pageName:"FrameworkSocketHttpServer",params:{}},menu_102:{icon:"profile",title:"socket服务",pageName:"FrameworkSocketSocketServer",params:{}},menu_103:{icon:"profile",title:"json数据库",pageName:"FrameworkJsonDBIndex",params:{}},menu_104:{icon:"profile",title:"sqlite数据库",pageName:"FrameworkSqliteDBIndex",params:{}},menu_105:{icon:"profile",title:"任务",pageName:"FrameworkJobsIndex",params:{}},menu_106:{icon:"profile",title:"自动更新",pageName:"FrameworkUpdaterIndex",params:{}},menu_107:{icon:"profile",title:"软件调用",pageName:"FrameworkSoftwareIndex",params:{}},menu_108:{icon:"profile",title:"java",pageName:"FrameworkJavaIndex",params:{}},menu_109:{icon:"profile",title:"测试",pageName:"FrameworkTestApiIndex",params:{}}},os:{menu_100:{icon:"profile",title:"文件",pageName:"OsFileIndex",params:{}},menu_101:{icon:"profile",title:"视图",pageName:"OsWindowViewIndex",params:{}},menu_102:{icon:"profile",title:"窗口",pageName:"OsWindowIndex",params:{}},menu_103:{icon:"profile",title:"桌面通知",pageName:"OsNotificationIndex",params:{}},menu_104:{icon:"profile",title:"电源监控",pageName:"OsPowerMonitorIndex",params:{}},menu_105:{icon:"profile",title:"屏幕信息",pageName:"OsScreenIndex",params:{}},menu_106:{icon:"profile",title:"系统主题",pageName:"OsThemeIndex",params:{}},menu_110:{icon:"profile",title:"图片",pageName:"OsFilePic",params:{}}},hardware:{menu_100:{icon:"profile",title:"打印机",pageName:"HardwarePrinterIndex",params:{}}},effect:{menu_100:{icon:"profile",title:"视频播放器",pageName:"EffectVideoIndex",params:{}},menu_110:{icon:"profile",title:"登录",pageName:"EffectLoginIndex",params:{}}},cross:{menu_100:{icon:"profile",title:"go服务",pageName:"CrossGoIndex",params:{}}}};const c=e({props:{id:{type:String,default:""}},data:()=>({menu:{},current:"menu_100",keys:[]}),watch:{id:function(){console.log("watch id ----- ",this.id),this.current="menu_100",this.menuHandle()}},created(){},mounted(){this.menuHandle()},methods:{menuHandle(){console.log("menu ------ id:",this.id),this.menu=u[this.id];const e=this.menu[this.current];this.$router.push({name:e.pageName,params:e.params})},changeMenu(e){console.log("changeMenu e:",e),this.current=e.key}}},[["render",function(e,u,c,d,f,g){const _=a("router-link"),h=a("a-menu-item"),N=a("a-menu"),k=a("a-layout-sider"),w=a("router-view"),x=a("a-layout-content"),I=a("a-layout");return t(),n(I,{id:"app-menu"},{default:i((()=>[r(k,{theme:"light",class:"layout-sider"},{default:i((()=>[r(N,{theme:"light",mode:"inline",selectedKeys:[f.current],onClick:g.changeMenu},{default:i((()=>[(t(!0),o(s,null,m(f.menu,((e,a)=>(t(),n(h,{key:a},{default:i((()=>[r(_,{to:{name:e.pageName,params:e.params}},{default:i((()=>[l("span",null,p(e.title),1)])),_:2},1032,["to"])])),_:2},1024)))),128))])),_:1},8,["selectedKeys","onClick"])])),_:1}),r(I,null,{default:i((()=>[r(x,null,{default:i((()=>[r(w)])),_:1})])),_:1})])),_:1})}],["__scopeId","data-v-cb2fcd1f"]]);export{c as default};
