import request from '@/utils/request'

const api_name = '/process'

export default {

  findProcessType(page, limit) {
    return request({
      url: `/processType/findTypeAndTemplateList?pageNo=${page}&pageSize=${limit}`,
      method: 'get'
    })
  },

  getProcessTemplate(processTemplateId) {
    return request({
      url: `/processTemplate/get/${processTemplateId}`,
      method: 'get'
    })
  },

  startUp(processFormVo) {
    return request({
      url: `${api_name}/startup`,
      method: 'post',
      data: processFormVo
    })
  },

  findPending(page, limit) {
    return request({
      url: `${api_name}/findPending?pageNo=${page}&pageSize=${limit}`,
      method: 'get'
    })
  },

  show(id) {
    return request({
      url: `${api_name}/show/${id}`,
      method: 'get'
    })
  },

  approve(approvalVo) {
    return request({
      url: `${api_name}/approve`,
      method: 'post',
      data: approvalVo
    })
  },


  findProcessed(page, limit) {
    return request({
      url: `${api_name}/findProcessed?pageNo=${page}&pageSize=${limit}`,
      method: 'get'
    })
  },

  findStarted(page, limit) {
    return request({
      url: `${api_name}/findStarted?pageNo=${page}&pageSize=${limit}`,
      method: 'get'
    })
  },



}
