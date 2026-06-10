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
        path: 'todo',
        name: 'Todo',
        component: () => import('@/views/Todo.vue'),
        meta: {
          title: '待办事项',
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
      {
        path: 'monitor-device',
        name: 'MonitorDevice',
        component: () => import('@/views/MonitorDevice.vue'),
        meta: {
          title: '桥梁监测设备',
        },
      },
      {
        path: 'monitor-data',
        name: 'MonitorData',
        component: () => import('@/views/MonitorData.vue'),
        meta: {
          title: '桥梁结构监测',
        },
      },
      {
        path: 'weigh-monitor',
        name: 'WeighMonitor',
        component: () => import('@/views/WeighMonitor.vue'),
        meta: {
          title: '桥梁超限监测',
        },
      },
      {
        path: 'monitor-alert',
        name: 'MonitorAlert',
        component: () => import('@/views/MonitorAlert.vue'),
        meta: {
          title: '桥梁监测预警',
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
