<template>
  <div>
    <div>
      <el-button @click="getData()" class="refresh" type="text" icon="el-icon-refresh-right">刷新</el-button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="pending">
          <div slot="label">
            <div class="pending-badge" v-if="$store.getters.unreadNotifyCount > 0"></div>
            待处理
          </div>
          <div v-if="processNotify.pendingList.length" class="message-content">
            <ul>
              <li @click="apply(item)" v-for="item in processNotify.pendingList" :key="item.id"
                  :title="item.title">
                <div style="display: flex; justify-content: space-between;margin-bottom: 5px">
                  <span class="title">{{item.title}}待你处理！</span>
                  <span class="date">{{ chatDateFormatter(item.createTime) }}</span>
                </div>
              </li>
            </ul>
          </div>
          <p v-else class="emptyTxt">暂没有新消息</p>
        </el-tab-pane>
        <el-tab-pane label="已处理" name="processed">
          <div v-if="processNotify.processedList.length" class="message-content">
            <ul>
              <li @click="apply(item)" v-for="item in processNotify.processedList" :key="item.id"
                  :title="item.title">
                <div style="display: flex; justify-content: space-between;margin-bottom: 5px">
                  <div class="title">{{item.title}}已被处理，处理结果：<span :class="item.status === 1 ? 'approval' : item.status === 2 ? 'pass' : 'refused'">{{ item.status === 1 ? '审批中' : item.status === 2 ? '审批通过' : '审批拒绝' }}</span></div>
                  <span class="date">{{ chatDateFormatter(item.handleTime) }}</span>
                </div>
              </li>
            </ul>
          </div>
          <p v-else class="emptyTxt">暂没有新消息</p>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span class="tip">默认展示10条记录</span>
    <el-link @click="more" style="float: right">查看更多</el-link>

    <apply v-if="transData.dialogVisible" @refreshData="getData" :transData="transData"></apply>
  </div>
</template>

<script>
import {chatDateFormatter} from "@/utils/dateUtil";
import apply from "../../../views/processManagement/planList/components/apply";
import { mapState } from 'vuex'

export default {
  name: "ProcessNotification",
  components: {
    apply
  },
  data() {
    return {
      activeName: 'pending',
      transData: {
        dialogVisible: false
      },
      chatDateFormatter,
    };
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$store.dispatch('getProcessNotify')
    },
    handleClick(tab, event) {
    },
    apply(row) {
      // 流程process的id
      this.transData.id = row.id
      this.transData.taskId = row.taskId
      this.transData.dialogVisible = true
    },
    more() {
      this.close()
      // push 方式页面会卡住
      //this.$router.push({path: '/processManagement/planList', query: {'activeName' : this.activeName}})
      let route = this.$router.resolve({
        path: '/processManagement/planList',
        query:{
          activeName: this.activeName
        }
      })
      window.open(route.href, '_self')
    },
    close() {
      this.$emit('close')
    }
  },
  computed: {
    ...mapState(['processNotify'])
  }
}
</script>

<style scoped>
  .message-content {
    height: 450px;
    overflow: scroll;
  }

  .pending-badge {
    width: 10px;
    height: 10px;
    background: #FA5151;
    border-radius: 50%;
    position: absolute;
    top: 8px;
    right: 14px;
  }

  ul li {
    cursor: pointer;
    padding: 5px;
    border-bottom: 1px solid #ebedf0;
  }

  ul li:hover {
    background: #f0f0f0;
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

  .title {
    font-weight: inherit;
    font-size: 13px;
    color: #000;
    word-break: break-all;
    width: 270px;
  }
  .date {
    color: grey;
    font-size: 12px;
    margin-left: 20px;
  }

  .tip {
    font-size: 10px;
    color: #A7A8A9;
  }

  .emptyTxt {
    text-align: center;
    color: #A7A8A9;
  }

  .refresh {
    cursor: pointer;
    position: absolute;
    right: 12px;
    /* 解决元素使用定位后无法点击问题 */
    z-index: 99;
  }
</style>
