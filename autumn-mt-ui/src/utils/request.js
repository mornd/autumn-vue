import axios from "axios";

// 创建axios实例
const service = axios.create({
  //baseURL: '/api',
  baseURL: process.env.VUE_APP_SERVER_URL,
  timeout: 150000 // 请求超时时间
});

// http request 拦截器
service.interceptors.request.use(config => {
    let token = window.localStorage.getItem("token") || "";
    if (token != "") {
      config.headers["Authorization"] = 'Bearer ' + token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
// http response 拦截器
service.interceptors.response.use(response => {
  //alert(JSON.stringify(response))
    if (response.data.code == 401) {
      // debugger
      // 替换# 后台获取不到#后面的参数
      let url = window.location.href
      window.location = process.env.VUE_APP_SERVER_URL + '/process/wechatMT/authorize?backUrl='
          + encodeURIComponent(url)
    } else {
      if (response.data.code == 200) {
        return response.data;
      } else {
        alert(response.data.message || "error");
        return Promise.reject(response);
      }
    }
  },
  error => {
    return Promise.reject(error.response);   // 返回接口返回的错误信息
  });

export default service;
