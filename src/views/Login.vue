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
     class="login-container"
    >

      <!--表单标题-->
      <p class="title" :style="{color : theme}">{{ title }}</p>

      <!--表单描述-->
      <p class="desc">越 秀 区 最 具 影 响 力 的 设 计 规 范 之 一</p>

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

      <el-form-item>
        <el-checkbox v-model="loginForm.remember" :style="cTheme">记住我</el-checkbox>
        <span :style="{color: theme, 'float': 'right'}">
            <span style="cursor: pointer">忘记密码</span>
            <span>&emsp;|&emsp;</span>
            <span @click="changeLogin()" style="cursor: pointer">短信验证登录</span>
          </span>
      </el-form-item>

      <el-form-item>
        <!--提交按钮-->
        <el-button
          type="primary"
          class="submitBtn"
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
          Copyright © 2021
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
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { encrypt } from '@/utils/secret'
  import { isNotBlank } from '@/utils/validate'

  export default {
    name: "Login",
    data() {
      //表单校验
      const checkUsername = (rule, value, callback) => {
        if(isNotBlank(value)) {
          if(value.length <= this.maxLength) {
            callback()
          } else {
            callback(new Error('账号长度过长'))
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
      return {
        //验证码加载遮罩
        captchaLoad: true,
        //验证码url
        captchaUrl: '',
        //表单登录属性
        loginForm: {
          username: 'tom', //'tom',
          password: '000', //'000',
          code: '',
          uuid: '',
          remember: false
        },
        //整个页面加载遮罩
        loading: false,
        //账号密码长度约束
        minLength: 3,
        maxLength: 20,
        //非空验证 与prop属性对应
        rules:{
          username: [{validator: checkUsername, trigger:"blur"}],
          password: [{validator: checkPassword, trigger:"blur"}],
          code: [{required:true, message:"请输入验证码", trigger:"change"}]
        },
      }
    },
    mounted() {
      this.getCaptcha();
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

      //表单提交
      submitForm() {
        if(!this.loading) {
          //与ref属性对应
          this.$refs['loginForm'].validate(valid => {
            if (valid) {
              //加载动画
              this.loading = true
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
                  //存储用户token
                  const tokenStr = res.data.tokenHead + res.data.token;
                  this.$store.commit('SET_TOKEN', tokenStr);
                  this.$router.replace(this.homePath);
                }else{
                  //登录失败
                  this.loginForm.code = '';
                  this.getCaptcha();
                  this.loading = false;
                }
              })
            } else {
              //表单验证不通过
              this.$message.warning('请重新校验必填项');
              return false;
            }
          });
        }
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
    .login-container {
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
    .submitBtn {
      border: none;
      width: 100%;
      font-size: 15px;
      font-weight: bold;
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
