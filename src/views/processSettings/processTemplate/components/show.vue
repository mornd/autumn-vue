<template>
  <div>
    <el-dialog
        top="8vh"
        :visible.sync="transData.show"
        title="查看"
        width="80%"
    >
      <div>
        <el-row :gutter="40">
          <el-col :span="8">
            <el-descriptions border :column="1" title="基本信息">
              <el-descriptions-item label="模板名称">{{transData.data.name}}</el-descriptions-item>
              <el-descriptions-item label="审批类型">{{transData.data.processTypeName}}</el-descriptions-item>
              <el-descriptions-item label="图标">
                <img v-if="transData.data.iconUrl" :src="transData.data.iconUrl" style="width: 30px;height: 30px;vertical-align: text-bottom;">
              </el-descriptions-item>
              <el-descriptions-item label="状态">{{transData.data.stateStr}}</el-descriptions-item>
              <el-descriptions-item label="流程定义key">{{transData.data.processDefinitionKey}}</el-descriptions-item>
              <el-descriptions-item label="流程文件名">{{transData.data.processDefinitionFileName}}</el-descriptions-item>
              <el-descriptions-item label="描述">{{transData.data.description}}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{transData.data.createTime}}</el-descriptions-item>
              <el-descriptions-item label="修改时间">{{transData.data.updateTime}}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <el-descriptions :colon="false" direction="vertical" title="表单信息">
              <el-descriptions-item>
                <form-create :rule="transData.rule" :option="transData.option"></form-create>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="8">
            <el-descriptions :colon="false" direction="vertical" title="文件信息">
              <el-descriptions-item>
                <i class="fa fa-file-zip-o"/>
                <el-link type="primary" @click="download">{{transData.data.processDefinitionFileName}}</el-link>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {downloadProcessFile} from "@/utils/processUtil";
export default {
  name: "show",
  methods: {
    download() {
      this.$confirm(`是否下载该流程定义文件到本地?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 下载文件
        downloadProcessFile(`/processTemplate/downloadProcessDefinition/${this.transData.data.processDefinitionFileName}`,
            this.transData.data.processDefinitionFileName)
      })
    }
  },
  props: {
    transData: Object
  }
}
</script>

<style scoped>
  .fa-file-zip-o {
    margin-right: 8px;
  }

  /deep/ .el-dialog__body {
    padding-top: 5px;
  }
</style>
