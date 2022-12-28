<template>
  <!--登录页面主体部分-->
  <div class="login-body"
   v-loading="loading"
   element-loading-text="正在登入..."
   element-loading-spinner="el-icon-loading"
   element-loading-background="rgba(0, 0, 0, 0.2)"
  >
    <!--登录表单容器-->
    <el-form ref="loginForm"
     :rules="rules"
     :model="loginForm"
     id="login-container"
    >

      <!--表单标题-->
      <p class="title" :style="{color : theme}">{{ title }}</p>

      <!--表单描述-->
      <p class="desc">越 秀 区 最 具 影 响 力 的 设 计 规 范 之 一</p>

      <!-- 账号密码登录 -->
      <div v-if="loginMethod === 'account'">
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              @keyup.enter.native="submitForm"
              clearable
              placeholder="账号"
              :maxlength="maxLength"
              prefix-icon="el-icon-user-solid"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              @keyup.enter.native="submitForm"
              clearable
              placeholder="密码"
              :maxlength="maxLength"
              prefix-icon="el-icon-lock"
          />
        </el-form-item>

        <el-form-item prop="code">
          <div style="display: flex;justify-content: space-between">
            <el-input
                v-model.trim="loginForm.code"
                @keyup.enter.native="submitForm"
                clearable placeholder="验证码"
                maxlength="4"
                style="width: 220px"
                prefix-icon="el-icon-picture"
            />
            <div class="captcha-content">
              <div v-if="captchaLoad">
                <i class="el-icon-loading" style="margin-right: 5px"></i><span>loading...</span>
              </div>
              <img v-else :src="captchaUrl" @click="getCaptcha()" title="点击更换" />
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 短信验证登录 -->
      <div v-else>
        <el-form-item prop="phone">
          <el-input
              v-model="loginForm.phone"
              clearable
              placeholder="手机号码"
              :maxlength="11"
              prefix-icon="el-icon-phone"
          />
        </el-form-item>

        <el-form-item prop="code">
          <div style="display: flex;justify-content: space-between">
            <el-input
                v-model.trim="loginForm.code"
                @keyup.enter.native="submitForm"
                clearable placeholder="验证码"
                maxlength="10"
                style="width: 200px"
                prefix-icon="el-icon-picture"
            />
            <div>
              <el-button
                  :disabled="sendMsgFlag"
                  class="send-msg-btn"
                  :style="{backgroundColor: theme, color: '#FFF'}"
                  @click="sendPhoneCode()">
                <span>{{ sendMsgFlag ? sendMsgCountNum + '秒后可重发' : '发送验证码' }}</span>
              </el-button>
            </div>
          </div>
        </el-form-item>
      </div>

      <el-form-item>
        <el-checkbox v-if="rememberMeFlag" v-model="loginForm.rememberMe" :style="cTheme">记住我</el-checkbox>
        <span :style="{color: theme, 'float': 'right'}">
            <span style="cursor: pointer" @click="forgetPwd">忘记密码</span>
            <span>&emsp;|&emsp;</span>
            <span @click="changeLogin()" style="cursor: pointer">{{ loginMethodTxt }}</span>
          </span>
      </el-form-item>

      <el-form-item>
        <!--提交按钮-->
        <el-button
          type="primary"
          class="submit-btn"
          @click="submitForm()"
          :style="{backgroundColor: theme}"
          :disabled="loading"
        >
          <span v-if="!loading">登&emsp;入</span>
          <span v-else><i class="el-icon-loading" style="margin-right: 10px"></i>登&emsp;入&emsp;中&emsp;...</span>
        </el-button>
      </el-form-item>

      <!--其他登入方式-->
      <el-form-item>
        <ul class="other-login">
          <li title="使用GitHub账号登录" style="background-color: #252A2F; font-size: 25px"><i class="fa fa-github"/></li>
          <li title="使用QQ账号登录" style="background-color: #00B0FB"><i class="fa fa-qq"/></li>
          <li title="使用微信账号登录" style="background-color: #46D800"><i class="fa fa-wechat"/></li>
          <!--<li title="使用FaceBook账号登录" style="background-color: #1278F3"><i class="fa fa-facebook-official"/></li>-->
          <li title="使用Microsoft账号登录" style="background-color: #0078D7"><i class="fa fa-windows"/></li>
          <li>
            <el-popover
                placement="left"
                width="150"
                title="更多登录方式"
                trigger="hover">
              <div style="padding: 0 10px;">
                <ul class="other-login">
                  <li title="使用gitee账号登录" style="background: #46D800; overflow: hidden" @click="giteeLogin">
                    <img src="../assets/images/other/gitee.jpeg" width="100%" height="100%" alt="">
                  </li>
                </ul>
              </div>
              <div slot="reference" class="more-login-button" :style="{backgroundColor: theme}">
                <i class="el-icon-more" slot="reference"/>
              </div>
            </el-popover>
          </li>
        </ul>
      </el-form-item>
    </el-form>

    <!--底部内容-->
    <div class="footer-content" :style="cTheme">
      <ul>
        <li>
          <i class="fa fa-copyright"></i>
          <span>Copyright © 2021</span>
        </li>
        <li>
          <i class="fa fa-git-square"></i>
          <a href="https://gitee.com/mornd/autumn-vue" target="_blank" :style="cTheme">gitee</a>
        </li>
        <li>
          <i class="fa fa-qq"></i>
          <span>1152229579</span>
        </li>
        <li>
          <i class="fa fa-flag"></i>
          <span>version:1.1</span>
        </li>
      </ul>
    </div>

    <el-drawer :visible.sync="drawer" @close="drawerClose">
      <span :style="{color: theme, fontWeight: 'bold'}" slot="title">忘记密码</span>
      <div style="margin: 0 30px">
        <send-phone-msg ref="forgetPwdForm" :sysTheme="true" @respHandle="forgetPwdRespHandle"></send-phone-msg>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { encrypt } from '@/utils/secret'
  import { isNotBlank, isvalidPhone, validAccount } from '@/utils/validate'
  import jsCookie from 'js-cookie'
  import { encryptContent, decryptContent } from '@/utils/jsencrypt'

  import SendPhoneMsg from "@/components/frame/auth/SendPhoneMsg";

  export default {
    name: "Login",
    components: {SendPhoneMsg},
    data() {
      //表单校验
      const checkUsername = (rule, value, callback) => {
        if(isNotBlank(value)) {
          if(validAccount(value)) {
            callback()
          } else {
            callback(new Error('账号须由2-20个字母、数字、下划线组成，且以字母开头'))
          }
        } else {
          callback(new Error('请输入账号'))
        }
      }
      const checkPassword = (rule, value, callback) => {
        if(isNotBlank(value)) {
          if(value.length >= this.minLength) {
            callback()
          } else {
            callback(new Error('密码长度须在' + this.minLength + '-' + this.maxLength + '之间'))
          }
        } else {
          callback(new Error('请输入密码'))
        }
      }
      const checkPhone = (rule, value, callback) => {
        if(isvalidPhone(value)) {
          callback()
        } else {
          callback(new Error("手机号码格式不正确"))
        }
      }
      return {
        //验证码加载遮罩
        captchaLoad: true,
        //验证码url
        captchaUrl: '',
        //表单登录属性
        loginForm: {
          username: '', //'tom',
          password: '', //'000',
          phone: '',
          code: '',
          uuid: '',
          rememberMe: false
        },
        //整个页面加载遮罩
        loading: false,
        //账号密码长度约束
        minLength: 3,
        maxLength: 20,
        //非空验证 与prop属性对应
        rules:{
          username: [{validator: checkUsername, trigger: "blur"}],
          password: [{validator: checkPassword, trigger: "blur"}],
          phone: [{validator: checkPhone, trigger: "blur"}],
          code: [{required: true, message: "请输入验证码", trigger: ["change"]}]
        },
        rememberMeFlag: true,
        // 记住我多长时间，单位：天
        rememberMeDays: 30,
        // 登录发送 account，phone
        loginMethod: 'account',
        loginMethodTxt: '短信验证登录',
        sendMsgFlag: false,
        firstSendMsgFlag: false,
        sendMsgCountNum: 60,

        // 抽屉
        drawer: false,
      }
    },
    mounted() {
      this.getCaptcha()
      this.getCookie()
    },
    methods: {
      //获取验证码
      getCaptcha(){
        this.captchaLoad = true;
        this.$api.getRequest(`/captcha?time=${new Date()}`).then(res => {
          if(res.success){
            this.captchaUrl = res.data.captcha;
            this.loginForm.uuid = res.data.uuid;
            this.captchaLoad = false;
          }
        })
      },

      //  获取保存在 cookie 中的登录信息
      getCookie() {
        const username = jsCookie.get("username");
        const password = jsCookie.get("password");
        const rememberMe = jsCookie.get('rememberMe')
        if(username !== undefined) this.loginForm.username = username
        if(password !== undefined) this.loginForm.password = decryptContent(password)
        if(rememberMe !== undefined) this.loginForm.rememberMe = Boolean(rememberMe)
      },

      //表单提交
      submitForm() {
        if(!this.loading) {
          //与ref属性对应
          this.$refs['loginForm'].validate(valid => {
            if (valid) {
              //加载动画
              this.loading = true
              if(this.loginMethod === 'account') {
                if (this.loginForm.rememberMe) {
                  jsCookie.set("username", this.loginForm.username, { expires: this.rememberMeDays });
                  jsCookie.set("password", encryptContent(this.loginForm.password), { expires: this.rememberMeDays });
                  jsCookie.set('rememberMe', this.loginForm.rememberMe, { expires: this.rememberMeDays });
                } else {
                  jsCookie.remove("username");
                  jsCookie.remove("password");
                  jsCookie.remove('rememberMe');
                }
                //加密密码😂
                const tempForm = Object.assign({},
                    this.loginForm,
                    {
                      desEncrypt: true,
                      password: encrypt(this.loginForm.password)
                    })
                //封装的post请求
                this.$api.postRequest('/userLogin', tempForm).then(res => {
                  if(res.success){
                    this.loginSuccessHandle(res)
                  }else{
                    //登录失败
                    this.loginForm.code = '';
                    this.getCaptcha();
                    this.loading = false;
                  }
                })
              } else {
                const tempForm = {phone: this.loginForm.phone, code: this.loginForm.code}
                this.$api.postRequest('/phoneMsgLogin', tempForm).then(res => {
                  if(res.success){
                    this.loginSuccessHandle(res)
                  }else{
                    //登录失败
                    this.loginForm.code = '';
                    this.loading = false;
                  }
                })
              }
            } else {
              //表单验证不通过
              return false;
            }
          })
        }
      },
      // 登录成功处理
      loginSuccessHandle(res) {
        //存储用户token
        const tokenStr = res.data.tokenHead + res.data.token;
        this.$store.commit('SET_TOKEN', tokenStr);
        this.$router.replace(this.homePath);
      },
      // gitee 登录
      giteeLogin() {
        this.$api.getRequest(`/preLoginByGitee`).then(res => {
          if(res.success){
            let data = res.data
            window.location = data.authorizeUrl
          }
        })
      },
      // 切换登录方式
      changeLogin() {
        if(this.loginMethod === 'account') {
          this.rememberMeFlag = false
          // 账号密码登录
          this.loginMethodTxt = '账号密码登录'
          this.loginMethod = 'phone'
        } else {
          this.rememberMeFlag = true
          this.loginMethodTxt = '短信验证登录'
          this.loginMethod = 'account'
        }
        this.loginForm.code = ''
        this.$refs['loginForm'].clearValidate()
      },
      // 发送手机验证码
      sendPhoneCode() {
        this.$refs['loginForm'].validateField(['phone'], errorMsg => {
          if(!errorMsg) {
            this.sendMsgFlag = true
            this.$api.getRequest(`/sendLoginPhoneMsgCode/${this.loginForm.phone}`).then(res => {
              if(res.success) {
                this.$message.success(res.data)
                this.countDown()
              } else {
                this.sendMsgFlag = false
              }
            })
          }
        })
      },
      // 短信验证码倒计时
      countDown() {
        const timer = setInterval(() => {
          if(this.sendMsgCountNum - 1 === 0) {
            // 清除定时器
            clearInterval(timer)
            // 重置倒计时状态
            this.sendMsgCountNum = 60
            this.sendMsgFlag = false
          } else {
            this.sendMsgCountNum--
          }
        }, 1000)
      },
      // 忘记密码
      forgetPwd() {
        this.drawer = true
      },
      forgetPwdRespHandle(res) {
        if(res) {
          this.$message.success('密码修改成功')
          this.drawer = false
        }
      },
      drawerClose() {
        this.$refs.forgetPwdForm.clearFormPwd()
      }
    },
    computed: {
      //vuex获取数据
      ...mapState(['title', 'theme', 'homePath']),
      cTheme() {
        return {color: this.theme}
      }
    },
  }
</script>

<!-- 局部样式 -->
<style lang="less" scoped>

  //定义ul混入
  .mixin_ui(@margin: 0) {
    margin: @margin;
    padding: 0;
    list-style: none;
    /*平均分布*/
    display:flex;
    justify-content:space-between;
  }

  /*登录主体部分*/
  .login-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background: #F5F5F5 url("../assets/images/background/background.svg");
    background-size: cover;

    /*登录主容器*/
    #login-container {
      background-clip: padding-box;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 350px;
    }

    /*登录标题*/
    .title {
      margin: 0 auto;
      text-align: center;
      font-size: 35px;
      font-weight: bold;
    }

    /*描述*/
    .desc {
      text-align: center;
      color: grey;
      font-size: 14px;
      line-height: 60px;
    }

    /*图片验证码区域*/
    .captcha-content {
      width: 115px;
      height: 40px;
      cursor: pointer;
      color: #808080;
      text-align: center;
    }

    /*登录按钮*/
    .submit-btn {
      border: none;
      width: 100%;
      font-size: 15px;
      font-weight: bold;
    }

    /* 发送短信按钮 */
    .send-msg-btn {
      border: none;
      width: 135px;
    }

  }

  /*其他登录方式*/
  .other-login {
    .mixin_ui(@margin: 10px 0 0 0);
    li {
      line-height: 35px;
      font-size: 20px;
      text-align: center;
      color: #FFF;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
    }
    /* 更多登录方式按钮 */
    .more-login-button {
      border-radius: 50%;
    }
  }

  .footer-content {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    ul {
      .mixin_ui();
      li {
        margin: 0 10px;
        .fa {
          margin-right: 5px;
        }
        a {
          text-decoration: none;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
</style>

<!-- 全局样式 -->
<!--<style lang="less">
  /* el checkbox 组件 */
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate
    /* 图标 */
  .el-checkbox__inner{
    background-color: #009F95;
    border-color: #009F95;
  }
  /* 字体 */
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #009F95;
  }
  .el-checkbox.is-bordered.is-checked{
    border-color: #009F95;
  }
  /* 取消选中的图标边框 */
  .el-checkbox__input.is-focus .el-checkbox__inner{
    border-color: #009F95;
  }
</style>-->
