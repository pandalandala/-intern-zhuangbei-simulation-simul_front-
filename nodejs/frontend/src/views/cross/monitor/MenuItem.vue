<script setup>
import { onMounted } from 'vue';
const props = defineProps(['menuItem']);
</script>
<template>
  <el-sub-menu
    v-if="menuItem.submenu && menuItem.submenu.length > 0"
    :index="menuItem.id"
  >
    <template #title><span>{{menuItem.id}}</span></template>
    <template v-for="subMenuItem in menuItem.submenu" :key="subMenuItem.id">
      <MenuItem :menuItem="subMenuItem"></MenuItem>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="menuItem.id">{{ menuItem.id }}</el-menu-item>
</template>
