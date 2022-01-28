<template>
  <div>
    <div>
      <div class="crud-search">
        <el-form ref="form" inline :model="crudObj" label-width="70px" label-position="left" size="small">
          <el-form-item label="登录名">
            <el-input
              v-model="crudObj.loginName"
              clearable
              prefix-icon="el-icon-search"
              maxlength="10"
              type="text"
            />
          </el-form-item>
          <el-form-item label="操作">
            <el-input
              v-model="crudObj.realName"
              clearable
              prefix-icon="el-icon-search"
              maxlength="10"
              type="text"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="crud-content">
        <el-button type="primary" size="small" icon="el-icon-plus" style="margin-left: 5px">添加</el-button>
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
            prop="title"
            align="center"
            show-overflow-tooltip
            label="操作">
          </el-table-column>
          <el-table-column
            prop="username"
            align="center"
            show-overflow-tooltip
            label="用户">
          </el-table-column>
          <el-table-column
            prop="visitDate"
            align="center"
            show-overflow-tooltip
            label="访问时间">
          </el-table-column>
          <el-table-column
            prop="type"
            align="center"
            show-overflow-tooltip
            label="类型">
          </el-table-column>
          <el-table-column
            prop="ip"
            align="center"
            show-overflow-tooltip
            label="IP">
          </el-table-column>
          <el-table-column
            prop="url"
            align="center"
            show-overflow-tooltip
            label="url">
          </el-table-column>
          <el-table-column
            prop="osAndBrowser"
            align="center"
            show-overflow-tooltip
            label="系统-浏览器">
          </el-table-column>
          <el-table-column
            prop="executionTime"
            align="center"
            show-overflow-tooltip
            label="请求耗时">
            <template #default="scope">
              <el-tag
                :type="scope.row.executionTime ? (scope.row.executionTime > 10000 ? 'danger' : '') : ''"
                size="small"
                effect="plain">
                {{ scope.row.executionTime }}ms
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="methodName"
            align="center"
            show-overflow-tooltip
            label="方法名">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50]"
          :page-size="crudObj.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="crudObj.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LogList",
    data() {
      return {
        crudObj: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        loading: false,
      }
    },
    mounted() {
      this.getTable()
    },
    methods: {
      getTable() {
        this.loading = true
        this.$api.getRequest('/sysLog', {...this.crudObj}).then(res => {
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
      search() {

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