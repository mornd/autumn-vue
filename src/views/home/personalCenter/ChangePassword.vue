<template>
  <div class="container">
    <!--步骤条-->
    <el-steps :active="active" finish-status="success" size="small">
      <el-step title="验证当前密码" icon="el-icon-edit" align-center></el-step>
      <el-step title="设置新密码" icon="el-icon-upload"></el-step>
      <el-step title="完成" icon="el-icon-picture"></el-step>
    </el-steps>

    <!--表单-->
    <!--@submit.native.prevent用于解决当el表单中输入框仅有一项时，回车自动提交表单，浏览器会刷新页面-->
    <el-form @submit.native.prevent ref="form" :rules="rules" :model="pwd" label-width="80px" label-position="left" size="small" style="margin-top: 20px">
      <!--key的作用：绑定验证规则是在mounted中执行的，这里是动态展示输入框给总数，在验证规则改变后没有重新绑定，vue复用dom节点，所以会出现下面第一个输入框验证有效，第二个失效-->
      <div v-if="active === 0" :key="1">
        <el-form-item label="密码" prop="oldPwd">
          <el-input
            v-model="pwd.oldPwd"
            show-password
            placeholder="请输入当前密码"
            @input="oldPwdChange"
            :maxlength="pwdMaxLength"
            :minLength="pwdMinLength"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <span style="font-size: 13px;color: #409EFF;cursor: pointer">忘记密码</span>
          <el-button
            type="primary"
            :loading="oldPwdBtnLoading"
            style="float: right"
            :disabled="oldPwdBtnDis"
            @click="verifyCurrentPassword"
          >下一步</el-button>
        </el-form-item>
      </div>
      <div v-if="active === 1" :key="2">
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            v-model="pwd.newPwd"
            show-password
            placeholder="请设置新密码"
            :maxlength="pwdMaxLength"
            :minLength="pwdMinLength"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            v-model="pwd.confirmPwd"
            show-password
            placeholder="请再次确认新密码"
            :maxlength="pwdMaxLength"
            :minLength="pwdMinLength"
          ></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px">
          <span style="color: #888;font-size: 13px">🎄&emsp;‍密码长度在{{pwdMinLength}}-{{pwdMaxLength}}位字母、数字或符号之间</span>
          <el-button :loading="changePwdBtnLoading" style="float: right" type="primary" :disabled="oldPwdBtnDis" @click="changePwd">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "ChangePassword",
    data() {
      //密码校验函数
      const checkOldPwd = (rules, value, callback) => {
        if(value && value.trim() !== '') {
          callback()
        } else {
          callback(new Error())
        }
      }
      const checkConfirmPwd = (rules, value, callback) => {
        if(value && value.trim() !== '') {
          if(value === this.pwd.newPwd) {
            callback()
          } else {
            callback(new Error('两次密码不一致'))
          }
        } else {
          callback(new Error('确认密码不能为空'))
        }
      }
      return {
        //当前步骤下标
        active: 0,
        //密码长度约束
        pwdMinLength: 3,
        pwdMaxLength: 20,
        pwd: {
          oldPwd: '',
          newPwd: '',
          confirmPwd: ''
        },
        oldPwdBtnDis: true,
        oldPwdBtnLoading: false,
        changePwdBtnLoading: false,
        rules: {
          oldPwd: {validator: checkOldPwd, message: '当前密码不能为空', trigger:"blur"},
          newPwd: {validator: checkOldPwd, message: '新密码不能为空', trigger:"blur"},
          confirmPwd: {validator: checkConfirmPwd, trigger:"blur"},
        }
      }
    },
    methods: {
      oldPwdChange() {
        this.oldPwdBtnDis = !(this.pwd.oldPwd  && this.pwd.oldPwd.trim() !== '' && this.pwd.oldPwd.length >= this.pwdMinLength);
      },
      verifyCurrentPassword() {
        this.$refs['form'].validate(valid => {
          //此时的valid值为验证失败的错误信息
          if(valid) {
            this.oldPwdBtnLoading = true
            this.$api.getRequest(`/sysUser/verifyCurrentPassword/${this.pwd.oldPwd}`).then(res => {
              if(res.success) {
                if(res.data) {
                  this.active = 1;
                } else {
                  this.$message.error('密码验证错误')
                }
                this.oldPwdBtnLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      //修改密码
      changePwd() {
        this.$refs['form'].validate(valid => {
          //此时的valid值为验证失败的错误信息
          if(valid) {
            this.changePwdBtnLoading = true
            this.$api.getRequest(`/sysUser/changePwd/${this.pwd.oldPwd}/${this.pwd.newPwd}`).then(res => {
              if(res.success) {
                this.active = 2
                alert('修改成功')
              }
              this.changePwdBtnLoading = false
            })
          } else {
            return false
          }

        })
      }
    }
  }
</script>

<style scoped>
  .container {
    padding: 20px 0;
  }
</style>