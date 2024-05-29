<script setup>
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background, BackgroundVariant } from "@vue-flow/background";
import "vue-super-flow/lib/index.css";
import { onMounted, watch, ref, watchEffect } from "vue";
import SpecialNode from "../../../components/SpecialNode.vue";
import SpecialEdge from "../../../components/SpecialEdge.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import FileSaver from "file-saver";
const props = defineProps({
  nodesRef: Object,
});
const {
  nodes,
  addNodes,
  addEdges,
  onEdgeClick,
  findEdge,
  edges,
  onNodeDragStop,
} = useVueFlow();
function onConnectEdge(params) {
  params.type = "special";
  params.updatable = true;
  params.data = { visable: false };
  newEdge.value = params;
  return addEdges(params);
}
let com1in = ref([]);
let com1out = ref([]);
let com2in = ref([]);
let com2out = ref([]);
let com3in = ref([]);
let com3out = ref([]);
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
let dllFileName = ref("");
let comOptions = ["com1", "com2", "com3"];
let params = ref([]);
let inOutOptions = ["输入变量", "输出变量"];
let selectedInOut = ref("");
let selectedCom = ref("");
let selectedParam = ref("");
const selectChange = (value) => {
  if (value == "输入变量") {
    params.value = inParams;
  } else {
    params.value = outParams;
  }
};
const add = () => {
  console.log("add");
  if (
    selectedCom.value != "" &&
    selectedInOut.value != "" &&
    selectedParam.value != ""
  ) {
    if (selectedCom.value == "com1") {
      if (selectedInOut.value == "输入变量") {
        com1in.value.push(selectedParam.value);
        console.log(com1in.value);
      } else {
        com1out.value.push(selectedParam.value);
      }
    } else if (selectedCom.value == "com2") {
      if (selectedInOut.value == "输入变量") {
        com2in.value.push(selectedParam.value);
      } else {
        com2out.value.push(selectedParam.value);
      }
    } else if (selectedCom.value == "com3") {
      if (selectedInOut.value == "输入变量") {
        com3in.value.push(selectedParam.value);
      } else {
        com3out.value.push(selectedParam.value);
      }
    }
  }
};
const save = () => {
  let com1inn = [];
  for (let i = 0; i < com1in.value.length; i++) {
    com1inn[i] = com1in.value[i];
  }
  let com1outt = [];
  for (let i = 0; i < com1out.value.length; i++) {
    com1outt[i] = com1out.value[i];
  }
  let com2inn = [];
  for (let i = 0; i < com2in.value.length; i++) {
    com2inn[i] = com2in.value[i];
  }
  let com2outt = [];
  for (let i = 0; i < com2out.value.length; i++) {
    com2outt[i] = com2out.value[i];
  }
  let com3inn = [];
  for (let i = 0; i < com3in.value.length; i++) {
    com3inn[i] = com3in.value[i];
  }
  let com3outt = [];
  for (let i = 0; i < com3out.value.length; i++) {
    com3outt[i] = com3out.value[i];
  }
  let jsonData = {
    dllFileName: dllFileName.value,
    com1: {
      输入变量: com1inn,
      输出变量: com1outt,
    },
    com2: {
      输入变量: com2inn,
      输出变量: com2outt,
    },
    com3: {
      输入变量: com3inn,
      输出变量: com3outt,
    },
  };
  const data = JSON.stringify(jsonData);
  const blob = new Blob([data], { type: "" });
  FileSaver.saveAs(blob, "params.json");
};
let paramsJson = ref(null);
const load = () => {};
const store = useStore();
const prenodeList = computed(() => store.state.nodes);
const preedgeList = computed(() => store.state.edges);
const newEdge = ref({});
onMounted(() => {
  //初始化数据
  prenodeList.value.forEach((node) => {
    console.log(node);
    addNodes(node);
  });
  preedgeList.value.forEach((edge) => {
    addEdges(edge);
  });
});
watch(props.nodesRef, () => {
  addNodes([props.nodesRef]);
  store.commit("setNodes", nodes);
});
watch(newEdge, () => {
  store.commit("setEdges", edges);
});
const fileInput = ref(null);
const jsonFileInput = ref(null);
const openFileInput = () => {
  fileInput.value.click();
};
const openJsonFileInput = () => {
  jsonFileInput.value.click();
};
const handleJsonFileChange = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = function () {
    paramsJson = JSON.parse(this.result);
    com1in.value = paramsJson.com1.输入变量;
    com1out.value = paramsJson.com1.输出变量;
    com2in.value = paramsJson.com2.输入变量;
    com2out.value = paramsJson.com2.输出变量;
    com3in.value = paramsJson.com3.输入变量;
    com3out.value = paramsJson.com3.输出变量;
    dllFileName.value=paramsJson.dllFileName
  };
};
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 处理文件，例如上传或读取文件内容
    dllFileName.value = file.name;
    // console.log(file.name);
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
  <div style="width: 100%; height: 100%; background-color: #fff">
    <VueFlow
      class="interactionflow"
      @edge-update="onEdgeUpdate"
      @connect="onConnectEdge"
    >
      <Background :variant="BackgroundVariant.Lines" />
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" @childClick="ToggleTable" />
      </template>
      <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
      </template>
      <div class="new-edit-button">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          style="display: none"
          accept=".dll"
        />
        <el-button
          type="primary"
          style="position: absolute; left: 500px"
          size="small"
          @click="openFileInput"
          round
          >加载动力学模型</el-button
        >
        <el-button
          type="primary"
          style="position: absolute; left: 620px"
          size="small"
          round
          @click="save()"
          >保存</el-button
        >
        <input
          type="file"
          accept=".json"
          style="display: none"
          ref="jsonFileInput"
          @change="handleJsonFileChange"
        />
        <el-button
          type="primary"
          style="position: absolute; left: 680px"
          size="small"
          round
          @click="openJsonFileInput"
          >加载</el-button
        >
        <div style="position: absolute; top: 100px; left: 240px">
          <el-select
            v-model="selectedCom"
            placeholder="选择串口"
            style="width: 100px"
          >
            <el-option
              v-for="item in comOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="selectedInOut"
            placeholder="选择"
            style="width: 100px; margin-left: 20px"
            @change="selectChange"
          >
            <el-option
              v-for="item in inOutOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="selectedParam"
            placeholder="选择变量"
            style="width: 200px; margin-left: 20px"
          >
            <el-option
              v-for="item in params"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button style="margin-left: 20px" @click="add()">添加</el-button>
        </div>
      </div>
      <div style="height:50px;width:200px;background-color:aliceblue;z-index:1;position:absolute;left:250px;top:30px">
        动态库名称：{{dllFileName}}
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
              <template #title>com1</template>
              <el-sub-menu index="1-1">
                <template #title>输入参数</template>
                <el-menu-item v-for="(param, index) in com1in" :key="index">{{
                  param
                }}</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="1-2">
                <template #title>输出参数</template>
                <el-menu-item v-for="(param, index) in com1out" :key="index">{{
                  param
                }}</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>com2</template>
              <el-sub-menu index="2-1">
                <template #title>输入参数</template>
                <el-menu-item v-for="(param, index) in com2in" :key="index">{{
                  param
                }}</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="2-2">
                <template #title>输出参数</template>
                <el-menu-item v-for="(param, index) in com2out" :key="index">{{
                  param
                }}</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="3">
              <template #title>com3</template>
              <el-sub-menu index="3-1">
                <template #title>输入参数</template>
                <el-menu-item v-for="(param, index) in com3in" :key="index">{{
                  param
                }}</el-menu-item>
              </el-sub-menu>
              <el-sub-menu index="3-2">
                <template #title>输出参数</template>
                <el-menu-item v-for="(param, index) in com3out" :key="index">{{
                  param
                }}</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </div>
      <el-button type="primary" class="start">启动</el-button>
    </VueFlow>
  </div>
</template>
<style lang="less" scoped>
.start {
  position: absolute;
  bottom: 5px;
  right: 5px;
  z-index: 99;
}
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
</style>

