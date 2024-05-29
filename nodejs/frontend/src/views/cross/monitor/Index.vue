<script setup>
import { onMounted, ref, markRaw } from "vue";
import MenuItem from "./MenuItem.vue";
import data from "./model.js";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background, BackgroundVariant } from "@vue-flow/background";
import SelectNode from "../../../components/SelectNode.vue";
import DigitalNode from "../../../components/DigitalNode.vue";
import TextNode from "../../../components/TextNode.vue";
const selectMenu = ref([]);
const selectCompt = ref(null);
const nodeContainer = ref(null);
const nodeTypes = {
  select: markRaw(SelectNode),
  digital: markRaw(DigitalNode),
  textnode: markRaw(TextNode),
};
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
const isShow = ref(false);
onMounted(() => {
  if (localStorage.getItem("isShow")) {
    console.log(localStorage.getItem("dllName"));
    isShow.value = true;
  }
  // 初始化数据
  selectMenu.value = data;
  console.log(data);
});
const { nodes, addNodes, addEdges, onConnect, dimensions } = useVueFlow();

onConnect((params) => addEdges(params));

const addRandomNode = (e) => {
  const nodeId = (nodes.value.length + 1).toString();
  let type;
  if (e.index === "1") type = "select";
  else if (e.index === "2") type = "digital";
  else type = "textnode";
  console.log(e.index);
  const newNode = {
    id: nodeId,
    label: `Node: ${nodeId}`,
    position: { x: dimensions.value.width / 2, y: dimensions.value.height / 2 },
    type: type,
  };
  addNodes([newNode]);
};
</script>

<template>
  <div
    style="width: 100%; height: 100%; background-color: #fff"
    ref="nodeContainer"
  >
    <VueFlow class="interactionflow" :node-types="nodeTypes">
      <Background :variant="BackgroundVariant.Lines" />
      <template #node-select="selectNodeProps">
        <SelectNode v-bind="selectNodeProps" />
      </template>
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
            <!-- <template v-for="menuItem in selectMenu" :key="menuItem.id">
              <MenuItem :menuItem="menuItem"></MenuItem>
            </template> -->
            <!-- <el-sub-menu index="1">
              <template #title>输入参数</template>
              <el-menu-item
                v-show="isShow"
                v-for="(param, index) in inParams"
                :key="index"
                >{{ param }}</el-menu-item
              >
            </el-sub-menu> -->
            <el-sub-menu index="1">
              <template #title>输出参数</template>
              <el-menu-item
                v-show="isShow"
                v-for="(param, index) in outParams"
                :key="index"
                >{{ param }}</el-menu-item
              >
            </el-sub-menu>
          </el-menu>
          <el-divider style="margin: 0" />
        </el-scrollbar>
      </div>
    </VueFlow>
  </div>
</template>

<style lang="less" scoped></style>
