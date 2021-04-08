import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    // 更新token
    updateStateToken(state, token) {
      state.token = token // 更新给数据中心
      // 同步给本地缓存
      setToken(token)
    },

    // 删除token
    removeStateToken(state) {
      state.token = null // 删除数据中心token
      removeToken() // 删除缓存
    }
  },
  actions: {
    // 发起login登陆的异步请求
    async getLoginApi(context, data) {
      const result = await login(data)
      context.commit('updateStateToken', result)
    }
  }
}
