import { setToken } from '@/utils/tokenUtil'
import { setTheme, setMenuCollapse } from '@/constants/preferenceSetting'
import { generateAvatar } from "@/utils/userUtil";
import { toFirst } from "@/utils/chatUtil";
import Vue from 'vue'

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
  //登出操作
  LOGOUT: (state) => {
    state.menuRoutes = []
    state.user = null
    state.roles = []
    state.permissions = []
    state.chat = {}
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
  // 设置用户到第一行
  CHAT_TO_FIRST(state, user) {
    toFirst(state.chat.recentUsers, user)
  },
  //  设置聊天用户到第一行并选中
  CHAT_TO_FIRST_CHOOSE(state, user) {
    toFirst(state.chat.recentUsers, user)
    state.chat.selectedUser = user
    state.chat.asideBarActive = 'chat'
  },
}
