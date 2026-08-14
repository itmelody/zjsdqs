<template>
  <div class="assessment-detail-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="header-left">
        <a-button type="link" @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回驾驶舱
        </a-button>
        <h2 class="page-title">安全评估详情</h2>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-label">应评单元总数</div>
          <div class="stat-value blue">3,908<span class="stat-unit"> 个</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">已评单元数</div>
          <div class="stat-value green">3,878<span class="stat-unit"> 个</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">评估完成率</div>
          <div class="stat-value cyan">99.2%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">风险单元数</div>
          <div class="stat-value orange">89<span class="stat-unit"> 个</span></div>
        </div>
      </div>

      <!-- 数据表格 -->
      <div class="data-table-card">
        <div class="card-header">
          <h3 class="card-title">各市安全评估数据</h3>
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
  { title: '应评单元数(个)', dataIndex: 'totalCount', key: 'totalCount', width: 140 },
  { title: '已评单元数(个)', dataIndex: 'evaluatedCount', key: 'evaluatedCount', width: 140 },
  { title: '完成率', dataIndex: 'completionRate', key: 'completionRate', width: 100 },
  { title: '风险单元数(个)', dataIndex: 'riskUnitCount', key: 'riskUnitCount', width: 130 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 模拟数据
const dataSource = ref([
  { index: 1, city: '杭州市', totalCount: 2865, evaluatedCount: 2845, completionRate: '99.3%', riskUnitCount: 8 },
  { index: 2, city: '宁波市', totalCount: 1983, evaluatedCount: 1970, completionRate: '99.3%', riskUnitCount: 6 },
  { index: 3, city: '温州市', totalCount: 1568, evaluatedCount: 1556, completionRate: '99.2%', riskUnitCount: 5 },
  { index: 4, city: '绍兴市', totalCount: 1426, evaluatedCount: 1415, completionRate: '99.2%', riskUnitCount: 4 },
  { index: 5, city: '湖州市', totalCount: 1084, evaluatedCount: 1075, completionRate: '99.2%', riskUnitCount: 3 },
  { index: 6, city: '嘉兴市', totalCount: 962, evaluatedCount: 954, completionRate: '99.2%', riskUnitCount: 3 },
  { index: 7, city: '金华市', totalCount: 1127, evaluatedCount: 1118, completionRate: '99.2%', riskUnitCount: 4 },
  { index: 8, city: '衢州市', totalCount: 785, evaluatedCount: 779, completionRate: '99.2%', riskUnitCount: 2 },
  { index: 9, city: '台州市', totalCount: 1349, evaluatedCount: 1338, completionRate: '99.2%', riskUnitCount: 4 },
  { index: 10, city: '丽水市', totalCount: 893, evaluatedCount: 886, completionRate: '99.2%', riskUnitCount: 3 },
  { index: 11, city: '舟山市', totalCount: 526, evaluatedCount: 522, completionRate: '99.2%', riskUnitCount: 2 },
])
</script>

<style scoped lang="scss">
.assessment-detail-page {
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
