import jsCookie from 'js-cookie';

const tokenKey = 'autumn_token_key';
const expires = 3; // day

/**
 * 设置token的保存方式
 */
export default {
  getToken: () => {
    return jsCookie.get(tokenKey)
  },
  setToken: (token) => {
    return jsCookie.set(tokenKey, token, {expires})
  },
  removeToken: () => {
    jsCookie.remove(tokenKey)
  }
}