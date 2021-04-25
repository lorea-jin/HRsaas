<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle">
      <!-- 左侧 -->
      <el-col>
        <div v-if="showBefore" class="before">
          <i class="el-icon-info" />
          <slot name="before" />
        </div>
      </el-col>

      <!-- 右侧 -->
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="after" />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: { showBefore: { type: Boolean, default: false } },
  data() {
    return {}
  }
}
</script>

<style lang='scss'>
.before {
  line-height: 34px;
  display: inline-block;
  padding: 0px 10px;
  border-radius: 3px;
  border: 1px solid rgba(145, 213, 255, 1);
  background: rgba(230, 247, 255, 1);
}

i {
  margin-right: 5px;
  color: #409eff;
}
</style>
