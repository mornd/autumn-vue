import { setToken } from '@/utils/tokenUtil'
import { setTheme } from '@/utils/themeUtil'
import { generateAvatar } from "@/utils/userUtil";
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
  TOGGLE_COLLAPSE: (state) => state.isCollapse = !state.isCollapse,
  //登出操作
  LOGOUT: (state) => {
    state.menuRoutes = []
    state.user = null
    state.roles = []
    state.permissions = []
  },
  //设置页面只加载一次的徽章
  SET_BADGEFLAG(state, flag) {
    state.badgeFlag = flag
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
  changeSelectChatUser (state, key) {
    Vue.set(state.isDot, state.user.loginName + '#' + key.loginName, false)
    state.selectChatUser = key;
  },

  SEND_CHAT_MESSAGE (state, messageObj) {
    let ses = state.sessions[state.user.loginName + '#' + messageObj.to]
    if(!ses) {
      // state.sessions[state.user.loginName + '#' + messageObj.to] = []
      Vue.set(state.sessions, state.user.loginName + '#' + messageObj.to, [])
    }
    state.sessions[state.user.loginName + '#' + messageObj.to].push({
      content: messageObj.content,
      date: new Date(),
      self: messageObj.self
    })
  },

  INIT_CHAT_FRIENDS (state, data) {
    let localRecord = localStorage.getItem('vue-chat-session')
    if(localRecord) {
      state.sessions = JSON.parse(localRecord)
    }
    state.chatUserList = data
  }

}
