<template>
  <div>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登陆账户设置" name="first">
          <el-form
            ref="userRef"
            label-width="120px"
            style="margin-left: 120px; margin-top:30px"
            :model="userinfo"
            :rules="rules"
          >
            <el-form-item label="姓名:" prop="username">
              <el-input v-model="userinfo.username" style="width:300px" />
            </el-form-item>
            <el-form-item label="密码:" prop="password2">
              <el-input v-model="userinfo.password2" style="width:300px" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateBtn">更新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <employeeinfo />
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <jobinfo />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getDetailedUserInfo } from '@/api/user'
import { saveUserDetailById } from '@/api/employee'
import employeeinfo from './user-info'
import jobinfo from './job-info'

export default {
  components: { employeeinfo, jobinfo },
  data() {
    return {
      activeName: 'first',
      userId: this.$route.params.id,

      // form表单数据源
      userinfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDetailedUserInfo()
  },
  methods: {
    // 获取用户详细信息的
    async getDetailedUserInfo() {
      this.userinfo = await getDetailedUserInfo(this.userId)
    },

    // 更新按钮
    updateBtn() {
      // 预验证，password2传给password，调接口
      this.$refs.userRef.validate(async isOk => {
        if (!isOk) return

        await saveUserDetailById({
          ...this.userinfo,
          password: this.userinfo.password2
        })
        this.$message.success('更新信息成功')
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-card {
  margin: 20px;
}
</style>
