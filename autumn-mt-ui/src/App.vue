<template>
  <div id="app">
    <router-view />

    <el-dialog title="绑定手机" :visible.sync="dialogVisible" width="80%" >
      <el-form ref="dataForm" :model="bindPhoneVo" size="small">
        <h4>绑定你的手机号，建立系统关联关系</h4>
        <el-form-item label="手机号码">
          <el-input v-model="bindPhoneVo.phone"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" icon="el-icon-check" @click="saveBind()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import userInfoApi from '@/api/userInfo'
export default {
  data() {
    return {
      show: true,
      dialogVisible: false,
      bindPhoneVo: {
        openId: '',
        phone: ''
      }
    };
  },

  created() {
    // 处理微信授权登录
    this.wechatLogin();
  },

  methods: {
    clear() {
      window.localStorage.setItem('token', '')
      this.bindPhoneVo = {}
    },
    wechatLogin() {
      // 处理微信授权登录
      let token = this.getQueryString('token') || '';
      let openId = this.getQueryString('openId') || '';
      if(token === '' && openId !== '') {
        // 绑定账号
        this.bindPhoneVo.openId = openId
        this.dialogVisible = true
      } else {
        // 如果绑定了，授权登录直接返回token
        if(token === '') {
          // http://localhost:9002/#/
          let url = window.location.href
          // 直接访问后端服务
          window.location = process.env.VUE_APP_SERVER_URL
              // encodeURIComponent函数是将特殊字符#进行编码
              + '/process/wechatMT/authorize?backUrl=' + encodeURIComponent(url)
        } else {
          window.localStorage.setItem('token', token);
        }
      }
    },

    saveBind() {
      if(this.bindPhoneVo.phone.length != 11) {
        alert('手机号码格式不正确')
        return
      }
      userInfoApi.bindPhone(this.bindPhoneVo).then(response => {
        window.localStorage.setItem('token', response.data);
        this.dialogVisible = false
        // 回到移动端主页面
        window.location = process.env.VUE_APP_URL
      })
    },

    getQueryString (paramName) {
      // window.location.href = http://localhost:9002/#/
      if(window.location.href.indexOf('?') === -1) return '';

      let searchString = window.location.href.split('?')[1];
      let i, val, params = searchString.split("&");

      for (i=0;i<params.length;i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
          return val[1];
        }
      }
      return '';
    }
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
