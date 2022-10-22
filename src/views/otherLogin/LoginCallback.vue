<template>
  <div v-loading.fullscreen.lock="fullscreenLoading"></div>
</template>

<script>
import jsCookie from 'js-cookie'

export default {
  name: "LoginCallback",
  data() {
    return {
      fullscreenLoading: true
    }
  },
  mounted() {
    this.fullscreenLoading = true
    const uuid = jsCookie.get('other-login-uuid')
    const code = this.$route.query.code
    if(uuid !== undefined && code !== undefined) {
      console.log(`gitee登录uuid=${uuid},code=${code}`);
      // 登录信息
      const userInfo = {
        uuid,
        code,
        source: 'gitee'
      }
      this.$store.dispatch('loginByGitee', userInfo).then(() => {
        this.$router.push({path: this.redirect || this.$store.state.homePath}).catch(() => {})
      }).catch(() => {
      })
    } else {
      this.$alert('参数不能为空，请重试', '提示', {
        confirmButtonText: '前往登录页面',
        type: 'warning'
      }).then(res => {
        this.$router.replace('/login');
      });
    }
  }
}
</script>

<style scoped>

</style>
