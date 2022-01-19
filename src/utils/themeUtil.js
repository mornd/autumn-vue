import jsCookie from 'js-cookie';
import { defaultTheme } from '@/constants/themeConst'
const expires = 3; // day

//缓存key
export const themeKey = 'autumn_theme'

export const getTheme = () => {
  return jsCookie.get(themeKey) ? jsCookie.get(themeKey) : defaultTheme
}

export const setTheme = (theme) => {
  return jsCookie.set(themeKey, theme, {expires})
}

export const removeTheme = () => {
  jsCookie.remove(themeKey)
}