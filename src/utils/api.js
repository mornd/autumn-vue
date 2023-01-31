import axios from 'axios'
import store from '@/store'
import { Message, Notification, MessageBox } from 'element-ui'
import { getToken } from "@/utils/tokenUtil";

let readyToExit = false //是否是准备退出状态，防止多次弹出token过期的提示

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests 跨域是否带Token
  //timeout: 10000 // request timeout ms
});

//请求拦截器
service.interceptors.request.use(
    config => {
      //config.headers['Content-Type'] = 'application/json;charset=utf-8';
      //如果存在token，则请求头携带token
      if(getToken()){
        config.headers['Authorization'] = getToken();
      }
      return config
    },
    error => {
      console.log('axios请求发送异常：' + error);
      return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
      if(response){
        //console.log(response);
        if(response.status && response.status === 200){
          if(response.data.success && response.data.code == 200){
            if(response.data.message){
              Notification.success({
                title: response.data.message,
                position: 'bottom-right'
              })
            }
          }
          if(response.data.code == 401){
            Notification.error({
              title: '401：您未登录或token已过期',
            });
            store.dispatch('tokenExpirationExit')
          }
          if(response.data.code == 403){
            let msg = response.data.message
            Notification.error({
              title: (msg ? msg : '403：您的权限不足')
            })
          }
          if(response.data.code == 500){
            let msg = response.data.message
            Notification.error({
              title: (msg ? msg : '500：服务器异常')
            })
          }
          if(response.data.code == 600){
            Notification.error({
              title: '参数校验错误：',
              message: response.data.message,
            })
          }
          return response.data
        }else{
          Message.error('连接异常！')
        }
      }else{
        Message.error('服务器未响应结果！')
      }
    },
    error => {
      console.log(error);
      let errMsg = ''
      if(error.response.status === 401) {
        //退出操作
        const excludeUrl = error.response.request.responseURL;
        if((excludeUrl.indexOf('userLogout')) >= 0) {
          store.dispatch('tokenExpirationExit')
        } else {
          if(!readyToExit) {
            readyToExit = true
            MessageBox.confirm('登录状态已过期，你可以继续留在该页面，或者重新登录', '系统提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              readyToExit = false
              store.dispatch('tokenExpirationExit')
            }).catch(() => {
              readyToExit = false
            });
          }
        }
      } else if(error.response.status === 500) {
        errMsg = '后端服务正在重启或已宕机！'
      }else if(error.response.status === 404){
        errMsg = '请求地址不存在！'
      }else if(error.response.status === 400){
        errMsg = '错误请求，请求参数类型或数量不匹配！'
      }else if(error.response.status === 403){
        errMsg = '您的权限不足！'
      }else if(error.response.status === 405){
        errMsg = '请求方式不匹配！'
      } else {
        if(error.message){
          errMsg = error.message
        }else{
          errMsg = '未知错误！'
        }
      }
      Message.error(errMsg)
      return Promise.reject(error)
    }
)

/*网络请求*/

export default {
  getRequest: (url, params) => {
    return service({
      method: 'get',
      url,
      params
    })
  },

  postRequest: (url, data) => {
    return service({
      method: 'post',
      url,
      data
    })
  },

  putRequest: (url, data) => {
    return service({
      method: 'put',
      url,
      data
    })
  },

  deleteRequest: (url, params) => {
    return service({
      method: 'delete',
      url,
      params
    })
  },

  download: (url, params) => {
    return service({
      method: 'post',
      url,
      params,
      responseType: 'blob'
    })
  }
};

export { service };
