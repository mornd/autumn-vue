<template>
  <div>
    <div class="crud-search">
      <el-form ref="form" inline :model="crudObj" label-width="70px" label-position="left" size="mini">
        <el-form-item label="登录名">
          <el-input
            v-model="crudObj.loginName"
            clearable
            prefix-icon="el-icon-search"
            maxlength="10"
            type="text"
          />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input
            v-model="crudObj.realName"
            clearable
            prefix-icon="el-icon-search"
            maxlength="10"
            type="text"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="crudObj.status" :label="enabledState.enabled">启用</el-radio>
          <el-radio v-model="crudObj.status" :label="enabledState.disabled">禁用</el-radio>
        </el-form-item>
        <el-form-item>
          <el-button @click="search" icon="el-icon-search" type="primary">查询</el-button>
          <el-button @click="reset" icon="el-icon-refresh-right" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="crud-content">
      <el-button @click="handleAdd" v-has-permi="['system:user:add']" type="primary" size="mini" icon="el-icon-plus" style="margin-left: 5px">添加</el-button>
      <el-table
        max-height="430"
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
          prop="loginName"
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
          prop="avatar"
          label="头像"
          align="center">
          <template #default="scope">
            <div style="height: 38px">
              <el-image
                class="avatar"
                fit="cover"
                :src="getAvatar(scope.row.avatar)"
                :title="scope.row.avatar ? '点击预览' : ''"
                :preview-src-list="avatarList(scope.row.avatar)"
              >
                <div slot="error" style="font-size: 40px" title="图片加载失败">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          align="center"
          label="性别">
          <template #default="scope">
            <i
              :class="scope.row.gender == gender.male ? 'el-icon-male' : 'el-icon-female'"
              :title="scope.row.gender == gender.male ? '男' : '女'"
              :style="{color: scope.row.gender == gender.male ? '#409EFF' : 'red'}"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="age"
          align="center"
          :formatter="formatAge"
          label="年龄">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          label="电话">
          <template #default="scope">
            <span>{{scope.row.phone ? scope.row.phone : '空'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              @change="enabledChange(scope.row)"
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
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          align="center">
          <template #default="scope">
            <span>{{scope.row.email ? scope.row.email : '空'}}</span>
          </template>
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
                @click="handleSee(scope.row)">查看
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleEdit(scope.row)" v-has-permi="['system:user:update']">编辑
              </el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.row)" v-has-permi="['system:user:delete']">删除
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
        :current-page.sync="crudObj.currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudObj.total">
      </el-pagination>
    </div>

    <!--添加或修改dialog-->
    <AddOrEdit
      v-if="transData.dialogVisible"
      :transData="transData"
      @refreshTable="getTable()"
    >
    </AddOrEdit>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { gender } from '@/constants/systemConsts'
  import AddOrEdit from './components/AddOrEidt'
  import { birthdayToAge } from '@/utils/objUtil'
  import defaultAvatar from '@/assets/images/avatar/defaultAvatar.png'
  import errorAvatar from '@/assets/images/avatar/errorAvatar.png'

  export default {
    name: "UserList",
    components: { AddOrEdit },
    data() {
      return {
        crudObj: {
          pageNo: 1,
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        tableData: [],
        loading: false,
        enabledColor: '#13ce66',
        disabledColor: '#ff4949',
        transData: {
          dialogVisible: false,
        },
        gender,
        errorAvatar,
        defaultAvatar
      }
    },
    mounted() {
      this.getTable()
    },
    methods: {
      /*crud*/
      getTable() {
        this.loading = true
        this.$api.getRequest('/sysUser', {...this.crudObj}).then(res => {
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
        this.getTable()
      },
      //搜索表单重置
      reset() {
        this.crudObj.loginName = ''
        this.crudObj.realName = ''
        this.crudObj.status = ''
        this.crudObj.pageNo = 1
        this.crudObj.currentPage = 1
        this.crudObj.pageSize = 10
        this.getTable()
      },
      //用户列表头像大图预览
      avatarList(src) {
        src = this.getAvatar(src)
        // 默认图片不需要查看
        if(defaultAvatar !== src) {
          let arr = []
          arr.push(src)
          return arr
        }
      },
      // 设置用户头像
      getAvatar(avatar) {
        if(avatar) {
          if(!avatar.startsWith('http')) {
            // 使用本地文件
            return process.env.VUE_APP_BASE_API + avatar
          } else {
            return avatar
          }
        }
        return defaultAvatar
      },
      //更改状态
      enabledChange(row) {
        let msg, url, enabled = this.enabledState.enabled, disabled = this.enabledState.disabled
        if (enabled == row.status) {
          msg = '是否启用该用户？'
          url = `/sysUser/changeState?id=${row.id}&state=${enabled}`
        } else if (disabled == row.status) {
          msg = '是否禁用该用户？'
          url = `/sysUser/changeState?id=${row.id}&state=${disabled}`
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
            } else {
              //回滚操作
              if (enabled === row.status) {
                row.status = disabled
              } else if (disabled === row.status) {
                row.status = enabled
              }
            }
          })
        }).catch(() => {
          //取消操作
          if (enabled === row.status) {
            row.status = disabled
          } else if (disabled === row.status) {
            row.status = enabled
          }
        })
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
          this.$confirm(`是否永久删除ID为[${row.id}],登录名为[${row.loginName}]的用户信息(包括解绑其与角色之间的关系)?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.deleteRequest(`/sysUser/${row.id}`).then(res => {
              if(res.success) {
                this.getTable();
                this.$store.dispatch('setUser').then(res => {
                  this.$store.dispatch('setMenuRoutes')
                })
              }
            })
          }).catch(() => {})
        }
      },
      //将出生日期转为年龄
      formatAge(row, column, cellValue, index) {
        return row.birthday ? birthdayToAge(row.birthday) : '未知'
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
      ...mapState(['operation', 'enabledState']),
    },
  }
</script>

<style lang="less" scoped>
  @imgHeight: 38px;
  //头像
  .avatar {
    width: @imgHeight;
    height: @imgHeight;
    border-radius: 5px;
  }
</style>
