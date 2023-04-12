import request from '@/utils/request'


export default {

  bindPhone(bindPhoneVo) {
    return request({
      url: `/process/wechatMT/bindPhone`,
      method: 'post',
      data: bindPhoneVo
    })
  },

  getCurrentUser() {
    return request({
      url: `/sysUser/getLoginUser`,
      method: 'get'
    })
  },
}
