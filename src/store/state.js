import tokenUtil from '@/utils/tokenUtil'
import themeUtil from '@/utils/themeUtil'

export default {
  //标题
  title: 'Autumn Office',
  //主题
  theme: themeUtil.getTheme(),
  //token
  tokenStr: tokenUtil.getToken(),
  //是否收起左侧菜单
  isCollapse: false,
  //当前登录用户信息
  user: null,
  //路由菜单
  menuRoutes: [],
  //主页路由path值
  homePath: '/home',
  //主页路由name值
  homeName: 'Frame',
  menu: {
    loadingComplete: false,
    //菜单按钮类型
    menuType: {
      catalogue: 0,
      menu: 1,
      button: 2
    },
  },

  state: {
    //启用
    enabled: 1,
    //禁用
    disabled: 0,
  },

  //操作类型
  operation: {
    add: 'add',
    edit: 'edit',
    see: 'see'
  },

  hiddenFlag: {
    //显示
    display: 1,
    //隐藏
    hidden: 0
  },
}
