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
import Component from '@/components' // 导入自定义的全局插件
import * as filters from '@/filters/index' // 导入全部过滤器
import Print from 'vue-print-nb'
import checkPermission from '@/mixin/checkPermission'
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.use(Component) // 注册自己的插件

// 全局注册过滤器
Object.keys(filters).forEach(item => {
  // item是每个函数的方法名字
  Vue.filter(item, filters[item])
})
Vue.use(Print)
// 批量注册自定义指令
// 对象转为数组，拿到数组的每一个value作为指令名，value名对应的对象作为内容对象
Object.keys(directives).forEach(value => {
  // console.log(directives[value]) // 每个指令对象的 内容
  Vue.directive(value, directives[value])
})

Vue.mixin(checkPermission) //全局注册混入

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
