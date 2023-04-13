<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="70px" label-position="left" size="mini">
        <el-form-item label="模板名称">
          <el-input
              v-model="crudObj.name"
              clearable
              prefix-icon="el-icon-search"
              maxlength="100"
              type="text"
              placeholder="点击输入名称"
          />
        </el-form-item>
        <el-form-item label="审批类型">
          <el-select
              v-model="crudObj.processTypeId"
              filterable
              clearable>
            <el-option
                v-for="item in processTypeList"
                :key="item.id"
                :value="item.id"
                :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()" icon="el-icon-search" type="primary">查询</el-button>
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
            label="模板名称">
        </el-table-column>
        <el-table-column
            prop="iconUrl"
            align="center"
            width="50px"
            show-overflow-tooltip
            label="图标">
          <template slot-scope="scope">
            <img :src="scope.row.iconUrl" style="width: 30px;height: 30px;vertical-align: text-bottom;">
          </template>
        </el-table-column>
        <el-table-column
            prop="processTypeName"
            align="center"
            show-overflow-tooltip
            label="审批类型">
        </el-table-column>
        <el-table-column
            prop="processDefinitionKey"
            align="center"
            show-overflow-tooltip
            label="流程定义key">
        </el-table-column>
        <el-table-column
            prop="stateStr"
            align="center"
            show-overflow-tooltip
            label="状态">
        </el-table-column>
        <el-table-column
            prop="description"
            align="center"
            show-overflow-tooltip
            width="200px"
            label="描述">
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
            <el-button @click="show(scope.row)" type="text" size="mini" icon="el-icon-view">查看</el-button>
            <el-button :disabled="scope.row.status === status.published" @click="handleUpdate(scope.row)" type="text" size="mini" icon="el-icon-edit">修改</el-button>
            <el-button :disabled="scope.row.status === status.published" @click="publish(scope.row)" type="text" size="mini" icon="el-icon-edit">发布</el-button>
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
        v-if="transData.dialogVisible"
        :transData="transData"
        @refreshTable="getTable"
    >
    </add-or-edit>

    <show v-if="transData.show" :transData="transData"></show>
  </div>
</template>

<script>
import addOrEdit from "./components/addOrEdit";
import show from "./components/show";
export default {
  name: "index",
  components: {
    addOrEdit,
    show
  },
  data() {
    return {
      crudObj: {
        name: '',
        processTypeId: '',
        currentPage: 1,
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      baseUrl: '/processTemplate',
      tableData: [],
      loading: false,
      transData: {
        dialogVisible: false,
        show: false
      },
      processTypeList: [],
      // 状态
      status: {
        unpublished: 0,
        published: 1
      }
    }
  },
  mounted() {
    this.getTable()
    this.getProcessTypeList()
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
    search() {
      this.crudObj.pageNo = 1
      this.getTable()
    },
    getProcessTypeList() {
      this.$api.getRequest('/processType/getAllTypeNames').then(res => {
        if(res.success) {
          this.processTypeList = res.data
        }
      })
    },
    //搜索表单重置
    reset() {
      this.crudObj = {}
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
    show(row) {
      this.transData.show = true
      Object.assign(this.transData.data = {}, row)
      this.transData.rule = JSON.parse(row.formProps)
      this.transData.option = JSON.parse(row.formOptions)
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
    // 发布
    publish(row) {
      this.$confirm(`是否发布该流程模板?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.putRequest(`${this.baseUrl}/publish/${row.id}`).then(res => {
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
