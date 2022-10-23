import { setToken } from '@/utils/tokenUtil'
import { setTheme } from '@/utils/themeUtil'
//使用js方式动态导入本地图片
import defaultAvatar from '@/assets/images/avatar/defaultAvatar.png' // 用户未选择头像时展示的默认图片

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
    // 处理用户头像
    if(url) {
      if(!url.startsWith('http')) {
        // 使用本地文件
        url = process.env.VUE_APP_BASE_API + url
      }
    } else {
      url = defaultAvatar
    }
    state.user.avatar = url
  },
  //修改用户的一些基本信息（用于用户自己修改自己的信息）
  SET_USER_BASE_INFO(state, user) {
    //将修改后的用户信息同步至state中
    for (const key in user) {
      state.user[key] = user[key]
    }
  }
}
