// 员工相关的请求
import request from '@/utils/request'

export function getEmployeeSimple() {
  return request.get('/sys/user/simple')
}
