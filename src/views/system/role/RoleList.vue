<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="50px" label-position="left" size="small">
        <el-form-item label="名称">
          <el-input
            v-model="crudObj.name"
            clearable
            prefix-icon="el-icon-search"
            maxlength="10"
            type="text"
          />
        </el-form-item>
        <el-form-item label="编码">
          <el-input
            v-model="crudObj.code"
            clearable
            prefix-icon="el-icon-search"
            maxlength="10"
            type="text"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="getTable" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="formReset" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-button @click="handleAdd" type="primary" size="small" icon="el-icon-plus" style="margin-left: 10px">添加</el-button>
      <el-table
        max-height="520"
        size="small"
        :data="tableData"
        v-loading="loading">
        <el-table-column
          prop="id"
          label="id"
          v-if="false">
        </el-table-column>
        <el-table-column
          label="序号"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="名称">
        </el-table-column>
        <el-table-column
          prop="code"
          show-overflow-tooltip
          label="编码">
        </el-table-column>
        <el-table-column
          prop="enabled"
          align="center"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          align="center">
        </el-table-column>

        <el-table-column
          prop="name"
          label="操作"
          width="160"
          align="center">
          <template #default="scope">
            <div>
              <el-button
                size="mini"
                type="text"
                @click="handleSee(scope.row)">查看
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="crudObj.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudObj.total">
      </el-pagination>
    </div>

    <!--添加或修改dialog-->
    <add_or_edit
      ref="addOrEdit"
      v-if="transData.dialogVisible"
      :transData="transData"
      @refreshTable="getTable"
    >
    </add_or_edit>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import add_or_edit from './components/AddOrEdit'

  export default {
    name: "RoleList",
    components: { add_or_edit },
    data() {
      return {
        loading: false,
        tableData: [],
        crudObj: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        transData: {
          dialogVisible: false,
        }
      }
    },
    mounted() {
      this.getTable()
    },
    methods: {
      /*crud*/
      getTable() {
        this.loading = true
        this.$api.getRequest('/role', {...this.crudObj}).then(res => {
          if(res.success) {
            const data = res.data
            this.tableData = data.records
            this.crudObj.total = data.total
            console.log(data);
            this.loading = false
          }
        })
      },
      //搜索表单重置
      formReset() {
        this.crudObj.name = ''
        this.crudObj.code = ''
        this.crudObj.pageNo = 1
        this.crudObj.pageSize = 10
        this.getTable()
      },
      //添加
      handleAdd() {
        this.transData.operation = this.operation.add;
        this.transData.title = '添加';
        this.transData.dialogVisible = true;
      },
      //查看
      handleSee(row) {
        this.transData.operation = this.operation.see;
        this.transData.title = '查看';
        this.transData.dialogVisible = true;
      },
      //编辑
      handleEdit(row) {
        this.transData.operation = this.operation.edit;
        this.transData.title = '编辑';
        this.transData.dialogVisible = true;
      },
      //删除
      handleDelete(row) {
        if(row.id) {
          this.$confirm(`是否永久删除ID为[${row.id}],名称为[${row.name}]的角色信息?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.deleteRequest(`/role/${row.id}`).then(res => {
              this.getTable();
              this.$store.dispatch('setUser').then(res => {
                this.$store.dispatch('setMenuRoutes')
              })
            })
          })
        }
      },
      handleSizeChange() {

      },
      handleCurrentChange() {

      }
    },
    computed: {
      ...mapState(['operation'])
    }
  }
</script>

<style scoped>
</style>