<script setup>
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background, BackgroundVariant } from "@vue-flow/background";
import SuperFlow from "vue-super-flow";
import "vue-super-flow/lib/index.css";
import { onMounted, watch, ref, watchEffect, markRaw } from "vue";
import SpecialNode from "../../../components/SpecialNode.vue";
import TableNode from "../../../components/TableNode.vue";
import InteractionControls from "./interActionTable.vue";
import SpecialEdge from "../../../components/SpecialEdge.vue";
import { ipcApiRoute } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import { useStore } from "vuex";
import SuccessMessage from "../../../components/SuccessMessage.vue";
import WarningMessage from "../../../components/WarningMessage.vue";
const store = useStore();
const props = defineProps({
  nodesRef: Object,
});
const nodeTypes = {
  special: markRaw(SpecialNode),
  table: markRaw(TableNode),
}
const isTableVisible = ref(false);
const alert = ref(false);
const jsonSuccess = ref(false);
const alertText = ref("");
const {
  addNodes,
  addEdges,
  updateEdge,
  onEdgeClick,
  findEdge,
  findNode,
  nodes,
} = useVueFlow();

//改变指向
function onEdgeUpdate({ edge, connection }) {
  const source = findNode(connection.source);
  const target = findNode(connection.target);
  console.log(source.data);
  if (source.accept !== undefined && !source.accept.includes(target.label)) {
    alert.value = true;
    return;
  } else {
    store.dispatch("showError", "此设备不能相连");

    return updateEdge(edge, connection);
  }
}

function onConnectEdge(params) {
  const source = findNode(params.source);
  const target = findNode(params.target);
  console.log(params);
  if (source.accept !== undefined && !source.accept.includes(target.label)) {
    store.dispatch("showError", "此设备不能相连");
    return;
  } else if(source.connectable === true || source.connectable === undefined){
    alert.value = false;
    params.type = "special";
    params.updatable = true;
    params.data = { visable: false };
    return addEdges(params);
  }
}
watch(props.nodesRef, () => {
  addNodes([props.nodesRef]);
});
const ToggleTable = (value) => {
  isTableVisible.value = value;
};

const fileInput = ref(null);

const openFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 处理文件，例如上传或读取文件内容
    console.log("Selected File:", file);
  }
  // 清空文件输入框，以便下次选择同一个文件触发change事件
  fileInput.value.value = "";
};
const alertClose = () => {
  alert.value = false;
  jsonSuccess.value = false;
};
onEdgeClick((params) => {
  const edge = findEdge(params.edge.id);
  edge.data.visable = !edge.data.visable;
});

//生成json文件
const dbOperation = (ac) => {
  const thisNodes = nodes._object.nodes;
  console.log(thisNodes);
  if (ac == "add" && thisNodes.length == 0) {
    store.dispatch("showError", "没有数据");
    return;
  }
  alertText.value = "";
  let message = {
    mathion: {
      bind: [
        {
          "bm3803cpu_1.bus_m": "bus.amba_pv_s[0]",
        },

        {
          "bus.amba_pv_m[3]": "bm3803_uart1.bus_s:0x80000070:0x8000007C",
        },

        {
          "uart_monitor1.uart_tx": "uart_monitor1.uart_rx",
        },
      ],
      net: [null],
      phy: [
        {
          class: "uart_monitor",
          lib: "libuart_monitor.dll",
          obj: "uart_monitor1",
        },
      ],
      soc: [
        {
          class: "bm3803_cpu",
          lib: "libbm3803_cpu.dll",
          obj: "bm3803cpu_1",
        },

        {
          addr_e: 3145727,
          addr_s: 0,
          class: "soc_memory",
          lib: "null",
          mem_type: "rom",
          obj: "prom",
        },

        {
          addr_e: 134479871,
          addr_s: 134217728,
          class: "soc_memory",
          lib: "null",
          mem_type: "ram",
          obj: "ram1",
        },

        {
          addr_e: 138674175,
          addr_s: 138412032,
          class: "soc_memory",
          lib: "null",
          mem_type: "ram",
          obj: "ram1_ecc",
        },

        {
          class: "_amba_pv_decoder",
          lib: "null",
          master: 1,
          obj: "bus",
          slave: 1,
        },

        {
          class: "bm3803_uart",
          lib: "libbm3803_uart.dll",
          obj: "bm3803_uart1",
        },
      ],
    },
    type: "mathion_cfg",
  };
  let error = false;
  thisNodes.forEach((item) => {
    if (item.label == "3803片内设备集" && message.name === undefined) {
      message.name = item.label;
    } else if (item.label == "tms570片内设备集" && message.name === undefined) {
      message.name = item.label;
    } else if (
      (item.label == "3803片内设备集" && message.name !== undefined) ||
      (item.label == "tms570片内设备集" && message.name !== undefined)
    ) {
      store.dispatch("showError", "不能有多于一个指令核");
      error = true;
      return;
    }
  });
  console.log(message.name);
  if (message.name === undefined) {
    store.dispatch("showError", "没有指令核");
    return;
  }
  if (error) {
    return;
  }

  const params = {
    action: ac,
    info: message,
  };

  ipc.invoke(ipcApiRoute.jsondbOperation, params).then((res) => {
    console.log("res:", res);
    if (ac == "get") {
      if (res.result.length == 0) {
        store.dispatch("showError", "没有数据");
        return;
      }
    }
    store.dispatch("showSuccess", "json文件生成成功");
  });
};
</script>
<template>
  <div style="width: 100%; height: 100%; background-color: #fff">
    <VueFlow
      class="interactionflow"
      @edge-update="onEdgeUpdate"
      @connect="onConnectEdge"
      :node-types="nodeTypes"
    >
      <Background :variant="BackgroundVariant.Lines" />
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" @childClick="ToggleTable" />
      </template>
      <template #node-table="tableNodeProps">
        <TableNode v-bind="tableNodeProps"/>
      </template>
      <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
      </template>
      <InteractionControls v-if="isTableVisible" @childClick="ToggleTable">
      </InteractionControls>
      <SuccessMessage></SuccessMessage>
      <WarningMessage></WarningMessage>
      <div class="new-edit-button">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          style="display: none"
        />
        <el-button type="primary" size="small" @click="openFileInput" round
          >新建目标机</el-button
        >
        <el-button size="small" text
          ><el-icon><EditPen /></el-icon>编辑</el-button
        >
      </div>
      <el-button type="primary" class="start" @click="dbOperation('add')"
        >保存</el-button
      >
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
  z-index: 99;
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
}
</style>
import { forEach } from "lodash";
