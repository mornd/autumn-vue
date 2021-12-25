<template>
  <div class="container">
    <div class="error-block">
      <div class="text-center">
        <img src="~@/assets/images/exception/403.svg" alt="" />
      </div>
      <div class="text-center">
        <p>抱歉，你无权访问该页面</p>
        <el-button type="primary" size="small" @click="goHome">回到首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotAuth",
    methods: {
      goHome() {
        this.$router.push(this.$store.state.homePath)
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
  .error-block {
    width: 400px;
    margin: 20px auto;
    text-align: center
  }
  .text-center {
  p {
    color: #666;
    padding: 10px 0;
  }
  }
  }
</style>