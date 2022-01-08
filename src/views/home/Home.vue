<template>
  <div class="home">
    <router-link to="/system/permission">菜单测试</router-link>
    <br>
    <br>
    <div>
      <button @click="btn()" ref="btn">{{msg}}</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      msg:"原始值",
    }
  },
  methods: {
    btn(){
      this.msg="修改后的值";
      this.$nextTick(() => {
        console.log(this.$refs.btn.innerText);
      })
    }
  }
}
</script>

<style scoped>
</style>
