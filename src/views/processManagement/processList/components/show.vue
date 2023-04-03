<template>
  <el-dialog
      :visible.sync="transData.dialogVisible"
      title="查看"
      :close-on-click-modal="false"
      width="50%">
    <div>
      show
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "show",
  props: {
    transData: Object
  }
}
</script>

<style scoped>

</style>
