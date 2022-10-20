<template>
  <div v-loading="loading" style="height: 100%; width: 100%">
    登录中...
  </div>
</template>

<script>
import jsCookie from 'js-cookie'

export default {
  name: "LoginCallback",
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.loading = true
    const uuid = jsCookie.get('other-login-uuid')
    console.log('gitee登录uuid=', uuid);
    const userInfo = {
      uuid: uuid,
      code: this.$route.query.code,
      source: 'gitee'
    }
    this.$store.dispatch('otherLoginByGitee', userInfo).then(() => {
      this.$router.push({path: this.redirect || this.$store.state.homePath}).catch(() => {})
    }).catch(() => {
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>
