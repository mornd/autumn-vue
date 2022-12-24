import router from '@/router'
import api from "@/utils/api"
import {getFormatMenus} from "@/utils/menuUtil"
import { removeToken } from '@/utils/tokenUtil'
import { Notification } from 'element-ui';
import { getToken } from '@/utils/tokenUtil'
import Vue from 'vue'

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  //设置用户的角色、权限
  setUser({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      api.getRequest('/sysUser/getLoginUser').then(res => {
        if(res.success) {
          let userInfo = res.data
          if(userInfo && userInfo.id) {
            //存储用户信息
            commit('SET_USER', userInfo)
            // 处理头像
            commit('SET_USER_AVATAR', userInfo.avatar)
            //  建立在线聊天连接
            dispatch('chatConnect')

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
  },

  // gitee 登录
  loginByGitee({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      api.postRequest('/loginByGitee', userInfo).then(res => {
        if(res.success) {
          //存储用户token
          const tokenStr = res.data.tokenHead + res.data.token
          commit('SET_TOKEN', tokenStr)
          if(res.data.msg) {
            Notification.warning({
              title: '系统提示',
              dangerouslyUseHTMLString: true,
              message: '<p style="color: teal">' + res.data.msg + '</p>',
              offset: 100
            })
          }
          resolve()
        }
      }).catch(err => {
        reject(err)
      })
    })
  },

  // chat
  // 初始化所有聊天好友
  initChatFriends (context) {
    api.getRequest('/chat/users').then(res => {
      if(res.success) {
        context.commit('INIT_CHAT_FRIENDS', res.data)
      }
    })
  },
  // 建立 webSorct 连接
  chatConnect({ state, commit }) {
    state.stomp = Stomp.over(new SockJS('/ws/endPoint'))
    const token = getToken()
    state.stomp.connect({'Authorization': token}, success => {
      //  订阅消息频道，这里的 /user 前缀是固定的
      state.stomp.subscribe('/user/queue/chat', message => {
        console.log(message.body);
        let receiveMessage = JSON.parse(message.body)
        if(!state.selectChatUser || receiveMessage.from != state.selectChatUser.loginName) {
          Notification.success({
            title: `[${receiveMessage.fromName}]发来一条消息`,
            message: receiveMessage.content.length > 10 ? receiveMessage.content.substr(0, 10) : receiveMessage.content
          })
          // 小红点
          Vue.set(state.isDot, state.user.loginName + '#' + receiveMessage.from, true)

        }
        receiveMessage.self = false
        receiveMessage.to = receiveMessage.from
        commit('SEND_CHAT_MESSAGE', receiveMessage)
      })
    }, error => {
      console.log(error);
      Notification.error('无法建立在线聊天：' + error)
    })
  }
}
