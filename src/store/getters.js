export default {
  //登录用户信息
  user: (state) => state.user,
  //角色列表
  roles: (state) => state.user.roles || [],
  //权限菜单列表
  permission: (state) => state.user.permissions || [],
  //登录名
  loginName: (state) => state.user ? state.user.loginName : '',
  //菜单路由
  menuRoutes: (state) => state.menuRoutes,
}