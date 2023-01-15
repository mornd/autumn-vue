import store from '@/store'
import api from "@/utils/api"

/**
 * 格式化未读消息红点显示的内容
 * @param value
 * @returns {*|string}
 */
export const getBadge = (value) => {
  return value ? (value < 100) ? value : '99+' : value
}

/**
 * 设置用户到聊天列表第一行
 * @param list 列表
 * @param user 用户
 */
export const toFirst = (user) => {
  let list = store.state.chat.recentUsers
  for (let i = 0; i < list.length; i++) {
    if(user.id === list[i].id) {
      // 删除
      list.splice(i, 1)
      break
    }
  }
  list.unshift(user)
}

/**
 * 根据聊天用户的id将该用户聊天放置第一行，并选择
 * @param id
 */
export const toFirstChooseById = (id) => {
  const chat = store.state.chat
  store.state.chat.asideBarActive = 'chat'
  // 当前选择的聊天不是自己
  if(chat.selectedUser == null || chat.selectedUser.id !== id) {
    if(!chat.recentUsers) {
      chat.recentUsers = []
    }
    let exists = false
    // 找最近聊天用户列表
    for (let i = 0; i< chat.recentUsers.length; i++) {
      if(id === chat.recentUsers[i].id) {
        // 将自己放置第一行并选中
        toFirstChoose(chat.recentUsers[i])
        exists = true
        break
      }
    }
    if(!exists) {
      // 不存在则去所有用户中查找
      for(let i = 0; i < chat.allFriends.length; i++) {
        if(id === chat.allFriends[i].id) {
          if(!chat.allFriends[i].lastDate) chat.allFriends[i].lastDate = new Date()
          toFirstChoose(chat.allFriends[i])
          break
        }
      }
    }
  } else {
    if(chat.selectedUser.unread > 0) {
      chat.selectedUser.unread = undefined
      api.putRequest(`/chat/read/${chat.selectedUser.loginName}`).then(res => {})
    }
  }
}

/**
 * 根据聊天的对象将该用户聊天放置第一行，并选择
 * @param user
 */
export const toFirstChoose = (user) => {
  // 已读消息
  if(user.unread > 0) {
    // 这里的 user 对象需保证是 recentUsers 数组里面的
    user.unread = undefined
    api.putRequest(`/chat/read/${user.loginName}`).then(res => {})
  }

  toFirst(user)
  store.state.chat.selectedUser = user
  store.state.chat.asideBarActive = 'chat'
}

/**
 * 清空当前选中聊天用户，最近聊天用户，所有聊天消息
 */
export const clearChatInfo = () => {
  store.state.chat.selectedUser = null
  store.state.chat.recentUsers = null
  store.state.chat.session = {}
}


/**
 * 浏览器缓存相关
 */

const sessionCacheKey = 'chat-session'
const recentCacheKey = 'chat-recentUsers'
const allFriendsCacheKey = 'chat-allFriends'

export const setSessionCache = (value) => {
  sessionStorage.setItem(sessionCacheKey, JSON.stringify(value))
}

export const getSessionCache = () => {
  return sessionStorage.getItem(sessionCacheKey)
}

export const setRecentUsersCache = (value) => {
  sessionStorage.setItem(recentCacheKey, JSON.stringify(value))
}

export const getRecentUsersCache = () => {
  return sessionStorage.getItem(recentCacheKey)
}

export const setAllFriendsCache = (value) => {
  sessionStorage.setItem(allFriendsCacheKey, JSON.stringify(value))
}

export const getAllFriendsCache = () => {
  return sessionStorage.getItem(allFriendsCacheKey)
}


