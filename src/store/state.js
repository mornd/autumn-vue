import { getToken } from '@/utils/tokenUtil'
import { getTheme } from '@/utils/themeUtil'
import { title, logo, homePath, homeName } from '@/constants/systemConsts'

export default {
  //系统名
  title,
  logo,
  //主题
  theme: getTheme(),
  //token
  tokenStr: getToken(),
  //是否收起左侧菜单
  isCollapse: false,
  //当前登录用户信息
  user: null,
  //路由菜单
  menuRoutes: [],
  //主页路由path值
  homePath: homePath,
  //主页路由name值
  homeName: homeName,
  menu: {
    loadingComplete: false,
  },
  //菜单按钮类型
  menuType: {
    catalogue: 0,//目录 菜单的父集合
    menu: 1, //菜单 点击可跳转
    button: 2 //权限按钮 //菜单的权限
  },

  enabledState: {
    //启用
    enabled: 1,
    //禁用
    disabled: 0,
  },

  //操作类型常量字符串
  operation: {
    add: 'add',
    edit: 'edit',
    see: 'see'
  },
  badgeFlag: true //新增或编辑窗口小徽章显示flag
}
