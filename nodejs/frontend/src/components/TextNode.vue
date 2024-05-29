<!-- VueFlow中节点的样式 -->
<script setup>
import { Handle, Position, useVueFlow } from "@vue-flow/core";
import { ref, onMounted, onUnmounted, computed, defineEmits } from "vue";
import { NodeResizer } from "@vue-flow/node-resizer";
import "@vue-flow/node-resizer/dist/style.css";
const props = defineProps(["label", "id"]);

//点击元素后出现阴影的效果
const isActive = ref(false);
const clickableElement = ref(null);

//切换阴影效果
const toggleActive = () => {
  isActive.value = !isActive.value;
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
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const options = ["0-正常", 1, 2];
const selectedOption = ref({ label: "请选择", value: null });
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (option) => {
  selectedOption.value.label = option;
  isDropdownOpen.value = false;
};
</script>
<template>
  <NodeResizer min-width="120" min-height="40" />
  <div
    class="node-item"
    @click="toggleActive(this)"
    :class="{ active: isActive }"
    ref="clickableElement"
  >
    <div class="dropdown">
      <div class="selected-option">
        <div>{{ selectedOption.label }}</div>
        <button @click="toggleDropdown" class="nodrag">
          <el-icon><ArrowDown /></el-icon>
        </button>
      </div>

      <div v-if="isDropdownOpen" class="options">
        <div
          v-for="option in options"
          :key="option"
          @click="selectOption(option)"
        >
          {{ option }}
        </div>
      </div>
    </div>

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
.node-item {
  width: auto;
  height: 100%;
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
.dropdown {
  position: relative;
}

.selected-option {
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
.selected-option div {
  margin-right: 50px;
}
.selected-option button {
  border: none;
  background-color: #fff;
}
.options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}

.options div {
  padding: 10px;
  cursor: pointer;
  font-size: 14px;
}

.options div:hover {
  background-color: #f0f0f0;
}
</style>
