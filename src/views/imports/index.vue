<template>
  <div>
    <el-card>
      <UploadExcel :on-success="success" />
    </el-card>
  </div>
</template>

<script>
import { importEmployee } from '@/api/employee'
export default {
  props: {},
  data() {
    return {}
  },
  methods: {
    // 上传-拿到数据-调用增加员工的方法-把数据作为参数
    async success({ header, results }) {
      // console.log(header, results)
      // 标题header和内容results 但是是中文数组
      // 导入———转为英文的数组
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        是否在职: 'inServiceStatus',
        聘用形式: 'formOfEmployment'
      }
      const arr = []
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // 这里拿到的是每一个中文的key
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            // 后端接口限制 必须要转为时间才能入库
            userInfo[userRelations[key]] = new Date(
              this.formatDate(item[key], '/')
            )
          } else {
            userInfo[userRelations[key]] = item[key] // userRelations[key]是英文的key名字，把它作为属性赋值到新对象里
          }
        })
        arr.push(userInfo)
      })

      await importEmployee(arr)
      this.$router.back()
    },

    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style scoped>
.el-card {
  margin: 20px !important;
}
</style>
