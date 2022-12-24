import { defaultTheme } from '@/constants/themeConst'

//缓存key
export const themeKey = 'theme'

export const getTheme = () => {
  // localStorage  可永久保存
  // sessionStorage 一旦页面叉掉，浏览器会自动清空
  const theme = window.localStorage.getItem(themeKey)
  return theme ? theme : defaultTheme
}

export const setTheme = (theme) => {
  localStorage.setItem(themeKey, theme)
}

export const removeTheme = () => {
  localStorage.removeItem(themeKey)
}
