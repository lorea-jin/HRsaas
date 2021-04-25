// 建立一个专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router/index'
export default {
  namespaced: true,
  state: {
    routes: constantRoutes //路由表 当前用户拥有的路由
  },
  mutations: {
    //用户登陆后 加上自己的动态权限
    setRoutes(state, payload) {
      state.routes = [...constantRoutes, ...payload]
    }
  },
  actions: {
    // 筛选权限路由,根据登陆用户拥有的menus来筛选哪些动态路由符合
    // asyncRoutes: [{path:...,name:...},{}]
    //menus:['settings','salary']
    filterRoutes(context, menus) {
      const routes = []
      // 筛选出 动态路由中和menus中能够对上的路由
      menus.forEach(key => {
        // key就是权限标识
        // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
        routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
      })
      // 得到的routes是所有模块中满足权限要求的路由数组
      // routes就是当前用户所拥有的 动态路由的权限
      context.commit('setRoutes', routes) // 将动态路由提交给mutations
      return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
    }
  }
}
