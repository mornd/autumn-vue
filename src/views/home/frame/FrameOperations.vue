<template>
  <!--进入Frame组件中用于处理Frame的其他操作-->
  <div>
  </div>
</template>

<script>
  import {leavePageRefreshInterval} from '@/constants/securityConsts'

  export default {
    name: "FrameOperation",
    data() {
      return {
        refreshStartTime: 0
      }
    },
    /*mounted() {
      this.refreshStartTime = Date.now()
      document.addEventListener('visibilitychange', this.handleVisiable)
    },
    methods: {
      handleVisiable(e) {
        if (e.target.visibilityState === 'visible') {
          let now = Date.now()
          //当离开页面多久后再次进入，页面自动会刷新
          if(now - this.refreshStartTime > leavePageRefreshInterval) {
            this.$router.go()
          }

        }
      }
    },*/
    destroyed() {
      //销毁事件，用户从主页退出到登录d页后，该事件将被销毁
      document.removeEventListener('visibilitychange', this.handleVisiable)
    },
  }
</script>

<style scoped>

</style>