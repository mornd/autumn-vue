import jsCookie from 'js-cookie';

const tokenKey = 'autumn_token_key';
const expires = 3; // day

/**
 * 设置token的保存方式
 */

export const getToken = () => {
  return jsCookie.get(tokenKey)
}

export const setToken = (token) => {
  return jsCookie.set(tokenKey, token, {expires})
}

export const removeToken = () => {
  jsCookie.remove(tokenKey)
}