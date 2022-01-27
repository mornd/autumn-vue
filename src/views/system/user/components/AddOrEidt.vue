<template>
  <div>
    <!--对话框-->
    <el-dialog
      top="14vh"
      :visible.sync="transData.dialogVisible"
      :title="transData.title"
      :close-on-click-modal="false"
      :width="dialogWidth"
    >
      <!--表单-->
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
        :disabled="currOper == operation.see"
        class="from"
        status-icon
        size="small"
      >
        <!--隐藏id项-->
        <el-form-item v-if="false">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input v-model="form.loginName" maxlength="20" clearable placeholder="请输入登录名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="form.realName" maxlength="10" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-row :gutter="40" justify="space-between">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <!--$forceUpdate() 强制刷新select组件-->
              <el-select v-model="form.gender"  @change="$forceUpdate()" style="width: 100%">
                <!--key单纯的作为区分使用-->
                <el-option :key="1" label="男" :value="gender.male"></el-option>
                <el-option :key="0" label="女" :value="gender.female"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              <!--不指定value-format的话默认传入Date类型给后台，结果就是后台接收到的日期会早一天-->
              <el-date-picker
                v-model="form.birthday"
                type="date"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="currOper != operation.edit" label="是否启用" prop="status">
          <el-tooltip
            :content="'当前：' + (form.status == enabledState.enabled ? '启用' : '禁用')"
            placement="top-start"
          >
            <el-radio-group
              v-model="form.status"
              :fill="form.status == enabledState.disabled ? failureColor : ''"
            >
              <el-radio-button :label="enabledState.enabled">是</el-radio-button>
              <el-radio-button :label="enabledState.disabled">否</el-radio-button>
            </el-radio-group>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" maxlength="11" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" clearable></el-input>
        </el-form-item>

        <!--角色选择-->
        <el-form-item label="角色">
          <i v-if="roleLoading" class="el-icon-loading"></i>
          <el-select
            v-else
            v-model="form.roles"
            filterable
            multiple
            clearable
            placeholder=""
            style="width: 100%"
          >
            <el-option
              v-for="r in allRoles"
              :label="r.name"
              :value="r.id"
              :disabled="r.enabled == enabledState.disabled"
              :key="r.id"
            >
              <span style="float: left">{{ r.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ r.code }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <span class="dialog-footer" v-if="currOper !== operation.see">
            <el-button @click="transData.dialogVisible = false" size="small">取消</el-button>
            <el-button type="primary" @click="formSubmit('form')" :loading="submitLoading" size="small"
            >{{submitLoading ? '提交中' : '提交'}}</el-button
            >
          </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { isNotBlank,isvalidPhone } from '@/utils/validate'
  import { gender } from '@/constants/systemConsts'
  import { failure } from '@/constants/colorConst'
  import { arrNotEmpty } from '@/utils/objUtil'

  export default {
    name: "AddOrEidt",
    data() {
      const validateLoginName = (rule, value, callback) => {
        if (isNotBlank(value)) {
          this.$api.getRequest(`/sysUser/queryLoginNameExists?id=${this.form.id}&name=${value}`).then(res => {
            if (res.success) {
              if (res.data) {
                callback(new Error("登录名已重复"));
              } else {
                callback()
              }
            } else {
              callback(new Error())
            }
          })
        } else {
          callback(new Error("登录名不能为空"))
        }
      };
      const validatePhone = (rule, value, callback) => {
        //可以不填但不能填错的
        if(!value) {
          callback()
        } else {
          if(isvalidPhone(value)) {
            callback()
          } else {
            callback(new Error("手机号码格式不正确"))
          }
        }
      }
      //dialog默认宽度
      const dialogDefWidth = 850
      return {
        currOper: undefined,
        //dialog宽度
        dialogWidth: dialogDefWidth + 'px',
        dialogDefWidth,
        submitLoading: false,
        allRoles: [],
        roleLoading: true,
        form: {
          id: '',//需指定为空字符串，否则表单验证时会出问题,会将undefined作为字符串传入后台
          status: undefined,
        },
        rules: {
          loginName: [{required: true, validator: validateLoginName, trigger: 'blur'}],
          realName: [{ required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
          status: [{required: true, trigger: 'blur'}],
          gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
          phone: [{required: false, validator: validatePhone, trigger: 'blur'}],
          email: [{required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur'}]
        },
        pickerOptions: {
          //保证只能输入的日期在当前日期之前
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        gender: gender,
        failureColor: failure
      }
    },
    mounted() {
      //监听body元素宽度
      window.onresize = () => {
        return (() => {
          this.setDialogWidth()
        })()
      }
      this.form.status = this.enabledState.enabled
      this.form.gender = this.gender.male
      this.currOper = this.transData.operation
      if (this.transData.operation != this.operation.add) {
        this.form = this.transData.data
      }
      this.getAllRoles()
    },
    methods: {
      //获取所有角色列表
      getAllRoles() {
        this.roleLoading = true
        this.$api.getRequest('/sysUser/getAllRoles').then(res => {
          if(res.success) {
            this.allRoles = []
            if(arrNotEmpty(res.data)) {
              this.allRoles = res.data
              if(this.currOper !== 'add') {
                this.$api.getRequest(`/sysUser/getRoleById/${this.form.id}`).then(res => {
                  if(res.success) {
                    this.form.roles = res.data
                  }
                  this.roleLoading = false
                })
              } else {
                this.roleLoading = false
              }
            }
          }
        })
      },
      //表单提交
      formSubmit(formName) {
        this.submitLoading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.form);
            if (this.currOper == this.operation.add) {
              this.$api.postRequest('/sysUser', this.form).then(res => {
                if (res.success) {
                  this.$emit('refreshTable');
                  this.transData.dialogVisible = false;
                }
                this.submitLoading = false;
              })
            } else if (this.currOper == this.operation.edit) {
              this.$api.putRequest('/sysUser', this.form).then(res => {
                if (res.success) {
                  this.$emit('refreshTable')
                  this.transData.dialogVisible = false
                  this.$store.dispatch('setUser').then(res => {
                    this.$store.dispatch('setMenuRoutes')
                  })
                }
                this.submitLoading = false;
              })
            }
          } else {
            this.submitLoading = false;
            return false;
          }
        });
      },
      //动态设置dialog宽度
      setDialogWidth() {
        let val = document.body.clientWidth
        const def = this.dialogDefWidth // 默认宽度
        if (val < def) {
          this.dialogWidth = '100%'
        } else {
          this.dialogWidth = def + 'px'
        }
      },
    },
    computed: {
      ...mapState(['operation', 'enabledState'])
    },
    props: {
      transData: Object
    }
  }
</script>

<style lang="less" scoped>
  .from {
    height: 370px;
    overflow: auto;
    padding-right: 25px
  }

  /*dialog最外层样式*/
  /deep/ .el-dialog {
    border-radius: 5px;
  }

  /*dialog主体*/
  /deep/ .el-dialog__body {
    padding: 15px 0 5px 15px;
  }

  /*表单样式*/
  .el-form-item {
    margin-bottom: 20px;
  }
</style>