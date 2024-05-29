<!-- 仿真控制中节点的样式 -->
<script setup>
import { Handle, Position, useVueFlow } from "@vue-flow/core";
import { ref, onMounted, onUnmounted, computed, defineEmits } from "vue";
import CustomHandle from "./CustomHandle.vue";
import { useStore } from "vuex";
const props = defineProps(["label", "id", "data"]);
const emit = defineEmits();
const store = useStore();
//点击元素后出现阴影的效果
const isActive = ref(false);
const clickableElement = ref(null);
const isTableVisible = ref(false);
const handles = ref([]);
//切换阴影效果并切换表格显示
const toggleActive = () => {
  isActive.value = !isActive.value;
  isTableVisible.value = true;
  emit("childClick", isTableVisible.value);
};
const handleClickOutside = () => {
  if (
    isActive.value &&
    clickableElement.value &&
    !clickableElement.value.contains(event.target)
  ) {
    isActive.value = false;
  }
};
//移除节点
const { removeNodes } = useVueFlow();
const removeNode = () => {
  removeNodes(props.id);
  store.commit("removeNode", props.id);
};
const nodeStyle = ref({});
onMounted(() => {
  nodeStyle.value = props.data.style;
  console.log(props.data.style);
  document.addEventListener("click", handleClickOutside);
  handles.value =
    props.data.api === undefined
      ? [
          {
            label: "",
            style: {
              width: "0",
              height: "0",
              backgroundColor: "transparent",
              top: "18px",
            },
          },
          {
            label: "",
            style: {
              width: "0",
              height: "0",
              backgroundColor: "transparent",
              top: "42px",
            },
          },
        ]
      : props.data.api;
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div
    class="special-node-item"
    @click="toggleActive(this)"
    :class="{ active: isActive }"
    ref="clickableElement"
    :style="nodeStyle"
  >
    <div style="width: 60px">{{ label }}</div>

    <button
      :class="{ view: isActive }"
      class="close-button"
      @click="removeNode()"
    >
      ×
    </button>
  </div>
  
</template>
<style>
.special-node-item {
  border: 1px solid;
  font-size: 12px;
  font-weight: 700;
  background: #ffffff;
  border-radius: 5px;
  transition: background 0.3s;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.node-item.active {
  box-shadow: 1px 1px 8px #c8c8c8;
}
.close-button {
  background-color: rgb(255, 132, 132);
  padding: 0;
  color: #fff;
  border: none;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
  border-radius: 50%;
  outline: none;
  visibility: hidden;
  position: absolute;
  width: 16px;
  height: 16px;
  top: -6px;
  right: -6px;
}
.view {
  visibility: visible;
}
.close-button:hover {
  background-color: rgb(255, 69, 69);
}
.handle {
  width: 8px;
  height: 8px;
}
.handle-text-right {
  margin-left: 10px;
}

.handle-text-left {
  margin-right: 50px;
}

.handle-text-default {
  margin: 5px;
}
#test {
  position: absolute;
  top: 0;
  right: 20;
}
</style>
import { Loading } from "element-plus/es/components/loading/src/service";
