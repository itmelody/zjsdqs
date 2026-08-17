<template>
  <div class="point-monitor-page">
    <!-- 顶部标题 -->
    <div class="pm-header">
      <span class="pm-back" @click="goBack">&lt; 返回</span>
      <span class="pm-title">点位监测 — {{ bridgeName }}</span>
    </div>

    <div class="pm-body">
      <!-- 左侧面板 -->
      <div class="pm-panel pm-left">
        <!-- 设备运行状态 -->
        <div class="pm-card device-status-card">
          <div class="pm-card-title">设备运行状态</div>
          <div class="device-stats-row">
            <div class="ds-item"><span class="ds-val blue">28</span><span class="ds-lbl">设备总数</span></div>
            <div class="ds-item"><span class="ds-val green">472</span><span class="ds-lbl">结构安全设备数</span></div>
            <div class="ds-item"><span class="ds-val orange">128</span><span class="ds-lbl">超重设备数</span></div>
          </div>
          <div ref="deviceBarRef" class="device-bar-chart"></div>
          <div class="card-footer-btn"><a class="link-btn" @click="showDeviceModal = true">设备在线详情 &gt;</a></div>
        </div>

        <!-- 点位监测数据 -->
        <div class="pm-card point-data-card">
          <div class="pm-card-title-row">
            <span class="pm-card-title">点位监测数据</span>
            <select v-model="selectedPoint" class="point-select">
              <option v-for="p in pointList" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
          <div class="point-stats-row">
            <div class="ds-item"><span class="ds-val orange">12.6</span><span class="ds-lbl">今日最大值</span></div>
            <div class="ds-item"><span class="ds-val cyan">-3.2</span><span class="ds-lbl">今日最小值</span></div>
            <div class="ds-item"><span class="ds-val blue">4.8</span><span class="ds-lbl">今日平均值</span></div>
          </div>
          <div ref="pointLineRef" class="point-line-chart"></div>
          <div class="card-footer-btn"><a class="link-btn" @click="showMonitorModal = true">详细监测数据 &gt;</a></div>
        </div>

        <!-- 监测报警统计 -->
        <div class="pm-card alarm-stats-card">
          <div class="pm-card-title">监测报警统计</div>
          <div class="device-stats-row">
            <div class="ds-item"><span class="ds-val orange">36</span><span class="ds-lbl">预警总数</span></div>
            <div class="ds-item"><span class="ds-val red">8</span><span class="ds-lbl">一级预警</span></div>
            <div class="ds-item"><span class="ds-val yellow">16</span><span class="ds-lbl">二级预警</span></div>
            <div class="ds-item"><span class="ds-val green">12</span><span class="ds-lbl">三级预警</span></div>
          </div>
          <div ref="alarmLineRef" class="alarm-line-chart"></div>
          <div class="card-footer-btn"><a class="link-btn" @click="showAlarmModal = true">报警详情 &gt;</a></div>
        </div>
      </div>

      <!-- 中央地图 -->
      <div class="pm-panel pm-center">
        <div class="pm-map-card">
          <div ref="mapRef" class="amap-container"></div>
          <div class="map-type-toggle" @click="toggleMapType">
            <span :class="{ active: mapStyle === 'standard' }">标准</span>
            <span :class="{ active: mapStyle === 'satellite' }">卫星</span>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="pm-panel pm-right">
        <!-- 过车分时统计 -->
        <div class="pm-card vehicle-time-card">
          <div class="pm-card-title">过车分时统计</div>
          <div class="device-stats-row">
            <div class="ds-item"><span class="ds-val blue">3422</span><span class="ds-lbl">今日车流量</span></div>
            <div class="ds-item"><span class="ds-val red">128</span><span class="ds-lbl">今日超限</span></div>
          </div>
          <div ref="vehicleTimeRef" class="vehicle-time-chart"></div>
        </div>

        <!-- 超重监测 -->
        <div class="pm-card overlimit-card">
          <div class="pm-card-title">超重监测</div>
          <div class="device-stats-row">
            <div class="ds-item"><span class="ds-val blue">3422</span><span class="ds-lbl">车流总量(辆)</span></div>
            <div class="ds-item"><span class="ds-val red">1</span><span class="ds-lbl">超限量(辆)</span></div>
          </div>
          <div class="ring-row">
            <div class="ring-group">
              <div ref="overlimitRateRingRef" class="overlimit-ring"></div>
              <div class="ring-label">过车超限率占比图</div>
            </div>
            <div class="ring-group">
              <div ref="todayRingRef" class="overlimit-ring"></div>
              <div class="ring-label">今日超限占比</div>
            </div>
          </div>
          <div class="ring-legend-row">
            <div class="rl-items">
              <span class="rl-item"><span class="rl-dot" style="background:#5b8ff9"></span>0-20%</span>
              <span class="rl-item"><span class="rl-dot" style="background:#f6bd16"></span>20-50%</span>
              <span class="rl-item"><span class="rl-dot" style="background:#e86452"></span>50-100%</span>
              <span class="rl-item"><span class="rl-dot" style="background:#945fb9"></span>100%以上</span>
            </div>
          </div>
          <div class="overlimit-table-wrap">
            <table class="dark-table">
              <thead>
                <tr><th>车牌号</th><th>过车时间</th><th>总重(吨)</th><th>超限量(吨)</th><th>超重率(%)</th><th>状态</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in overlimitList" :key="row.id">
                  <td>{{ row.plate }}</td>
                  <td>{{ row.time }}</td>
                  <td>{{ row.weight }}</td>
                  <td>{{ row.overWeight }}</td>
                  <td>{{ row.overRate }}</td>
                  <td><span :class="row.status === '超重' ? 'status-red' : 'status-blue'">{{ row.status }}</span></td>
                </tr>
              </tbody>
            </table>
            <div class="table-footer">
              <span>共{{ overlimitList.length }}条数据</span>
              <a class="link-btn" @click="showMonitorDetailModal = true">查看监测详情 &gt;</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设备在线详情弹窗 -->
    <div class="pm-modal-mask" v-if="showDeviceModal" @click.self="showDeviceModal = false">
      <div class="pm-modal">
        <div class="pm-modal-header">设备在线详情<a class="pm-modal-close" @click="showDeviceModal = false">&times;</a></div>
        <div class="pm-modal-filters">
          <div class="filter-item"><span class="filter-label">设施名称</span><input v-model="deviceFilter.facilityName" placeholder="请输入" class="pm-input" /></div>
          <div class="filter-item"><span class="filter-label">设备名称</span><input v-model="deviceFilter.deviceName" placeholder="请输入" class="pm-input" /></div>
          <div class="filter-item"><span class="filter-label">设备类型</span><select v-model="deviceFilter.deviceType" class="pm-input"><option value="">请选择</option><option>应变计</option><option>加速度计</option><option>位移传感器</option></select></div>
          <button class="filter-btn">查询</button>
        </div>
        <div class="pm-modal-table-wrap">
          <table class="dark-table pm-bordered">
            <thead><tr><th>市区县</th><th>设施ID</th><th>设施名称</th><th>设备ID</th><th>设备名称</th><th>点位名称</th><th>是否在线</th></tr></thead>
            <tbody>
              <tr v-for="row in devicePageData" :key="row.id">
                <td>{{ row.area }}</td><td>{{ row.facId }}</td><td>{{ row.facName }}</td><td>{{ row.devId }}</td><td>{{ row.devName }}</td><td>{{ row.point }}</td>
                <td><span :class="row.online ? 'status-green' : 'status-red'">{{ row.online ? '在线' : '离线' }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pm-pagination">
          <span class="page-info">共{{ deviceDetailList.length }}条</span>
          <span class="page-btn" :class="{ disabled: devicePage <= 1 }" @click="devicePage > 1 && devicePage--">&lt;</span>
          <span class="page-num" v-for="p in deviceTotalPages" :key="p" :class="{ active: devicePage === p }" @click="devicePage = p">{{ p }}</span>
          <span class="page-btn" :class="{ disabled: devicePage >= deviceTotalPages }" @click="devicePage < deviceTotalPages && devicePage++">&gt;</span>
        </div>
      </div>
    </div>

    <!-- 详细监测数据弹窗 -->
    <div class="pm-modal-mask" v-if="showMonitorModal" @click.self="showMonitorModal = false">
      <div class="pm-modal pm-modal-wide">
        <div class="pm-modal-header">详细监测数据<a class="pm-modal-close" @click="showMonitorModal = false">&times;</a></div>
        <div class="pm-modal-tabs">
          <span v-for="t in monitorTypes" :key="t" class="pm-tab" :class="{ active: monitorTypeTab === t }" @click="monitorTypeTab = t">{{ t }}</span>
        </div>
        <div class="monitor-detail-body">
          <div class="monitor-detail-sidebar">
            <div class="sidebar-title">{{ monitorTypeTab }} 点位</div>
            <div v-for="(p, i) in monitorTypePoints" :key="i" class="sidebar-item" :class="{ active: monitorDetailPoint === i }" @click="monitorDetailPoint = i">{{ p }}</div>
          </div>
          <div class="monitor-detail-main">
            <div class="monitor-date-row">
              <span class="date-label">时间范围</span>
              <input type="date" v-model="monitorDateStart" class="pm-input pm-date-input" />
              <span>—</span>
              <input type="date" v-model="monitorDateEnd" class="pm-input pm-date-input" />
            </div>
            <div ref="monitorDetailChartRef" class="monitor-detail-chart"></div>
            <div class="monitor-summary-row">
              <div class="summary-item"><span class="summary-label">今日最大值</span><span class="summary-val orange">{{ monitorSummary.max }}</span></div>
              <div class="summary-item"><span class="summary-label">今日最小值</span><span class="summary-val cyan">{{ monitorSummary.min }}</span></div>
              <div class="summary-item"><span class="summary-label">今日平均值</span><span class="summary-val blue">{{ monitorSummary.avg }}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 报警详情弹窗 -->
    <div class="pm-modal-mask" v-if="showAlarmModal" @click.self="showAlarmModal = false">
      <div class="pm-modal pm-modal-wide">
        <div class="pm-modal-header">报警详情<a class="pm-modal-close" @click="showAlarmModal = false">&times;</a></div>
        <div class="pm-modal-filters">
          <div class="filter-item"><span class="filter-label">监测设备</span><input v-model="alarmFilter.devName" placeholder="请输入" class="pm-input" /></div>
          <div class="filter-item"><span class="filter-label">测点名称</span><select v-model="alarmFilter.monitorPoint" class="pm-input"><option value="">请选择</option><option v-for="p in pointList" :key="p" :value="p">{{ p }}</option></select></div>
          <div class="filter-item"><span class="filter-label">监测项</span><select v-model="alarmFilter.monitorItem" class="pm-input"><option value="">请选择</option><option>索力</option><option>振动</option><option>位移</option><option>挠度</option><option>应变</option><option>加速度</option></select></div>
          <div class="filter-item"><span class="filter-label">预警等级</span><select v-model="alarmFilter.level" class="pm-input"><option value="">请选择</option><option>一级预警</option><option>二级预警</option><option>三级预警</option></select></div>
          <div class="filter-item"><span class="filter-label">处置状态</span><select v-model="alarmFilter.done" class="pm-input"><option value="">请选择</option><option value="done">已完成</option><option value="undone">未完成</option></select></div>
          <button class="filter-btn">查询</button>
        </div>
        <div class="pm-modal-table-wrap">
          <table class="dark-table pm-bordered">
            <thead><tr><th>处置状态</th><th>桥梁名称</th><th>监测设备</th><th>测点编号</th><th>测点名称</th><th>报警开始时间</th><th>报警结束时间</th><th>预警值</th><th>预警等级</th><th>报警状态</th><th>处置完成时间</th><th>处置人</th></tr></thead>
            <tbody>
              <tr v-for="row in alarmPageData" :key="row.id">
                <td><span :class="row.done ? 'status-green' : 'status-red'">{{ row.done ? '已完成' : '未完成' }}</span></td><td>{{ row.facName }}</td><td>{{ row.devName }}</td><td>{{ row.monitorContent }}</td><td>{{ row.monitorPoint }}</td>
                <td>{{ row.startTime }}</td><td>{{ row.endTime }}</td><td>{{ row.warnValue }}</td>
                <td><span :class="'level-' + row.level">{{ row.levelText }}</span></td>
                <td><span :class="row.done ? 'status-green' : 'status-red'">{{ row.done ? '已解除' : '报警中' }}</span></td>
                <td>{{ row.doneTime }}</td><td>{{ row.handler }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pm-pagination">
          <span class="page-info">共{{ alarmDetailList.length }}条</span>
          <span class="page-btn" :class="{ disabled: alarmPage <= 1 }" @click="alarmPage > 1 && alarmPage--">&lt;</span>
          <span class="page-num" v-for="p in alarmTotalPages" :key="p" :class="{ active: alarmPage === p }" @click="alarmPage = p">{{ p }}</span>
          <span class="page-btn" :class="{ disabled: alarmPage >= alarmTotalPages }" @click="alarmPage < alarmTotalPages && alarmPage++">&gt;</span>
        </div>
      </div>
    </div>

    <!-- 监测详情弹窗 -->
    <div class="pm-modal-mask" v-if="showMonitorDetailModal" @click.self="showMonitorDetailModal = false">
      <div class="pm-modal pm-modal-wide">
        <div class="pm-modal-header">监测详情<a class="pm-modal-close" @click="showMonitorDetailModal = false">&times;</a></div>
        <div class="pm-modal-filters">
          <div class="filter-item"><span class="filter-label">状态</span><select v-model="monitorDetailFilter.status" class="pm-input" @change="monitorDetailPage = 1"><option value="">全部状态</option><option>超重</option><option>正常</option></select></div>
          <button class="filter-btn">查询</button>
        </div>
        <div class="pm-modal-table-wrap">
          <table class="dark-table pm-bordered">
            <thead><tr><th>车牌号</th><th>线路站点</th><th>过车时间</th><th>总重(吨)</th><th>超限量(吨)</th><th>超重率(%)</th><th>速度(km/h)</th><th>状态</th><th>操作</th></tr></thead>
            <tbody>
              <tr v-for="row in monitorDetailPageData" :key="row.id">
                <td>{{ row.plate }}</td><td>{{ row.station }}</td><td>{{ row.time }}</td>
                <td>{{ row.weight }}</td><td>{{ row.overWeight }}</td><td>{{ row.overRate }}</td><td>{{ row.speed }}</td>
                <td><span :class="row.status === '超重' ? 'status-red' : 'status-blue'">{{ row.status }}</span></td>
                <td><a class="link-btn" @click="openVehicleDetail(row)">查看详情</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pm-pagination">
          <span class="page-info">共{{ filteredMonitorDetail.length }}条</span>
          <span class="page-btn" :class="{ disabled: monitorDetailPage <= 1 }" @click="monitorDetailPage > 1 && monitorDetailPage--">&lt;</span>
          <span class="page-num" v-for="p in monitorDetailTotalPages" :key="p" :class="{ active: monitorDetailPage === p }" @click="monitorDetailPage = p">{{ p }}</span>
          <span class="page-btn" :class="{ disabled: monitorDetailPage >= monitorDetailTotalPages }" @click="monitorDetailPage < monitorDetailTotalPages && monitorDetailPage++">&gt;</span>
        </div>
      </div>
    </div>

    <!-- 车辆监测详情弹窗 -->
    <div class="pm-modal-mask" v-if="showVehicleDetailModal" @click.self="showVehicleDetailModal = false">
      <div class="pm-modal pm-modal-wide vehicle-detail-modal">
        <div class="pm-modal-header">
          查看详情
          <a class="pm-modal-close" @click="showVehicleDetailModal = false">&times;</a>
        </div>
        <div class="vd-body" v-if="currentVehicle">
          <div class="vd-table-area">
            <table class="vd-info-table">
              <tbody>
                <tr v-for="(row, ri) in vehicleDetailFieldRows" :key="ri">
                  <template v-for="(f, ci) in row" :key="ci">
                    <td class="vd-label">{{ f.label }}</td>
                    <td class="vd-value" :class="f.valueClass">{{ f.value }}</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="vd-photo-section">
          <div class="vd-photo-title">抓拍照片</div>
          <div class="vd-photo-grid">
            <div class="vd-photo-item">
              <div class="vd-photo-placeholder"><span>📷</span></div>
              <div class="vd-photo-label">车牌</div>
            </div>
            <div class="vd-photo-item">
              <div class="vd-photo-placeholder"><span>📷</span></div>
              <div class="vd-photo-label">侧抓拍</div>
            </div>
            <div class="vd-photo-item">
              <div class="vd-photo-placeholder"><span>📷</span></div>
              <div class="vd-photo-label">前抓拍</div>
            </div>
            <div class="vd-photo-item">
              <div class="vd-photo-placeholder"><span>📷</span></div>
              <div class="vd-photo-label">尾抓拍</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()
const bridgeName = (route.query.name as string) || '备塘河桥'
const goBack = () => router.push('/monitor-detail')

const mapStyle = ref<'standard' | 'satellite'>('standard')
const toggleMapType = () => {
  mapStyle.value = mapStyle.value === 'standard' ? 'satellite' : 'standard'
  if (!map) return
  const AMap = (window as any).AMap
  if (mapStyle.value === 'satellite') {
    map.setMapStyle('')
    if (!tileLayer) {
      tileLayer = new AMap.TileLayer.Satellite()
    }
    map.add(tileLayer)
  } else {
    if (tileLayer) { map.remove(tileLayer) }
    map.setMapStyle('amap://styles/dark')
  }
}

// 监测点位列表
const pointList = ['K0+200·北侧应变·第1段', 'K0+400·南侧位移·第2段', 'K0+600·挠度中分点', 'K0+800·加速度测点', 'K1+000·吊杆索力测点']
const selectedPoint = ref(pointList[0])

// 图表引用
const deviceBarRef = ref<HTMLElement | null>(null)
const pointLineRef = ref<HTMLElement | null>(null)
const alarmLineRef = ref<HTMLElement | null>(null)
const vehicleTimeRef = ref<HTMLElement | null>(null)
const overlimitRateRingRef = ref<HTMLElement | null>(null)
const todayRingRef = ref<HTMLElement | null>(null)
const mapRef = ref<HTMLElement | null>(null)

let charts: echarts.ECharts[] = []
let map: any = null
let tileLayer: any = null

const weekDays = ['6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8']
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)

// 超重监测列表
const overlimitList = ref([
  { id: 1, plate: '浙A07781F', time: '2026-06-08 08:32', weight: 46.14, overWeight: 6.14, overRate: '15.35%', status: '超重' },
  { id: 2, plate: '浙A02780F', time: '2026-06-08 10:15', weight: 46.14, overWeight: 6.14, overRate: '15.35%', status: '超重' },
  { id: 3, plate: '浙A00981F', time: '2026-06-08 11:20', weight: 38.2, overWeight: '/', overRate: '/', status: '正常' },
  { id: 4, plate: '浙A00981F', time: '2026-06-08 12:45', weight: 35.6, overWeight: '/', overRate: '/', status: '正常' },
  { id: 5, plate: '浙A12345F', time: '2026-06-08 14:30', weight: 36.8, overWeight: '/', overRate: '/', status: '正常' },
  { id: 6, plate: '浙A67890F', time: '2026-06-08 16:10', weight: 37.1, overWeight: '/', overRate: '/', status: '正常' },
])

// === 弹窗状态 ===
const showDeviceModal = ref(false)
const showMonitorModal = ref(false)
const showAlarmModal = ref(false)
const showMonitorDetailModal = ref(false)

// 分页
const pageSize = 10
const devicePage = ref(1)
const alarmPage = ref(1)
const monitorDetailPage = ref(1)

// 设备在线详情
const deviceFilter = reactive({ facilityName: '', deviceName: '', deviceType: '' })
const deviceDetailList = ref([
  { id: 1, area: '杭州市上城区', facId: 'BR-001', facName: '备塘河桥', devId: 'DV-001', devName: '应变计-S11', point: '第2跨北侧S11拉索', online: true, time: '2026-06-08 15:30', value: '4500.00 kN' },
  { id: 2, area: '杭州市上城区', facId: 'BR-001', facName: '备塘河桥', devId: 'DV-002', devName: '加速度计-A01', point: '第3跨中部', online: true, time: '2026-06-08 15:28', value: '0.12 m/s²' },
  { id: 3, area: '杭州市上城区', facId: 'BR-001', facName: '备塘河桥', devId: 'DV-003', devName: '位移传感器-D01', point: '第1跨南侧', online: false, time: '2026-06-07 23:45', value: '12.5 mm' },
  { id: 4, area: '杭州市西湖区', facId: 'BR-002', facName: '武林桥', devId: 'DV-004', devName: '挠度计-F01', point: '主跨中分点', online: true, time: '2026-06-08 15:25', value: '8.2 mm' },
  { id: 5, area: '杭州市西湖区', facId: 'BR-002', facName: '武林桥', devId: 'DV-005', devName: '应变计-S21', point: '第1跨北侧', online: true, time: '2026-06-08 15:30', value: '3800.00 kN' },
  { id: 6, area: '杭州市拱墅区', facId: 'BR-003', facName: '登云桥', devId: 'DV-006', devName: '应变计-S31', point: '主跨北侧', online: true, time: '2026-06-08 15:20', value: '4100.00 kN' },
  { id: 7, area: '杭州市拱墅区', facId: 'BR-003', facName: '登云桥', devId: 'DV-007', devName: '位移传感器-D02', point: '第2跨南侧', online: true, time: '2026-06-08 15:18', value: '9.8 mm' },
  { id: 8, area: '杭州市滨江区', facId: 'BR-004', facName: '滨江大桥', devId: 'DV-008', devName: '加速度计-A02', point: '第1跨中部', online: false, time: '2026-06-07 20:30', value: '0.08 m/s²' },
  { id: 9, area: '杭州市滨江区', facId: 'BR-004', facName: '滨江大桥', devId: 'DV-009', devName: '挠度计-F02', point: '主跨中分点', online: true, time: '2026-06-08 15:22', value: '7.5 mm' },
  { id: 10, area: '杭州市余杭区', facId: 'BR-005', facName: '未来科技城桥', devId: 'DV-010', devName: '应变计-S41', point: '第3跨北侧', online: true, time: '2026-06-08 15:28', value: '4200.00 kN' },
  { id: 11, area: '杭州市余杭区', facId: 'BR-005', facName: '未来科技城桥', devId: 'DV-011', devName: '位移传感器-D03', point: '第2跨中部', online: true, time: '2026-06-08 15:25', value: '11.2 mm' },
  { id: 12, area: '杭州市萧山区', facId: 'BR-006', facName: '市心桥', devId: 'DV-012', devName: '加速度计-A03', point: '主跨南侧', online: false, time: '2026-06-06 18:00', value: '0.15 m/s²' },
])
const devicePageData = computed(() => {
  const start = (devicePage.value - 1) * pageSize
  return deviceDetailList.value.slice(start, start + pageSize)
})
const deviceTotalPages = computed(() => Math.ceil(deviceDetailList.value.length / pageSize))

// 详细监测数据
const monitorTypes = ['吊杆索力/振动', '位移', '挠度', '应变', '加速度']
const monitorTypeTab = ref('吊杆索力/振动')
const monitorDetailPoint = ref(0)
const monitorDateStart = ref('2026-06-02')
const monitorDateEnd = ref('2026-06-08')
const monitorDetailChartRef = ref<HTMLElement | null>(null)
const monitorTypePoints = computed(() => {
  const base: Record<string, string[]> = {
    '吊杆索力/振动': ['25-索力-第2跨北侧S11拉索', '25-索力-第2跨南侧S12拉索', '25-索力-第3跨北侧S21拉索'],
    '位移': ['25-位移-第1跨南侧D01', '25-位移-第2跨中部D02'],
    '挠度': ['25-挠度-主跨中分点F01', '25-挠度-第2跨中分点F02'],
    '应变': ['25-应变-第1跨北侧ST01', '25-应变-第2跨南侧ST02'],
    '加速度': ['25-加速度-第3跨中部A01', '25-加速度-主跨中部A02'],
  }
  return base[monitorTypeTab.value] || []
})
const monitorSummary = computed(() => {
  const data: Record<string, { max: string; min: string; avg: string }> = {
    '吊杆索力/振动': { max: '4620 kN', min: '3850 kN', avg: '4210 kN' },
    '位移': { max: '12.6 mm', min: '-3.2 mm', avg: '4.8 mm' },
    '挠度': { max: '8.5 mm', min: '-1.2 mm', avg: '3.6 mm' },
    '应变': { max: '156 με', min: '42 με', avg: '98 με' },
    '加速度': { max: '0.35 m/s²', min: '0.02 m/s²', avg: '0.12 m/s²' },
  }
  return data[monitorTypeTab.value] || { max: '/', min: '/', avg: '/' }
})
let detailChart: echarts.ECharts | null = null
function initDetailChart() {
  nextTick(() => {
    if (!monitorDetailChartRef.value) return
    if (detailChart) detailChart.dispose()
    detailChart = echarts.init(monitorDetailChartRef.value)
    const days = ['6/2', '6/3', '6/4', '6/5', '6/6', '6/7', '6/8']
    detailChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['最大值', '最小值', '平均值', '一级阈值', '二级阈值', '三级阈值'], textStyle: { color: 'rgba(255,255,255,0.7)', fontSize: 11 }, top: 0 },
      grid: { top: 36, right: 20, bottom: 30, left: 50 },
      xAxis: { type: 'category', data: days, axisLabel: { color: 'rgba(255,255,255,0.6)' }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } } },
      yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.6)' }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } } },
      series: [
        { name: '最大值', type: 'line', smooth: true, data: [5200, 5100, 5300, 5000, 5150, 5050, 5000], lineStyle: { color: '#e86452' }, itemStyle: { color: '#e86452' } },
        { name: '最小值', type: 'line', smooth: true, data: [3800, 3900, 3700, 4000, 3850, 3950, 4000], lineStyle: { color: '#5ad8a6' }, itemStyle: { color: '#5ad8a6' } },
        { name: '平均值', type: 'line', smooth: true, data: [4500, 4500, 4600, 4400, 4500, 4500, 4500], lineStyle: { color: '#5b8ff9' }, itemStyle: { color: '#5b8ff9' } },
        { name: '一级阈值', type: 'line', data: [8000, 8000, 8000, 8000, 8000, 8000, 8000], lineStyle: { color: '#e86452', type: 'dashed', width: 1 }, itemStyle: { color: '#e86452' }, symbol: 'none' },
        { name: '二级阈值', type: 'line', data: [7000, 7000, 7000, 7000, 7000, 7000, 7000], lineStyle: { color: '#f6bd16', type: 'dashed', width: 1 }, itemStyle: { color: '#f6bd16' }, symbol: 'none' },
        { name: '三级阈值', type: 'line', data: [6000, 6000, 6000, 6000, 6000, 6000, 6000], lineStyle: { color: '#5b8ff9', type: 'dashed', width: 1 }, itemStyle: { color: '#5b8ff9' }, symbol: 'none' },
      ],
    })
  })
}
watch(showMonitorModal, (v) => { if (v) nextTick(() => initDetailChart()) })
watch(monitorTypeTab, () => { monitorDetailPoint.value = 0; nextTick(() => initDetailChart()) })
watch(monitorDetailPoint, () => nextTick(() => initDetailChart()))

// 报警详情
const alarmFilter = reactive({ devName: '', monitorPoint: '', monitorItem: '', level: '', done: '' })
const alarmDetailList = ref([
  { id: 1, area: '杭州市上城区', facName: bridgeName, devName: '应变计-S11', monitorPoint: 'K0+200·北侧应变·第1段', monitorContent: '结构应变监测', monitorItem: '索力', point: '第2跨北侧S11拉索', startTime: '2026-06-07 08:15', endTime: '2026-06-07 09:30', warnValue: '7200 kN', level: 1, levelText: '一级预警', done: true, doneTime: '2026-06-07 10:00', handler: '张伟' },
  { id: 2, area: '杭州市上城区', facName: bridgeName, devName: '加速度计-A01', monitorPoint: 'K0+800·加速度测点', monitorContent: '结构振动监测', monitorItem: '振动', point: '第3跨中部', startTime: '2026-06-06 14:20', endTime: '2026-06-06 15:00', warnValue: '0.35 m/s²', level: 2, levelText: '二级预警', done: true, doneTime: '2026-06-06 16:30', handler: '李明' },
  { id: 3, area: '杭州市西湖区', facName: bridgeName, devName: '位移传感器-D01', monitorPoint: 'K0+400·南侧位移·第2段', monitorContent: '结构位移监测', monitorItem: '位移', point: '第1跨南侧', startTime: '2026-06-08 02:10', endTime: '', warnValue: '18.5 mm', level: 2, levelText: '二级预警', done: false, doneTime: '', handler: '' },
  { id: 4, area: '杭州市西湖区', facName: bridgeName, devName: '挠度计-F01', monitorPoint: 'K0+600·挠度中分点', monitorContent: '结构挠度监测', monitorItem: '挠度', point: '主跨中分点', startTime: '2026-06-05 22:45', endTime: '2026-06-05 23:30', warnValue: '15.2 mm', level: 3, levelText: '三级预警', done: true, doneTime: '2026-06-06 08:00', handler: '王芳' },
  { id: 5, area: '杭州市拱墅区', facName: bridgeName, devName: '应变计-S31', monitorPoint: 'K0+200·北侧应变·第1段', monitorContent: '结构应变监测', monitorItem: '应变', point: '主跨北侧', startTime: '2026-06-04 10:20', endTime: '2026-06-04 11:00', warnValue: '6500 kN', level: 1, levelText: '一级预警', done: true, doneTime: '2026-06-04 12:00', handler: '赵六' },
  { id: 6, area: '杭州市滨江区', facName: bridgeName, devName: '挠度计-F02', monitorPoint: 'K0+600·挠度中分点', monitorContent: '结构挠度监测', monitorItem: '挠度', point: '主跨中分点', startTime: '2026-06-03 16:30', endTime: '', warnValue: '16.8 mm', level: 2, levelText: '二级预警', done: false, doneTime: '', handler: '' },
  { id: 7, area: '杭州市余杭区', facName: bridgeName, devName: '应变计-S41', monitorPoint: 'K0+200·北侧应变·第1段', monitorContent: '结构应变监测', monitorItem: '应变', point: '第3跨北侧', startTime: '2026-06-02 09:15', endTime: '2026-06-02 10:30', warnValue: '6800 kN', level: 3, levelText: '三级预警', done: true, doneTime: '2026-06-02 14:00', handler: '陈七' },
  { id: 8, area: '杭州市萧山区', facName: bridgeName, devName: '加速度计-A03', monitorPoint: 'K0+800·加速度测点', monitorContent: '结构振动监测', monitorItem: '加速度', point: '主跨南侧', startTime: '2026-06-01 22:00', endTime: '2026-06-01 23:15', warnValue: '0.40 m/s²', level: 1, levelText: '一级预警', done: true, doneTime: '2026-06-02 08:00', handler: '周八' },
  { id: 9, area: '杭州市上城区', facName: bridgeName, devName: '挠度计-F03', monitorPoint: 'K0+600·挠度中分点', monitorContent: '结构挠度监测', monitorItem: '挠度', point: '第1跨中分点', startTime: '2026-05-31 14:30', endTime: '2026-05-31 15:45', warnValue: '14.5 mm', level: 2, levelText: '二级预警', done: true, doneTime: '2026-05-31 18:00', handler: '吴九' },
  { id: 10, area: '杭州市西湖区', facName: bridgeName, devName: '应变计-S12', monitorPoint: 'K1+000·吊杆索力测点', monitorContent: '吊杆索力监测', monitorItem: '应变', point: '第2跨南侧S12拉索', startTime: '2026-05-30 08:20', endTime: '2026-05-30 09:00', warnValue: '7500 kN', level: 1, levelText: '一级预警', done: true, doneTime: '2026-05-30 10:30', handler: '郑十' },
  { id: 11, area: '杭州市拱墅区', facName: bridgeName, devName: '位移传感器-D02', monitorPoint: 'K0+400·南侧位移·第2段', monitorContent: '结构位移监测', monitorItem: '位移', point: '第2跨南侧', startTime: '2026-05-29 19:00', endTime: '2026-05-29 20:15', warnValue: '19.2 mm', level: 3, levelText: '三级预警', done: true, doneTime: '2026-05-29 22:00', handler: '张伟' },
])
const alarmPageData = computed(() => {
  const start = (alarmPage.value - 1) * pageSize
  return alarmDetailList.value.slice(start, start + pageSize)
})
const alarmTotalPages = computed(() => Math.ceil(alarmDetailList.value.length / pageSize))

// 监测详情列表
const monitorDetailFilter = reactive({ status: '' })
const monitorDetailList = ref([
  { id: 1, plate: '浙A07781F', station: '备塘河桥北侧', time: '2026-06-08 08:32', weight: 46.14, overWeight: 6.14, overRate: '15.35%', speed: 45, status: '超重' },
  { id: 2, plate: '浙A02780F', station: '备塘河桥南侧', time: '2026-06-08 10:15', weight: 46.14, overWeight: 6.14, overRate: '15.35%', speed: 52, status: '超重' },
  { id: 3, plate: '浙A00981F', station: '备塘河桥北侧', time: '2026-06-08 11:20', weight: 38.2, overWeight: '/', overRate: '/', speed: 38, status: '正常' },
  { id: 4, plate: '浙A00981F', station: '备塘河桥南侧', time: '2026-06-08 12:45', weight: 35.6, overWeight: '/', overRate: '/', speed: 42, status: '正常' },
  { id: 5, plate: '浙A12345F', station: '备塘河桥北侧', time: '2026-06-08 14:30', weight: 36.8, overWeight: '/', overRate: '/', speed: 55, status: '正常' },
  { id: 6, plate: '浙A67890F', station: '备塘河桥南侧', time: '2026-06-08 16:10', weight: 37.1, overWeight: '/', overRate: '/', speed: 48, status: '正常' },
  { id: 7, plate: '浙B11111F', station: '备塘河桥北侧', time: '2026-06-08 07:05', weight: 42.5, overWeight: 2.5, overRate: '6.25%', speed: 60, status: '超重' },
  { id: 8, plate: '浙B22222F', station: '备塘河桥南侧', time: '2026-06-08 09:40', weight: 33.2, overWeight: '/', overRate: '/', speed: 35, status: '正常' },
  { id: 9, plate: '浙B33333F', station: '备塘河桥北侧', time: '2026-06-08 13:15', weight: 34.8, overWeight: '/', overRate: '/', speed: 40, status: '正常' },
  { id: 10, plate: '浙B44444F', station: '备塘河桥南侧', time: '2026-06-08 15:50', weight: 48.2, overWeight: 8.2, overRate: '20.5%', speed: 58, status: '超重' },
  { id: 11, plate: '浙B55555F', station: '备塘河桥北侧', time: '2026-06-08 17:20', weight: 31.5, overWeight: '/', overRate: '/', speed: 45, status: '正常' },
  { id: 12, plate: '浙B66666F', station: '备塘河桥南侧', time: '2026-06-08 18:35', weight: 39.8, overWeight: '/', overRate: '/', speed: 50, status: '正常' },
])
const filteredMonitorDetail = computed(() => {
  if (!monitorDetailFilter.status) return monitorDetailList.value
  return monitorDetailList.value.filter(r => r.status === monitorDetailFilter.status)
})
const monitorDetailPageData = computed(() => {
  const start = (monitorDetailPage.value - 1) * pageSize
  return filteredMonitorDetail.value.slice(start, start + pageSize)
})
const monitorDetailTotalPages = computed(() => Math.ceil(filteredMonitorDetail.value.length / pageSize))

// 车辆详情弹窗
const showVehicleDetailModal = ref(false)
const currentVehicle = ref<any>(null)
const vehicleDetailFields = computed(() => {
  const v = currentVehicle.value
  if (!v) return []
  return [
    { label: '车牌号', value: v.plate },
    { label: '车牌颜色', value: '/' },
    { label: '车辆所有人', value: '/' },
    { label: '联系人', value: '/' },
    { label: '车型', value: '/' },
    { label: '车轴数', value: '/' },
    { label: '线路站点', value: v.station },
    { label: '过车时间', value: v.time },
    { label: '总重（吨）', value: v.weight },
    { label: '超限量（吨）', value: v.overWeight },
    { label: '超限率（%）', value: v.overRate },
    { label: '速度（KM/h）', value: v.speed },
    { label: '长（MM）', value: '/' },
    { label: '宽（MM）', value: '/' },
    { label: '高（MM）', value: '/' },
    { label: '联系地址', value: '/' },
    { label: '状态', value: v.status, valueClass: v.status === '超重' ? 'vd-val-red' : 'vd-val-blue' },
  ]
})
const vehicleDetailFieldRows = computed(() => {
  const fields = vehicleDetailFields.value
  const rows: any[][] = []
  for (let i = 0; i < fields.length; i += 3) {
    rows.push(fields.slice(i, i + 3))
  }
  return rows
})
function openVehicleDetail(row: any) {
  currentVehicle.value = row
  showVehicleDetailModal.value = true
}

function initCharts() {
  // 设备运行状态柱状图
  if (deviceBarRef.value) {
    const c = echarts.init(deviceBarRef.value)
    c.setOption({
      tooltip: { trigger: 'axis' },
      grid: { top: 20, right: 10, bottom: 24, left: 40 },
      xAxis: { type: 'category', data: ['吊杆索力/振动', '位移', '挠度', '应变', '加速度'], axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 9, interval: 0, rotate: 0 }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } } },
      yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } } },
      series: [{ type: 'bar', barWidth: 20, data: [8, 6, 5, 6, 3], itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#5b8ff9' }, { offset: 1, color: 'rgba(91,143,249,0.2)' }]), borderRadius: [4, 4, 0, 0] } }],
    })
    charts.push(c)
  }

  // 点位监测折线图
  if (pointLineRef.value) {
    const c = echarts.init(pointLineRef.value)
    c.setOption({
      tooltip: { trigger: 'axis', formatter: (p: any) => {
          const idx = p[0].dataIndex
          const date = ['2026/6/2','2026/6/3','2026/6/4','2026/6/5','2026/6/6','2026/6/7','2026/6/8'][idx]
          return date + '<br/>' + p.map((s: any) => `${s.seriesName}: ${s.value}`).join('<br/>')
        } },
      grid: { top: 20, right: 10, bottom: 24, left: 40 },
      xAxis: { type: 'category', data: weekDays, axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } } },
      yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } } },
      series: [
        { name: '最大值', type: 'line', smooth: true, data: [10.2, 11.5, 12.6, 9.8, 11.2, 10.8, 12.1], lineStyle: { color: '#e86452' }, itemStyle: { color: '#e86452' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(232,100,82,0.3)' }, { offset: 1, color: 'rgba(232,100,82,0)' }]) } },
        { name: '最小值', type: 'line', smooth: true, data: [-2.1, -3.2, -1.5, -2.8, -0.9, -1.6, -2.4], lineStyle: { color: '#5ad8a6' }, itemStyle: { color: '#5ad8a6' } },
        { name: '平均值', type: 'line', smooth: true, data: [4.2, 3.8, 5.1, 4.8, 5.6, 4.3, 4.9], lineStyle: { color: '#5b8ff9' }, itemStyle: { color: '#5b8ff9' } },
      ],
    })
    charts.push(c)
  }

  // 报警统计折线图
  if (alarmLineRef.value) {
    const c = echarts.init(alarmLineRef.value)
    c.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['一级预警', '二级预警', '三级预警'], textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }, top: 0, right: 0 },
      grid: { top: 28, right: 10, bottom: 24, left: 40 },
      xAxis: { type: 'category', data: weekDays, axisLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } } },
      yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } } },
      series: [
        { name: '一级预警', type: 'line', smooth: true, data: [2, 1, 3, 1, 0, 1, 0], lineStyle: { color: '#e86452' }, itemStyle: { color: '#e86452' } },
        { name: '二级预警', type: 'line', smooth: true, data: [3, 2, 4, 2, 3, 1, 1], lineStyle: { color: '#f6bd16' }, itemStyle: { color: '#f6bd16' } },
        { name: '三级预警', type: 'line', smooth: true, data: [1, 2, 1, 3, 2, 2, 1], lineStyle: { color: '#5ad8a6' }, itemStyle: { color: '#5ad8a6' } },
      ],
    })
    charts.push(c)
  }

  // 过车分时统计折线图
  if (vehicleTimeRef.value) {
    const c = echarts.init(vehicleTimeRef.value)
    c.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['车流量', '超限'], textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }, top: 0, right: 0 },
      grid: { top: 28, right: 10, bottom: 24, left: 40 },
      xAxis: { type: 'category', data: hours, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, interval: 3 }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } } },
      yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)' } } },
      series: [
        { name: '车流量', type: 'line', smooth: true, data: [20,35,15,8,5,12,45,180,320,280,260,240,220,250,280,300,350,380,320,280,200,150,80,40], lineStyle: { color: '#5b8ff9' }, itemStyle: { color: '#5b8ff9' }, areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(91,143,249,0.3)' }, { offset: 1, color: 'rgba(91,143,249,0)' }]) } },
        { name: '超限', type: 'line', smooth: true, data: [0,0,0,0,0,0,2,8,15,12,10,8,6,10,12,14,18,20,15,10,5,3,1,0], lineStyle: { color: '#e86452' }, itemStyle: { color: '#e86452' } },
      ],
    })
    charts.push(c)
  }

  // 过车超限率占比圆环图
  if (overlimitRateRingRef.value) {
    const c = echarts.init(overlimitRateRingRef.value)
    c.setOption({
      series: [{
        type: 'pie', radius: ['55%', '78%'], center: ['50%', '50%'],
        label: { show: true, position: 'center', formatter: '1', fontSize: 18, fontWeight: 700, color: '#fff' },
        data: [
          { name: '0-20%', value: 1, itemStyle: { color: '#5b8ff9' } },
          { name: '20-50%', value: 0, itemStyle: { color: '#f6bd16' } },
          { name: '50-100%', value: 0, itemStyle: { color: '#e86452' } },
          { name: '100%以上', value: 0, itemStyle: { color: '#945fb9' } },
          { name: '正常', value: 7, itemStyle: { color: 'rgba(255,255,255,0.06)' } },
        ],
      }],
    })
    charts.push(c)
  }

  // 今日超限占比圆环图
  if (todayRingRef.value) {
    const c = echarts.init(todayRingRef.value)
    c.setOption({
      series: [{
        type: 'pie', radius: ['55%', '78%'], center: ['50%', '50%'],
        label: { show: true, position: 'center', formatter: '11.9%', fontSize: 16, fontWeight: 700, color: '#f6bd16' },
        data: [
          { name: '超限', value: 11.9, itemStyle: { color: '#e86452' } },
          { name: '未超限', value: 88.1, itemStyle: { color: 'rgba(91,143,249,0.25)' } },
        ],
      }],
    })
    charts.push(c)
  }
}

function initMap() {
  const AMap = (window as any).AMap
  if (!mapRef.value || !AMap) return
  map = new AMap.Map(mapRef.value, {
    zoom: 16, center: [120.18, 30.28],
    mapStyle: 'amap://styles/dark', viewMode: '2D',
  })
  // 桥梁点位标记
  const points = [
    { name: 'K0+200·北侧应变', pos: [120.175, 30.282], status: 'online' },
    { name: 'K0+400·南侧位移', pos: [120.178, 30.280], status: 'online' },
    { name: 'K0+600·挠度中分点', pos: [120.181, 30.278], status: 'offline' },
    { name: 'K0+800·加速度测点', pos: [120.184, 30.276], status: 'online' },
    { name: 'K1+000·吊杆索力', pos: [120.187, 30.274], status: 'online' },
  ]
  // 画桥梁线段
  const path = points.map(p => new AMap.LngLat(p.pos[0], p.pos[1]))
  const polyline = new AMap.Polyline({ path, strokeColor: '#5b8ff9', strokeWeight: 6, strokeOpacity: 0.9 })
  map.add(polyline)
  map.setFitView(null, false, [40, 40, 40, 40])
}

onMounted(() => {
  nextTick(() => { initCharts(); initMap() })
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  charts.forEach(c => c.dispose())
  charts = []
  detailChart?.dispose()
  if (map) { map.destroy(); map = null; tileLayer = null }
  window.removeEventListener('resize', handleResize)
})
const handleResize = () => charts.forEach(c => c.resize())
</script>

<style scoped lang="scss">
.point-monitor-page {
  width: 1920px; height: 1080px; background: #0a1628;
  display: flex; flex-direction: column; overflow: hidden; font-family: 'PingFang SC', sans-serif;
}
.pm-header {
  height: 48px; display: flex; align-items: center; gap: 16px; padding: 0 20px;
  background: rgba(10,22,40,0.95); border-bottom: 1px solid rgba(100,160,255,0.15);
  .pm-back { color: #5b8ff9; font-size: 14px; cursor: pointer; &:hover { text-decoration: underline; } }
  .pm-title { color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 600; }
}
.pm-body { flex: 1; display: grid; grid-template-columns: 460px 1fr 480px; gap: 10px; padding: 10px; min-height: 0; }
.pm-panel { display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden; }
.pm-left, .pm-right { overflow-y: auto; &::-webkit-scrollbar { width: 4px; } &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.3); border-radius: 2px; } }
.pm-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(100,160,255,0.12);
  border-radius: 8px; padding: 10px 12px; flex-shrink: 0;
}
.pm-card-title { color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; margin-bottom: 8px; }
.pm-card-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.pm-map-card { flex: 1; position: relative; border-radius: 8px; overflow: hidden; min-height: 200px; }
.amap-container { width: 100%; height: 100%; }
.map-type-toggle {
  position: absolute; top: 8px; right: 8px; z-index: 10;
  display: flex; background: rgba(10,22,40,0.85); border: 1px solid rgba(100,160,255,0.2); border-radius: 4px; overflow: hidden; cursor: pointer;
  span { padding: 3px 10px; font-size: 11px; color: rgba(255,255,255,0.5); transition: all 0.2s; &:hover { color: rgba(255,255,255,0.8); } &.active { background: rgba(91,143,249,0.25); color: #5b8ff9; } }
}
.device-stats-row { display: flex; gap: 10px; margin-bottom: 8px; }
.ds-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
.ds-val { font-size: 20px; font-weight: 700; &.blue { color: #5b8ff9; } &.green { color: #5ad8a6; } &.cyan { color: #2fc9d4; } &.orange { color: #f6a816; } &.red { color: #e86452; } &.yellow { color: #f6bd16; } }
.ds-lbl { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }
.device-bar-chart { height: 100px; }
.point-select {
  background: rgba(13,31,60,0.9); border: 1px solid rgba(100,160,255,0.3); border-radius: 4px;
  color: rgba(255,255,255,0.8); padding: 3px 8px; font-size: 11px; outline: none; max-width: 200px;
  option { background: #0d1f3c; }
}
.point-stats-row { display: flex; gap: 10px; margin-bottom: 6px; }
.point-line-chart { height: 110px; }
.alarm-line-chart { height: 110px; }
.vehicle-time-chart { height: 130px; }
.ring-row { display: flex; gap: 10px; margin-bottom: 6px; }
.ring-group { display: flex; flex-direction: column; align-items: center; flex: 1; }
.ring-label { font-size: 10px; color: rgba(255,255,255,0.55); margin-top: 4px; }
.overlimit-ring { width: 90px; height: 90px; }
.ring-legend-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 10px; }
.rl-items { display: flex; flex-wrap: wrap; gap: 6px; }
.rl-item { display: flex; align-items: center; gap: 4px; color: rgba(255,255,255,0.6); }
.rl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rl-info { color: rgba(255,255,255,0.5); b { color: rgba(255,255,255,0.8); } }
.card-footer-btn { text-align: right; margin-top: 4px; }
.overlimit-table-wrap { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
.dark-table {
  width: 100%; border-collapse: collapse; font-size: 11px;
  th { background: rgba(91,143,249,0.1); color: rgba(255,255,255,0.7); padding: 6px 8px; text-align: left; font-weight: 500; border-bottom: 1px solid rgba(100,160,255,0.15); }
  td { padding: 5px 8px; color: rgba(255,255,255,0.65); border-bottom: 1px solid rgba(100,160,255,0.06); }
  tr:hover td { background: rgba(91,143,249,0.06); }
}
.status-red { color: #e86452; font-weight: 600; }
.status-blue { color: #5b8ff9; }
.table-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.5); }
.link-btn { color: #5b8ff9; cursor: pointer; &:hover { text-decoration: underline; } }

// 弹窗样式
.pm-modal-mask {
  position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.55);
  display: flex; align-items: center; justify-content: center;
}
.pm-modal {
  background: linear-gradient(180deg, #0d1f3c, #0a1628);
  border: 1px solid rgba(100,160,255,0.2); border-radius: 10px;
  padding: 0; width: 960px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column;
  &.pm-modal-wide { width: 1200px; }
}
.pm-modal-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.9);
  padding: 16px 20px 12px; border-bottom: 1px solid rgba(100,160,255,0.1);
}
.pm-modal-close { color: rgba(255,255,255,0.5); font-size: 20px; cursor: pointer; text-decoration: none; &:hover { color: #fff; } }
.pm-modal-filters {
  display: flex; gap: 12px; align-items: center; padding: 12px 20px;
  .filter-item { display: flex; align-items: center; gap: 6px; }
  .filter-label { font-size: 13px; color: #fff !important; white-space: nowrap; }
}
.pm-input {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(100,160,255,0.2); border-radius: 4px;
  color: rgba(255,255,255,0.75); padding: 4px 10px; font-size: 13px; outline: none; height: 30px;
  &::placeholder { color: rgba(255,255,255,0.35); }
  &:focus { border-color: #5b8ff9; }
  option { background: #0d1f3c; }
}
.pm-date-input { width: 140px; }
.pm-modal-table-wrap {
  flex: 1; overflow: auto; margin: 0 8px;
  scrollbar-width: thin; scrollbar-color: rgba(91,143,249,0.5) rgba(255,255,255,0.04);
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.5); border-radius: 4px; &:hover { background: rgba(91,143,249,0.7); } }
  &::-webkit-scrollbar-corner { background: rgba(255,255,255,0.04); }
}
.dark-table.pm-bordered {
  border-collapse: collapse; width: 100%;
  th {
    background: rgba(91,143,249,0.1); color: rgba(255,255,255,0.8);
    padding: 8px 10px; font-size: 12px; font-weight: 500;
    border: 1px solid rgba(100,160,255,0.15);
    white-space: nowrap;
  }
  td {
    padding: 7px 10px; color: rgba(255,255,255,0.7); font-size: 12px;
    border: 1px solid rgba(100,160,255,0.1);
  }
  tr:hover td { background: rgba(91,143,249,0.08); }
}
.pm-pagination {
  display: flex; align-items: center; gap: 6px; padding: 12px 20px; justify-content: flex-end;
  border-top: 1px solid rgba(100,160,255,0.1);
  .page-info { font-size: 12px; color: rgba(255,255,255,0.5); margin-right: auto; }
  .page-btn, .page-num {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 28px; height: 28px; padding: 0 8px; border-radius: 4px;
    font-size: 12px; color: rgba(255,255,255,0.6); cursor: pointer;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(100,160,255,0.15);
    transition: all 0.2s;
    &:hover { color: #5b8ff9; border-color: rgba(91,143,249,0.4); }
    &.active { background: rgba(91,143,249,0.2); color: #5b8ff9; border-color: #5b8ff9; font-weight: 600; }
    &.disabled { opacity: 0.35; cursor: default; pointer-events: none; }
  }
}
.pm-modal-tabs {
  display: flex; gap: 4px; padding: 0 20px 8px; margin-top: 12px;
  border-bottom: 1px solid rgba(100,160,255,0.15);
}
.pm-tab {
  padding: 6px 18px; border-radius: 4px; font-size: 12px; cursor: pointer;
  color: rgba(255,255,255,0.55); background: transparent; transition: all 0.2s;
  &:hover { color: rgba(255,255,255,0.8); }
  &.active { background: rgba(91,143,249,0.2); color: #5b8ff9; font-weight: 500; }
}
.monitor-detail-body { display: flex; gap: 12px; flex: 1; min-height: 0; padding: 12px 20px; }
.monitor-detail-sidebar {
  width: 220px; flex-shrink: 0; overflow-y: auto; border: 1px solid rgba(100,160,255,0.1); border-radius: 6px;
  background: rgba(255,255,255,0.02);
  .sidebar-title { padding: 8px 10px; font-size: 12px; color: rgba(255,255,255,0.6); border-bottom: 1px solid rgba(100,160,255,0.1); }
  .sidebar-item {
    padding: 6px 10px; font-size: 12px; color: rgba(255,255,255,0.6); cursor: pointer;
    &:hover { background: rgba(91,143,249,0.08); color: rgba(255,255,255,0.85); }
    &.active { background: rgba(91,143,249,0.2); color: #5b8ff9; font-weight: 500; }
  }
}
.monitor-detail-main { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.monitor-date-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding: 0 0 4px; }
.date-label { font-size: 12px; color: rgba(255,255,255,0.6); }
.monitor-detail-chart { flex: 1; min-height: 250px; }
.monitor-summary-row {
  display: flex; gap: 20px; padding: 10px 0 4px; border-top: 1px solid rgba(100,160,255,0.1); margin-top: 6px;
  .summary-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
  .summary-label { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
  .summary-val { font-size: 18px; font-weight: 700; font-variant-numeric: tabular-nums;
    &.orange { color: #f6a816; }
    &.cyan { color: #6dc8ec; }
    &.blue { color: #5b8ff9; }
  }
}
.status-green { color: #5ad8a6; font-weight: 500; }
.level-1 { color: #e86452; font-weight: 600; }
.level-2 { color: #f6bd16; font-weight: 600; }
.level-3 { color: #5ad8a6; font-weight: 600; }

// 车辆监测详情弹窗
.vehicle-detail-modal { width: 900px !important; }
.vd-body { display: flex; gap: 12px; padding: 16px 20px; }
.vd-table-area { flex: 1; min-width: 0; }
.vd-info-table {
  width: 100%; border-collapse: collapse;
  td { padding: 7px 10px; font-size: 13px; border: 1px solid rgba(100,160,255,0.15); }
  .vd-label {
    background: rgba(91,143,249,0.08); color: rgba(255,255,255,0.6);
    width: 110px; font-weight: 500; white-space: nowrap;
  }
  .vd-value { color: rgba(255,255,255,0.85); }
  .vd-val-red { color: #e86452; font-weight: 600; }
  .vd-val-blue { color: #5b8ff9; font-weight: 600; }
}
.vd-photo-section { padding: 0 20px 16px; }
.vd-photo-title {
  font-size: 14px; color: rgba(255,255,255,0.8); font-weight: 500;
  padding: 12px 0 10px; border-top: 1px solid rgba(100,160,255,0.12);
}
.vd-photo-grid { display: flex; gap: 16px; }
.vd-photo-item { flex: 1; text-align: center; }
.vd-photo-placeholder {
  height: 120px; background: rgba(255,255,255,0.04); border: 1px solid rgba(100,160,255,0.12);
  border-radius: 6px; display: flex; align-items: center; justify-content: center;
  font-size: 28px; color: rgba(255,255,255,0.2);
}
.vd-photo-label { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 6px; }
.filter-btn {
  background: #5b8ff9; color: #fff; border: none; border-radius: 4px;
  padding: 4px 16px; font-size: 13px; cursor: pointer; height: 30px;
  &:hover { background: #4a7de8; }
}
.filter-select {
  background: rgba(255,255,255,0.08); border: 1px solid rgba(100,160,255,0.2); border-radius: 4px;
  color: rgba(255,255,255,0.75); padding: 4px 10px; font-size: 13px; outline: none; height: 30px;
  min-width: 120px; option { background: #0d1f3c; }
  &:focus { border-color: #5b8ff9; }
}
</style>
