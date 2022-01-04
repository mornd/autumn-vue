import store from '@/store'
const getFormatMenus = (router, menus, parentName) => {
  return menus.map(menu => {
    //递归处理子集
    if (menu.children instanceof Array && menu.children.length) {
      getFormatMenus(router, menu.children, parentName);
    }
    //将菜单转换为路由对象
    const route = generateRoute(menu)
    //path相同可覆盖 重复路由的component指向第一个路由的
    router.addRoute(parentName, route)
    return menu
  })
}

const generateRoute = (menu) => {
  menu.name = menu.title

  //component代表数据库存储组件的相对路径（必填，且component路径与前端路径一致，区分大小写）
  //path代表前端路由对象的path（必填）
  if(store.state.menuType.menu == menu.menuType) {//是否是路由菜单
    if(menu.component) {
      menu.component = loadView(menu.component)
    }
    if(!menu.path.startsWith('/')) {
      menu.path = '/' + menu.path
    }
  } else if(!menu.path) {
    //如果是非路由菜单类型，并且path属性为null时，此时添加路由会报错
    menu.path = ''
  }
  //设置元数据
  menu.meta = {
    'title': menu.title,
    'auth': menu.requireAuth,
    'keepAlive': menu.keepAlive
  }
  return menu
}

/**
 * 路由懒加载
 * @param view 组件路径
 * @returns {function(*): (Promise<*>|*)} 返回组件路由
 */
const loadView = (view) => {
  if(view.startsWith('/')){
    view = view.slice(1, view.length)
  }
  return () => import(`@/views/${view}`)
}

export{ getFormatMenus, loadView }