import request from '@/utils/request'

// 登陆的axios请求
export function login(data) {
  return request.post('/sys/login', data)
}

export function getInfo(token) {}

export function logout() {}
