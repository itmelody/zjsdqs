<template>
  <div class="dashboard-page">
    <!-- 设施统计 - 占满整个第一行 -->
    <div class="card facility-stats-card">
      <div class="card-header">
        <h3 class="card-title">
          <FundOutlined class="card-icon" />
          设施统计    </h3>
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
          <h4 class="section-title">
            <EnvironmentOutlined class="section-icon road-icon" />
            道路统计
          </h4>
          <div class="stat-cards">
            <div class="stat-card road-card">
              <div class="stat-icon">
                <RocketOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">道路总长</div>
                <div class="stat-value">1,256.8 <span class="stat-unit">公里</span></div>
              </div>
            </div>
            <div class="stat-card road-card">
              <div class="stat-icon">
                <ClusterOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">路网密度</div>
                <div class="stat-value">1.52 <span class="stat-unit">km/km²</span></div>
              </div>
            </div>
            <div class="stat-card road-card">
              <div class="stat-icon">
                <ApartmentOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">道路面积率</div>
                <div class="stat-value">18.5 <span class="stat-unit">%</span></div>
              </div>
            </div>
          </div>
          <div ref="roadChartRef" class="bar-chart"></div>
        </div>

        <!-- 桥梁统计 -->
        <div class="stat-section bridge-section">
          <h4 class="section-title">
            <BankOutlined class="section-icon bridge-icon" />
            桥梁统计
          </h4>
          <div class="stat-cards">
            <div class="stat-card bridge-card">
              <div class="stat-icon">
                <BankOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">城市桥梁总数</div>
                <div class="stat-value">3,908 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div class="stat-card bridge-card">
              <div class="stat-icon">
                <GlobalOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">涉航桥梁总数</div>
                <div class="stat-value">1,024 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div class="stat-card bridge-card">
              <div class="stat-icon">
                <ClockCircleOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">30年以上桥龄</div>
                <div class="stat-value">256 <span class="stat-unit">座</span></div>
              </div>
            </div>
          </div>
          <div ref="bridgeChartRef" class="bar-chart"></div>
        </div>

        <!-- 隧道统计 -->
        <div class="stat-section tunnel-section">
          <h4 class="section-title">
            <GatewayOutlined class="section-icon tunnel-icon" />
            隧道统计
          </h4>
          <div class="stat-cards">
            <div class="stat-card tunnel-card">
              <div class="stat-icon">
                <GatewayOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">城市隧道总数</div>
                <div class="stat-value">892 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div class="stat-card tunnel-card">
              <div class="stat-icon">
                <ApartmentOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">地下隧道</div>
                <div class="stat-value">456 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div class="stat-card tunnel-card">
              <div class="stat-icon">
                <UserOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">人行地道</div>
                <div class="stat-value">128 <span class="stat-unit">座</span></div>
              </div>
            </div>
          </div>
          <div ref="tunnelChartRef" class="bar-chart"></div>
        </div>
      </div>
    </div>

    <!-- 中间行：检测管理 + 监测模块 -->
    <div class="middle-row">
      <!-- 检测管理 -->
      <div class="card detection-card">
        <div class="card-header">
          <h3 class="card-title">
            <SafetyCertificateOutlined class="card-icon" style="color: #52c41a" />
            检测管理
          </h3>
        </div>
        <div class="detection-content">
          <div class="detection-grid">
            <!-- 道路检测 -->
            <div class="detection-item">
              <div class="detection-title">道路检测</div>
              <div class="progress-circle road-progress"><span>86%</span></div>
              <div class="detection-stats">已检 <b>1,082</b> / 总计 <b>1,256</b> km</div>
              <div class="indicator-group">
                <div class="indicator-row primary road-primary">
                  <span class="indicator-label">D级道路</span><span class="indicator-value">86</span>
                </div>
                <div class="indicator-divider"></div>
                <div class="indicator-row">
                  <span class="indicator-label">已维修整治</span><span class="indicator-value">52</span>
                </div>
                <div class="indicator-row">
                  <span class="indicator-label">已拆除或完全封控</span><span class="indicator-value">34</span>
                </div>
              </div>
              <div class="mini-chart-row">
                <div ref="roadMiniChartRef" class="mini-bar-chart"></div>
              </div>
            </div>
            <!-- 桥梁检测 -->
            <div class="detection-item">
              <div class="detection-title">桥梁检测</div>
              <div class="progress-circle bridge-progress"><span>72%</span></div>
              <div class="detection-stats">已检 <b>2,814</b> / 总计 <b>3,908</b> 座</div>
              <div class="indicator-group">
                <div class="indicator-row primary bridge-primary">
                  <span class="indicator-label">D、E级桥梁</span><span class="indicator-value">312</span>
                </div>
                <div class="indicator-row primary bridge-primary">
                  <span class="indicator-label">不合格桥梁</span><span class="indicator-value">89</span>
                </div>
                <div class="indicator-divider"></div>
                <div class="indicator-row">
                  <span class="indicator-label">已维修整治</span><span class="indicator-value">278</span>
                </div>
                <div class="indicator-row">
                  <span class="indicator-label">已拆除或完全封控</span><span class="indicator-value">123</span>
                </div>
              </div>
              <div class="mini-chart-row">
                <div ref="bridgeMiniChartRef" class="mini-bar-chart"></div>
              </div>
            </div>
            <!-- 隧道检测 -->
            <div class="detection-item">
              <div class="detection-title">隧道检测</div>
              <div class="progress-circle tunnel-progress"><span>91%</span></div>
              <div class="detection-stats">已检 <b>812</b> / 总计 <b>892</b> 座</div>
              <div class="indicator-group">
                <div class="indicator-row primary tunnel-primary">
                  <span class="indicator-label">D、E级隧道</span><span class="indicator-value">47</span>
                </div>
                <div class="indicator-divider"></div>
                <div class="indicator-row">
                  <span class="indicator-label">已维修整治</span><span class="indicator-value">31</span>
                </div>
                <div class="indicator-row">
                  <span class="indicator-label">已拆除或完全封控</span><span class="indicator-value">16</span>
                </div>
              </div>
              <div class="mini-chart-row">
                <div ref="tunnelMiniChartRef" class="mini-bar-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 监测模块 -->
      <div class="card monitor-card">
        <div class="card-header">
          <h3 class="card-title">
            <DashboardOutlined class="card-icon" style="color: #fa8c16" />
            监测模块
          </h3>
          <div class="monitor-tabs">
            <span :class="['tab-item', { active: monitorTab === 'device' }]" @click="monitorTab = 'device'">设备统计</span>
            <span :class="['tab-item', { active: monitorTab === 'alarm' }]" @click="monitorTab = 'alarm'">超限报警统计</span>
          </div>
        </div>

        <!-- 设备统计 -->
        <div v-show="monitorTab === 'device'" class="monitor-content">
          <div class="monitor-summary">
            <div class="summary-box road-box">
              <div class="summary-box-title">道路设备</div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">设备总数</span><span class="s-value" style="color:#1677ff">486</span></div>
                <div class="summary-stat"><span class="s-label">在线数</span><span class="s-value" style="color:#52c41a">458</span></div>
                <div class="summary-stat"><span class="s-label">在线率</span><span class="s-value" style="color:#52c41a">94.2%</span></div>
                <div class="summary-stat"><span class="s-label">接入率</span><span class="s-value" style="color:#fa8c16">88.5%</span></div>
              </div>
            </div>
            <div class="summary-box bridge-box">
              <div class="summary-box-title">桥梁设备</div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">设备总数</span><span class="s-value" style="color:#13c2c2">1,235</span></div>
                <div class="summary-stat"><span class="s-label">在线数</span><span class="s-value" style="color:#52c41a">1,131</span></div>
                <div class="summary-stat"><span class="s-label">在线率</span><span class="s-value" style="color:#52c41a">91.6%</span></div>
                <div class="summary-stat"><span class="s-label">接入率</span><span class="s-value" style="color:#fa8c16">85.3%</span></div>
              </div>
            </div>
            <div class="summary-box tunnel-box">
              <div class="summary-box-title">隧道设备</div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">设备总数</span><span class="s-value" style="color:#722ed1">567</span></div>
                <div class="summary-stat"><span class="s-label">在线数</span><span class="s-value" style="color:#52c41a">549</span></div>
                <div class="summary-stat"><span class="s-label">在线率</span><span class="s-value" style="color:#52c41a">96.8%</span></div>
                <div class="summary-stat"><span class="s-label">接入率</span><span class="s-value" style="color:#fa8c16">92.1%</span></div>
              </div>
            </div>
          </div>
          <div class="device-charts-grid">
            <div ref="roadDeviceChartRef" class="device-sub-chart"></div>
            <div ref="bridgeDeviceChartRef" class="device-sub-chart"></div>
            <div ref="tunnelDeviceChartRef" class="device-sub-chart"></div>
          </div>
        </div>

        <!-- 超限报警统计 -->
        <div v-show="monitorTab === 'alarm'" class="monitor-content">
          <div class="alarm-categories">
            <!-- 道路报警 -->
            <div class="alarm-category-card road-alarm-card">
              <div class="alarm-category-header">
                <EnvironmentOutlined style="color:#1677ff" />
                <span>道路</span>
              </div>
              <div class="alarm-category-stats">
                <div class="alarm-mini-stat"><span class="ams-label">预警总数</span><span class="ams-value">62</span></div>
                <div class="alarm-mini-stat"><span class="ams-label">处置总数</span><span class="ams-value">49</span></div>
                <div class="alarm-mini-stat"><span class="ams-label">处置率</span><span class="ams-value" style="color:#52c41a">79.0%</span></div>
              </div>
              <div ref="roadAlarmChartRef" class="alarm-line-chart"></div>
            </div>
            <!-- 桥梁报警 -->
            <div class="alarm-category-card bridge-alarm-card">
              <div class="alarm-category-header">
                <BankOutlined style="color:#13c2c2" />
                <span>桥梁</span>
              </div>
              <div class="alarm-category-stats">
                <div class="alarm-mini-stat"><span class="ams-label">预警总数</span><span class="ams-value">220</span></div>
                <div class="alarm-mini-stat"><span class="ams-label">处置总数</span><span class="ams-value">192</span></div>
                <div class="alarm-mini-stat"><span class="ams-label">处置率</span><span class="ams-value" style="color:#52c41a">87.3%</span></div>
              </div>
              <div ref="bridgeAlarmChartRef" class="alarm-line-chart"></div>
            </div>
            <!-- 隧道报警 -->
            <div class="alarm-category-card tunnel-alarm-card">
              <div class="alarm-category-header">
                <GatewayOutlined style="color:#722ed1" />
                <span>隧道</span>
              </div>
              <div class="alarm-category-stats">
                <div class="alarm-mini-stat"><span class="ams-label">预警总数</span><span class="ams-value">65</span></div>
                <div class="alarm-mini-stat"><span class="ams-label">处置总数</span><span class="ams-value">57</span></div>
                <div class="alarm-mini-stat"><span class="ams-label">处置率</span><span class="ams-value" style="color:#52c41a">87.7%</span></div>
              </div>
              <div ref="tunnelAlarmChartRef" class="alarm-line-chart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部行：隐患排查 + 安全评估 -->
    <div class="bottom-row">
      <!-- 隐患排查 -->
      <div class="card hazard-card">
        <div class="card-header">
          <h3 class="card-title">
            <SearchOutlined class="card-icon" style="color: #eb2f96" />
            隐患排查
          </h3>
        </div>
        <div class="hazard-content">
          <div class="hazard-filters">
            <a-select v-model:value="hazardYear" size="small" style="width: 100px">
              <a-select-option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</a-select-option>
            </a-select>
            <a-select v-model:value="hazardScene" size="small" style="width: 110px" @change="onSceneChange">
              <a-select-option value="道路">道路</a-select-option>
              <a-select-option value="桥梁">桥梁</a-select-option>
              <a-select-option value="隧道">隧道</a-select-option>
            </a-select>
            <a-select v-model:value="hazardProjectLabel" size="small" style="width: 280px">
              <a-select-option v-for="p in currentProjectOptions" :key="p" :value="p">{{ p }}</a-select-option>
            </a-select>
          </div>
          <div class="hazard-summary">
            <div class="hazard-stat-item">
              <span class="hazard-stat-label">排查完成率</span>
              <span class="hazard-stat-value" style="color:#1677ff">{{ hazardSummary.completionRate }}%</span>
            </div>
            <div class="hazard-stat-item">
              <span class="hazard-stat-label">发现隐患总数</span>
              <span class="hazard-stat-value" style="color:#ff4d4f">{{ hazardSummary.found }}</span>
            </div>
            <div class="hazard-stat-item">
              <span class="hazard-stat-label">已整改</span>
              <span class="hazard-stat-value" style="color:#52c41a">{{ hazardSummary.fixed }}</span>
            </div>
            <div class="hazard-stat-item">
              <span class="hazard-stat-label">整改率</span>
              <span class="hazard-stat-value" style="color:#fa8c16">{{ hazardSummary.rate }}%</span>
            </div>
          </div>
          <a-table
            :columns="hazardColumns"
            :data-source="hazardTableData"
            :pagination="false"
            size="small"
            :scroll="{ y: 200 }"
            class="hazard-table"
            row-key="key"
          />
        </div>
      </div>

      <!-- 安全评估 -->
      <div class="card safety-card">
        <div class="card-header">
          <h3 class="card-title">
            <AuditOutlined class="card-icon" style="color: #2f54eb" />
            安全评估
          </h3>
        </div>
        <div class="safety-content">
          <div class="safety-filters">
            <a-select v-model:value="safetyYear" size="small" style="width: 100px">
              <a-select-option v-for="y in yearOptions" :key="y" :value="y">{{ y }}年</a-select-option>
            </a-select>
            <a-select v-model:value="safetyScene" size="small" style="width: 110px">
              <a-select-option value="道路">道路</a-select-option>
              <a-select-option value="桥梁">桥梁</a-select-option>
              <a-select-option value="隧道">隧道</a-select-option>
            </a-select>
          </div>
          <div class="safety-summary">
            <div class="safety-stat-item">
              <span class="safety-stat-label">安评完成率</span>
              <span class="safety-stat-value" style="color:#1677ff">{{ safetySummary.taskRate }}%</span>
            </div>
            <div class="safety-stat-item">
              <span class="safety-stat-label">发现隐患总数</span>
              <span class="safety-stat-value" style="color:#ff4d4f">{{ safetySummary.foundTotal }}</span>
            </div>
            <div class="safety-stat-item">
              <span class="safety-stat-label">已整改</span>
              <span class="safety-stat-value" style="color:#52c41a">{{ safetySummary.fixed }}</span>
            </div>
            <div class="safety-stat-item">
              <span class="safety-stat-label">整改率</span>
              <span class="safety-stat-value" style="color:#fa8c16">{{ safetySummary.fixRate }}%</span>
            </div>
          </div>
          <a-table
            :columns="safetyColumns"
            :data-source="safetyTableData"
            :pagination="false"
            size="small"
            :scroll="{ x: 900, y: 200 }"
            class="safety-table"
            row-key="key"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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
  FundOutlined,
  RocketOutlined,
  ClusterOutlined,
  ApartmentOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  DashboardOutlined,
  SearchOutlined,
  AuditOutlined,
} from '@ant-design/icons-vue'

// 省市区筛选
const province = ref<string>('浙江省')
const city = ref<string>()
const district = ref<string>()
const monitorTab = ref<'device' | 'alarm'>('device')

// 图表引用
const roadChartRef = ref<HTMLElement>()
const bridgeChartRef = ref<HTMLElement>()
const tunnelChartRef = ref<HTMLElement>()

const roadDeviceChartRef = ref<HTMLElement>()
const bridgeDeviceChartRef = ref<HTMLElement>()
const tunnelDeviceChartRef = ref<HTMLElement>()
const roadAlarmChartRef = ref<HTMLElement>()
const bridgeAlarmChartRef = ref<HTMLElement>()
const tunnelAlarmChartRef = ref<HTMLElement>()
const roadMiniChartRef = ref<HTMLElement>()
const bridgeMiniChartRef = ref<HTMLElement>()
const tunnelMiniChartRef = ref<HTMLElement>()

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
    option.tooltip = {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const index = params[0]?.dataIndex ?? 0
        const item = data[index]
        const isInRange = item.density >= item.recommendRange[0] && item.density <= item.recommendRange[1]
        const statusColor = isInRange ? '#52c41a' : '#ff4d4f'
        const statusText = isInRange ? '达标' : '不达标'
        return `<div style="padding: 4px 0">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px">${item.name}</div>
          <div style="margin-bottom: 4px">
            <span style="display:inline-block;width:8px;height:8px;background:#1677ff;border-radius:2px;margin-right:6px"></span>
            道路长度：<b>${item.length}</b> km
          </div>
          <div style="margin-bottom: 4px">
            <span style="display:inline-block;width:8px;height:8px;background:${statusColor};border-radius:50%;margin-right:6px"></span>
            路网密度：<b>${item.density}</b> km/km²
            <span style="color:${statusColor};margin-left:4px">(${statusText})</span>
          </div>
          <div style="color:#fa8c16">
            规范推荐值：<b>[${item.recommendRange[0]}, ${item.recommendRange[1]}]</b> km/km²
          </div>
        </div>`
      },
    }
    option.legend = {
      data: [
        { name: '道路长度', icon: 'rect' },
        { name: '路网密度达标', icon: 'circle', itemStyle: { color: '#52c41a' } },
        { name: '路网密度不达标', icon: 'circle', itemStyle: { color: '#ff4d4f' } },
      ],
      top: 0,
      textStyle: {
        fontSize: 11,
      },
      itemWidth: 10,
      itemHeight: 10,
    }
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
        name: '密度(km/km²)',
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
        splitLine: {
          show: false,
        },
      },
    ]
    option.series = [
      {
        name: '路网密度连线',
        type: 'line',
        data: data.map((item, index) => [index, item.density]),
        lineStyle: {
          color: '#52c41a',
          width: 2,
        },
        itemStyle: {
          color: '#52c41a',
          opacity: 0,
        },
        symbol: 'none',
        yAxisIndex: 1,
        silent: true,
        tooltip: {
          show: false,
        },
      },
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
        name: '路网密度达标',
        type: 'scatter',
        data: data
          .filter(item => item.density >= item.recommendRange[0] && item.density <= item.recommendRange[1])
          .map((item, index) => ({
            value: [data.indexOf(item), item.density],
            itemStyle: {
              color: '#52c41a',
            },
          })),
        symbolSize: 12,
        yAxisIndex: 1,
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          formatter: (params: any) => params.value[1],
        },
      },
      {
        name: '路网密度不达标',
        type: 'scatter',
        data: data
          .filter(item => item.density < item.recommendRange[0] || item.density > item.recommendRange[1])
          .map((item, index) => ({
            value: [data.indexOf(item), item.density],
            itemStyle: {
              color: '#ff4d4f',
            },
          })),
        symbolSize: 12,
        yAxisIndex: 1,
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          formatter: (params: any) => params.value[1],
        },
      },
    ]
  } else {
    option.series[0].data = data.map(item => item.value)
  }
  
  chart.setOption(option)
  return chart
}



// 初始化检测管理底部统计图
function initMiniBarChart(container: HTMLElement | undefined, overdue: number, warning: number, accentColor: string) {
  if (!container) return
  const chart = echarts.init(container)
  charts.push(chart)
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '2%', right: '12%', top: '12%', bottom: '8%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { fontSize: 10, color: 'rgba(0,0,0,0.45)' },
      splitLine: { lineStyle: { color: '#f0f0f0', type: 'dashed' } },
    },
    yAxis: {
      type: 'category',
      data: ['即将到期\n(不足30天)', '超期未检'],
      axisLabel: { fontSize: 10, color: 'rgba(0,0,0,0.65)', interval: 0, lineHeight: 13 },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: warning, itemStyle: { color: '#fa8c16' } },
          { value: overdue, itemStyle: { color: '#ff4d4f' } },
        ],
        barWidth: '45%',
        itemStyle: { borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: 'right', fontSize: 11, fontWeight: 'bold', formatter: '{c}' },
      },
    ],
  }
  chart.setOption(option)
  return chart
}

// 初始化设备分类柱状图
function initDeviceSubChart(container: HTMLElement | undefined, categories: string[], values: number[], color: string) {
  if (!container) return
  const chart = echarts.init(container)
  charts.push(chart)
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '4%', right: '8%', bottom: '18%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 10, interval: 0, color: 'rgba(0,0,0,0.65)' },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
    series: [
      {
        type: 'bar',
        data: values.map(v => ({ value: v, itemStyle: { color } })),
        barMaxWidth: 32,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', fontSize: 11, fontWeight: 'bold', formatter: '{c}' },
      },
    ],
  }
  chart.setOption(option)
  return chart
}

// 初始化报警趋势折线图
function initAlarmChart(container: HTMLElement | undefined, days: string[], level1: number[], level2: number[], level3: number[]) {
  if (!container) return
  const chart = echarts.init(container)
  charts.push(chart)
  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['一级预警', '二级预警', '三级预警'], top: 0, textStyle: { fontSize: 10 }, itemWidth: 12, itemHeight: 8 },
    grid: { left: '8%', right: '4%', bottom: '10%', top: '22%', containLabel: true },
    xAxis: {
      type: 'category', data: days, boundaryGap: false,
      axisLabel: { fontSize: 10, color: 'rgba(0,0,0,0.55)' },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
    },
    yAxis: {
      type: 'value', minInterval: 2, maxInterval: 5,
      axisLabel: { fontSize: 10, color: 'rgba(0,0,0,0.45)' },
      splitLine: { lineStyle: { color: '#f0f0f0' } },
    },
    series: [
      { name: '一级预警', type: 'line', data: level1, smooth: true, lineStyle: { width: 2, color: '#ff4d4f' }, itemStyle: { color: '#ff4d4f' }, symbol: 'circle', symbolSize: 5 },
      { name: '二级预警', type: 'line', data: level2, smooth: true, lineStyle: { width: 2, color: '#fa8c16' }, itemStyle: { color: '#fa8c16' }, symbol: 'circle', symbolSize: 5 },
      { name: '三级预警', type: 'line', data: level3, smooth: true, lineStyle: { width: 2, color: '#fadb14' }, itemStyle: { color: '#fadb14' }, symbol: 'circle', symbolSize: 5 },
    ],
  }
  chart.setOption(option)
  return chart
}

// 隐患排查表格
const zjCities = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']

const sceneUnitMap: Record<string, string> = { '道路': 'km', '桥梁': '座', '隧道': '座' }
const sceneLabelMap: Record<string, string> = { '道路': '道路数', '桥梁': '桥梁数', '隧道': '隧道数' }

const projectOptionsMap: Record<string, string[]> = {
  '道路': ['日常隐患排查', '专项隐患排查', '季度安全检查'],
  '桥梁': ['日常隐患排查', '结构安全检测', '荷载试验'],
  '隧道': ['日常隐患排查', '结构安全检测', '消防检查'],
}

const currentYear = new Date().getFullYear()
const yearOptions = [currentYear - 2, currentYear - 1, currentYear]

const hazardYear = ref(currentYear)
const hazardScene = ref<string>('道路')
const hazardProject = ref<string>('日常隐患排查')

const hazardProjectLabel = computed({
  get: () => `${hazardYear.value}年浙江省${hazardScene.value}${hazardProject.value}项目`,
  set: (val: string) => {
    const shortNames = projectOptionsMap[hazardScene.value] || []
    const found = shortNames.find(n => val === `${hazardYear.value}年浙江省${hazardScene.value}${n}项目`)
    if (found) hazardProject.value = found
  },
})

const currentProjectOptions = computed(() => {
  const shortNames = projectOptionsMap[hazardScene.value] || []
  return shortNames.map(name => `${hazardYear.value}年浙江省${hazardScene.value}${name}项目`)
})

// 基础数据（每个地市 * 场景 * 项目 * 年份的模拟数据）
function genHazardData(scene: string, project: string, year: number) {
  const baseMap: Record<string, number[]> = {
    '道路': [1256, 340, 285, 198, 156, 210, 178, 145, 167, 124, 95],
    '桥梁': [3908, 682, 452, 371, 285, 310, 268, 195, 246, 178, 142],
    '隧道': [892, 156, 108, 87, 65, 72, 58, 45, 67, 52, 38],
  }
  const projectIdx = projectOptionsMap[scene]?.indexOf(project) ?? 0
  const yearOffset = year - currentYear + 2
  const base = baseMap[scene] || baseMap['道路']
  return zjCities.map((city, i) => {
    const total = base[i]
    const checkCount = Math.max(1, Math.round(total / (30 + i * 5) + yearOffset * 3 + projectIdx * 2))
    const rateBase = 72 + projectIdx * 5 - (i % 5) * 3 - (2 - yearOffset) * 4
    const completionRate = Math.min(99.5, Math.max(60, rateBase + (i * 1.7 % 8)))
    const foundIssues = Math.max(0, Math.round(checkCount * 0.6 + i * 3 + projectIdx * 5))
    const fixedIssues = Math.round(foundIssues * completionRate / 100)
    return {
      key: String(i + 1),
      city,
      sceneTotal: total,
      checkCount,
      completionRate: completionRate.toFixed(1) + '%',
      foundIssues,
      unfixedIssues: foundIssues - fixedIssues,
      fixRate: foundIssues > 0 ? ((fixedIssues / foundIssues) * 100).toFixed(1) + '%' : '0.0%',
    }
  })
}

const hazardTableData = computed(() => genHazardData(hazardScene.value, hazardProject.value, hazardYear.value))

const hazardColumns = computed(() => [
  { title: '地市', dataIndex: 'city', key: 'city', width: 80 },
  { title: sceneLabelMap[hazardScene.value] || '数量', dataIndex: 'sceneTotal', key: 'sceneTotal', width: 90 },
  { title: '检查次数', dataIndex: 'checkCount', key: 'checkCount', width: 80 },
  { title: '排查完成率', dataIndex: 'completionRate', key: 'completionRate', width: 100 },
  { title: '发现隐患', dataIndex: 'foundIssues', key: 'foundIssues', width: 80 },
  { title: '未整改隐患', dataIndex: 'unfixedIssues', key: 'unfixedIssues', width: 100 },
  { title: '整改率', dataIndex: 'fixRate', key: 'fixRate', width: 80 },
])

const hazardSummary = computed(() => {
  const data = hazardTableData.value
  const found = data.reduce((s, d) => s + d.foundIssues, 0)
  const unfixed = data.reduce((s, d) => s + d.unfixedIssues, 0)
  const fixed = found - unfixed
  const rate = found > 0 ? ((fixed / found) * 100).toFixed(1) : '0.0'
  // 排查完成率 = 各城市完成率的平均值
  const avgCompletion = data.length > 0
    ? (data.reduce((s, d) => s + parseFloat(d.completionRate), 0) / data.length).toFixed(1)
    : '0.0'
  return { found, fixed, unfixed, rate, completionRate: avgCompletion }
})

function onSceneChange() {
  hazardProject.value = projectOptionsMap[hazardScene.value][0]
}

// 安全评估
const safetyYear = ref(currentYear)
const safetyScene = ref<string>('道路')

const safetyLabelMap: Record<string, string> = { '道路': '发现隐患道路数', '桥梁': '发现隐患桥梁数', '隧道': '发现隐患隧道数' }

function genSafetyData(scene: string, year: number) {
  const baseMap: Record<string, number[]> = {
    '道路': [1256, 340, 285, 198, 156, 210, 178, 145, 167, 124, 95],
    '桥梁': [3908, 682, 452, 371, 285, 310, 268, 195, 246, 178, 142],
    '隧道': [892, 156, 108, 87, 65, 72, 58, 45, 67, 52, 38],
  }
  const yearOffset = year - currentYear + 2
  const base = baseMap[scene] || baseMap['道路']
  return zjCities.map((city, i) => {
    const total = base[i]
    const pubCompanies = Math.max(1, Math.round(total / (20 + i * 3) + yearOffset * 2))
    const doneCompanies = Math.max(0, Math.round(pubCompanies * (0.7 + (i % 4) * 0.05)))
    const pubTasks = Math.max(1, Math.round(total / (10 + i * 2) + yearOffset * 3))
    const doneTasks = Math.max(0, Math.round(pubTasks * (0.65 + (i % 5) * 0.04)))
    const taskRate = pubTasks > 0 ? ((doneTasks / pubTasks) * 100).toFixed(1) + '%' : '0.0%'
    const foundSceneIssues = Math.max(0, Math.round(pubTasks * 0.5 + i * 2 + yearOffset))
    const foundTotal = Math.round(foundSceneIssues * 1.3 + i)
    const unfixed = Math.max(0, Math.round(foundTotal * (0.15 + (i % 3) * 0.05)))
    const fixed = foundTotal - unfixed
    const fixRate = foundTotal > 0 ? ((fixed / foundTotal) * 100).toFixed(1) + '%' : '0.0%'
    return {
      key: String(i + 1),
      city,
      pubCompanies,
      doneCompanies,
      pubTasks,
      doneTasks,
      taskRate,
      foundSceneIssues,
      foundTotal,
      unfixed,
      fixRate,
    }
  })
}

const safetyTableData = computed(() => genSafetyData(safetyScene.value, safetyYear.value))

const safetyColumns = computed(() => [
  { title: '地市', dataIndex: 'city', key: 'city', width: 70, fixed: 'left' as const },
  { title: '发布安评\n企业数', dataIndex: 'pubCompanies', key: 'pubCompanies', width: 80 },
  { title: '完成安评\n企业数', dataIndex: 'doneCompanies', key: 'doneCompanies', width: 80 },
  { title: '发布安评\n任务总数', dataIndex: 'pubTasks', key: 'pubTasks', width: 80 },
  { title: '完成安评\n任务总数', dataIndex: 'doneTasks', key: 'doneTasks', width: 80 },
  { title: '安评完成率', dataIndex: 'taskRate', key: 'taskRate', width: 90 },
  { title: safetyLabelMap[safetyScene.value] || '发现隐患数', dataIndex: 'foundSceneIssues', key: 'foundSceneIssues', width: 100 },
  { title: '发现隐患总数', dataIndex: 'foundTotal', key: 'foundTotal', width: 90 },
  { title: '未整改隐患', dataIndex: 'unfixed', key: 'unfixed', width: 90 },
  { title: '整改率', dataIndex: 'fixRate', key: 'fixRate', width: 80 },
])

const safetySummary = computed(() => {
  const data = safetyTableData.value
  const pubTasks = data.reduce((s, d) => s + d.pubTasks, 0)
  const doneTasks = data.reduce((s, d) => s + d.doneTasks, 0)
  const taskRate = pubTasks > 0 ? ((doneTasks / pubTasks) * 100).toFixed(1) : '0.0'
  const foundTotal = data.reduce((s, d) => s + d.foundTotal, 0)
  const unfixed = data.reduce((s, d) => s + d.unfixed, 0)
  const fixed = foundTotal - unfixed
  const fixRate = foundTotal > 0 ? ((fixed / foundTotal) * 100).toFixed(1) : '0.0'
  return { taskRate, foundTotal, fixed, fixRate }
})

function handleResize() {
  charts.forEach(c => c.resize())
}

onMounted(async () => {
  await nextTick()
  
  // 道路类型统计 - 包含密度和规范推荐值
  const roadData = [
    { name: '快速路', length: 42.7, density: 0.35, recommendRange: [0.3, 0.4] },
    { name: '主干路', length: 63.2, density: 0.97, recommendRange: [1.0, 1.2] },
    { name: '次干路', length: 46.4, density: 0.71, recommendRange: [1.2, 1.4] },
    { name: '支路', length: 112.4, density: 1.73, recommendRange: [3.0, 4.0] },
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
  initBarChart(bridgeChartRef.value, '桥梁数量', bridgeData, '#13c2c2')
  initBarChart(tunnelChartRef.value, '隧道数量', tunnelData, '#722ed1')

  // 监测模块 - 设备统计柱状图（分三类与面板对齐）
  initDeviceSubChart(roadDeviceChartRef.value, ['道路边坡\n监测设备'], [486], '#1677ff')
  initDeviceSubChart(bridgeDeviceChartRef.value, ['桥梁环境\n监测设备', '桥梁作用\n监测设备', '桥梁结构\n监测设备'], [386, 452, 397], '#13c2c2')
  initDeviceSubChart(tunnelDeviceChartRef.value, ['隧道环境\n监测设备', '隧道机电\n监测设备', '隧道结构\n监测设备'], [198, 215, 154], '#722ed1')
  // 监测模块 - 报警趋势折线图（近一周具体日期）
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(`${d.getMonth() + 1}月${d.getDate()}日`)
  }
  initAlarmChart(roadAlarmChartRef.value, dates, [3, 5, 2, 7, 4, 1, 3], [1, 2, 3, 4, 2, 1, 2], [0, 1, 0, 2, 1, 0, 1])
  initAlarmChart(bridgeAlarmChartRef.value, dates, [8, 12, 6, 15, 9, 5, 7], [4, 6, 3, 8, 5, 2, 4], [2, 3, 1, 5, 3, 1, 2])
  initAlarmChart(tunnelAlarmChartRef.value, dates, [2, 4, 1, 5, 3, 2, 1], [1, 2, 0, 3, 1, 1, 0], [0, 1, 0, 2, 0, 0, 1])

  // 检测管理底部统计图
  initMiniBarChart(roadMiniChartRef.value, 23, 8, '#1677ff')
  initMiniBarChart(bridgeMiniChartRef.value, 156, 94, '#13c2c2')
  initMiniBarChart(tunnelMiniChartRef.value, 41, 17, '#722ed1')

  window.addEventListener('resize', handleResize)
  setTimeout(handleResize, 100)
})

// Tab切换时刷新图表尺寸
watch(monitorTab, () => {
  nextTick(() => {
    setTimeout(handleResize, 50)
  })
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
  gap: 10px;
  min-height: calc(100vh - 64px - 48px);
  padding-bottom: 16px;
}

.middle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex-shrink: 0;
  min-height: 320px;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  font-size: 20px;
  color: #1677ff;
}

// 设施统计
.filter-group {
  display: flex;
  gap: 8px;
}

.facility-stats-card {
  flex-shrink: 0;
}

.facility-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-section {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s;
  overflow: hidden;

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
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
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
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 10px;
}

.stat-card {
  border-radius: 6px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 3px solid transparent;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .stat-icon {
    font-size: 16px;
    flex-shrink: 0;
  }

  .stat-info {
    flex: 1;
  }

  &.road-card {
    background: linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%);
    border-left-color: #1677ff;
    .stat-icon { color: #1677ff; }
    .stat-value { color: #1677ff; }
  }
  &.bridge-card {
    background: linear-gradient(135deg, #e6fffb 0%, #f0fffe 100%);
    border-left-color: #13c2c2;
    .stat-icon { color: #13c2c2; }
    .stat-value { color: #08979c; }
  }
  &.tunnel-card {
    background: linear-gradient(135deg, #f9f0ff 0%, #fcf5ff 100%);
    border-left-color: #722ed1;
    .stat-icon { color: #722ed1; }
    .stat-value { color: #722ed1; }
  }
}

.stat-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 6px;
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
  height: 220px;
  min-height: 220px;
  flex-shrink: 0;
}

// 检测管理
.detection-card {
  overflow: auto;
}

.detection-content {
  height: calc(100% - 36px);
}

.detection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  height: 100%;
}

.detection-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.detection-title {
  font-size: 13px;
  font-weight: 600;
  margin: 0;
}

.progress-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 6px solid #52c41a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #52c41a;
  flex-shrink: 0;

  &.small {
    width: 40px;
    height: 40px;
    border-width: 4px;
    font-size: 12px;
  }

  &.road-progress {
    border-color: #1677ff;
    color: #1677ff;
  }

  &.bridge-progress {
    border-color: #13c2c2;
    color: #13c2c2;
  }

  &.tunnel-progress {
    border-color: #722ed1;
    color: #722ed1;
  }
}

.detection-stats {
  text-align: center;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.5;
}

.indicator-group {
  width: 100%;
  margin-top: 4px;
  padding: 6px 8px;
  background: #f7f8fa;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.indicator-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1px 0;

  &.primary {
    .indicator-label {
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .indicator-value {
      font-weight: 700;
      font-size: 15px;
    }
  }

  &.road-primary .indicator-value { color: #1677ff; }
  &.bridge-primary .indicator-value { color: #13c2c2; }
  &.tunnel-primary .indicator-value { color: #722ed1; }
}

.indicator-label {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.65);
}

.indicator-value {
  font-size: 14px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  min-width: 28px;
  text-align: right;
}

.indicator-divider {
  height: 1px;
  background: #e8e8e8;
  margin: 2px 0;
}


.mini-chart-row {
  width: 100%;
  margin-top: auto;
  padding-top: 4px;
}

.mini-bar-chart {
  width: 100%;
  height: 80px;
}

// 监测模块
.monitor-card {
  overflow: auto;
}

.monitor-tabs {
  display: flex;
  gap: 4px;

  .tab-item {
    padding: 3px 12px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
    border: 1px solid transparent;

    &:hover {
      color: #1677ff;
      background: #e6f4ff;
    }

    &.active {
      color: #1677ff;
      background: #e6f4ff;
      border-color: #91caff;
      font-weight: 600;
    }
  }
}

.monitor-content {
  height: calc(100% - 40px);
  display: flex;
  flex-direction: column;
}

.monitor-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.summary-box {
  border-radius: 6px;
  padding: 8px 10px;
  border-left: 3px solid transparent;

  &.road-box { background: #f0f5ff; border-left-color: #1677ff; }
  &.bridge-box { background: #f0fffe; border-left-color: #13c2c2; }
  &.tunnel-box { background: #fcf5ff; border-left-color: #722ed1; }
}

.summary-box-title {
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  margin-bottom: 4px;
}

.summary-box-grid {
  display: flex;
  gap: 12px;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.s-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
}

.s-value {
  font-size: 15px;
  font-weight: 700;
}

.monitor-chart {
  flex: 1;
  min-height: 0;
}

.device-charts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.device-sub-chart {
  min-height: 0;
}

// 报警统计
.alarm-categories {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
}

.alarm-category-card {
  background: #fafafa;
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 0;
  flex: 1;
  border-left: 3px solid transparent;

  &.road-alarm-card { border-left-color: #1677ff; }
  &.bridge-alarm-card { border-left-color: #13c2c2; }
  &.tunnel-alarm-card { border-left-color: #722ed1; }
}

.alarm-category-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  white-space: nowrap;
  min-width: 56px;
}

.alarm-category-stats {
  display: flex;
  gap: 16px;
  padding: 3px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  flex-shrink: 0;
}

.alarm-mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.ams-label {
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
}

.ams-value {
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.85);
}

.alarm-line-chart {
  flex: 1;
  min-width: 0;
  min-height: 60px;
  height: 100%;
}

// 底部行
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex-shrink: 0;
  min-height: 260px;
}

// 隐患排查
.hazard-card {
  overflow: hidden;
}

.hazard-filters {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;
}

.hazard-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.hazard-summary {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.hazard-stat-item {
  flex: 1;
  background: #fafafa;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid #f0f0f0;
}

.hazard-stat-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
}

.hazard-stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.hazard-table {
  flex: 1;
  min-height: 0;
  overflow: auto;

  :deep(.ant-table) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr > th) {
    padding: 6px 8px;
    font-size: 11px;
    background: #fafafa;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 5px 8px;
  }
}

// 安全评估
.safety-card {
  overflow: hidden;
}

.safety-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
}

.safety-summary {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.safety-stat-item {
  flex: 1;
  background: #fafafa;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid #f0f0f0;
}

.safety-stat-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
}

.safety-stat-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.safety-filters {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;
}

.safety-table {
  flex: 1;
  min-height: 0;

  :deep(.ant-table) {
    font-size: 12px;
  }

  :deep(.ant-table-thead > tr > th) {
    padding: 6px 4px;
    font-size: 11px;
    background: #fafafa;
    white-space: pre-line;
    text-align: center;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 5px 4px;
    text-align: center;
  }
}

// 隐患排查
.filter-group {
  display: flex;
  gap: 8px;
}
</style>
