<template>
  <!--头部工具组件-->
  <div class="header">
    <!--头部左侧图标li-->
    <ul>
      <li :title="isCollapse ? '展开菜单' : '收起菜单'" @click="toggleCollapse">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"/>
      </li>
      <li @click="$router.go()" title="刷新">
        <i class="el-icon-refresh"/>
      </li>
    </ul>
    <!--头部右侧图标li-->
    <ul>
      <li @click="handleFullScreen" :title="fullscreen ? '退出全屏' : '全屏'">
        <i :class="fullscreen ? 'el-icon-close' : 'el-icon-full-screen'"/>
      </li>
      <li title="天气：小雨">
        <i class="el-icon-heavy-rain"/>
      </li>
      <li title="通知">
        <i class="el-icon-bell"/>
      </li>
      <li class="user-info-li">
        <el-dropdown @command="handleCommand" class="user-info">
          <div class="el-dropdown-link">
            <!--用户头像 src默认未加载图片路径-->
            <el-avatar :size="30" src="" @error="avatarLoadingFailure" class="user_Face">
              <!--图片加载失败显示的默认图片-->
              <img src="../../../assets/images/avatar/user1.png">
            </el-avatar>
            <!--<el-avatar :size="30" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" @error="() => true" class="user_Face">
              &lt;!&ndash;图片加载失败显示的默认图片&ndash;&gt;
              <img src="../../assets/images/avatar/default.png">
            </el-avatar>-->

            <!--用户名-->
            <span v-text="$store.getters.loginName"></span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="userInfo" icon="el-icon-s-custom">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting" icon="el-icon-setting">系统设置</el-dropdown-item>
              <el-dropdown-item command="exit" icon="el-icon-switch-button" divided>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li title="更多" @click="more()">
        <i class="el-icon-s-operation"/>
      </li>
    </ul>

    <!--右侧抽屉组件-->
    <el-drawer
            width="100px"
            title="更多"
            :size="'20%'"
            :visible.sync="drawerVisible"
            :show-close="false"
            destroy-on-close
            direction="rtl">
      <div v-if="drawerVisible" slot="title" :style="{color: theme, fontSize: 15 + 'px'}">
        <NowDate/>
      </div>
      <!--更多选项中的抽屉组件-->
      <more-drawer style="margin-top: -16px"/>
    </el-drawer>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import MoreDrawer from './moreDrawer/MoreDrawer'
  import NowDate from '@/components/gadgets/NowDate'

  export default {
    name: "HeaderBar",
    components: {MoreDrawer, NowDate},
    data() {
      return {
        //浏览器是否全屏展示
        fullscreen: false,
        drawerVisible: false
      }
    },
    created() {
      let that = this
      window.onresize = function(){
        if(!that.checkFull()){
          that.fullscreen = false;
        }
      }
    },
    computed: {
      //获取当前登录用户信息
      ...mapState(['user', 'isCollapse', 'theme']),
    },
    methods: {
      //展开收起菜单
      toggleCollapse() {
        this.$store.commit('TOGGLE_COLLAPSE')
      },
      checkFull() {
        //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
        //火狐浏览器
        let isFull = document.mozFullScreen ||
            document.fullScreen ||
            //谷歌浏览器及Webkit内核浏览器
            document.webkitIsFullScreen ||
            document.webkitRequestFullScreen ||
            document.mozRequestFullScreen ||
            document.msFullscreenEnabled
        if (isFull === undefined) {
          isFull = false
        }
        return isFull;
      },
      //浏览器全屏事件
      handleFullScreen(){
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen();
          }
        }
        this.fullscreen = !this.fullscreen;
      },
      /*用户信息下拉列表点击*/
      handleCommand(command) {
        switch (command) {
          case 'userInfo':
            this.$router.push('/personalCenter');
            break;
          case 'setting':
            this.$router.push('/systemSettings');
            break;
          case 'exit':
            this.$confirm('此操作将注销登录, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$store.dispatch('logout')
            });
            break;
        }
      },
      //用户头像加载失败回调
      avatarLoadingFailure(){
        this.$message.error('用户头像加载失败！');
        return true;
      },
      more() {
        this.drawerVisible = true
      }
    }
  }
</script>

<style lang="less" scoped>
  @li-width: 50px;
  @li-height: 60px;

  /*头部*/
  .header{
    display: flex;
    /*align-items: center;*/
    /*去除头部内边距多余的空格*/
    justify-content: space-between;
    border-bottom: 1px #F5F5F5 solid;
    box-sizing: border-box;
    overflow: hidden;
    //用户头像及名称
    .user-info-li {
      padding: 0 10px;
      cursor: pointer;
      .user-info {
        margin-top: 15px;
        //用户头像
        .user_Face {
          margin-right: 10px;
          width: 30px;
          height: 32px;
          background-color: #FFF;
          vertical-align: middle;
          position: relative;
        }
      }
    }

    //头部图标ul li
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      justify-content: space-between;
      li:not(.user-info-li) {
        width: @li-width;
        text-align: center;
        line-height: @li-height;

        //鼠标移至头部icon
        &:hover {
          background-color: #F7F7F7;
          /*border-bottom: 3px solid #46D800;*/
        }
      }
    }
  }
</style>
