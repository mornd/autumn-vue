<template>
  <div id="app">
    <router-view />
    <el-dialog title="绑定手机" :visible.sync="$store.state.bindPhone" width="80%" >
      <el-form ref="dataForm" :model="bindPhoneVo" size="small">
        <h4>首次访问需要输入你的手机号码，建立系统关联关系</h4>
        <el-form-item>
          <el-input v-model="bindPhoneVo.phone" clearable placeholder="请输入你的手机号码"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" @click="saveBind()" size="small">确 定</el-button>
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
      bindPhoneVo: {
        openId: '',
        phone: ''
      },
      loading: false
    };
  },
  created() {
    // 处理微信授权登录
    this.wechatLogin();
  },
  methods: {
    wechatLogin() {
      // 处理微信授权登录
      let token = this.getQueryString('token') || '';
      let openId = this.getQueryString('openId') || '';
      if(token == '' && openId != '') {
        // 绑定账号
        this.bindPhoneVo.openId = openId
        this.$store.state.bindPhone = true
      } else {
        if(token == '') {
          if(!window.localStorage.getItem('token')) {
            // 如果回调url中token没有值，并且本地token没有缓存记录则执行：
            // http://localhost:9002/#/
            let url = window.location.href
            // 直接访问后端服务
            window.location = process.env.VUE_APP_SERVER_URL
                // encodeURIComponent函数是将特殊字符#进行编码
                + '/process/wechatMT/authorize?backUrl=' + encodeURIComponent(url)
          }
        } else {
            window.localStorage.setItem('token', token)
        }
      }
    },
    saveBind() {
      if(this.bindPhoneVo.phone.length != 11) {
        alert('手机号码格式不正确')
        return
      }
      this.loading = true
      userInfoApi.bindPhone(this.bindPhoneVo).then(response => {
        this.loading = false
        if(response.success) {
          window.localStorage.setItem('token', response.data);
          this.$store.state.bindPhone = false
          // 回调移动端主页面
          window.location = process.env.VUE_APP_URL
        }
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
