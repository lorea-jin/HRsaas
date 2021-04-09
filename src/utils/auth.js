import Cookies from 'js-cookie'

const TokenKey = 'hrsaas_ihrm_token' // 设置一个独一无二的key
const TimeKey = 'hrsaas_ihrm_timestamp' // 时间戳的key

export function setTimeStamp() {
  return Cookies.set(TimeKey, Date.now())
}

export function getTimeStamp() {
  return Cookies.get(TimeKey)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
