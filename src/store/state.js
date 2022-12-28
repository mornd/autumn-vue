import { getToken } from '@/utils/tokenUtil'
import { getTheme, getMenuCollapse } from '@/constants/preferenceSetting'
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
  isCollapse: getMenuCollapse(),
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
    badgeFlag: true, //新增或编辑窗口小徽章显示flag
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
  badgeFlag: true, //新增或编辑窗口小徽章显示flag

  // chat 聊天
  stomp: undefined,
  chat: {
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

}
