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
      <!-- 左侧：设备列表 + 超限报警统计 -->
      <div class="panel monitor-left">
        <div class="dark-card monitor-device-card">
          <div class="card-title-row">
            <div class="card-title">设备列表</div>
          </div>
          <div class="device-list">
            <table class="dark-table">
              <thead>
                <tr>
                  <th style="width:36px">序号</th>
                  <th>市区县</th>
                  <th>设施名称</th>
                  <th>结构安全设备数（台）</th>
                  <th>超重设备数（台）</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in monitorDevices" :key="d.key">
                  <td>{{ d.key }}</td>
                  <td>{{ d.district }}</td>
                  <td>{{ d.name }}</td>
                  <td>{{ d.structureSafeCount }}</td>
                  <td>{{ d.overweightCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="device-footer">
            <span>共 <b>9099</b> 条数据</span>
            <a class="link-btn" @click="showDeviceDetailModal = true">查看设备详情 &gt;</a>
          </div>
        </div>
        <div class="dark-card alarm-stats-card">
          <div class="card-title-row">
            <div class="card-title">超限报警统计</div>
          </div>
          <div class="alarm-cards">
            <div class="alarm-card">
              <div class="alarm-label">预警总数</div>
              <div class="alarm-value blue">65</div>
            </div>
            <div class="alarm-card">
              <div class="alarm-label">处置总数</div>
              <div class="alarm-value cyan">57</div>
            </div>
            <div class="alarm-card">
              <div class="alarm-label">处置率</div>
              <div class="alarm-value green">87.7%</div>
            </div>
          </div>
          <div class="alarm-chart-legend">
            <span class="legend-dot red"></span>一级预警
            <span class="legend-dot orange"></span>二级预警
            <span class="legend-dot green"></span>三级预警
          </div>
          <div ref="alarmTrendChartRef" class="alarm-trend-chart"></div>
          <div class="alarm-footer">
            <a class="link-btn" @click="showAlarmDetailModal = true">报警详情 &gt;</a>
          </div>
        </div>
      </div>

      <!-- 中部：地图 -->
      <div class="panel monitor-center">
        <div class="dark-card monitor-map-card">
          <div class="monitor-map-toolbar">
            <!-- 标准地图/卫星地图切换 + 浙江省选择器 -->
            <div class="map-controls-row">
              <div class="map-type-toggle" @click="toggleMapType">
                <span :class="{ active: mapStyle === 'standard' }">标准地图</span>
                <span :class="{ active: mapStyle === 'satellite' }">卫星地图</span>
              </div>
              <div class="map-selector" @click="showMonitorCityDropdown = !showMonitorCityDropdown">
                <span class="selector-text">{{ monitorCity }}</span>
                <span class="selector-arrow" :class="{ open: showMonitorCityDropdown }">&#9662;</span>
                <div class="city-dropdown" v-show="showMonitorCityDropdown" @click.stop>
                  <div class="dropdown-item" :class="{ active: monitorCity === '浙江省' }" @click="monitorCity = '浙江省'; showMonitorCityDropdown = false">浙江省</div>
                  <div class="dropdown-item" v-for="city in cityList" :key="city" :class="{ active: monitorCity === city }" @click="monitorCity = city; showMonitorCityDropdown = false">
                    {{ city }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 地图上方指标模块 -->
          <div class="bridge-monitor-stats">
            <div class="bridge-stats-card">
              <div class="bridge-stats-grid">
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入桥梁数</div>
                  <div class="bridge-stat-value blue">856<span class="bridge-stat-unit"> 座</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">设备总数</div>
                  <div class="bridge-stat-value cyan">1,286<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">结构安全设备数</div>
                  <div class="bridge-stat-value green">472<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">超重设备数</div>
                  <div class="bridge-stat-value orange">128<span class="bridge-stat-unit"> 台</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="map-placeholder">
            <div ref="monitorMapRef" class="amap-container"></div>
          </div>
          <!-- 底部图例控制面板 -->
          <div class="map-legend">
            <div class="legend-checkbox-panel">
              <template v-if="monitorSubLayer === 'type'">
                <label class="checkbox-item" v-for="rt in monitorTypeLegend" :key="rt.key">
                  <span class="custom-checkbox" :class="{ checked: (monitorTypeChecked as any)[rt.key] }" @click="(monitorTypeChecked as any)[rt.key] = !(monitorTypeChecked as any)[rt.key]">
                    <svg v-if="(monitorTypeChecked as any)[rt.key]" viewBox="0 0 12 12" class="check-icon"><path d="M2,6 L5,9 L10,3" stroke="#5b8ff9" stroke-width="2" fill="none"/></svg>
                  </span>
                  <span class="legend-line" :style="{ background: rt.color }"></span>
                  <span class="checkbox-label">{{ rt.name }}</span>
                </label>
              </template>
              <template v-else>
                <label class="checkbox-item" v-for="re in monitorEvalLegend" :key="re.key">
                  <span class="custom-checkbox" :class="{ checked: (monitorEvalChecked as any)[re.key] }" @click="(monitorEvalChecked as any)[re.key] = !(monitorEvalChecked as any)[re.key]">
                    <svg v-if="(monitorEvalChecked as any)[re.key]" viewBox="0 0 12 12" class="check-icon"><path d="M2,6 L5,9 L10,3" stroke="#5b8ff9" stroke-width="2" fill="none"/></svg>
                  </span>
                  <span class="legend-line" :style="{ background: re.color }"></span>
                  <span class="checkbox-label">{{ re.name }}</span>
                </label>
              </template>
            </div>
            <div class="legend-control-panel">
              <div class="sub-layer-btns">
                <span class="radio-item" :class="{ selected: monitorSubLayer === 'type' }" @click="monitorSubLayer = 'type'"><span class="radio-dot"></span>{{ layerNameMap[monitorLayer] }}类型</span>
                <span class="radio-item" :class="{ selected: monitorSubLayer === 'eval' }" @click="monitorSubLayer = 'eval'"><span class="radio-dot"></span>{{ layerNameMap[monitorLayer] }}评价</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：设施超限情况（仅桥梁图层显示） -->
      <div class="panel monitor-right" v-show="monitorLayer === 'bridge'">
        <div class="dark-card overlimit-card">
          <div class="card-title-row">
            <div class="card-title">设施超限情况</div>
          </div>
          <div class="card-sub-title">今日超限现状</div>
          <table class="dark-table">
            <thead>
              <tr>
                <th>区域</th>
                <th>设施名称</th>
                <th style="text-align:center">今日超限量（辆）</th>
                <th>在线情况</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in overlimitStats" :key="s.name">
                <td>{{ s.area }}</td>
                <td>{{ s.name }}</td>
                <td style="text-align:center">{{ s.count }}</td>
                <td><span class="online-tag" :class="s.online === '在线' ? 'online' : 'offline'">{{ s.online }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="dark-card time-chart-card">
          <div class="card-title-row">
            <div class="card-title" style="font-size:15px;font-weight:700">今日超限分时</div>
          </div>
          <div ref="timeFlowChartRef" class="time-flow-chart"></div>
        </div>
        <div class="dark-card max-overlimit-card">
          <div class="card-title-row">
            <div class="card-title">今日最高超重</div>
          </div>
          <table class="dark-table">
            <thead>
              <tr>
                <th>设施名称</th>
                <th>车牌号</th>
                <th>过车总重(吨)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in todayMaxOverlimit" :key="m.plate">
                <td>{{ m.name }}</td>
                <td>{{ m.plate }}</td>
                <td class="weight-cell">{{ m.weight }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 设备详情弹窗 -->
    <a-modal v-model:open="showDeviceDetailModal" title="设备列表" width="1200px" :footer="null" class="device-detail-modal">
      <div class="modal-filter-bar device-filter-bar">
        <div class="filter-item">
          <span class="filter-label">市区县</span>
          <select class="filter-select"><option>请选择</option></select>
        </div>
        <div class="filter-item">
          <span class="filter-label">设施名称</span>
          <input class="filter-input" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <span class="filter-label">设备名称</span>
          <input class="filter-input" placeholder="请输入" />
        </div>
      </div>
      <a-table :columns="deviceDetailColumns" :data-source="deviceDetailData" :pagination="{ pageSize: 20 }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 桥梁设备详情弹窗 -->
    <a-modal v-model:open="showBridgeDeviceDetail" title="桥梁设备详情" width="1200px" :footer="null" class="bridge-device-detail-modal">
      <div v-if="bridgeDeviceDrillDown" class="drill-down-header" style="margin-bottom: 12px;">
        <a-button size="small" @click="bridgeDeviceDrillDown = false">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
        <span class="drill-down-title">桥梁结构监测设备详情</span>
      </div>
      <a-table v-if="!bridgeDeviceDrillDown" :columns="bridgeDeviceDetailColumns" :data-source="bridgeDeviceDetailData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
      <a-table v-else :columns="bridgeDrillColumns" :data-source="bridgeDrillData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ y: 460 }" bordered />
    </a-modal>

    <!-- 道路设备详情弹窗 -->
    <a-modal v-model:open="showRoadDeviceDetail" title="道路设备详情" width="1000px" :footer="null" class="road-device-detail-modal">
      <a-table :columns="roadDeviceDetailColumns" :data-source="roadDeviceDetailData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 隧道设备详情弹窗 -->
    <a-modal v-model:open="showTunnelDeviceDetail" title="隧道设备详情" width="1100px" :footer="null" class="tunnel-device-detail-modal">
      <a-table :columns="tunnelDeviceDetailColumns" :data-source="tunnelDeviceDetailData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 报警详情弹窗 -->
    <a-modal v-model:open="showAlarmDetailModal" :title="`${layerNameMap[monitorLayer]}报警详情`" width="1000px" :footer="null" class="alarm-detail-modal">
      <a-table :columns="alarmSummaryColumns" :data-source="alarmSummaryData" :pagination="{ pageSize: 15, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, h, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'
import * as echarts from 'echarts'

const router = useRouter()

// 返回驾驶舱 - 跳转到安全隐患排查整治页面
function goBack() {
  router.push({ path: '/cockpit', query: { tab: 'monitor' } })
}

// 设备列表数据
const monitorDevices = ref([
  { key: 1, district: '杭州市', name: '钱塘江大桥', structureSafeCount: 48, overweightCount: 12 },
  { key: 2, district: '杭州市', name: '复兴大桥', structureSafeCount: 36, overweightCount: 8 },
  { key: 3, district: '宁波市', name: '灵桥', structureSafeCount: 24, overweightCount: 5 },
  { key: 4, district: '温州市', name: '瓯江大桥', structureSafeCount: 52, overweightCount: 15 },
  { key: 5, district: '绍兴市', name: '鉴湖大桥', structureSafeCount: 30, overweightCount: 6 },
])

const deviceSuffix = ref('监测设备')
const monitorItemLabel = ref('结构安全监测')

// 模态框控制
const showDeviceDetailModal = ref(false)
const showAlarmDetailModal = ref(false)
const showRoadDeviceDetail = ref(false)
const showBridgeDeviceDetail = ref(false)
const showTunnelDeviceDetail = ref(false)
const bridgeDeviceDrillDown = ref(false)

// 地图相关
let monitorMap: any = null
let monitorMapOverlays: any[] = []
let monitorMapInfoWindow: any = null
const monitorLayer = ref<'bridge' | 'road' | 'tunnel'>('bridge')
const mapStyle = ref<'standard' | 'satellite'>('standard')
const monitorCity = ref('浙江省')
const showMonitorCityDropdown = ref(false)
const monitorMapRef = ref<HTMLDivElement>()
const monitorSubLayer = ref<'type' | 'eval'>('type')

const cityList = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const cityCoords: Record<string, [number, number]> = {
  '浙江省': [120.15, 30.27], '杭州市': [120.15, 30.27], '宁波市': [121.55, 29.87],
  '温州市': [120.70, 28.00], '绍兴市': [120.58, 30.00], '湖州市': [120.08, 30.87],
  '嘉兴市': [120.76, 30.75], '金华市': [119.65, 29.08], '衢州市': [118.87, 28.94],
  '台州市': [121.42, 28.66], '丽水市': [119.92, 28.47], '舟山市': [122.11, 30.02],
}

// 图层名称映射
const layerNameMap: Record<string, string> = {
  bridge: '桥梁',
  road: '道路',
  tunnel: '隧道',
}

// 桥梁/道路/隧道类型图例
const monitorTypeLegend = [
  { key: 'special', name: '特大桥', color: '#e86452' },
  { key: 'large', name: '大桥', color: '#f6a816' },
  { key: 'interchange', name: '立交桥', color: '#5ad8a6' },
  { key: 'elevated', name: '高架桥', color: '#5b8ff9' },
  { key: 'medium', name: '中桥', color: '#c477eb' },
  { key: 'small', name: '小桥', color: '#ff8c42' },
  { key: 'other', name: '其他', color: '#96a6ca' },
]

// 桥梁/道路/隧道评价图例
const monitorEvalLegend = [
  { key: 'A', name: 'A类', color: '#5ad8a6' },
  { key: 'B', name: 'B类', color: '#5b8ff9' },
  { key: 'C', name: 'C类', color: '#f6a816' },
  { key: 'D', name: 'D类', color: '#e86452' },
  { key: 'E', name: 'E类', color: '#96a6ca' },
]

// 复选框状态
const monitorTypeChecked = ref({ special: true, large: true, interchange: true, elevated: true, medium: true, small: true, other: true })
const monitorEvalChecked = ref({ A: true, B: true, C: true, D: true, E: true })

function toggleMapType() {
  mapStyle.value = mapStyle.value === 'standard' ? 'satellite' : 'standard'
}

// 图表引用
const alarmTrendChartRef = ref<HTMLDivElement>()
const timeFlowChartRef = ref<HTMLDivElement>()
let alarmTrendChart: echarts.ECharts | null = null
let timeFlowChart: echarts.ECharts | null = null

// 超限统计数据
const overlimitStats = ref([
  { area: '杭州市', name: '钱塘江大桥', count: 12, online: '在线' },
  { area: '杭州市', name: '复兴大桥', count: 8, online: '在线' },
  { area: '宁波市', name: '灵桥', count: 5, online: '在线' },
  { area: '温州市', name: '瓯江大桥', count: 3, online: '离线' },
])

// 今日最高超重
const todayMaxOverlimit = ref([
  { name: '钱塘江大桥', plate: '浙A·12345', weight: 55.8 },
  { name: '复兴大桥', plate: '浙A·67890', weight: 48.2 },
  { name: '灵桥', plate: '浙B·11111', weight: 42.5 },
])

// 初始化高德地图
onMounted(() => {
  // 点位监测弹窗跳转
  ;(window as any).__goBridgePointMonitor = (name?: string) => router.push({ path: '/bridge-point-monitor', query: { name: name || '' } })
  loadAMap().then(() => {
    initMonitorMap()
    nextTick(() => { initMonitorCharts() })
  })
})

onUnmounted(() => {
  if (monitorMap) monitorMap.destroy()
  if (alarmTrendChart) alarmTrendChart.dispose()
  if (timeFlowChart) timeFlowChart.dispose()
  delete (window as any).__goBridgePointMonitor
})

function loadAMap(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).AMap) { resolve(); return }
    const script = document.createElement('script')
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${import.meta.env.VITE_AMAP_KEY}`
    script.onload = () => resolve()
    script.onerror = () => console.error('高德地图脚本加载失败')
    document.head.appendChild(script)
  })
}

function initMonitorMap() {
  const AMap = (window as any).AMap
  if (!monitorMapRef.value || !AMap) return
  if (monitorMap) monitorMap.destroy()
  const layers: any[] = []
  if (mapStyle.value === 'satellite') {
    layers.push(new AMap.TileLayer.Satellite())
    layers.push(new AMap.TileLayer.RoadNet())
  }
  monitorMap = new AMap.Map(monitorMapRef.value, {
    zoom: 10, center: [120.15, 30.27], layers,
    viewMode: '2D', dragEnable: true, zoomEnable: true,
    mapStyle: 'amap://styles/dark',
  })
  initMonitorMapOverlays()
}

function initMonitorMapOverlays() {
  const AMap = (window as any).AMap
  if (!monitorMap || !AMap) return
  monitorMapOverlays.forEach(o => monitorMap.remove(o))
  monitorMapOverlays = []
  if (monitorMapInfoWindow) { monitorMapInfoWindow.close(); monitorMapInfoWindow = null }
  const facilities = monitorLayer.value === 'road' ? roadFacilities
    : monitorLayer.value === 'bridge' ? bridgeFacilities : tunnelFacilities
  monitorMapInfoWindow = new AMap.InfoWindow({ isCustom: true, autoMove: true, offset: new AMap.Pixel(0, -10) })
  facilities.forEach((fac: any, idx: number) => {
    const polyline = new AMap.Polyline({
      path: fac.path.map((p: [number, number]) => new AMap.LngLat(p[0], p[1])),
      strokeColor: fac.color, strokeWeight: 4, strokeOpacity: 0.9,
      lineJoin: 'round', lineCap: 'round', cursor: 'pointer', extData: { fac, idx },
    })
    polyline.on('mouseover', () => polyline.setOptions({ strokeWeight: 7, strokeOpacity: 1 }))
    polyline.on('mouseout', () => polyline.setOptions({ strokeWeight: 4, strokeOpacity: 0.9 }))
    polyline.on('click', () => {
      const mid = fac.path[Math.floor(fac.path.length / 2)]
      const gradeColor = (g: string) => ({ A: '#5b8ff9', B: '#5ad8a6', C: '#f6bd16', D: '#e86452', E: '#e86452' }[g] || '#fff')
      let html = `<div class="map-info-popup"><div class="popup-row"><span class="popup-label">归属地区</span><span class="popup-value">${fac.info['归属地区']}</span></div>`
      for (const [k, v] of Object.entries(fac.info)) {
        if (k === '归属地区') continue
        if (k.includes('等级')) {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value grade" style="color:${gradeColor(v as string)}">${v}</span></div>`
        } else {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value">${v}</span></div>`
        }
      }
      if (monitorLayer.value === 'bridge') {
        const bridgeName = (fac.info as any)['桥梁名称'] || ''
        html += `<div class="popup-row" style="justify-content:flex-end;margin-top:6px;"><span class="popup-monitor-btn" onclick="window.__goBridgePointMonitor && window.__goBridgePointMonitor('${bridgeName}')">查看点位监测 &gt;</span></div>`
      } else {
        html += `<div class="popup-row" style="justify-content:flex-end;margin-top:6px;"><span class="popup-monitor-btn" style="opacity:0.5;cursor:default;">查看点位监测 &gt;</span></div>`
      }
      html += '</div>'
      monitorMapInfoWindow.setContent(html)
      monitorMapInfoWindow.open(monitorMap, new AMap.LngLat(mid[0], mid[1]))
    })
    monitorMap.add(polyline)
    monitorMapOverlays.push(polyline)
  })
}

watch(monitorLayer, () => {
  initMonitorMapOverlays()
  nextTick(() => { initMonitorCharts() })
})

watch(mapStyle, () => {
  initMonitorMap()
})

watch(monitorCity, (city) => {
  const coords = cityCoords[city]
  if (coords && monitorMap) {
    monitorMap.setCenter(coords)
  }
})

// 设施点位数据
interface FacilityPoint {
  name: string; region?: string; level?: string; type?: string; navigable?: string;
  roadClass?: string; underground?: string; grade?: string; checkTime?: string;
  dataComplete?: string; publishStatus?: string; overdue?: string;
  path: [number, number][]; color: string; info: Record<string, string>
}
const roadFacilities: FacilityPoint[] = [
  { name: '鲲鹏路', region: '杭州市上城区', level: '主干路', grade: 'A', path: [[120.160, 30.250], [120.165, 30.252], [120.170, 30.248], [120.175, 30.250]], color: '#f6bd16', info: { '归属地区': '杭州市上城区', '道路名称': '鲲鹏路', '道路等级': '主干路', '综合评价等级': 'A', '检测时间': '2025-06-15' } },
  { name: '姚江路', region: '杭州市拱墅区', level: '次干路', grade: 'B', path: [[120.148, 30.310], [120.153, 30.312], [120.158, 30.308], [120.163, 30.310]], color: '#5b8ff9', info: { '归属地区': '杭州市拱墅区', '道路名称': '姚江路', '道路等级': '次干路', '综合评价等级': 'B', '检测时间': '2025-05-20' } },
  { name: '环城西路', region: '杭州市西湖区', level: '城市快速路', grade: 'A', path: [[120.158, 30.270], [120.156, 30.275], [120.159, 30.280], [120.158, 30.285]], color: '#5ad8a6', info: { '归属地区': '杭州市西湖区', '道路名称': '环城西路', '道路等级': '城市快速路', '综合评价等级': 'A', '检测时间': '2025-07-01' } },
  { name: '复兴大道', region: '杭州市滨江区', level: '主干路', grade: 'B', path: [[120.185, 30.218], [120.192, 30.221], [120.200, 30.216], [120.210, 30.218]], color: '#e86452', info: { '归属地区': '杭州市滨江区', '道路名称': '复兴大道', '道路等级': '主干路', '综合评价等级': 'B', '检测时间': '2025-04-10' } },
  { name: '中山西路', region: '宁波市海曙区', level: '主干路', grade: 'A', path: [[121.540, 29.865], [121.545, 29.867], [121.550, 29.863], [121.555, 29.865]], color: '#945fb9', info: { '归属地区': '宁波市海曙区', '道路名称': '中山西路', '道路等级': '主干路', '综合评价等级': 'A', '检测时间': '2025-06-28' } },
  { name: '人民路', region: '温州市鹿城区', level: '次干路', grade: 'C', path: [[120.690, 28.005], [120.695, 28.007], [120.700, 28.003], [120.705, 28.005]], color: '#6dc8ec', info: { '归属地区': '温州市鹿城区', '道路名称': '人民路', '道路等级': '次干路', '综合评价等级': 'C', '检测时间': '2025-03-15' } },
  { name: '解放路', region: '绍兴市越城区', level: '主干路', grade: 'B', path: [[120.570, 30.005], [120.575, 30.007], [120.580, 30.003], [120.585, 30.005]], color: '#f6bd16', info: { '归属地区': '绍兴市越城区', '道路名称': '解放路', '道路等级': '主干路', '综合评价等级': 'B', '检测时间': '2025-05-08' } },
  { name: '红旗路', region: '湖州市吴兴区', level: '支路', grade: 'A', path: [[120.075, 30.865], [120.080, 30.867], [120.085, 30.863], [120.090, 30.865]], color: '#5b8ff9', info: { '归属地区': '湖州市吴兴区', '道路名称': '红旗路', '道路等级': '支路', '综合评价等级': 'A', '检测时间': '2025-06-20' } },
]
const bridgeFacilities: FacilityPoint[] = [
  { name: '武林桥', region: '杭州市西湖区', type: '拱桥', grade: 'B', path: [[120.160, 30.265], [120.165, 30.267], [120.170, 30.263], [120.175, 30.265]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '桥梁名称': '武林桥', '桥梁类型': '拱桥', '综合评价等级': 'B', '检测时间': '2025-06-15' } },
  { name: '复兴大桥', region: '杭州市滨江区', type: '斜拉桥', grade: 'A', path: [[120.175, 30.215], [120.180, 30.218], [120.185, 30.213], [120.190, 30.215]], color: '#5b8ff9', info: { '归属地区': '杭州市滨江区', '桥梁名称': '复兴大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'A', '检测时间': '2025-05-20' } },
  { name: '备塘河桥', region: '杭州市上城区', type: '梁桥', grade: 'C', path: [[120.110, 30.295], [120.115, 30.297], [120.120, 30.293], [120.125, 30.295]], color: '#5ad8a6', info: { '归属地区': '杭州市上城区', '桥梁名称': '备塘河桥', '桥梁类型': '梁桥', '综合评价等级': 'C', '检测时间': '2025-04-10' } },
  { name: '半山桥', region: '杭州市拱墅区', type: '梁桥', grade: 'A', path: [[120.135, 30.325], [120.140, 30.327], [120.145, 30.323], [120.150, 30.325]], color: '#f6bd16', info: { '归属地区': '杭州市拱墅区', '桥梁名称': '半山桥', '桥梁类型': '梁桥', '综合评价等级': 'A', '检测时间': '2025-07-01' } },
  { name: '明州大桥', region: '宁波市鄞州区', type: '斜拉桥', grade: 'A', path: [[121.560, 29.835], [121.565, 29.837], [121.570, 29.833], [121.575, 29.835]], color: '#945fb9', info: { '归属地区': '宁波市鄞州区', '桥梁名称': '明州大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'A', '检测时间': '2025-06-28' } },
  { name: '温州大桥', region: '温州市瓯海区', type: '悬索桥', grade: 'B', path: [[120.660, 27.985], [120.665, 27.987], [120.670, 27.983], [120.675, 27.985]], color: '#6dc8ec', info: { '归属地区': '温州市瓯海区', '桥梁名称': '温州大桥', '桥梁类型': '悬索桥', '综合评价等级': 'B', '检测时间': '2025-03-15' } },
  { name: '柯桥大桥', region: '绍兴市柯桥区', type: '拱桥', grade: 'B', path: [[120.480, 30.075], [120.485, 30.077], [120.490, 30.073], [120.495, 30.075]], color: '#f6bd16', info: { '归属地区': '绍兴市柯桥区', '桥梁名称': '柯桥大桥', '桥梁类型': '拱桥', '综合评价等级': 'B', '检测时间': '2025-05-08' } },
  { name: '南浔大桥', region: '湖州市南浔区', type: '梁桥', grade: 'C', path: [[120.440, 30.355], [120.445, 30.357], [120.450, 30.353], [120.455, 30.355]], color: '#5b8ff9', info: { '归属地区': '湖州市南浔区', '桥梁名称': '南浔大桥', '桥梁类型': '梁桥', '综合评价等级': 'C', '检测时间': '2025-06-20' } },
]
const tunnelFacilities: FacilityPoint[] = [
  { name: '紫金港北路下穿道', region: '杭州市西湖区', type: '人行地道', grade: 'B', path: [[120.088, 30.310], [120.093, 30.312], [120.098, 30.308], [120.103, 30.310]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '隧道名称': '紫金港北路下穿道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'B', '检测时间': '2025-06-15' } },
  { name: '苏嘉路下穿道', region: '杭州市上城区', type: '城市道路隧道', grade: 'E', path: [[120.168, 30.248], [120.173, 30.250], [120.178, 30.246], [120.183, 30.248]], color: '#5b8ff9', info: { '归属地区': '杭州市上城区', '隧道名称': '苏嘉路下穿道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'E', '检测时间': '2025-05-20' } },
  { name: '复兴路隧道', region: '杭州市滨江区', type: '人行地道', grade: 'A', path: [[120.172, 30.225], [120.177, 30.227], [120.182, 30.223], [120.187, 30.225]], color: '#5ad8a6', info: { '归属地区': '杭州市滨江区', '隧道名称': '复兴路隧道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'A', '检测时间': '2025-04-10' } },
  { name: '环城北路隧道', region: '杭州市下城区', type: '城市道路隧道', grade: 'B', path: [[120.155, 30.278], [120.160, 30.280], [120.165, 30.276], [120.170, 30.278]], color: '#f6bd16', info: { '归属地区': '杭州市下城区', '隧道名称': '环城北路隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '长隧道(1000m<L≤3000m)', '综合评价等级': 'B', '检测时间': '2025-07-01' } },
  { name: '半山隧道', region: '杭州市拱墅区', type: '人行地道', grade: 'C', path: [[120.138, 30.328], [120.143, 30.330], [120.148, 30.326], [120.153, 30.328]], color: '#945fb9', info: { '归属地区': '杭州市拱墅区', '隧道名称': '半山隧道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'C', '检测时间': '2025-06-28' } },
  { name: '天一隧道', region: '宁波市海曙区', type: '城市道路隧道', grade: 'A', path: [[121.548, 29.868], [121.553, 29.870], [121.558, 29.866], [121.563, 29.868]], color: '#6dc8ec', info: { '归属地区': '宁波市海曙区', '隧道名称': '天一隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '中隧道(500m<L≤1000m)', '综合评价等级': 'A', '检测时间': '2025-03-15' } },
]

// 设备详情弹窗数据
const deviceDetailColumns: TableColumnsType = [
  { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
  { title: '市区县', dataIndex: 'area', key: 'area', width: 140 },
  { title: '设施名称', dataIndex: 'facName', key: 'facName', width: 160 },
  { title: '结构安全设备数（台）', dataIndex: 'structureSafeCount', key: 'structureSafeCount', width: 160 },
  { title: '超重设备数（台）', dataIndex: 'overweightCount', key: 'overweightCount', width: 140 },
]
const deviceDetailData = computed(() => {
  if (monitorLayer.value === 'road') {
    return [
      { key: 1, index: 1, area: '杭州市上城区', facName: '石贯子巷', structureSafeCount: 12, overweightCount: 3 },
      { key: 2, index: 2, area: '杭州市滨江区', facName: '复兴大道', structureSafeCount: 8, overweightCount: 2 },
      { key: 3, index: 3, area: '杭州市西湖区', facName: '环城西路', structureSafeCount: 10, overweightCount: 1 },
    ]
  }
  if (monitorLayer.value === 'tunnel') {
    return [
      { key: 1, index: 1, area: '杭州市西湖区', facName: '紫金港北路下穿道', structureSafeCount: 15, overweightCount: 0 },
      { key: 2, index: 2, area: '杭州市上城区', facName: '苏嘉路下穿道', structureSafeCount: 12, overweightCount: 0 },
    ]
  }
  return [
    { key: 1, index: 1, area: '绍兴市越城区', facName: '沪德立交桥', structureSafeCount: 20, overweightCount: 5 },
    { key: 2, index: 2, area: '杭州市滨江区', facName: '复兴大桥', structureSafeCount: 18, overweightCount: 4 },
  ]
})

// 桥梁设备详情数据
const bridgeDeviceDetailColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 90 },
  { title: '设备总数', dataIndex: 'total', key: 'total', width: 80 },
  { title: '在线数', dataIndex: 'online', key: 'online', width: 80 },
  { title: '在线率', dataIndex: 'onlineRate', key: 'onlineRate', width: 80 },
  { title: '接入桥梁数', dataIndex: 'accessBridge', key: 'accessBridge', width: 100 },
  { title: '接入率', dataIndex: 'accessRate', key: 'accessRate', width: 80 },
  { title: '桥梁环境监测设备', dataIndex: 'envDevice', key: 'envDevice', width: 130 },
  { title: '桥梁作用监测设备', dataIndex: 'loadDevice', key: 'loadDevice', width: 130 },
  { title: '桥梁结构监测设备', dataIndex: 'structDevice', key: 'structDevice', width: 130, customRender: ({ text }: any) => h('a', { onClick: () => { bridgeDeviceDrillDown.value = true } }, text) },
]
const bridgeDrillColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 90 },
  { title: '吊杆索力振动设备', dataIndex: 'cable', key: 'cable', width: 130 },
  { title: '位移设备', dataIndex: 'displacement', key: 'displacement', width: 100 },
  { title: '挠度设备', dataIndex: 'deflection', key: 'deflection', width: 100 },
  { title: '应变设备', dataIndex: 'strain', key: 'strain', width: 100 },
  { title: '振动设备', dataIndex: 'vibration', key: 'vibration', width: 100 },
]
const bridgeDrillData = ref([
  { key: 0, city: '杭州市', cable: 86, displacement: 124, deflection: 98, strain: 156, vibration: 132 },
  { key: 1, city: '宁波市', cable: 68, displacement: 96, deflection: 76, strain: 120, vibration: 102 },
  { key: 2, city: '温州市', cable: 62, displacement: 88, deflection: 70, strain: 110, vibration: 94 },
])
const bridgeDeviceDetailData = ref([
  { key: 0, city: '杭州市', total: 1235, online: 1131, onlineRate: '91.6%', accessBridge: 986, accessRate: '79.8%', envDevice: 386, loadDevice: 452, structDevice: 397 },
  { key: 1, city: '宁波市', total: 956, online: 876, onlineRate: '91.6%', accessBridge: 762, accessRate: '79.7%', envDevice: 298, loadDevice: 350, structDevice: 308 },
  { key: 2, city: '温州市', total: 876, online: 802, onlineRate: '91.6%', accessBridge: 698, accessRate: '79.7%', envDevice: 274, loadDevice: 320, structDevice: 282 },
])

// 道路设备详情数据
const roadDeviceDetailColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 90 },
  { title: '设备总数', dataIndex: 'total', key: 'total', width: 80 },
  { title: '在线数', dataIndex: 'online', key: 'online', width: 80 },
  { title: '在线率', dataIndex: 'onlineRate', key: 'onlineRate', width: 80 },
  { title: '接入道路数', dataIndex: 'accessRoad', key: 'accessRoad', width: 100 },
  { title: '接入率', dataIndex: 'accessRate', key: 'accessRate', width: 80 },
  { title: '道路边坡监测设备', dataIndex: 'slopeDevice', key: 'slopeDevice', width: 140 },
]
const roadDeviceDetailData = ref([
  { key: 0, city: '杭州市', total: 486, online: 462, onlineRate: '95.1%', accessRoad: 412, accessRate: '84.8%', slopeDevice: 486 },
  { key: 1, city: '宁波市', total: 378, online: 358, onlineRate: '94.7%', accessRoad: 318, accessRate: '84.1%', slopeDevice: 378 },
  { key: 2, city: '温州市', total: 342, online: 326, onlineRate: '95.3%', accessRoad: 286, accessRate: '83.6%', slopeDevice: 342 },
])

// 隧道设备详情数据
const tunnelDeviceDetailColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 90 },
  { title: '设备总数', dataIndex: 'total', key: 'total', width: 80 },
  { title: '在线数', dataIndex: 'online', key: 'online', width: 80 },
  { title: '在线率', dataIndex: 'onlineRate', key: 'onlineRate', width: 80 },
  { title: '接入隧道数', dataIndex: 'accessTunnel', key: 'accessTunnel', width: 100 },
  { title: '接入率', dataIndex: 'accessRate', key: 'accessRate', width: 80 },
  { title: '隧道环境监测设备', dataIndex: 'envDevice', key: 'envDevice', width: 130 },
  { title: '隧道机电监测设备', dataIndex: 'mechDevice', key: 'mechDevice', width: 130 },
  { title: '隧道结构监测设备', dataIndex: 'structDevice', key: 'structDevice', width: 130 },
]
const tunnelDeviceDetailData = ref([
  { key: 0, city: '杭州市', total: 567, online: 549, onlineRate: '96.8%', accessTunnel: 412, accessRate: '72.7%', envDevice: 198, mechDevice: 215, structDevice: 154 },
  { key: 1, city: '宁波市', total: 438, online: 424, onlineRate: '96.8%', accessTunnel: 318, accessRate: '72.6%', envDevice: 154, mechDevice: 166, structDevice: 118 },
  { key: 2, city: '温州市', total: 398, online: 386, onlineRate: '97.0%', accessTunnel: 288, accessRate: '72.4%', envDevice: 140, mechDevice: 152, structDevice: 106 },
])

// 报警汇总数据
const alarmSummaryColumns: TableColumnsType = [
  { title: '地市', dataIndex: 'city', key: 'city', width: 100 },
  { title: '预警总数', dataIndex: 'total', key: 'total', width: 100 },
  { title: '一级预警', dataIndex: 'level1', key: 'level1', width: 100 },
  { title: '二级预警', dataIndex: 'level2', key: 'level2', width: 100 },
  { title: '三级预警', dataIndex: 'level3', key: 'level3', width: 100 },
  { title: '处置总数', dataIndex: 'handled', key: 'handled', width: 100 },
  { title: '处置率', dataIndex: 'rate', key: 'rate', width: 100 },
]
const alarmSummaryData = computed(() => {
  if (monitorLayer.value === 'road') {
    return [
      { key: 1, city: '宁波市', total: 96, level1: 14, level2: 38, level3: 44, handled: 84, rate: '87.5%' },
      { key: 2, city: '温州市', total: 84, level1: 12, level2: 34, level3: 38, handled: 73, rate: '86.9%' },
      { key: 3, city: '绍兴市', total: 62, level1: 8, level2: 25, level3: 29, handled: 54, rate: '87.1%' },
    ]
  }
  if (monitorLayer.value === 'bridge') {
    return [
      { key: 1, city: '宁波市', total: 108, level1: 16, level2: 42, level3: 50, handled: 94, rate: '87.0%' },
      { key: 2, city: '温州市', total: 92, level1: 14, level2: 38, level3: 40, handled: 80, rate: '87.0%' },
      { key: 3, city: '绍兴市', total: 68, level1: 10, level2: 28, level3: 30, handled: 59, rate: '86.8%' },
    ]
  }
  return [
    { key: 1, city: '宁波市', total: 120, level1: 18, level2: 48, level3: 54, handled: 105, rate: '87.5%' },
    { key: 2, city: '温州市', total: 98, level1: 15, level2: 40, level3: 43, handled: 85, rate: '86.7%' },
    { key: 3, city: '绍兴市', total: 72, level1: 11, level2: 30, level3: 31, handled: 63, rate: '87.5%' },
  ]
})

function initMonitorCharts() {
  // 超限报警趋势折线图
  if (alarmTrendChartRef.value) {
    if (alarmTrendChart) alarmTrendChart.dispose()
    alarmTrendChart = echarts.init(alarmTrendChartRef.value)
    alarmTrendChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(13,31,60,0.95)', borderColor: 'rgba(91,143,249,0.4)', textStyle: { color: '#fff', fontSize: 12 } },
      grid: { top: 10, right: 10, bottom: 24, left: 36 },
      xAxis: { type: 'category', data: ['5月13日', '5月14日', '5月15日'], axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } }, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 } },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } }, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 } },
      series: [
        { name: '一级', type: 'line', smooth: true, data: [3, 1, 2], lineStyle: { color: '#e86452' }, itemStyle: { color: '#e86452' }, symbol: 'circle', symbolSize: 6 },
        { name: '二级', type: 'line', smooth: true, data: [5, 2, 4], lineStyle: { color: '#f6a816' }, itemStyle: { color: '#f6a816' }, symbol: 'circle', symbolSize: 6 },
        { name: '三级', type: 'line', smooth: true, data: [2, 0, 1], lineStyle: { color: '#5ad8a6' }, itemStyle: { color: '#5ad8a6' }, symbol: 'circle', symbolSize: 6 },
      ],
    })
  }
  // 今日超限分时曲线
  if (timeFlowChartRef.value) {
    if (timeFlowChart) timeFlowChart.dispose()
    timeFlowChart = echarts.init(timeFlowChartRef.value)
    const hours = Array.from({ length: 25 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
    const flowData = [13, 0, 0, 0, 0, 0, 0, 0, 2, 5, 8, 10, 6, 4, 3, 15, 20, 12, 8, 5, 3, 2, 1, 0, 0]
    timeFlowChart.setOption({
      tooltip: { trigger: 'axis', backgroundColor: 'rgba(13,31,60,0.95)', borderColor: 'rgba(91,143,249,0.4)', textStyle: { color: '#fff', fontSize: 12 } },
      grid: { top: 16, right: 12, bottom: 24, left: 36 },
      xAxis: { type: 'category', data: hours, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } }, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, interval: 5 } },
      yAxis: { type: 'value', name: '件', nameTextStyle: { color: 'rgba(255,255,255,0.4)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } }, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 } },
      series: [{
        name: '超限总数',
        type: 'line', smooth: true, data: flowData,
        lineStyle: { color: '#5ad8a6', width: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(90,216,166,0.3)' }, { offset: 1, color: 'rgba(90,216,166,0)' }] } },
        itemStyle: { color: '#5ad8a6' }, symbol: 'circle', symbolSize: 4,
      }],
    })
  }
}
</script>

<style scoped lang="scss">
.monitor-detail-page {
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #0a1e3d 0%, #0d2b5e 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  height: 60px;
  background: rgba(13, 31, 60, 0.95);
  border-bottom: 1px solid rgba(100, 160, 255, 0.12);
  display: flex;
  align-items: center;
  padding: 0 20px;
  flex-shrink: 0;
  
  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .page-title {
      font-size: 18px;
      font-weight: bold;
      color: #fff;
      margin: 0;
    }
  }
}

.page-content {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 12px;
  min-height: 0;
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow: hidden;
  
  &.monitor-left {
    width: 440px;
    flex-shrink: 0;
  }
  
  &.monitor-center {
    flex: 1;
    min-width: 0;
  }
  
  &.monitor-right {
    width: 460px;
    flex-shrink: 0;
  }
}

.dark-card {
  background: linear-gradient(180deg, rgba(13, 31, 60, 0.95), rgba(10, 22, 40, 0.98));
  border: 1px solid rgba(100, 160, 255, 0.12);
  border-radius: 8px;
  padding: 10px;
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  .card-title {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }
}

.monitor-device-card { flex: 0 1 auto; display: flex; flex-direction: column; overflow: hidden; }
.alarm-stats-card { flex: 1; min-height: 0; overflow: hidden; }
.monitor-map-card { flex: 1; min-height: 200px; display: flex; flex-direction: column; position: relative; }
.overlimit-card { flex-shrink: 0; }
.time-chart-card { flex-shrink: 0; }
.max-overlimit-card { flex-shrink: 0; }

.device-list {
  flex: 1; overflow-y: auto; margin-top: 8px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.4); border-radius: 3px; }
}

.dark-table {
  width: 100%; border-collapse: collapse; font-size: 12px;
  th {
    padding: 8px 6px; text-align: left; color: rgba(255,255,255,0.6);
    background: rgba(91,143,249,0.08); border-bottom: 1px solid rgba(100,160,255,0.15);
    font-weight: 500; white-space: nowrap;
  }
  td {
    padding: 7px 6px; color: rgba(255,255,255,0.75);
    border-bottom: 1px solid rgba(100,160,255,0.08);
  }
  tr:hover td { background: rgba(91,143,249,0.06); }
  .weight-cell { color: #f6a816; font-weight: 600; }
}

.device-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0 2px; border-top: 1px solid rgba(100,160,255,0.1); margin-top: 8px;
  font-size: 12px; color: rgba(255,255,255,0.5);
  b { color: #5b8ff9; }
  .link-btn { font-size: 12px; color: #5b8ff9; cursor: pointer; text-decoration: none; &:hover { text-decoration: underline; } }
}

.alarm-cards {
  display: flex; gap: 12px; margin: 8px 0;
}
.alarm-card {
  flex: 1; padding: 10px; border-radius: 6px;
  background: rgba(91,143,249,0.06); border: 1px solid rgba(100,160,255,0.1);
  text-align: center;
}
.alarm-label { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
.alarm-value {
  font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums;
  &.blue { color: #5b8ff9; }
  &.cyan { color: #6dc8ec; }
  &.green { color: #5ad8a6; }
}

.alarm-chart-legend {
  display: flex; gap: 16px; font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 6px;
  .legend-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; vertical-align: middle;
    &.red { background: #e86452; }
    &.blue { background: #5b8ff9; }
    &.orange { background: #f6a816; }
    &.green { background: #5ad8a6; }
  }
}
.alarm-trend-chart { height: 140px; }
.alarm-footer {
  display: flex; justify-content: flex-end; margin-top: 6px;
  .link-btn { font-size: 12px; color: #5b8ff9; cursor: pointer; &:hover { text-decoration: underline; } }
}

.monitor-map-toolbar {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  
  .map-layer-tabs-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .map-layer-tabs {
    display: flex;
    gap: 4px;
    
    .layer-tab {
      padding: 6px 16px;
      border-radius: 4px;
      background: rgba(0, 20, 40, 0.4);
      border: 1px solid rgba(100, 160, 255, 0.15);
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-size: 13px;
      transition: all 0.3s ease;
      
      &.active {
        background: rgba(0, 180, 255, 0.2);
        border-color: #00b4ff;
        color: #fff;
      }
      
      &:hover:not(.active) {
        border-color: rgba(0, 180, 255, 0.5);
      }
    }
  }
  
  .map-controls-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }
  
  .map-type-toggle {
    display: flex;
    gap: 4px;
    
    span {
      padding: 4px 12px;
      border-radius: 4px;
      background: rgba(0, 20, 40, 0.4);
      border: 1px solid rgba(100, 160, 255, 0.15);
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s ease;
      
      &.active {
        background: rgba(0, 180, 255, 0.2);
        border-color: #00b4ff;
        color: #fff;
      }
      
      &:hover:not(.active) {
        border-color: rgba(0, 180, 255, 0.5);
      }
    }
  }
  
  .map-selector {
    position: relative;
    min-width: 120px;
    
    .selector-text {
      display: block;
      padding: 4px 24px 4px 12px;
      background: rgba(0, 20, 40, 0.4);
      border: 1px solid rgba(100, 160, 255, 0.15);
      border-radius: 4px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 12px;
      cursor: pointer;
    }
    
    .selector-arrow {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.7);
      font-size: 10px;
      transition: transform 0.3s ease;
      
      &.open {
        transform: translateY(-50%) rotate(180deg);
      }
    }
    
    .city-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: rgba(13, 31, 60, 0.98);
      border: 1px solid rgba(100, 160, 255, 0.2);
      border-radius: 4px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 100;
      
      .dropdown-item {
        padding: 6px 12px;
        color: rgba(255, 255, 255, 0.85);
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s ease;
        
        &:hover {
          background: rgba(0, 180, 255, 0.1);
        }
        
        &.active {
          background: rgba(0, 180, 255, 0.2);
          color: #fff;
        }
      }
    }
  }
}

.bridge-monitor-stats {
  margin-bottom: 8px;
  .bridge-stats-card {
    background: rgba(12, 30, 65, 0.85); border: 1px solid rgba(42, 100, 255, 0.25);
    border-radius: 6px; padding: 12px 16px; display: flex; flex-direction: column;
  }
  .bridge-stats-grid {
    display: flex; flex-wrap: wrap; gap: 8px 16px; flex: 1;
  }
  .bridge-stat-item {
    min-width: 80px;
    .bridge-stat-label { font-size: 12px; color: rgba(255,255,255,0.65); margin-bottom: 4px; }
    .bridge-stat-value { font-size: 20px; font-weight: 600; line-height: 1.2;
      &.blue { color: #5b8ff9; }
      &.cyan { color: #5ad8a6; }
      &.green { color: #5ad8a6; }
      &.orange { color: #f6a816; }
    }
    .bridge-stat-unit { font-size: 12px; font-weight: 400; opacity: 0.7; }
  }
  .bridge-stats-footer {
    text-align: right; margin-top: 8px;
    .bridge-detail-btn {
      font-size: 12px; color: #5b8ff9; cursor: pointer;
      &:hover { color: #7ba7ff; text-decoration: underline; }
    }
  }
}

.map-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.map-placeholder .amap-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.time-flow-chart { height: 130px; }

.online-tag {
  display: inline-block; padding: 1px 8px; border-radius: 3px; font-size: 11px;
  &.online { background: rgba(90,216,166,0.15); color: #5ad8a6; }
  &.offline { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); }
}
.card-sub-title { font-size: 12px; color: rgba(255,255,255,0.5); margin: 6px 0 4px; }

/* 地图图例控制面板 */
.map-legend {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 8px 10px; margin-top: 4px;
  background: rgba(10,22,40,0.9); border: 1px solid rgba(100,160,255,0.1); border-radius: 6px;
}
.legend-checkbox-panel {
  display: flex; flex-direction: column; gap: 4px;
}
.checkbox-item {
  display: flex; align-items: center; gap: 8px; cursor: pointer; user-select: none;
}
.custom-checkbox {
  width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0;
  border: 1.5px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  &.checked { border-color: #5b8ff9; background: rgba(91,143,249,0.15); }
}
.check-icon { width: 10px; height: 10px; }
.legend-line {
  width: 20px; height: 3px; border-radius: 2px; flex-shrink: 0;
}
.checkbox-label {
  font-size: 12px; color: rgba(255,255,255,0.7);
}
.legend-control-panel {
  display: flex; flex-direction: row; align-items: flex-start; gap: 10px;
}
.sub-layer-btns {
  display: flex; flex-direction: column; gap: 6px;
  .radio-item {
    display: flex; align-items: center; gap: 4px; font-size: 11px;
    color: rgba(255,255,255,0.5); cursor: pointer; transition: color 0.2s;
    &:hover { color: rgba(255,255,255,0.8); }
    &.selected { color: #5b8ff9; }
  }
  .radio-dot {
    width: 10px; height: 10px; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.3); position: relative;
    &::after { content: ''; position: absolute; inset: 1.5px; border-radius: 50%; background: transparent; transition: background 0.2s; }
  }
  .radio-item.selected .radio-dot {
    border-color: #5b8ff9;
    &::after { background: #5b8ff9; }
  }
}
.link-btn { font-size: 12px; color: #5b8ff9; cursor: pointer; text-decoration: none; &:hover { text-decoration: underline; } }

.map-info-popup {
  background: rgba(13, 31, 60, 0.96); border: 1px solid rgba(91, 143, 249, 0.4);
  border-radius: 6px; padding: 10px 14px; min-width: 200px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  .popup-row {
    display: flex; align-items: baseline; gap: 6px; padding: 3px 0;
    font-size: 12px;
  }
  .popup-label { color: rgba(255, 255, 255, 0.55); white-space: nowrap; &::after { content: '：'; } }
  .popup-value { color: #fff; font-weight: 500;
    &.grade { font-weight: 700; }
  }
  .popup-monitor-btn {
    font-size: 12px; color: #5b8ff9; cursor: pointer;
    padding: 3px 10px; border: 1px solid rgba(91,143,249,0.3); border-radius: 3px;
    &:hover { background: rgba(91,143,249,0.15); color: #7da8fb; }
  }
}

.device-detail-modal, .alarm-detail-modal, .road-device-detail-modal, .bridge-device-detail-modal, .tunnel-device-detail-modal {
  :deep(.ant-modal-content) {
    background: linear-gradient(180deg, #0d1f3c, #0a1628);
    border: 1px solid rgba(100,160,255,0.15); border-radius: 10px;
  }
  :deep(.ant-modal-header) {
    background: transparent; border-bottom: 1px solid rgba(100,160,255,0.1);
    .ant-modal-title { color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 600; }
  }
  :deep(.ant-modal-close) { color: rgba(255,255,255,0.4); &:hover { color: rgba(255,255,255,0.8); } }
  :deep(.ant-modal-body) { padding: 16px 20px; }
  :deep(.ant-table) {
    background: transparent; color: rgba(255,255,255,0.75);
    .ant-table-thead > tr > th {
      background: rgba(91,143,249,0.08); color: rgba(255,255,255,0.6);
      border-bottom: 1px solid rgba(100,160,255,0.15);
    }
    .ant-table-tbody > tr > td {
      background: transparent; color: rgba(255,255,255,0.75);
      border-bottom: 1px solid rgba(100,160,255,0.08);
    }
    .ant-table-tbody > tr:hover > td {
      background: rgba(91,143,249,0.06) !important;
    }
    .ant-table-placeholder { background: transparent; }
    .ant-empty-description { color: rgba(255,255,255,0.35); }
  }
}
</style>
