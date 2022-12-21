import assetsDefaultAvatar from '@/assets/images/avatar/defaultAvatar.png'
import assetsErrorAvatar from '@/assets/images/avatar/errorAvatar.png'

/**
 * 系统默认头像
 */
export const defaultAvatar = assetsDefaultAvatar
/**
 * 头像加载失败显示的内容
 */
export const errorAvatar = assetsErrorAvatar

/**
 * 根据头像路径区分是否查询本地后端
 */
export const generateAvatar = (avatar) => {
  if(avatar) {
    if(avatar.startsWith('http')) {
      return avatar
    } else {
      // /api
      const urlPrefix = process.env.VUE_APP_BASE_API
      // 使用后端本地文件
      return (avatar.startsWith(urlPrefix))
          ? avatar : urlPrefix.concat(avatar)
    }
  } else {
    return defaultAvatar
  }
}

