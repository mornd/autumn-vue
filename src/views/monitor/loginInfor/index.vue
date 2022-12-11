<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="50px" label-position="left" size="mini">
        <el-form-item label="用户">
          <el-input
              v-model="crudObj.loginName"
              clearable
              prefix-icon="el-icon-search"
              placeholder="例如：tom"
              maxlength="100"
              type="text"
          />
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
              v-model="visitDateScope"
              type="datetimerange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="crudObj.status"
              filterable
              clearable>
            <el-option
                v-for="item in loginStatus"
                :key="item.key"
                :value="item.key"
                :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-button @click="clearAll" v-has-permi="['systemMonitor:sysLoginInfor:truncate']" type="danger" size="mini" icon="el-icon-delete" style="margin-left: 5px">清空所有数据</el-button>
      <el-table
          max-height="430"
          size="small"
          :data="tableData"
          v-loading="loading">
        <el-table-column
            label="序号"
            align="center"
            type="index">
        </el-table-column>
        <el-table-column
            prop="loginName"
            align="center"
            show-overflow-tooltip
            label="用户名">
        </el-table-column>
        <el-table-column
            prop="status"
            align="center"
            show-overflow-tooltip
            label="状态">
          <template #default="scope">
            <el-tag
                effect="dark"
                size="small"
                :type="scope.row.status == loginStatus.success.key ? 'success' : 'danger'">
              <template v-for="item in loginStatus">
                <span v-if="scope.row.status == item.key">{{ item.label }}</span>
                <span v-else-if="scope.row.status == item.key">{{ item.label }}</span>
              </template>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="loginTime"
            align="center"
            width="140px"
            show-overflow-tooltip
            label="登录时间">
        </el-table-column>
        <el-table-column
            prop="type"
            align="center"
            width="80px"
            show-overflow-tooltip
            label="登录方式">
          <template #default="scope">
            <template v-for="item in loginType">
              <span v-if="scope.row.type == item.key">{{ item.label }}</span>
              <span v-else-if="scope.row.type == item.key">{{ item.label }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
            prop="ip"
            align="center"
            show-overflow-tooltip
            label="IP">
        </el-table-column>
        <el-table-column
            prop="address"
            align="center"
            show-overflow-tooltip
            label="用户地址">
        </el-table-column>
        <el-table-column
            prop="os"
            align="center"
            show-overflow-tooltip
            label="系统">
        </el-table-column>
        <el-table-column
            prop="browser"
            align="center"
            show-overflow-tooltip
            label="浏览器">
        </el-table-column>
        <el-table-column
            prop="msg"
            align="center"
            show-overflow-tooltip
            label="消息">
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
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    //登录类型
    const loginStatus = {
      success: {
        key: 0,
        label: '成功'
      },
      failure: {
        key: 1,
        label: '失败'
      }
    }
    const loginType = {
      account: {
        key: 0,
        label: '账号'
      },
      phone_msg: {
        key: 1,
        label: '短信'
      }
    }
    return {
      loginStatus,
      loginType,
      //日期范围
      visitDateScope: [],
      crudObj: {
        loginName: '',
        status: undefined,
        currentPage: 1,
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      loading: false,
      //日期选择器的相关配置
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  },
  mounted() {
    this.getTable()
  },
  methods: {
    getTable() {
      this.loading = true
      //拼接日期范围
      let url = '/sysLoginInfor'
      if(this.visitDateScope) {
        url += '?visitDateScope=' + this.visitDateScope
      }
      this.$api.getRequest(url, {...this.crudObj}).then(res => {
        if(res.success) {
          const data = res.data
          if(!data.records.length && data.total !== 0) {
            this.crudObj.pageNo--
            this.getTable()
          } else {
            this.tableData = data.records
            this.crudObj.total = data.total
            this.loading = false
          }
        }
      })
    },
    clearAll() {
      this.$confirm('是否清空所有登录日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteRequest('/sysLoginInfor').then(res => {
          if(res.success) {
            this.getTable()
          }
        })
      }).catch(() => {});
    },
    search() {
      this.getTable()
    },
    //搜索表单重置
    reset() {
      this.crudObj.loginName = ''
      this.visitDateScope = ''
      this.crudObj.status = ''
      this.crudObj.currentPage = 1
      this.crudObj.pageNo = 1
      this.crudObj.pageSize = 10
      this.getTable()
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

<style lang="less" scoped>
</style>
