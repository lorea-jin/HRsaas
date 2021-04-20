// 全局注册的组件都写在这

<script>
import PageTools from '@/components/PageTools/index'
import UploadExcel from '@/components/UploadExcel/index'
import ImageUpload from '@/components/ImageUpload/index'

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
  }
}
</script>

<style>
</style>
