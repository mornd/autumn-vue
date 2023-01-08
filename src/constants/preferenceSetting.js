import { defaultTheme } from '@/constants/themeConst'

/**
 * 偏好设置
 */

/**
 * 主题
 * @type {string}
 */
//缓存key
export const themeKey = 'autumn_theme'

export const getTheme = () => {
  // localStorage  可永久保存
  // sessionStorage 一旦页面叉掉，浏览器会自动清空
  const value = window.localStorage.getItem(themeKey)
  return value == null ? defaultTheme : value
}

export const setTheme = (value) => {
  localStorage.setItem(themeKey, value)
}

export const removeTheme = () => {
  localStorage.removeItem(themeKey)
}

/**
 * 菜单是否折叠
 */
export const menuCollapseKey = 'menu_collapse'

export const getMenuCollapse = () => {
  const value = localStorage.getItem(menuCollapseKey)
  return value == null ? false : JSON.parse(value)
}

export const setMenuCollapse = (value) => {
  localStorage.setItem(menuCollapseKey, value)
}
