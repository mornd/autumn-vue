<template>
  <div>
    <el-dialog append-to-body top="5vh" title="审批详情" :visible.sync="transData.dialogVisible">
      <div class="apply-header">
        <span class="title">{{ process.title }}</span>
        <p class="date">{{ process.createTime }}</p>
        <span :class="process.status === 2 ? 'pass' : (process.status === 1 ? 'approval' : 'refused')">{{ process.status === 2 ? '审批通过' : (process.status === 1 ? '审批中' : '审批拒绝') }}</span>

        <seal v-if="process.status === 2" class="seal"></seal>
        <seal v-else-if="process.status === -1" class="seal" title="已拒绝" color="#EB8473"></seal>
      </div>

      <div class="apply-body">
        <el-divider></el-divider>

        <div class="item" :key="key.id" v-for="(value,key) in formValues.formShowData">
          <h5>{{ key }}</h5>
          <span v-html="value"></span>
        </div>

        <el-divider></el-divider>

        <h4>流程：</h4>
        <el-timeline>
          <el-timeline-item
              v-for="(record, index) in processRecordList"
              :key="index"
              :type="record.status === -1 ? 'danger' : 'success'"
              :timestamp="record.createTime">
            {{ record.operateUser }} {{record.description}}
          </el-timeline-item>
        </el-timeline>

        <div v-if="process.status === -1">
          <h4>拒绝原因：</h4>
          <p>{{ process.reason }}</p>
        </div>
      </div>

      <span v-if="isApprove && taskId" slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = true" size="mini" type="danger">审批拒绝</el-button>
        <el-button @click="approve(1)" type="primary" size="mini">审批通过</el-button>
      </span>
    </el-dialog>

    <el-dialog
        append-to-body
        title="输入拒绝原因"
        :visible.sync="rejectVisible"
        width="40%">
      <el-input
          type="textarea"
          maxlength="255"
          show-word-limit
          :rows="4"
          clearable
          v-model="reason">
      </el-input>
      <!-- 模板 -->
      <div style="margin-top: 10px">
        <span>快捷输入：</span>
        <ul>
          <li :key="index" style="margin-top: 5px" v-for="(item,index) in reasonTemplate">
            <el-link type="info" @click="inputTemplateMessage(item)">{{item}}</el-link>
            <br>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false" size="small">取 消</el-button>
            <el-button @click="reason = ''" size="small">清 除</el-button>
        <el-button type="primary" @click="approve(-1)" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import seal from "./Seal";

export default {
  name: "apply",
  components: {
    seal
  },
  data() {
    return {
      id: '',
      taskId: '',
      process: {},
      formValues: {},
      processRecordList: [],
      isApprove: false,
      reason: '',
      rejectVisible: false,
      reasonTemplate: ['你好，不同意','电话联系我', '明天开完会再说']
    }
  },
  mounted() {
    this.id = this.transData.id
    this.taskId = this.transData.taskId
    this.getData()
  },
  methods: {
    getData() {
      this.$api.getRequest('process/show/' + this.id).then(res => {
        if(res.success) {
          this.process = res.data.process
          this.formValues = JSON.parse(this.process.formValues)
          this.processRecordList = res.data.processRecordList
          this.isApprove = res.data.isApprove
        }
      })
    },
    approve(status) {
      if(status === 1) {
        this.reason = ''
      }
      let approvalVo = {
        processId: this.process.id,
        taskId: this.taskId,
        status: status,
        reason: this.reason
      }
      this.$api.postRequest('/process/approve', approvalVo).then(res => {
        if(res.success) {
          this.transData.dialogVisible = false
          this.$emit('refreshData')
        }
      })
    },
    inputTemplateMessage(message) {
      this.reason = message
    },
  },
  props: {
    transData: Object
  }
}
</script>

<style scoped>
  .apply-header {
    position: relative;
  }
  .apply-body {
    max-height: 400px;
    overflow-y: scroll;
  }

  .title {
    font-weight: bold;
  }
  .date {
    color: grey;
  }

  .seal {
    position: absolute;
    top: 0px;
    right: 60px;
  }

  li {
    list-style: none;
  }

  .approval {
    color: #A7A8A9;
  }
  .pass {
    color: #4CB971;
  }
  .refused {
    color: #EB8473;
  }

  /*dialog主体*/
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
</style>
