<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <!-- tabs1 -->
          <el-tab-pane label="角色管理" name="role">
            <el-row>
              <el-col>
                <el-button type="primary" size="small" icon="el-icon-plus" @click="addrole">新增角色</el-button>
              </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="roleListSaver" style="width: 100%" border>
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column prop="name" label="角色名称" width="200" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作" width="300">
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="toEdit(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="todel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-row>
              <el-col>
                <el-pagination
                  :current-page="roleListQueryInfo.page"
                  :page-size="roleListQueryInfo.pagesize"
                  layout="total, prev, pager, next"
                  :total="total"
                  @current-change="handleCurrentChange"
                />
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- tabs2 -->
          <el-tab-pane label="公司信息" name="company">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />

            <el-form ref="form" label-width="80px" :model="companyInfoSaver">
              <el-form-item label="公司名称">
                <el-input v-model="companyInfoSaver.name" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="companyInfoSaver.companyAddress" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="companyInfoSaver.mailbox" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="companyInfoSaver.remarks" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!-- 编辑/新增角色的对话框 -->
      <el-dialog
        :title="dialogTitle"
        :visible.sync="RoledialogVisible"
        width="50%"
        :before-close="btnCancel"
      >
        <el-form
          ref="edittingRoleform"
          :model="EdittingRoleInfoSaver"
          :rules="edittingRules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="EdittingRoleInfoSaver.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="EdittingRoleInfoSaver.description" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="btnCancel">取 消</el-button>
          <el-button type="primary" @click="btnConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  delRole,
  getRoleInfoById,
  updateRoleInfoById,
  addRole
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'role', // 默认选择tab

      // 页码相关数据，获取角色表格的请求参数
      roleListQueryInfo: {
        page: 1,
        pagesize: 5
      },
      total: 0,

      roleListSaver: [], // 获取角色请求API请求回来的数据
      companyInfoSaver: {},
      RoledialogVisible: false,
      EdittingRoleInfoSaver: {}, // 点击编辑的这个角色信息获取回来的信息存储

      edittingRules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),

    // 对话框标题

    dialogTitle() {
      if (this.EdittingRoleInfoSaver.id) {
        return '编辑角色'
      } else return '新增角色'
    }
  },
  created() {
    this.getRolsList()
    this.getCompanyInfo()
  },

  methods: {
    // 获取tab1中的角色信息
    async getRolsList() {
      const re = await getRoleList(this.roleListQueryInfo)
      this.total = re.total
      this.roleListSaver = re.rows
    },
    handleCurrentChange(newPage) {
      this.roleListQueryInfo.page = newPage
      this.getRolsList()
    },

    // 删除角色方法
    async todel(id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delRole(id)
        this.getRolsList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },

    // 编辑角色
    async toEdit(id) {
      this.RoledialogVisible = true
      this.EdittingRoleInfoSaver = await getRoleInfoById(id)
    },

    // 新增角色
    addrole() {
      this.RoledialogVisible = true
    },

    // 对话框取消按钮
    btnCancel() {
      this.EdittingRoleInfoSaver = {}
      this.$refs.edittingRoleform.resetFields()
      this.RoledialogVisible = false
    },

    // 对话框确认按钮
    btnConfirm() {
      this.$refs.edittingRoleform.validate(async isOk => {
        if (!isOk) return
        // 根据是否有角色id来判断确认模式
        if (this.EdittingRoleInfoSaver.id) {
          // 编辑模式  -更新api，刷新列表,提示，关闭对话框，
          await updateRoleInfoById(this.EdittingRoleInfoSaver)
        } else {
          // 增加模式
          await addRole(this.EdittingRoleInfoSaver)
        }
        this.getRolsList()
        this.$message.success('操作成功')
        this.RoledialogVisible = false
      })
    },

    // 获取tab2中的公司信息
    async getCompanyInfo() {
      this.companyInfoSaver = await getCompanyInfo(this.companyId)
    }
  }
}
</script>

<style>
.el-table,
.el-form {
  margin-top: 20px;
}
</style>
