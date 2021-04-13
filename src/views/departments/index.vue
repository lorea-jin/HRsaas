<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组织结构" name="first" class="contentbox">
            <!-- 标题 -->
            <TreeTools :tree-data="company" :is-root="true" @getDialog="getDialog($event)" />

            <!-- 树形结构 -->
            <el-tree
              :data="departmentsSaver"
              :props="defaultProps"
              node-key="id"
              default-expand-all
            >
              <!-- 结构出数据对象data，再通过属性传递给子组件props -->
              <TreeTools
                slot-scope="{data}"
                :tree-data="data"
                @delDepts="getDepartments"
                @getDialog="getDialog($event)"
                @editDialog="editDialog($event)"
              />
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 对话框 -->
      <AddDept
        ref="addDeptRef"
        :show-dialog.sync="dialogVisible"
        :info="dataInfo"
        @addDepts="getDepartments"
      />
    </div>
  </div>
</template>

<script>
import AddDept from '@/views/departments/components/add-dept'
import TreeTools from '@/views/departments/components/tree-tools'
import { getDepartmentsApi } from '@/api/departments'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      activeName: 'first',
      company: { name: '', manager: '负责人', id: '' },
      departmentsSaver: [],
      defaultProps: { children: 'children', label: 'name' },
      dialogVisible: false, // 对话框是否可见
      dataInfo: {} // 当前点击操作的部门信息行  树形子组件中通知父组件时候一起传过来的
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const re = await getDepartmentsApi()
      this.departmentsSaver = this.getArrayTree(re.depts, '')
      this.company.name = re.companyName
    },

    // 把数据转化为树形数组
    getArrayTree(data, rootvalue) {
      var arr = []
      data.forEach(item => {
        if (item.pid === rootvalue) {
          // 等于''为顶级,去找是否有人的pid等于这个item的id
          const children = this.getArrayTree(data, item.id)
          if (children.length > 0) {
            item.children = children
          }
          arr.push(item) // item是循环的数据中每一个数据对象
        }
      })
      return arr
    },

    // 子组件的方法 增加部门
    getDialog(info) {
      this.dialogVisible = true
      this.dataInfo = info
    },

    // 子组件的方法 查看编辑部门
    editDialog(info) {
      this.dialogVisible = true
      this.dataInfo = info
      // 调用子组件中的方法
      this.$refs.addDeptRef.getDeptsById(info.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 20px;
  font-size: 14px;
}

.contentbox {
  padding: 30px 120px !important;
}
</style>
