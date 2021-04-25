const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token, // token的快捷访问方式
  name: state => state.user.userInfo.username, // 用户资料-用户名
  userid: state => state.user.userInfo.userId, // 用户资料-用户id
  photo: state => state.user.userInfo.staffPhoto, // 用户资料-头像照片
  companyId: state => state.user.userInfo.companyId, // 用户资料-公司id
  routes: state => state.permission.routes // 导出当前的路由
}
export default getters
