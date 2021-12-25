const getFormatMenus = (router, menus, parentName) => {
  return menus.map(menu => {
    //递归处理子集
    if (menu.children instanceof Array && menu.children.length) {
      getFormatMenus(router, menu.children, parentName);
    }

    //设置元数据
    menu.meta = {
      'title': menu.title,
      'requireAuth': menu.requireAuth,
      'keepAlive': menu.keepAlive
    }

    //isRoute为1代表是路由菜单
    //component代表数据库存储组件的相对路径（必填，且component路径与前端路径一致，区分大小写）
    //path代表前端路由对象的path（必填）
    if (menu.isRoute === 1 && menu.component) {
      menu.component = loadView(menu.component)
    }
    router.addRoute(parentName, menu)
    return menu
  })
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
  //return resolve => require([`@/views/${view}`], resolve)
}

export{ getFormatMenus, loadView }