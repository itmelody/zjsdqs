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
      <!-- 左侧：检测概览 -->
      <div class="panel inspection-left">
        <div class="dark-card stat-card-compact inspection-module-card" 
             :class="{ 'module-highlighted': inspectionActiveModule === 'overview' }" 
             @click="setInspectionActiveModule('overview')">
          <div class="card-title-row">
            <div class="card-title">检测概览</div>
          </div>
          
          <div class="hazard-section">
            <div class="hazard-sub-title">应检数</div>
            <div class="stat-value blue">{{ inspectionOverviewData.shouldCheck }}<span class="stat-unit"> 座</span></div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">已检数</div>
            <div class="stat-value green">{{ inspectionOverviewData.checked }}<span class="stat-unit"> 座</span></div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">待检数</div>
            <div class="stat-value orange">{{ inspectionOverviewData.shouldCheck - inspectionOverviewData.checked }}<span class="stat-unit"> 座</span></div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">检测完成率</div>
            <div class="stat-value cyan">{{ inspectionOverviewData.completionRate }}%</div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">超期未检数</div>
            <div class="stat-value red">{{ inspectionOverviewData.overdueUncheck }}<span class="stat-unit"> 座</span></div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">即将超期数（不足30天）</div>
            <div class="stat-value yellow">{{ inspectionOverviewData.aboutToOverdue }}<span class="stat-unit"> 座</span></div>
          </div>
        </div>
      </div>

      <!-- 中部：地图 -->
      <div class="panel inspection-center">
        <div class="dark-card inspection-map-card">
          <div class="inspection-map-toolbar">
            <!-- 标准地图/卫星地图切换 + 浙江省选择器 -->
            <div class="map-controls-row">
              <div class="map-type-toggle" @click="toggleMapType">
                <span :class="{ active: mapStyle === 'standard' }">标准地图</span>
                <span :class="{ active: mapStyle === 'satellite' }">卫星地图</span>
              </div>
              <div class="map-selector" @click="showCityDropdown = !showCityDropdown">
                <span class="selector-text">{{ currentCity }}</span>
                <span class="selector-arrow" :class="{ open: showCityDropdown }">&#9662;</span>
                <div class="city-dropdown" v-show="showCityDropdown" @click.stop>
                  <div class="dropdown-item" :class="{ active: currentCity === '浙江省' }" @click="currentCity = '浙江省'; showCityDropdown = false">浙江省</div>
                  <div class="dropdown-item" v-for="city in cityList" :key="city" :class="{ active: currentCity === city }" @click="currentCity = city; showCityDropdown = false">
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 地图标题 -->
          <div class="map-title-bar">
            <span class="map-title-text">{{ inspectionActiveModule === 'overview' ? '检测概览' : '风险整改' }}</span>
          </div>
          
          <div class="map-placeholder">
            <!-- 静态地图：柱状图 -->
            <template v-if="mapStyle === 'standard'">
              <div class="static-map-container static-map-with-bars">
                <img src="/zhejiang-province-map.png" alt="浙江省地图" class="static-map-bg" />
                <div class="city-bars-overlay">
                  <div v-for="(data, cityName) in cityInspectionStats" :key="cityName" 
                       class="city-bar-item"
                       :style="{ left: getCityPosition(cityName).x + '%', top: getCityPosition(cityName).y + '%' }"
                       @mouseenter="showTooltip(cityName, data, $event)"
                       @mouseleave="hideTooltip">
                    <div class="bar-chart-wrapper">
                      <!-- 检测概览模块使用环形图 -->
                      <template v-if="inspectionActiveModule === 'overview'">
                        <div class="ring-chart" :style="{ 
                          background: `conic-gradient(
                            #5ad8a6 0% ${data.checked / data.shouldCheck * 100}%, 
                            #5b8ff9 ${data.checked / data.shouldCheck * 100}% 100%
                          )` 
                        }">
                          <div class="ring-center"></div>
                        </div>
                      </template>
                      <!-- 风险整改模块使用柱状图 -->
                      <template v-else>
                        <div class="bar-group">
                          <div class="bar bar-risk-total" :style="{ height: (data.riskTotal / maxValue * 100) + 'px' }">
                            <span class="bar-value">{{ data.riskTotal }}</span>
                          </div>
                          <div class="bar bar-de-grade-unqualified" :style="{ height: ((data.deGrade + data.unqualified) / maxValue * 100) + 'px' }">
                            <span class="bar-value">{{ data.deGrade + data.unqualified }}</span>
                          </div>
                        </div>
                      </template>
                    </div>
                    <div class="city-name-label">{{ cityName.replace('市', '') }}</div>
                  </div>
                </div>
                
                <!-- 悬浮提示框 -->
                <div v-if="showTip"
                     class="inspection-tooltip"
                     :style="{ left: tooltipX + 'px', top: tooltipY + 'px', position: 'fixed' }">
                  <button class="tooltip-close-btn" @click="hideTooltip">×</button>
                  <template v-if="inspectionActiveModule === 'overview'">
                    <div class="tooltip-item-box">
                      <div class="item-label">应检数（座）</div>
                      <div class="item-value">{{ currentTooltipData?.shouldCheck || 0 }}</div>
                      <div class="item-bar total-check-bar"></div>
                    </div>
                    <div class="tooltip-item-box">
                      <div class="item-label">已检数（座）</div>
                      <div class="item-value">{{ currentTooltipData?.checked || 0 }}</div>
                      <div class="item-bar checked-bar"></div>
                    </div>
                    <div class="tooltip-item-box">
                      <div class="item-label">待检数（座）</div>
                      <div class="item-value">{{ (currentTooltipData?.shouldCheck || 0) - (currentTooltipData?.checked || 0) }}</div>
                      <div class="item-bar pending-check-bar"></div>
                    </div>
                    <div class="tooltip-item-box">
                      <div class="item-label">超期未检数（座）</div>
                      <div class="item-value">{{ currentTooltipData?.overdueUncheck || 0 }}</div>
                      <div class="item-bar overdue-uncheck-bar"></div>
                    </div>
                    <div class="tooltip-item-box">
                      <div class="item-label">即将超期数（座）</div>
                      <div class="item-value">{{ currentTooltipData?.aboutToOverdue || 0 }}</div>
                      <div class="item-bar about-to-overdue-bar"></div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="tooltip-item-box">
                      <div class="item-label">风险总数（个）</div>
                      <div class="item-value">{{ currentTooltipData?.riskTotal || 0 }}</div>
                      <div class="item-bar risk-total-bar"></div>
                    </div>
                    <div class="tooltip-item-box">
                      <div class="item-label">D/E级、不合格桥梁数（座）</div>
                      <div class="item-value">{{ (currentTooltipData?.deGrade || 0) + (currentTooltipData?.unqualified || 0) }}</div>
                      <div class="item-bar de-grade-unqualified-bar"></div>
                    </div>
                  </template>
                </div>
                
                <!-- 图例 -->
                <div class="bar-legend">
                  <template v-if="inspectionActiveModule === 'overview'">
                    <div class="legend-item">
                      <span class="legend-color legend-checked"></span>
                      <span class="legend-text">已检数（座）</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-color legend-should-check"></span>
                      <span class="legend-text">待检数（座）</span>
                    </div>
                  </template>
                  <template v-else>
                    <div class="legend-item">
                      <span class="legend-color legend-risk-total"></span>
                      <span class="legend-text">风险总数（个）</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-color legend-de-grade-unqualified"></span>
                      <span class="legend-text">D/E级、不合格桥梁数（座）</span>
                    </div>
                  </template>
                </div>
              </div>
            </template>
            
            <!-- 高德GIS地图：点位 -->
            <template v-else>
              <div ref="gisMapRef" class="amap-container" style="height: calc(100% - 80px); margin-top: 8px;"></div>
              <!-- GIS地图图例 -->
              <div class="gis-map-legend">
                <div class="legend-checkbox-panel">
                  <label class="checkbox-item" v-for="level in gradeLevels" :key="level.key">
                    <span class="custom-checkbox" :class="{ checked: (gradeChecked as any)[level.key] }" @click="(gradeChecked as any)[level.key] = !(gradeChecked as any)[level.key]">
                      <svg v-if="(gradeChecked as any)[level.key]" viewBox="0 0 12 12" class="check-icon"><path d="M2,6 L5,9 L10,3" stroke="#5b8ff9" stroke-width="2" fill="none"/></svg>
                    </span>
                    <span class="legend-dot" :style="{ backgroundColor: level.color }"></span>
                    <span class="checkbox-label">{{ level.name }}</span>
                  </label>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 右侧：风险整改 -->
      <div class="panel inspection-right">
        <div class="dark-card stat-card-compact inspection-module-card" 
             :class="{ 'module-highlighted': inspectionActiveModule === 'risk' }" 
             @click="setInspectionActiveModule('risk')">
          <div class="card-title-row">
            <div class="card-title">风险整改</div>
          </div>
          
          <div class="hazard-section">
            <div class="hazard-sub-title">风险总数</div>
            <div class="stat-value orange">{{ riskRectifyData.totalRisk }}<span class="stat-unit"> 个</span></div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">已处置数</div>
            <div class="stat-value green">{{ riskRectifyData.handled }}<span class="stat-unit"> 个</span></div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">处置率</div>
            <div class="stat-value blue">{{ riskRectifyData.handleRate }}%</div>
          </div>
          <div class="hazard-section">
            <div class="hazard-sub-title">检测等级分布</div>
            <div class="inspection-level-list">
              <div class="level-item" v-for="(item, index) in gradeDistribution" :key="index">
                <span class="level-dot" :style="{ backgroundColor: item.color }"></span>
                <span class="level-name">{{ item.name }}</span>
                <span class="level-value">{{ item.value }}<span class="level-unit"> 座</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const router = useRouter()

// 返回驾驶舱
function goBack() {
  router.push('/cockpit')
}

// 当前高亮模块
const inspectionActiveModule = ref<'overview' | 'risk'>('overview')

// 设置活跃模块
function setInspectionActiveModule(module: 'overview' | 'risk') {
  inspectionActiveModule.value = inspectionActiveModule.value === module ? null : module
}

// 检测概览数据
const inspectionOverviewData = {
  shouldCheck: 3908,       // 应检数
  checked: 3878,           // 已检数
  completionRate: 99.2,    // 检测完成率
  overdueUncheck: 30,      // 超期未检数
  aboutToOverdue: 45,      // 即将超期数（不足30天）
  alreadyOverdue: 15       // 已超期数
}

// 风险整改数据
const riskRectifyData = {
  totalRisk: 128,          // 风险总数
  handled: 95,             // 已处置数
  handleRate: 74.2         // 处置率
}

// 检测等级分布
const gradeDistribution = [
  { name: 'A级', value: 1256, color: '#5ad8a6' },
  { name: 'B级', value: 1180, color: '#5b8ff9' },
  { name: 'C级', value: 892, color: '#f6bd16' },
  { name: 'D级', value: 358, color: '#e86452' },
  { name: 'E级', value: 192, color: '#d15c4d' },
  { name: '合格', value: 2456, color: '#6dc8ec' },
  { name: '不合格', value: 128, color: '#ff6b6b' }
]

// 等级筛选
const gradeLevels = [
  { key: 'a', name: 'A级', color: '#5ad8a6' },
  { key: 'b', name: 'B级', color: '#5b8ff9' },
  { key: 'c', name: 'C级', color: '#f6bd16' },
  { key: 'd', name: 'D级', color: '#e86452' },
  { key: 'e', name: 'E级', color: '#d15c4d' },
  { key: 'qualified', name: '合格', color: '#6dc8ec' },
  { key: 'unqualified', name: '不合格', color: '#ff6b6b' }
]

const gradeChecked = ref({
  a: true, b: true, c: true, d: true, e: true, qualified: true, unqualified: true
})

// 城市列表
const cityList = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市']

// 地图样式
const mapStyle = ref<'standard' | 'satellite'>('standard')
const currentCity = ref('浙江省')
const showCityDropdown = ref(false)

// 切换地图类型
function toggleMapType() {
  mapStyle.value = mapStyle.value === 'standard' ? 'satellite' : 'standard'
  if (mapStyle.value === 'satellite') {
    nextTick(() => {
      initGisMap()
    })
  }
}

// 获取城市位置（简化版，实际应根据真实坐标）
function getCityPosition(cityName: string): { x: number; y: number } {
  const positions: Record<string, { x: number; y: number }> = {
    '杭州市': { x: 45, y: 55 },
    '宁波市': { x: 70, y: 50 },
    '温州市': { x: 65, y: 80 },
    '嘉兴市': { x: 50, y: 40 },
    '湖州市': { x: 40, y: 35 },
    '绍兴市': { x: 55, y: 50 },
    '金华市': { x: 45, y: 65 },
    '衢州市': { x: 25, y: 60 },
    '舟山市': { x: 85, y: 45 },
    '台州市': { x: 60, y: 75 },
    '丽水市': { x: 35, y: 75 }
  }
  return positions[cityName] || { x: 50, y: 50 }
}

// 各市检测统计数据 - 使用ref立即初始化，避免首次渲染时conic-gradient不显示
function generateCityStats() {
  const stats: Record<string, {
    shouldCheck: number;
    checked: number;
    overdueUncheck: number;
    aboutToOverdue: number;
    riskTotal: number;
    deGrade: number;
    unqualified: number;
  }> = {}
  
  cityList.forEach(city => {
    const shouldCheck = Math.floor(Math.random() * 300) + 200
    const checked = Math.floor(Math.random() * (shouldCheck - 50)) + 50 // 确保已检数 < 应检数
    stats[city] = {
      shouldCheck: shouldCheck,
      checked: checked,
      overdueUncheck: Math.floor(Math.random() * 20) + 5,
      aboutToOverdue: Math.floor(Math.random() * 30) + 10,
      riskTotal: Math.floor(Math.random() * 15) + 5,
      deGrade: Math.floor(Math.random() * 10) + 2,
      unqualified: Math.floor(Math.random() * 8) + 1
    }
  })
  
  return stats
}

const cityInspectionStats = ref(generateCityStats())

// 计算最大值用于柱状图高度
const maxValue = computed(() => {
  let max = 0
  Object.values(cityInspectionStats.value).forEach(data => {
    if (inspectionActiveModule.value === 'overview') {
      if (data.shouldCheck > max) max = data.shouldCheck
      if (data.checked > max) max = data.checked
      if (data.overdueUncheck > max) max = data.overdueUncheck
      if (data.aboutToOverdue > max) max = data.aboutToOverdue
    } else {
      if (data.riskTotal > max) max = data.riskTotal
      if (data.deGrade + data.unqualified > max) max = data.deGrade + data.unqualified
    }
  })
  return max || 1
})

// Tooltip状态
const showTip = ref(false)
const currentTooltipCity = ref('')
const currentTooltipData = ref<any>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// 显示Tooltip
function showTooltip(cityName: string, data: any, event: MouseEvent) {
  currentTooltipCity.value = cityName
  currentTooltipData.value = data
  showTip.value = true
  
  // 计算位置（鼠标附近）
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  tooltipX.value = rect.left + rect.width / 2
  tooltipY.value = rect.top - 10
}

// 隐藏Tooltip
function hideTooltip() {
  showTip.value = false
  currentTooltipCity.value = ''
  currentTooltipData.value = null
}

// GIS地图引用
const gisMapRef = ref<HTMLElement>()
let gisMap: any = null

// 初始化GIS地图
function initGisMap() {
  if (!gisMapRef.value) return
  
  // 这里应该初始化高德地图
  // 由于是示例代码，暂时不实现具体逻辑
  console.log('Init GIS Map')
}

onMounted(() => {
  // 默认显示静态地图
})

onBeforeUnmount(() => {
  if (gisMap) {
    gisMap.destroy()
  }
})
</script>

<style scoped lang="scss">
.inspection-detail-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a1628 0%, #1a2a4a 100%);
  padding: 20px;
  color: #fff;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: rgba(0, 30, 60, 0.8);
  border-radius: 8px;
  border: 1px solid rgba(0, 180, 255, 0.3);
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .page-title {
      font-size: 24px;
      font-weight: bold;
      color: #00b4ff;
      margin: 0;
    }
  }
}

.page-content {
  display: grid;
  grid-template-columns: 440px 1fr 460px;
  gap: 20px;
  height: calc(100vh - 180px);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dark-card {
  background: rgba(0, 30, 60, 0.6);
  border: 1px solid rgba(0, 180, 255, 0.3);
  border-radius: 8px;
  padding: 15px;
  
  &.stat-card-compact {
    padding: 12px;
  }
  
  &.inspection-module-card {
    cursor: pointer;
    transition: all 0.3s;
  }
  
  &.module-highlighted {
    border: 2px solid #00b4ff;
    box-shadow: 0 0 20px rgba(0, 180, 255, 0.5), inset 0 0 20px rgba(0, 180, 255, 0.1);
    background: linear-gradient(135deg, rgba(0, 180, 255, 0.15) 0%, rgba(0, 180, 255, 0.05) 100%);
  }
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  
  .card-title {
    font-size: 16px;
    font-weight: bold;
    color: #00b4ff;
  }
}

.hazard-section {
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .hazard-sub-title {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 6px;
  }
  
  .stat-value {
    font-size: 22px;
    font-weight: bold;
    
    &.blue { color: #5b8ff9; }
    &.green { color: #5ad8a6; }
    &.cyan { color: #6dc8ec; }
    &.red { color: #e86452; }
    &.yellow { color: #f6bd16; }
    &.orange { color: #ff9845; }
    
    .stat-unit {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
      margin-left: 4px;
    }
  }
}

.inspection-level-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  .level-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    
    .level-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .level-name {
      flex: 1;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
    }
    
    .level-value {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      
      .level-unit {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
        margin-left: 2px;
      }
    }
  }
}

.inspection-map-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  
  .inspection-map-toolbar {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 12px;
    
    .map-controls-row {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }
    
    .map-type-toggle {
      display: flex;
      background: rgba(0, 30, 60, 0.8);
      border: 1px solid rgba(0, 180, 255, 0.3);
      border-radius: 4px;
      overflow: hidden;
      
      span {
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s;
        
        &.active {
          background: rgba(0, 180, 255, 0.3);
          color: #00b4ff;
        }
        
        &:not(.active) {
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
    
    .map-selector {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      background: rgba(0, 30, 60, 0.8);
      border: 1px solid rgba(0, 180, 255, 0.3);
      border-radius: 4px;
      cursor: pointer;
      
      .selector-text {
        font-size: 13px;
        color: #fff;
      }
      
      .selector-arrow {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.7);
        transition: transform 0.3s;
        
        &.open {
          transform: rotate(180deg);
        }
      }
      
      .city-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 4px;
        background: rgba(0, 30, 60, 0.95);
        border: 1px solid rgba(0, 180, 255, 0.3);
        border-radius: 4px;
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
        
        .dropdown-item {
          padding: 8px 12px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.3s;
          
          &:hover,
          &.active {
            background: rgba(0, 180, 255, 0.2);
            color: #00b4ff;
          }
        }
      }
    }
  }
  
  .map-title-bar {
    text-align: center;
    padding: 8px 0;
    background: rgba(0, 180, 255, 0.1);
    border-radius: 4px;
    margin-bottom: 12px;
    
    .map-title-text {
      font-size: 16px;
      font-weight: bold;
      color: #00b4ff;
    }
  }
  
  .map-placeholder {
    flex: 1;
    position: relative;
    background: rgba(0, 20, 40, 0.5);
    border-radius: 4px;
    overflow: hidden;
  }
}

.static-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  
  &.static-map-with-bars {
    .static-map-bg {
      width: 85%;
      height: 85%;
      object-fit: contain;
      opacity: 0.7;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    
    .city-bars-overlay {
      position: absolute;
      width: 85%;
      height: 85%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      
      .city-bar-item {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -50%);
        pointer-events: auto;
        cursor: pointer;
        
        .bar-chart-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
          padding: 8px 6px;
          margin-bottom: 4px;
          
          // 环形图样式
          .ring-chart {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 10px rgba(91, 143, 249, 0.3);
            will-change: transform;
            z-index: 0;
            
            &::before {
              content: '';
              position: absolute;
              width: 40px;
              height: 40px;
              background: rgba(0, 0, 0, 0.7);
              border-radius: 50%;
              z-index: 1;
            }
            
            .ring-center {
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              
              .ring-value {
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                line-height: 1;
              }
              
              .ring-label {
                font-size: 10px;
                color: rgba(255, 255, 255, 0.7);
                margin-top: 2px;
              }
            }
          }
          
          .bar-group {
            display: flex;
            gap: 4px;
            align-items: flex-end;
            height: 100px;
            
            .bar {
              width: 18px;
              border-radius: 2px 2px 0 0;
              transition: all 0.3s;
              position: relative;
              
              .bar-value {
                position: absolute;
                top: -18px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 11px;
                font-weight: bold;
                color: #fff;
                white-space: nowrap;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
              }
              
              &.bar-should-check {
                background: linear-gradient(180deg, #5b8ff9, #3a6fd8);
                box-shadow: 0 0 8px rgba(91, 143, 249, 0.5);
              }
              
              &.bar-checked {
                background: linear-gradient(180deg, #5ad8a6, #3cb890);
                box-shadow: 0 0 8px rgba(90, 216, 166, 0.5);
              }
              
              &.bar-overdue-uncheck {
                background: linear-gradient(180deg, #e86452, #d15c4d);
                box-shadow: 0 0 8px rgba(232, 100, 82, 0.5);
              }
              
              &.bar-about-to-overdue {
                background: linear-gradient(180deg, #f6bd16, #e5a814);
                box-shadow: 0 0 8px rgba(246, 189, 22, 0.5);
              }
              
              &.bar-risk-total {
                background: linear-gradient(180deg, #ff9845, #e88535);
                box-shadow: 0 0 8px rgba(255, 152, 69, 0.5);
              }
              
              &.bar-de-grade-unqualified {
                background: linear-gradient(180deg, #e86452, #d15c4d);
                box-shadow: 0 0 8px rgba(232, 100, 82, 0.5);
              }
            }
          }
        }
        
        .city-name-label {
          font-size: 12px;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
          padding: 2px 6px;
          border-radius: 3px;
          white-space: nowrap;
        }
      }
    }
  }
}

.inspection-tooltip {
  background: rgba(0, 30, 60, 0.95);
  border: 1px solid rgba(0, 180, 255, 0.5);
  border-radius: 6px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  
  .tooltip-close-btn {
    position: absolute;
    top: 4px;
    right: 8px;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    
    &:hover {
      color: #fff;
    }
  }
  
  .tooltip-item-box {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .item-label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 4px;
    }
    
    .item-value {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 4px;
    }
    
    .item-bar {
      height: 6px;
      border-radius: 3px;
      
      &.should-check-bar {
        background: linear-gradient(90deg, #5b8ff9, #3a6fd8);
      }
      
      &.total-check-bar {
        background: linear-gradient(90deg, #9254de, #722ed1);
      }
      
      &.checked-bar {
        background: linear-gradient(90deg, #5ad8a6, #3cb890);
      }
      
      &.pending-check-bar {
        background: linear-gradient(90deg, #5b8ff9, #3a6fd8);
      }
      
      &.overdue-uncheck-bar {
        background: linear-gradient(90deg, #e86452, #d15c4d);
      }
      
      &.about-to-overdue-bar {
        background: linear-gradient(90deg, #f6bd16, #e5a814);
      }
      
      &.risk-total-bar {
        background: linear-gradient(90deg, #ff9845, #e88535);
      }
      
      &.de-grade-unqualified-bar {
        background: linear-gradient(90deg, #e86452, #d15c4d);
      }
    }
  }
}

.bar-legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 15px;
  background: rgba(0, 30, 60, 0.8);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 180, 255, 0.3);
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    
    .legend-color {
      width: 14px;
      height: 14px;
      border-radius: 2px;
      
      &.legend-should-check {
        background: linear-gradient(180deg, #5b8ff9, #3a6fd8);
        box-shadow: 0 0 6px rgba(91, 143, 249, 0.5);
      }
      
      &.legend-checked {
        background: linear-gradient(180deg, #5ad8a6, #3cb890);
        box-shadow: 0 0 6px rgba(90, 216, 166, 0.5);
      }
      
      &.legend-overdue-uncheck {
        background: linear-gradient(180deg, #e86452, #d15c4d);
        box-shadow: 0 0 6px rgba(232, 100, 82, 0.5);
      }
      
      &.legend-about-to-overdue {
        background: linear-gradient(180deg, #f6bd16, #e5a814);
        box-shadow: 0 0 6px rgba(246, 189, 22, 0.5);
      }
      
      &.legend-risk-total {
        background: linear-gradient(180deg, #ff9845, #e88535);
        box-shadow: 0 0 6px rgba(255, 152, 69, 0.5);
      }
      
      &.legend-de-grade-unqualified {
        background: linear-gradient(180deg, #e86452, #d15c4d);
        box-shadow: 0 0 6px rgba(232, 100, 82, 0.5);
      }
    }
    
    .legend-text {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

.gis-map-legend {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(0, 30, 60, 0.8);
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 180, 255, 0.3);
  
  .legend-checkbox-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    
    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      
      .custom-checkbox {
        width: 14px;
        height: 14px;
        border: 1px solid rgba(0, 180, 255, 0.5);
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 30, 60, 0.6);
        transition: all 0.3s;
        
        &.checked {
          background: rgba(0, 180, 255, 0.3);
          border-color: #00b4ff;
          
          .check-icon {
            width: 10px;
            height: 10px;
          }
        }
      }
      
      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      
      .checkbox-label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.amap-container {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
</style>
