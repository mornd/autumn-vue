<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="70px" label-position="left" size="mini">
        <el-form-item label="登录名">
          <el-input
            v-model="crudObj.username"
            clearable
            placeholder="例如：tom"
            prefix-icon="el-icon-search"
            maxlength="100"
            type="text"
          />
        </el-form-item>
        <el-form-item label="访问时间">
          <el-date-picker
            v-model="visitDateScope"
            type="datetimerange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select
            v-model="crudObj.type"
            filterable
            clearable>
            <el-option
              v-for="item in logType"
              :key="item.key"
              :value="item.key"
              :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
              v-model="crudObj.status"
              filterable
              clearable>
            <el-option :key="0" value="0" label="成功"></el-option>
            <el-option :key="1" value="1" label="失败"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-button type="primary" size="mini" icon="el-icon-plus" style="margin-left: 5px">配置</el-button>
      <el-button @click="clearAll" v-has-permi="['systemMonitor:sysLog:clear']" type="danger" size="mini" icon="el-icon-delete" style="margin-left: 5px">清空所有数据</el-button>
      <el-table
        size="small"
        :data="tableData"
        v-loading="loading">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="log-extend-col">
              <ul>
                <li><span>URL</span>{{ props.row.url }}</li>
                <li><span>方法名</span>{{ props.row.methodName }}</li>
                <li><span>调用参数</span>{{ props.row.params }}</li>
                <li><span>异常信息</span>{{ props.row.exceptionMsg }}</li>
                <li><span>返回结果</span>{{ props.row.result }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
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
          label="登录名">
        </el-table-column>
        <el-table-column
          prop="realName"
          align="center"
          show-overflow-tooltip
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="visitDate"
          align="center"
          width="140px"
          show-overflow-tooltip
          label="访问时间">
        </el-table-column>
        <el-table-column
            prop="status"
            align="center"
            show-overflow-tooltip
            label="状态">
          <template #default="scope">
            <el-tag
                :type="scope.row.status === 0 ? 'success' : 'danger'"
                effect="dark"
                size="small">
              {{ scope.row.status === 0 ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          show-overflow-tooltip
          label="类型">
          <template #default="scope">
              <template v-for="item in logType">
                <span v-if="scope.row.type == item.key">{{ item.label }}</span>
              </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="ip"
          align="center"
          show-overflow-tooltip
          label="IP">
        </el-table-column>
        <el-table-column
            prop="address"
            align="center"
            show-overflow-tooltip
            label="用户地址">
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
<!--        <el-table-column
          prop="os"
          align="center"
          show-overflow-tooltip
          label="系统">
        </el-table-column>
        <el-table-column
            prop="browser"
            align="center"
            show-overflow-tooltip
            label="浏览器">
        </el-table-column>-->
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
  </div>
</template>

<script>
  export default {
    name: "LogList",
    data() {
      //登录类型
      const logType = {
        select: {
          key: 1,
          label: '查询'
        },
        insert: {
          key: 2,
          label: '新增'
        },
        update: {
          key: 3,
          label: '修改'
        },
        delete: {
          key: 4,
          label: '删除'
        },
        other: {
          key: 5,
          label: '其他'
        },
        download: {
          key: 6,
          label: '下载'
        },
        upload: {
          key: 7,
          label: '上传'
        },
        clear: {
          key: 8,
          label: '清空'
        },
        publish: {
          key: 9,
          label: '发布'
        }
      }
      return {
        logType,
        //日期范围
        visitDateScope: [],
        crudObj: {
          username: '',
          type: undefined,
          currentPage: 1,
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        loading: false,
        //日期选择器的相关配置
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    mounted() {
      this.getTable()
    },
    methods: {
      getTable() {
        this.loading = true
        //拼接日期范围
        let url = '/sysLog'
        if(this.visitDateScope) {
          url += '?visitDateScope=' + this.visitDateScope
        }
        this.$api.getRequest(url, {...this.crudObj}).then(res => {
          if(res.success) {
            this.tableData = res.data.records
            this.crudObj.total = res.data.total
            this.loading = false
          }
        })
      },
      clearAll() {
        this.$confirm('是否清空所有操作日志?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.deleteRequest('/sysLog').then(res => {
            if(res.success) {
               this.getTable()
            }
          })
        }).catch(() => {});
      },
      search() {
        this.getTable()
      },
      //搜索表单重置
      reset() {
        this.crudObj = {}
        this.crudObj.currentPage = 1
        this.crudObj.pageNo = 1
        this.crudObj.pageSize = 10
        this.getTable()
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

<style lang="less" scoped>
  .crud-content {
    //扩展列内容
    .log-extend-col {
      overflow: scroll;
      padding: 5px 18px;
      ul li {
        margin: 3px 0;
      }
      ul>li>span:first-child {
        color: #99A9BF;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
</style>
