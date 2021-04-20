<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :limit="1"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileList"
      :before-upload="checkBeforeUpload"
      :class="{disabled :fileComputed }"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <!-- 预览弹层 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imgUrl" alt />
    </el-dialog>

    <el-progress v-if="showPercent" :percentage="percent" style="width: 180px"></el-progress>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDa0EI8i2JLE0f8tqff7E6imiYMWaPhMSK',
  SecretKey: 'oNiqjLgmdDe1A5lBLGvKM7gjX4LNFG1Z'
})
export default {
  data() {
    return {
      // 文件上传的对象
      fileList: [],
      dialogVisible: false, // 控制预览弹层可见
      imgUrl: '', // 预览图片的地址
      currentUid: '', // 当前上传文件的uid
      percent: 0, //上传进度
      showPercent: false //默认不显示
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 预览
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.imgUrl = file.url
    },

    // 移除
    handleRemove(file, fileList) {
      // file要删除的那个图片文件的uid等信息, fileList是删除过后的文件
      // 用uid在fileList中找到自己要删的 过滤出去
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },

    // 文件状态改变的钩子
    handleChange(file, fileList) {
      // 因为fileList参数是当前传进来的最新参数
      this.fileList = fileList.map(item => item) //这一步是为了让本地显示缩略图
    },

    // 上传前的检查
    checkBeforeUpload(file) {
      // 检查类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        debugger
        this.$message.error('上传图片格式不正确')
        return false
      }
      // 检查大小 设置max为5M
      const maxsize = 5 * 1024 * 1045
      if (file.size > maxsize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      //   已经确定当前上传的就是当前的这个file了
      this.currentUid = file.uid
      this.showPercent = true
      return true
    },

    // 覆盖默认上传行为的上传动作
    upload(params) {
      // params.file 才是我们要的上传对象

      // (1)先判断有没有文件，存在则执行上传
      if (params.file) {
        cos.putObject(
          {
            Bucket: 'hrsaas-1305649429' /* 必须 */,
            Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
            Key: params.file.name, // 文件名
            StorageClass: 'STANDARD',
            Body: params.file, // 上传文件对象
            // 进度条
            onProgress: params => {
              this.percent = params.percent * 100
            }
          },
          // (2)通过回调函数拿到的data判断
          (err, data) => {
            // console.log('my-log', data)
            if (!err && data.statusCode === 200) {
              // (3)将拿到的腾讯云的图片地址回写到fileList中
              // 怎么写？fileList是数组，通过拿到的uid来数组中找 上传成功的是哪个文件, this.currentUid是上传前一步记录下的uid
              this.fileList = this.fileList.map(item => {
                if (item.uid === this.currentUid) {
                  return { url: 'http://' + data.Location, upload: true }
                }
                return item
              })
              // console.log(this.fileList) //这一步打印的fileList中显示腾讯云地址赋值给fileList
              setTimeout(() => {
                this.showPercent = false // 隐藏进度条
                this.percent = 0 // 进度归0
              }, 1000)
            }
          }
        )
      }
    }
  }
}
</script>

<style >
/* 不能加scoped  scoped 是具有唯一性的 动态添加就找不到disabled了 */
.disabled .el-upload--picture-card {
  display: none;
}
</style>
