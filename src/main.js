import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/css/base.css' //引入asset全局css样式
import '@/assets/css/costom.css'
import '@/assets/css/plugins.css'
import '@/assets/css/animations.css'

import 'font-awesome/css/font-awesome.css';
import '@/plugins/element-ui';

Vue.config.productionTip = false

import api from '@/utils/api';

Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

//安装less：npm install less
//安装less-loader： npm install less-loader@7
//导入进度条：npm install --save nprogress
