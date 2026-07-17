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
        path: 'online-projects',
        name: 'OnlineProjects',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: {
          title: '在线项目',
        },
      },
      {
        path: 'online-projects/risk-road',
        name: 'OpRiskRoad',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '问题道路', category: 'risk-facility', type: '问题道路' },
      },
      {
        path: 'online-projects/risk-bridge',
        name: 'OpRiskBridge',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '问题桥梁', category: 'risk-facility', type: '问题桥梁' },
      },
      {
        path: 'online-projects/risk-tunnel',
        name: 'OpRiskTunnel',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '问题隧道', category: 'risk-facility', type: '问题隧道' },
      },
      {
        path: 'online-projects/renovation-road',
        name: 'OpRenovationRoad',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '问题道路改造项目', category: 'risk-renovation', type: '问题道路改造' },
      },
      {
        path: 'online-projects/renovation-bridge',
        name: 'OpRenovationBridge',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '问题桥梁改造项目', category: 'risk-renovation', type: '问题桥梁改造' },
      },
      {
        path: 'online-projects/renovation-tunnel',
        name: 'OpRenovationTunnel',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '问题隧道改造项目', category: 'risk-renovation', type: '问题隧道改造' },
      },
      {
        path: 'online-projects/new-road',
        name: 'OpNewRoad',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '新建道路项目', category: 'new-project', type: '新建道路' },
      },
      {
        path: 'online-projects/new-bridge',
        name: 'OpNewBridge',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '新建桥梁项目', category: 'new-project', type: '新建桥梁' },
      },
      {
        path: 'online-projects/new-tunnel',
        name: 'OpNewTunnel',
        component: () => import('@/views/OnlineProjects.vue'),
        meta: { title: '新建隧道项目', category: 'new-project', type: '新建隧道' },
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
        path: 'flood-monitor-device',
        name: 'FloodMonitorDevice',
        component: () => import('@/views/FloodMonitorDevice.vue'),
        meta: { title: '积水监测设备' },
      },
      {
        path: 'camera-device',
        name: 'CameraDevice',
        component: () => import('@/views/CameraDevice.vue'),
        meta: { title: '摄像头' },
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
        path: 'police-liaison',
        name: 'PoliceLiaison',
        component: () => import('@/views/PoliceLiaison.vue'),
        meta: {
          title: '公安交警联动',
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
        path: 'hazard-checklist-config',
        name: 'HazardChecklistConfig',
        component: () => import('@/views/HazardChecklistConfig.vue'),
        meta: { title: '检查表配置' },
      },
      {
        path: 'hazard-task-management',
        name: 'HazardTaskManagement',
        component: () => import('@/views/HazardTaskManagement.vue'),
        meta: { title: '任务管理及发布' },
      },
      {
        path: 'hazard-tool-tips',
        name: 'HazardToolTips',
        component: () => import('@/views/HazardToolTips.vue'),
        meta: { title: '检查工具提示信息配置' },
      },
      {
        path: 'hazard-check-records',
        name: 'HazardCheckRecords',
        component: () => import('@/views/HazardCheckRecords.vue'),
        meta: { title: '检查记录' },
      },
      {
        path: 'hazard-problem-list',
        name: 'HazardProblemList',
        component: () => import('@/views/HazardProblemList.vue'),
        meta: { title: '问题清单管理' },
      },
      {
        path: 'hazard-statistics',
        name: 'HazardStatistics',
        component: () => import('@/views/HazardStatistics.vue'),
        meta: { title: '统计分析' },
      },
      // 检测管理路由
      {
        path: 'road-inspection-eval',
        name: 'RoadInspectionEval',
        component: () => import('@/views/RoadInspectionEval.vue'),
        meta: { title: '道路检测评价' },
      },
      {
        path: 'bridge-inspection-eval',
        name: 'BridgeInspectionEval',
        component: () => import('@/views/BridgeInspectionEval.vue'),
        meta: { title: '桥梁检测评价' },
      },
      {
        path: 'tunnel-inspection-eval',
        name: 'TunnelInspectionEval',
        component: () => import('@/views/TunnelInspectionEval.vue'),
        meta: { title: '隧道检测评价' },
      },
      {
        path: 'road-risk-rectify',
        name: 'RoadRiskRectify',
        component: () => import('@/views/RoadRiskRectify.vue'),
        meta: { title: '道路风险整改' },
      },
      {
        path: 'bridge-risk-rectify',
        name: 'BridgeRiskRectify',
        component: () => import('@/views/BridgeRiskRectify.vue'),
        meta: { title: '桥梁风险整改' },
      },
      {
        path: 'tunnel-risk-rectify',
        name: 'TunnelRiskRectify',
        component: () => import('@/views/TunnelRiskRectify.vue'),
        meta: { title: '隧道风险整改' },
      },
    ],
  },
  // 驾驶舱独立路由（不使用 BaseLayout）
  {
    path: '/cockpit',
    name: 'Cockpit',
    component: () => import('@/views/Cockpit.vue'),
    meta: { title: '驾驶舱' },
  },
  {
    path: '/construction-projects',
    name: 'ConstructionProjects',
    component: () => import('@/views/ConstructionCockpit.vue'),
    meta: { title: '在建项目' },
  },
  {
    path: '/bridge-point-monitor',
    name: 'BridgePointMonitor',
    component: () => import('@/views/BridgePointMonitor.vue'),
    meta: { title: '点位监测' },
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
