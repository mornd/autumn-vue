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
    if(user.unread <= 0) {
      exists.unread = undefined
    }
    user = exists
  }
  list.unshift(user)
}
