<template>
  <div class="dashboard-page">
    <!-- 设施统计 -->
    <div class="dashboard-row">
      <div class="card facility-stats-card">
        <div class="card-header">
          <h3 class="card-title">设施统计</h3>
          <div class="filter-group">
            <a-select v-model:value="province" placeholder="省" style="width: 100px" allow-clear>
              <a-select-option value="浙江省">浙江省</a-select-option>
            </a-select>
            <a-select v-model:value="city" placeholder="市" style="width: 100px" allow-clear>
              <a-select-option value="杭州市">杭州市</a-select-option>
              <a-select-option value="宁波市">宁波市</a-select-option>
            </a-select>
            <a-select v-model:value="district" placeholder="区" style="width: 100px" allow-clear>
              <a-select-option value="上城区">上城区</a-select-option>
              <a-select-option value="拱墅区">拱墅区</a-select-option>
            </a-select>
          </div>
        </div>

        <div class="facility-content">
          <!-- 道路统计 -->
          <div class="stat-section road-section">
            <h4 class="section-title"><EnvironmentOutlined class="section-icon road-icon" />道路统计</h4>
            <div class="stat-cards">
              <div class="stat-card road-card">
                <div class="stat-label">道路总长</div>
                <div class="stat-value">1,256.8 <span class="stat-unit">公里</span></div>
              </div>
              <div class="stat-card road-card">
                <div class="stat-label">路网密度</div>
                <div class="stat-value">1.52 <span class="stat-unit">公里/平方公里</span></div>
              </div>
              <div class="stat-card road-card">
                <div class="stat-label">道路面积率</div>
                <div class="stat-value">18.5 <span class="stat-unit">%</span></div>
              </div>
            </div>
            <div ref="roadChartRef" class="bar-chart"></div>
          </div>

          <!-- 桥梁统计 -->
          <div class="stat-section bridge-section">
            <h4 class="section-title"><BankOutlined class="section-icon bridge-icon" />桥梁统计</h4>
            <div class="stat-cards">
              <div class="stat-card bridge-card">
                <div class="stat-label">城市桥梁总数</div>
                <div class="stat-value">3,908 <span class="stat-unit">座</span></div>
              </div>
              <div class="stat-card bridge-card">
                <div class="stat-label">涉航桥梁总数</div>
                <div class="stat-value">1,024 <span class="stat-unit">座</span></div>
              </div>
              <div class="stat-card bridge-card">
                <div class="stat-label">30年以上桥龄</div>
                <div class="stat-value">256 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div ref="bridgeChartRef" class="bar-chart"></div>
          </div>

          <!-- 隧道统计 -->
          <div class="stat-section tunnel-section">
            <h4 class="section-title"><GatewayOutlined class="section-icon tunnel-icon" />隧道统计</h4>
            <div class="stat-cards">
              <div class="stat-card tunnel-card">
                <div class="stat-label">城市隧道总数</div>
                <div class="stat-value">892 <span class="stat-unit">座</span></div>
              </div>
              <div class="stat-card tunnel-card">
                <div class="stat-label">地下隧道</div>
                <div class="stat-value">456 <span class="stat-unit">座</span></div>
              </div>
              <div class="stat-card tunnel-card">
                <div class="stat-label">人行地道</div>
                <div class="stat-value">128 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div ref="tunnelChartRef" class="bar-chart"></div>
          </div>
        </div>
      </div>

      <!-- 检测管理 -->
      <div class="card detection-card">
        <div class="card-header">
          <h3 class="card-title">检测管理</h3>
        </div>
        <div class="card-content">
          <!-- 检测管理内容 -->
        </div>
      </div>
    </div>

    <!-- 物联监管 -->
    <div class="dashboard-row">
      <div class="card iot-card">
        <div class="card-header">
          <h3 class="card-title">物联监管</h3>
        </div>
        <div class="card-content">
          <!-- 物联监管内容 -->
        </div>
      </div>

      <!-- 隐患排查 -->
      <div class="card inspection-card">
        <div class="card-header">
          <h3 class="card-title">隐患排查</h3>
        </div>
        <div class="card-content">
          <!-- 隐患排查内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { TableColumnsType } from 'ant-design-vue'
import {
  AppstoreOutlined,
  WarningOutlined,
  ToolOutlined,
  PieChartOutlined,
  EnvironmentOutlined,
  BankOutlined,
  GatewayOutlined,
} from '@ant-design/icons-vue'

// 省市区筛选
const province = ref<string>('浙江省')
const city = ref<string>()
const district = ref<string>()

// 图表引用
const roadChartRef = ref<HTMLElement>()
const bridgeChartRef = ref<HTMLElement>()
const tunnelChartRef = ref<HTMLElement>()

const charts: echarts.ECharts[] = []

// 初始化柱状图
function initBarChart(container: HTMLElement | undefined, title: string, data: any[], color: string, isRoad = false) {
  if (!container) return
  const chart = echarts.init(container)
  charts.push(chart)
  
  let option: any = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: isRoad ? ['道路长度', '密度', '规范推荐值'] : [title],
      top: 0,
      textStyle: {
        fontSize: 11,
      },
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '8%',
      top: isRoad ? '20%' : '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      name: title.includes('道路') ? '公里' : '座',
    },
    series: [
      {
        name: title,
        type: 'bar',
        data: data.map(item => item.value),
        itemStyle: {
          color: color,
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          formatter: '{c}',
        },
      },
    ],
  }
  
  // 道路统计特殊处理：添加密度（折线图）
  if (isRoad) {
    option.legend.data = ['道路长度', '路网密度']
    option.yAxis = [
      {
        type: 'value',
        name: '长度(km)',
        position: 'left',
        max: 150,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#1677ff',
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
      },
      {
        type: 'value',
        name: '路网密度(km/km²)',
        position: 'right',
        min: 0,
        max: 4.0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#52c41a',
          },
        },
        axisLabel: {
          formatter: '{value}',
        },
      },
    ]
    option.series = [
      {
        name: '道路长度',
        type: 'bar',
        data: data.map(item => item.length),
        itemStyle: {
          color: '#1677ff',
        },
        barWidth: '40%',
        barGap: '60%',
        yAxisIndex: 0,
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          formatter: '{c}',
        },
      },
      {
        name: '路网密度',
        type: 'line',
        data: data.map(item => item.density),
        itemStyle: {
          color: '#52c41a',
        },
        lineStyle: {
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 8,
        yAxisIndex: 1,
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          formatter: '{c}',
        },
      },
    ]
  } else {
    option.series[0].data = data.map(item => item.value)
  }
  
  chart.setOption(option)
  return chart
}

// 隐患排查表格
const inspectionColumns: TableColumnsType = [
  { title: '地市', dataIndex: 'city', key: 'city', width: 100 },
  { title: '桥梁', dataIndex: 'bridge', key: 'bridge', width: 100 },
  { title: '检查次数', dataIndex: 'checkCount', key: 'checkCount', width: 120 },
  { title: '排查完成率', dataIndex: 'completionRate', key: 'completionRate', width: 120 },
  { title: '发现隐患', dataIndex: 'foundIssues', key: 'foundIssues', width: 100 },
  { title: '未整改隐患', dataIndex: 'unfixedIssues', key: 'unfixedIssues', width: 120 },
]

const inspectionData = ref([
  {
    key: '1',
    city: '省级',
    bridge: 49236,
    checkCount: 9,
    completionRate: '0.01',
    foundIssues: 0,
    unfixedIssues: 0,
  },
  {
    key: '2',
    city: '杭州市',
    bridge: 6682,
    checkCount: 0,
    completionRate: '0.00',
    foundIssues: 0,
    unfixedIssues: 0,
  },
  {
    key: '3',
    city: '宁波市',
    bridge: 4352,
    checkCount: 0,
    completionRate: '0.00',
    foundIssues: 0,
    unfixedIssues: 0,
  },
  {
    key: '4',
    city: '温州市',
    bridge: 3712,
    checkCount: 0,
    completionRate: '0.00',
    foundIssues: 0,
    unfixedIssues: 0,
  },
])

function handleResize() {
  charts.forEach(c => c.resize())
}

onMounted(async () => {
  await nextTick()
  
  // 道路类型统计 - 包含密度和规范推荐值
  const roadData = [
    { name: '快速路', length: 42.7, density: 0.35, recommend: 0.35 },
    { name: '主干路', length: 63.2, density: 0.97, recommend: 1.1 },
    { name: '次干路', length: 46.4, density: 0.71, recommend: 1.3 },
    { name: '支路', length: 112.4, density: 1.73, recommend: 3.5 },
  ]
  
  // 桥梁类型统计
  const bridgeData = [
    { name: '特大型桥梁', value: 45 },
    { name: '大型桥梁', value: 156 },
    { name: '中小桥', value: 2356 },
    { name: '立交桥', value: 289 },
    { name: '高架桥', value: 567 },
    { name: '人行天桥', value: 495 },
  ]
  
  // 隧道类型统计
  const tunnelData = [
    { name: '特长隧道', value: 23 },
    { name: '长隧道', value: 89 },
    { name: '中隧道', value: 256 },
    { name: '短隧道', value: 524 },
  ]
  
  initBarChart(roadChartRef.value, '道路统计', roadData, '#1677ff', true)
  initBarChart(bridgeChartRef.value, '桥梁统计', bridgeData, '#13c2c2')
  initBarChart(tunnelChartRef.value, '隧道统计', tunnelData, '#722ed1')

  window.addEventListener('resize', handleResize)
  // 延迟再次resize确保图表正确渲染
  setTimeout(handleResize, 100)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  charts.forEach(c => c.dispose())
})
</script>

<style scoped lang="scss">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 64px - 48px);
  overflow: hidden;
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  flex: 1;
  min-height: 0;
}

.card {
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: auto;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

// 设施统计
.filter-group {
  display: flex;
  gap: 8px;
}

.facility-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  height: calc(100% - 40px);
}

.stat-section {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  &.road-section {
    border-top: 3px solid #1677ff;
  }
  &.bridge-section {
    border-top: 3px solid #13c2c2;
  }
  &.tunnel-section {
    border-top: 3px solid #722ed1;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px;
  color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  gap: 6px;
}

.section-icon {
  font-size: 16px;
}

.road-icon {
  color: #1677ff;
}

.bridge-icon {
  color: #13c2c2;
}

.tunnel-icon {
  color: #722ed1;
}

.stat-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
}

.stat-card {
  flex: none;
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-left: 3px solid transparent;
  transition: all 0.2s;

  &:hover {
    transform: translateX(2px);
  }

  &.road-card {
    background: linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%);
    border-left-color: #1677ff;
    .stat-value { color: #1677ff; }
  }
  &.bridge-card {
    background: linear-gradient(135deg, #e6fffb 0%, #f0fffe 100%);
    border-left-color: #13c2c2;
    .stat-value { color: #08979c; }
  }
  &.tunnel-card {
    background: linear-gradient(135deg, #f9f0ff 0%, #fcf5ff 100%);
    border-left-color: #722ed1;
    .stat-value { color: #722ed1; }
  }
}

.stat-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 0;
  font-weight: 500;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
}

.stat-unit {
  font-size: 12px;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.45);
}

.bar-chart {
  width: 100%;
  flex: 1;
  min-height: 0;
}

// 检测管理
.detection-content {
  display: flex;
  gap: 16px;
}

.detection-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.detection-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.detection-title {
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.progress-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 6px solid #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #52c41a;

  &.small {
    width: 40px;
    height: 40px;
    border-width: 4px;
    font-size: 12px;
  }
}

.detection-stats {
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.8;
}

.detection-detail {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-info {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 1.8;
}

.detection-stats-right {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 200px;
}

.stats-card {
  border-radius: 4px;
  padding: 16px;
  color: #fff;

  &.overdue {
    background: #ff4d4f;
  }

  &.warning {
    background: #ff7875;
    border: 1px solid #ff4d4f;
  }
}

.stats-card-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  text-align: center;
}

.stats-row {
  display: flex;
  justify-content: space-around;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-label {
  font-size: 12px;
  margin-bottom: 4px;
}

.stats-value {
  font-size: 20px;
  font-weight: 600;

  &.red {
    color: #fff;
  }
}

// 物联监管
.iot-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.iot-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.iot-icon-placeholder {
  width: 60px;
  height: 40px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.iot-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
  text-align: center;
  line-height: 1.5;
}

// 隐患排查
.filter-group {
  display: flex;
  gap: 8px;
}

.inspection-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.summary-icon {
  font-size: 24px;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
}
</style>
