import router from '@/router'
import api from "@/utils/api"
import {getFormatMenus} from "@/utils/menuUtil"
import { removeToken } from '@/utils/tokenUtil'
import { Notification } from 'element-ui';
import { Message } from 'element-ui';
import { getToken } from '@/utils/tokenUtil'
import {toFirst} from "@/utils/chatUtil";

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default {
  //设置用户的角色、权限
  setUser({ commit, dispatch, state }) {
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

            // 加载最近聊天用户和所有用户
            if(this.state.chat.recentUsers == null) {
              dispatch('getRecentChatUsers')
            }
            if(this.state.chat.allFriends == null) {
              dispatch('getAllChatFriends')
            }
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
    //删除cookie数据
    removeToken()
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

  /**
   * chat
   */
  // 初始化所有聊天好友
  getAllChatFriends (context) {
    api.getRequest('/chat/allFriends').then(res => {
      if(res.success) {
        context.commit('SET_ALL_CHAT_FRIENDS', res.data)
      }
    })
  },
  getRecentChatUsers(context) {
    api.getRequest('/chat/getRecentUsers').then(res => {
      if(res.success) {
        context.commit('SET_RECENT_CHAT_USERS', res.data)
      }
    })
  },

  // 建立 webSocket 连接
  chatConnect({ state, commit }) {
    const url = process.env.VUE_APP_SERVER_URL + '/ws/endPoint'
    const sock = new SockJS(url)
    state.chat.stomp = Stomp.over(sock)
    const token = getToken()
    state.chat.stomp.connect({'Authorization': token}, success => {
      //  订阅消息频道，这里的 /user 前缀是固定的
      state.chat.stomp.subscribe('/user/queue/chat', message => {
        let receiveMessage = JSON.parse(message.body)
        const chat = state.chat
        if(receiveMessage.success && state.user.loginName === receiveMessage.to) {
          // 聊天列表是否已经聊过天
          if(chat.selectedUser && chat.selectedUser.loginName === receiveMessage.from
              && (window.location.pathname === '/wechat' || window.location.pathname === '/fullwechat')) {
            chat.selectedUser.lastDate = receiveMessage.date
            chat.selectedUser.lastMessage = receiveMessage.content
            api.putRequest(`/chat/read/${receiveMessage.from}`).then(res => {})
          } else {
            const subLength = 60
            Notification.info({
              title: `${receiveMessage.fromName}:`,
              dangerouslyUseHTMLString: true,
              message: receiveMessage.content.length > subLength ? `${receiveMessage.content.substr(0, subLength)}...` : receiveMessage.content,
              offset: 90
            })
            let chatExist = false
            if(!chat.recentUsers) {
              chat.recentUsers = []
            }
            for (let i = 0; i< chat.recentUsers.length; i++) {
              if(receiveMessage.from === chat.recentUsers[i].loginName) {
                if(chat.recentUsers[i].unread > 0) {
                  // 设置未读消息个数
                  chat.recentUsers[i].unread++
                } else {
                  chat.recentUsers[i].unread = 1
                }
                chat.recentUsers[i].lastDate = receiveMessage.date
                chat.recentUsers[i].lastMessage = receiveMessage.content
                toFirst(chat.recentUsers[i])
                chatExist = true
                break
              }
            }
            if(!chatExist) {
              // 不存在则去所有用户中查找
              for(let i = 0; i < chat.allFriends.length; i++) {
                if(receiveMessage.from === chat.allFriends[i].loginName) {
                  chat.allFriends[i].unread = 1
                  chat.allFriends[i].lastDate = receiveMessage.date
                  chat.allFriends[i].lastMessage = receiveMessage.content
                  toFirst(chat.allFriends[i])
                  break
                }
              }
            }
          }
          // 会话中新增一条消息
          receiveMessage.self = false
          const sessionKey = `${state.user.loginName}#${receiveMessage.from}`
          if(!chat.session[sessionKey]) {
            // 当前不存在聊天记录，但还需要查询之前的聊天
            api.getRequest(`/chat/getSession/${receiveMessage.from}`).then(res => {
              if(res.success) {
                chat.session[sessionKey] = res.data
              }
            })
          } else {
            chat.session[sessionKey].push(receiveMessage)
          }
        } else {
          // todo 消息发送失败，在本地聊天记录显示感叹号
          const sessionKey = chat.session[receiveMessage.from + '#' + receiveMessage.to]
          if(sessionKey && sessionKey.length > 0) {
            // 最后一条消息
            const lastMessage = sessionKey[sessionKey.length - 1]
            if(lastMessage.self && receiveMessage.from === lastMessage.from
                && receiveMessage.to === lastMessage.to
                && receiveMessage.content === lastMessage.content) {
              lastMessage.failure = true
              // 替换操作
              sessionKey.splice((sessionKey.length - 1), 1, lastMessage)
            }
          }
          Message.error('消息发送失败，' + receiveMessage.failureMsg ? receiveMessage.failureMsg : '')
        }
      })
    }, error => {
      //state.chat.stomp.initWebSocket()
      console.log(error);
      Notification.error('无法构建在线聊天，连接失败')
      setTimeout(() => {
        // todo 10s后重新连接一次
      }, 10000)
    })
  }
}
