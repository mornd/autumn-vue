<template>
  <div class="content">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="待处理" name="pending">
        <el-table
            size="small"
            :data="pending.list"
            v-loading="pending.loading">
          <el-table-column
              label="序号"
              align="center"
              type="index">
          </el-table-column>
          <el-table-column
              prop="title"
              align="center"
              show-overflow-tooltip
              label="标题">
          </el-table-column>
          <el-table-column
              prop="userRealName"
              align="center"
              show-overflow-tooltip
              label="申请人">
          </el-table-column>
          <el-table-column
              prop="processCode"
              align="center"
              show-overflow-tooltip
              label="流程编码">
          </el-table-column>
          <el-table-column
              prop="description"
              align="center"
              show-overflow-tooltip
              label="描述">
          </el-table-column>
          <el-table-column
              prop="createTime"
              align="center"
              width="140px"
              label="创建时间">
          </el-table-column>
          <el-table-column
              prop="name"
              label="操作"
              width="150"
              fixed="right"
              align="center">
            <template #default="scope">
              <el-button @click="apply(scope.row)" type="text" size="mini" icon="el-icon-view">处理</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
              @current-change="pendingPageChange"
              :current-page.sync="pending.pageNo"
              :page-size="pending.pageSize"
              layout="total, prev, pager, next"
              :total="pending.total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已处理" name="processed">
        <el-table
            size="small"
            :data="processed.list"
            v-loading="processed.loading">
          <el-table-column
              label="序号"
              align="center"
              type="index">
          </el-table-column>
          <el-table-column
              prop="title"
              align="center"
              width="250px"
              show-overflow-tooltip
              label="标题">
          </el-table-column>
          <el-table-column
              prop="userRealName"
              align="center"
              show-overflow-tooltip
              label="申请人">
          </el-table-column>
          <el-table-column
              prop="processCode"
              align="center"
              show-overflow-tooltip
              label="流程编码">
          </el-table-column>
          <el-table-column
              prop="status"
              align="center"
              width="70px"
              label="状态">
            <template #default="scope">
              <span :class="scope.row.status === 2 ? 'pass' : (scope.row.status === 1 ? 'approval' : 'refused')">{{ scope.row.status === 2 ? '审批通过' : (scope.row.status === 1 ? '审批中' : '审批拒绝') }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="description"
              align="center"
              show-overflow-tooltip
              label="描述">
          </el-table-column>
          <el-table-column
              prop="handleTime"
              align="center"
              show-overflow-tooltip
              label="处理时间">
          </el-table-column>
          <el-table-column
              prop="createTime"
              align="center"
              width="140px"
              label="创建时间">
          </el-table-column>
          <el-table-column
              prop="name"
              label="操作"
              width="150"
              fixed="right"
              align="center">
            <template #default="scope">
              <el-button @click="apply(scope.row)" type="text" size="mini" icon="el-icon-view">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
              @current-change="processedPageChange"
              :current-page.sync="processed.pageNo"
              :page-size="processed.pageSize"
              layout="total, prev, pager, next"
              :total="processed.total">
          </el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已发起" name="started">
        <el-table
            size="small"
            :data="started.list"
            v-loading="started.loading">
          <el-table-column
              label="序号"
              align="center"
              type="index">
          </el-table-column>
          <el-table-column
              prop="title"
              align="center"
              show-overflow-tooltip
              label="标题">
          </el-table-column>
          <el-table-column
              prop="processCode"
              align="center"
              show-overflow-tooltip
              label="流程编码">
          </el-table-column>
          <el-table-column
              prop="status"
              align="center"
              width="70px"
              label="状态">
            <template #default="scope">
              <span :class="scope.row.status === 2 ? 'pass' : (scope.row.status === 1 ? 'approval' : 'refused')">{{ scope.row.status === 2 ? '审批通过' : (scope.row.status === 1 ? '审批中' : '审批拒绝') }}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="description"
              align="center"
              show-overflow-tooltip
              label="描述">
          </el-table-column>
          <el-table-column
              prop="createTime"
              align="center"
              width="140px"
              label="创建时间">
          </el-table-column>
          <el-table-column
              prop="name"
              label="操作"
              width="150"
              fixed="right"
              align="center">
            <template #default="scope">
              <el-button @click="apply(scope.row)" type="text" size="mini" icon="el-icon-view">详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination">
          <el-pagination
              @current-change="startedPageChange"
              :current-page.sync="started.pageNo"
              :page-size="started.pageSize"
              layout="total, prev, pager, next"
              :total="started.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>

    <apply v-if="transData.dialogVisible" @refreshData="refreshData" :transData="transData"></apply>
  </div>
</template>

<script>
import apply from "./components/apply";

export default {
  name: "index",
  components: {
    apply
  },
  data() {
    return {
      activeName: this.$route.query.activeName ? this.$route.query.activeName : 'pending',
      pending: {
        list: [],
        loading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      processed: {
        list: [],
        loading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      started: {
        list: [],
        loading: false,
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      transData: {
        dialogVisible: false,
      }
    };
  },
  mounted() {
    this.refreshData()
  },
  methods: {
    refreshData() {
      this.getPendingData()
      this.getProcessedData()
      this.getStartedData()
    },
    getPendingData() {
      // 分页对象
      const pageParams = {
        pageNo: this.pending.pageNo,
        pageSize: this.pending.pageSize
      }
      this.pending.loading = true
      this.$api.getRequest('/process/findPending', pageParams).then(res => {
        this.pending.list = res.data.records
        this.pending.total = res.data.total
        this.pending.loading = false
      })
    },
    getProcessedData() {
      // 分页对象
      const pageParams = {
        pageNo: this.processed.pageNo,
        pageSize: this.processed.pageSize
      }
      this.processed.loading = true
      this.$api.getRequest('/process/findProcessed', pageParams).then(res => {
        this.processed.list = res.data.records
        this.processed.total = res.data.total
        this.processed.loading = false
      })
    },
    getStartedData() {
      // 分页对象
      const pageParams = {
        pageNo: this.started.pageNo,
        pageSize: this.started.pageSize
      }
      this.started.loading = true
      this.$api.getRequest('/process/findStarted', pageParams).then(res => {
        this.started.list = res.data.records
        this.started.total = res.data.total
        this.started.loading = false
      })
    },
    apply(row) {
      // 流程process的id
      this.transData.id = row.id
      this.transData.taskId = row.taskId
      this.transData.dialogVisible = true
    },
    handleClick(tab, event) {
    },
    // 分页相关
    pendingPageChange(val) {
      this.pending.pageNo = val
      this.getPendingData()
    },
    processedPageChange(val) {
      this.processed.pageNo = val
      this.getProcessedData()
    },
    startedPageChange(val) {
      this.started.pageNo = val
      this.getStartedData()
    }
  }
}
</script>

<style scoped>
  .content {
    background: #FFF;
    padding: 10px;

    /* 解决 el-tab-pane 导致路由访问浏览器卡死 */
    display: flex;
    flex-direction: column;
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

  .pagination {
    margin-top: 10px;
  }
</style>
