import router from '@/router'
import api from "@/utils/api"
import {getFormatMenus} from "@/utils/menuUtil"
import { removeToken } from '@/utils/tokenUtil'
import { removeTheme } from '@/utils/themeUtil'

export default {
  //设置用户的角色、权限
  setUser({ commit }) {
    return new Promise((resolve, reject) => {
      api.getRequest('/sysUser/getLoginUser').then(res => {
        if(res.success) {
          let userInfo = res.data
          if(userInfo) {
            //存储用户信息
            commit('SET_USER', userInfo)
            resolve(userInfo)
          } else {
            reject('获取用户信息失败，请重试！')
          }
        }
      })
    })
  },

  //初始化菜单，并将数据添加至vue-router中
  setMenuRoutes({ commit, state }) {
    return new Promise(resolve => {
      api.getRequest('/permission/leftTree').then(res => {
        if(res.success){
          //菜单数据加载完毕
          commit('MENU_LOADING_COMPLETE')
          //得到后台返回的菜单数据
          let menus = res.data;
          if(!(menus && menus.length)){
            menus = []
          }
          //新增主页菜单
          menus.unshift({
            path: state.homePath,
            icon: 'fa fa-home',
            title: '首页',
            menuType: state.menuType.menu,
          })
          let formatMenus = getFormatMenus(router, menus, state.homeName);
          commit('SET_MENU_ROUTES', formatMenus)
          resolve()
        }
      })
    })
  },

  //退出系统
  logout({ getters, dispatch }) {
    console.log('用户正在执行退出命令，用户名：', getters.loginName);
    return new Promise((resolve, reject) => {
      api.postRequest('userLogout').then(res => {
        //调用下一个actions
        dispatch('tokenExpirationExit')
        //继续要做的操作
        resolve()
      }).catch(err => {
        reject(err)
      });
    })
  },
  //快速退出，不请求后台，用于前端与后台会话过期处理
  tokenExpirationExit({ commit, getters }) {
    //清空sessionStorage中的数据
    window.sessionStorage.clear();
    //删除cookie数据
    removeToken()
    //removeTheme()
    //清空vuex中的菜单信息
    commit('LOGOUT')
    //跳转到登录页
    router.replace('/login');
    //location.reload()
    console.log('退出成功');
  },

  // gitee 登录
  otherLoginByGitee({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      api.post('/loginByGitee', userInfo).then(res => {
        if(res.success) {
          //存储用户token
          const tokenStr = res.data.tokenHead + res.data.token
          commit('SET_TOKEN', tokenStr)
          resolve()
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}
