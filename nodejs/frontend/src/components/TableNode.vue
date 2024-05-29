<!-- VueFlow中节点的样式 -->
<script setup>
import { Handle, Position, useVueFlow } from "@vue-flow/core";
import { ref, onMounted, onUnmounted, computed, defineEmits } from "vue";

const props = defineProps(["label", "id", "data"]);
//移除节点
const { removeNodes } = useVueFlow();
const removeNode = () => {
  removeNodes(props.id);
};
//表格的编辑删除按钮操作
const handleEdit = (index, row) => {
  row.editing = true; // 点击编辑时将 editing 设置为 true
};
const handleSave = (index, row) => {
  row.editing = false; // 保存编辑后将 editing 设置为 false
};

const handleDelete = (index, row) => {
  tableData.value.splice(index, 1); // 通过 splice 方法删除对应的行
};
const tableData = ref([
  {
    id: "1",
    equip: "bm3803_uart1",
    port: "uart_rx",
    text: "OUT0",
    role: "1",
  },
  {
    id: "2",
    equip: "bm3803_uart1",
    port: "uart_rx",
    text: "IN0",
    role: "1",
  },
]);
const onAddItem = () => {
  tableData.value.push({
    topic: "TOPIC1",
    id: "1",
    role: "1",
  });
};
const isActive = ref(false);
const toggleActive = () => {
  console.log(1);
  isActive.value = !isActive.value;
};
</script>
<template>
  <div style="padding: 20px; background-color:#c5eafb ;">
    <button class="table-close" @click="removeNode">x</button>
    <el-table
      :data="tableData"
      border
      @click="toggleActive(this)"
    >
      
      <el-table-column prop="topic" label="ID">
        <template #default="scope">
          <!-- 根据 editing 判断展示文本或输入框 -->
          <span v-if="!scope.row.editing">{{ scope.row.id }}</span>
          <el-input v-else v-model="scope.row.id" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="equip" label="设备">
        <template #default="scope">
          <!-- 根据 editing 判断展示文本或输入框 -->
          <span v-if="!scope.row.editing">{{ scope.row.equip }}</span>
          <el-input v-else v-model="scope.row.equip" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="equip" label="端口">
        <template #default="scope">
          <!-- 根据 editing 判断展示文本或输入框 -->
          <span v-if="!scope.row.editing">{{ scope.row.port }}</span>
          <el-input v-else v-model="scope.row.port" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="equip" label="">
        <template #default="scope">
          <!-- 根据 editing 判断展示文本或输入框 -->
          <span v-if="!scope.row.editing">{{ scope.row.text }}</span>
          <el-input v-else v-model="scope.row.text" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template #default="scope">
          <!-- 根据 editing 判断展示编辑或保存按钮 -->
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)"
            v-if="!scope.row.editing && scope.row.role === '1'"
          >
            修改
          </el-button>
          <el-button
            size="small"
            disabled
            v-else-if="!scope.row.editing && scope.row.role !== '1'"
          >
            修改
          </el-button>
          <el-button
            size="small"
            type="success"
            @click="handleSave(scope.$index, scope.row)"
            v-else-if="scope.row.editing"
          >
            保存
          </el-button>

          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            v-if="scope.row.role === '1'"
            >删除</el-button
          >
          <el-button size="small" type="danger" disabled v-else>删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style>
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

.table-close {
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  color: #fff;
  line-height: 20px;
  text-align: center;
  width: 20px;
  height: 20px;
  background-color: transparent;
}
.table-close:hover {
  background-color: rgb(0, 0, 0, 0.3);
}
</style>
import { Loading } from "element-plus/es/components/loading/src/service";
