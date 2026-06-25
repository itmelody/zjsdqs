<template>
  <a-layout class="app-layout">
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="header-left">
        <div class="header-logo">
          <div class="logo-icon">
            <HomeOutlined style="font-size: 24px" />
          </div>
          <span class="logo-text">浙江省城市道桥隧安全监管</span>
        </div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          theme="dark"
          :items="menuItems"
          @click="handleMenuClick"
        />
      </div>
      <div class="header-right">
        <a-dropdown>
          <a-button type="link" class="header-btn">
            <SettingOutlined />
            <span>系统切换</span>
            <DownOutlined style="margin-left: 4px" />
          </a-button>
          <template #overlay>
            <a-menu @click="handleSystemSwitch">
              <a-menu-item key="cockpit">驾驶舱</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button type="link" class="header-btn">
          <FullscreenOutlined />
        </a-button>
        <a-button type="link" class="header-btn">
          <QuestionCircleOutlined />
        </a-button>
        <a-button type="link" class="header-btn">
          <BulbOutlined />
        </a-button>
        <a-avatar :size="32" class="header-avatar">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <span class="header-username">省政府机构</span>
        <a-divider type="vertical" style="border-color: rgba(255,255,255,0.3)" />
        <a-dropdown>
          <a class="header-dropdown" @click.prevent>
            <span style="color: #fff">建设厅</span>
            <DownOutlined style="color: #fff; margin-left: 4px" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item>选项1</a-menu-item>
              <a-menu-item>选项2</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </a-layout-header>

    <a-layout>
      <!-- 左侧菜单 (工作台不显示) -->
      <a-layout-sider
        v-if="showSider"
        width="200"
        class="sider"
      >
        <a-menu
          v-model:selectedKeys="siderSelectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          theme="light"
          :items="currentSiderMenuItems"
          @click="handleSiderMenuClick"
        />
      </a-layout-sider>

      <!-- 主内容区 -->
      <a-layout-content :class="['main-content', { 'main-content-full': !showSider }]">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, h, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  SettingOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
  UserOutlined,
  DownOutlined,
  FileTextOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const showSider = computed(() => {
  const path = route.path
  if (path.includes('cockpit')) return false
  return true
})

// 工作台侧边栏菜单（dashboard/todo页面使用）
const workspaceMenuItems = ref<MenuProps['items']>([
  { key: 'dashboard', label: '数据看板' },
  { key: 'todo', label: '待办事项' },
])

// 当前使用的侧边栏菜单
const currentSiderMenuItems = computed(() => {
  const path = route.path
  if (path === '/dashboard' || path === '/todo') {
    return workspaceMenuItems.value
  }
  if (path.includes('monitor-') || path.includes('weigh-monitor') || path.includes('flood-') || path.includes('camera-')) {
    return iotMenuItems.value
  }
  if (path.includes('hazard-')) {
    return hazardMenuItems.value
  }
  if (path.includes('org-personnel') || path.includes('org-enterprise') || path.includes('tp-') || path.includes('cert-') || path.includes('police-liaison')) {
    return orgPersonnelMenuItems.value
  }
  return siderMenuItems.value
})

const selectedKeys = ref<string[]>(['dashboard'])
const collapsed = ref(false)
const siderSelectedKeys = ref<string[]>(['bridge-info'])
const openKeys = ref<string[]>(['basic-info'])

// 监听路由变化，同步顶部和侧边栏高亮
watch(
  () => route.path,
  (path) => {
    // 顶部菜单
    if (path === '/dashboard') {
      selectedKeys.value = ['dashboard']
    } else if (path.includes('bridge-info') || path.includes('tunnel-info') || path.includes('road-info')) {
      selectedKeys.value = ['1']
    } else if (path.includes('hazard-')) {
      selectedKeys.value = ['5']
    } else if (path.includes('monitor-') || path.includes('weigh-monitor') || path.includes('flood-') || path.includes('camera-')) {
      selectedKeys.value = ['3']
    } else if (path.includes('org-personnel') || path.includes('org-enterprise') || path.includes('tp-') || path.includes('cert-') || path.includes('police-liaison')) {
      selectedKeys.value = ['4']
    }

    // 侧边栏菜单
    if (path === '/dashboard') {
      siderSelectedKeys.value = ['dashboard']
    } else if (path === '/todo') {
      siderSelectedKeys.value = ['todo']
    } else if (path.includes('hazard-checklist-config')) {
      siderSelectedKeys.value = ['hazard-checklist-config']
      openKeys.value = ['hazard-basic']
    } else if (path.includes('hazard-task-management')) {
      siderSelectedKeys.value = ['hazard-task-management']
      openKeys.value = ['hazard-basic']
    } else if (path.includes('hazard-tool-tips')) {
      siderSelectedKeys.value = ['hazard-tool-tips']
      openKeys.value = ['hazard-basic']
    } else if (path.includes('hazard-check-records')) {
      siderSelectedKeys.value = ['hazard-check-records']
      openKeys.value = ['hazard-result']
    } else if (path.includes('hazard-problem-list')) {
      siderSelectedKeys.value = ['hazard-problem-list']
      openKeys.value = ['hazard-result']
    } else if (path.includes('hazard-statistics')) {
      siderSelectedKeys.value = ['hazard-statistics']
      openKeys.value = ['hazard-result']
    } else if (path.includes('bridge-info')) {
      siderSelectedKeys.value = ['bridge-info']
    } else if (path.includes('tunnel-info')) {
      siderSelectedKeys.value = ['tunnel-info']
    } else if (path.includes('road-info')) {
      siderSelectedKeys.value = ['road-info']
    } else if (path.includes('flood-monitor-device')) {
      siderSelectedKeys.value = ['flood-monitor-device']
      openKeys.value = ['iot-flood-device']
    } else if (path.includes('camera-device')) {
      siderSelectedKeys.value = ['camera-device']
      openKeys.value = ['iot-flood-device']
    } else if (path.includes('road-monitor-device')) {
      siderSelectedKeys.value = ['road-monitor-device']
      openKeys.value = ['iot-device']
    } else if (path.includes('tunnel-monitor-device')) {
      siderSelectedKeys.value = ['tunnel-monitor-device']
      openKeys.value = ['iot-device']
    } else if (path.includes('monitor-device')) {
      siderSelectedKeys.value = ['monitor-device']
      openKeys.value = ['iot-device']
    } else if (path.includes('road-monitor-data')) {
      siderSelectedKeys.value = ['road-monitor-data']
      openKeys.value = ['iot-data']
    } else if (path.includes('tunnel-monitor-data')) {
      siderSelectedKeys.value = ['tunnel-monitor-data']
      openKeys.value = ['iot-data']
    } else if (path.includes('monitor-data')) {
      siderSelectedKeys.value = ['monitor-data']
      openKeys.value = ['iot-data']
    } else if (path.includes('weigh-monitor')) {
      siderSelectedKeys.value = ['weigh-monitor']
      openKeys.value = ['iot-data']
    } else if (path.includes('road-monitor-alert')) {
      siderSelectedKeys.value = ['road-monitor-alert']
      openKeys.value = ['iot-alert']
    } else if (path.includes('tunnel-monitor-alert')) {
      siderSelectedKeys.value = ['tunnel-monitor-alert']
      openKeys.value = ['iot-alert']
    } else if (path.includes('monitor-alert')) {
      siderSelectedKeys.value = ['monitor-alert']
      openKeys.value = ['iot-alert']
    } else if (path.includes('org-personnel')) {
      siderSelectedKeys.value = ['org-personnel']
      openKeys.value = ['org-auth-config']
    } else if (path.includes('police-liaison')) {
      siderSelectedKeys.value = ['police-liaison']
      openKeys.value = ['org-auth-config']
    } else if (path.includes('org-enterprise')) {
      siderSelectedKeys.value = ['org-enterprise']
    } else if (path.includes('tp-maintenance')) {
      siderSelectedKeys.value = ['org-tp-maintenance']
      openKeys.value = ['org-third-party']
    } else if (path.includes('tp-inspection')) {
      siderSelectedKeys.value = ['org-tp-inspection']
      openKeys.value = ['org-third-party']
    } else if (path.includes('tp-assessment')) {
      siderSelectedKeys.value = ['org-tp-assessment']
      openKeys.value = ['org-third-party']
    } else if (path.includes('cert-maintenance')) {
      siderSelectedKeys.value = ['org-cert-maintenance']
      openKeys.value = ['org-certification']
    } else if (path.includes('cert-inspection')) {
      siderSelectedKeys.value = ['org-cert-inspection']
      openKeys.value = ['org-certification']
    } else if (path.includes('cert-assessment')) {
      siderSelectedKeys.value = ['org-cert-assessment']
      openKeys.value = ['org-certification']
    }
  },
  { immediate: true }
)

// 顶部菜单
const menuItems = ref<MenuProps['items']>([
  { key: 'dashboard', label: '工作台' },
  { key: '1', label: '档案管理' },
  { key: '5', label: '隐患排查' },
  { key: '2', label: '检测管理' },
  { key: '3', label: '物联监管' },
  { key: '4', label: '机构人员管理' },
])

// 左侧菜单
const siderMenuItems = ref<MenuProps['items']>([
  {
    key: 'basic-info',
    label: '基础信息管理',
    children: [
      { key: 'bridge-info', label: '桥梁信息' },
      { key: 'tunnel-info', label: '隧道信息' },
      { key: 'road-info', label: '道路信息' },
    ],
  },
])

// 物联监管侧边栏菜单
const iotMenuItems = ref<MenuProps['items']>([
  {
    key: 'iot-device',
    label: '监测设备',
    children: [
      { key: 'road-monitor-device', label: '道路监测设备' },
      { key: 'monitor-device', label: '桥梁监测设备' },
      { key: 'tunnel-monitor-device', label: '隧道监测设备' },
    ],
  },
  {
    key: 'iot-data',
    label: '监测数据',
    children: [
      { key: 'road-monitor-data', label: '道路边坡监测' },
      { key: 'monitor-data', label: '桥梁结构监测' },
      { key: 'weigh-monitor', label: '桥梁超限监测' },
      { key: 'tunnel-monitor-data', label: '隧道结构监测' }
    ],
  },
  {
    key: 'iot-alert',
    label: '监测预警',
    children: [
      { key: 'road-monitor-alert', label: '道路监测预警' },
      { key: 'monitor-alert', label: '桥梁监测预警' },
      { key: 'tunnel-monitor-alert', label: '隧道监测预警' },
    ],
  },
  {
    key: 'iot-flood-device',
    label: '内涝物联设备信息',
    children: [
      { key: 'flood-monitor-device', label: '积水监测设备' },
      { key: 'camera-device', label: '摄像头' },
    ],
  },
])

// 隐患排查侧边栏菜单
const hazardMenuItems = ref<MenuProps['items']>([
  {
    key: 'hazard-basic',
    label: '基础信息配置',
    children: [
      { key: 'hazard-checklist-config', label: '检查表配置' },
      { key: 'hazard-task-management', label: '任务管理及发布' },
      { key: 'hazard-tool-tips', label: '检查工具提示信息配置' },
    ],
  },
  {
    key: 'hazard-result',
    label: '检查结果管理',
    children: [
      { key: 'hazard-check-records', label: '检查记录' },
      { key: 'hazard-problem-list', label: '问题清单管理' },
      { key: 'hazard-statistics', label: '统计分析' },
    ],
  },
])

// 机构人员管理侧边栏菜单
const orgPersonnelMenuItems = ref<MenuProps['items']>([
  {
    key: 'org-auth-config',
    label: '主管部门授权配置',
    children: [
      { key: 'org-personnel', label: '人员权限配置' },
      { key: 'police-liaison', label: '公安交警联动' },
    ],
  },
  { key: 'org-enterprise', label: '企业基本信息' },
  {
    key: 'org-third-party',
    label: '第三方机构管理',
    children: [
      { key: 'org-tp-maintenance', label: '日常养护单位' },
      { key: 'org-tp-inspection', label: '检测单位' },
      { key: 'org-tp-assessment', label: '安全评估单位' },
    ],
  },
  {
    key: 'org-certification',
    label: '从业人员认证',
    children: [
      { key: 'org-cert-maintenance', label: '日常养护单位从业人员' },
      { key: 'org-cert-inspection', label: '检测单位从业人员' },
      { key: 'org-cert-assessment', label: '安全评估单位从业人员' },
    ],
  },
])

const handleMenuClick: MenuProps['onClick'] = (info) => {
  if (info.key === 'dashboard') {
    router.push('/dashboard')
  } else if (info.key === '1') {
    router.push('/bridge-info')
  } else if (info.key === '5') {
    router.push('/hazard-checklist-config')
  } else if (info.key === '3') {
    router.push('/monitor-device')
  } else if (info.key === '4') {
    router.push('/org-personnel')
  }
  console.log('menu click', info)
}

// 系统切换下拉菜单点击处理
const handleSystemSwitch = (info: any) => {
  if (info.key === 'cockpit') {
    // 驾驶舱在当前页面打开
    router.push('/cockpit')
  }
}

const handleSiderMenuClick: MenuProps['onClick'] = (info) => {
  if (info.key === 'dashboard') {
    router.push('/dashboard')
  } else if (info.key === 'todo') {
    router.push('/todo')
  } else if (info.key === 'bridge-info') {
    router.push('/bridge-info')
  } else if (info.key === 'tunnel-info') {
    router.push('/tunnel-info')
  } else if (info.key === 'road-info') {
    router.push('/road-info')
  } else if (info.key === 'road-monitor-device') {
    router.push('/road-monitor-device')
  } else if (info.key === 'monitor-device') {
    router.push('/monitor-device')
  } else if (info.key === 'tunnel-monitor-device') {
    router.push('/tunnel-monitor-device')
  } else if (info.key === 'road-monitor-data') {
    router.push('/road-monitor-data')
  } else if (info.key === 'monitor-data') {
    router.push('/monitor-data')
  } else if (info.key === 'weigh-monitor') {
    router.push('/weigh-monitor')
  } else if (info.key === 'tunnel-monitor-data') {
    router.push('/tunnel-monitor-data')
  } else if (info.key === 'road-monitor-alert') {
    router.push('/road-monitor-alert')
  } else if (info.key === 'monitor-alert') {
    router.push('/monitor-alert')
  } else if (info.key === 'tunnel-monitor-alert') {
    router.push('/tunnel-monitor-alert')
  } else if (info.key === 'flood-monitor-device') {
    router.push('/flood-monitor-device')
  } else if (info.key === 'camera-device') {
    router.push('/camera-device')
  } else if (info.key === 'org-personnel') {
    router.push('/org-personnel')
  } else if (info.key === 'police-liaison') {
    router.push('/police-liaison')
  } else if (info.key === 'org-enterprise') {
    router.push('/org-enterprise')
  } else if (info.key === 'org-tp-maintenance') {
    router.push('/tp-maintenance')
  } else if (info.key === 'org-tp-inspection') {
    router.push('/tp-inspection')
  } else if (info.key === 'org-tp-assessment') {
    router.push('/tp-assessment')
  } else if (info.key === 'org-cert-maintenance') {
    router.push('/cert-maintenance')
  } else if (info.key === 'org-cert-inspection') {
    router.push('/cert-inspection')
  } else if (info.key === 'org-cert-assessment') {
    router.push('/cert-assessment')
  } else if (info.key === 'hazard-checklist-config') {
    router.push('/hazard-checklist-config')
  } else if (info.key === 'hazard-task-management') {
    router.push('/hazard-task-management')
  } else if (info.key === 'hazard-tool-tips') {
    router.push('/hazard-tool-tips')
  } else if (info.key === 'hazard-check-records') {
    router.push('/hazard-check-records')
  } else if (info.key === 'hazard-problem-list') {
    router.push('/hazard-problem-list')
  } else if (info.key === 'hazard-statistics') {
    router.push('/hazard-statistics')
  }
}
</script>

<style scoped lang="scss">
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(135deg, #4487ec 0%, #4487ec 40%, #4487ec 70%, #4487ec 100%);
  color: #fff;

  &-left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  &-logo {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      color: #fff;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  &-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &-btn {
    color: #fff !important;
    padding: 0 8px;
  }

  &-avatar {
    margin-left: 8px;
  }

  &-username {
    margin-left: 8px;
    font-size: 14px;
  }

  &-dropdown {
    margin-left: 8px;
  }
}

:deep(.ant-menu) {
  background: transparent !important;
  border-bottom: none !important;
}

:deep(.ant-menu-item) {
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.ant-menu-item-selected) {
  color: #fff !important;
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.sider {
  position: fixed;
  left: 0;
  top: 64px;
  bottom: 0;
  overflow: auto;
  background: #f0f5ff;
  box-shadow: none;

  :deep(.ant-menu) {
    background: transparent;
    border-right: none;
  }

  :deep(.ant-menu-submenu-title) {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85) !important;
    padding: 16px 24px !important;
    height: auto !important;
    line-height: 1.5;
  }

  :deep(.ant-menu-item) {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85) !important;
    padding: 12px 24px !important;
    margin: 4px 0;
    height: auto !important;
    line-height: 1.5;
  }
  
  :deep(.ant-menu-item-selected) {
    color: #1677ff !important;
    background-color: rgba(22, 119, 255, 0.06) !important;
    font-weight: 500;
  }
  
  :deep(.ant-menu-item):hover {
    color: #1677ff !important;
    background-color: rgba(22, 119, 255, 0.06) !important;
  }
}

.main-content {
  margin-left: 200px;
  margin-top: 64px;
  padding: 24px;
  background: #f5f5f5;
  min-height: calc(100vh - 64px);

  &-full {
    margin-left: 0;
  }
}

:deep(.ant-layout-sider-collapsed) {
  + .ant-layout .main-content {
    margin-left: 80px;
  }
}
</style>
