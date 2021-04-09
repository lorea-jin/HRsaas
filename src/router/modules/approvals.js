import Layout from '@/layout'

export default {
  path: '/approvals',
  name: 'approvals',
  component: Layout, // 子模块都是layout的子组件，为了用到layout的布局
  children: [
    {
      path: '', // 这里的二级路由什么都不写代表默认用上面的path
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批',
        icon: 'tree-table'
      }
    }
  ]
}
