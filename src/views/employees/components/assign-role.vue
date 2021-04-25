//分配角色组件
<template>
  <div>
    <el-dialog title="分配角色" :visible="showAssignRoleDialog" @close="btnCancel">
      <el-checkbox-group v-model="RoleIds">
        <el-checkbox :key="item.id" v-for="item in list" :label="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>

      <el-row slot="footer" class="dialog-footer">
        <el-col>
          <el-button type="primary" @click="btnOk">确定</el-button>
          <el-button @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getDetailedUserInfo } from '@/api/user'
import { assignRoles } from '@/api/employee'
export default {
  props: {
    showAssignRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String
    }
  },
  data() {
    return {
      list: [], //所有角色的列表
      RoleIds: [] //当前用户已有的权限点
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    //获取所有角色
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },

    // 拿到用户已有的权限
    async getDetailedUserInfo(id) {
      const { roleIds } = await getDetailedUserInfo(id)
      this.RoleIds = roleIds
    },

    //确认分配按钮
    btnOk() {
      assignRoles({ id: this.userId, roleIds: this.RoleIds })
      this.$emit('update:showAssignRoleDialog', false)
    },

    btnCancel() {
      this.RoleIds = [] // 清空原来的数组
      this.$emit('update:showAssignRoleDialog', false)
    }
  }
}
</script>

<style>
</style>