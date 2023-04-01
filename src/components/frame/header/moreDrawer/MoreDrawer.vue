<template>
  <div class="container">
    <div>
      <el-divider>系统主题</el-divider>
      <color-picker/>
    </div>
    <div>
      <el-divider>关于</el-divider>
      <p>仓库地址：</p>
      <table width="100%">
        <tr>
          <td height="30px">
            <el-link href="https://gitee.com/mornd/autumn-vue" target="_blank" type="primary">gitee前端代码</el-link>
          </td>
          <td>
            <el-link href="https://gitee.com/mornd/autumn-boot" target="_blank" type="primary">gitee后端代码</el-link>
          </td>
        </tr>
        <tr>
          <td height="30px">
            <el-link href="https://github.com/mornd/autumn-vue" target="_blank" type="primary">github前端代码</el-link>
          </td>
          <td>
            <el-link href="https://github.com/mornd/autumn-boot" target="_blank" type="primary">github后端代码</el-link>
          </td>
        </tr>
      </table>
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
