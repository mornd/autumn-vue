<template>
  <!--侧边栏-->
  <div id="aside-container">

    <!-- 左侧 logo -->
    <aside-logo />

    <!--  左侧菜单  -->
    <div class="menu-bar">
      <aside-menu />
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

  #aside-container {
    /* 滚动条生效 */
    height: 100%;
    /* 菜单 */
    .menu-bar {
      height: calc(100% - @logo-height);
      /* 新增属性，设置滚动条不占位置，google，edge支持，火狐不支持 */
      overflow-y: overlay;
      overflow-x: hidden;
    }
  }
</style>
