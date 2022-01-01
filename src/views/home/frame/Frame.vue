<template>
  <!--主容器-->
  <el-container class="container">
    <!--用于处理Frame组件的其他操作-->
    <frame-operations/>

    <!--左侧内容-->
    <el-aside :width="isCollapse ? '64px' : '250px'" class="el-aside">

      <!--左侧菜单-->
      <aside-menu class="aside-menu"/>

    </el-aside>

    <el-container>

      <!--头部-->
      <el-header>

        <!--头部工具栏-->
        <header-bar/>

      </el-header>

      <!--头部面包屑-->
      <header-bread-crumb/>

      <!--中间主体-->
      <el-main class="el-main">

        <!--路由过渡动画-->
        <transition name="slide-fade">
          <!--路由占位符-->
          <router-view class="router-view"/>
        </transition>

      </el-main>

      <!--底部-->
      <el-footer height="10px"/>

    </el-container>

  </el-container>
</template>

<!--<div style="min-height: calc(100vh - 10px)"></div>-->
<script>
  import {mapState} from 'vuex'
  import AsideMenu from '@/components/frame/AsideMenu'
  import HeaderBar from '@/components/frame/header/HeaderBar'
  import HeaderBreadCrumb from '@/components/frame/HeaderBreadCrumb'
  import FrameOperations from './FrameOperations'

  export default {
    name: 'Frame',
    components: {
      AsideMenu,
      HeaderBar,
      HeaderBreadCrumb,
      FrameOperations
    },
    computed: {
      ...mapState(['isCollapse'])
    }
  }
</script>

<style lang="less" scoped>
  /*滚动条隐藏*/
  /*::-webkit-scrollbar{
    display:none;
  }*/

  //主容器
  .container {
    height: 100%;
    overflow: hidden;

    //侧边栏
    .el-aside {
      height: 100%;
      overflow: hidden;
      background-color: #28333E;
      box-shadow:5px 5px 5px rgba(0, 0, 0, .2);
      .aside-menu {
        overflow: auto;
      }
    }

    //中间主体
    .el-main {
      box-sizing: border-box;
      padding: 0 10px 0 10px;

      /*路由占位符*/
      .router-view {
        padding: 10px 0;
        height: 100%;
        border-radius: 5px;
        overflow: hidden;
        box-sizing: border-box;
        background-color: #F5F5F5;
      }
    }
  }

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
