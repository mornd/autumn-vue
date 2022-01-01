<template>
  <div>
    <div>
      <el-form ref="form" inline :model="searchObj" label-width="50px" label-position="left" size="small">
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
      <el-button @click="handleAdd" type="primary" size="small"><i class="fa fa-plus" style="margin-right: 6px"/>添加
      </el-button>
      <el-table
        max-height="500"
        size="small"
        :data="tableData"
        row-key="id"
        border
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
          prop="icon"
          label="图标"
          width="80"
          align="center">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          align="center"
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
          prop="menuType"
          align="center"
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
          prop="enabled"
          label="状态"
          width="100"
          align="center">
          <template #default="scope">
            <!--fa fa fa-cog fa-spin-->
            <i :style="{'color': scope.row.enabled === enabledState.enabled ? 'green' : 'red', 'fontSize': '17px'}"
               :class="scope.row.enabled === enabledState.enabled ? 'fa fa-check' : 'fa fa-ban'"
               :title="scope.row.enabled === enabledState.enabled ? '启用' : '禁用'"/>
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
          width="200"
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
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleStatus(scope.row)">{{ scope.row.enabled !== enabledState.enabled ? '启用' : '禁用' }}
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!--添加或修改dialog-->
      <add_or_edit
        ref="addOrEdit"
        v-if="addOrEditTransData.dialogVisible"
        :transData="addOrEditTransData"
        @refreshTable="getTable"
      ></add_or_edit>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  //添加编辑窗口组件
  import add_or_edit from '@/views/system/permission/components/AddOrEdit'

  export default {
    name: "PermissionList",
    components: {add_or_edit},
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
        //传递给子组件的数据
        addOrEditTransData: {
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
          url = 'filterTree';
          obj = {...this.searchObj};
        }
        this.$api.getRequest(`/permission/${url}`, obj).then(res => {
          if (res.success) {
            this.tableData = res.data;
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
        this.addOrEditTransData.operation = this.operation.add;
        this.addOrEditTransData.title = '添加';
        this.addOrEditTransData.dialogVisible = true;
      },
      handleEdit(index, row) {
        this.addOrEditTransData.operation = this.operation.edit;
        this.addOrEditTransData.title = '编辑';
        Object.assign(this.addOrEditTransData.data = {}, row);
        this.addOrEditTransData.dialogVisible = true;
      },
      handleSee(index, row) {
        this.addOrEditTransData.operation = this.operation.see;
        this.addOrEditTransData.title = '查看';
        Object.assign(this.addOrEditTransData.data = {}, row);
        this.addOrEditTransData.dialogVisible = true;
      },
      //更改（启用/禁用）状态点击事件处理
      handleStatus(row) {
        let msg, url;
        if (this.enabledState.enabled === row.enabled) {
          msg = '是否禁用该节点及该节点的所有子节点？若再启用该节点时，其所有子节点需手动启用，是否继续？'
          url = `/permission/changeState?id=${row.id}&state=${this.enabledState.disabled}`
        } else if (this.enabledState.disabled === row.enabled) {
          msg = '是否启用该节点？启用后该节点的所有子节点需手动启用。'
          url = `/permission/changeState?id=${row.id}&state=${this.enabledState.enabled}`
        }
        this.$confirm(msg, '系统提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.getRequest(url).then(res => {
            if (res.success) {
              this.getTable()
              this.$store.dispatch('setUser').then(res => {
                this.$store.dispatch('setMenuRoutes')
              })
            }
          })
        }).catch(() => {
        })
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
      /*格式化操作*/
      formatMenuType(row, column, cellValue, index) {
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-form-item {
    margin-left: 20px;
  }

  /*设置滚动条的宽度*/
  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 10px;
  }

  /*设置滚动条的背景色和圆角*/
  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #DEDFE1;
    border-radius: 8px;
  }
</style>