import { generateAvatar } from "@/utils/userUtil";

/**
 * 根据头像路径区分是否查询本地后端
 */
export const avatar = (value) => {
  return generateAvatar(value)
}
