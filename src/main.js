import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/base.css' //引入asset全局css样式
import '@/assets/css/costom.css'
import '@/assets/css/plugins.css'
import '@/assets/css/animations.css'

// 引入阿里矢量图标库，使用时还需加上类名： iconfont
import '@/assets/iconfont/alibaba/iconfont.css'

import 'font-awesome/css/font-awesome.css';
import '@/plugins/plugins';

import directive from './directive' // directive

import api from '@/utils/api';

Vue.use(directive)
Vue.prototype.$api = api;

// 注册全局过滤器
import * as filters from '@/filter/index'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//安装less：npm install less
//安装less-loader： npm install less-loader@7
//导入进度条：npm install --save nprogress
