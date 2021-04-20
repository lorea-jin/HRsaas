<template>
  <el-dialog title="新增员工" :visible="showDialog" width="50%" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmpoyeeRef" label-width="120px" :model="formData" :rules="addEmpoyeeRules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in employeeNum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @focus="handleDeptData"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="deptInfoSaver"
          :props="defaultProps"
          default-expand-all
          @node-click="handleNodeClick"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnComfirm">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import employeeNum from '@/api/constant/employees'
import { addEmpolyee } from '@/api/employee'
import { getDepartmentsApi } from '@/api/departments'
import { transListToTreeData } from '@/utils/transListToTreeData'
export default {
  props: {
    showDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      employeeNum,
      // 新增员工表单的值,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: '',
        inServiceStatus: 1 // 默认在职
      },
      addEmpoyeeRules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      deptInfoSaver: null, // 部门信息存储

      defaultProps: {
        children: 'children',
        label: 'name'
      },

      showTree: false, // 控制树形的显示与否
      loading: false
    }
  },
  created() {},
  methods: {
    // 部门下拉框获得焦点的处理函数
    async handleDeptData() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartmentsApi()
      this.deptInfoSaver = transListToTreeData(depts, '')
      this.loading = false
    },

    // 树形组件 选择节点触发的函数
    handleNodeClick(data) {
      this.formData.departmentName = data.name
      this.showTree = false
    },

    // 确认按钮
    btnComfirm() {
      this.$refs.addEmpoyeeRef.validate(async isOk => {
        if (!isOk) return
        // 调用提交API，刷新列表，关弹层
        await addEmpolyee(this.formData)
        this.$emit('updateData')
        this.$parent.showDialog = false
      })
    },

    btnCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmpoyeeRef.resetFields()
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>
</style>
