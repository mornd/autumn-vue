<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="50px" label-position="left" size="mini">
        <el-form-item label="名称">
          <el-input
            v-model="crudObj.name"
            clearable
            prefix-icon="el-icon-search"
            maxlength="10"
            type="text"
            placeholder="点击输入名称"
          />
        </el-form-item>
        <el-form-item label="编码">
          <el-input
            v-model="crudObj.code"
            clearable
            prefix-icon="el-icon-search"
            maxlength="10"
            type="text"
            placeholder="点击输入编码"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="crudObj.enabled" :label="enabledState.enabled">启用</el-radio>
          <el-radio v-model="crudObj.enabled" :label="enabledState.disabled">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-button @click="handleAdd" v-has-permi="['system:role:add']" type="primary" size="mini" icon="el-icon-plus" style="margin-left: 5px">添加</el-button>
      <el-table
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
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="enabledChange(scope.row)"
              :disabled="scope.row.id == superAdminId"
              :active-color="enabledColor"
              :inactive-color="disabledColor"
              :active-value="enabledState.enabled"
              :inactive-value="enabledState.disabled"
              size="mini">
            </el-switch>
          </template>
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
          width="200"
          align="center">
          <template #default="scope">
            <div>
              <el-button
                size="mini"
                type="text"
                @click="handleGrantPers(scope.row)" v-has-permi="['system:role:update']">授权
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleSee(scope.row)">查看
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                :disabled="scope.row.id == superAdminId"
                @click="handleEdit(scope.row)" v-has-permi="['system:role:update']">编辑
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                :disabled="scope.row.id == superAdminId"
                @click="handleDelete(scope.row)" v-has-permi="['system:role:delete']">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 5px"
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
    <!--授权窗口-->
    <grant
      v-if="grantData.dialogVisible"
      :grantData="grantData"
    >

    </grant>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import AddOrEdit from './components/AddOrEdit'
  import grant from './components/Grant'
  import { super_admin_id } from '@/constants/systemConsts'

  export default {
    name: "RoleList",
    components: { AddOrEdit, grant },
    data() {
      return {
        loading: false,
        tableData: [],
        crudObj: {
          name: '',
          code: '',
          enabled: '',
          pageNo: 1,
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        superAdminId: super_admin_id,
        enabledColor: '#13ce66',
        disabledColor: '#ff4949',
        transData: {
          dialogVisible: false,
        },
        //授权窗口数据
        grantData: {
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
            this.loading = false
          }
        })
      },
      //表头搜索
      search() {
        this.crudObj.pageNo = 1
        this.getTable()
      },
      //搜索表单重置
      reset() {
        this.crudObj.name = ''
        this.crudObj.code = ''
        this.crudObj.enabled = ''
        this.crudObj.currentPage = 1
        this.crudObj.pageNo = 1
        this.crudObj.pageSize = 10
        this.getTable()
      },
      //更改状态
      enabledChange(row) {
        let msg, url, enabled = this.enabledState.enabled, disabled = this.enabledState.disabled
        if (enabled == row.enabled) {
          msg = '是否启用该角色？'
          url = `/role/changeState/${row.id}/${enabled}`
        } else if (disabled == row.enabled) {
          msg = '是否禁用该角色？'
          url = `/role/changeState/${row.id}/${disabled}`
        }
        this.$confirm(msg, '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.putRequest(url).then(res => {
            if (res.success) {
              this.getTable();
              this.$store.dispatch('setUser').then(res => {
                this.$store.dispatch('setMenuRoutes')
              })
            } else {
              //取消操作
              if (enabled === row.enabled) {
                row.enabled = disabled
              } else if (disabled === row.enabled) {
                row.enabled = enabled
              }
            }
          })
        }).catch(() => {
          //取消操作
          if (enabled === row.enabled) {
            row.enabled = disabled
          } else if (disabled === row.enabled) {
            row.enabled = enabled
          }
        })
      },
      //添加
      handleAdd() {
        this.transData.operation = this.operation.add;
        this.transData.title = '添加';
        this.transData.dialogVisible = true;
      },
      //授权菜单
      handleGrantPers(row) {
        this.grantData.title = '授权';
        Object.assign(this.grantData.data = {}, row);
        this.grantData.dialogVisible = true;
      },
      //查看
      handleSee(row) {
        this.transData.operation = this.operation.see;
        this.transData.title = '查看';
        Object.assign(this.transData.data = {}, row);
        this.transData.dialogVisible = true;
      },
      //编辑
      handleEdit(row) {
        this.transData.operation = this.operation.edit;
        this.transData.title = '编辑';
        Object.assign(this.transData.data = {}, row);
        this.transData.dialogVisible = true;
      },
      //删除
      handleDelete(row) {
        if(row.id) {
          this.$confirm(`是否永久删除ID为[${row.id}],名称为[${row.name}]的角色信息(包括解绑其与用户权限之间的关系)?`, '提示', {
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
          }).catch(() => {})
        }
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
    },
    computed: {
      ...mapState(['operation', 'enabledState'])
    }
  }
</script>

<style scoped>
</style>
