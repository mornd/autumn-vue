<template>
<div>
  <div class="crud-search">
    <el-form ref="form" inline :model="crudObj" label-width="60px" label-position="left" size="mini">
      <el-form-item label="名称">
        <el-input
            v-model="crudObj.name"
            clearable
            prefix-icon="el-icon-search"
            maxlength="200"
            type="text"
            placeholder="点击输入名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getTable()" icon="el-icon-search" type="primary">查询</el-button>
        <el-button @click="reset()" icon="el-icon-refresh-right" type="primary">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="crud-content">
    <el-button @click="handleAdd" type="primary" size="mini" icon="el-icon-plus" style="margin-left: 5px">添加</el-button>
    <el-table
        size="small"
        :data="tableData"
        v-loading="loading">
      <el-table-column
          label="序号"
          align="center"
          type="index">
      </el-table-column>
      <el-table-column
          prop="name"
          align="center"
          show-overflow-tooltip
          label="名称">
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
        <template #default="scope">{{scope.row.createTime | localDate}}</template>
      </el-table-column>
      <el-table-column
          prop="updateTime"
          align="center"
          width="140px"
          label="修改时间">
        <template #default="scope">{{scope.row.updateTime | localDate}}</template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="操作"
          width="150"
          align="center">
        <template #default="scope">
          <el-button @click="handleUpdate(scope.row)" type="text" size="mini" icon="el-icon-edit">修改</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button @click="handleDelete(scope.row)" type="text" size="mini" icon="el-icon-delete">删除</el-button>
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

  <!--添加或修改dialog-->
  <add-or-edit
      ref="addOrEdit"
      v-if="transData.dialogVisible"
      :transData="transData"
      @refreshTable="getTable"
  >
  </add-or-edit>
</div>
</template>

<script>
import addOrEdit from "./components/addOrEdit";
export default {
  name: "index",
  components: {
    addOrEdit
  },
  data() {
    return {
      crudObj: {
        name: '',
        currentPage: 1,
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      baseUrl: '/processType',
      tableData: [],
      loading: false,
      transData: {
        dialogVisible: false,
      },
    }
  },
  mounted() {
    this.getTable()
  },
  methods: {
    getTable() {
      this.loading = true
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
      this.crudObj.name = ''
      this.crudObj.currentPage = 1
      this.crudObj.pageNo = 1
      this.crudObj.pageSize = 10
      this.getTable()
    },
    handleAdd() {
      this.transData.operation = 'add';
      this.transData.title = '添加';
      this.transData.dialogVisible = true
    },
    handleUpdate(row) {
      this.transData.operation = 'edit';
      this.transData.title = '编辑';
      Object.assign(this.transData.data = {}, row);
      this.transData.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm(`是否永久删除该条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteRequest(`${this.baseUrl}/${row.id}`).then(res => {
          if(res.success) {
            this.getTable()
          }
        })
      }).catch(() => {})
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
