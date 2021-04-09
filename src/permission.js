// 权限处理页面
import router from '@/router/index'
import store from '@/store/index'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/404', '/login']
// 导航守卫
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  // （1）判断是否有token
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      // 放行前就可以获取用户资料了,
      // store.dispatch('user/getBasicUserInfoApi') //这样写每次路由变化都要调用用户信息啊
      // 所以用户id来判断是否有用户信息，没有再调用
      if (!store.getters.userid) {
        await store.dispatch('user/getBasicUserInfoApi')
      }
      next()
    }
  } else {
    // (2)没token的情况
    if (whiteList.indexOf(to.path) !== -1) {
      next() // 在白名单里面放行
    } else {
      next('/login') // 不在去登陆吧
    }
  }

  nprogress.done()
})

router.afterEach(() => {
  nprogress.done()
})
