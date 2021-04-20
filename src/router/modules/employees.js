import Layout from '@/layout'

export default {
  path: '/employees',
  name: 'employees',
  component: Layout, // 子模块都是layout的子组件，为了用到layout的布局
  children: [
    {
      path: '', // 这里的二级路由什么都不写代表默认用上面的path
      component: () => import('@/views/employees'),
      meta: {
        title: '员工',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/components/detail.vue'),
      hidden: true,
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id',
      component:() => import('@/views/employees/components/print.vue'),
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
