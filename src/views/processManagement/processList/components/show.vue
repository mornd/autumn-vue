<template>
  <el-dialog
      :visible.sync="transData.dialogVisible"
      title="查看"
      top="5vh">
    <div>
      <el-descriptions border :column="1">
        <el-descriptions-item label="编号">{{transData.data.processCode}}</el-descriptions-item>
        <el-descriptions-item label="标题">{{transData.data.title}}</el-descriptions-item>
        <el-descriptions-item label="申请人账号">{{transData.data.userName}}</el-descriptions-item>
        <el-descriptions-item label="申请人姓名">{{transData.data.userRealName}}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <span
              v-if="transData.data.status === item.key"
              v-for="item in transData.processState">
            {{item.value}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item label="当前审批人信息">{{transData.data.currentAuditorInfo}}</el-descriptions-item>
        <el-descriptions-item label="描述">{{transData.data.description}}</el-descriptions-item>
        <el-descriptions-item label="流程实例id">{{transData.data.processInstanceId}}</el-descriptions-item>
        <el-descriptions-item label="审批类型">{{transData.data.processTypeName}}</el-descriptions-item>
        <el-descriptions-item label="审批模板">{{transData.data.processTemplateName}}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{transData.data.createTime}}</el-descriptions-item>
        <el-descriptions-item label="修改时间">{{transData.data.updateTime}}</el-descriptions-item>
      </el-descriptions>
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
  /deep/ .el-dialog__body {
    padding-top: 5px;
  }
</style>
