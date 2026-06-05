import { createRouter, createWebHashHistory } from 'vue-router'
import BaseLayout from '@/components/Layout/BaseLayout.vue'

const routes = [
  {
    path: '/',
    component: BaseLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '工作台',
        },
      },
      {
        path: 'bridge-info',
        name: 'BridgeInfo',
        component: () => import('@/views/BridgeInfo.vue'),
        meta: {
          title: '桥梁信息',
        },
      },
      {
        path: 'tunnel-info',
        name: 'TunnelInfo',
        component: () => import('@/views/TunnelInfo.vue'),
        meta: {
          title: '隧道信息',
        },
      },
      {
        path: 'road-info',
        name: 'RoadInfo',
        component: () => import('@/views/RoadInfo.vue'),
        meta: {
          title: '道路信息',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
