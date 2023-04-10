import assetsDefaultAvatar from '@/assets/images/avatar/defaultAvatar.png'
import assetsErrorAvatar from '@/assets/images/avatar/errorAvatar.png'

export const title = 'Autumn Office'
export const logo = 'fa fa-fort-awesome'
export const homePath = '/home' //主页路由path值
export const homeName = 'Frame' //主页路由name值
export const rootMenuId = '0' //菜单根节点的id值
export const role_prefix = 'ROLE_' //角色编码自动拼接的前缀
export const rootUserId = '1425004256210038785' // 根系统用户id
export const superAdminId = '1425011630752735234' //超级管理员id
export const weather_key = '809fb9af7f07405abd842020047bf68c' //请求天气api的key
export const gender = {male: 1, female: 0}
export const hiddenFlag = {display: 1, hidden: 0} //1：显示 0：隐藏

/**
 * 系统默认头像
 */
export const defaultAvatar = assetsDefaultAvatar
/**
 * 头像加载失败显示的内容
 */
export const errorAvatar = assetsErrorAvatar
