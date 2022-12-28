/**
 *
 * @param value
 * @returns {string}
 */
export const chatDateFormatter = (value) => {
  let result = ''
  if(value) {
    // hour：时 min：分 sec：秒 millisec：毫秒
    const day = new Date(value).setHours(0, 0, 0, 0)
    const date = new Date(value)
    const today = new Date().setHours(0, 0, 0, 0)
    const sub = day - today
    const hourAndMinu = date.getHours() + ':' + date.getMinutes().toString().padStart(2, '0')
    if(sub == 0) {
      // 今天   17:07
      // padStart() = 分钟小于10在前面补0
      result = hourAndMinu
    } else if(sub == -86400000) {
      // 昨天
      result = `昨天 ${hourAndMinu}`
    } else {
      // 其它  2022/12/25
      const year = date.getFullYear().toString()
      result = `${year.substring(year.length - 2)}/${date.getMonth() + 1}/${date.getDate()}`
    }
  }
  return result
}
