<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" :style="{width: formWidth}" size="small">
      <el-form-item label="手机号码" label-width="70px" prop="phone">
        <el-input
            v-model="form.phone"
            clearable
            placeholder="手机号码"
            :maxlength="11"
            prefix-icon="el-icon-phone"
        />
      </el-form-item>

      <el-form-item label="验证码" label-width="70px" prop="code">
        <div style="display: flex;justify-content: space-between">
          <el-input
              v-model.trim="form.code"
              clearable placeholder="验证码"
              maxlength="10"
              style="width: 60%"
              prefix-icon="el-icon-picture"
          />
          <div>
            <el-button
                :disabled="sendMsgFlag"
                type="primary"
                :style="sysTheme ? {backgroundColor: theme} : {}"
                class="send-msg-btn"
                @click="sendPhoneCode()">
              <span>{{ sendMsgFlag ? sendMsgCountNum + '秒后可重发' : '发送验证码' }}</span>
            </el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="新密码" label-width="70px" prop="newPwd">
        <el-input
            v-model="form.newPwd"
            show-password
            clearable
            placeholder="请输入长度在3-20位字母、数字或符号之间的新密码"
            :maxlength="pwdMaxLength"
            :minLength="pwdMinLength"
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" label-width="70px" prop="confirmPwd">
        <el-input
            v-model="form.confirmPwd"
            show-password
            clearable
            placeholder="请确认新密码"
            :maxlength="pwdMaxLength"
            :minLength="pwdMinLength"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <!--提交按钮-->
        <el-button
            type="primary"
            :style="sysTheme ? {backgroundColor: theme} : {}"
            @click="submitForm()"
            style="width: 100%; margin-top: 10px; border: none"
            :disabled="loading"
        >
          <span>提 交</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isvalidPhone, isNotBlank } from '@/utils/validate'
import { encrypt } from '@/utils/secret'
import {mapState} from "vuex";

export default {
  name: "SendPhoneMsg",
  data() {
    const pwdMinLength = 3
    const pwdMaxLength = 20
    const checkPhone = (rule, value, callback) => {
      if(isvalidPhone(value)) {
        callback()
      } else {
        callback(new Error("手机号码格式不正确"))
      }
    }
    const checkCode = (rule, value, callback) => {
      if(isNotBlank(value)) {
        callback()
      } else {
        callback(new Error("验证码不能为空"))
      }
    }
    //密码校验函数
    const checkPwd = (rules, value, callback) => {
      if(value && value.trim() !== '') {
        if(value.length >= pwdMinLength) {
          callback()
        } else {
          callback(new Error('密码长度过低'))
        }
      } else {
        callback(new Error('密码不能为空'))
      }
    }
    const checkConfirmPwd = (rules, value, callback) => {
      if(value && value.trim() !== '') {
        if(value.length >= pwdMinLength) {
          if(value === this.form.newPwd) {
            callback()
          } else {
            callback(new Error('两次密码不一致'))
          }
        } else {
          callback(new Error('密码长度过低'))
        }
      } else {
        callback(new Error('确认密码不能为空'))
      }
    }
    return {
      loading: false,
      pwdMaxLength,
      pwdMinLength,
      form: {
        phone: '',
        code: '',
        newPwd: '',
        confirmPwd: ''
      },
      //非空验证 与prop属性对应
      rules:{
        phone: [{validator: checkPhone, trigger:"blur"}],
        code: [{validator: checkCode, trigger:"blur"}],
        newPwd: {validator: checkPwd, trigger:"blur"},
        confirmPwd: {validator: checkConfirmPwd, trigger:"blur"},
      },
      sendMsgFlag: false,
      sendMsgTimer: {},
      sendMsgCountNum: 60
    }
  },
  methods: {
    sendPhoneCode() {
      this.$refs['form'].validateField(['phone'], errorMsg => {
        if(!errorMsg) {
          this.$api.getRequest(`/sendForgetPwdPhoneMsgCode/${this.form.phone}`).then(res => {
            if(res.success) {
              this.sendMsgFlag = true
              this.$message.success(res.data)
              this.countDown()
            }
          })
        }
      })
    },
    // 短信验证码倒计时
    countDown() {
      this.sendMsgTimer = setInterval(() => {
        if(this.sendMsgCountNum - 1 === 0) {
          // 清除定时器
          clearInterval(this.sendMsgTimer)
          // 重置倒计时状态
          this.sendMsgCountNum = 60
          this.sendMsgFlag = false
        } else {
          this.sendMsgCountNum--
        }
      }, 1000)
    },
    // 提交表单
    submitForm() {
      if(!this.loading) {
        this.$refs['form'].validate(valid => {
          if (valid) {
            //加载动画
            this.loading = true
            // 加密密码
            const encryptPwd = encrypt(this.form.newPwd)
            const tempForm = {phone: this.form.phone, code: this.form.code, newPwd: encryptPwd}
            this.$api.postRequest('/forgetPwdUpdatePwd', tempForm).then(res => {
              this.loading = false
              if(res.success){
                // 响应结果处理， args表示短信是否验证成功
                this.$emit('respHandle', res.data)
              }
            })
          }
        })
      }
    },
    clearFormPwd() {
      this.form.newPwd = ''
      this.form.confirmPwd = ''
      this.$refs['form'].clearValidate()
    }
  },
  props: {
    // 是否跟随系统主题
    sysTheme: {
      type: Boolean,
      required: true,
      default: () => false
    },
    // 表单宽度
    formWidth: {
      type: String,
      require: false,
      default: () => '400px'
    }
  },
  computed: {
    //vuex获取数据
    ...mapState(['theme']),
  },
}
</script>

<style scoped>
  /* 发送短信按钮 */
  .send-msg-btn {
    border: none;
    width: 120px;
  }
</style>
