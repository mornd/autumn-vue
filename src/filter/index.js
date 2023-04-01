import { generateAvatar } from "@/utils/userUtil";

/**
 * 根据头像路径区分是否查询本地后端
 */
export const avatar = (value) => {
  return generateAvatar(value)
}

/**
 *  格式化后端的 LocalDateTime 类型
 * @param value
 * @returns {*}
 */
export const localDateTime = (value) => {
  return value ? value.replace('T', ' ') : value;
}

/**
 * 去除后端 LocalDaTeTime 类型的时分秒
 * @param value
 * @returns {string|*}
 */
export const localDate = (value) => {
  if(value) {
    let index = value.indexOf('T')
    if(index >= 0) {
      return value.substring(0, index)
    } else {
      return value.substring(0, value.indexOf(' '))
    }
  }
  return value
}
