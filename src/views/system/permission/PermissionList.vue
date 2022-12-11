<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="searchObj" label-width="50px" label-position="left" @submit.native.prevent size="mini">
        <el-form-item label="名称">
          <el-input
            v-model="searchObj.title"
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
      <el-button @click="handleAdd" v-has-permi="['system:menu:add']" type="primary" size="mini" icon="el-icon-plus" style="margin-left: 5px">添加</el-button>
      <el-table
        max-height="480"
        size="small"
        :data="tableData"
        row-key="id"
        fit
        :indent="15"
        :default-expand-all="defaultExpandFlag"
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
          prop="title"
          show-overflow-tooltip
          label="名称">
        </el-table-column>
        <el-table-column
          prop="menuType"
          align="center"
          width="100"
          label="类型">
          <template #default="scope">
            <el-tag
              effect="dark"
              v-if="scope.row.menuType === menuType.catalogue"
              size="small"
              title="目录">
              <i class="fa fa-folder-open-o" style="margin-right: 5px"/>目录
            </el-tag>
            <el-tag
              effect="dark"
              v-else-if="scope.row.menuType === menuType.menu"
              type="success"
              size="small"
              title="菜单">
              <i class="fa fa-list-ul" style="margin-right: 5px"/>菜单
            </el-tag>
            <el-tag
              effect="dark"
              v-else-if="scope.row.menuType === menuType.button"
              type="warning"
              size="small"
              title="按钮">
              <i class="fa fa-shield" style="margin-right: 5px"/>按钮
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="icon"
          label="图标"
          width="100"
          align="center">
          <template #default="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          show-overflow-tooltip
          label="编码">
        </el-table-column>
        <el-table-column
          prop="path"
          show-overflow-tooltip
          label="路径">
        </el-table-column>
        <el-table-column
          prop="component"
          show-overflow-tooltip
          label="组件">
        </el-table-column>
        <el-table-column
          prop="enabled"
          label="状态"
          width="80"
          align="center">
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
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          show-overflow-tooltip
          width="80"
          align="center">
        </el-table-column>

        <el-table-column
          prop="name"
          label="操作"
          width="150"
          align="center">
          <template #default="scope">
            <div>
              <el-button
                size="mini"
                type="text"
                @click="handleSee(scope.$index, scope.row)">查看
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.$index, scope.row)" v-has-permi="['system:menu:update']">编辑
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)" v-has-permi="['system:menu:delete']">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
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
  import {mapState} from 'vuex'
  import { success, failure } from '@/constants/colorConst'
  //添加编辑窗口组件
  import AddOrEdit from '@/views/system/permission/components/AddOrEdit'

  export default {
    name: "PermissionList",
    components: {AddOrEdit},
    data() {
      return {
        //表格加载flag
        loading: false,
        //是否全部展开树形表格
        defaultExpandFlag: true,
        //表格数据
        tableData: [],
        //表头搜索对象
        searchObj: {},
        //统一颜色
        successColor: success,
        failureColor: failure,
        enabledColor: '#13ce66',
        disabledColor: '#ff4949',
        //传递给子组件的数据
        transData: {
          dialogVisible: false,
        }
      }
    },
    computed: {
      ...mapState(['enabledState', 'menuType', 'operation'])
    },
    mounted() {
      this.getTable();
    },
    methods: {
      /*获取表格数据操作*/
      getTable() {
        this.loading = true;
        let url = 'tableTree';
        let obj = {};
        if (this.searchObj.title) {
          //进入这里说明需要按条件来搜索了，所以更换请求url
          url = 'filterTableTree';
          obj = {...this.searchObj};
        }
        this.$api.getRequest(`/permission/${url}`, obj).then(res => {
          if (res.success) {
            if(Array.isArray(res.data)) {
              this.tableData = res.data;
            } else {
              this.tableData = [];
            }
            this.loading = false;
          }
        })
      },
      /*重置搜索条件*/
      formReset() {
        this.searchObj = {};
        this.getTable();
      },
      /*crud操作*/
      handleAdd() {
        this.transData.operation = this.operation.add;
        this.transData.title = '添加';
        this.transData.dialogVisible = true;
      },
      handleEdit(index, row) {
        this.transData.operation = this.operation.edit;
        this.transData.title = '编辑';
        Object.assign(this.transData.data = {}, row);
        this.transData.dialogVisible = true;
      },
      handleSee(index, row) {
        this.transData.operation = this.operation.see;
        this.transData.title = '查看';
        Object.assign(this.transData.data = {}, row);
        this.transData.dialogVisible = true;
      },
      //delete
      handleDelete(index, row) {
        let rowId = row.id;
        if (rowId) {
          if (row.children instanceof Array && row.children.length) {
            this.$message.warning('该节点下已有数据，请先删除子节点！');
          } else {
            this.$confirm(`是否永久删除ID为[${rowId}],名称为[${row.title}]的数据?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$api.deleteRequest(`/permission/${rowId}`).then(res => {
                this.getTable();
                this.$store.dispatch('setUser').then(res => {
                  this.$store.dispatch('setMenuRoutes')
                })
              })
            })
          }
        }
      },
      //更改（启用/禁用）状态开关改变
      enabledChange(row) {
        let msg, url, enabled = this.enabledState.enabled, disabled = this.enabledState.disabled
        if (enabled == row.enabled) {
          msg = '是否启用该节点？'
          url = `/permission/changeState/${row.id}/${enabled}`
        } else if (disabled == row.enabled) {
          msg = '是否禁用该节点及该节点的所有子节点？'
          if(row.children && row.children.length) {
            msg += '若再启用该节点时，另需手动启用该节点的所有子节点，是否继续？'
          }
          url = `/permission/changeState/${row.id}/${disabled}`
        }
        if(msg) {
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
        }
      },
    }
  }
</script>

<style scoped>
</style>
