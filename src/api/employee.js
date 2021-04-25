// 员工相关的请求
import request from '@/utils/request'

// 获取员工基本信息（只有名字和id）
export function getEmployeeSimple() {
  return request.get('/sys/user/simple')
}

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: `/sys/user`,
    params
  })
}

// 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工
export function addEmpolyee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

// 批量导入员工接口

export function importEmployee(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

// 保存员工基本信息
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 获取员工个人信息
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

// 保存员工个人信息
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.id}/personalInfo`,
    method: 'put',
    data
  })
}

// 获取用户的岗位信息

export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

// 保存岗位信息

export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

//给员工分配角色——给用户分配角色
export function assignRoles (data) {
  return request({
    url: `/sys/user/assignRoles`,
    method: 'put',
    data
  })
}
