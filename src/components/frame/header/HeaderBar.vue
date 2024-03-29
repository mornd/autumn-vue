<template>
  <!--头部工具组件-->
  <div class="header">
    <!--头部左侧图标列表-->
    <ul>
      <li :title="isCollapse ? '展开菜单' : '收起菜单'" @click="toggleCollapse" @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
      </li>
      <li @click="refresh" title="刷新" @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <i class="el-icon-refresh"></i>
      </li>
    </ul>
    <!--头部右侧图标列表-->
    <ul>
      <li @click="handleFullScreen" :title="fullscreen ? '退出全屏' : '全屏'" @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <i :class="fullscreen ? 'el-icon-close' : 'el-icon-full-screen'"></i>
      </li>
      <li :title="getUnread > 0 ? '在线聊天(' + getUnread + '条未读消息)' : '在线聊天'" @click="toChat" @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <el-badge :value="getBadge(getUnread)" :hidden="$route.path === '/wechat' || getUnread <= 0">
          <i class="el-icon-chat-dot-round" />
        </el-badge>
      </li>
      <li title="通知" @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <el-popover
            ref="notifyPopover"
            placement="bottom-end"
            title=""
            width="370"
            trigger="click"
        >
          <process-notification @close="closeNotifyPopover"></process-notification>
          <div slot="reference">
<!--            <el-badge :value="$store.getters.unreadNotifyCount" :hidden="$store.getters.unreadNotifyCount <= 0">-->
<!--              <i class="el-icon-bell" />-->
<!--            </el-badge>-->
            <el-badge>
              <div class="notify-badge" v-if="$store.getters.unreadNotifyCount > 0"></div>
              <i class="el-icon-bell" />
            </el-badge>
          </div>
        </el-popover>
      </li>
      <!--天气-->
      <li @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <el-popover
            placement="bottom-end"
            title=""
            width="450"
            popper-class="weather-popover"
            trigger="hover"
        >
          <weather-plugin :width="450" :height="150"></weather-plugin>
          <div slot="reference">
            <i class="el-icon-heavy-rain"></i>
          </div>
        </el-popover>
      </li>
      <li class="user-info-li">
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <!--用户头像-->
            <el-avatar
              :src="user.avatar"
              @error="avatarLoadingFailure"
              :size="30"
              fit="fill"
              class="user_face"
            >
              <!--图片加载失败显示的默认图片-->
              <img :src="errorAvatar" alt="">
            </el-avatar>
            <!--用户名-->
            <span v-text="loginName"></span>
          </div>
          <template slot="dropdown">
            <el-dropdown-menu>
              <el-dropdown-item command="userInfo" icon="el-icon-s-custom">个人中心</el-dropdown-item>
              <el-dropdown-item command="setting" icon="el-icon-setting">系统设置</el-dropdown-item>
              <el-dropdown-item command="exit" icon="el-icon-switch-button" divided>注销登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </li>
      <li title="更多" @click="drawerVisible = true" @mouseover="addActive($event)" @mouseout="removeActive($event)">
        <i class="el-icon-s-operation"></i>
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
  import { mapState, mapGetters } from 'vuex';
  import MoreDrawer from './moreDrawer/MoreDrawer'
  import NowDate from '@/components/gadgets/NowDate'
  import weatherPlugin from './WeatherPlugin'
  import { defaultAvatar, errorAvatar } from "@/constants/systemConsts";
  import {getBadge} from "@/utils/chatUtil";
  import ProcessNotification from "./ProcessNotification";

  export default {
    name: "HeaderBar",
    components: {
      MoreDrawer,
      NowDate,
      weatherPlugin,
      ProcessNotification,
    },
    data() {
      return {
        //浏览器是否全屏展示
        fullscreen: false,
        drawerVisible: false,
        //用户未选择头像时展示的默认图片
        defaultAvatar,
        //图片路径错误显示的图片
        errorAvatar,
        getBadge
      }
    },
    mounted() {
      let that = this
      window.onresize = function(){
        if(!that.checkFull()){
          that.fullscreen = false
        }
      }
    },
    computed: {
      //获取当前登录用户信息
      ...mapState(['user', 'isCollapse', 'theme', 'chat']),
      ...mapGetters(['loginName']),
      // 获取chat未读消息总数
      getUnread() {
        let count = 0
        let arr = this.chat.recentUsers
        if(arr) {
          for(let i = 0; i< arr.length; i++) {
            if(arr[i].unread > 0) {
              count += arr[i].unread
            }
          }
        }
        return count === 0 ? undefined : count
      }
    },
    methods: {
      //展开收起菜单
      toggleCollapse() {
        this.$store.commit('TOGGLE_COLLAPSE')
      },
      // 刷新页面
      refresh() {
        this.$router.push({path: '/refresh'})
      },
      // 在线聊天功能
      toChat() {
        this.$router.push('/wechat')
      },
      closeNotifyPopover() {
        this.$refs.notifyPopover.doClose();
      },
      checkFull() {
        //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
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
        return isFull
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
            this.$confirm('此操作将注销登录, 是否继续?', '系统提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$store.dispatch('logout')
            }).catch(() => {});
            break;
        }
      },
      //用户头像加载失败回调
      avatarLoadingFailure(e){
        this.$message.error('用户头像加载失败');
        return true
      },
      // 下边框边粗提示
      addActive($event) {
        $event.currentTarget.style.borderBottom = `3.5px solid ${this.theme}`;
      },
      removeActive($event) {
        $event.currentTarget.style.borderBottom = '';
      }
    }
  }
</script>

<!--因为popover组件默认与App.vue组件在同一级，所以需要设置全局样式，这里的style标签去除了scoped属性-->
<style lang="less">
  /deep/ .el-badge__content {
    background: green;
  }

  .weather-popover {
    background: #F5F5F5;
    padding: 5px;
  }
</style>

<style lang="less" scoped>
  //按钮列表宽度
  @li-width: 50px;
  //头部整体高度
  @li-height: 60px;

  /*头部*/
  .header{
    display: flex;
    /*align-items: center;*/
    /*去除头部内边距多余的空格*/
    justify-content: space-between;
    box-sizing: border-box;
    height: @li-height;
    //用户头像及名称
    .user-info-li {
      padding: 0 10px;
      .user-info {
        cursor: pointer;
        margin-top: 15px;
        //用户头像
        .user_face {
          margin-right: 10px;
          width: 30px;
          height: 32px;
          background-color: #FFF;
          box-shadow: 0 0 2px rgb(0 21 41 / 35%);
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
        }
      }
    }

    .notify-badge {
      width: 10px;
      height: 10px;
      background: #FA5151;
      border-radius: 50%;
      position: absolute;
      top: 18px;
      left: 8px
    }
  }
</style>


<style scoped>
>>> .el-badge__content {
  background-color: #FA5151;
  border-radius: 10px;
  color: #FFF;
  display: inline-block;
  font-size: 1%;
  height: 14px;
  line-height: 14px;
  padding: 0 4px;
  text-align: center;
  white-space: nowrap;
  transform: translateY(100%) translateX(95%);
  border: none;
}
</style>
