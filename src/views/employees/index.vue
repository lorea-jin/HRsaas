<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="topcard">
        <PageTools :show-before="showbefore">
          <span slot="before">共{{ queryInfo.total }}条记录</span>

          <el-button
            slot="after"
            size="small"
            type="primary"
            class="el-icon-upload2"
            @click="$router.push('/import')"
          >导入</el-button>
          <el-button
            slot="after"
            size="small"
            type="primary"
            class="el-icon-download"
            @click="exportBtn"
          >导出</el-button>

          <el-button
            slot="after"
            size="small"
            type="primary"
            class="el-icon-plus"
            @click="addUser"
          >新增员工</el-button>
        </PageTools>
      </el-card>

      <el-card>
        <el-table v-loading="loading" :data="empolyeeTableData" style="width: 100%" border>
          <el-table-column label="序号" sortable type="index" width="70" />
          <el-table-column label="姓名" sortable prop="username" width="120" />
          <el-table-column label="照片" width="150">
            <template slot-scope="{row}">
              <img
                :src="row.staffPhoto"
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQRCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" sortable prop="mobile" width="120" />
          <el-table-column label="工号" sortable prop="workNumber" width="80" />
          <el-table-column
            :formatter="formateTable"
            label="聘用形式"
            sortable
            prop="formOfEmployment"
            width="105"
          />
          <el-table-column label="部门" sortable prop="departmentName" width="80" />
          <el-table-column label="入职时间" sortable prop="timeOfEntry" width="110">
            <template slot-scope="scope">{{ scope.row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="是否在职" sortable prop="inServiceStatus" width="105">
            <template slot-scope="scope">{{ scope.row.inServiceStatus ==1 ? '在职':"离职" }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable prop="enableState" width="105">
            <template slot-scope="scope">
              <el-switch :value="scope.row.enableState==1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" sortable width="280">
            <template slot-scope="{row}">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="assignRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delUser(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          :current-page.sync="queryInfo.page"
          :page-size="queryInfo.size"
          layout="total, prev, pager, next"
          :total="queryInfo.total"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </div>

    <addEmplyee :show-dialog.sync="showDialog" @updateData="getEmployeeList()" />

    <!-- 二维码的对话框 -->
    <el-dialog title="二维码" :visible.sync="qrDialogVisible" width="30%">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <assignRole
      ref="assingRoleRef"
      :showAssignRoleDialog.sync="showAssignRoleDialog"
      :userId="userId"
    ></assignRole>
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employee'
import employeeNum from '@/api/constant/employees'
import addEmplyee from './components/add-employee'
import assignRole from './components/assign-role'
import { formatDate } from '@/filters/index'
import QrCode from 'qrcode'

export default {
  components: { addEmplyee, assignRole },
  data() {
    return {
      showbefore: true, // 控制公共组件左边是否显示
      empolyeeTableData: [], // 表格绑定的数据源
      queryInfo: { page: 1, size: 10, total: 0 },
      showDialog: false, // 控制弹层
      loading: false,
      qrDialogVisible: false,
      showAssignRoleDialog: false,

      // 当前操作的角色id
      userId: ''
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.queryInfo)
      this.empolyeeTableData = rows
      this.queryInfo.total = total
      this.loading = false
    },

    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getEmployeeList()
    },

    // 格式化数据 table的属性formatter绑定的函数
    formateTable(row, column, cellvalue, index) {
      // console.log(row, column, cellvalue, index) // row是这一行的员工信息，column方法，cellvalue是这一column的值
      const targetObj = employeeNum.hireType.find(item => item.id === cellvalue)
      return targetObj ? targetObj.value : '未知'
      // 找到了聘用形式的数字所对应的含义 然后return
    },

    // 删除员工
    async delUser(id) {
      try {
        await this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await delEmployee(id)
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },

    // 新增员工按钮控制弹层函数
    addUser() {
      this.showDialog = true
    },

    // 导出按钮
    async exportBtn() {
      // 做中文表头用的
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 表格里的信息是分页的，所以先拿到全部员工的信息
      const { rows } = await getEmployeeList({
        page: 1,
        size: this.queryInfo.total
      })

      const data = this.transObjtoArray(headers, rows)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data, // [[],[],[]]
          filename: '员工信息表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
    },

    transObjtoArray(headers, rows) {
      // 把里面的每个人的信息 对象格式转为数组 [{ username: '张三'},{},{}]  => [[’张三'],[],[]]
      // 思路：（1）既然表头是中文，那么我应该按照中文去匹配相应的值 组成数组
      // （2）根据headers的对应关系 找到数组里中文对应的英文  【即拿到所需字段的英文】
      // (3)循环拿到每一个英文-item(英文key) 就是英文对应的值！

      return rows.map(item => {
        const CnKey = Object.keys(headers) // 是中文的数组拉["手机号", "姓名"...]=> mobile  username
        return CnKey.map(key => {
          if (headers[key] === 'formOfEmployment') {
            const re = employeeNum.hireType.find(
              obj => obj.id === item[headers[key]]
            )
            return re ? re.value : '未知'
          } else if (
            headers[key] === 'correctionTime' ||
            headers[key] === 'timeOfEntry'
          ) {
            return formatDate(item[headers[key]])
          }
          return item[headers[key]] // headers[key]是每个英文字段 item[username]拿到值
        })
      })
    },

    showQRCode(url) {
      if (url) {
        this.qrDialogVisible = true

        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },

    // 分配角色的函数
    async assignRole(id) {
      this.userId = id
      // 获取子组件实例调用子组件方法
      await this.$refs.assingRoleRef.getDetailedUserInfo(id)
      this.showAssignRoleDialog = true
    }
  }
}
</script>

<style>
.el-pagination {
  margin-top: 10px;
}

.topcard {
  margin-bottom: 10px;
}
</style>
