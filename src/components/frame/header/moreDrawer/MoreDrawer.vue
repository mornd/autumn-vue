<template>
  <div class="container">
    <div>
      <el-divider>系统主题</el-divider>
      <color-picker/>
    </div>
    <div>
      <el-divider>关于</el-divider>
      <el-divider>其它</el-divider>
    </div>
  </div>
</template>

<script>
  import ColorPicker from './ColorPicker'
  export default {
    name: "MoreDrawer",
    components: {ColorPicker}
  }
</script>

<style lang="less" scoped>
  .container {
    padding: 0 15px 15px 15px;
  }
</style>