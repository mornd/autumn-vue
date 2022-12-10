<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="60px" label-position="left" size="small">
        <el-form-item label="登录名">
          <el-input
              v-model="crudObj.loginName"
              clearable
              prefix-icon="el-icon-search"
              maxlength="100"
              type="text"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
              v-model="crudObj.realName"
              clearable
              prefix-icon="el-icon-search"
              maxlength="100"
              type="text"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-table
          max-height="470"
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
            label="登录名">
        </el-table-column>
        <el-table-column
            prop="realName"
            align="center"
            show-overflow-tooltip
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="loginTime"
            align="center"
            width="140px"
            show-overflow-tooltip
            label="访问时间">
        </el-table-column>
        <el-table-column
            prop="duration"
            align="center"
            label="登录时长">
          <template #default="scope">
            <span v-text="calcDuration(scope.row.duration)"></span>
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
            label="访问地址">
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
            prop="name"
            label="操作"
            width="150"
            align="center">
          <template #default="scope">
            <el-button @click="kick(scope.row)" v-has-permi="['onlineUser:kick']" type="text" size="mini" icon="fa fa-chain-broken">&nbsp;&nbsp;强退</el-button>
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
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "OnlineList",
  data() {
    return {
      crudObj: {
        loginName: '',
        realName: '',
        currentPage: 1,
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.getTable()
  },
  computed: {

  },
  methods: {
    // 计算登录时间距现在的差
    calcDuration(duration) {
      let secondTime = parseInt(duration / 1000);// 秒
      let minuteTime = 0;// 分
      let hourTime = 0;// 小时
      if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      let result = '' + parseInt(secondTime) + "秒";
      if(minuteTime > 0) {
        result = '' + parseInt(minuteTime) + "分" + result;
      }
      if(hourTime > 0) {
        result = '' + parseInt(hourTime) + "小时" + result;
      }
      return result
    },
    getTable() {
      this.loading = true
      const url = '/onlineUser'
      this.$api.getRequest(url, {...this.crudObj}).then(res => {
        if(res.success) {
          const data = res.data
          if(!data.data.length && data.total !== 0) {
            this.crudObj.pageNo--
            this.getTable()
          } else {
            this.tableData = data.data
            this.crudObj.total = data.total
            this.loading = false
          }
        }
      })
    },
    search() {
      this.getTable()
    },
    //搜索表单重置
    reset() {
      this.crudObj.loginName = ''
      this.crudObj.realName = ''
      this.crudObj.currentPage = 1
      this.crudObj.pageNo = 1
      this.crudObj.pageSize = 10
      this.getTable()
    },
    // 强退用户
    kick(row) {
      const loginName = row.loginName
      this.$confirm(`确定要强制退出登录名为${loginName}的用户吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteRequest(`/onlineUser/${row.id}`).then(res => {
          this.getTable()
        })
      })
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
.crud-content {
  //扩展列内容
  .log-extend-col {
    padding: 5px 18px;
    ul>li>span:first-child {
      color: #99A9BF;
      font-size: 14px;
      margin-right: 10px;
    }
  }
}
</style>
