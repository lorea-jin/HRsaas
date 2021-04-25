import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getBasicUserInfo, getDetailedUserInfo } from '@/api/user'
import { resetRouter } from '@/router/index'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    // 更新token
    updateStateToken(state, token) {
      state.token = token // 更新给数据中心
      setToken(token) // 同步给本地缓存
    },

    // 删除token
    removeStateToken(state) {
      state.token = null // 删除数据中心token
      removeToken() // 删除缓存
    },

    // 更新获取到的用户信息进state
    updataStateUserInfo(state, data) {
      state.userInfo = data
    },

    // 删除用户资料userInfo
    deleteUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 发起login登陆的异步请求
    async getLoginApi(context, data) {
      const result = await login(data) // 拿到token
      context.commit('updateStateToken', result)
      setTimeStamp() // 登陆成功设置时间戳放入本地
    },

    // 发起获取用户基本信息的请求
    async getBasicUserInfoApi(context) {
      const data = await getBasicUserInfo()
      const result = await getDetailedUserInfo(data.userId) // 发起获取用户【详细】信息的请求

      // data和result合并后的结果传入 userInfo
      const obj = { ...data, ...result }
      context.commit('updataStateUserInfo', obj)
      return data //return 出去调用这个方法的时候才能接收到roles下的用户权限值
    },

    //登出的函数
    logout(context) {
      context.commit('removeStateToken')
      context.commit('deleteUserInfo')
      resetRouter() //重置路由
      // 清空vuex permission中的数据
      context.commit('permission/setRoutes', [], { root: true })
    }
  }
}
