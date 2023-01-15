import { setToken } from '@/utils/tokenUtil'
import { setTheme, setMenuCollapse } from '@/constants/preferenceSetting'
import { generateAvatar } from "@/utils/userUtil";
import { toFirst } from "@/utils/chatUtil";
import api from "@/utils/api"
import Vue from 'vue'
import {toFirstChooseById} from "../utils/chatUtil";

export default {
  //设置主题
  SET_THEME: (state, theme) => {
    state.theme = theme
    setTheme(theme)
  },
  //设置token
  SET_TOKEN: (state, token) => {
    state.tokenStr = token
    setToken(token)
  },
  //保存用户信息
  SET_USER: (state, user) => state.user = user,
  //保存主页菜单
  SET_MENU_ROUTES: (state, menus) => state.menuRoutes = menus,
  //菜单数据加载完毕
  MENU_LOADING_COMPLETE: state => {
    state.menu.loadingComplete = true
  },
  TOGGLE_COLLAPSE: (state) => {
    state.isCollapse = !state.isCollapse
    setMenuCollapse(state.isCollapse)
  },
  //清除用户所有本地的数据
  LOGOUT: (state) => {
    //清空浏览器 storage 中的数据
    window.localStorage.clear()
    window.sessionStorage.clear()
    state.menuRoutes = []
    state.user = null
    state.roles = []
    state.permissions = []
    // 这里chat需要给每个属性复制默认值，否则会有问题
    if(state.chat.stomp) {
      // 需要先关闭之前的连接
      state.chat.stomp.disconnect()
    }
    state.chat = {
      stomp: undefined,
      // 侧边栏按钮选中
      asideBarActive: 'chat',
      // 我的通讯录好友
      allFriends: null,
      // 最近聊天好友
      recentUsers: null,
      // 当前选中的聊天好友
      selectedUser: null,
      // 会话信息
      session: {},
      // 用户列表搜索关键字
      userSearch: '',
      userListScrollTop: true
    }
  },
  //更换头像
  SET_USER_AVATAR(state, url) {
    state.user.avatar = generateAvatar(url)
  },
  //修改用户的一些基本信息（用于用户自己修改自己的信息）
  SET_USER_BASE_INFO(state, user) {
    //将修改后的用户信息同步至state中
    for (const key in user) {
      state.user[key] = user[key]
    }
  },

  // chat
  SET_ALL_CHAT_FRIENDS (state, data) {
    state.chat.allFriends = data
  },
  SET_RECENT_CHAT_USERS(state, data) {
    state.chat.recentUsers = data
  },
}
