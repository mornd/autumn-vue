import { defaultAvatar, errorAvatar } from "@/constants/systemConsts";

/**
 * 根据头像路径区分是否查询本地后端
 */
export const generateAvatar = (avatar) => {
  if(avatar) {
    if(avatar.startsWith('http') || avatar.startsWith('/assets/')) {
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
