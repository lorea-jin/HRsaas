// 负责管理所有自定义指令的文件
export const imagerror = {
  inserted: (dom, binding) => {
    // binding：一个对象，包括value：指令的绑定值
    // dom表示当前指令作用的对象，此处为图片img

    // 情况1: src赋值null不会报错 所以先判断是否为空,有值赋值，null赋默认值
    dom.src = dom.src || binding.value
    
    // 情况2: 当图片有地址 但是地址报错事件被触发，则替换图片src属性
    dom.onerror = function() {
      dom.src = binding.value
    }
  }, componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
