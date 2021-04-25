// 权限处理页面
import router from '@/router/index'
import store from '@/store/index'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

const whiteList = ['/404', '/login']
// 导航守卫
router.beforeEach(async (to, from, next) => {
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
        const { roles } = await store.dispatch('user/getBasicUserInfoApi')
        const routes = await store.dispatch(
          'permission/filterRoutes',
          roles.menus
        )
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        router.addRoutes([
          ...routes,
          {
            path: '*',
            redirect: '/404',
            hidden: true
          }
        ])
        // 添加完动态路由之后

        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      } else {
        next()
      }
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
