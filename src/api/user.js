import request from '@/utils/request'

// 登陆的axios请求
export function login(data) {
  return request.post('/sys/login', data)
}

// 获取用户简单信息的请求
export function getBasicUserInfo() {
  return request.post('/sys/profile')
}

// 获取用户详细信息-获取员工基本信息
export function getDetailedUserInfo(id) {
  return request.get(`/sys/user/${id}`)
}

export function logout() {}
