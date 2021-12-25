<template>
  <!-- 面包屑效果 -->
  <div class="header_crumbs">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: $store.state.homePath }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.path !== '/home'">
        {{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "HeaderBreadCrumb"
  }
</script>

<style scoped>
  /*面包屑*/
  .header_crumbs{
    padding: 10px 20px 10px 20px;
  }
</style>