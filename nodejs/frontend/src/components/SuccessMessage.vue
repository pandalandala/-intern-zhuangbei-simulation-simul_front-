<template>
  <el-alert
    :title="successMessage"
    v-if="successMessage"
    type="success"
    center
    show-icon
    :closable="false" 
    style="
      position: absolute;
      width: 200px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
    "
  />
</template>

<script>
export default {
  name: "SuccessBar",
  computed: {
    successMessage() {
      return this.$store.state.successMessage;
    },
  },
};
</script>

<style scoped></style>
