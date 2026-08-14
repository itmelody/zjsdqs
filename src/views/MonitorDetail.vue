<template>
  <div class="monitor-detail-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-left">
        <a-button type="link" @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回驾驶舱
        </a-button>
        <h2 class="page-title">物联监管详情</h2>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-label">接入桥梁总数</div>
          <div class="stat-value blue">3,908<span class="stat-unit"> 座</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">设备总数</div>
          <div class="stat-value cyan">1,714<span class="stat-unit"> 台</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">预警总数</div>
          <div class="stat-value orange">526<span class="stat-unit"> 个</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已处置数</div>
          <div class="stat-value green">481<span class="stat-unit"> 个</span></div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="data-table-card">
        <div class="card-header">
          <h3 class="card-title">各市物联监管数据</h3>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :pagination="{ pageSize: 10 }"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-button type="link" size="small" @click="viewCityDetail(record)">查看详情</a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 返回驾驶舱
function goBack() {
  router.push('/cockpit')
}

// 查看城市详情
function viewCityDetail(record: any) {
  console.log('查看城市详情:', record)
}

// 表格列定义
const columns = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '市区县', dataIndex: 'city', key: 'city', width: 120 },
  { title: '接入桥梁数(座)', dataIndex: 'bridgeCount', key: 'bridgeCount', width: 130 },
  { title: '结构安全设备数(台)', dataIndex: 'structureDeviceCount', key: 'structureDeviceCount', width: 150 },
  { title: '超重设备数(台)', dataIndex: 'overweightDeviceCount', key: 'overweightDeviceCount', width: 140 },
  { title: '预警总数(个)', dataIndex: 'alertCount', key: 'alertCount', width: 120 },
  { title: '已处置数(个)', dataIndex: 'handledCount', key: 'handledCount', width: 120 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 模拟数据
const dataSource = ref([
  { index: 1, city: '杭州市', bridgeCount: 2865, structureDeviceCount: 1286, overweightDeviceCount: 428, alertCount: 526, handledCount: 481 },
  { index: 2, city: '宁波市', bridgeCount: 1983, structureDeviceCount: 892, overweightDeviceCount: 298, alertCount: 342, handledCount: 315 },
  { index: 3, city: '温州市', bridgeCount: 1568, structureDeviceCount: 705, overweightDeviceCount: 235, alertCount: 268, handledCount: 245 },
  { index: 4, city: '绍兴市', bridgeCount: 1426, structureDeviceCount: 642, overweightDeviceCount: 214, alertCount: 245, handledCount: 223 },
  { index: 5, city: '湖州市', bridgeCount: 1084, structureDeviceCount: 488, overweightDeviceCount: 163, alertCount: 186, handledCount: 170 },
  { index: 6, city: '嘉兴市', bridgeCount: 962, structureDeviceCount: 433, overweightDeviceCount: 144, alertCount: 165, handledCount: 151 },
  { index: 7, city: '金华市', bridgeCount: 1127, structureDeviceCount: 507, overweightDeviceCount: 169, alertCount: 193, handledCount: 176 },
  { index: 8, city: '衢州市', bridgeCount: 785, structureDeviceCount: 353, overweightDeviceCount: 118, alertCount: 134, handledCount: 122 },
  { index: 9, city: '台州市', bridgeCount: 1349, structureDeviceCount: 607, overweightDeviceCount: 202, alertCount: 231, handledCount: 211 },
  { index: 10, city: '丽水市', bridgeCount: 893, structureDeviceCount: 402, overweightDeviceCount: 134, alertCount: 153, handledCount: 140 },
  { index: 11, city: '舟山市', bridgeCount: 526, structureDeviceCount: 237, overweightDeviceCount: 79, alertCount: 90, handledCount: 82 },
])
</script>

<style scoped lang="scss">
.monitor-detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a1628 0%, #1a2f4c 100%);
  padding: 20px;
  color: #fff;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #fff;
    }
  }
}

.page-content {
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
    
    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      
      .stat-label {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 12px;
      }
      
      .stat-value {
        font-size: 28px;
        font-weight: 600;
        
        &.blue { color: #4a9eff; }
        &.cyan { color: #00d4ff; }
        &.orange { color: #ff9800; }
        &.green { color: #4caf50; }
        
        .stat-unit {
          font-size: 14px;
          margin-left: 4px;
        }
      }
    }
  }
  
  .data-table-card {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 20px;
    
    .card-header {
      margin-bottom: 16px;
      
      .card-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
      }
    }
    
    :deep(.ant-table) {
      background: transparent;
      color: #fff;
      
      .ant-table-thead > tr > th {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .ant-table-tbody > tr > td {
        background: transparent;
        color: #fff;
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .ant-table-tbody > tr:hover > td {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}
</style>
