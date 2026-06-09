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
        <a-button type="link" class="header-btn">
          <SettingOutlined />
          <span>系统切换</span>
        </a-button>
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
        v-model:collapsed="collapsed"
        collapsible
        width="200"
        class="sider"
      >
        <a-menu
          v-model:selectedKeys="siderSelectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          theme="light"
          :items="siderMenuItems"
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
  return route.path !== '/dashboard'
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
    }

    // 侧边栏菜单
    if (path.includes('bridge-info')) {
      siderSelectedKeys.value = ['bridge-info']
    } else if (path.includes('tunnel-info')) {
      siderSelectedKeys.value = ['tunnel-info']
    } else if (path.includes('road-info')) {
      siderSelectedKeys.value = ['road-info']
    }
  },
  { immediate: true }
)

// 顶部菜单
const menuItems = ref<MenuProps['items']>([
  { key: 'dashboard', label: '工作台' },
  { key: '1', label: '档案管理' },
  { key: '2', label: '风险清单' },
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

const handleMenuClick: MenuProps['onClick'] = (info) => {
  if (info.key === 'dashboard') {
    router.push('/dashboard')
  } else if (info.key === '1') {
    router.push('/bridge-info')
  }
  console.log('menu click', info)
}

const handleSiderMenuClick: MenuProps['onClick'] = (info) => {
  if (info.key === 'bridge-info') {
    router.push('/bridge-info')
  } else if (info.key === 'tunnel-info') {
    router.push('/tunnel-info')
  } else if (info.key === 'road-info') {
    router.push('/road-info')
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
