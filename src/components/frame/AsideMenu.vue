<template>
  <!--左侧菜单组件-->
  <div class="container">

    <!--左侧logo-->
    <aside-logo />

    <!--获取菜单请求之前的加载动画-->
    <div v-if="!menu.loadingComplete"
     class="Before-loading"
    >
      <i class="el-icon-loading" :style="{color: theme}"></i>
    </div>

    <!--
      router：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
      unique-opened：是否只保持一个子菜单的展开
      default-active：默认选中展开的菜单
      default-openeds：当前打开的 sub-menu 的 index 的数组
      active-text-color：当前激活菜单的文字颜色（仅支持 hex 格式）
      collapse-transition：是否开启折叠动画
    -->
    <transition name="slide-fade"><!--过渡动画-->
      <el-menu
        router
        unique-opened
        :default-active="$route.path"
        background-color="#28333E"
        text-color="#FFFFFFB3"
        :active-text-color="theme"
        :collapse="isCollapse"
        v-if="menuRoutes.length"
        :collapse-transition="false"
        style="border-right: none"
      >
        <template v-for="item in menuRoutes">
          <template v-if="item.menuType == menuType.catalogue">
            <el-submenu :index="item.id" :disabled="item.enabled == enabledState.disabled">
              <template #title>
                <i :class="item.icon" class="icon-right"></i>
                <span>{{ item.title }}</span>
              </template>
              <!--子菜单-->
              <el-menu-item
                      v-for="lower in item.children"
                      :key="lower.id"
                      :index="lower.path"
                      :disabled="lower.enabled === enabledState.disabled">
                <template #title>
                  <i :class="lower.icon" class="icon-right"></i>
                  <span>{{ lower.title }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </template>
          <template v-else-if="item.menuType == menuType.menu">
            <el-menu-item :index="item.path" :disabled="item.enabled === enabledState.disabled">
              <i :class="item.icon" class="icon-right"></i>
              <template #title>{{ item.title }}</template>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </transition>

    <!--菜单数据为空时展示-->
    <div
      v-if="menu.loadingComplete && !menuRoutes.length"
      class="empty-text"
    >
      <p v-if="!isCollapse">空空如也!</p>
      <i v-else class="fa fa-inbox"></i>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import AsideLogo from '@/components/frame/AsideLogo'

  export default {
    name: "AsideMenu",
    components: {AsideLogo},
    computed: {
      //获取vuex中菜单数据 用于菜单遍历
      ...mapState(['isCollapse', 'theme', 'menu', 'menuType', 'enabledState']),
      ...mapGetters(['menuRoutes'])
    }
  }
</script>

<style lang="less" scoped>
  //文字颜色
  @color: #FFFFFFB3;

  .icon-right {
    margin: 0 18px 0 5px;
  }

  .Before-loading {
    text-align: center;
    margin-top: 5px;
    font-size: 25px;
  }

  .empty-text {
    margin-top: 20px;
    text-align: center;
    color: @color;
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(5px);
    opacity: 0;
  }

</style>
