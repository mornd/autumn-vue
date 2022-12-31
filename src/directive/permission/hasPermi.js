 /**
 * v-hasPermi 操作权限处理
 * Copyright (c) 2019 ruoyi
  * html 页面添加指令参数时，多个以逗号分隔
 */

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const permissions = store.getters && store.getters.permissions

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => permissionFlag.includes(permission))

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
