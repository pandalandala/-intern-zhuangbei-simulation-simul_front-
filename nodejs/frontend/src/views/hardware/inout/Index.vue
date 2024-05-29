<script setup>
import { onMounted, ref, markRaw } from "vue";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background, BackgroundVariant } from "@vue-flow/background";
import SelectNode from "../../../components/SelectNode.vue";
import SpecialNode from "../../../components/SpecialNode.vue";
import SpecialEdge from "../../../components/SpecialEdge.vue";
import DigitalNode from "../../../components/DigitalNode.vue";
import TextNode from "../../../components/TextNode.vue";
import { computed } from "vue";
import { useStore } from "vuex";
// import {getFunctionName} from './function.mjs'
const selectMenu = ref([]);
const selectCompt = ref(null);
const nodeContainer = ref(null);
const nodeTypes = {
  select: markRaw(SelectNode),
  digital: markRaw(DigitalNode),
  textnode: markRaw(TextNode),
};
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
let outParams = [
  "VehicleTrajectoryOutput",
  "PlaneTrajectoryOutput",
  "CollisionDetectionOutput",
  "GroundReactionForcesOutput",
  "AerodynamicForcesOutput",
  "EnginePerformanceOutput",
  "PropulsionSystemResponseOutput",
  "VehicleDynamicsOutput",
  "AircraftDynamicsOutput",
  "ObstacleDetectionOutput",
  "FlightPathDataOutput",
  "HeadingDataOutput",
  "AttitudeDataOutput",
  "VelocityDataOutput",
  "AccelerationDataOutput",
  "GPSCoordinatesOutput",
  "AltitudeProfileOutput",
  "FuelConsumptionOutput",
  "ControlSurfacesPositionOutput",
  "ThrustCommandOutput",
  "WindTurbulenceDataOutput",
  "AirDensityDataOutput",
  "AirTemperatureDataOutput",
  "PressureDataOutput",
  "SpeedBearingDataOutput",
  "RangeRateDataOutput",
  "TrafficInformationOutput",
  "RunwayIncursionDataOutput",
  "TaxiPathDataOutput",
  "HangarsStatusOutput",
];
let inParams = [
  "PlanePositionInput",
  "PlaneVelocityInput",
  "PlaneAttitudeInput",
  "VehiclePositionInput",
  "VehicleVelocityInput",
  "VehicleAccelerationInput",
  "PlaneControlSignalsInput",
  "VehicleControlSignalsInput",
  "AircraftGPSDataInput",
  "VehicleGPSDataInput",
  "AirDensityInput",
  "FlightPathAngleInput",
  "HeadingAngleInput",
  "AtmosphericPressureInput",
  "AltitudeInput",
  "AirTemperatureInput",
  "WindSpeedInput",
  "WindDirectionInput",
  "TurbulenceIntensityInput",
  "EngineThrustInput",
  "AerodynamicForcesInput",
  "DragCoefficientInput",
  "LiftCoefficientInput",
  "VehicleMassInput",
  "AircraftMassInput",
  "FuelFlowRateInput",
  "PlaneElevatorPositionInput",
  "AileronPositionInput",
  "RudderPositionInput",
  "ThrottlePositionInput",
];
// let isShow = false;
// let dllName = "";
const isShow=ref(false)
const dllName=ref("")
onMounted(() => {
  if(localStorage.getItem("isShow")){
    console.log(localStorage.getItem("dllName"))
    isShow.value=true
    dllName.value=localStorage.getItem("dllName")
  }
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
const fileInput = ref(null);

const openFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 处理文件，例如上传或读取文件内容
    // isShow = true;
    // dllName = file.name;
    isShow.value=true
    dllName.value=file.name
    localStorage.setItem("isShow",true)
    localStorage.setItem("dllName",dllName.value)
    // console.log("Selected File:", file);
  }
  // 清空文件输入框，以便下次选择同一个文件触发change事件
  fileInput.value.value = "";
};
onEdgeClick((params) => {
  const edge = findEdge(params.edge.id);
  edge.data.visable = !edge.data.visable;
});
//拖动后更新元素的位置
onNodeDragStop((event) => {
  store.commit("setNodes", nodes);
  store.commit("setEdges", edges);
});
</script>

<template>
  <div
    style="width: 100%; height: 100%; background-color: #fff"
    ref="nodeContainer"
  >
    <VueFlow
      class="interactionflow"
      :node-types="nodeTypes"
      @edge-update="onEdgeUpdate"
      @connect="onConnectEdge"
    >
      <Background :variant="BackgroundVariant.Lines" />
      <div class="new-edit-button" style="margin-left: 600px">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          style="display: none"
        />
        <el-button type="primary" size="small" @click="openFileInput" round
          >新建配置</el-button
        >
        <el-button size="small" text
          ><el-icon><EditPen /></el-icon>编辑</el-button
        >
      </div>
      <div
        style="
          position: absolute;
          z-index: 99;
          height: 100%;
          background-color: #fff;
          border-right: 1px solid #d9d9d9;
        "
      >
        <el-scrollbar>
          <el-menu class="el-menu-vertical-demo" style="border-right: none">
            <template #title>输入输出端口</template>
            <el-sub-menu index="1">
              <template #title>输入参数</template>
              <el-menu-item
                v-if="isShow"
                v-for="(param, index) in inParams"
                :key="index"
                >{{ param }}</el-menu-item
              >
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>输出参数</template>
              <el-menu-item
                v-if="isShow"
                v-for="(param, index) in outParams"
                :key="index"
                >{{ param }}</el-menu-item
              >
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="elTableContainer" v-show="isShow">
        <div
          style="
            font-size: 16px;
            font-weight: 400;
            text-align: left;
          "
          class="machine"
        >
          <div>虚拟目标机A</div>
          <div>BM3803</div>
          <div>FPGA</div>
        </div>
      </div>
      <div class="elTableContainer" v-show="isShow" style="right: 150px;">
        <div
          style="
            font-size: 16px;
            font-weight: 400;
            text-align: left;
          "
          class="machine"
        >
          <div>虚拟目标机B</div>
          <div>BM3803</div>
          <div>FPGA</div>
        </div>
      </div>
      <div class="dllContainer" v-if="isShow">
        <div class="top">
          <div style="font-size: 16px; font-weight: 400; float: left">In</div>
          <div style="font-size: 16px; font-weight: 400; float: right">Out</div>
        </div>
        <div style="font-size: 14px; font-weight: 400; float: left" class="bottom">
           <span>{{dllName}}</span>
        </div>
      </div>
    </VueFlow>
  </div>
</template>

<style lang="less" scoped>
.new-edit-button {
  position: absolute;
  width: 100%;
  height: 30px;
  z-index: 100;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}
.elTableContainer {
  padding: 12px;
  border: 1px solid black;
  width: 130px;
  position: absolute;
  top: 50px;
  height: 120px;
  right: 350px;
  z-index: 1;
  background-color: aliceblue;
}
.machine {
  height: 100px;
}
.machine div {
  margin-bottom: 5px;
  text-align: center;
}
.dllContainer {
  padding: 12px;
  width: 150px;
  position: absolute;
  top: 300px;
  height: 100px;
  right: 250px;
  z-index: 1;
}
.top{
  width: 100%;
  height: 30px;
}
.top div {
  text-align: center;
  border: 1px solid black;
  width: 30px;
  height: 30px;
}
.bottom{
   border: 1px solid black;
   height: 40px;
   width: 100%;
   text-align: center;
   line-height: 40px;
}
</style>
