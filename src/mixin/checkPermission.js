import store from '@/store/index'

export default {
  methods: {
    checkPermission(key) {
      const { userinfo } = store.state.user.userinfo
      if (userinfo.roles && userinfo.roles.points) {
        return userinfo.roles.points.some(item => item == key)
      }
      return false
    }
  }
}
