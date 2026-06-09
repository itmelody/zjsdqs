<template>
  <div class="dashboard-page">
    <!-- 全局地区筛选 -->
    <div class="global-filter">
      <a-select v-model:value="province" placeholder="省" style="width: 120px" allow-clear @change="onProvinceChange">
        <a-select-option value="浙江省">浙江省</a-select-option>
      </a-select>
      <a-select v-model:value="city" placeholder="市" style="width: 120px" allow-clear @change="onCityChange">
        <a-select-option v-for="c in cityOptions" :key="c" :value="c">{{ c }}</a-select-option>
      </a-select>
    </div>

    <!-- 设施统计 - 占满整个第一行 -->
    <div class="card facility-stats-card">
      <div class="card-header">
        <h3 class="card-title">
          <FundOutlined class="card-icon" />
          设施统计
        </h3>
        <a-button type="link" @click="openDetailModal('facility')">查看详情</a-button>
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
                <ExpandOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">道路总面积</div>
                <div class="stat-value">856.3 <span class="stat-unit">km²</span></div>
              </div>
            </div>
            <div class="stat-card road-card">
              <div class="stat-icon">
                <BuildOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">建成区面积</div>
                <div class="stat-value">412.5 <span class="stat-unit">km²</span></div>
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
                <div class="stat-value">436 <span class="stat-unit">座</span></div>
              </div>
            </div>
            <div class="stat-card tunnel-card">
              <div class="stat-icon">
                <ApartmentOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">城市道路隧道</div>
                <div class="stat-value">308 <span class="stat-unit">座</span></div>
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
            <div class="stat-card tunnel-card">
              <div class="stat-icon">
                <BankOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-label">地下隧道</div>
                <div class="stat-value">256 <span class="stat-unit">座</span></div>
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
          <a-button type="link" @click="openDetailModal('detection')">查看详情</a-button>
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
                  <span class="indicator-label">D级道路</span><span class="indicator-value">86 <small>条</small></span>
                </div>
                <div class="indicator-divider"></div>
                <div class="indicator-row">
                  <span class="indicator-label">已维修整治</span><span class="indicator-value">52 <small>条</small></span>
                </div>
                <div class="indicator-row">
                  <span class="indicator-label">已拆除或完全封控</span><span class="indicator-value">34 <small>条</small></span>
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
                  <span class="indicator-label">D、E级桥梁</span><span class="indicator-value">312 <small>座</small></span>
                </div>
                <div class="indicator-row primary bridge-primary">
                  <span class="indicator-label">不合格桥梁</span><span class="indicator-value">89 <small>座</small></span>
                </div>
                <div class="indicator-divider"></div>
                <div class="indicator-row">
                  <span class="indicator-label">已维修整治</span><span class="indicator-value">278 <small>座</small></span>
                </div>
                <div class="indicator-row">
                  <span class="indicator-label">已拆除或完全封控</span><span class="indicator-value">123 <small>座</small></span>
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
              <div class="detection-stats">已检 <b>398</b> / 总计 <b>436</b> 座</div>
              <div class="indicator-group">
                <div class="indicator-row primary tunnel-primary">
                  <span class="indicator-label">D、E级隧道</span><span class="indicator-value">47 <small>座</small></span>
                </div>
                <div class="indicator-divider"></div>
                <div class="indicator-row">
                  <span class="indicator-label">已维修整治</span><span class="indicator-value">31 <small>座</small></span>
                </div>
                <div class="indicator-row">
                  <span class="indicator-label">已拆除或完全封控</span><span class="indicator-value">16 <small>座</small></span>
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
          <a-button type="link" @click="openDetailModal('monitor')">查看详情</a-button>
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
              </div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">接入道路数</span><span class="s-value" style="color:#fa8c16">312</span></div>
                <div class="summary-stat"><span class="s-label">接入率</span><span class="s-value" style="color:#fa8c16">88.5%</span></div>
              </div>
            </div>
            <div class="summary-box bridge-box">
              <div class="summary-box-title">桥梁设备</div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">设备总数</span><span class="s-value" style="color:#13c2c2">1,235</span></div>
                <div class="summary-stat"><span class="s-label">在线数</span><span class="s-value" style="color:#52c41a">1,131</span></div>
                <div class="summary-stat"><span class="s-label">在线率</span><span class="s-value" style="color:#52c41a">91.6%</span></div>
              </div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">接入桥梁数</span><span class="s-value" style="color:#fa8c16">856</span></div>
                <div class="summary-stat"><span class="s-label">接入率</span><span class="s-value" style="color:#fa8c16">85.3%</span></div>
              </div>
            </div>
            <div class="summary-box tunnel-box">
              <div class="summary-box-title">隧道设备</div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">设备总数</span><span class="s-value" style="color:#722ed1">567</span></div>
                <div class="summary-stat"><span class="s-label">在线数</span><span class="s-value" style="color:#52c41a">549</span></div>
                <div class="summary-stat"><span class="s-label">在线率</span><span class="s-value" style="color:#52c41a">96.8%</span></div>
              </div>
              <div class="summary-box-grid">
                <div class="summary-stat"><span class="s-label">接入隧道数</span><span class="s-value" style="color:#fa8c16">412</span></div>
                <div class="summary-stat"><span class="s-label">接入率</span><span class="s-value" style="color:#fa8c16">92.1%</span></div>
              </div>
            </div>
          </div>
          <div class="device-charts-grid">
            <div ref="roadDeviceChartRef" class="device-sub-chart"></div>
            <div class="device-sub-chart bridge-device-chart-wrapper">
              <div v-if="bridgeDeviceDrillDown" class="drill-down-header">
                <a-button size="small" @click="exitBridgeDrillDown">
                  <template #icon><ArrowLeftOutlined /></template>
                  返回
                </a-button>
                <span class="drill-down-title">桥梁结构监测设备详情</span>
              </div>
              <div v-show="!bridgeDeviceDrillDown" ref="bridgeDeviceChartRef" class="device-sub-chart-inner"></div>
              <div v-show="bridgeDeviceDrillDown" ref="bridgeDeviceDrillChartRef" class="device-sub-chart-inner"></div>
            </div>
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

    <!-- 查看详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      :title="detailModalTitle"
      width="900px"
      :footer="null"
      class="detail-modal"
    >
      <!-- 监测模块子标题栏 -->
      <div v-if="detailModule === 'monitor'" class="monitor-detail-header">
        <span class="monitor-detail-title">{{ monitorDetailMode === 'device' ? '设备统计' : '超限报警统计' }}</span>
        <a-button v-if="monitorDetailMode === 'device'" type="link" size="small" @click="switchMonitorDetail('alarm')">超限报警统计</a-button>
        <a-button v-else type="link" size="small" @click="switchMonitorDetail('device')">设备统计</a-button>
      </div>
      <a-tabs v-model:activeKey="detailTab" class="detail-tabs" @change="onDetailTabChange">
        <a-tab-pane key="road" tab="道路">
          <template v-if="detailModule === 'monitor' && monitorDetailMode === 'alarm'">
            <a-table :columns="alarmColumns.road" :data-source="alarmData.road" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          </template>
          <template v-else>
            <div v-if="detailModule === 'detection' && detectionDrillType" class="drill-down-header">
              <a-button size="small" @click="detectionDrillType = null"><template #icon><ArrowLeftOutlined /></template>返回</a-button>
              <span class="drill-down-title">{{ detectionDrillTitle }}</span>
            </div>
            <a-table v-if="!(detailModule === 'detection' && detectionDrillType)" :columns="currentColumns.road" :data-source="currentData.road" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
            <a-table v-else :columns="detectionDrillColumns" :data-source="detectionDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          </template>
        </a-tab-pane>
        <a-tab-pane key="bridge" tab="桥梁">
          <template v-if="detailModule === 'monitor' && monitorDetailMode === 'alarm'">
            <a-table :columns="alarmColumns.bridge" :data-source="alarmData.bridge" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          </template>
          <template v-else>
            <div v-if="(detailModule === 'monitor' && monitorBridgeDrillDown) || (detailModule === 'detection' && detectionDrillType)" class="drill-down-header">
              <a-button size="small" @click="monitorBridgeDrillDown = false; detectionDrillType = null"><template #icon><ArrowLeftOutlined /></template>返回</a-button>
              <span class="drill-down-title">{{ detailModule === 'monitor' ? '桥梁结构监测设备详情' : detectionDrillTitle }}</span>
            </div>
            <a-table v-if="!((detailModule === 'monitor' && monitorBridgeDrillDown) || (detailModule === 'detection' && detectionDrillType))" :columns="currentColumns.bridge" :data-source="currentData.bridge" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
            <a-table v-else-if="detailModule === 'monitor'" :columns="monitorBridgeDrillColumns" :data-source="monitorBridgeDrillData" :pagination="false" size="small" :scroll="{ y: 400 }" bordered />
            <a-table v-else :columns="detectionDrillColumns" :data-source="detectionDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          </template>
        </a-tab-pane>
        <a-tab-pane key="tunnel" tab="隧道">
          <template v-if="detailModule === 'monitor' && monitorDetailMode === 'alarm'">
            <a-table :columns="alarmColumns.tunnel" :data-source="alarmData.tunnel" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          </template>
          <template v-else>
            <div v-if="detailModule === 'detection' && detectionDrillType" class="drill-down-header">
              <a-button size="small" @click="detectionDrillType = null"><template #icon><ArrowLeftOutlined /></template>返回</a-button>
              <span class="drill-down-title">{{ detectionDrillTitle }}</span>
            </div>
            <a-table v-if="!(detailModule === 'detection' && detectionDrillType)" :columns="currentColumns.tunnel" :data-source="currentData.tunnel" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
            <a-table v-else :columns="detectionDrillColumns" :data-source="detectionDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          </template>
        </a-tab-pane>
      </a-tabs>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick, h } from 'vue'
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
  ExpandOutlined,
  BuildOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons-vue'

// 省市区筛选
const province = ref<string>('浙江省')
const city = ref<string>()
const monitorTab = ref<'device' | 'alarm'>('device')

// 浙江省地市及区县数据
const regionData: Record<string, Record<string, string[]>> = {
  '浙江省': {
    '杭州市': ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
    '宁波市': ['海曙区', '江北区', '镇海区', '北仑区', '鄞州区', '奉化区', '象山县', '宁海县', '余姚市', '慈溪市'],
    '温州市': ['鹿城区', '龙湾区', '瓯海区', '洞头区', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '瑞安市', '乐清市'],
    '绍兴市': ['越城区', '柯桥区', '上虞区', '新昌县', '嵊州市', '诸暨市'],
    '湖州市': ['吴兴区', '南浔区', '德清县', '长兴县', '安吉县'],
    '嘉兴市': ['南湖区', '秀洲区', '嘉善县', '海盐县', '海宁市', '平湖市', '桐乡市'],
    '金华市': ['婺城区', '金东区', '武义县', '浦江县', '磐安县', '兰溪市', '义乌市', '东阳市', '永康市'],
    '衢州市': ['柯城区', '衢江区', '龙游县', '常山县', '开化县', '江山市'],
    '台州市': ['椒江区', '黄岩区', '路桥区', '三门县', '天台县', '仙居县', '温岭市', '临海市', '玉环市'],
    '丽水市': ['莲都区', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁县', '龙泉市'],
    '舟山市': ['定海区', '普陀区', '岱山县', '嵊泗县'],
  },
}

const cityOptions = computed(() => {
  if (!province.value) return []
  return Object.keys(regionData[province.value] || {})
})

function onProvinceChange() {
  city.value = undefined
}

function onCityChange() {}

// 查看详情弹窗
const detailModalVisible = ref(false)
const detailModalTitle = ref('')
const detailTab = ref<'road' | 'bridge' | 'tunnel'>('road')
type DetailModule = 'facility' | 'detection' | 'monitor'
const detailModule = ref<DetailModule>('facility')
const monitorBridgeDrillDown = ref(false)
const monitorDetailMode = ref<'device' | 'alarm'>('device')
const detectionDrillType = ref<string | null>(null)
const detectionDrillCity = ref('')

const cityLabel = '地市'
const C = (k: string, w = 80) => ({ title: cityLabel, dataIndex: 'city', key: 'city', fixed: 'left' as const, width: w })

// 设施统计列
const facilityColumns = {
  road: [C('city'), { title: '道路总长(km)', dataIndex: 'totalLength', key: 'totalLength' }, { title: '道路总面积(km²)', dataIndex: 'totalArea', key: 'totalArea' }, { title: '建成区面积(km²)', dataIndex: 'builtArea', key: 'builtArea' }, { title: '路网密度', dataIndex: 'density', key: 'density' }, { title: '道路面积率', dataIndex: 'areaRatio', key: 'areaRatio' }, { title: '快速路(km)', dataIndex: 'expressway', key: 'expressway' }, { title: '主干路(km)', dataIndex: 'arterial', key: 'arterial' }, { title: '次干路(km)', dataIndex: 'collector', key: 'collector' }, { title: '支路(km)', dataIndex: 'local', key: 'local' }],
  bridge: [C('city'), { title: '桥梁总数(座)', dataIndex: 'total', key: 'total' }, { title: '涉航桥梁总数', dataIndex: 'navigable', key: 'navigable' }, { title: '30年以上桥龄', dataIndex: 'oldBridge', key: 'oldBridge' }, { title: '特大桥', dataIndex: 'extraLarge', key: 'extraLarge' }, { title: '大桥', dataIndex: 'large', key: 'large' }, { title: '中桥', dataIndex: 'medium', key: 'medium' }, { title: '小桥', dataIndex: 'small', key: 'small' }],
  tunnel: [C('city'), { title: '城市隧道总数(座)', dataIndex: 'total', key: 'total' }, { title: '城市道路隧道', dataIndex: 'roadTunnel', key: 'roadTunnel' }, { title: '人行地道', dataIndex: 'pedestrian', key: 'pedestrian' }, { title: '地下隧道', dataIndex: 'underground', key: 'underground' }],
}
// 检测管理列（含可点击下钻）
const clickLink = (field: string) => ({ customRender: ({ text, record }: any) => ({ children: h('a', { onClick: () => enterDetectionDrill(field, record.city) }, text) }) })
const detectionColumns = {
  road: [C('city', 70), { title: '道路总数(条)', dataIndex: 'total', key: 'total', width: 90 }, { title: '已检测', dataIndex: 'detected', key: 'detected', width: 70 }, { title: '检测率', dataIndex: 'rate', key: 'rate', width: 70 }, { title: 'D级道路', dataIndex: 'gradeD', key: 'gradeD', width: 70, ...clickLink('gradeD') }, { title: '已维修整治', dataIndex: 'repaired', key: 'repaired', width: 90 }, { title: '已拆除或完全封控', dataIndex: 'removed', key: 'removed', width: 95 }, { title: '超期未检', dataIndex: 'overdue', key: 'overdue', width: 80, ...clickLink('overdue') }, { title: '即将超期\n(不足30天)', dataIndex: 'expiringSoon', key: 'expiringSoon', width: 100, ...clickLink('expiringSoon') }],
  bridge: [C('city', 70), { title: '桥梁总数(座)', dataIndex: 'total', key: 'total', width: 95 }, { title: '已检测', dataIndex: 'detected', key: 'detected', width: 70 }, { title: '检测率', dataIndex: 'rate', key: 'rate', width: 70 }, { title: 'D、E级桥梁', dataIndex: 'gradeDE', key: 'gradeDE', width: 90, ...clickLink('gradeDE') }, { title: '不合格桥梁', dataIndex: 'unqualified', key: 'unqualified', width: 90, ...clickLink('unqualified') }, { title: '已维修整治', dataIndex: 'repaired', key: 'repaired', width: 90 }, { title: '已拆除或完全封控', dataIndex: 'removed', key: 'removed', width: 95 }, { title: '超期未检', dataIndex: 'overdue', key: 'overdue', width: 80, ...clickLink('overdue') }, { title: '即将超期\n(不足30天)', dataIndex: 'expiringSoon', key: 'expiringSoon', width: 100, ...clickLink('expiringSoon') }],
  tunnel: [C('city', 70), { title: '隧道总数(座)', dataIndex: 'total', key: 'total', width: 95 }, { title: '已检测', dataIndex: 'detected', key: 'detected', width: 70 }, { title: '检测率', dataIndex: 'rate', key: 'rate', width: 70 }, { title: 'D、E级隧道', dataIndex: 'gradeDE', key: 'gradeDE', width: 90, ...clickLink('gradeDE') }, { title: '已维修整治', dataIndex: 'repaired', key: 'repaired', width: 90 }, { title: '已拆除或完全封控', dataIndex: 'removed', key: 'removed', width: 95 }, { title: '超期未检', dataIndex: 'overdue', key: 'overdue', width: 80, ...clickLink('overdue') }, { title: '即将超期\n(不足30天)', dataIndex: 'expiringSoon', key: 'expiringSoon', width: 100, ...clickLink('expiringSoon') }],
}
// 监测模块列（桥梁结构监测设备可点击下钻）
const monitorColumns = {
  road: [C('city'), { title: '设备总数', dataIndex: 'total', key: 'total' }, { title: '在线数', dataIndex: 'online', key: 'online' }, { title: '在线率', dataIndex: 'onlineRate', key: 'onlineRate' }, { title: '接入道路数', dataIndex: 'accessRoad', key: 'accessRoad' }, { title: '接入率', dataIndex: 'accessRate', key: 'accessRate' }, { title: '道路边坡监测设备', dataIndex: 'slopeDevice', key: 'slopeDevice' }],
  bridge: [C('city'), { title: '设备总数', dataIndex: 'total', key: 'total' }, { title: '在线数', dataIndex: 'online', key: 'online' }, { title: '在线率', dataIndex: 'onlineRate', key: 'onlineRate' }, { title: '接入桥梁数', dataIndex: 'accessBridge', key: 'accessBridge' }, { title: '接入率', dataIndex: 'accessRate', key: 'accessRate' }, { title: '桥梁环境监测设备', dataIndex: 'envDevice', key: 'envDevice' }, { title: '桥梁作用监测设备', dataIndex: 'loadDevice', key: 'loadDevice' }, { title: '桥梁结构监测设备', dataIndex: 'structDevice', key: 'structDevice', customRender: ({ text, record }: any) => { return { children: h('a', { onClick: () => enterMonitorBridgeDrill(record) }, text) } } }],
  tunnel: [C('city'), { title: '设备总数', dataIndex: 'total', key: 'total' }, { title: '在线数', dataIndex: 'online', key: 'online' }, { title: '在线率', dataIndex: 'onlineRate', key: 'onlineRate' }, { title: '接入隧道数', dataIndex: 'accessTunnel', key: 'accessTunnel' }, { title: '接入率', dataIndex: 'accessRate', key: 'accessRate' }, { title: '隧道环境监测设备', dataIndex: 'envDevice', key: 'envDevice' }, { title: '隧道机电监测设备', dataIndex: 'mechDevice', key: 'mechDevice' }, { title: '隧道结构监测设备', dataIndex: 'structDevice', key: 'structDevice' }],
}

const provinceCities = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const citiesArr = computed(() => {
  if (city.value && province.value && regionData[province.value]?.[city.value]) {
    return regionData[province.value][city.value]
  }
  return provinceCities
})

// 确定性hash函数（保证同一地点数据稳定）
function h1(s: string, salt: number): number { let x = 0; for (let i = 0; i < s.length; i++) x = ((x << 5) - x + s.charCodeAt(i) + salt * 31) | 0; return Math.abs(x) }
function hR(s: string, salt: number, min: number, max: number): number { const lo = Math.min(min, max), hi = Math.max(min, max); return Math.max(0, lo + h1(s, salt) % (hi - lo + 1)) }
function hPct(s: string, salt: number, min: number, max: number): string { return (min + (h1(s, salt) % (max - min + 1) * 0.1)).toFixed(1) + '%' }

// 设施统计数据
const facilityData = computed(() => {
  const arr = citiesArr.value
  if (!city.value) {
    return {
      road: arr.map((c, i) => ({ key: i, city: c, totalLength: [1256,987,845,623,412,534,478,356,567,298,186][i], totalArea: [186.5,142.3,118.7,89.4,62.1,78.9,71.2,52.8,84.6,45.3,28.5][i], builtArea: [98.2,76.5,62.3,45.8,32.6,41.2,37.8,28.4,44.9,23.7,15.1][i], density: [8.5,7.2,6.8,6.1,5.4,5.9,5.6,4.8,6.2,4.5,3.8][i], areaRatio: [14.8,13.5,12.9,11.8,10.5,11.2,10.8,9.6,12.1,8.9,7.5][i]+'%', expressway: [156,124,98,78,52,68,62,45,72,38,24][i], arterial: [423,334,286,212,142,182,164,123,194,102,64][i], collector: [356,278,238,176,116,152,136,102,162,84,52][i], local: [321,251,223,157,102,132,116,86,139,74,46][i] })),
      bridge: arr.map((c, i) => ({ key: i, city: c, total: [567,423,389,256,178,234,198,145,267,123,87][i], navigable: [86,64,58,38,26,35,30,22,41,18,13][i], oldBridge: [124,92,85,56,38,52,44,32,58,27,19][i], extraLarge: [23,18,15,12,8,10,9,6,11,5,3][i], large: [89,67,58,42,28,38,32,24,45,19,14][i], medium: [234,178,156,112,78,98,82,62,118,54,38][i], small: [221,160,160,90,64,88,75,53,93,45,32][i] })),
      tunnel: arr.map((c, i) => ({ key: i, city: c, total: [98,76,68,45,32,41,35,26,48,21,14][i], roadTunnel: [68,52,47,31,22,28,24,18,33,14,10][i], pedestrian: [18,14,12,8,6,7,6,4,9,4,2][i], underground: [45,34,31,21,15,19,16,12,22,10,7][i] })),
    }
  }
  return {
    road: arr.map((c, i) => { const len = hR(c,1,20,200); return { key:i, city:c, totalLength:len, totalArea:+(len*0.15+hR(c,2,5,30)*0.1).toFixed(1), builtArea:+(len*0.08+hR(c,3,2,15)*0.1).toFixed(1), density:+(hR(c,4,30,90)*0.1).toFixed(1), areaRatio:hPct(c,5,60,160), expressway:hR(c,6,5,40), arterial:hR(c,7,20,100), collector:hR(c,8,15,80), local:hR(c,9,10,60) } }),
    bridge: arr.map((c, i) => { const t = hR(c,10,20,200); return { key:i, city:c, total:t, navigable:hR(c,11,3,Math.max(4,t/8|0)), oldBridge:hR(c,12,5,Math.max(6,t/4|0)), extraLarge:hR(c,13,1,Math.max(2,t/20|0)), large:hR(c,14,5,Math.max(6,t/6|0)), medium:hR(c,15,10,Math.max(11,t/3|0)), small:hR(c,16,10,Math.max(11,t/3|0)) } }),
    tunnel: arr.map((c, i) => { const t = hR(c,17,5,60); const rt = hR(c,18,3,Math.max(4,t*0.7|0)); return { key:i, city:c, total:t, roadTunnel:rt, pedestrian:hR(c,19,1,Math.max(2,t*0.3|0)), underground:hR(c,20,2,Math.max(3,rt*0.7|0)) } }),
  }
})
// 检测管理数据
const detectionData = computed(() => {
  const arr = citiesArr.value
  if (!city.value) {
    return {
      road: arr.map((c: string, i: number) => ({ key:i, city:c, total:[86,72,64,48,32,42,38,28,45,22,14][i], detected:[78,65,58,42,28,38,34,24,40,19,12][i], rate:['90.7%','90.3%','90.6%','87.5%','87.5%','90.5%','89.5%','85.7%','88.9%','86.4%','85.7%'][i], gradeD:[5,3,4,2,1,2,2,1,3,1,0][i], repaired:[3,1,2,1,0,1,0,0,2,0,0][i], removed:[1,1,0,0,0,0,0,0,0,0,0][i], overdue:[4,3,2,2,1,2,1,1,2,1,1][i], expiringSoon:[6,4,4,3,2,2,2,2,3,1,1][i] })),
      bridge: arr.map((c: string, i: number) => ({ key:i, city:c, total:[567,423,389,256,178,234,198,145,267,123,87][i], detected:[512,382,351,228,158,210,176,128,238,108,76][i], rate:['90.3%','90.3%','90.2%','89.1%','88.8%','89.7%','88.9%','88.3%','89.1%','87.8%','87.4%'][i], gradeDE:[28,21,18,12,8,11,10,7,14,6,4][i], unqualified:[15,11,9,6,4,6,5,3,7,3,2][i], repaired:[18,12,10,6,4,6,5,3,8,3,2][i], removed:[5,4,3,2,1,2,1,1,3,1,0][i], overdue:[18,13,12,8,6,8,7,5,10,5,4][i], expiringSoon:[24,18,16,10,7,10,8,6,12,5,4][i] })),
      tunnel: arr.map((c: string, i: number) => ({ key:i, city:c, total:[98,76,68,45,32,41,35,26,48,21,14][i], detected:[89,68,62,40,28,37,31,23,43,18,12][i], rate:['90.8%','89.5%','91.2%','88.9%','87.5%','90.2%','88.6%','88.5%','89.6%','85.7%','85.7%'][i], gradeDE:[6,4,4,2,2,2,2,1,3,1,1][i], repaired:[3,2,2,1,0,1,0,0,1,0,0][i], removed:[1,0,0,0,0,0,0,0,1,0,0][i], overdue:[5,4,3,2,2,2,2,1,3,2,1][i], expiringSoon:[7,5,5,3,2,3,2,2,4,2,1][i] })),
    }
  }
  return {
    road: arr.map((c, i) => { const t=hR(c,30,5,60), d=hR(c,31,Math.ceil(t*0.7),t), g=hR(c,32,0,Math.max(1,t/8|0)), rp=hR(c,33,0,Math.max(1,g-1)), rm=hR(c,34,0,Math.max(1,g-rp>1?g-rp-1:0)); return { key:i, city:c, total:t, detected:d, rate:d>0?((d/t*100).toFixed(1)+'%'):'0%', gradeD:g, repaired:Math.max(0,Math.min(rp,g-1)), removed:Math.min(rm,Math.max(0,g-rp-1)), overdue:hR(c,35,0,Math.max(1,t/10|0)), expiringSoon:hR(c,36,0,Math.max(1,t/8|0)) } }),
    bridge: arr.map((c, i) => { const t=hR(c,40,30,300), d=hR(c,41,Math.ceil(t*0.8),t), g=hR(c,42,2,Math.max(3,t/10|0)), u=hR(c,43,1,Math.max(2,g/2|0)), rp=hR(c,44,1,Math.max(2,g+u-2)), rm=hR(c,45,0,Math.max(1,g+u-rp-1)); return { key:i, city:c, total:t, detected:d, rate:d>0?((d/t*100).toFixed(1)+'%'):'0%', gradeDE:g, unqualified:u, repaired:Math.max(0,Math.min(rp,g+u-1)), removed:Math.min(rm,Math.max(0,g+u-rp-1)), overdue:hR(c,46,2,Math.max(3,t/15|0)), expiringSoon:hR(c,47,2,Math.max(3,t/12|0)) } }),
    tunnel: arr.map((c, i) => { const t=hR(c,50,10,80), d=hR(c,51,Math.ceil(t*0.8),t), g=hR(c,52,1,Math.max(2,t/8|0)), rp=hR(c,53,0,Math.max(1,g-1)), rm=hR(c,54,0,Math.max(1,g-rp>1?g-rp-1:0)); return { key:i, city:c, total:t, detected:d, rate:d>0?((d/t*100).toFixed(1)+'%'):'0%', gradeDE:g, repaired:Math.max(0,Math.min(rp,g-1)), removed:Math.min(rm,Math.max(0,g-rp-1)), overdue:hR(c,55,1,Math.max(2,t/8|0)), expiringSoon:hR(c,56,1,Math.max(2,t/6|0)) } }),
  }
})
// 监测模块数据
const monitorData = computed(() => {
  const arr = citiesArr.value
  if (!city.value) {
    return {
      road: arr.map((c: string, i: number) => ({ key:i, city:c, total:[486,378,342,256,168,218,198,145,234,112,78][i], online:[462,358,326,242,158,206,186,136,220,104,72][i], onlineRate:['95.1%','94.7%','95.3%','94.5%','94.0%','94.5%','93.9%','93.8%','94.0%','92.9%','92.3%'][i], accessRoad:[412,318,286,214,142,184,166,122,198,94,66][i], accessRate:['84.8%','84.1%','83.6%','83.6%','84.5%','84.4%','83.8%','84.1%','84.6%','83.9%','84.6%'][i], slopeDevice:[486,378,342,256,168,218,198,145,234,112,78][i] })),
      bridge: arr.map((c: string, i: number) => ({ key:i, city:c, total:[1235,956,876,645,423,567,498,365,598,286,198][i], online:[1131,876,802,590,386,518,454,332,546,260,180][i], onlineRate:['91.6%','91.6%','91.6%','91.5%','91.3%','91.4%','91.2%','91.0%','91.3%','90.9%','90.9%'][i], accessBridge:[986,762,698,514,336,452,396,290,476,228,158][i], accessRate:['79.8%','79.7%','79.7%','79.7%','79.4%','79.7%','79.5%','79.5%','79.6%','79.7%','79.8%'][i], envDevice:[386,298,274,202,132,178,156,114,188,90,62][i], loadDevice:[452,350,320,236,154,208,182,134,218,104,72][i], structDevice:[397,308,282,207,137,181,160,117,192,92,64][i] })),
      tunnel: arr.map((c: string, i: number) => ({ key:i, city:c, total:[567,438,398,294,192,258,228,168,276,132,92][i], online:[549,424,386,284,186,250,220,162,268,128,88][i], onlineRate:['96.8%','96.8%','97.0%','96.6%','96.9%','96.9%','96.5%','96.4%','97.1%','97.0%','95.7%'][i], accessTunnel:[412,318,288,214,140,188,166,122,200,96,68][i], accessRate:['72.7%','72.6%','72.4%','72.8%','72.9%','72.9%','72.8%','72.6%','72.5%','72.7%','73.9%'][i], envDevice:[198,154,140,104,68,92,82,60,98,48,34][i], mechDevice:[215,166,152,112,72,98,86,64,106,50,36][i], structDevice:[154,118,106,78,52,68,60,44,72,34,22][i] })),
    }
  }
  return {
    road: arr.map((c, i) => { const t=hR(c,60,30,300), on=hR(c,61,Math.ceil(t*0.9),t); return { key:i, city:c, total:t, online:on, onlineRate:(on/t*100).toFixed(1)+'%', accessRoad:hR(c,62,Math.ceil(t*0.7),t), accessRate:hPct(c,63,780,900), slopeDevice:t } }),
    bridge: arr.map((c, i) => { const t=hR(c,64,80,600), on=hR(c,65,Math.ceil(t*0.88),t); return { key:i, city:c, total:t, online:on, onlineRate:(on/t*100).toFixed(1)+'%', accessBridge:hR(c,66,Math.ceil(t*0.7),t), accessRate:hPct(c,67,750,850), envDevice:hR(c,68,30,Math.max(31,t/2|0)), loadDevice:hR(c,69,30,Math.max(31,t/2|0)), structDevice:hR(c,70,30,Math.max(31,t/2|0)) } }),
    tunnel: arr.map((c, i) => { const t=hR(c,71,50,400), on=hR(c,72,Math.ceil(t*0.93),t); return { key:i, city:c, total:t, online:on, onlineRate:(on/t*100).toFixed(1)+'%', accessTunnel:hR(c,73,Math.ceil(t*0.65),t), accessRate:hPct(c,74,700,800), envDevice:hR(c,75,20,Math.max(21,t/3|0)), mechDevice:hR(c,76,20,Math.max(21,t/3|0)), structDevice:hR(c,77,20,Math.max(21,t/3|0)) } }),
  }
})

// 监测模块桥梁结构监测设备下钻列和数据
const monitorBridgeDrillColumns = [C('city'), { title: '吊杆索力振动设备', dataIndex: 'cable', key: 'cable' }, { title: '位移设备', dataIndex: 'displacement', key: 'displacement' }, { title: '挠度设备', dataIndex: 'deflection', key: 'deflection' }, { title: '应变设备', dataIndex: 'strain', key: 'strain' }, { title: '振动设备', dataIndex: 'vibration', key: 'vibration' }]
const monitorBridgeDrillData = computed(() => {
  const arr = citiesArr.value
  if (!city.value) return arr.map((c: string, i: number) => ({ key:i, city:c, cable:[86,68,62,46,30,40,36,26,42,20,14][i], displacement:[124,96,88,64,42,56,50,38,60,30,20][i], deflection:[98,76,70,52,34,46,40,30,48,24,16][i], strain:[156,120,110,82,54,72,64,48,76,38,26][i], vibration:[132,102,94,70,46,62,54,40,64,32,22][i] }))
  return arr.map((c, i) => ({ key:i, city:c, cable:hR(c,80,10,100), displacement:hR(c,81,15,150), deflection:hR(c,82,12,120), strain:hR(c,83,20,180), vibration:hR(c,84,15,150) }))
})

// 超限报警统计列和数据
const alarmColumns = {
  road: [C('city', 80), { title: '预警总数', dataIndex: 'total', key: 'total', width: 90 }, { title: '一级预警', dataIndex: 'level1', key: 'level1', width: 90 }, { title: '二级预警', dataIndex: 'level2', key: 'level2', width: 90 }, { title: '三级预警', dataIndex: 'level3', key: 'level3', width: 90 }, { title: '处置总数', dataIndex: 'resolved', key: 'resolved', width: 90 }, { title: '处置率', dataIndex: 'resolveRate', key: 'resolveRate', width: 80 }],
  bridge: [C('city', 80), { title: '预警总数', dataIndex: 'total', key: 'total', width: 90 }, { title: '一级预警', dataIndex: 'level1', key: 'level1', width: 90 }, { title: '二级预警', dataIndex: 'level2', key: 'level2', width: 90 }, { title: '三级预警', dataIndex: 'level3', key: 'level3', width: 90 }, { title: '处置总数', dataIndex: 'resolved', key: 'resolved', width: 90 }, { title: '处置率', dataIndex: 'resolveRate', key: 'resolveRate', width: 80 }],
  tunnel: [C('city', 80), { title: '预警总数', dataIndex: 'total', key: 'total', width: 90 }, { title: '一级预警', dataIndex: 'level1', key: 'level1', width: 90 }, { title: '二级预警', dataIndex: 'level2', key: 'level2', width: 90 }, { title: '三级预警', dataIndex: 'level3', key: 'level3', width: 90 }, { title: '处置总数', dataIndex: 'resolved', key: 'resolved', width: 90 }, { title: '处置率', dataIndex: 'resolveRate', key: 'resolveRate', width: 80 }],
}
const alarmData = computed(() => {
  const arr = citiesArr.value
  if (!city.value) {
    return {
      road: arr.map((c: string, i: number) => ({ key:i, city:c, total:[128,96,84,62,44,58,52,38,68,32,22][i], level1:[18,14,12,8,6,8,7,5,10,5,3][i], level2:[52,38,34,25,18,24,21,15,28,13,9][i], level3:[58,44,38,29,20,26,24,18,30,14,10][i], resolved:[112,84,73,54,38,50,45,33,59,28,19][i], resolveRate:['87.5%','87.5%','86.9%','87.1%','86.4%','86.2%','86.5%','86.8%','86.8%','87.5%','86.4%'][i] })),
      bridge: arr.map((c: string, i: number) => ({ key:i, city:c, total:[356,268,234,178,124,162,145,108,198,92,64][i], level1:[48,36,32,24,16,22,20,14,27,12,8][i], level2:[142,107,94,71,50,65,58,43,79,37,26][i], level3:[166,125,108,83,58,75,67,51,92,43,30][i], resolved:[318,239,209,159,111,145,130,97,177,82,57][i], resolveRate:['89.3%','89.2%','89.3%','89.3%','89.5%','89.5%','89.7%','89.8%','89.4%','89.1%','89.1%'][i] })),
      tunnel: arr.map((c: string, i: number) => ({ key:i, city:c, total:[186,142,124,94,66,84,76,56,108,48,34][i], level1:[26,20,17,13,9,12,10,8,15,7,5][i], level2:[74,57,50,38,26,34,30,22,43,19,14][i], level3:[86,65,57,43,31,38,36,26,50,22,15][i], resolved:[168,128,112,85,59,76,68,50,97,43,31][i], resolveRate:['90.3%','90.1%','90.3%','90.4%','89.4%','90.5%','89.5%','89.3%','89.8%','89.6%','91.2%'][i] })),
    }
  }
  return {
    road: arr.map((c, i) => { const t=hR(c,90,10,100), l1=hR(c,91,1,Math.max(2,t/6|0)), l2=hR(c,92,Math.ceil(t*0.3),Math.ceil(t*0.5)), l3=Math.max(0,t-l1-l2), r=hR(c,93,Math.ceil(t*0.8),t); return { key:i, city:c, total:t, level1:l1, level2:Math.max(1,l2), level3:Math.max(1,l3), resolved:r, resolveRate:(r/t*100).toFixed(1)+'%' } }),
    bridge: arr.map((c, i) => { const t=hR(c,94,30,250), l1=hR(c,95,3,Math.max(4,t/7|0)), l2=hR(c,96,Math.ceil(t*0.3),Math.ceil(t*0.5)), l3=Math.max(0,t-l1-l2), r=hR(c,97,Math.ceil(t*0.85),t); return { key:i, city:c, total:t, level1:l1, level2:Math.max(1,l2), level3:Math.max(1,l3), resolved:r, resolveRate:(r/t*100).toFixed(1)+'%' } }),
    tunnel: arr.map((c, i) => { const t=hR(c,98,15,150), l1=hR(c,99,2,Math.max(3,t/7|0)), l2=hR(c,100,Math.ceil(t*0.3),Math.ceil(t*0.5)), l3=Math.max(0,t-l1-l2), r=hR(c,101,Math.ceil(t*0.85),t); return { key:i, city:c, total:t, level1:l1, level2:Math.max(1,l2), level3:Math.max(1,l3), resolved:r, resolveRate:(r/t*100).toFixed(1)+'%' } }),
  }
})

function enterMonitorBridgeDrill(_record: any) {
  monitorBridgeDrillDown.value = true
}

// 检测管理下钻
function enterDetectionDrill(field: string, cityName: string) {
  detectionDrillType.value = field
  detectionDrillCity.value = cityName
}

const overdueTitleMap: Record<string, string> = { road: '超期未检道路详情', bridge: '超期未检桥梁详情', tunnel: '超期未检隧道详情' }
const expiringTitleMap: Record<string, string> = { road: '即将超期道路详情', bridge: '即将超期桥梁详情', tunnel: '即将超期隧道详情' }
const detectionDrillTitle = computed(() => {
  const t = detectionDrillType.value
  const tab = detailTab.value
  if (t === 'overdue') return `${detectionDrillCity.value} - ${overdueTitleMap[tab] || ''}`
  if (t === 'expiringSoon') return `${detectionDrillCity.value} - ${expiringTitleMap[tab] || ''}`
  const map: Record<string, string> = { gradeD: 'D级道路详情', gradeDE: 'D、E级详情', unqualified: '不合格桥梁详情' }
  return `${detectionDrillCity.value} - ${map[t || ''] || ''}`
})

const inspectionCycles = ['一年', '两年', '三年']
function genOverdueData(cityName: string, count: number, tabType: 'road' | 'bridge' | 'tunnel') {
  const namePrefix = { road: '路段', bridge: '桥梁', tunnel: '隧道' }
  return Array.from({ length: Math.max(count, 2) }, (_, i) => {
    const cycle = inspectionCycles[i % 3]
    const years = cycle === '一年' ? 1 : cycle === '两年' ? 2 : 3
    const lastYear = 2024 - years - 1
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
    const expireYear = lastYear + years
    return {
      key: i, city: cityName,
      name: `${cityName}${namePrefix[tabType]}${String(i + 1).padStart(3, '0')}`,
      lastInspectDate: `${lastYear}-${month}-${day}`,
      cycle,
      expireDate: `${expireYear}-${month}-${day}`,
    }
  })
}
function genExpiringData(cityName: string, count: number, tabType: 'road' | 'bridge' | 'tunnel') {
  const namePrefix = { road: '路段', bridge: '桥梁', tunnel: '隧道' }
  const today = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return Array.from({ length: Math.max(count, 2) }, (_, i) => {
    const cycle = inspectionCycles[i % 3]
    const years = cycle === '一年' ? 1 : cycle === '两年' ? 2 : 3
    // 到期时间：今天+1天 到 今天+29天之间
    const offsetDays = 1 + (i * 29 / Math.max(count, 2)) | 0
    const expireDate = new Date(today.getTime() + offsetDays * 86400000)
    const expStr = `${expireDate.getFullYear()}-${pad(expireDate.getMonth() + 1)}-${pad(expireDate.getDate())}`
    // 最新检测时间 = 到期时间 - 周期年数
    const lastDate = new Date(expireDate)
    lastDate.setFullYear(lastDate.getFullYear() - years)
    const lastStr = `${lastDate.getFullYear()}-${pad(lastDate.getMonth() + 1)}-${pad(lastDate.getDate())}`
    return {
      key: i, city: cityName,
      name: `${cityName}${namePrefix[tabType]}${String(i + 1).padStart(3, '0')}`,
      lastInspectDate: lastStr,
      cycle,
      expireDate: expStr,
    }
  })
}
const overdueColumns = computed(() => {
  const nameTitle = detailTab.value === 'bridge' ? '桥梁名称' : detailTab.value === 'tunnel' ? '隧道名称' : '道路名称'
  return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: nameTitle, dataIndex: 'name', key: 'name', width: 150 }, { title: '最新检测时间', dataIndex: 'lastInspectDate', key: 'lastInspectDate', width: 120 }, { title: '检测周期', dataIndex: 'cycle', key: 'cycle', width: 90 }, { title: '检测到期时间', dataIndex: 'expireDate', key: 'expireDate', width: 120 }]
})

const detectionDrillColumns = computed(() => {
  const t = detectionDrillType.value
  if (t === 'overdue' || t === 'expiringSoon') return overdueColumns.value
  if (t === 'gradeD') return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: '检测名称', dataIndex: 'inspectName', key: 'inspectName', width: 120 }, { title: '检测时间', dataIndex: 'inspectDate', key: 'inspectDate', width: 110 }, { title: '检测类型', dataIndex: 'inspectType', key: 'inspectType', width: 90 }, { title: '道路名称', dataIndex: 'name', key: 'name', width: 120 }, { title: '综合评价等级', dataIndex: 'grade', key: 'grade', width: 100 }, { title: '道路整改销号结果', dataIndex: 'result', key: 'result', width: 240 }]
  if (t === 'unqualified') return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: '检测名称', dataIndex: 'inspectName', key: 'inspectName', width: 120 }, { title: '检测时间', dataIndex: 'inspectDate', key: 'inspectDate', width: 110 }, { title: '检测类型', dataIndex: 'inspectType', key: 'inspectType', width: 90 }, { title: '桥梁名称', dataIndex: 'name', key: 'name', width: 120 }, { title: '综合评价等级', dataIndex: 'grade', key: 'grade', width: 100 }, { title: '桥梁整改销号结果', dataIndex: 'result', key: 'result', width: 240 }]
  // gradeDE for bridge or tunnel
  const tab = detailTab.value
  if (tab === 'bridge') return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: '检测名称', dataIndex: 'inspectName', key: 'inspectName', width: 120 }, { title: '检测时间', dataIndex: 'inspectDate', key: 'inspectDate', width: 110 }, { title: '检测类型', dataIndex: 'inspectType', key: 'inspectType', width: 90 }, { title: '桥梁名称', dataIndex: 'name', key: 'name', width: 120 }, { title: '综合评价等级', dataIndex: 'grade', key: 'grade', width: 100 }, { title: '桥梁整改销号结果', dataIndex: 'result', key: 'result', width: 240 }]
  return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: '检测名称', dataIndex: 'inspectName', key: 'inspectName', width: 120 }, { title: '检测时间', dataIndex: 'inspectDate', key: 'inspectDate', width: 110 }, { title: '检测类型', dataIndex: 'inspectType', key: 'inspectType', width: 90 }, { title: '隧道名称', dataIndex: 'name', key: 'name', width: 120 }, { title: '综合评价等级', dataIndex: 'grade', key: 'grade', width: 100 }, { title: '隧道整改销号结果', dataIndex: 'result', key: 'result', width: 240 }]
})

const results3 = ['未完成', '已完成（销号日期2024-08-19；新评级A）', '已完成（销号日期2024-08-19；拆除或完全封控）']
const results3q = ['未完成', '已完成（销号日期2024-08-19；新评级合格）', '已完成（销号日期2024-08-19；拆除或完全封控）']
const results3b = ['未完成', '已完成（销号日期2024-08-19；新评级B）', '已完成（销号日期2024-08-19；拆除或完全封控）']
const grades = ['D', 'D', 'E', 'D', 'E']
const newGrades = ['A', 'B', 'C']

function genDrillData(cityName: string, count: number, type: 'road' | 'bridge' | 'tunnel' | 'unqualified') {
  const typeMap = { road: '常规检测', bridge: '常规检测', tunnel: '常规检测', unqualified: '专项检测' }
  const namePrefix = { road: '路段', bridge: '桥梁', tunnel: '隧道', unqualified: '桥梁' }
  const results = type === 'unqualified' ? results3q : type === 'road' ? results3 : results3b
  return Array.from({ length: Math.max(count, 2) }, (_, i) => ({
    key: i, city: cityName,
    inspectName: `${cityName}${namePrefix[type]}检测-2024-${String(i + 1).padStart(3, '0')}`,
    inspectDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    inspectType: typeMap[type],
    name: `${cityName}${namePrefix[type]}${String(i + 1).padStart(3, '0')}`,
    grade: type === 'unqualified' ? '不合格' : type === 'road' ? 'D' : grades[i % grades.length],
    result: (() => { const r = results[i % results.length]; if (r.includes('新评级') && type !== 'unqualified') { const g = newGrades[i % newGrades.length]; return r.replace(/新评级[A-Z]/, `新评级${g}`) } return r })(),
  }))
}

const detectionDrillData = computed(() => {
  const city = detectionDrillCity.value
  const arr = citiesArr.value
  const idx = arr.indexOf(city)
  if (idx < 0) return []
  const t = detectionDrillType.value
  const tab = detailTab.value as 'road' | 'bridge' | 'tunnel'
  const data = detectionData.value[tab]
  const row = data.find((r: any) => r.city === city)
  if (!row) return []
  if (t === 'overdue') return genOverdueData(city, (row as any)?.overdue ?? 2, tab)
  if (t === 'expiringSoon') return genExpiringData(city, (row as any)?.expiringSoon ?? 2, tab)
  if (t === 'gradeD') return genDrillData(city, (row as any)?.gradeD ?? 2, 'road')
  if (t === 'unqualified') return genDrillData(city, (row as any)?.unqualified ?? 2, 'unqualified')
  // gradeDE
  if (tab === 'bridge') return genDrillData(city, (row as any)?.gradeDE ?? 2, 'bridge')
  return genDrillData(city, (row as any)?.gradeDE ?? 2, 'tunnel')
})

// 当前模块的列和数据
const currentColumns = computed(() => {
  switch (detailModule.value) {
    case 'detection': return detectionColumns
    case 'monitor': return monitorColumns
    default: return facilityColumns
  }
})
const currentData = computed(() => {
  switch (detailModule.value) {
    case 'detection': return detectionData.value
    case 'monitor': return monitorData.value
    default: return facilityData.value
  }
})

function openDetailModal(module: DetailModule) {
  const titles: Record<DetailModule, string> = {
    facility: '设施统计详情',
    detection: '检测管理详情',
    monitor: '监测模块详情',
  }
  detailModule.value = module
  detailModalTitle.value = titles[module]
  detailTab.value = 'road'
  monitorBridgeDrillDown.value = false
  detectionDrillType.value = null
  monitorDetailMode.value = module === 'monitor' ? monitorTab.value : 'device'
  detailModalVisible.value = true
}

function switchMonitorDetail(mode: 'device' | 'alarm') {
  monitorDetailMode.value = mode
  detailTab.value = 'road'
  monitorBridgeDrillDown.value = false
}

function onDetailTabChange() {
  detectionDrillType.value = null
  monitorBridgeDrillDown.value = false
}

// 图表引用
const roadChartRef = ref<HTMLElement>()
const bridgeChartRef = ref<HTMLElement>()
const tunnelChartRef = ref<HTMLElement>()

const roadDeviceChartRef = ref<HTMLElement>()
const bridgeDeviceChartRef = ref<HTMLElement>()
const tunnelDeviceChartRef = ref<HTMLElement>()
const bridgeDeviceDrillChartRef = ref<HTMLElement>()
const bridgeDeviceDrillDown = ref(false)
let bridgeDeviceChart: echarts.ECharts | null = null
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
        barMaxWidth: 40,
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
      data: ['即将超期\n(不足30天)', '超期未检'],
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

// 桥梁结构监测设备下钻 - 初始化子级图表
function initBridgeDrillDownChart() {
  const container = bridgeDeviceDrillChartRef.value
  if (!container) return
  const chart = echarts.init(container)
  // 清除旧图表，避免内存泄漏
  charts.push(chart)
  const categories = ['吊杆索力\n振动', '位移', '挠度', '应变', '振动']
  const values = [86, 124, 98, 156, 132]
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '4%', right: '8%', bottom: '15%', top: '12%', containLabel: true },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 11, interval: 0, color: 'rgba(0,0,0,0.65)' },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#e8e8e8' } },
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
    series: [
      {
        type: 'bar',
        data: values.map(v => ({ value: v, itemStyle: { color: '#13c2c2' } })),
        barMaxWidth: 36,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
        label: { show: true, position: 'top', fontSize: 11, fontWeight: 'bold', formatter: '{c}' },
      },
    ],
  }
  chart.setOption(option)
}

// 退出桥梁结构监测下钻
function exitBridgeDrillDown() {
  bridgeDeviceDrillDown.value = false
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
  const arr = citiesArr.value
  const baseMap: Record<string, number[]> = {
    '道路': [1256, 340, 285, 198, 156, 210, 178, 145, 167, 124, 95],
    '桥梁': [3908, 682, 452, 371, 285, 310, 268, 195, 246, 178, 142],
    '隧道': [892, 156, 108, 87, 65, 72, 58, 45, 67, 52, 38],
  }
  const projectIdx = projectOptionsMap[scene]?.indexOf(project) ?? 0
  const yearOffset = year - currentYear + 2
  const base = baseMap[scene] || baseMap['道路']
  if (!city.value) {
    return arr.map((c, i) => {
      const total = base[i]
      const checkCount = Math.max(1, Math.round(total / (30 + i * 5) + yearOffset * 3 + projectIdx * 2))
      const rateBase = 72 + projectIdx * 5 - (i % 5) * 3 - (2 - yearOffset) * 4
      const completionRate = Math.min(99.5, Math.max(60, rateBase + (i * 1.7 % 8)))
      const foundIssues = Math.max(0, Math.round(checkCount * 0.6 + i * 3 + projectIdx * 5))
      const fixedIssues = Math.round(foundIssues * completionRate / 100)
      return { key: String(i + 1), city: c, sceneTotal: total, checkCount, completionRate: completionRate.toFixed(1) + '%', foundIssues, unfixedIssues: Math.max(0, foundIssues - fixedIssues), fixRate: foundIssues > 0 ? ((fixedIssues / foundIssues) * 100).toFixed(1) + '%' : '0.0%' }
    })
  }
  const sceneSalt = scene === '道路' ? 110 : scene === '桥梁' ? 120 : 130
  return arr.map((c, i) => {
    const total = hR(c, sceneSalt, 20, 400)
    const checkCount = hR(c, sceneSalt + 1 + yearOffset, 3, Math.max(4, total / 8 | 0))
    const completionRate = (hR(c, sceneSalt + 2 + projectIdx, 700, 990) * 0.1).toFixed(1)
    const foundIssues = hR(c, sceneSalt + 3, 2, Math.max(3, checkCount * 3))
    const fixedIssues = Math.round(foundIssues * +completionRate / 100)
    return { key: String(i + 1), city: c, sceneTotal: total, checkCount, completionRate: completionRate + '%', foundIssues, unfixedIssues: Math.max(0, foundIssues - fixedIssues), fixRate: foundIssues > 0 ? ((fixedIssues / foundIssues) * 100).toFixed(1) + '%' : '0.0%' }
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
  const arr = citiesArr.value
  const baseMap: Record<string, number[]> = {
    '道路': [1256, 340, 285, 198, 156, 210, 178, 145, 167, 124, 95],
    '桥梁': [3908, 682, 452, 371, 285, 310, 268, 195, 246, 178, 142],
    '隧道': [892, 156, 108, 87, 65, 72, 58, 45, 67, 52, 38],
  }
  const yearOffset = year - currentYear + 2
  const base = baseMap[scene] || baseMap['道路']
  if (!city.value) {
    return arr.map((c, i) => {
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
      return { key: String(i + 1), city: c, pubCompanies, doneCompanies, pubTasks, doneTasks, taskRate, foundSceneIssues, foundTotal, unfixed, fixRate }
    })
  }
  const sceneSalt = scene === '道路' ? 140 : scene === '桥梁' ? 150 : 160
  return arr.map((c, i) => {
    const pubCompanies = hR(c, sceneSalt, 3, 30)
    const doneCompanies = hR(c, sceneSalt + 1, 1, pubCompanies)
    const pubTasks = hR(c, sceneSalt + 2, 5, 60)
    const doneTasks = hR(c, sceneSalt + 3, 2, pubTasks)
    const taskRate = pubTasks > 0 ? ((doneTasks / pubTasks) * 100).toFixed(1) + '%' : '0.0%'
    const foundSceneIssues = hR(c, sceneSalt + 4, 2, Math.max(3, pubTasks))
    const foundTotal = Math.round(foundSceneIssues * 1.3 + i)
    const unfixed = Math.max(0, Math.round(foundTotal * (0.1 + hR(c, sceneSalt + 5, 0, 15) * 0.01)))
    const fixed = foundTotal - unfixed
    const fixRate = foundTotal > 0 ? ((fixed / foundTotal) * 100).toFixed(1) + '%' : '0.0%'
    return { key: String(i + 1), city: c, pubCompanies, doneCompanies, pubTasks, doneTasks, taskRate, foundSceneIssues, foundTotal, unfixed, fixRate }
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
    { name: '城市道路隧道', value: 308 },
    { name: '人行地道', value: 128 },
  ]
  
  initBarChart(roadChartRef.value, '道路统计', roadData, '#1677ff', true)
  initBarChart(bridgeChartRef.value, '桥梁数量', bridgeData, '#13c2c2')
  initBarChart(tunnelChartRef.value, '隧道数量', tunnelData, '#722ed1')

  // 监测模块 - 设备统计柱状图（分三类与面板对齐）
  initDeviceSubChart(roadDeviceChartRef.value, ['道路边坡\n监测设备'], [486], '#1677ff')
  bridgeDeviceChart = initDeviceSubChart(bridgeDeviceChartRef.value, ['桥梁环境\n监测设备', '桥梁作用\n监测设备', '桥梁结构\n监测设备'], [386, 452, 397], '#13c2c2') || null
  // 桥梁设备图表点击事件 - 点击“桥梁结构监测设备”进入下钻
  if (bridgeDeviceChart) {
    bridgeDeviceChart.on('click', (params: any) => {
      if (params.name && params.name.includes('桥梁结构')) {
        bridgeDeviceDrillDown.value = true
        nextTick(() => {
          initBridgeDrillDownChart()
        })
      }
    })
  }
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

.global-filter {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  flex-shrink: 0;
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
  flex: 1;
  min-height: 220px;
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

  & + .summary-box-grid {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px dashed rgba(0, 0, 0, 0.08);
  }
}

.summary-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 56px;
  gap: 1px;
}

.s-label {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
  text-align: center;
  white-space: nowrap;
  line-height: 1.2;
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

.bridge-device-chart-wrapper {
  display: flex;
  flex-direction: column;
}

.device-sub-chart-inner {
  flex: 1;
  min-height: 0;
  width: 100%;
}

.drill-down-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  flex-shrink: 0;

  .drill-down-title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
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

// 查看详情弹窗
.detail-modal {
  .ant-modal-body {
    padding: 16px 24px;
  }
}

.detail-tabs {
  .ant-tabs-nav {
    margin-bottom: 16px;
  }
}
.monitor-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 10px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
  .monitor-detail-title {
    font-size: 15px;
    font-weight: 600;
    color: #1f1f1f;
  }
}
</style>
