import store from '@/store'

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
  let exists = undefined
  for (let i = 0; i < list.length; i++) {
    if(user.id === list[i].id) {
      exists = list[i]
      // 删除
      list.splice(i, 1)
      break
    }
  }
  if(exists) {
    if(user.lastMessage) {
      exists.lastMessage = user.lastMessage
    }
    if(user.lastDate) {
      exists.lastDate = user.lastDate
    }
    // exists.unread = 0 时，badge 隐藏会很慢，改为 undefined 会快些
    if(user.unread <= 0) {
      exists.unread = undefined
    }
    user = exists
  } else {
    if(!user.lastDate) {
      user.lastDate = new Date()
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
    let chatExist = false
    if(!chat.recentUsers) {
      chat.recentUsers = []
    }
    // 找最近聊天用户列表
    for (let i = 0; i< chat.recentUsers.length; i++) {
      if(id === chat.recentUsers[i].id) {
        // 将自己放置第一行并选中
        store.commit('CHAT_TO_FIRST_CHOOSE', chat.recentUsers[i])
        chatExist = true
        break
      }
    }
    if(!chatExist) {
      // 不存在则去所有用户中查找
      for(let i = 0; i < chat.allFriends.length; i++) {
        if(id === chat.allFriends[i].id) {
          if(!chat.allFriends[i].lastDate) chat.allFriends[i].lastDate = new Date()
          store.commit('CHAT_TO_FIRST_CHOOSE', chat.allFriends[i])
          break
        }
      }
    }
  }
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


