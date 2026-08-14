<template>
  <div class="inspection-detail-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-left">
        <a-button type="link" @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回驾驶舱
        </a-button>
        <h2 class="page-title">设施检测详情</h2>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-label">应检总数</div>
          <div class="stat-value blue">3,908<span class="stat-unit"> 座</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已检数</div>
          <div class="stat-value green">3,878<span class="stat-unit"> 座</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">检测完成率</div>
          <div class="stat-value cyan">99.2%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">风险总数</div>
          <div class="stat-value orange">128<span class="stat-unit"> 个</span></div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="data-table-card">
        <div class="card-header">
          <h3 class="card-title">各市设施检测数据</h3>
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
  { title: '应检数(座)', dataIndex: 'shouldCheck', key: 'shouldCheck', width: 120 },
  { title: '已检数(座)', dataIndex: 'checked', key: 'checked', width: 120 },
  { title: '完成率', dataIndex: 'completionRate', key: 'completionRate', width: 100 },
  { title: '风险总数(个)', dataIndex: 'riskCount', key: 'riskCount', width: 120 },
  { title: '已处置数(个)', dataIndex: 'handledCount', key: 'handledCount', width: 120 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 模拟数据
const dataSource = ref([
  { index: 1, city: '杭州市', shouldCheck: 2865, checked: 2845, completionRate: '99.3%', riskCount: 128, handledCount: 95 },
  { index: 2, city: '宁波市', shouldCheck: 1983, checked: 1970, completionRate: '99.3%', riskCount: 85, handledCount: 63 },
  { index: 3, city: '温州市', shouldCheck: 1568, checked: 1556, completionRate: '99.2%', riskCount: 68, handledCount: 51 },
  { index: 4, city: '绍兴市', shouldCheck: 1426, checked: 1415, completionRate: '99.2%', riskCount: 62, handledCount: 46 },
  { index: 5, city: '湖州市', shouldCheck: 1084, checked: 1075, completionRate: '99.2%', riskCount: 47, handledCount: 35 },
  { index: 6, city: '嘉兴市', shouldCheck: 962, checked: 954, completionRate: '99.2%', riskCount: 42, handledCount: 31 },
  { index: 7, city: '金华市', shouldCheck: 1127, checked: 1118, completionRate: '99.2%', riskCount: 49, handledCount: 36 },
  { index: 8, city: '衢州市', shouldCheck: 785, checked: 779, completionRate: '99.2%', riskCount: 34, handledCount: 25 },
  { index: 9, city: '台州市', shouldCheck: 1349, checked: 1338, completionRate: '99.2%', riskCount: 59, handledCount: 44 },
  { index: 10, city: '丽水市', shouldCheck: 893, checked: 886, completionRate: '99.2%', riskCount: 39, handledCount: 29 },
  { index: 11, city: '舟山市', shouldCheck: 526, checked: 522, completionRate: '99.2%', riskCount: 23, handledCount: 17 },
])
</script>

<style scoped lang="scss">
.inspection-detail-page {
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
