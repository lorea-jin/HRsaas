export function transListToTreeData(data, rootValue) {
  // 从根部，顶级开始找，找儿子。
  // 每次循环声明一个空数组，判断条件是不是我的儿子，
  // （如果是）把儿子推进数组，再利用递归找孙子
  const arr = []
  data.forEach(item => {
    if (item.pid === rootValue) {
      arr.push(item)
      const children = transListToTreeData(data, item.id)
      if (children.length > 0) {
        item.children = children
      }
    }
  })
  return arr
}

// transListToTreeData(depts,'')
