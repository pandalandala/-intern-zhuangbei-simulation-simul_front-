<template>
  <el-alert
    :title="errorMessage"
    v-if="errorMessage"
    type="warning"
    center
    show-icon
    :closable="false" 
    style="
      position: absolute;
      width: 200px;
      left: 50%;
      transform: translateX(-50%);
    "
  />
</template>

<script>
export default {
  name: "ErrorBar",
  computed: {
    errorMessage() {
      return this.$store.state.errorMessage;
    },
  },
};
</script>

<style scoped></style>
