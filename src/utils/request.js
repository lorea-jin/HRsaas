import axios from 'axios'
import { Message } from 'element-ui'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 开发环境值为/api
  timeout: 5000 // 超过5秒超时
})

// 请求拦截器
service.interceptors.request.use()

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
    Message.error(error.message)
    return Promise.reject(error)
  }
)
export default service
