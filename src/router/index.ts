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
        path: 'road-monitor-device',
        name: 'RoadMonitorDevice',
        component: () => import('@/views/RoadMonitorDevice.vue'),
        meta: { title: '道路监测设备' },
      },
      {
        path: 'monitor-device',
        name: 'MonitorDevice',
        component: () => import('@/views/MonitorDevice.vue'),
        meta: { title: '桥梁监测设备' },
      },
      {
        path: 'tunnel-monitor-device',
        name: 'TunnelMonitorDevice',
        component: () => import('@/views/TunnelMonitorDevice.vue'),
        meta: { title: '隧道监测设备' },
      },
      {
        path: 'road-monitor-data',
        name: 'RoadMonitorData',
        component: () => import('@/views/RoadMonitorData.vue'),
        meta: { title: '道路边坡监测' }
      },
      {
        path: 'monitor-data',
        name: 'MonitorData',
        component: () => import('@/views/MonitorData.vue'),
        meta: { title: '桥梁结构监测' },
      },
      {
        path: 'weigh-monitor',
        name: 'WeighMonitor',
        component: () => import('@/views/WeighMonitor.vue'),
        meta: { title: '桥梁超限监测' },
      },
      {
        path: 'tunnel-monitor-data',
        name: 'TunnelMonitorData',
        component: () => import('@/views/TunnelMonitorData.vue'),
        meta: { title: '隧道结构监测' }
      },
      {
        path: 'road-monitor-alert',
        name: 'RoadMonitorAlert',
        component: () => import('@/views/RoadMonitorAlert.vue'),
        meta: { title: '道路监测预警' },
      },
      {
        path: 'monitor-alert',
        name: 'MonitorAlert',
        component: () => import('@/views/MonitorAlert.vue'),
        meta: { title: '桥梁监测预警' },
      },
      {
        path: 'tunnel-monitor-alert',
        name: 'TunnelMonitorAlert',
        component: () => import('@/views/TunnelMonitorAlert.vue'),
        meta: { title: '隧道监测预警' },
      },
      {
        path: 'org-personnel',
        name: 'OrgPersonnel',
        component: () => import('@/views/OrganizationPersonnel.vue'),
        meta: {
          title: '人员权限配置',
        },
      },
      {
        path: 'org-enterprise',
        name: 'OrgEnterprise',
        component: () => import('@/views/EnterpriseInfo.vue'),
        meta: {
          title: '企业基本信息',
        },
      },
      {
        path: 'tp-maintenance',
        name: 'TpMaintenance',
        component: () => import('@/views/ThirdPartyMaintenance.vue'),
        meta: {
          title: '日常养护单位',
        },
      },
      {
        path: 'tp-inspection',
        name: 'TpInspection',
        component: () => import('@/views/ThirdPartyInspection.vue'),
        meta: {
          title: '检测单位',
        },
      },
      {
        path: 'tp-assessment',
        name: 'TpAssessment',
        component: () => import('@/views/ThirdPartyAssessment.vue'),
        meta: {
          title: '安全评估单位',
        },
      },
      {
        path: 'cert-maintenance',
        name: 'CertMaintenance',
        component: () => import('@/views/MaintenancePersonnel.vue'),
        meta: {
          title: '日常养护单位从业人员',
        },
      },
      {
        path: 'cert-inspection',
        name: 'CertInspection',
        component: () => import('@/views/InspectionPersonnel.vue'),
        meta: {
          title: '检测单位从业人员',
        },
      },
      {
        path: 'cert-assessment',
        name: 'CertAssessment',
        component: () => import('@/views/AssessmentPersonnel.vue'),
        meta: {
          title: '安全评估单位从业人员',
        },
      },
      {
        path: 'hazard-investigation',
        name: 'HazardInvestigation',
        component: () => import('@/views/HazardInvestigation.vue'),
        meta: { title: '隐患排查' },
      },
      {
        path: 'cockpit',
        name: 'Cockpit',
        component: () => import('@/views/Cockpit.vue'),
        meta: { title: '驾驶舱' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
