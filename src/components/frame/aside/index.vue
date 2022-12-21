<template>
  <!--侧边栏-->
  <div class="container">

    <!-- 左侧 logo -->
    <aside-logo />

    <!--  左侧菜单  -->
    <div class="menu-bar">
      <asideMenu />
    </div>

  </div>
</template>

<script>
import asideLogo from "./AsideLogo";
import asideMenu from "./AsideMenu";

export default {
  name: "index",
  components: {
    asideLogo,
    asideMenu
  }
}
</script>

<style lang="less" scoped>
  /* logo 高度 */
  @logo-height: 60px;

  .container {
    /* 滚动条生效 */
    height: 100%;
    /* 菜单 */
    .menu-bar {
      height: calc(100% - @logo-height);
      /* 新增属性，设置滚动条不占位置，火狐不生效 */
      overflow-y: overlay;
      overflow-x: hidden;
    }
  }
</style>
