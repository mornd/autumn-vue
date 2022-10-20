export default {
  //登录用户信息
  user: (state) => state.user,
  //主题样式
  themeStyle: state => {
    return {'backgroundColor': state.theme}
  },
  //角色列表
  roles: (state) => {
    let roles = state.user.roles
    return roles ? roles.filter(i => i.code).map(i => i.code) : []
  },
  //权限菜单列表
  permissions: (state) => {
    let permissions = state.user.permissions
    return permissions ? permissions.filter(i => i.code).map(i => i.code) : []
  },
  //登录名
  loginName: (state) => state.user ? state.user.loginName : '',
  //菜单路由
  menuRoutes: (state) => state.menuRoutes,
}
