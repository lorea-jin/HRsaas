<template>
  <!-- 增加部门的对话框组件 -->
  <div>
    <el-dialog :title="title" :visible.sync="showDialog" :before-close="CancelBtn" width="50%">
      <el-form ref="EditformRef" :model="Editform" label-width="120px" :rules="EditRules">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="Editform.name" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="Editform.code" placeholder="1-50个字符" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="Editform.manager"
            style="width:40%"
            placeholder="请选择"
            @focus="handleEmployee()"
          >
            <el-option
              v-for="item in userinfo"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input v-model="Editform.introduce" type="textarea" placeholder="1-300个字符" :rows="3" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="CancelBtn">取 消</el-button>
        <el-button type="primary" @click="ConfirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getDepartmentsApi,
  addDepartmentsApi,
  getDeptByIdApi,
  updateDepts
} from '@/api/departments'
import { getEmployeeSimple } from '@/api/employee'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },

    // 这一行的部门信息
    info: {
      default: null,
      type: Object
    }
  },

  data() {
    // 定义检查部门名称重复的方法
    const checkDepNameRepeated = async(rule, value, callback) => {
      // 先获得最新的部门信息;
      const { depts } = await getDepartmentsApi()
      let isRepeat = null
      // 进行场景区分
      if (this.Editform.id) {
        // 编辑场景
        // 找到同级部门信息(即pid一样)，排除我自己(id)，再查重（此时点击的是目标自身查看）
        isRepeat = depts
          .filter(
            item => item.pid === this.info.pid && item.id !== this.info.id
          )
          .some(item => item.name === value)
      } else {
        // 增加场景
        // 找到这一行的所有子部门（同级部门中不能重复，我点的是父亲，添加子部门）;查重
        isRepeat = depts
          .filter(item => item.pid === this.info.id)
          .some(item => item.name === value)
      }

      isRepeat ? callback(new Error('部门名字已存在，请更换')) : callback()
    }

    // 定义检查部门编码的方法
    const checkDepCodeRepeated = async(rule, value, callback) => {
      const { depts } = await getDepartmentsApi()
      let isRepeat = null
      if (this.Editform.id) {
        // 编辑模式
        // 排除我自己不能和任何人的编码code一致
        isRepeat = depts
          .filter(item => item.id !== this.info.id)
          .some(item => item.code === value)
      } else {
        // 增加模式
        isRepeat = depts.some(item => item.code === value)
      }

      isRepeat ? callback(new Error('部门编码已存在，请更换')) : callback()
    }
    return {
      // 表格编辑的提交参数
      Editform: {
        name: '',
        manager: '',
        introduce: '',
        code: ''
      },

      // 表单验证规则
      EditRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkDepNameRepeated,
            trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: 'blur'
          },
          {
            validator: checkDepCodeRepeated,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true,
            message: '部门经理不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 下拉框的员工名字
      userinfo: ''
    }
  },
  computed: {
    // 根据场景区分标题内容
    title() {
      return this.Editform.id ? '编辑部门' : '增加子部门'
    }
  },
  methods: {
    async handleEmployee() {
      const re = await getEmployeeSimple()
      this.userinfo = re
    },

    // 确认按钮
    ConfirmBtn() {
      // 预验证、调用提交信息的api、通知父组件刷新、关闭对话框
      this.$refs.EditformRef.validate(async isOk => {
        if (!isOk) return
        // 判断有没有id来区分场景
        if (this.Editform.id) {
          // 编辑模式
          await updateDepts(this.Editform)
        } else {
          // 增加模式
          const data = { ...this.Editform, pid: this.info.id }
          await addDepartmentsApi(data)
        }
        this.$emit('addDepts')
        this.$emit('update:showDialog', false)
      })
    },

    // 取消按钮
    CancelBtn() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.Editform = {
        name: '',
        manager: '',
        introduce: '',
        code: ''
      }
      this.$refs.EditformRef.resetFields()
      this.$emit('update:showDialog', false)

      // this.$emit('CancelBtn')
    },

    // 根据ID获取部门信息的请求
    async getDeptsById(id) {
      this.Editform = await getDeptByIdApi(id)
    }
  }
}
</script>

<style>
</style>
