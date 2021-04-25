<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <PageTools>
          <!-- 这里的添加是添加一级（页面访问的权限） -->
          <el-button slot="after" type="primary" @click="goAdd(1,'0')">添加菜单</el-button>
        </PageTools>

        <el-table v-loading="loading" :data="tableData" style="width: 100%" row-key="id">
          <el-table-column prop="name" label="菜单名称" width="180"></el-table-column>
          <el-table-column prop="code" label="权限标识" width="180"></el-table-column>
          <el-table-column prop="description" label="描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <!-- 只有二级菜单 所以到2的时候不显示添加 ,且这里的添加是添加子权限（按钮操作的权限）-->
              <el-button type="text" v-if="row.type==1" @click="goAdd(2,row.id)">添加</el-button>
              <el-button type="text" @click="goEdit(row.id)">编辑</el-button>
              <el-button type="text" @click="goDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 编辑/新增 权限弹层 -->
      <el-dialog
        :title="title"
        :visible.sync="permissionDialogVisible"
        width="50%"
        @close="btnCancel"
      >
        <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" style="width:90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width:90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button>取 消</el-button>
          <el-button type="primary" @click="btnOk">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getPermissionList,
  delPermission,
  addPermission,
  getPermissionDetail,
  updatePermission
} from '@/api/permisson'
import { transListToTreeData } from '@/utils/transListToTreeData'
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      permissionDialogVisible: false,
      //对话框里的表单
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  computed: {
    title() {
      return this.formData.id ? '编辑权限' : '增加权限'
    }
  },
  methods: {
    async getPermissionList() {
      this.loading = true
      this.tableData = transListToTreeData(await getPermissionList(), '0')
      this.loading = false
    },

    //删除按钮
    goDel(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return delPermission(id)
        })
        .then(() => {
          this.$message.success('删除成功')
          this.getPermissionList()
        })
    },

    //增加按钮
    // 两个按钮区分: type=1 为一级菜单，type=2为二级菜单
    //不光区分，还要知道添加在哪个一级下面，所以增加一个pid形参 表示当前要添加的数据的父节点标识
    goAdd(type, pid) {
      this.formData.pid = pid
      this.formData.type = type
      this.permissionDialogVisible = true
    },

    // 添加的确认按钮
    btnOk() {
      this.$refs.perForm.validate(async isOk => {
        if (!isOk) return
        if (this.formData.id) {
          // 编辑模式
          await updatePermission(this.formData)
        } else {
          //增加模式
          await addPermission(this.formData)
        }
        this.$message.success('操作成功')
        this.getPermissionList()
        this.permissionDialogVisible = false
      })
    },

    btnCancel() {
      this.formData = {}
      this.$refs.perForm.resetFields()
      this.permissionDialogVisible = false
    },

    //编辑按钮
    async goEdit(id) {
      this.formData = await getPermissionDetail(id)
      this.permissionDialogVisible = true
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
