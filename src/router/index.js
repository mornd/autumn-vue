import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";

//导入页面顶部加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//取消页面刷新时的圈
NProgress.configure({ showSpinner: false });

import {getToken} from "@/utils/tokenUtil";
import {Notification} from "element-ui";


Vue.use(VueRouter)

const routes = [
  {
    //登录界面
    path: '/login',
    name: 'Login',
    meta: {title: '登录'},
    component: () => import('@/views/Login')
  },
  {
    //第三方登录回调界面
    path: '/giteeLoginCallback',
    name: '',
    meta: {title: '登录中...'},
    component: () => import('@/views/otherLogin/LoginCallback')
  },
  {
    //主体布局
    path: '/',
    name: 'Frame',
    redirect: store.state.homePath,
    component: () => import('@/views/home/frame/Frame'),
    children: [
      {
        //主页
        path: 'home',
        name: 'Home',
        meta: {title: '首页'},
        component: () => import('@/views/home/Home'),
      },
      {
        path: 'personalCenter',
        meta: {title: '个人中心'},
        component: () => import('@/views/home/personalCenter/PersonalCenter')
      },
      {
        path: 'systemSettings',
        meta: {title: '系统设置'},
        component: () => import('@/views/home/SystemSettings')
      },
      {
        path: '403',
        name: 'NotAuth',
        meta: {title: '403'},
        component: () => import('@/views/errorPage/NotAuth.vue'),
      },
      {
        path: '404',
        name: 'NotFound',
        meta: {title: '404'},
        component: () => import('@/views/errorPage/NotFound.vue'),
      },
      {
        path: '500',
        name: 'Exception',
        meta: {title: '500'},
        component: () => import('@/views/errorPage/Exception.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes
})

// 在路由完成初始导航时调用，如果有异步操作放置到这里
router.onReady(() => {
  console.group('%c%s', 'color:#409EFF', `${new Date().getTime()}  ----------路由完成初始导航----------`)
  console.log('路由记录列表长度：', router.getRoutes().length)
  console.groupEnd()
})

// 免登录白名单
const whiteList = ['/login', '/giteeLoginCallback']

/**
 * 路由前置导航
 * to：将要去哪个页面
 * from：从那个页面过来
 * next：放行到哪个页面
 */
router.beforeEach((to, from, next) => {
  NProgress.start();
  //验证浏览器缓存中是否存在Token
  if(getToken()) {
    if(store.getters.user == null) {
      //当前store中没有user信息，则发送请求获取
      store.dispatch('setUser').then(res => {
        if(!store.getters.menuRoutes.length) {
          //获取左侧菜单及路由菜单信息
          store.dispatch('setMenuRoutes').then(res => {
            if (to.path === '/login') {
              //如果已登录，不可再跳至登录页
              next(store.state.homePath)
            } else {
              next({...to, replace: true})
            }
          })
        }
      }, err => {
        //获取用户数据异常，系统退出
        store.dispatch('tokenExpirationExit')
        Notification.error({ title: err });
      })
    } else {
      if(!to.matched.length) {
        //不存在的路径，跳至404页面
        next({path: '/404'})
      } else {
        next()
      }
    }
  } else {
    if(whiteList.indexOf(to.path) !== -1) {
      // 白名单直接放行
      next()
    } else if(to.path === '/' || to.path.startsWith('/index')) {
      next('/login')
    } else {
      next(`/login?redirect=${to.fullPath}`)
    }
  }
})

/**
 * 路由后置钩子
 * to：将要去哪个页面
 * from：从那个页面过来
 */
router.afterEach((to, from) => {
  //配置浏览器title值
  let title = to.meta.title
  document.title = title ? title : 'Mornd_Autumn'
  NProgress.done();
})

//解决编程式路由往同一地址跳转时会报错的情况
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
//push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch(err => err)
};
//replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch(err => err)
};

export default router
