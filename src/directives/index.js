// 负责管理所有自定义指令的文件
export const imagerror = {
  inserted: (dom, binding) => {
    // binding：一个对象，包括value：指令的绑定值
    // dom表示当前指令作用的对象，此处为图片img
    // 当图片有地址 但是地址报错事件被触发，则替换图片src属性
    dom.onerror = function() {
      dom.src = binding.value
    }
  }
}

export const imagerror2 = {
  inserted: (dom, binding) => {
    // binding：一个对象，包括value：指令的绑定值
    // dom表示当前指令作用的对象，此处为图片img
    // 当图片有地址 但是地址报错事件被触发，则替换图片src属性
    dom.onerror = function() {
      dom.src = binding.value
    }
  }
}
