<template>
  <div class="home">
    <h3>home</h3>
    <router-link to="/system/permission">菜单测试</router-link>
    <el-button @click="consoleRouter">查看router</el-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  methods: {
    consoleRouter() {
      console.log(this.$router);
    }
  }
}
</script>

<style scoped>
</style>
