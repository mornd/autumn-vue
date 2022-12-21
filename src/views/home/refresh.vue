<template>
  <!-- 空页面，负责中转到目标页面 -->
  <div></div>
</template>

<script>
export default {
  name: "refresh",
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$router.replace(from.path)
    })
  }
}
</script>

<style scoped>

</style>
