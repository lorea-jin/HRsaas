import request from '@/utils/request'

// 登陆的axios请求
export function login(data) {
  return request.post('/sys/login', data)
}

// 获取用户基本信息的请求
export function getBasicUserInfo() {
  return request.post('/sys/profile')
}
export function getDetailedUserInfo(id) {
  return request.get(`/sys/user/${id}`)
}

export function logout() {}
