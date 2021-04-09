import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives' // 把自定义指令全部引入
import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 批量注册自定义指令
// console.log(directives)
// 对象转为数组，拿到数组的每一个value作为指令名，value名对应的对象作为内容对象
Object.keys(directives).forEach(value => {
  // console.log(directives[value]) // 每个指令对象的 内容
  Vue.directive(value, directives[value])
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
