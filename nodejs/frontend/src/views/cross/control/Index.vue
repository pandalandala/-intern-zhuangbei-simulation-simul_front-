<script setup>
import { onMounted, ref, markRaw } from "vue";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background, BackgroundVariant } from "@vue-flow/background";
import SpecialNode from "../../../components/SpecialNode.vue";
import SpecialEdge from "../../../components/SpecialEdge.vue";
import DigitalNode from "../../../components/DigitalNode.vue";
import TextNode from "../../../components/TextNode.vue";
import { computed } from "vue";
import { useStore } from "vuex";
const selectCompt = ref(null);
const nodeContainer = ref(null);

const {
  addNodes,
  addEdges,
  onEdgeClick,
  findEdge,
  findNode,
  updateEdge,
  nodes,
  edges,
  onNodeDragStop,
} = useVueFlow();
const store = useStore();
const prenodeList = computed(() => store.state.nodes);
const preedgeList = computed(() => store.state.edges);
onMounted(() => {
  // 初始化数据
  prenodeList.value.forEach((node) => {
    addNodes(node);
  });
  preedgeList.value.forEach((edge) => {
    addEdges(edge);
  });
});

//改变指向
function onEdgeUpdate({ edge, connection }) {
  const source = findNode(connection.source);
  const target = findNode(connection.target);
  console.log(source.data);
  if (source.accept !== undefined && !source.accept.includes(target.label)) {
    alert.value = true;
    return;
  } else {
    alert.value = false;
    return updateEdge(edge, connection);
  }
}

function onConnectEdge(params) {
  const source = findNode(params.source);
  const target = findNode(params.target);
  if (source.accept !== undefined && !source.accept.includes(target.label)) {
    alert.value = true;
    return;
  } else {
    alert.value = false;
    params.type = "special";
    params.updatable = true;
    params.data = { visable: false };

    store.commit("addEdges", params);
    return addEdges(params);
  }
}
onEdgeClick((params) => {
  const edge = findEdge(params.edge.id);
  edge.data.visable = !edge.data.visable;
});
//拖动后更新元素的位置
onNodeDragStop((event) => {
  store.commit("setNodes", nodes);
  store.commit("setEdges", edges);
});
const input = ref("3.5");
</script>

<template>
  <div
    style="width: 100%; height: 100%; background-color: #fff"
    ref="nodeContainer"
  >
    <VueFlow
      class="interactionflow"
      style="background-color: #e4e4e4"
      :node-types="nodeTypes"
      @edge-update="onEdgeUpdate"
      @connect="onConnectEdge"
    >
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" @childClick="ToggleTable" />
      </template>
      <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
      </template>
      <div
        style="
          position: absolute;
          top: 5px;
          z-index: 99;
          width: 400px;
          left: 50%;
          transform: translateX(-50%);
        "
      >
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: left;
            align-items: center;
          "
        >
          <div style="width: 120px; margin-right: 80px">超实时倍速</div>
          <div>3.5</div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: left;
            align-items: center;
          "
        >
          <div style="width: 120px; margin-right: 15px">超实时速度调节</div>
          <el-input v-model="input" style="width: 160px; margin-right: 30px"
            >3.5</el-input
          >
          <el-button>确定</el-button>
        </div>
      </div>
      <div
        style="
          position: absolute;
          z-index: 99;
          width: 500px;
          height: 100%;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <div
          style="
            width: 400px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <div class="simItem" style="background-color: #01ffff">
            目标机A
            <div
              class="subItem"
              style="position: absolute; bottom: 0px; left: 0px"
            >
              网络端口
            </div>
          </div>
          <div class="simItem" style="background-color: #d9001c; color: #fff">
            目标机B
            <div class="subItem" style="color: #fff;position: absolute; bottom: 0px; left: 0px" >网络端口</div>
          </div>
        </div>
        <div
          style="
            height: 80px;
            width: 400px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div class="sub-arrow-line"></div>
          <div class="sub-arrow-line" style="margin-right: 100px"></div>
        </div>
        <div
          style="
            height: 40px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div class="arrow-line">分布式服务器总线</div>
        </div>
        <div
          style="
            height: 80px;
            width: 400px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div class="sub-arrow-line"></div>
          <div class="sub-arrow-line" style="margin-right: 100px"></div>
        </div>
        <div
          style="
            width: 400px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <div class="simItem" style="background-color: #aaaaaa">
            动力学模型库
            <div class="subItem" style="position: absolute; top: 0px; left: 0px">网络端口</div>
          </div>
          <div class="simItem" style="background-color: #01ffff">
            仿真控制
            <div class="subItem" style="position: absolute; top: 0px; left: 0px">网络端口</div>
          </div>
        </div>
      </div>
    </VueFlow>
  </div>
</template>

<style lang="less" scoped>
.simItem {
  width: 120px;
  height: 90px;
  text-align: center;
  line-height: 90px;
  position: relative;
  border: 1px solid #000;
}
.subItem {
  border: 1px solid #000;

  width: 50px;
  height: 20px;

  font-size: 10px;
  text-align: center;
  line-height: 20px;
}
.arrow-line {
  position: relative;
  width: 600px; /* 线条的长度 */
  height: 34px; /* 线条的高度 */
  line-height: 34px;
  background-color: #01ffff;
}

.arrow-line::before,
.arrow-line::after {
  content: "";
  position: absolute;
  top: -25px; /* 箭头相对于线条的位置 */

  width: 0; /* 箭头的宽度 */
  height: 0; /* 箭头的高度 */
  border-style: solid;
}

.arrow-line::before {
  left: -20px; /* 第一个箭头的位置 */
  border-width: 40px 40px 40px 0px; /* 定义三角形的形状 */
  border-color: transparent #01ffff transparent transparent; /* 定义三角形的颜色 */
}

.arrow-line::after {
  right: -20px; /* 第二个箭头的位置 */
  border-width: 40px 0 40px 40px; /* 定义三角形的形状 */
  border-color: transparent transparent transparent #01ffff; /* 定义三角形的颜色 */
}
.sub-arrow-line {
  position: relative;
  width: 5px; /* 线条的宽度 */
  height: 72px; /* 线条的高度 */
  background-color: #000;
}

.sub-arrow-line::before,
.sub-arrow-line::after {
  content: "";
  position: absolute;
  left: 50%; /* 箭头的水平位置 */
  width: 0;
  height: 0;
  border-style: solid;
}

.sub-arrow-line::before {
  top: -5px; /* 上方箭头的位置 */
  border-width: 0px 10px 10px 10px; /* 定义向上箭头的形状 */
  border-color: transparent transparent black transparent; /* 定义向上箭头的颜色 */
  transform: translateX(-50%); /* 将箭头水平居中 */
}

.sub-arrow-line::after {
  bottom: -5px; /* 下方箭头的位置 */
  border-width: 10px 10px 0 10px; /* 定义向上箭头的形状 */
  border-color: black transparent transparent transparent; /* 定义向上箭头的颜色 */
  transform: translateX(-50%); /* 将箭头水平居中 */
}
</style>
