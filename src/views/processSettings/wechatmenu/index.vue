<template>
  <div>
    <div class="crud-content">
      <el-button @click="handleAdd()" type="primary" size="mini" icon="el-icon-plus" style="margin-left: 5px">添加</el-button>
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
            <el-button v-if="scope.row.parentId === parentId" @click="handleAdd(scope.row)" type="text" size="mini">添加</el-button>
            <el-divider v-if="scope.row.parentId === parentId" direction="vertical"></el-divider>
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
      },
      parentId: 0,
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
      this.$api.getRequest(this.apiUrl).then(res => {
        if(res.success) {
          this.tableData = res.data
          this.loading = false
        }
      })
    },
    handleAdd(row) {
      this.transData.operation = 'add';
      this.transData.title = '添加';
      this.transData.data = {parentName: row.name};
      this.transData.dialogVisible = true
    },
    handleUpdate(row) {
      this.transData.operation = 'edit';
      this.transData.title = '编辑';
      Object.assign(this.transData.data = {}, row);
      this.transData.data.parentName = row.name
      this.transData.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm(`是否永久删除该菜单及其所有子集菜单吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.deleteRequest(`${this.apiUrl}/${row.id}`).then(res => {
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
