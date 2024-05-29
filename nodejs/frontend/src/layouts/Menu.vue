<!-- 全局侧边栏 -->
<script setup>
import subMenu from "@/router/subMenu";
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

const menu = ref({});
const arrow = ref("el-icon-caret-right");
const current = ref("menu_100");
const keys = ref([]);
const dragConf = ref({
  isDown: false,
  isMove: false,
  offsetTop: 0,
  offsetLeft: 0,
  clientX: 0,
  clientY: 0,
  ele: null,
  info: null,
});
const router = useRouter();
const menuHandle = () => {
  const id = props.id;
  menu.value = subMenu[id];
  const linkInfo = menu.value[current.value];
  console.log(linkInfo);
  router.push({ name: linkInfo.pageName, params: linkInfo.params });
  console.log(router);
};
const changeMenu = (key, keypath) => {
  // if (props.id === "cross") {
    current.value = key;
    menuHandle();
  // }
};
const getSqliteRouter = () => {
  console.log("getSqliteRouter");
  ipc.invoke(ipcApiRoute.getAllTableNames).then((res) => {
    for (let i=0; i<res.length; i++) { 
      let table = res[i];
      console.log(table);
      let tableObj = {
        id: i+1,
        title: table.name,
        nodeItemList: []
      };
      ipc.invoke(ipcApiRoute.getTableFields, { tableName: table.name }).then((res) => {
        console.log(res);
        for (let i=0;i<res.length;i++) { 
          let field = res[i];
          console.log(field);
          let fieldObj = {
            label: field.name,
            value: {
              width: 120,
              height: 40,
              meta: {
                label: field.name,
                name: field.name,
              },
            },
          };
          tableObj.nodeItemList.push(fieldObj);
        }
      })
      subMenu.db.menu_100.children.push(tableObj);
    }
  });
  console.log(subMenu);
};

watch(
  () => props.id,
  () => {
    current.value = "menu_100";
    menuHandle();
  },
);
onMounted(() => {
  getSqliteRouter();
  menuHandle();
  nodeId.value = 0;
  document.addEventListener("mousemove", docMousemove);
  document.addEventListener("mouseup", docMouseup);
  //   $once("hook:beforeDestroy", () => {
  //   document.removeEventListener("mousemove", this.docMousemove);
  //   document.removeEventListener("mouseup", this.docMouseup);
  // })
});
const newNode = ref({
  id: 0,
  label: "123",
  position: {
    x: 100,
    y: 200,
  },
});
const nodeId = ref(0);
const equipName = ref("");
const docMousemove = ({ clientX, clientY }) => {
  const conf = dragConf.value;

  if (conf.isMove) {
    dragConf.value.ele.style.top = clientY - conf.offsetTop + "px";
    dragConf.value.ele.style.left = clientX - conf.offsetLeft + "px";
  } else if (conf.isDown) {
    // 鼠标移动量大于 5 时 移动状态生效
    dragConf.value.isMove =
      Math.abs(clientX - conf.clientX) > 5 ||
      Math.abs(clientY - conf.clientY) > 5;
  }
};
const docMouseup = ({ clientX, clientY }) => {
    const conf = dragConf.value;
    dragConf.value.isDown = false;

    if (conf.isMove) {
      const { top, right, bottom, left } =
        document.body.getBoundingClientRect();
      // 判断鼠标是否进入 flow container
      if (
        clientX > left &&
        clientX < right &&
        clientY > top &&
        clientY < bottom
      ) {
        // 获取拖动元素左上角相对 super flow 区域原点坐标
        const rect = document
          .getElementById("NodesContainer")
          .getBoundingClientRect();
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        Object.assign(newNode.value, {
          id: conf.info.meta.name + ":" + nodeId.value++,
          label: conf.info.meta.name,
          accept: conf.info.meta.accept,
          realName: conf.info.meta.realName,
          position: {
            x: mouseX,
            y: mouseY,
          },
          type: (conf.info.group === "虚拟网络端口" ? "table":"special"),
          data: {
            api: conf.info.api,
            style: {
              width: (conf.info.width == undefined ? 120 : conf.info.width)+"px",
              height: (conf.info.height == undefined ? 60 : conf.info.height)+"px",
              backgroundColor: (conf.info.bacColor == undefined ? "#fff" : conf.info.bacColor)
            },
          },
        });
      }
      console.log(newNode.value);
      conf.isMove = false;
    }

    if (conf.ele) {
      conf.ele.remove();
      conf.ele = null;
    }
  },
  nodeItemMouseDown = (evt, info) => {
    const { clientX, clientY, currentTarget } = evt;

    const { top, left } = evt.currentTarget.getBoundingClientRect();

    const conf = dragConf.value;
    const ele = currentTarget.cloneNode(true);

    Object.assign(dragConf.value, {
      offsetLeft: clientX - left,
      offsetTop: clientY - top,
      clientX: clientX,
      clientY: clientY,
      info,
      ele,
      isDown: true,
    });
    ele.style.position = "fixed";
    ele.style.textAlign = "center";
    ele.style.top = clientY - conf.offsetTop + "px";
    ele.style.left = clientX - conf.offsetLeft + "px";
    document.body.appendChild(dragConf.value.ele);
  };
</script>
<template>
  <a-layout id="app-menu">
    <a-layout-sider theme="light" class="layout-sider">
      <!-- <a-menu
        theme="inline"
        mode="inline"
        :selectedKeys="[current]"
        @click="changeMenu">
        <a-menu-item v-for="(menuInfo, subIndex) in menu" :key="subIndex"> 
      <router-link :to="{ name: menuInfo.pageName, params: menuInfo.params}">
       <span>{{ menuInfo.title }}</span> 
       </router-link> 
       </a-menu-item>
      </a-menu> -->
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="changeMenu"
      >
        <el-menu-item v-if="id === 'os'">
          <el-icon><setting /></el-icon>
          <span>设备列表</span>
        </el-menu-item>
        <el-menu-item v-else-if="id === 'hardware'">
          <el-icon><setting /></el-icon>
          <span>动力学模型库列表</span>
        </el-menu-item>

        <el-sub-menu
          v-for="(menuInfo, subIndex) in menu"
          :key="subIndex"
          :index="menuInfo.id + ''"
          @click="()=>changeMenu(subIndex)"
        >
          <template #title>
            <span>{{ menuInfo.title }}</span>
          </template>

          <!-- 再添加一层子菜单 -->
          <el-sub-menu
          v-for="(childrenInfo, subIndex) in menuInfo.children"
          :key="subIndex"
          :index="childrenInfo.id + ''"
          @click="()=>changeMenu(subIndex)"
          >
          <template #title>
            <span>{{ childrenInfo.title }}</span>
          </template>
            <el-menu-item
              v-for="(citem, cindex) in childrenInfo.nodeItemList"
              :key="cindex"
            >
              <el-card
                body-style="min-width: 120px; height: 40px; padding: 0px; line-height: 40px"
                shadow="hover"
                @mousedown="(evt) => nodeItemMouseDown(evt, citem.value)"
                >{{ citem.label }}</el-card
              >
            </el-menu-item>
          </el-sub-menu>  
          
          <el-menu-item
              v-for="(citem, cindex) in menuInfo.nodeItemList"
              :key="cindex"
            >
              <el-card
                body-style="min-width: 120px; height: 40px; padding: 0px; line-height: 40px"
                shadow="hover"
                @mousedown="(evt) => nodeItemMouseDown(evt, citem.value)"
                >{{ citem.label }}</el-card
              >
            </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <router-view id="NodesContainer" v-bind="{ nodesRef: newNode }" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style lang="less" scoped>
#app-menu {
  height: 100%;
  text-align: center;
  .layout-sider {
    border-top: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    background-color: #fafafa;
    overflow: auto;
  }
}
#NodesContainer {
  height: 100%;
}
</style>
