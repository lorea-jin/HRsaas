import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/index'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const timeLimted = 3600 // 定义token超时时间为1个小时(注意这里的秒为单位的数字)
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 开发环境值为/api
  timeout: 5000 // 超过5秒超时
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 先判断有没有token，有则注入
    if (store.getters.token) {
      //  有token的情况下判断是否超时 -如果true则超时,报错+删token删资料跳转
      if (isTimeOut()) {
        // store.commit('user/removeStateToken')
        // store.commit('user/deleteUserInfo')
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('页面已超时,请重新登陆'))
      }
      config.headers.Authorization = `Bearer ` + store.getters.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  config => {
    const { message, data, success } = config.data
    if (success) return data
    // 没成功就(1)提示错误,(2)进入reject
    Message.error(message)
    return Promise.reject(new Error(message))
  },
  error => {
    // 被动介入判断后端返回的是否token超时
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      // store.commit('user/removeStateToken')
      // store.commit('user/deleteUserInfo')
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error.message)
    }
    return Promise.reject(error)
  }
)

// 定义一个判断是否超时的方法
function isTimeOut() {
  const oldtime = getTimeStamp() // 缓存中登陆时候记下的时间戳
  const nowtime = Date.now() // 现在的时间戳
  // return nowtime
  return (nowtime - oldtime) / 1000 > timeLimted
}
export default service
