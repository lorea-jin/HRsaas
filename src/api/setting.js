// 公司设置(公司+角色)页面用到的请求函数
import request from '@/utils/request'

// 获取所有角色列表
export function getRoleList(data) {
  // return request.get('/sys/role', { params: data })
  return request({
    url: '/sys/role',
    params: data
  })
}

// 删除角色
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 根据id获取角色详情
export function getRoleInfoById(id) {
  return request.get(`/sys/role/${id}`)
}
// 根据id更新角色信息

export function updateRoleInfoById(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 增加角色
export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'post',
    data
  })
}
// 获取公司信息
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}
