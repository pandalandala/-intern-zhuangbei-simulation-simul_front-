<template>
  <div id="app-base-screen">
    <div class="one-block-1">
      <a-tag color="blue">新建配置</a-tag>
      <a-space> <EditOutlined /> </a-space>
      <a href="#">Delete</a>
    </div>
  </div>
</template>

<style lang="less" scoped>
#app-base-screen {
  padding: 0px 10px;
  text-align: left;
  width: 100%;
  .one-block-1 {
    padding-top: 10px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
  }
}
</style>
