<template>
  <div style=" width: 100%">
    <el-row type="flex" justify="space-between" align="middle" style="height:40px">
      <!-- 左侧内容 -->
      <el-col>
        <h4 v-if="isRoot==true">{{ treeData.name }}</h4>
        <span v-else>{{ treeData.name }}</span>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <el-col>{{ treeData.manager }}</el-col>
          <el-col>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                操作
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                <el-dropdown-item v-if="isRoot==false" command="check">查看部门</el-dropdown-item>
                <el-dropdown-item v-if="isRoot==false" command="del">删除部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { delDepartmentsApi } from '@/api/departments'

export default {
  props: {
    // 每一行的数据对象
    treeData: {
      required: true,
      type: Object
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    // 点击下拉框触发的函数
    handleCommand(type) {
      if (type === 'del') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 调用删除api
            delDepartmentsApi(this.treeData.id)
            // 通知父元素调用刷新组织结构的函数
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else if (type === 'add') {
        this.$emit('getDialog', this.treeData)
      } else if (type === 'check') {
        this.$emit('editDialog', this.treeData)
      }
    }
  }
}
</script>

<style>
</style>
