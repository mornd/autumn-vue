import axios from "axios";
import store from "../store";

// 创建axios实例
const service = axios.create({
  //baseURL: '/api',
  baseURL: process.env.VUE_APP_SERVER_URL,
  timeout: 150000 // 请求超时时间
});

// http request 拦截器
service.interceptors.request.use(config => {
    const token = window.localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
// http response 拦截器
service.interceptors.response.use(response => {
      if (response.data.code == 200) {
        return response.data;
      } else if(response.data.code == 401) {
        //alert('token不存在或已过期，请重新登录')

        if(!store.state.bindPhone) {
          let url = window.location.href
          window.location = process.env.VUE_APP_SERVER_URL + '/process/wechatMT/authorize?backUrl='
              + encodeURIComponent(url)
        }
      } else {
        alert(response.data.message || "api error");
        return response.data;
        //return Promise.reject(response);
      }
  },
  error => {
    return Promise.reject(error.response);   // 返回接口返回的错误信息
  });

export default service;
