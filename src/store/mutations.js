import tokenUtil from '@/utils/tokenUtil'
import themeUtil from '@/utils/themeUtil'

export default {
  //设置主题
  SET_THEME: (state, theme) => {
    state.theme = theme
    themeUtil.setTheme(theme)
  },
  //设置token
  SET_TOKEN: (state, token) => {
    state.tokenStr = token
    tokenUtil.setToken(token)
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
  }
}