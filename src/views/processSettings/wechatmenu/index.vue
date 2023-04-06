<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="searchParams" label-width="70px" label-position="left" size="mini">
        <el-form-item label="名称">
          <el-input
              v-model="searchParams.name"
              clearable
              prefix-icon="el-icon-search"
              maxlength="100"
              type="text"
              placeholder="点击输入名称"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="search()" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset()" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-button type="primary" size="mini" icon="el-icon-refresh" style="margin-left: 5px">同步公众号菜单</el-button>
      <el-button type="danger" size="mini" icon="el-icon-delete" style="margin-left: 5px">删除公众号所有菜单</el-button>
      <el-table
          size="small"
          :data="tableData"
          row-key="id"
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
            prop="type"
            align="center"
            show-overflow-tooltip
            label="类型">
        </el-table-column>
        <el-table-column
            prop="url"
            align="center"
            show-overflow-tooltip
            label="url">
        </el-table-column>
        <el-table-column
            prop="menuKey"
            align="center"
            show-overflow-tooltip
            label="菜单key">
        </el-table-column>
        <el-table-column
            prop="sort"
            align="center"
            show-overflow-tooltip
            label="排序">
        </el-table-column>
        <el-table-column
            prop="createTime"
            align="center"
            width="100px"
            label="创建时间">
          <template #default="scope">{{scope.row.createTime | localDate}}</template>
        </el-table-column>
        <el-table-column
            prop="name"
            label="操作"
            width="150"
            align="center">
          <template #default="scope">
            <el-button @click="handleAdd(scope.row)" type="text" size="mini">添加</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="handleUpdate(scope.row)" type="text" size="mini">修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="handleDelete(scope.row)" type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--添加或修改dialog-->
    <edit
        v-if="transData.dialogVisible"
        :transData="transData"
        @refreshTable="getTable">
    </edit>
  </div>
</template>

<script>
import Edit from "./components/edit";
export default {
  name: "index",
  components: {
    Edit
  },
  data() {
    return {
      searchParams: {
        name: ''
      },
      apiUrl: '/process/wechat/menu',
      tableData: [],
      loading: false,
      transData: {
        dialogVisible: false,
        show: false
      }
    }
  },
  mounted() {
    this.getTable()
  },
  methods: {
    getTable() {
      this.loading = true
      this.$api.getRequest(this.apiUrl, {...this.searchParams}).then(res => {
        if(res.success) {
          this.tableData = res.data
          this.loading = false
        }
      })
    },
    search() {
      this.getTable()
    },
    //搜索表单重置
    reset() {
      this.searchParams = {}
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
      this.transData.rule = JSON.parse(row.formProps)
      this.transData.option = JSON.parse(row.formOptions)
    },
    handleDelete(row) {
      this.$confirm(`是否永久删除该条数据及其对应的流程定义文件?`, '提示', {
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
  }
}
</script>

<style scoped>

</style>
