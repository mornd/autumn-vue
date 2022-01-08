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
          <template #default="scope">
            <el-switch
              v-model="scope.row.enabled"
              @change="enabledChange(scope.row)"
              :active-color="enabledColor"
              :inactive-color="disabledColor"
              :active-value="enabledState.enabled"
              :inactive-value="enabledState.disabled">
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
                @click="handleGrantPers(scope.row)">授权
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
        :page-sizes="[10, 20, 50]"
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
  import add_or_edit from './components/AddOrEdit'
  import grant from './components/Grant'

  export default {
    name: "RoleList",
    components: { add_or_edit, grant },
    data() {
      return {
        loading: false,
        tableData: [],
        crudObj: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
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

            //如果一开始显示有两页，但是第二页的数据被删掉了，若此时点击第二页，那么第二页会显示空白，并且当前页也固定显示在了第一页
            if(!data.records.length && data.total !== 0) {
              //当前页数自减一页，再查一次
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
        this.crudObj.pageNo = 1
        this.crudObj.pageSize = 10
        this.getTable()
      },
      //更改状态
      enabledChange(row) {
        let msg, url, enabled = this.enabledState.enabled, disabled = this.enabledState.disabled
        if (enabled == row.enabled) {
          msg = '是否启用该节点？'
          url = `/role/changeState?id=${row.id}&state=${enabled}`
        } else if (disabled == row.enabled) {
          msg = '是否禁用该节点？'
          url = `/role/changeState?id=${row.id}&state=${disabled}`
        }
        this.$confirm(msg, '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.getRequest(url).then(res => {
            if (res.success) {
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