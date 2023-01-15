import Vue from 'vue'

// npm 安装elementUI    npm i element-ui -S
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//Vue.use(ElementUI, {size: 'small'})
Vue.use(ElementUI)

/*图片裁剪*/
import VueCropper from 'vue-cropper'
Vue.use(VueCropper)

// 右键菜单
import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu)
