/**
 * 设置用户到聊天列表第一行
 * @param list 列表
 * @param user 用户
 */
export const toFirst = (list, user) => {
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
