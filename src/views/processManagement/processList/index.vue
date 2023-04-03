<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="70px" label-position="left" size="mini">
        <el-form-item label="关键字">
          <el-input
              v-model="crudObj.keyword"
              clearable
              prefix-icon="el-icon-search"
              maxlength="100"
              type="text"
              placeholder="编号/标题/用户/当前审批人"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="crudObj.status"
              filterable
              clearable>
            <el-option
                v-for="item in processState"
                :key="item.key"
                :value="item.key"
                :label="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
              v-model="createTimeScope"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="getTable()" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset()" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-table
          size="small"
          :data="tableData"
          v-loading="loading">
        <el-table-column
            label="序号"
            fixed
            align="center"
            type="index">
        </el-table-column>
        <el-table-column
            prop="processCode"
            fixed
            align="center"
            show-overflow-tooltip
            label="编号">
        </el-table-column>
        <el-table-column
            prop="title"
            align="center"
            show-overflow-tooltip
            label="标题">
        </el-table-column>
        <el-table-column
            prop="userName"
            align="center"
            show-overflow-tooltip
            label="用户">
        </el-table-column>
        <el-table-column
            prop="status"
            align="center"
            show-overflow-tooltip
            label="状态">
          <template #default="scope">
            <template v-for="item in processState">
              <el-tag
                  v-if="scope.row.status === item.key"
                  size="mini"
                  effect="dark"
                  :type="item.tag">
                {{ item.value }}
              </el-tag>
            </template>
          </template>
        </el-table-column>
        <el-table-column
            prop="processTypeName"
            align="center"
            show-overflow-tooltip
            label="审批类型">
        </el-table-column>
        <el-table-column
            prop="processTemplateName"
            align="center"
            show-overflow-tooltip
            label="审批模板">
        </el-table-column>
        <el-table-column
            prop="currentAuditorName"
            align="center"
            show-overflow-tooltip
            label="当前审批人">
        </el-table-column>
        <el-table-column
            prop="currentAuditorPhone"
            align="center"
            width="120px"
            show-overflow-tooltip
            label="当前审批人手机号">
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
            <el-button @click="show(scope.row)" type="text" size="mini" icon="el-icon-view">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50]"
          :page-size="crudObj.pageSize"
          :current-page.sync="crudObj.currentPage"
          layout="total, sizes, prev, pager, next, jumper"
          :total="crudObj.total">
      </el-pagination>
    </div>

    <show v-if="transData.dialogVisible" :transData="transData"></show>
  </div>
</template>

<script>
import show from "./components/show";
export default {
  name: "index",
  components: {
    show
  },
  data() {
    return {
      // 日期范围筛选
      createTimeScope: [],
      crudObj: {
        currentPage: 1,
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      baseUrl: '/process',
      tableData: [],
      loading: false,
      transData: {
        dialogVisible: false,
      },
      // 流程状态取值
      processState: {
        default: {
          key: 0,
          value: '待审批',
          tag: 'info'
        },
        progressing: {
          key: 1,
          value: '审批中',
          tag: ''
        },
        completed: {
          key: 2,
          value: '审批完成',
          tag: 'success'
        },
        rejected: {
          key: -1,
          value: '驳回',
          tag: 'danger'
        },
      },
    }
  },
  mounted() {
    this.getTable()
  },
  methods: {
    getTable() {
      this.loading = true
      if(this.createTimeScope && this.createTimeScope.length) {
        this.crudObj.createTimeBegin = this.createTimeScope[0]
        this.crudObj.createTimeEnd = this.createTimeScope[1]
      }
      console.log(this.crudObj);

      this.$api.getRequest(this.baseUrl, {...this.crudObj}).then(res => {
        if(res.success) {
          this.tableData = res.data.records
          this.crudObj.total = res.data.total
          this.loading = false
        }
      })
    },
    //搜索表单重置
    reset() {
      this.crudObj = {}
      this.createTimeScope = []
      this.crudObj.currentPage = 1
      this.crudObj.pageNo = 1
      this.crudObj.pageSize = 10
      this.getTable()
    },
    show(row) {
      this.transData.dialogVisible = true
      Object.assign(this.transData.data = {}, row)
    },
    //分页操作
    handleSizeChange(size) {
      this.crudObj.pageSize = size
      this.getTable()
    },
    handleCurrentChange(curr) {
      this.crudObj.pageNo = curr
      this.getTable()
    }
  }
}
</script>

<style scoped>

</style>
