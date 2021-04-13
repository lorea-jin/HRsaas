// 部门相关的请求
import request from '@/utils/request'

// 获得部门信息的请求
export function getDepartmentsApi() {
  return request.get('/company/department')
}

// 删除部门
export function delDepartmentsApi(id) {
  return request.delete(`/company/department/${id}`)
}

// 增加部门
export function addDepartmentsApi(data) {
  return request.post('/company/department', data)
}

// 根据ID查询部门、
export function getDeptByIdApi(id) {
  return request.get(`/company/department/${id}`)
}

// 编辑部门信息的请求
export function updateDepts(data) {
  return request.put(`/company/department/${data.id}`, data)
}
