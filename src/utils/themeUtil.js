import jsCookie from 'js-cookie';
const expires = 3; // day

//缓存key
export const themeKey = 'autumn_theme'

//默认主题
export const defaultTheme = '#409EFF' //String

export const getTheme = () => {
  return jsCookie.get(themeKey) ? jsCookie.get(themeKey) : defaultTheme
}

export const setTheme = (theme) => {
  return jsCookie.set(themeKey, theme, {expires})
}

export const removeTheme = () => {
  jsCookie.remove(themeKey)
}