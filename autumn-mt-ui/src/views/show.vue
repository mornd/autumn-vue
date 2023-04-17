<template>
  <div class="container">
    <van-nav-bar
      title="审批详情"
      left-text="返回"
      left-arrow
      @click-left="backPage"
    />
    <van-list>
      <van-cell>
        <template slot="default">
          <div class="header-warp">
            <h4>{{ process.title }}</h4>
            <p>{{ process.createTime }}</p>
            <span class="pass" v-if="process.status === 1">审批中</span>
            <div class="seal-wrap" v-if="process.status === 2">
              <seal-avatar></seal-avatar>
            </div>
            <div class="seal-wrap" v-if="process.status === -1">
              <seal-avatar title="已拒绝" color="#EB8473"></seal-avatar>
            </div>
          </div>
        </template>
      </van-cell>
      <van-cell>
        <template slot="default">
          <div class="detail-wrap">
            <div class="item" :key="key.id" v-for="(value,key) in formValues.formShowData">
              <h5>{{ key }}</h5>
              <p v-html="value"></p>
            </div>
          </div>
        </template>
      </van-cell>

      <van-cell>
        <template slot="default">
          <div class="result">
            <h3>流程</h3>
            <van-steps direction="vertical" :active="processRecordList.length - 1">
              <van-step :key="item.id" v-for="item in processRecordList">
                <div :style="{color: item.status === -1 ? '#EB8473' : ''}">
                  <h4>{{ item.operateUser }} {{ item.description }}</h4>
                  <p>{{ item.createTime }}</p>
                </div>
              </van-step>
            </van-steps>
          </div>
        </template>
      </van-cell>

      <van-cell>
        <template slot="default">
          <div class="result" v-if="process.status === -1">
            <h3>拒绝原因：</h3>
            <p>{{process.reason}}</p>
          </div>
        </template>
      </van-cell>
    </van-list>

    <div class="notice" v-if="taskId != 0">
      <van-icon name="bullhorn-o" />
      <p>{{ process.title }}</p>
      <span v-if="process.status === 2" class="pass">审批通过</span>
      <span v-if="process.status === 1" class="pass" style="color:#838485;">审批中</span>
      <span v-if="process.status === -1" class="pass" style="color:#EB8473;">审批拒绝</span>
    </div>

    <div class="footer" v-if="isApprove">
      <div class="left-action">
        <div class="action back" @click="backPage">
          <van-icon name="revoke" />
          <span>返回</span>
        </div>
      </div>
      <div class="right-button">
        <van-button @click="rejectVisible = true" type="default" size="small">审批拒绝</van-button>
        <span style="margin: 0 4px"></span>
        <van-button @click="approve(1)" type="info" size="small">审批通过</van-button>
      </div>
    </div>

    <el-dialog
        title="输入拒绝原因"
        :visible.sync="rejectVisible"
        width="90%">
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
import SealAvatar from '../components/Seal.vue';
import api from '@/api/process'
export default {
  name: "process",

  components: {
    SealAvatar,
  },
  props: {
    msg: String
  },

  data() {
    return {
      taskId: 0,
      process: { },
      formValues: {},
      processRecordList: [],
      isApprove: false,
      rejectVisible: false,
      reason: '',
      reasonTemplate: ['你好，不同意','电话联系我', '明天开完会再说']
    };
  },

  created(){
    this.taskId = this.$route.params.taskId;
    let id = this.$route.params.id;
    this.fetchData(id);
  },

  methods: {
    fetchData(id) {
      api.show(id).then(response => {
        this.process = response.data.process
        this.formValues = JSON.parse(this.process.formValues)
        this.processRecordList = response.data.processRecordList
        this.isApprove = response.data.isApprove
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
      api.approve(approvalVo).then(response => {
        this.$router.push({ path: '/list/1' })
      })
    },
    inputTemplateMessage(message) {
      this.reason = message
    },
    backPage() {
      this.$router.go(-1)
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 86px;
  .header-warp {
    position: relative;
    h4 {
      font-size: 16px;
      margin: 5px;
    }
    p {
      font-size: 16px;
      margin: 5px;
    }
    .pass {
      color: #4CB971;
      margin: 5px;
    }
    .refused {
      color: #EB8473;
      margin: 5px;
    }
  }
  .detail-wrap {
    .item {
      h5 {
        color: #838485;
        margin: 5px;
      }
      p {
        color: #1B1F22;
        font-size: 16px;
        margin: 5px;
      }
    }
  }
  .result {
    font-size: 14px;
    h4, p {
      margin: 5px;
      font-size: 14px;
    }
  }
  .seal-wrap {
    position: absolute;
    top: 20px;
    right: 30px;
  }

  .notice {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 12px;
    padding: 8px 10px;
    background: #FEFBE8;
    position: fixed;
    bottom: 53px;
    z-index: 10;
    p {
      flex: 1;
      margin: 4px;
    }
    .pass {
      color: #07c160;
      margin-right: 20px;
    }
  }
  .footer {
    // height: 50px;
    padding: 10px;
    background: #F8F8F8;
    display: flex;
    align-items: center;
    position: fixed;
    width: 100%;
    bottom: 0;
    z-index: 10;
    .left-action {
      flex: 1;
      .action {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        span {
          font-size: 12px;
          color: #838485;
        }
      }
    }

    .right-button {
      margin-right: 20px;
    }
  }
}

/deep/ .van-cell {
  position: inherit;
  overflow: visible;
}

/deep/ .van-cell__value{
  position: inherit;
  overflow: visible;
}
</style>
