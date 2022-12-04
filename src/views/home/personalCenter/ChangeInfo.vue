<template>
  <div>
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
      status-icon
      class="form"
      size="small"
    >
      <el-form-item label="登录名" prop="loginName">
        <el-input v-model="form.loginName" maxlength="20" clearable placeholder="请输入登录名"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="form.realName" maxlength="10" clearable placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio v-model="form.gender" :label="gender.male">男</el-radio>
        <el-radio v-model="form.gender" :label="gender.female">女</el-radio>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" maxlength="11" clearable></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" maxlength="20" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button @click="submitForm" :loading="submitLoading" type="primary">保存</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import { isNotBlank,isvalidPhone } from '@/utils/validate'
  import { gender } from '@/constants/systemConsts'

  export default {
    name: "ChangeInfo",
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
            this.$api.getRequest(`/sysUser/queryPhoneExists?phone=${value}&id=${this.form.id}`).then(res => {
              if (res.success) {
                if (res.data) {
                  callback(new Error("手机号码已被绑定"));
                } else {
                  callback()
                }
              } else {
                callback(new Error())
              }
            })
          } else {
            callback(new Error("手机号码格式不正确"))
          }
        }
      }
      return {
        form: {},
        gender,
        rules: {
          loginName: [{required: true, validator: validateLoginName, trigger: 'blur'}],
          realName: [{ required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
          gender: [{required: true, message: '请选择性别', trigger: 'blur'}],
          phone: [{required: false, validator: validatePhone, trigger: 'blur'}],
          email: [{required: false, type: 'email', message: '邮箱格式不正确', trigger: 'blur'}]
        },
        submitLoading: false,
      }
    },
    mounted() {
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        //this.form = JSON.parse(JSON.stringify(this.user))
        //Object.assign(this.form, {...})  这里不可用这种写法，数据会失去响应式，具体看官网==>深入响应式原理 对象篇
        this.form = Object.assign({}, {
          id: this.user.id,
          loginName: this.user.loginName,
          realName: this.user.realName,
          gender: this.user.gender,
          phone: this.user.phone,
          email: this.user.email
        })
      },
      //表单提交
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$confirm('是否确定修改当前个人信息？', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitLoading = true;
              this.$api.putRequest('/sysUser/userUpdate', this.form).then(res => {
                if (res.success) {
                  //修改用户信息
                  this.$store.commit('SET_USER_BASE_INFO', this.form)
                }
                this.submitLoading = false;
              })
            }).catch(() => {
            });
          }
        });
      },
      //重置表单
      reset() {
        this.$refs['form'].resetFields()
        this.getUserInfo()
      }
    },
    computed: {
      ...mapState(['user'])
    }
  }
</script>

<style scoped>
  .form {
    width: 60%;
  }

  /*表单样式*/
  .el-form-item {
    margin-top: 25px;
  }
</style>
