<template>
  <div class="cockpit-page">
    <!-- 顶部子导航 -->
    <div class="cockpit-header">
      <div class="cockpit-tabs">
        <div class="cockpit-tab" :class="{ active: cockpitTab === 'overview' }" @click="cockpitTab = 'overview'">总体态势</div>
        <div class="cockpit-tab" :class="{ active: cockpitTab === 'monitor' }" @click="cockpitTab = 'monitor'">在线监测</div>
      </div>
      <div class="cockpit-title">浙江城市道桥隧安全运行监管</div>
      <div class="cockpit-nav">
        <span class="nav-link">运维管理</span>
        <span class="nav-link">应急处置</span>
        <span class="nav-link">在建项目</span>
        <span class="nav-link" @click="handleGoToDashboard">工作台</span>
      </div>
    </div>

    <!-- 总体态势主体内容区 -->
    <div class="cockpit-body" v-show="cockpitTab === 'overview'">
      <!-- 左侧面板 -->
      <div class="panel panel-left">
        <!-- 统计卡片 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">{{ layerNameMap[activeLayer] }}统计</div>
            <span class="map-btn active" @click="showFacilityModal = true">查看详情</span>
          </div>
          <!-- 道路统计 -->
          <template v-if="activeLayer === 'road'">
            <div class="road-stats">
              <div class="stat-grid">
                <div class="stat-block">
                  <div class="stat-label">道路总长</div>
                  <div class="stat-value blue">1,256.8<span class="stat-unit"> km</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">道路总面积</div>
                  <div class="stat-value cyan">856.3<span class="stat-unit"> km²</span></div>
                </div>
              </div>
              <div class="stat-grid">
                <div class="stat-block">
                  <div class="stat-label">建成区面积</div>
                  <div class="stat-value green">412.5<span class="stat-unit"> km²</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">路网密度</div>
                  <div class="stat-value yellow">1.52<span class="stat-unit"> km/km²</span></div>
                </div>
              </div>
              <div class="stat-block sub">
                <div class="stat-label">道路面积率</div>
                <div class="stat-value orange">18.5<span class="stat-unit"> %</span></div>
              </div>
            </div>
            <div class="road-detail">
              <div ref="statsChartRef" class="chart-small"></div>
              <div class="road-categories">
                <div class="cat-item" v-for="c in roadCategories" :key="c.name">
                  <span class="cat-dot" :style="{ background: c.color }"></span>
                  <span class="cat-name">{{ c.name }}</span>
                  <span class="cat-val">{{ c.value }}</span>
                </div>
              </div>
            </div>
          </template>
          <!-- 桥梁统计 -->
          <template v-else-if="activeLayer === 'bridge'">
            <div class="road-stats">
              <div class="stat-grid">
                <div class="stat-block">
                  <div class="stat-label">城市桥梁总数</div>
                  <div class="stat-value blue">3,908<span class="stat-unit"> 座</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">涉航桥梁总数</div>
                  <div class="stat-value cyan">1,024<span class="stat-unit"> 座</span></div>
                </div>
              </div>
              <div class="stat-block sub">
                <div class="stat-label">30年以上桥龄</div>
                <div class="stat-value green">256<span class="stat-unit"> 座</span></div>
              </div>
            </div>
            <div class="road-detail">
              <div ref="statsChartRef" class="chart-small"></div>
              <div class="road-categories">
                <div class="cat-item" v-for="c in bridgeCategories" :key="c.name">
                  <span class="cat-dot" :style="{ background: c.color }"></span>
                  <span class="cat-name">{{ c.name }}</span>
                  <span class="cat-val">{{ c.value }}</span>
                </div>
              </div>
            </div>
          </template>
          <!-- 隧道统计 -->
          <template v-else>
            <div class="road-stats">
              <div class="stat-grid">
                <div class="stat-block">
                  <div class="stat-label">城市隧道总数</div>
                  <div class="stat-value blue">436<span class="stat-unit"> 座</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">城市道路隧道</div>
                  <div class="stat-value cyan">308<span class="stat-unit"> 座</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">人行地道</div>
                  <div class="stat-value green">128<span class="stat-unit"> 座</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">地下隧道</div>
                  <div class="stat-value yellow">256<span class="stat-unit"> 座</span></div>
                </div>
              </div>
            </div>
            <div class="road-detail">
              <div ref="statsChartRef" class="chart-small"></div>
              <div class="road-categories">
                <div class="cat-item" v-for="c in tunnelCategories" :key="c.name">
                  <span class="cat-dot" :style="{ background: c.color }"></span>
                  <span class="cat-name">{{ c.name }}</span>
                  <span class="cat-val">{{ c.value }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 监测模块 -->
        <div class="card dark-card monitor-module-card">
          <div class="card-title">{{ layerNameMap[activeLayer] }}监测</div>
          <div class="monitor-ring-row">
            <!-- 左侧：在线率 -->
            <div class="ring-group">
              <div class="ring-title">在线率</div>
              <div ref="onlineRingRef" class="ring-chart-lg"></div>
              <div class="ring-group-labels">
                <div class="ring-stat"><span class="rs-val blue">{{ monitorData.total }}</span><span class="rs-lbl">设备总数</span></div>
                <div class="ring-stat"><span class="rs-val green">{{ monitorData.online }}</span><span class="rs-lbl">在线数</span></div>
              </div>
            </div>
            <!-- 右侧：接入率 -->
            <div class="ring-group">
              <div class="ring-title">接入率</div>
              <div ref="accessRingRef" class="ring-chart-lg"></div>
              <div class="ring-group-labels">
                <div class="ring-stat"><span class="rs-val orange">{{ monitorData.accessCount }}</span><span class="rs-lbl">接入{{ layerNameMap[activeLayer] }}数</span></div>
              </div>
            </div>
          </div>
          <!-- 子设备柱状图区 -->
          <div class="device-sub-area">
            <div v-if="bridgeDeviceDrillDown" class="drill-down-header">
              <span class="drill-back-btn" @click="bridgeDeviceDrillDown = false">← 返回</span>
              <span class="drill-down-title">桥梁结构监测设备详情</span>
            </div>
            <div v-show="!bridgeDeviceDrillDown" ref="deviceSubChartRef" class="device-sub-chart"></div>
            <div v-show="bridgeDeviceDrillDown" ref="bridgeDrillChartRef" class="device-sub-chart"></div>
          </div>
          <!-- 查看详情按钮 -->
          <div class="monitor-detail-footer">
            <a class="monitor-detail-btn" @click="openMonitorDetail">查看详情 &gt;</a>
          </div>
        </div>
      </div>

      <!-- 中间地图区 -->
      <div class="panel panel-center">
        <div class="card dark-card map-card">
          <div class="map-toolbar">
            <div class="map-layer-tabs">
              <span class="layer-tab" :class="{ active: activeLayer === 'road' }" @click="activeLayer = 'road'">道路</span>
              <span class="layer-tab" :class="{ active: activeLayer === 'bridge' }" @click="activeLayer = 'bridge'">桥梁</span>
              <span class="layer-tab" :class="{ active: activeLayer === 'tunnel' }" @click="activeLayer = 'tunnel'">隧道</span>
            </div>
            <div class="map-type-toggle" @click="toggleMapType">
              <span :class="{ active: mapStyle === 'standard' }">标准地图</span>
              <span :class="{ active: mapStyle === 'satellite' }">卫星地图</span>
            </div>
            <div class="map-selector" @click="showCityDropdown = !showCityDropdown">
              <span class="selector-text">{{ currentCity }}</span>
              <span class="selector-arrow" :class="{ open: showCityDropdown }">&#9662;</span>
              <div class="city-dropdown" v-show="showCityDropdown" @click.stop>
                <div class="dropdown-item" :class="{ active: currentCity === '浙江省' }" @click="selectCity('浙江省')">浙江省</div>
                <div class="dropdown-item" v-for="city in cityList" :key="city" :class="{ active: currentCity === city }" @click="selectCity(city)">
                  {{ city }}
                </div>
              </div>
            </div>
          </div>
          <div class="map-area">
            <div ref="overviewMapRef" class="amap-container"></div>
          </div>
          <!-- 底部图例控制面板 -->
          <div class="map-legend">
            <!-- 左侧：图例项（带复选框） -->
            <div class="legend-checkbox-panel">
              <template v-if="subLayer === 'type'">
                <label class="checkbox-item" v-for="rt in currentTypeLegend" :key="rt.key">
                  <span class="custom-checkbox" :class="{ checked: (currentTypeChecked as any)[rt.key] }" @click="(currentTypeChecked as any)[rt.key] = !(currentTypeChecked as any)[rt.key]">
                    <svg v-if="(currentTypeChecked as any)[rt.key]" viewBox="0 0 12 12" class="check-icon"><path d="M2,6 L5,9 L10,3" stroke="#5b8ff9" stroke-width="2" fill="none"/></svg>
                  </span>
                  <span class="legend-line" :style="{ background: rt.color }"></span>
                  <span class="checkbox-label">{{ rt.name }}</span>
                </label>
              </template>
              <template v-else>
                <label class="checkbox-item" v-for="re in currentEvalLegend" :key="re.key">
                  <span class="custom-checkbox" :class="{ checked: (currentEvalChecked as any)[re.key] }" @click="(currentEvalChecked as any)[re.key] = !(currentEvalChecked as any)[re.key]">
                    <svg v-if="(currentEvalChecked as any)[re.key]" viewBox="0 0 12 12" class="check-icon"><path d="M2,6 L5,9 L10,3" stroke="#5b8ff9" stroke-width="2" fill="none"/></svg>
                  </span>
                  <span class="legend-line" :style="{ background: re.color }"></span>
                  <span class="checkbox-label">{{ re.name }}</span>
                </label>
              </template>
            </div>
            <!-- 右侧：子图层 -->
            <div class="legend-control-panel">
              <div class="sub-layer-btns">
                <span class="radio-item" :class="{ selected: subLayer === 'type' }" @click="subLayer = 'type'"><span class="radio-dot"></span>{{ layerNameMap[activeLayer] }}类型</span>
                <span class="radio-item" :class="{ selected: subLayer === 'eval' }" @click="subLayer = 'eval'"><span class="radio-dot"></span>{{ layerNameMap[activeLayer] }}评价</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel panel-right">
        <!-- 任务清单 -->
        <div class="card dark-card">
          <div class="card-title">{{ layerNameMap[activeLayer] }}任务清单</div>
          <div class="task-list-v2">
            <!-- 隐患排查 -->
            <div class="task-card">
              <div class="task-card-title">隐患排查</div>
              <div class="task-card-row">
                <div class="task-mini-stats">
                  <div class="tms-item"><span class="tms-val blue">999</span><span class="tms-lbl">排查总数</span></div>
                  <div class="tms-item"><span class="tms-val green">200</span><span class="tms-lbl">排查已完成</span></div>
                </div>
                <div class="task-ring-wrap">
                  <div class="task-ring-title">完成率</div>
                  <div ref="hazardRateRef" class="task-ring"></div>
                </div>
              </div>
            </div>
            <!-- 检测任务 -->
            <div class="task-card">
              <div class="task-card-title">检测任务</div>
              <div class="task-card-row">
                <div class="task-mini-stats">
                  <div class="tms-item"><span class="tms-val blue">200</span><span class="tms-lbl">应检{{ layerNameMap[activeLayer] }}</span></div>
                  <div class="tms-item"><span class="tms-val green">40</span><span class="tms-lbl">已检{{ layerNameMap[activeLayer] }}</span></div>
                </div>
                <div class="task-ring-wrap">
                  <div class="task-ring-title">完成率</div>
                  <div ref="inspectRateRef" class="task-ring"></div>
                </div>
              </div>
              <div ref="inspectBarRef" class="task-bar-chart"></div>
            </div>
            <!-- 安全评估 -->
            <div class="task-card">
              <div class="task-card-title">安全评估</div>
              <div class="task-card-row">
                <div class="task-mini-stats">
                  <div class="tms-item"><span class="tms-val blue">999</span><span class="tms-lbl">评估总数</span></div>
                  <div class="tms-item"><span class="tms-val green">200</span><span class="tms-lbl">评估已完成</span></div>
                </div>
                <div class="task-ring-wrap">
                  <div class="task-ring-title">完成率</div>
                  <div ref="assessRateRef" class="task-ring"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 风险清单 -->
        <div class="card dark-card risk-card">
          <div class="card-title-row">
            <div class="card-title">{{ layerNameMap[activeLayer] }}风险清单</div>
            <div class="risk-type-tabs">
              <span v-for="rt in riskTypes" :key="rt.value"
                class="risk-type-tab" :class="{ active: riskType === rt.value }"
                @click="riskType = rt.value">{{ rt.label }}</span>
            </div>
          </div>
          <template v-if="riskType === 'device'">
            <div class="risk-section">
              <div ref="riskChartRef" class="chart-medium"></div>
              <div class="risk-legend">
                <span v-for="r in riskCategories" :key="r.name" class="legend-item">
                  <span class="legend-dot" :style="{ background: r.color }"></span>{{ r.name }}
                </span>
              </div>
            </div>
            <div class="risk-metrics">
              <div class="risk-item">
                <div class="risk-num orange">168</div>
                <div class="risk-label">风险总数</div>
              </div>
              <div class="risk-item">
                <div class="risk-num green">124</div>
                <div class="risk-label">已整改风险</div>
              </div>
              <div class="risk-item">
                <div class="risk-num cyan">73.8%</div>
                <div class="risk-label">整改率</div>
              </div>
            </div>
            <div class="risk-alert-list">
              <div class="risk-alert-header">
                <span class="ra-col-area">所属区域</span>
                <span class="ra-col-name">{{ layerNameMap[activeLayer] }}名称</span>
                <span class="ra-col-point">点位名称</span>
                <span class="ra-col-item">监测项</span>
                <span class="ra-col-level">预警等级</span>
                <span class="ra-col-status">处置状态</span>
              </div>
              <div class="risk-alert-body">
                <div v-for="alert in alertList" :key="alert.id" class="risk-alert-row">
                  <span class="ra-col-area">{{ alert.area }}</span>
                  <span class="ra-col-name">{{ alert.road }}</span>
                  <span class="ra-col-point">{{ alert.point }}</span>
                  <span class="ra-col-item">{{ alert.item }}</span>
                  <span class="ra-col-level">
                    <span :class="'alert-tag-' + alert.level">{{ alertLevelText(alert.level) }}</span>
                  </span>
                  <span class="ra-col-status">
                    <span :class="alert.done ? 'status-done' : 'status-undone'">{{ alert.done ? '已完成' : '未完成' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="riskType === 'hidden'">
            <div class="risk-section">
              <div ref="hiddenRiskChartRef" class="chart-medium"></div>
              <div class="risk-legend">
                <span v-for="r in hiddenRiskCategories" :key="r.name" class="legend-item">
                  <span class="legend-dot" :style="{ background: r.color }"></span>{{ r.name }}
                </span>
              </div>
            </div>
            <div class="risk-metrics">
              <div class="risk-item"><div class="risk-num orange">96</div><div class="risk-label">隐患总数</div></div>
              <div class="risk-item"><div class="risk-num green">72</div><div class="risk-label">已整改</div></div>
              <div class="risk-item"><div class="risk-num cyan">75.0%</div><div class="risk-label">整改率</div></div>
            </div>
            <div class="risk-alert-list">
              <div class="risk-alert-header">
                <span class="ra-col-area">所属区域</span>
                <span class="ra-col-name">{{ layerNameMap[activeLayer] }}名称</span>
                <span class="ra-col-project">检查项目</span>
                <span class="ra-col-content">上报内容</span>
                <span class="ra-col-level">隐患等级</span>
                <span class="ra-col-status">整改状态</span>
              </div>
              <div class="risk-alert-body">
                <div v-for="item in hiddenDangerList" :key="item.id" class="risk-alert-row">
                  <span class="ra-col-area">{{ item.area }}</span>
                  <span class="ra-col-name">{{ item.road }}</span>
                  <span class="ra-col-project">{{ item.project }}</span>
                  <span class="ra-col-content">{{ item.content }}</span>
                  <span class="ra-col-level">
                    <span :class="'hidden-tag-' + item.level">{{ hiddenLevelText(item.level) }}</span>
                  </span>
                  <span class="ra-col-status">
                    <span :class="item.fixed ? 'status-done' : 'status-undone'">{{ item.fixed ? '已整改' : '待整改' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="riskType === 'inspect'">
            <div class="risk-metrics" style="flex-wrap: wrap;">
              <template v-for="m in inspectMetrics" :key="m.label" class="risk-item">
                <div class="risk-item"><div :class="['risk-num', m.colorClass]">{{ m.value }}</div><div class="risk-label">{{ m.label }}</div></div>
              </template>
            </div>
            <div class="risk-alert-list">
              <div class="risk-alert-header">
                <span class="ra-col-area">所属区域</span>
                <span class="ra-col-name">{{ layerNameMap[activeLayer] }}名称</span>
                <span class="ra-col-grade">综合评价等级</span>
                <span class="ra-col-rectype">整改类型</span>
                <span class="ra-col-status">整改状态</span>
              </div>
              <div class="risk-alert-body">
                <div v-for="item in inspectList" :key="item.id" class="risk-alert-row">
                  <span class="ra-col-area">{{ item.area }}</span>
                  <span class="ra-col-name">{{ item.road }}</span>
                  <span class="ra-col-grade">
                    <span :class="'grade-tag-' + item.grade">{{ item.grade }}</span>
                  </span>
                  <span class="ra-col-rectype">{{ item.rectype }}</span>
                  <span class="ra-col-status">
                    <span :class="item.done ? 'status-done' : 'status-undone'">{{ item.done ? '已完成' : '未完成' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="riskType === 'assess'">
            <div class="risk-section">
              <div ref="assessChartRef" class="chart-medium"></div>
              <div class="risk-legend">
                <span v-for="r in assessCategories" :key="r.name" class="legend-item">
                  <span class="legend-dot" :style="{ background: r.color }"></span>{{ r.name }}
                </span>
              </div>
            </div>
            <div class="risk-metrics">
              <div class="risk-item"><div class="risk-num orange">86</div><div class="risk-label">隐患总数</div></div>
              <div class="risk-item"><div class="risk-num green">64</div><div class="risk-label">已整改</div></div>
              <div class="risk-item"><div class="risk-num cyan">74.4%</div><div class="risk-label">整改率</div></div>
            </div>
            <div class="risk-alert-list">
              <div class="risk-alert-header">
                <span class="ra-col-area">所属区域</span>
                <span class="ra-col-name">{{ layerNameMap[activeLayer] }}名称</span>
                <span class="ra-col-project">评估项目</span>
                <span class="ra-col-entity">评估主体</span>
                <span class="ra-col-level">隐患等级</span>
                <span class="ra-col-status">整改状态</span>
              </div>
              <div class="risk-alert-body">
                <div v-for="item in assessList" :key="item.id" class="risk-alert-row">
                  <span class="ra-col-area">{{ item.area }}</span>
                  <span class="ra-col-name">{{ item.road }}</span>
                  <span class="ra-col-project">{{ item.project }}</span>
                  <span class="ra-col-entity">{{ item.entity }}</span>
                  <span class="ra-col-level">
                    <span :class="'hidden-tag-' + item.level">{{ assessLevelText(item.level) }}</span>
                  </span>
                  <span class="ra-col-status">
                    <span :class="item.fixed ? 'status-done' : 'status-undone'">{{ item.fixed ? '已整改' : '待整改' }}</span>
                  </span>
                </div>
              </div>
            </div>
          </template>
          <div class="risk-detail-btn-wrap">
            <span class="risk-detail-btn" @click="openRiskDetailModal">查看详情 &gt;</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 在线监测主体内容区 -->
    <div class="cockpit-body monitor-body" v-show="cockpitTab === 'monitor'">
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
                  <th>市区县</th>
                  <th style="width:36px">序号</th>
                  <th>设施名称</th>
                  <th>设备名称</th>
                  <th>监测项</th>
                  <th>在线状态</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="d in monitorDevices" :key="d.key">
                  <td>{{ d.district }}</td>
                  <td>{{ d.key }}</td>
                  <td>{{ d.name }}</td>
                  <td>{{ d.name }}{{ deviceSuffix }}</td>
                  <td>{{ monitorItemLabel }}</td>
                  <td><span class="online-tag" :class="d.online === '在线' ? 'online' : 'offline'">{{ d.online }}</span></td>
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
            <div class="map-layer-tabs">
              <span class="layer-tab" :class="{ active: monitorLayer === 'bridge' }" @click="monitorLayer = 'bridge'">桥梁</span>
              <span class="layer-tab" :class="{ active: monitorLayer === 'road' }" @click="monitorLayer = 'road'">道路</span>
              <span class="layer-tab" :class="{ active: monitorLayer === 'tunnel' }" @click="monitorLayer = 'tunnel'">隧道</span>
            </div>
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
          <!-- 道路图层指标模块 -->
          <div v-if="monitorLayer === 'road'" class="bridge-monitor-stats">
            <div class="bridge-stats-card">
              <div class="bridge-stats-grid">
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">设备总数</div>
                  <div class="bridge-stat-value blue">2,865<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">在线数</div>
                  <div class="bridge-stat-value cyan">2,706<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">在线率</div>
                  <div class="bridge-stat-value green">94.5%</div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入道路数</div>
                  <div class="bridge-stat-value blue">2,288<span class="bridge-stat-unit"> 条</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入率</div>
                  <div class="bridge-stat-value cyan">84.3%</div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">道路边坡监测设备</div>
                  <div class="bridge-stat-value blue">2,865<span class="bridge-stat-unit"> 台</span></div>
                </div>
              </div>
              <div class="bridge-stats-footer">
                <a class="bridge-detail-btn" @click="showRoadDeviceDetail = true">查看详情 &gt;</a>
              </div>
            </div>
          </div>
          <!-- 桥梁图层指标模块 -->
          <div v-if="monitorLayer === 'bridge'" class="bridge-monitor-stats">
            <div class="bridge-stats-card">
              <div class="bridge-stats-grid">
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">设备总数</div>
                  <div class="bridge-stat-value blue">1,286<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">在线数</div>
                  <div class="bridge-stat-value cyan">1,158<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">在线率</div>
                  <div class="bridge-stat-value green">90.0%</div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入桥梁数</div>
                  <div class="bridge-stat-value blue">856<span class="bridge-stat-unit"> 座</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入率</div>
                  <div class="bridge-stat-value cyan">21.9%</div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">桥梁环境监测设备</div>
                  <div class="bridge-stat-value blue">428<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">桥梁作业监测设备</div>
                  <div class="bridge-stat-value cyan">386<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">桥梁结构监测设备</div>
                  <div class="bridge-stat-value green">472<span class="bridge-stat-unit"> 台</span></div>
                </div>
              </div>
              <div class="bridge-stats-footer">
                <a class="bridge-detail-btn" @click="showBridgeDeviceDetail = true">查看详情 &gt;</a>
              </div>
            </div>
          </div>
          <!-- 隧道图层指标模块 -->
          <div v-if="monitorLayer === 'tunnel'" class="bridge-monitor-stats">
            <div class="bridge-stats-card">
              <div class="bridge-stats-grid">
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">设备总数</div>
                  <div class="bridge-stat-value blue">3,248<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">在线数</div>
                  <div class="bridge-stat-value cyan">3,142<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">在线率</div>
                  <div class="bridge-stat-value green">96.7%</div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入隧道数</div>
                  <div class="bridge-stat-value blue">2,356<span class="bridge-stat-unit"> 座</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">接入率</div>
                  <div class="bridge-stat-value cyan">72.5%</div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">隧道环境监测设备</div>
                  <div class="bridge-stat-value blue">1,128<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">隧道机电监测设备</div>
                  <div class="bridge-stat-value cyan">1,234<span class="bridge-stat-unit"> 台</span></div>
                </div>
                <div class="bridge-stat-item">
                  <div class="bridge-stat-label">隧道结构监测设备</div>
                  <div class="bridge-stat-value green">886<span class="bridge-stat-unit"> 台</span></div>
                </div>
              </div>
              <div class="bridge-stats-footer">
                <a class="bridge-detail-btn" @click="showTunnelDeviceDetail = true">查看详情 &gt;</a>
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
            <div class="card-title">今日最高超限</div>
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

    <!-- 市级数据弹窗 -->
    <a-modal
      v-model:open="showFacilityModal"
      :title="`${layerNameMap[activeLayer]}市级数据`"
      width="960px"
      :footer="null"
      class="facility-modal"
    >
      <a-table :columns="facilityColumns[activeLayer]" :data-source="facilityData[activeLayer]" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 风险清单-隐患排查详情弹窗 -->
    <a-modal v-model:open="riskDetail.hidden" :title="'隐患排查详情'" width="1100px" :footer="null" class="risk-detail-modal">
      <a-table :columns="riskDetailColumns.hidden" :data-source="riskDetailPageData.hidden" :pagination="{ current: riskDetailPage.hidden, pageSize: 10, total: riskDetailData.hidden.length, showTotal: (t: number) => `共${t}条`, onChange: (p: number) => { riskDetailPage.hidden = p } }" size="small" bordered />
    </a-modal>

    <!-- 风险清单-设备监测详情弹窗 -->
    <a-modal v-model:open="riskDetail.device" :title="'设备监测详情'" width="1200px" :footer="null" class="risk-detail-modal">
      <a-table :columns="riskDetailColumns.device" :data-source="riskDetailPageData.device" :pagination="{ current: riskDetailPage.device, pageSize: 10, total: riskDetailData.device.length, showTotal: (t: number) => `共${t}条`, onChange: (p: number) => { riskDetailPage.device = p } }" size="small" bordered />
    </a-modal>

    <!-- 风险清单-设施检测详情弹窗 -->
    <a-modal v-model:open="riskDetail.inspect" :title="'设施检测详情'" width="1200px" :footer="null" class="risk-detail-modal">
      <a-table :columns="riskDetailColumns.inspect" :data-source="riskDetailPageData.inspect" :pagination="{ current: riskDetailPage.inspect, pageSize: 10, total: riskDetailData.inspect.length, showTotal: (t: number) => `共${t}条`, onChange: (p: number) => { riskDetailPage.inspect = p } }" size="small" bordered />
    </a-modal>

    <!-- 风险清单-安全评估详情弹窗 -->
    <a-modal v-model:open="riskDetail.assess" :title="'安全评估详情'" width="1200px" :footer="null" class="risk-detail-modal">
      <a-table :columns="riskDetailColumns.assess" :data-source="riskDetailPageData.assess" :pagination="{ current: riskDetailPage.assess, pageSize: 10, total: riskDetailData.assess.length, showTotal: (t: number) => `共${t}条`, onChange: (p: number) => { riskDetailPage.assess = p } }" size="small" bordered />
    </a-modal>
    <a-modal v-model:open="showDeviceDetailModal" title="设备列表" width="1200px" :footer="null" class="device-detail-modal">
      <div class="modal-filter-bar">
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

    <!-- 预警详情弹窗 -->
    <a-modal v-model:open="showAlarmDetailModal" title="预警详情" width="1200px" :footer="null" class="alarm-detail-modal">
      <div class="modal-filter-bar">
        <div class="filter-item">
          <span class="filter-label">市区县</span>
          <select class="filter-select"><option>请选择</option></select>
        </div>
        <div class="filter-item">
          <span class="filter-label">设施名称</span>
          <input class="filter-input" placeholder="请输入" />
        </div>
        <button class="filter-btn">查询</button>
      </div>
      <a-table :columns="alarmDetailColumns" :data-source="alarmDetailData" :pagination="{ pageSize: 20 }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal as AModal, Table as ATable } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

const statsChartRef = ref<HTMLElement | null>(null)
const riskChartRef = ref<HTMLElement | null>(null)
let statsChart: echarts.ECharts | null = null
let riskChart: echarts.ECharts | null = null

// 监测模块图表引用
const onlineRingRef = ref<HTMLElement | null>(null)
const accessRingRef = ref<HTMLElement | null>(null)
const deviceSubChartRef = ref<HTMLElement | null>(null)
const bridgeDrillChartRef = ref<HTMLElement | null>(null)
let onlineRingChart: echarts.ECharts | null = null
let accessRingChart: echarts.ECharts | null = null
let deviceSubChart: echarts.ECharts | null = null
let bridgeDrillChart: echarts.ECharts | null = null
const bridgeDeviceDrillDown = ref(false)

// 任务清单图表引用
const hazardRateRef = ref<HTMLElement | null>(null)
const inspectRateRef = ref<HTMLElement | null>(null)
const assessRateRef = ref<HTMLElement | null>(null)
const inspectBarRef = ref<HTMLElement | null>(null)
let hazardRateChart: echarts.ECharts | null = null
let inspectRateChart: echarts.ECharts | null = null
let assessRateChart: echarts.ECharts | null = null
let inspectBarChart: echarts.ECharts | null = null

const activeLayer = ref<'road' | 'bridge' | 'tunnel'>('road')
const subLayer = ref<'type' | 'eval'>('type')
const cockpitTab = ref<'overview' | 'monitor'>('overview')

// 高德地图
const overviewMapRef = ref<HTMLElement | null>(null)
const monitorMapRef = ref<HTMLElement | null>(null)
const mapStyle = ref<'standard' | 'satellite'>('standard')
let overviewMap: any = null
let monitorMap: any = null
let monitorMapOverlays: any[] = []
let monitorMapInfoWindow: any = null
const zjCenter: [number, number] = [120.15, 30.27]
const cityCoords: Record<string, [number, number]> = {
  '浙江省': [120.15, 30.27], '杭州市': [120.15, 30.27], '宁波市': [121.55, 29.87],
  '温州市': [120.70, 28.00], '绍兴市': [120.58, 30.00], '湖州市': [120.08, 30.87],
  '嘉兴市': [120.76, 30.75], '金华市': [119.65, 29.08], '衢州市': [118.87, 28.94],
  '台州市': [121.42, 28.66], '丽水市': [119.92, 28.47], '舟山市': [122.11, 30.02],
}

// 设施点位数据（高德地图坐标）
interface FacilityPoint { name: string; path: [number, number][]; color: string; info: Record<string, string> }
const roadFacilities: FacilityPoint[] = [
  { name: '石贯子巷', path: [[120.147, 30.254], [120.152, 30.256], [120.157, 30.254], [120.162, 30.255]], color: '#f6bd16', info: { '归属地区': '杭州市上城区', '道路名称': '石贯子巷（岳王路—中山中路）', '道路等级': '支路', '综合评价等级': 'B' } },
  { name: '复兴大道', path: [[120.185, 30.218], [120.192, 30.221], [120.200, 30.216], [120.210, 30.218]], color: '#5b8ff9', info: { '归属地区': '杭州市滨江区', '道路名称': '复兴大道（秋涛路—复兴路）', '道路等级': '主干路', '综合评价等级': 'A' } },
  { name: '备塘河桥路', path: [[120.105, 30.298], [120.112, 30.300], [120.120, 30.296], [120.130, 30.298]], color: '#5ad8a6', info: { '归属地区': '杭州市上城区', '道路名称': '备塘河桥路（备塘路—艮山西路）', '道路等级': '次干路', '综合评价等级': 'B' } },
  { name: '环城西路', path: [[120.158, 30.270], [120.156, 30.275], [120.159, 30.280], [120.158, 30.285]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '道路名称': '环城西路（天目山路—体育场路）', '道路等级': '城市快速路', '综合评价等级': 'A' } },
  { name: '乌桥路', path: [[120.192, 30.305], [120.197, 30.307], [120.202, 30.303], [120.207, 30.305]], color: '#f6bd16', info: { '归属地区': '杭州市上城区', '道路名称': '乌桥路（新风路—机场路）', '道路等级': '支路', '综合评价等级': 'C' } },
  { name: '拱墅路', path: [[120.132, 30.320], [120.137, 30.322], [120.142, 30.318], [120.147, 30.320]], color: '#5b8ff9', info: { '归属地区': '杭州市拱墅区', '道路名称': '拱墅路（大关路—登云路）', '道路等级': '主干路', '综合评价等级': 'B' } },
]
const bridgeFacilities: FacilityPoint[] = [
  { name: '武林桥', path: [[120.160, 30.265], [120.165, 30.267], [120.170, 30.263], [120.175, 30.265]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '桥梁名称': '武林桥', '桥梁类型': '拱桥', '综合评价等级': 'B' } },
  { name: '复兴大桥', path: [[120.175, 30.215], [120.180, 30.218], [120.185, 30.213], [120.190, 30.215]], color: '#5b8ff9', info: { '归属地区': '杭州市滨江区', '桥梁名称': '复兴大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'A' } },
  { name: '备塘河桥', path: [[120.110, 30.295], [120.115, 30.297], [120.120, 30.293], [120.125, 30.295]], color: '#5ad8a6', info: { '归属地区': '杭州市上城区', '桥梁名称': '备塘河桥', '桥梁类型': '梁桥', '综合评价等级': 'C' } },
  { name: '康家桥', path: [[120.218, 30.282], [120.223, 30.284], [120.228, 30.280], [120.233, 30.282]], color: '#f6bd16', info: { '归属地区': '杭州市上城区', '桥梁名称': '康家桥', '桥梁类型': '立交桥', '综合评价等级': 'B' } },
  { name: '乌桥', path: [[120.190, 30.308], [120.195, 30.310], [120.200, 30.306], [120.205, 30.308]], color: '#e86452', info: { '归属地区': '杭州市上城区', '桥梁名称': '乌桥', '桥梁类型': '拱桥', '综合评价等级': 'D' } },
  { name: '半山桥', path: [[120.135, 30.325], [120.140, 30.327], [120.145, 30.323], [120.150, 30.325]], color: '#5b8ff9', info: { '归属地区': '杭州市拱墅区', '桥梁名称': '半山桥', '桥梁类型': '梁桥', '综合评价等级': 'A' } },
]
const tunnelFacilities: FacilityPoint[] = [
  { name: '紫金港北路下穿道', path: [[120.088, 30.310], [120.093, 30.312], [120.098, 30.308], [120.103, 30.310]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '隧道名称': '紫金港北路下穿道', '隧道类型': '人行地道', '综合评价等级': 'B' } },
  { name: '苏嘉路下穿道', path: [[120.128, 30.318], [120.133, 30.320], [120.138, 30.316], [120.143, 30.318]], color: '#5b8ff9', info: { '归属地区': '杭州市上城区', '隧道名称': '苏嘉路下穿道', '隧道类型': '城市道路隧道', '是否地下隧道': '否', '综合评价等级': 'E' } },
  { name: '复兴路隧道', path: [[120.172, 30.225], [120.177, 30.227], [120.182, 30.223], [120.187, 30.225]], color: '#5ad8a6', info: { '归属地区': '杭州市滨江区', '隧道名称': '复兴路隧道', '隧道类型': '人行地道', '综合评价等级': 'A' } },
  { name: '环城北路隧道', path: [[120.155, 30.278], [120.160, 30.280], [120.165, 30.276], [120.170, 30.278]], color: '#f6bd16', info: { '归属地区': '杭州市下城区', '隧道名称': '环城北路隧道', '隧道类型': '城市道路隧道', '是否地下隧道': '是', '综合评价等级': 'B' } },
  { name: '半山隧道', path: [[120.140, 30.330], [120.145, 30.332], [120.150, 30.328], [120.155, 30.330]], color: '#e86452', info: { '归属地区': '杭州市拱墅区', '隧道名称': '半山隧道', '隧道类型': '人行地道', '综合评价等级': 'C' } },
  { name: '乌桥路地道', path: [[120.195, 30.300], [120.200, 30.302], [120.205, 30.298], [120.210, 30.300]], color: '#5b8ff9', info: { '归属地区': '杭州市上城区', '隧道名称': '乌桥路地道', '隧道类型': '城市道路隧道', '是否地下隧道': '是', '综合评价等级': 'B' } },
]
let mapOverlays: any[] = []
let mapInfoWindow: any = null

function initOverviewMap() {
  const AMap = (window as any).AMap
  if (!overviewMapRef.value || !AMap) return
  if (overviewMap) overviewMap.destroy()
  const layers: any[] = []
  if (mapStyle.value === 'satellite') {
    layers.push(new AMap.TileLayer.Satellite())
    layers.push(new AMap.TileLayer.RoadNet())
  }
  overviewMap = new AMap.Map(overviewMapRef.value, {
    zoom: 11, center: [120.15, 30.27], layers,
    viewMode: '2D', dragEnable: true, zoomEnable: true,
    mapStyle: 'amap://styles/dark',
  })
  addCityMarkers()
  initMapOverlays()
}

function addCityMarkers() {
  const AMap = (window as any).AMap
  if (!overviewMap || !AMap) return
  const cityList = [
    { name: '杭州', pos: [120.15, 30.27], color: '#5b8ff9' },
    { name: '宁波', pos: [121.55, 29.87], color: '#5ad8a6' },
    { name: '温州', pos: [120.70, 28.00], color: '#f6bd16' },
    { name: '绍兴', pos: [120.58, 30.00], color: '#e86452' },
    { name: '湖州', pos: [120.08, 30.87], color: '#6dc8ec' },
    { name: '嘉兴', pos: [120.76, 30.75], color: '#945fb9' },
    { name: '金华', pos: [119.65, 29.08], color: '#5b8ff9' },
    { name: '衢州', pos: [118.87, 28.94], color: '#5ad8a6' },
    { name: '台州', pos: [121.42, 28.66], color: '#f6bd16' },
    { name: '丽水', pos: [119.92, 28.47], color: '#e86452' },
    { name: '舟山', pos: [122.11, 30.02], color: '#6dc8ec' },
  ]
  cityList.forEach(c => {
    const marker = new AMap.Marker({
      position: c.pos,
      content: `<div style="display:flex;align-items:center;gap:4px;pointer-events:none">
        <div style="width:10px;height:10px;border-radius:50%;background:${c.color};box-shadow:0 0 8px ${c.color}"></div>
        <span style="color:#8ab4f8;font-size:12px;text-shadow:0 1px 3px rgba(0,0,0,0.8)">${c.name}</span>
      </div>`,
      offset: new AMap.Pixel(0, 0),
    })
    overviewMap.add(marker)
  })
}

function initMapOverlays() {
  const AMap = (window as any).AMap
  if (!overviewMap || !AMap) return
  mapOverlays.forEach(o => overviewMap.remove(o))
  mapOverlays = []
  if (mapInfoWindow) { mapInfoWindow.close(); mapInfoWindow = null }
  const facilities = activeLayer.value === 'road' ? roadFacilities
    : activeLayer.value === 'bridge' ? bridgeFacilities : tunnelFacilities
  mapInfoWindow = new AMap.InfoWindow({ isCustom: true, autoMove: true, offset: new AMap.Pixel(0, -10) })
  facilities.forEach((fac, idx) => {
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
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value grade" style="color:${gradeColor(v)}">${v}</span></div>`
        } else {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value">${v}</span></div>`
        }
      }
      html += '</div>'
      mapInfoWindow.setContent(html)
      mapInfoWindow.open(overviewMap, new AMap.LngLat(mid[0], mid[1]))
    })
    overviewMap.add(polyline)
    mapOverlays.push(polyline)
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

function toggleMapType() {
  mapStyle.value = mapStyle.value === 'standard' ? 'satellite' : 'standard'
  initOverviewMap()
  if (cockpitTab.value === 'monitor') initMonitorMap()
}

// 道路图例复选框
const roadTypeChecked = reactive({ main: true, sub: true, branch: true, highway: true })
const roadEvalChecked = reactive({ A: true, B: true, C: true, D: true })
// 桥梁图例复选框
const bridgeTypeChecked = reactive({ extraLarge: true, large: true, overpass: true, viaduct: true, smallMedium: true, other: true })
const bridgeEvalChecked = reactive({ pass: true, fail: true, A: true, B: true, C: true, D: true, E: true })
// 隧道图例复选框
const tunnelTypeChecked = reactive({ cityRoadTunnel: true, pedestrian: true })
const tunnelEvalChecked = reactive({ A: true, B: true, C: true, D: true, E: true })

// 图层名称映射
const layerNameMap: Record<string, string> = { road: '道路', bridge: '桥梁', tunnel: '隧道' }

// 地市选择
const showCityDropdown = ref(false)
const showMonitorCityDropdown = ref(false)
const currentCity = ref('浙江省')
const cityList = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const selectCity = (city: string) => {
  currentCity.value = city
  showCityDropdown.value = false
  if (overviewMap) {
    const coord = cityCoords[city] || zjCenter
    const zoom = city === '浙江省' ? 7 : 11
    overviewMap.setZoomAndCenter(zoom, coord, false, 500)
  }
}

// 市级数据弹窗
const showFacilityModal = ref(false)

// 设备详情弹窗
const showDeviceDetailModal = ref(false)
const deviceDetailColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'area', key: 'area', width: 120 },
  { title: '设施ID', dataIndex: 'facId', key: 'facId', width: 70 },
  { title: '设施名称', dataIndex: 'facName', key: 'facName', width: 120 },
  { title: '设备ID', dataIndex: 'devId', key: 'devId', width: 70 },
  { title: '设备名称', dataIndex: 'devName', key: 'devName', width: 160 },
  { title: '设备类型', dataIndex: 'devType', key: 'devType', width: 90 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 70 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 280 },
  { title: '是否在线', dataIndex: 'isOnline', key: 'isOnline', width: 80 },
  { title: '点位值最新时间', dataIndex: 'lastTime', key: 'lastTime', width: 160 },
  { title: '点位最新值', dataIndex: 'lastValue', key: 'lastValue', width: 100 },
]
const deviceDetailData = computed(() => {
  if (monitorLayer.value === 'road') {
    return [
      { key: 1, facId: '001', facName: '石贯子巷', devId: '001', devName: '石贯子巷变形设备', devType: '变形计', monitorItem: '变形', pointName: 'K0+200·北侧变形·第1段路面中分点', area: '杭州市上城区', isOnline: '在线', lastTime: '2026-5-9 10:40:00', lastValue: -0.52 },
      { key: 2, facId: '002', facName: '复兴大道', devId: '002', devName: '复兴大道变形设备', devType: '变形计', monitorItem: '变形', pointName: 'K1+500·南侧变形·第3段路面中分点', area: '杭州市滨江区', isOnline: '在线', lastTime: '2026-5-9 11:20:00', lastValue: -1.18 },
      { key: 3, facId: '003', facName: '环城西路', devId: '003', devName: '环城西路变形设备', devType: '变形计', monitorItem: '变形', pointName: 'K0+800·东侧变形·第2段路面中分点', area: '杭州市西湖区', isOnline: '离线', lastTime: '2026-5-8 16:30:00', lastValue: 0.34 },
      { key: 4, facId: '004', facName: '拱墅路', devId: '004', devName: '拱墅路变形设备', devType: '变形计', monitorItem: '变形', pointName: 'K2+100·西侧变形·第4段路面中分点', area: '杭州市拱墅区', isOnline: '在线', lastTime: '2026-5-9 09:15:00', lastValue: -0.87 },
      { key: 5, facId: '005', facName: '乌桥路', devId: '005', devName: '乌桥路变形设备', devType: '变形计', monitorItem: '变形', pointName: 'K0+600·北侧变形·第1段路面边线点', area: '杭州市上城区', isOnline: '离线', lastTime: '2026-5-7 14:50:00', lastValue: 1.22 },
    ]
  }
  if (monitorLayer.value === 'tunnel') {
    return [
      { key: 1, facId: '001', facName: '紫金港北路下穿道', devId: '001', devName: '紫金港北路下穿道位移设备', devType: '位移计', monitorItem: '位移', pointName: 'K0+150·北侧位移·第1段拱顶中分点', area: '杭州市西湖区', isOnline: '在线', lastTime: '2026-5-9 10:40:00', lastValue: -2.15 },
      { key: 2, facId: '002', facName: '苏嘉路下穿道', devId: '002', devName: '苏嘉路下穿道位移设备', devType: '位移计', monitorItem: '位移', pointName: 'K0+300·南侧位移·第2段拱腰中分点', area: '杭州市上城区', isOnline: '离线', lastTime: '2026-5-8 15:20:00', lastValue: -3.42 },
      { key: 3, facId: '003', facName: '复兴路隧道', devId: '003', devName: '复兴路隧道位移设备', devType: '位移计', monitorItem: '位移', pointName: 'K1+200·东侧位移·第3段拱顶中分点', area: '杭州市滨江区', isOnline: '在线', lastTime: '2026-5-9 11:10:00', lastValue: 0.78 },
      { key: 4, facId: '004', facName: '环城北路隧道', devId: '004', devName: '环城北路隧道位移设备', devType: '位移计', monitorItem: '位移', pointName: 'K0+900·西侧位移·第2段拱脚中分点', area: '杭州市上城区', isOnline: '在线', lastTime: '2026-5-9 08:45:00', lastValue: -1.56 },
      { key: 5, facId: '005', facName: '半山隧道', devId: '005', devName: '半山隧道位移设备', devType: '位移计', monitorItem: '位移', pointName: 'K2+500·北侧位移·第4段拱顶中分点', area: '杭州市拱墅区', isOnline: '离线', lastTime: '2026-5-7 16:30:00', lastValue: 2.08 },
    ]
  }
  return [
    { key: 1, facId: '001', facName: '沪德立交桥', devId: '001', devName: '沪德立交桥应变设备', devType: '应变计', monitorItem: '应变', pointName: '25-北侧应变·第2跨拱肋截面1/2等分点', area: '绍兴市越城区', isOnline: '在线', lastTime: '2026-5-9 10:40:00', lastValue: -1.07 },
    { key: 2, facId: '002', facName: '复兴大桥', devId: '002', devName: '复兴大桥应变设备', devType: '应变计', monitorItem: '应变', pointName: '18-南侧应变·第1跨拱肋截面1/3等分点', area: '杭州市滨江区', isOnline: '在线', lastTime: '2026-5-9 11:20:00', lastValue: -2.35 },
    { key: 3, facId: '003', facName: '备塘河桥', devId: '003', devName: '备塘河桥倾角设备', devType: '倾角计', monitorItem: '应变', pointName: '12-东侧倾角·第3跨拱肋截面1/2等分点', area: '杭州市上城区', isOnline: '离线', lastTime: '2026-5-8 16:30:00', lastValue: 0.58 },
    { key: 4, facId: '004', facName: '半山桥', devId: '004', devName: '半山桥应变设备', devType: '应变计', monitorItem: '应变', pointName: '8-西侧应变·第2跨拱肋截面1/4等分点', area: '杭州市拱墅区', isOnline: '在线', lastTime: '2026-5-9 09:15:00', lastValue: -3.12 },
    { key: 5, facId: '005', facName: '乌桥', devId: '005', devName: '乌桥挠度设备', devType: '挠度计', monitorItem: '应变', pointName: '15-北侧挠度·第1跨跨中位置', area: '杭州市上城区', isOnline: '离线', lastTime: '2026-5-7 14:50:00', lastValue: 1.86 },
  ]
})

// 预警详情弹窗
const showAlarmDetailModal = ref(false)

// 桥梁设备详情弹窗
const showBridgeDeviceDetail = ref(false)
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
  { key: 3, city: '绍兴市', cable: 46, displacement: 64, deflection: 52, strain: 82, vibration: 70 },
  { key: 4, city: '湖州市', cable: 30, displacement: 42, deflection: 34, strain: 54, vibration: 46 },
  { key: 5, city: '嘉兴市', cable: 40, displacement: 56, deflection: 46, strain: 72, vibration: 62 },
  { key: 6, city: '金华市', cable: 36, displacement: 50, deflection: 40, strain: 64, vibration: 54 },
  { key: 7, city: '衢州市', cable: 26, displacement: 38, deflection: 30, strain: 48, vibration: 40 },
  { key: 8, city: '台州市', cable: 42, displacement: 60, deflection: 48, strain: 76, vibration: 64 },
  { key: 9, city: '丽水市', cable: 20, displacement: 30, deflection: 24, strain: 38, vibration: 32 },
  { key: 10, city: '舟山市', cable: 14, displacement: 20, deflection: 16, strain: 26, vibration: 22 },
])
const bridgeDeviceDetailData = ref([
  { key: 0, city: '杭州市', total: 1235, online: 1131, onlineRate: '91.6%', accessBridge: 986, accessRate: '79.8%', envDevice: 386, loadDevice: 452, structDevice: 397 },
  { key: 1, city: '宁波市', total: 956, online: 876, onlineRate: '91.6%', accessBridge: 762, accessRate: '79.7%', envDevice: 298, loadDevice: 350, structDevice: 308 },
  { key: 2, city: '温州市', total: 876, online: 802, onlineRate: '91.6%', accessBridge: 698, accessRate: '79.7%', envDevice: 274, loadDevice: 320, structDevice: 282 },
  { key: 3, city: '绍兴市', total: 645, online: 590, onlineRate: '91.5%', accessBridge: 514, accessRate: '79.7%', envDevice: 202, loadDevice: 236, structDevice: 207 },
  { key: 4, city: '湖州市', total: 423, online: 386, onlineRate: '91.3%', accessBridge: 336, accessRate: '79.4%', envDevice: 132, loadDevice: 154, structDevice: 137 },
  { key: 5, city: '嘉兴市', total: 567, online: 518, onlineRate: '91.4%', accessBridge: 452, accessRate: '79.7%', envDevice: 178, loadDevice: 208, structDevice: 181 },
  { key: 6, city: '金华市', total: 498, online: 454, onlineRate: '91.2%', accessBridge: 396, accessRate: '79.5%', envDevice: 156, loadDevice: 182, structDevice: 160 },
  { key: 7, city: '衢州市', total: 365, online: 332, onlineRate: '91.0%', accessBridge: 290, accessRate: '79.5%', envDevice: 114, loadDevice: 134, structDevice: 117 },
  { key: 8, city: '台州市', total: 598, online: 546, onlineRate: '91.3%', accessBridge: 476, accessRate: '79.6%', envDevice: 188, loadDevice: 218, structDevice: 192 },
  { key: 9, city: '丽水市', total: 286, online: 260, onlineRate: '90.9%', accessBridge: 228, accessRate: '79.7%', envDevice: 90, loadDevice: 104, structDevice: 92 },
  { key: 10, city: '舟山市', total: 198, online: 180, onlineRate: '90.9%', accessBridge: 158, accessRate: '79.8%', envDevice: 62, loadDevice: 72, structDevice: 64 },
])

// 道路设备详情弹窗
const showRoadDeviceDetail = ref(false)
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
  { key: 3, city: '绍兴市', total: 256, online: 242, onlineRate: '94.5%', accessRoad: 214, accessRate: '83.6%', slopeDevice: 256 },
  { key: 4, city: '湖州市', total: 168, online: 158, onlineRate: '94.0%', accessRoad: 142, accessRate: '84.5%', slopeDevice: 168 },
  { key: 5, city: '嘉兴市', total: 218, online: 206, onlineRate: '94.5%', accessRoad: 184, accessRate: '84.4%', slopeDevice: 218 },
  { key: 6, city: '金华市', total: 198, online: 186, onlineRate: '93.9%', accessRoad: 166, accessRate: '83.8%', slopeDevice: 198 },
  { key: 7, city: '衢州市', total: 145, online: 136, onlineRate: '93.8%', accessRoad: 122, accessRate: '84.1%', slopeDevice: 145 },
  { key: 8, city: '台州市', total: 234, online: 220, onlineRate: '94.0%', accessRoad: 198, accessRate: '84.6%', slopeDevice: 234 },
  { key: 9, city: '丽水市', total: 112, online: 104, onlineRate: '92.9%', accessRoad: 94, accessRate: '83.9%', slopeDevice: 112 },
  { key: 10, city: '舟山市', total: 78, online: 72, onlineRate: '92.3%', accessRoad: 66, accessRate: '84.6%', slopeDevice: 78 },
])

// 隧道设备详情弹窗
const showTunnelDeviceDetail = ref(false)
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
  { key: 3, city: '绍兴市', total: 294, online: 284, onlineRate: '96.6%', accessTunnel: 214, accessRate: '72.8%', envDevice: 104, mechDevice: 112, structDevice: 78 },
  { key: 4, city: '湖州市', total: 192, online: 186, onlineRate: '96.9%', accessTunnel: 140, accessRate: '72.9%', envDevice: 68, mechDevice: 72, structDevice: 52 },
  { key: 5, city: '嘉兴市', total: 258, online: 250, onlineRate: '96.9%', accessTunnel: 188, accessRate: '72.9%', envDevice: 92, mechDevice: 98, structDevice: 68 },
  { key: 6, city: '金华市', total: 228, online: 220, onlineRate: '96.5%', accessTunnel: 166, accessRate: '72.8%', envDevice: 82, mechDevice: 86, structDevice: 60 },
  { key: 7, city: '衢州市', total: 168, online: 162, onlineRate: '96.4%', accessTunnel: 122, accessRate: '72.6%', envDevice: 60, mechDevice: 64, structDevice: 44 },
  { key: 8, city: '台州市', total: 276, online: 268, onlineRate: '97.1%', accessTunnel: 200, accessRate: '72.5%', envDevice: 98, mechDevice: 106, structDevice: 72 },
  { key: 9, city: '丽水市', total: 132, online: 128, onlineRate: '97.0%', accessTunnel: 96, accessRate: '72.7%', envDevice: 48, mechDevice: 50, structDevice: 34 },
  { key: 10, city: '舟山市', total: 92, online: 88, onlineRate: '95.7%', accessTunnel: 68, accessRate: '73.9%', envDevice: 34, mechDevice: 36, structDevice: 22 },
])

const alarmDetailColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'area', key: 'area', width: 110 },
  { title: '设施名称', dataIndex: 'facName', key: 'facName', width: 110 },
  { title: '设备名称', dataIndex: 'devName', key: 'devName', width: 160 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 70 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 260 },
  { title: '报警时间', dataIndex: 'alarmTime', key: 'alarmTime', width: 160 },
  { title: '预警值', dataIndex: 'alarmValue', key: 'alarmValue', width: 80 },
  { title: '预警等级', dataIndex: 'alarmLevel', key: 'alarmLevel', width: 90 },
  { title: '处置状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '处置完成时间', dataIndex: 'finishTime', key: 'finishTime', width: 160 },
]
const alarmDetailData = computed(() => {
  if (monitorLayer.value === 'road') {
    return [
      { key: 1, area: '绍兴市越城区', facName: '石贯子巷', devName: '石贯子巷变形设备', monitorItem: '变形', pointName: '25-北侧变形·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15' },
      { key: 2, area: '绍兴市越城区', facName: '石贯子巷', devName: '石贯子巷变形设备', monitorItem: '变形', pointName: '25-南侧变形·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 16:20:00', alarmValue: -733.8, alarmLevel: '一级预警', status: '未完成', finishTime: '/' },
      { key: 3, area: '杭州市滨江区', facName: '复兴大道', devName: '复兴大道变形设备', monitorItem: '变形', pointName: '18-南侧变形·第1跨拱肋截面1/3等分点', alarmTime: '2026-4-26 08:10:00', alarmValue: -520.3, alarmLevel: '二级预警', status: '已完成', finishTime: '2026-4-26 09:25:00' },
      { key: 4, area: '杭州市上城区', facName: '备塘河桥路', devName: '备塘河桥路变形设备', monitorItem: '变形', pointName: '12-东侧变形·第3跨拱肋截面1/2等分点', alarmTime: '2026-4-27 10:05:00', alarmValue: 2.15, alarmLevel: '三级预警', status: '已完成', finishTime: '2026-4-27 11:30:00' },
      { key: 5, area: '杭州市拱墅区', facName: '拱墅路', devName: '拱墅路变形设备', monitorItem: '变形', pointName: '8-西侧变形·第2跨拱肋截面1/4等分点', alarmTime: '2026-4-28 14:45:00', alarmValue: -480.6, alarmLevel: '一级预警', status: '未完成', finishTime: '/' },
    ]
  }
  if (monitorLayer.value === 'tunnel') {
    return [
      { key: 1, area: '绍兴市越城区', facName: '紫金港北路下穿道', devName: '紫金港北路下穿道位移设备', monitorItem: '位移', pointName: '25-北侧位移·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15' },
      { key: 2, area: '绍兴市越城区', facName: '紫金港北路下穿道', devName: '紫金港北路下穿道位移设备', monitorItem: '位移', pointName: '25-南侧位移·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 16:20:00', alarmValue: -733.8, alarmLevel: '一级预警', status: '未完成', finishTime: '/' },
      { key: 3, area: '杭州市滨江区', facName: '复兴路隧道', devName: '复兴路隧道位移设备', monitorItem: '位移', pointName: '18-南侧位移·第1跨拱肋截面1/3等分点', alarmTime: '2026-4-26 08:10:00', alarmValue: -520.3, alarmLevel: '二级预警', status: '已完成', finishTime: '2026-4-26 09:25:00' },
      { key: 4, area: '杭州市上城区', facName: '环城北路隧道', devName: '环城北路隧道位移设备', monitorItem: '位移', pointName: '12-东侧位移·第3跨拱肋截面1/2等分点', alarmTime: '2026-4-27 10:05:00', alarmValue: 2.15, alarmLevel: '三级预警', status: '已完成', finishTime: '2026-4-27 11:30:00' },
      { key: 5, area: '杭州市拱墅区', facName: '半山隧道', devName: '半山隧道位移设备', monitorItem: '位移', pointName: '8-西侧位移·第2跨拱肋截面1/4等分点', alarmTime: '2026-4-28 14:45:00', alarmValue: -480.6, alarmLevel: '一级预警', status: '未完成', finishTime: '/' },
    ]
  }
  return [
    { key: 1, area: '绍兴市越城区', facName: '沪德立交桥', devName: '沪德立交桥应变设备', monitorItem: '应变', pointName: '25-北侧应变·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15' },
    { key: 2, area: '绍兴市越城区', facName: '沪德立交桥', devName: '沪德立交桥应变设备', monitorItem: '应变', pointName: '25-南侧应变·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 16:20:00', alarmValue: -733.8, alarmLevel: '一级预警', status: '未完成', finishTime: '/' },
    { key: 3, area: '杭州市滨江区', facName: '复兴大桥', devName: '复兴大桥应变设备', monitorItem: '应变', pointName: '18-南侧应变·第1跨拱肋截面1/3等分点', alarmTime: '2026-4-26 08:10:00', alarmValue: -520.3, alarmLevel: '二级预警', status: '已完成', finishTime: '2026-4-26 09:25:00' },
    { key: 4, area: '杭州市上城区', facName: '备塘河桥', devName: '备塘河桥倾角设备', monitorItem: '应变', pointName: '12-东侧倾角·第3跨拱肋截面1/2等分点', alarmTime: '2026-4-27 10:05:00', alarmValue: 2.15, alarmLevel: '三级预警', status: '已完成', finishTime: '2026-4-27 11:30:00' },
    { key: 5, area: '杭州市拱墅区', facName: '半山桥', devName: '半山桥应变设备', monitorItem: '应变', pointName: '8-西侧应变·第2跨拱肋截面1/4等分点', alarmTime: '2026-4-28 14:45:00', alarmValue: -480.6, alarmLevel: '一级预警', status: '未完成', finishTime: '/' },
  ]
})
const C = (field: string, w?: number) => ({ title: '地市', dataIndex: field, key: field, width: w || 80, fixed: 'left' as const })
const facilityColumns: Record<string, TableColumnsType> = {
  road: [C('city'), { title: '道路总长(km)', dataIndex: 'totalLength', key: 'totalLength' }, { title: '道路总面积(km²)', dataIndex: 'totalArea', key: 'totalArea' }, { title: '建成区面积(km²)', dataIndex: 'builtArea', key: 'builtArea' }, { title: '路网密度', dataIndex: 'density', key: 'density' }, { title: '道路面积率', dataIndex: 'areaRatio', key: 'areaRatio' }, { title: '快速路', children: [{ title: '道路长度(km)', dataIndex: 'expressway', key: 'expressway' }, { title: '路网密度', dataIndex: 'expresswayDensity', key: 'expresswayDensity' }] }, { title: '主干路', children: [{ title: '道路长度(km)', dataIndex: 'arterial', key: 'arterial' }, { title: '路网密度', dataIndex: 'arterialDensity', key: 'arterialDensity' }] }, { title: '次干路', children: [{ title: '道路长度(km)', dataIndex: 'collector', key: 'collector' }, { title: '路网密度', dataIndex: 'collectorDensity', key: 'collectorDensity' }] }, { title: '支路', children: [{ title: '道路长度(km)', dataIndex: 'local', key: 'local' }, { title: '路网密度', dataIndex: 'localDensity', key: 'localDensity' }] }],
  bridge: [C('city'), { title: '桥梁总数(座)', dataIndex: 'total', key: 'total' }, { title: '涉航桥梁总数', dataIndex: 'navigable', key: 'navigable' }, { title: '30年以上桥龄', dataIndex: 'oldBridge', key: 'oldBridge' }, { title: '特大桥', dataIndex: 'extraLarge', key: 'extraLarge' }, { title: '大桥', dataIndex: 'large', key: 'large' }, { title: '中桥', dataIndex: 'medium', key: 'medium' }, { title: '小桥', dataIndex: 'small', key: 'small' }],
  tunnel: [C('city'), { title: '城市隧道总数(座)', dataIndex: 'total', key: 'total' }, { title: '城市道路隧道', dataIndex: 'roadTunnel', key: 'roadTunnel' }, { title: '人行地道', dataIndex: 'pedestrian', key: 'pedestrian' }, { title: '地下隧道', dataIndex: 'underground', key: 'underground' }, { title: '特长隧道', dataIndex: 'extraLong', key: 'extraLong' }, { title: '长隧道', dataIndex: 'longTunnel', key: 'longTunnel' }, { title: '中隧道', dataIndex: 'mediumTunnel', key: 'mediumTunnel' }, { title: '短隧道', dataIndex: 'shortTunnel', key: 'shortTunnel' }],
}
const facilityData = {
  road: ['杭州市','宁波市','温州市','绍兴市','湖州市','嘉兴市','金华市','衢州市','台州市','丽水市','舟山市'].map((c, i) => ({ key: i, city: c, totalLength: [1256,987,845,623,412,534,478,356,567,298,186][i], totalArea: [186.5,142.3,118.7,89.4,62.1,78.9,71.2,52.8,84.6,45.3,28.5][i], builtArea: [98.2,76.5,62.3,45.8,32.6,41.2,37.8,28.4,44.9,23.7,15.1][i], density: [8.5,7.2,6.8,6.1,5.4,5.9,5.6,4.8,6.2,4.5,3.8][i], areaRatio: [14.8,13.5,12.9,11.8,10.5,11.2,10.8,9.6,12.1,8.9,7.5][i]+'%', expressway: [156,124,98,78,52,68,62,45,72,38,24][i], expresswayDensity: [1.2,1.1,1.0,0.9,0.8,0.9,0.85,0.75,0.95,0.7,0.6][i], arterial: [423,334,286,212,142,182,164,123,194,102,64][i], arterialDensity: [3.2,2.8,2.6,2.3,2.0,2.2,2.1,1.8,2.4,1.7,1.4][i], collector: [356,278,238,176,116,152,136,102,162,84,52][i], collectorDensity: [2.7,2.3,2.1,1.9,1.6,1.8,1.7,1.5,1.9,1.4,1.2][i], local: [321,251,223,157,102,132,116,86,139,74,46][i], localDensity: [4.5,4.0,3.8,3.5,3.0,3.3,3.2,2.8,3.6,2.6,2.2][i] })),
  bridge: ['杭州市','宁波市','温州市','绍兴市','湖州市','嘉兴市','金华市','衢州市','台州市','丽水市','舟山市'].map((c, i) => ({ key: i, city: c, total: [567,423,389,256,178,234,198,145,267,123,87][i], navigable: [86,64,58,38,26,35,30,22,41,18,13][i], oldBridge: [124,92,85,56,38,52,44,32,58,27,19][i], extraLarge: [23,18,15,12,8,10,9,6,11,5,3][i], large: [89,67,58,42,28,38,32,24,45,19,14][i], medium: [234,178,156,112,78,98,82,62,118,54,38][i], small: [221,160,160,90,64,88,75,53,93,45,32][i] })),
  tunnel: ['杭州市','宁波市','温州市','绍兴市','湖州市','嘉兴市','金华市','衢州市','台州市','丽水市','舟山市'].map((c, i) => ({ key: i, city: c, total: [98,76,68,45,32,41,35,26,48,21,14][i], roadTunnel: [68,52,47,31,22,28,24,18,33,14,10][i], pedestrian: [18,14,12,8,6,7,6,4,9,4,2][i], underground: [45,34,31,21,15,19,16,12,22,10,7][i], extraLong: [5,4,3,2,1,2,1,1,2,1,0][i], longTunnel: [18,14,12,8,6,7,6,4,9,4,2][i], mediumTunnel: [42,32,28,19,13,17,14,11,20,9,6][i], shortTunnel: [33,26,25,16,12,15,14,10,17,7,6][i] })),
}

const roadTypeLegend = [
  { key: 'main' as const, name: '主干路', color: '#5b8ff9' },
  { key: 'sub' as const, name: '次干路', color: '#5ad8a6' },
  { key: 'branch' as const, name: '支路', color: '#f6bd16' },
  { key: 'highway' as const, name: '城市快速路', color: '#e86452' },
]
const roadEvalLegend = [
  { key: 'A' as const, name: 'A级', color: '#5ad8a6' },
  { key: 'B' as const, name: 'B级', color: '#5b8ff9' },
  { key: 'C' as const, name: 'C级', color: '#f6bd16' },
  { key: 'D' as const, name: 'D级', color: '#e86452' },
]
const bridgeTypeLegend = [
  { key: 'extraLarge' as const, name: '特大桥', color: '#e86452' },
  { key: 'large' as const, name: '大桥', color: '#5b8ff9' },
  { key: 'overpass' as const, name: '立交桥', color: '#5ad8a6' },
  { key: 'viaduct' as const, name: '高架桥', color: '#f6bd16' },
  { key: 'smallMedium' as const, name: '中小桥', color: '#6dc8ec' },
  { key: 'other' as const, name: '其他', color: '#945fb9' },
]
const bridgeEvalLegend = [
  { key: 'pass' as const, name: '合格', color: '#5ad8a6' },
  { key: 'fail' as const, name: '不合格', color: '#e86452' },
  { key: 'A' as const, name: 'A级', color: '#5ad8a6' },
  { key: 'B' as const, name: 'B级', color: '#5b8ff9' },
  { key: 'C' as const, name: 'C级', color: '#f6bd16' },
  { key: 'D' as const, name: 'D级', color: '#e86452' },
  { key: 'E' as const, name: 'E级', color: '#945fb9' },
]
const tunnelTypeLegend = [
  { key: 'cityRoadTunnel' as const, name: '城市道路隧道', color: '#5b8ff9' },
  { key: 'pedestrian' as const, name: '人行地道', color: '#5ad8a6' },
]
const tunnelEvalLegend = [
  { key: 'A' as const, name: 'A级', color: '#5ad8a6' },
  { key: 'B' as const, name: 'B级', color: '#5b8ff9' },
  { key: 'C' as const, name: 'C级', color: '#f6bd16' },
  { key: 'D' as const, name: 'D级', color: '#e86452' },
  { key: 'E' as const, name: 'E级', color: '#945fb9' },
]

// 动态图例/复选框
const currentTypeLegend = computed(() => activeLayer.value === 'bridge' ? bridgeTypeLegend : activeLayer.value === 'tunnel' ? tunnelTypeLegend : roadTypeLegend)
const currentEvalLegend = computed(() => activeLayer.value === 'bridge' ? bridgeEvalLegend : activeLayer.value === 'tunnel' ? tunnelEvalLegend : roadEvalLegend)
const currentTypeChecked = computed(() => activeLayer.value === 'bridge' ? bridgeTypeChecked : activeLayer.value === 'tunnel' ? tunnelTypeChecked : roadTypeChecked)
const currentEvalChecked = computed(() => activeLayer.value === 'bridge' ? bridgeEvalChecked : activeLayer.value === 'tunnel' ? tunnelEvalChecked : roadEvalChecked)

// 在线监测图例联动
const monitorSubLayer = ref<'type' | 'eval'>('type')
const monitorTypeLegend = computed(() => monitorLayer.value === 'bridge' ? bridgeTypeLegend : monitorLayer.value === 'tunnel' ? tunnelTypeLegend : roadTypeLegend)
const monitorEvalLegend = computed(() => monitorLayer.value === 'bridge' ? bridgeEvalLegend : monitorLayer.value === 'tunnel' ? tunnelEvalLegend : roadEvalLegend)
const monitorTypeChecked = computed(() => monitorLayer.value === 'bridge' ? bridgeTypeChecked : monitorLayer.value === 'tunnel' ? tunnelTypeChecked : roadTypeChecked)
const monitorEvalChecked = computed(() => monitorLayer.value === 'bridge' ? bridgeEvalChecked : monitorLayer.value === 'tunnel' ? tunnelEvalChecked : roadEvalChecked)

const roadCategories = [
  { name: '快速路', value: '42.7 km', num: 42.7, color: '#e86452', density: 0.35, recommendRange: [0.3, 0.4] },
  { name: '主干路', value: '63.2 km', num: 63.2, color: '#5b8ff9', density: 0.97, recommendRange: [1.0, 1.2] },
  { name: '次干路', value: '46.4 km', num: 46.4, color: '#5ad8a6', density: 0.71, recommendRange: [1.2, 1.4] },
  { name: '支路', value: '112.4 km', num: 112.4, color: '#f6bd16', density: 1.73, recommendRange: [3.0, 4.0] },
]
const bridgeCategories = [
  { name: '特大型桥梁', value: '45 座', num: 45, color: '#e86452' },
  { name: '大型桥梁', value: '156 座', num: 156, color: '#5b8ff9' },
  { name: '中小桥', value: '2,356 座', num: 2356, color: '#6dc8ec' },
  { name: '立交桥', value: '289 座', num: 289, color: '#5ad8a6' },
  { name: '高架桥', value: '567 座', num: 567, color: '#f6bd16' },
  { name: '人行天桥', value: '495 座', num: 495, color: '#945fb9' },
]
const tunnelCategories = [
  { name: '特长隧道', value: '28 座', num: 28, color: '#e86452' },
  { name: '长隧道', value: '96 座', num: 96, color: '#5b8ff9' },
  { name: '中隧道', value: '312 座', num: 312, color: '#5ad8a6' },
  { name: '短隧道', value: '256 座', num: 256, color: '#f6bd16' },
]
const currentCategories = computed(() => activeLayer.value === 'bridge' ? bridgeCategories : activeLayer.value === 'tunnel' ? tunnelCategories : roadCategories)

const riskCategories = [
  { name: '一级预警', color: '#945fb9' },
  { name: '二级预警', color: '#5b8ff9' },
  { name: '三级预警', color: '#e86452' },
]

const riskType = ref<'hidden' | 'device' | 'inspect' | 'assess'>('device')
const riskTypes = [
  { label: '隐患排查', value: 'hidden' as const },
  { label: '设备监测', value: 'device' as const },
  { label: '设施检测', value: 'inspect' as const },
  { label: '安全评估', value: 'assess' as const },
]

function alertLevelText(level: number) {
  return level === 1 ? '一级预警' : level === 2 ? '二级预警' : '三级预警'
}

const monitorItemMap: Record<string, string> = { road: '变形', bridge: '应变', tunnel: '位移' }

const roadAlertData = [
  { id: 1, area: '上城区', road: '石贯子巷', point: 'K1+200', level: 1, done: false },
  { id: 2, area: '上城区', road: '中山中路', point: 'K3+500', level: 2, done: true },
  { id: 3, area: '拱墅区', road: '环城北路', point: 'K2+100', level: 1, done: false },
  { id: 4, area: '西湖区', road: '文三路', point: 'K1+800', level: 3, done: true },
  { id: 5, area: '滨江区', road: '江南大道', point: 'K4+200', level: 2, done: false },
  { id: 6, area: '上城区', road: '解放路', point: 'K2+600', level: 1, done: true },
  { id: 7, area: '拱墅区', road: '莫干山路', point: 'K5+100', level: 3, done: false },
  { id: 8, area: '西湖区', road: '天目山路', point: 'K3+400', level: 2, done: true },
  { id: 9, area: '滨江区', road: '时代大道', point: 'K2+900', level: 1, done: false },
  { id: 10, area: '上城区', road: '延安路', point: 'K1+500', level: 3, done: true },
]

const alertList = computed(() => {
  const item = monitorItemMap[activeLayer.value]
  return roadAlertData.map(a => ({ ...a, item }))
})

// 隐患排查数据
const inspectProjectMap: Record<string, string[]> = {
  road: ['道路设施', '道路照明设施'],
  bridge: ['桥梁设施', '人行天桥设施', '照明设施'],
  tunnel: ['隧道设施', '下穿通道设施', '人行地道设施'],
}

const hiddenRiskChartRef = ref<HTMLElement | null>(null)
let hiddenRiskChart: echarts.ECharts | null = null
const hiddenRiskCategories = [
  { name: '一般隐患', color: '#5b8ff9' },
  { name: '较大隐患', color: '#f6bd16' },
  { name: '重大隐患', color: '#e86452' },
]
function hiddenLevelText(level: number) {
  return level === 1 ? '一般隐患' : level === 2 ? '较大隐患' : '重大隐患'
}
const hiddenDangerBaseData = [
  { id: 1, area: '上城区', road: '石贯子巷', level: 1, fixed: true },
  { id: 2, area: '上城区', road: '中山中路', level: 2, fixed: false },
  { id: 3, area: '拱墅区', road: '环城北路', level: 3, fixed: false },
  { id: 4, area: '西湖区', road: '文三路', level: 2, fixed: true },
  { id: 5, area: '滨江区', road: '江南大道', level: 1, fixed: true },
  { id: 6, area: '上城区', road: '解放路', level: 2, fixed: false },
  { id: 7, area: '拱墅区', road: '莫干山路', level: 3, fixed: true },
  { id: 8, area: '西湖区', road: '天目山路', level: 1, fixed: false },
  { id: 9, area: '滨江区', road: '时代大道', level: 2, fixed: true },
  { id: 10, area: '上城区', road: '延安路', level: 3, fixed: false },
]
const hiddenDangerList = computed(() => {
  const projects = inspectProjectMap[activeLayer.value] || inspectProjectMap.road
  const contentMap: Record<string, string> = {
    '道路设施': '路面破损严重', '道路照明设施': '路灯不亮多处',
    '桥梁设施': '支座锈蚀严重', '人行天桥设施': '栏杆损坏', '照明设施': '灯具缺失',
    '隧道设施': '通风设备故障', '下穿通道设施': '排水不畅', '人行地道设施': '照明损坏',
  }
  return hiddenDangerBaseData.map((d, i) => ({
    ...d,
    project: projects[i % projects.length],
    content: contentMap[projects[i % projects.length]] || '设施损坏',
  }))
})

// 安全评估数据
const assessChartRef = ref<HTMLElement | null>(null)
let assessChart: echarts.ECharts | null = null
const assessCategories = [
  { name: '一般隐患', color: '#5b8ff9' },
  { name: '较大隐患', color: '#f6bd16' },
  { name: '重大隐患', color: '#e86452' },
]
function assessLevelText(level: number) {
  return level === 1 ? '一般隐患' : level === 2 ? '较大隐患' : '重大隐患'
}
const assessBaseData = [
  { id: 1, area: '上城区', road: '石贯子巷', entity: '浙江安盛检测有限公司', level: 1, fixed: true },
  { id: 2, area: '上城区', road: '中山中路', entity: '杭州市政工程检测中心', level: 2, fixed: false },
  { id: 3, area: '拱墅区', road: '环城北路', entity: '浙江中检工程技术有限公司', level: 3, fixed: false },
  { id: 4, area: '西湖区', road: '文三路', entity: '杭州道桥检测有限公司', level: 2, fixed: true },
  { id: 5, area: '滨江区', road: '江南大道', entity: '浙江省建设工程质量检测站', level: 1, fixed: true },
  { id: 6, area: '上城区', road: '解放路', entity: '浙江安盛检测有限公司', level: 2, fixed: false },
  { id: 7, area: '拱墅区', road: '莫干山路', entity: '杭州市政工程检测中心', level: 3, fixed: true },
  { id: 8, area: '西湖区', road: '天目山路', entity: '浙江中检工程技术有限公司', level: 1, fixed: false },
  { id: 9, area: '滨江区', road: '时代大道', entity: '杭州道桥检测有限公司', level: 2, fixed: true },
  { id: 10, area: '上城区', road: '延安路', entity: '浙江省建设工程质量检测站', level: 3, fixed: false },
]
const assessList = computed(() => {
  const projects = inspectProjectMap[activeLayer.value] || inspectProjectMap.road
  return assessBaseData.map((d, i) => ({
    ...d,
    project: projects[i % projects.length],
  }))
})

// 设施检测数据
const inspectMetrics = computed(() => {
  if (activeLayer.value === 'bridge') {
    return [
      { label: 'D、E级桥梁', value: '18', colorClass: 'orange' },
      { label: '不合格桥梁', value: '12', colorClass: 'orange' },
      { label: '已维修整治', value: '22', colorClass: 'green' },
      { label: '已拆除或完全封控', value: '6', colorClass: 'cyan' },
      { label: '整改率', value: '78.5%', colorClass: 'cyan' },
    ]
  } else if (activeLayer.value === 'tunnel') {
    return [
      { label: 'D、E级隧道', value: '9', colorClass: 'orange' },
      { label: '已维修整治', value: '6', colorClass: 'green' },
      { label: '已拆除或完全封控', value: '2', colorClass: 'cyan' },
      { label: '整改率', value: '72.2%', colorClass: 'cyan' },
    ]
  }
  return [
    { label: 'D级道路', value: '26', colorClass: 'orange' },
    { label: '已维修整治', value: '18', colorClass: 'green' },
    { label: '已拆除或完全封控', value: '5', colorClass: 'cyan' },
    { label: '整改率', value: '72.3%', colorClass: 'cyan' },
  ]
})

const inspectList = computed(() => {
  if (activeLayer.value === 'bridge') {
    return [
      { id: 1, area: '上城区', road: '梁山西路桥', grade: 'D', done: false, rectype: '维修整治' },
      { id: 2, area: '滨江区', road: '复兴大桥', grade: 'E', done: true, rectype: '拆除或完全封控' },
      { id: 3, area: '上城区', road: '备塘河桥', grade: 'D', done: true, rectype: '维修整治' },
      { id: 4, area: '西湖区', road: '圆球山立交桥', grade: '不合格', done: false, rectype: '拆除或完全封控' },
      { id: 5, area: '拱墅区', road: '半山桥', grade: 'E', done: true, rectype: '拆除或完全封控' },
      { id: 6, area: '上城区', road: '乌桥', grade: '不合格', done: false, rectype: '维修整治' },
      { id: 7, area: '萧山区', road: '青岛大桥', grade: 'D', done: true, rectype: '维修整治' },
      { id: 8, area: '余杭区', road: '三角岗桥', grade: 'E', done: false, rectype: '拆除或完全封控' },
    ]
  } else if (activeLayer.value === 'tunnel') {
    return [
      { id: 1, area: '西湖区', road: '紫金港北路下穿道', grade: 'D', done: true, rectype: '维修整治' },
      { id: 2, area: '上城区', road: '苏嘉路下穿道', grade: 'E', done: false, rectype: '拆除或完全封控' },
      { id: 3, area: '滨江区', road: '复兴路隧道', grade: 'D', done: true, rectype: '维修整治' },
      { id: 4, area: '上城区', road: '环城北路隧道', grade: 'E', done: false, rectype: '拆除或完全封控' },
      { id: 5, area: '拱墅区', road: '半山隧道', grade: 'D', done: true, rectype: '维修整治' },
      { id: 6, area: '上城区', road: '乌桥路地道', grade: 'E', done: false, rectype: '拆除或完全封控' },
      { id: 7, area: '萧山区', road: '青岛路隧道', grade: 'D', done: true, rectype: '维修整治' },
      { id: 8, area: '余杭区', road: '三角岗路地道', grade: 'E', done: false, rectype: '维修整治' },
    ]
  }
  return [
    { id: 1, area: '上城区', road: '石贯子巷', grade: 'D', done: false, rectype: '维修整治' },
    { id: 2, area: '上城区', road: '中山中路', grade: 'D', done: true, rectype: '维修整治' },
    { id: 3, area: '拱墅区', road: '环城北路', grade: 'D', done: true, rectype: '拆除或完全封控' },
    { id: 4, area: '西湖区', road: '文三路', grade: 'D', done: false, rectype: '维修整治' },
    { id: 5, area: '滨江区', road: '江南大道', grade: 'D', done: true, rectype: '拆除或完全封控' },
    { id: 6, area: '上城区', road: '解放路', grade: 'D', done: true, rectype: '维修整治' },
    { id: 7, area: '拱墅区', road: '莫干山路', grade: 'D', done: false, rectype: '拆除或完全封控' },
    { id: 8, area: '西湖区', road: '天目山路', grade: 'D', done: true, rectype: '维修整治' },
    { id: 9, area: '滨江区', road: '时代大道', grade: 'D', done: false, rectype: '维修整治' },
    { id: 10, area: '上城区', road: '延安路', grade: 'D', done: true, rectype: '拆除或完全封控' },
  ]
})

// 风险清单详情弹窗
const riskDetail = reactive({ hidden: false, device: false, inspect: false, assess: false })
const riskDetailPage = reactive({ hidden: 1, device: 1, inspect: 1, assess: 1 })

function openRiskDetailModal() {
  const type = riskType.value
  riskDetailPage[type] = 1
  riskDetail[type] = true
}

const facilityNameTitle = computed(() => {
  const map: Record<string, string> = { road: '道路名称', bridge: '桥梁名称', tunnel: '隧道名称' }
  return map[activeLayer.value] || '道路/桥梁/隧道名称'
})

const riskDetailColumns = computed(() => ({
  hidden: [
    { title: '所属区域', dataIndex: 'area', width: 100 },
    { title: facilityNameTitle.value, dataIndex: 'road', width: 160 },
    { title: '检查项目', dataIndex: 'project', width: 130 },
    { title: '上报内容', dataIndex: 'content', width: 150 },
    { title: '隐患等级', dataIndex: 'levelText', width: 100 },
    { title: '整改状态', dataIndex: 'status', width: 100 },
    { title: '整改完成时间', dataIndex: 'doneTime', width: 150 },
    { title: '整改人', dataIndex: 'handler', width: 100 },
  ],
  device: [
    { title: '所属区域', dataIndex: 'area', width: 100 },
    { title: '设施名称', dataIndex: 'road', width: 140 },
    { title: '设备名称', dataIndex: 'deviceName', width: 140 },
    { title: '点位名称', dataIndex: 'point', width: 100 },
    { title: '监测项', dataIndex: 'item', width: 90 },
    { title: '报警开始时间', dataIndex: 'alarmStartTime', width: 140 },
    { title: '报警结束时间', dataIndex: 'alarmEndTime', width: 140 },
    { title: '预警值', dataIndex: 'alarmValue', width: 80 },
    { title: '预警等级', dataIndex: 'levelText', width: 90 },
    { title: '处置状态', dataIndex: 'status', width: 90 },
    { title: '处置完成时间', dataIndex: 'doneTime', width: 130 },
    { title: '处置人', dataIndex: 'handler', width: 90 },
  ],
  inspect: [
    { title: '所属区域', dataIndex: 'area', width: 100 },
    { title: '检测名称', dataIndex: 'inspectName', width: 160 },
    { title: '检测时间', dataIndex: 'inspectTime', width: 120 },
    { title: '检测类型', dataIndex: 'inspectType', width: 110 },
    { title: facilityNameTitle.value, dataIndex: 'road', width: 140 },
    { title: '综合评价等级', dataIndex: 'grade', width: 110 },
    { title: '整改类型', dataIndex: 'rectype', width: 130 },
    { title: '整改完成状态', dataIndex: 'status', width: 110 },
    { title: '整改销号日期', dataIndex: 'doneTime', width: 130 },
    {
      title: '整改后评级', dataIndex: 'afterGrade', width: 110,
      customRender: ({ text, record }: any) => {
        if (record.rectype === '拆除或完全封控') return '-'
        return text || '-'
      }
    },
  ],
  assess: [
    { title: '所属区域', dataIndex: 'area', width: 100 },
    { title: facilityNameTitle.value, dataIndex: 'road', width: 160 },
    { title: '评估项目', dataIndex: 'project', width: 130 },
    { title: '评估主体', dataIndex: 'entity', width: 200 },
    { title: '隐患等级', dataIndex: 'levelText', width: 100 },
    { title: '整改状态', dataIndex: 'status', width: 100 },
    { title: '整改完成时间', dataIndex: 'doneTime', width: 150 },
    { title: '整改人', dataIndex: 'handler', width: 100 },
  ],
}))

const hiddenDetailBase = [
  { area: '上城区', road: '石贯子巷', project: '道路设施', content: '路面破损严重', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-15', handler: '张伟' },
  { area: '上城区', road: '中山中路', project: '道路照明设施', content: '路灯不亮多处', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '环城北路', project: '道路设施', content: '路面沉降严重', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '文三路', project: '道路照明设施', content: '灯杆倾斜危险', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-02', handler: '李明' },
  { area: '滨江区', road: '江南大道', project: '道路设施', content: '路面裂缝扩展', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-20', handler: '王芳' },
  { area: '上城区', road: '解放路', project: '道路照明设施', content: '线路老化故障', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '莫干山路', project: '道路设施', content: '路基塌陷风险', levelText: '重大隐患', status: '已整改', doneTime: '2026-05-10', handler: '陈强' },
  { area: '西湖区', road: '天目山路', project: '道路照明设施', content: '灯具缺失严重', levelText: '一般隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '滨江区', road: '时代大道', project: '道路设施', content: '人行道砖松动', levelText: '较大隐患', status: '已整改', doneTime: '2026-01-25', handler: '赵军' },
  { area: '上城区', road: '延安路', project: '道路照明设施', content: '配电箱损坏', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '萧山区', road: '市心路', project: '道路设施', content: '路面坑洼严重', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-08', handler: '刘洋' },
  { area: '余杭区', road: '文一西路', project: '道路照明设施', content: '电缆破损漏电', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-15', handler: '周伟' },
  { area: '上城区', road: '清泰路', project: '道路设施', content: '井盖缺失破损', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-18', handler: '吴静' },
  { area: '拱墅区', road: '大关路', project: '道路照明设施', content: '灯臂锈蚀断裂', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '古翠路', project: '道路设施', content: '路面沥青剥落', levelText: '一般隐患', status: '已整改', doneTime: '2026-05-22', handler: '孙磊' },
]
const deviceDetailBase = [
  { area: '上城区', road: '石贯子巷', deviceName: '石贯子巷变形监测仪', point: 'K1+200', item: '变形', alarmStartTime: '2026-04-20 08:30:00', alarmEndTime: '-', alarmValue: -633.8, levelText: '一级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '上城区', road: '中山中路', deviceName: '中山中路变形监测仪', point: 'K3+500', item: '变形', alarmStartTime: '2026-03-15 14:20:00', alarmEndTime: '2026-04-10 09:00:00', alarmValue: -452.3, levelText: '二级预警', status: '已完成', doneTime: '2026-04-10', handler: '张伟' },
  { area: '拱墅区', road: '环城北路', deviceName: '环城北路倾斜仪', point: 'K2+100', item: '倾斜', alarmStartTime: '2026-04-22 10:15:00', alarmEndTime: '-', alarmValue: 0.085, levelText: '一级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '文三路', deviceName: '文三路应变计', point: 'K1+800', item: '应变', alarmStartTime: '2026-02-28 16:40:00', alarmEndTime: '2026-03-20 11:30:00', alarmValue: -1.25, levelText: '三级预警', status: '已完成', doneTime: '2026-03-20', handler: '李明' },
  { area: '滨江区', road: '江南大道', deviceName: '江南大道位移计', point: 'K4+200', item: '位移', alarmStartTime: '2026-04-18 09:00:00', alarmEndTime: '-', alarmValue: 2.86, levelText: '二级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '上城区', road: '解放路', deviceName: '解放路加速度计', point: 'K2+600', item: '振动', alarmStartTime: '2026-04-05 07:50:00', alarmEndTime: '2026-05-05 14:20:00', alarmValue: 0.0156, levelText: '一级预警', status: '已完成', doneTime: '2026-05-05', handler: '王芳' },
  { area: '拱墅区', road: '莫干山路', deviceName: '莫干山路挠度计', point: 'K5+100', item: '挠度', alarmStartTime: '2026-04-25 13:30:00', alarmEndTime: '-', alarmValue: 1.52, levelText: '三级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '天目山路', deviceName: '天目山路索力仪', point: 'K3+400', item: '索力', alarmStartTime: '2026-03-28 11:20:00', alarmEndTime: '2026-04-25 16:00:00', alarmValue: 856.3, levelText: '二级预警', status: '已完成', doneTime: '2026-04-25', handler: '陈强' },
  { area: '滨江区', road: '时代大道', deviceName: '时代大道裂缝计', point: 'K2+900', item: '裂缝', alarmStartTime: '2026-04-28 15:10:00', alarmEndTime: '-', alarmValue: 0.32, levelText: '一级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '上城区', road: '延安路', deviceName: '延安路温湿度计', point: 'K1+500', item: '温湿度', alarmStartTime: '2026-04-12 08:00:00', alarmEndTime: '2026-05-18 10:30:00', alarmValue: 92.5, levelText: '三级预警', status: '已完成', doneTime: '2026-05-18', handler: '赵军' },
  { area: '萧山区', road: '市心路', deviceName: '市心路振动传感器', point: 'K3+200', item: '变形', alarmStartTime: '2026-03-05 09:40:00', alarmEndTime: '-', alarmValue: -328.5, levelText: '一级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '余杭区', road: '文一西路', deviceName: '文一西路静力水准仪', point: 'K4+800', item: '沉降', alarmStartTime: '2026-02-18 14:00:00', alarmEndTime: '2026-03-12 10:30:00', alarmValue: 1.85, levelText: '二级预警', status: '已完成', doneTime: '2026-03-12', handler: '刘洋' },
  { area: '上城区', road: '清泰路', deviceName: '清泰路测斜仪', point: 'K1+100', item: '倾斜', alarmStartTime: '2026-03-22 11:15:00', alarmEndTime: '2026-04-08 15:40:00', alarmValue: 0.062, levelText: '二级预警', status: '已完成', doneTime: '2026-04-08', handler: '周伟' },
  { area: '拱墅区', road: '大关路', deviceName: '大关路激光位移计', point: 'K2+300', item: '变形', alarmStartTime: '2026-04-26 16:20:00', alarmEndTime: '-', alarmValue: 0.98, levelText: '三级预警', status: '未完成', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '古翠路', deviceName: '古翠路光纤光栅传感器', point: 'K1+600', item: '应变', alarmStartTime: '2026-05-02 07:30:00', alarmEndTime: '2026-05-30 14:00:00', alarmValue: -2.15, levelText: '一级预警', status: '已完成', doneTime: '2026-05-30', handler: '吴静' },
]
const inspectDetailBase = [
  { area: '上城区', road: '石贯子巷', inspectName: '石贯子巷常规检测', inspectTime: '2026-01-15', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-03-20', afterGrade: 'C' },
  { area: '上城区', road: '中山中路', inspectName: '中山中路结构检测', inspectTime: '2026-02-20', inspectType: '结构检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-04-15', afterGrade: 'C' },
  { area: '拱墅区', road: '环城北路', inspectName: '环城北路特殊检测', inspectTime: '2025-12-10', inspectType: '特殊检测', grade: 'D', rectype: '拆除或完全封控', status: '已完成', doneTime: '2026-02-10', afterGrade: '-' },
  { area: '西湖区', road: '文三路', inspectName: '文三路常规检测', inspectTime: '2026-03-05', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '未完成', doneTime: '-', afterGrade: '-' },
  { area: '滨江区', road: '江南大道', inspectName: '江南大道结构检测', inspectTime: '2025-11-25', inspectType: '结构检测', grade: 'D', rectype: '拆除或完全封控', status: '已完成', doneTime: '2026-01-25', afterGrade: '-' },
  { area: '上城区', road: '解放路', inspectName: '解放路常规检测', inspectTime: '2026-04-10', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-05-08', afterGrade: 'C' },
  { area: '拱墅区', road: '莫干山路', inspectName: '莫干山路特殊检测', inspectTime: '2026-01-18', inspectType: '特殊检测', grade: 'D', rectype: '拆除或完全封控', status: '未完成', doneTime: '-', afterGrade: '-' },
  { area: '西湖区', road: '天目山路', inspectName: '天目山路常规检测', inspectTime: '2026-02-28', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-04-02', afterGrade: 'B' },
  { area: '滨江区', road: '时代大道', inspectName: '时代大道结构检测', inspectTime: '2026-03-20', inspectType: '结构检测', grade: 'D', rectype: '维修整治', status: '未完成', doneTime: '-', afterGrade: '-' },
  { area: '上城区', road: '延安路', inspectName: '延安路特殊检测', inspectTime: '2026-01-05', inspectType: '特殊检测', grade: 'D', rectype: '拆除或完全封控', status: '已完成', doneTime: '2026-03-30', afterGrade: '-' },
  { area: '萧山区', road: '市心路', grade: 'E', rectype: '拆除或完全封控', status: '已完成', doneTime: '2026-02-18', afterGrade: '-' },
  { area: '余杭区', road: '文一西路', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-05-15', afterGrade: 'C' },
  { area: '上城区', road: '清泰路', grade: 'E', rectype: '拆除或完全封控', status: '未完成', doneTime: '-', afterGrade: '-' },
  { area: '拱墅区', road: '大关路', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-04-22', afterGrade: 'C' },
  { area: '西湖区', road: '古翠路', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-03-10', afterGrade: 'B' },
]
const assessDetailBase = [
  { area: '上城区', road: '石贯子巷', project: '道路设施', entity: '浙江安盛检测有限公司', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-15', handler: '张伟' },
  { area: '上城区', road: '中山中路', project: '道路照明设施', entity: '杭州市政工程检测中心', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '环城北路', project: '道路设施', entity: '浙江中检工程技术有限公司', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '文三路', project: '道路照明设施', entity: '杭州道桥检测有限公司', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-10', handler: '李明' },
  { area: '滨江区', road: '江南大道', project: '道路设施', entity: '浙江省建设工程质量检测站', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-25', handler: '王芳' },
  { area: '上城区', road: '解放路', project: '道路照明设施', entity: '浙江安盛检测有限公司', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '莫干山路', project: '道路设施', entity: '杭州市政工程检测中心', levelText: '重大隐患', status: '已整改', doneTime: '2026-05-12', handler: '陈强' },
  { area: '西湖区', road: '天目山路', project: '道路照明设施', entity: '浙江中检工程技术有限公司', levelText: '一般隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '滨江区', road: '时代大道', project: '道路设施', entity: '杭州道桥检测有限公司', levelText: '较大隐患', status: '已整改', doneTime: '2026-01-28', handler: '赵军' },
  { area: '上城区', road: '延安路', project: '道路照明设施', entity: '浙江省建设工程质量检测站', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '萧山区', road: '市心路', project: '道路设施', entity: '浙江安盛检测有限公司', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-22', handler: '刘洋' },
  { area: '余杭区', road: '文一西路', project: '道路照明设施', entity: '杭州市政工程检测中心', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-18', handler: '周伟' },
  { area: '上城区', road: '清泰路', project: '道路设施', entity: '浙江中检工程技术有限公司', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-15', handler: '吴静' },
  { area: '拱墅区', road: '大关路', project: '道路照明设施', entity: '杭州道桥检测有限公司', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '古翠路', project: '道路设施', entity: '浙江省建设工程质量检测站', levelText: '一般隐患', status: '已整改', doneTime: '2026-05-28', handler: '孙磊' },
]

const riskDetailData = {
  hidden: hiddenDetailBase.map((d, i) => ({ ...d, key: i + 1 })),
  device: deviceDetailBase.map((d, i) => ({ ...d, key: i + 1 })),
  inspect: inspectDetailBase.map((d, i) => ({ ...d, key: i + 1 })),
  assess: assessDetailBase.map((d, i) => ({ ...d, key: i + 1 })),
}

const riskDetailPageData = computed(() => ({
  hidden: riskDetailData.hidden.slice((riskDetailPage.hidden - 1) * 10, riskDetailPage.hidden * 10),
  device: riskDetailData.device.slice((riskDetailPage.device - 1) * 10, riskDetailPage.device * 10),
  inspect: riskDetailData.inspect.slice((riskDetailPage.inspect - 1) * 10, riskDetailPage.inspect * 10),
  assess: riskDetailData.assess.slice((riskDetailPage.assess - 1) * 10, riskDetailPage.assess * 10),
}))

// 在线监测数据
const monitorCity = ref('浙江省')
const monitorLayer = ref<'road' | 'bridge' | 'tunnel'>('road')

const roadDevices = [
  { key: 1, name: '石贯子巷', district: '杭州市上城区', online: '离线' },
  { key: 2, name: '复兴大道', district: '杭州市滨江区', online: '在线' },
  { key: 3, name: '备塘河桥路', district: '杭州市上城区', online: '在线' },
  { key: 4, name: '环城西路', district: '杭州市西湖区', online: '在线' },
  { key: 5, name: '拱墅路', district: '杭州市拱墅区', online: '在线' },
  { key: 6, name: '乌桥路', district: '杭州市上城区', online: '离线' },
  { key: 7, name: '青岛大路', district: '杭州市萧山区', online: '在线' },
  { key: 8, name: '三角岗路', district: '杭州市余杭区', online: '离线' },
]
const bridgeDevices = [
  { key: 1, name: '梁山西路桥', district: '杭州市上城区', online: '离线' },
  { key: 2, name: '复兴大桥', district: '杭州市滨江区', online: '离线' },
  { key: 3, name: '备塘河桥(东路)', district: '杭州市上城区', online: '在线' },
  { key: 4, name: '圆球山立交桥', district: '杭州市西湖区', online: '在线' },
  { key: 5, name: '半山桥', district: '杭州市拱墅区', online: '在线' },
  { key: 6, name: '乌桥', district: '杭州市上城区', online: '离线' },
  { key: 7, name: '青岛大桥', district: '杭州市萧山区', online: '在线' },
  { key: 8, name: '三角岗桥', district: '杭州市余杭区', online: '离线' },
]
const tunnelDevices = [
  { key: 1, name: '紫金港北路下穿道', district: '杭州市西湖区', online: '在线' },
  { key: 2, name: '苏嘉路下穿道', district: '杭州市上城区', online: '离线' },
  { key: 3, name: '复兴路隧道', district: '杭州市滨江区', online: '在线' },
  { key: 4, name: '环城北路隧道', district: '杭州市上城区', online: '在线' },
  { key: 5, name: '半山隧道', district: '杭州市拱墅区', online: '离线' },
  { key: 6, name: '乌桥路地道', district: '杭州市上城区', online: '在线' },
  { key: 7, name: '青岛路隧道', district: '杭州市萧山区', online: '在线' },
  { key: 8, name: '三角岗路地道', district: '杭州市余杭区', online: '离线' },
]
const monitorDevices = computed(() => {
  if (monitorLayer.value === 'road') return roadDevices
  if (monitorLayer.value === 'tunnel') return tunnelDevices
  return bridgeDevices
})
const deviceSuffix = computed(() => {
  if (monitorLayer.value === 'road') return '变形设备'
  if (monitorLayer.value === 'tunnel') return '位移设备'
  return '应变设备'
})
const monitorItemLabel = computed(() => {
  if (monitorLayer.value === 'road') return '变形'
  if (monitorLayer.value === 'tunnel') return '位移'
  return '应变'
})
const overlimitStats = [
  { area: '上城区', name: '临丁桥', count: 13, online: '在线' },
  { area: '上城区', name: '九井桥', count: 1, online: '离线' },
  { area: '滨江区', name: '合连桥', count: 3, online: '在线' },
  { area: '滨江区', name: '乌桥', count: 15, online: '离线' },
  { area: '萧山区', name: '康家桥', count: 0, online: '在线' },
  { area: '余杭区', name: '复兴大桥', count: 8, online: '在线' },
  { area: '拱墅区', name: '半山桥', count: 2, online: '离线' },
]
const todayMaxOverlimit = [
  { name: '备塘河桥(东路)', plate: '浙A65751', weight: 12.96 },
  { name: '复兴大道', plate: '浙BQ9D2', weight: 6.3 },
  { name: '大明桥', plate: '浙A37J86', weight: 50.372 },
  { name: '复兴人桥', plate: '浙AAS7649', weight: 5.57 },
  { name: '庄博机动车道', plate: '浙A022L1', weight: 2.06 },
  { name: '康家桥(石径)', plate: '浙A06X6N', weight: 4.96 },
  { name: '义红快速路果带', plate: '浙AB55ZJ', weight: 14.48 },
]

const cities = [
  { name: '杭州', x: 230, y: 200, color: '#5b8ff9' },
  { name: '宁波', x: 400, y: 280, color: '#5ad8a6' },
  { name: '温州', x: 420, y: 390, color: '#f6bd16' },
  { name: '绍兴', x: 320, y: 220, color: '#e86452' },
  { name: '湖州', x: 220, y: 130, color: '#6dc8ec' },
  { name: '嘉兴', x: 310, y: 120, color: '#945fb9' },
  { name: '金华', x: 280, y: 310, color: '#5b8ff9' },
  { name: '衢州', x: 170, y: 320, color: '#5ad8a6' },
  { name: '台州', x: 430, y: 340, color: '#f6bd16' },
  { name: '丽水', x: 340, y: 390, color: '#e86452' },
  { name: '舟山', x: 500, y: 200, color: '#6dc8ec' },
]


const taskSections = computed(() => {
  const name = layerNameMap[activeLayer.value]
  return [
    {
      title: '隐患排查',
      items: [
        { value: '999', label: '排查总数' },
        { value: '200', label: '排查已完成' },
        { value: '19.99%', label: '完成率' },
      ],
    },
    {
      title: '检测任务',
      items: [
        { value: '200', label: `应检${name}` },
        { value: '40', label: `已检${name}` },
        { value: '19.9%', label: '完成率' },
        { value: '30', label: '即将超期（不足30天）' },
        { value: '10', label: '超期未检' },
      ],
    },
    {
      title: '安全评估',
      items: [
        { value: '999', label: '评估总数' },
        { value: '200', label: '评估已完成' },
        { value: '19.9%', label: '完成率' },
      ],
    },
  ]
})

// 监测模块数据（按图层切换）
const monitorDataMap: Record<string, { total: number; online: number; onlineRate: number; accessCount: number; accessRate: number }> = {
  road: { total: 340, online: 326, onlineRate: 95.9, accessCount: 168, accessRate: 49.4 },
  bridge: { total: 1235, online: 1131, onlineRate: 91.6, accessCount: 856, accessRate: 85.3 },
  tunnel: { total: 567, online: 549, onlineRate: 96.8, accessCount: 412, accessRate: 92.1 },
}
const monitorData = computed(() => monitorDataMap[activeLayer.value])

// 监测模块子设备柱状图配置
const deviceSubConfig: Record<string, { categories: string[]; values: number[]; color: string }> = {
  road: { categories: ['道路边坡\n监测设备'], values: [486], color: '#5b8ff9' },
  bridge: { categories: ['桥梁环境\n监测设备', '桥梁作业\n监测设备', '桥梁结构\n监测设备'], values: [386, 452, 397], color: '#5ad8a6' },
  tunnel: { categories: ['隧道环境\n监测设备', '隧道机电\n监测设备', '隧道结构\n监测设备'], values: [198, 215, 154], color: '#6dc8ec' },
}

// 初始化环形图
function initRingChart(container: HTMLElement, rate: number, color: string) {
  const chart = echarts.init(container)
  chart.setOption({
    series: [{
      type: 'pie', radius: ['62%', '82%'], center: ['50%', '45%'],
      label: { show: true, position: 'center', formatter: rate.toFixed(1) + '%', fontSize: 13, fontWeight: 700, color },
      labelLine: { show: false },
      data: [
        { value: rate, itemStyle: { color } },
        { value: 100 - rate, itemStyle: { color: 'rgba(255,255,255,0.06)' } },
      ],
    }],
  })
  return chart
}

// 初始化子设备柱状图
function initDeviceSubChart() {
  const container = deviceSubChartRef.value
  if (!container) return
  if (deviceSubChart) deviceSubChart.dispose()
  deviceSubChart = echarts.init(container)
  const cfg = deviceSubConfig[activeLayer.value]
  deviceSubChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '4%', right: '8%', bottom: '18%', top: '12%', containLabel: true },
    xAxis: {
      type: 'category', data: cfg.categories,
      axisLabel: { fontSize: 10, interval: 0, color: 'rgba(255,255,255,0.5)' },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } },
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(100,160,255,0.08)' } }, axisLabel: { color: 'rgba(255,255,255,0.4)' } },
    series: [{
      type: 'bar', data: cfg.values, barMaxWidth: 32,
      itemStyle: { color: cfg.color, borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', formatter: '{c}' },
    }],
  })
  // 桥梁图层：点击“桥梁结构”进入下钻
  if (activeLayer.value === 'bridge') {
    deviceSubChart.on('click', (params: any) => {
      if (params.name && params.name.includes('桥梁结构')) {
        bridgeDeviceDrillDown.value = true
        nextTick(() => initBridgeDrillChart())
      }
    })
  }
}

// 桥梁结构监测设备下钻子图表
function initBridgeDrillChart() {
  const container = bridgeDrillChartRef.value
  if (!container) return
  if (bridgeDrillChart) bridgeDrillChart.dispose()
  bridgeDrillChart = echarts.init(container)
  bridgeDrillChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '4%', right: '8%', bottom: '15%', top: '12%', containLabel: true },
    xAxis: {
      type: 'category', data: ['吊杆索力\n振动', '位移', '挠度', '应变', '振动'],
      axisLabel: { fontSize: 11, interval: 0, color: 'rgba(255,255,255,0.5)' },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } },
    },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(100,160,255,0.08)' } }, axisLabel: { color: 'rgba(255,255,255,0.4)' } },
    series: [{
      type: 'bar', data: [86, 124, 98, 156, 132], barMaxWidth: 36,
      itemStyle: { color: '#5ad8a6', borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', formatter: '{c}' },
    }],
  })
}

// 初始化监测模块图表
function initMonitorModuleCharts() {
  const data = monitorData.value
  if (onlineRingRef.value) {
    if (onlineRingChart) onlineRingChart.dispose()
    onlineRingChart = initRingChart(onlineRingRef.value, data.onlineRate, '#5ad8a6')
  }
  if (accessRingRef.value) {
    if (accessRingChart) accessRingChart.dispose()
    accessRingChart = initRingChart(accessRingRef.value, data.accessRate, '#6dc8ec')
  }
  nextTick(() => initDeviceSubChart())
}

// 任务清单图表初始化
function initTaskRing(container: HTMLElement, rate: number, color: string) {
  const chart = echarts.init(container)
  chart.setOption({
    series: [{
      type: 'pie', radius: ['58%', '80%'], center: ['50%', '50%'],
      label: { show: true, position: 'center', formatter: rate + '%', fontSize: 12, fontWeight: 700, color },
      labelLine: { show: false },
      data: [
        { value: rate, itemStyle: { color } },
        { value: 100 - rate, itemStyle: { color: 'rgba(255,255,255,0.06)' } },
      ],
    }],
  })
  return chart
}
function initTaskCharts() {
  if (hazardRateRef.value) {
    if (hazardRateChart) hazardRateChart.dispose()
    hazardRateChart = initTaskRing(hazardRateRef.value, 19.99, '#5ad8a6')
  }
  if (inspectRateRef.value) {
    if (inspectRateChart) inspectRateChart.dispose()
    inspectRateChart = initTaskRing(inspectRateRef.value, 19.9, '#5b8ff9')
  }
  if (assessRateRef.value) {
    if (assessRateChart) assessRateChart.dispose()
    assessRateChart = initTaskRing(assessRateRef.value, 19.9, '#6dc8ec')
  }
  if (inspectBarRef.value) {
    if (inspectBarChart) inspectBarChart.dispose()
    inspectBarChart = echarts.init(inspectBarRef.value)
    inspectBarChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '2%', right: '12%', top: '10%', bottom: '8%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
        splitLine: { lineStyle: { color: 'rgba(100,160,255,0.08)', type: 'dashed' } },
      },
      yAxis: {
        type: 'category', data: ['超期未检', '即将超期（不足30天）'],
        axisLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', interval: 0 },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [{
        type: 'bar', data: [
          { value: 10, itemStyle: { color: '#e86452' } },
          { value: 30, itemStyle: { color: '#f6bd16' } },
        ],
        barWidth: '45%', itemStyle: { borderRadius: [0, 3, 3, 0] },
        label: { show: true, position: 'right', fontSize: 11, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' },
      }],
    })
  }
}

function initCharts() {
  if (statsChartRef.value) {
    statsChart = echarts.init(statsChartRef.value)
    updateStatsChart()
  }
  if (riskChartRef.value) {
    riskChart = echarts.init(riskChartRef.value)
    riskChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
        label: {
          show: true, position: 'inside', fontSize: 11, fontWeight: 700, color: '#fff',
          formatter: '{c}',
        },
        data: [
          { name: '一级预警', value: 68, itemStyle: { color: '#945fb9' } },
          { name: '二级预警', value: 58, itemStyle: { color: '#5b8ff9' } },
          { name: '三级预警', value: 42, itemStyle: { color: '#e86452' } },
        ],
      }],
    })
  }
}
function updateStatsChart() {
  if (!statsChart) return
  const cats = currentCategories.value
  const isRoad = activeLayer.value === 'road'
  
  let tooltipConfig: any
  if (isRoad) {
    tooltipConfig = {
      trigger: 'item',
      confine: true,
      position: function(point: any, params: any, dom: any, rect: any, size: any) {
        // 确保 tooltip 不超出容器
        const x = Math.min(point[0], size.viewSize[0] - size.contentSize[0] - 10)
        const y = Math.max(point[1] - size.contentSize[1] - 10, 10)
        return [Math.max(x, 10), y]
      },
      formatter: (params: any) => {
        const item = cats.find((c: any) => c.name === params.name)
        if (!item) return `${params.name}: ${params.value} km (${params.percent}%)`
        const isInRange = item.density >= item.recommendRange[0] && item.density <= item.recommendRange[1]
        const statusColor = isInRange ? '#52c41a' : '#ff4d4f'
        const statusText = isInRange ? '达标' : '不达标'
        return `<div style="padding: 4px 0">
          <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px">${item.name}</div>
          <div style="margin-bottom: 4px">
            <span style="display:inline-block;width:8px;height:8px;background:${item.color};border-radius:2px;margin-right:6px"></span>
            道路长度：<b>${item.num}</b> km
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
  } else {
    tooltipConfig = { trigger: 'item', confine: true, formatter: '{b}: {c}座 ({d}%)' }
  }
  
  statsChart.setOption({
    tooltip: tooltipConfig,
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      label: { show: false },
      data: cats.map(c => ({ name: c.name, value: c.num, itemStyle: { color: c.color } })),
    }],
  })
}

onMounted(() => {
  // 处理从点位监测页返回时的query参数
  if (route.query.tab === 'monitor') {
    cockpitTab.value = 'monitor'
    if (route.query.layer === 'bridge') monitorLayer.value = 'bridge'
  }
  setTimeout(() => { initCharts(); initMonitorModuleCharts(); initTaskCharts() }, 100)
  // 初始化高德地图
  if ((window as any).AMap) {
    setTimeout(() => { initOverviewMap() }, 200)
  }
  // 点位监测弹窗跳转
  (window as any).__goBridgePointMonitor = (name?: string) => router.push({ path: '/bridge-point-monitor', query: { name: name || '' } })
})
onUnmounted(() => {
  statsChart?.dispose(); riskChart?.dispose()
  alarmTrendChart?.dispose(); timeFlowChart?.dispose()
  onlineRingChart?.dispose(); accessRingChart?.dispose()
  deviceSubChart?.dispose(); bridgeDrillChart?.dispose()
  hazardRateChart?.dispose(); inspectRateChart?.dispose()
  assessRateChart?.dispose(); inspectBarChart?.dispose()
  overviewMap?.destroy(); monitorMap?.destroy()
  delete (window as any).__goBridgePointMonitor
})

// 返回工作台
const handleGoToDashboard = () => {
  router.push('/dashboard')
}

// 监测模块查看详情
const openMonitorDetail = () => {
  if (activeLayer.value === 'road') {
    showRoadDeviceDetail.value = true
  } else if (activeLayer.value === 'bridge') {
    showBridgeDeviceDetail.value = true
  } else if (activeLayer.value === 'tunnel') {
    showTunnelDeviceDetail.value = true
  }
}

// 在线监测图表
const alarmTrendChartRef = ref<HTMLElement | null>(null)
const timeFlowChartRef = ref<HTMLElement | null>(null)
let alarmTrendChart: echarts.ECharts | null = null
let timeFlowChart: echarts.ECharts | null = null

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

watch(cockpitTab, (val) => {
  if (val === 'monitor') {
    nextTick(() => {
      setTimeout(initMonitorCharts, 50)
      setTimeout(initMonitorMap, 200)
    })
  }
})
watch(monitorLayer, (val) => {
  if (val === 'bridge' && cockpitTab.value === 'monitor') {
    nextTick(() => { setTimeout(initMonitorCharts, 50) })
  }
  initMonitorMapOverlays()
})
watch(activeLayer, () => {
  bridgeDeviceDrillDown.value = false
  nextTick(() => {
    if (statsChart) { statsChart.dispose(); statsChart = null }
    if (statsChartRef.value) {
      statsChart = echarts.init(statsChartRef.value)
      updateStatsChart()
    }
    initMonitorModuleCharts()
    initTaskCharts()
    initMapOverlays()
    if (riskType.value === 'device' && riskChartRef.value) {
      if (riskChart) riskChart.dispose()
      riskChart = echarts.init(riskChartRef.value)
      riskChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [{
          type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
          label: { show: true, position: 'inside', fontSize: 11, fontWeight: 700, color: '#fff', formatter: '{c}' },
          data: [
            { name: '一级预警', value: 68, itemStyle: { color: '#945fb9' } },
            { name: '二级预警', value: 58, itemStyle: { color: '#5b8ff9' } },
            { name: '三级预警', value: 42, itemStyle: { color: '#e86452' } },
          ],
        }],
      })
    }
    if (riskType.value === 'hidden') initHiddenRiskChart()
    if (riskType.value === 'assess') initAssessChart()
  })
})

function initHiddenRiskChart() {
  nextTick(() => {
    if (hiddenRiskChartRef.value) {
      if (hiddenRiskChart) hiddenRiskChart.dispose()
      hiddenRiskChart = echarts.init(hiddenRiskChartRef.value)
      hiddenRiskChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [{
          type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
          label: { show: true, position: 'inside', fontSize: 11, fontWeight: 700, color: '#fff', formatter: '{c}' },
          data: [
            { name: '一般隐患', value: 52, itemStyle: { color: '#5b8ff9' } },
            { name: '较大隐患', value: 32, itemStyle: { color: '#f6bd16' } },
            { name: '重大隐患', value: 12, itemStyle: { color: '#e86452' } },
          ],
        }],
      })
    }
  })
}

function initAssessChart() {
  nextTick(() => {
    if (assessChartRef.value) {
      if (assessChart) assessChart.dispose()
      assessChart = echarts.init(assessChartRef.value)
      assessChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        series: [{
          type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
          label: { show: true, position: 'inside', fontSize: 11, fontWeight: 700, color: '#fff', formatter: '{c}' },
          data: [
            { name: '一般隐患', value: 48, itemStyle: { color: '#5b8ff9' } },
            { name: '较大隐患', value: 28, itemStyle: { color: '#f6bd16' } },
            { name: '重大隐患', value: 10, itemStyle: { color: '#e86452' } },
          ],
        }],
      })
    }
  })
}

watch(riskType, (val) => {
  if (val === 'device') {
    nextTick(() => {
      if (riskChartRef.value) {
        if (riskChart) riskChart.dispose()
        riskChart = echarts.init(riskChartRef.value)
        riskChart.setOption({
          tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
          series: [{
            type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
            label: { show: true, position: 'inside', fontSize: 11, fontWeight: 700, color: '#fff', formatter: '{c}' },
            data: [
              { name: '一级预警', value: 68, itemStyle: { color: '#945fb9' } },
              { name: '二级预警', value: 58, itemStyle: { color: '#5b8ff9' } },
              { name: '三级预警', value: 42, itemStyle: { color: '#e86452' } },
            ],
          }],
        })
      }
    })
  } else if (val === 'hidden') {
    initHiddenRiskChart()
  } else if (val === 'assess') {
    initAssessChart()
  }
})
</script>

<style scoped lang="scss">
.cockpit-page {
  width: 1920px; height: 1080px;
  background: #0a1628;
  display: flex;
  flex-direction: column;
  color: #e0e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
}

.cockpit-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; height: 40px;
  background: linear-gradient(90deg, #0d1f3c, #152d50, #0d1f3c);
  border-bottom: 1px solid rgba(100, 160, 255, 0.15); flex-shrink: 0;
}
.cockpit-tabs { display: flex; gap: 4px; }
.cockpit-tab {
  padding: 6px 20px; border-radius: 4px; font-size: 13px; cursor: pointer;
  color: rgba(255,255,255,0.6); transition: all 0.2s;
  &.active { background: rgba(91,143,249,0.25); color: #5b8ff9; font-weight: 500; }
  &:hover:not(.active) { color: rgba(255,255,255,0.8); }
}
.cockpit-title {
  font-size: 18px; font-weight: 600; letter-spacing: 2px;
  background: linear-gradient(90deg, #5b8ff9, #5ad8a6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.cockpit-nav { display: flex; gap: 20px;
  .nav-link { font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; &:hover { color: #5b8ff9; } }
}

.cockpit-body {
  flex: 1; display: grid; grid-template-columns: 440px 1fr 440px;
  gap: 8px; padding: 8px; min-height: 0;
}
.panel { display: flex; flex-direction: column; gap: 8px; }
.panel-left, .panel-right { display: grid; grid-template-rows: 1fr 1fr; gap: 8px; }

.dark-card {
  background: linear-gradient(180deg, rgba(13,31,60,0.95), rgba(10,22,40,0.98));
  border: 1px solid rgba(100,160,255,0.12); border-radius: 8px; padding: 10px;
}
.card-title {
  font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9);
  margin-bottom: 6px; padding-left: 10px; border-left: 3px solid #5b8ff9;
}
.card-title-row {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .card-title { margin-bottom: 0; }
}

/* 道路统计 */
.road-stats { margin-bottom: 12px; }
.stat-grid { display: flex; gap: 14px; margin-bottom: 10px; }
.stat-block { flex: 1; }
.stat-block.sub { margin-top: 4px; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.55); margin-bottom: 4px; }
.stat-value {
  font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums;
  &.blue { color: #5b8ff9; }
  &.cyan { color: #6dc8ec; }
  &.orange { color: #f6a816; font-size: 20px; }
  &.green { color: #5ad8a6; }
  &.yellow { color: #f6bd16; }
  .stat-unit { font-size: 12px; font-weight: 400; color: rgba(255,255,255,0.45); }
}

.road-detail { display: flex; gap: 12px; align-items: center; }
.chart-small { width: 100px; height: 100px; flex-shrink: 0; }
.chart-medium { width: 120px; height: 120px; margin: 0 auto; }

.road-categories {
  flex: 1; display: flex; flex-direction: column; gap: 6px;
  .cat-item { display: flex; align-items: center; gap: 6px; font-size: 12px; }
  .cat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .cat-name { color: rgba(255,255,255,0.6); flex: 1; }
  .cat-val { color: rgba(255,255,255,0.85); font-weight: 500; font-variant-numeric: tabular-nums; font-size: 11px; }
}

/* 监测模块 */
.monitor-module-card { overflow: hidden; }
.monitor-ring-row { display: flex; gap: 16px; }
.ring-group { flex: 1; display: flex; flex-direction: column; align-items: center; }
.ring-title { font-size: 12px; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
.ring-chart-lg { width: 100px; height: 80px; }
.ring-group-labels { display: flex; gap: 14px; margin-top: 6px; }
.ring-stat { display: flex; flex-direction: column; align-items: center; }
.rs-val { font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums;
  &.blue { color: #5b8ff9; } &.green { color: #5ad8a6; } &.orange { color: #e8965a; }
}
.rs-lbl { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 2px; }

.device-sub-area { margin-top: 14px; height: 130px; position: relative; }
.device-sub-chart { width: 100%; height: 100%; }
.monitor-detail-footer {
  display: flex; justify-content: flex-end; margin-top: 8px;
  .monitor-detail-btn {
    font-size: 12px; color: #5b8ff9; cursor: pointer;
    &:hover { color: #7ba7ff; text-decoration: underline; }
  }
}
.drill-down-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  .drill-back-btn { font-size: 11px; color: #5b8ff9; cursor: pointer; }
  .drill-down-title { font-size: 12px; color: rgba(255,255,255,0.7); }
}

/* 地图区 */
.map-card { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.map-toolbar { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-bottom: 8px; position: relative; }
.monitor-map-toolbar { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-bottom: 8px; position: relative; }
.map-btn {
  padding: 4px 14px; border-radius: 4px; font-size: 12px; cursor: pointer;
  color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.04);
  &.active { background: rgba(91,143,249,0.2); color: #5b8ff9; border: 1px solid rgba(91,143,249,0.3); }
}
.map-selector {
  padding: 4px 14px; background: rgba(91,143,249,0.15);
  border: 1px solid rgba(91,143,249,0.3); border-radius: 4px; font-size: 12px; color: #5b8ff9; cursor: pointer;
  position: relative; display: flex; align-items: center; gap: 6px;
  .selector-arrow { font-size: 10px; transition: transform 0.2s; &.open { transform: rotate(180deg); } }
  .city-dropdown {
    position: absolute; top: 100%; right: 0; margin-top: 4px;
    min-width: 120px; padding: 4px 0;
    background: rgba(13,31,60,0.98); border: 1px solid rgba(91,143,249,0.3); border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4); z-index: 100;
    max-height: 320px; overflow-y: auto;
    .dropdown-item {
      padding: 6px 14px; font-size: 12px; color: rgba(255,255,255,0.7); cursor: pointer; white-space: nowrap;
      &:hover { background: rgba(91,143,249,0.15); color: #5b8ff9; }
      &.active { color: #5b8ff9; font-weight: 500; }
    }
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.4); border-radius: 2px; }
  }
}
.map-area {
  flex: 1; display: flex; align-items: center; justify-content: center;
  background: radial-gradient(ellipse at center, rgba(26,58,92,0.4), transparent 70%);
  border-radius: 6px; min-height: 300px; position: relative; overflow: hidden;
}
.amap-container {
  position: absolute; inset: 0; z-index: 0; border-radius: 6px;
  &.amap-container { background: #0a1628 !important; }
}
.map-type-toggle {
  display: flex; background: rgba(10,22,40,0.85); border: 1px solid rgba(100,160,255,0.2);
  border-radius: 4px; overflow: hidden; cursor: pointer;
  span {
    padding: 3px 10px; font-size: 11px; color: rgba(255,255,255,0.5);
    transition: all 0.2s;
    &:hover { color: rgba(255,255,255,0.8); }
    &.active { background: rgba(91,143,249,0.25); color: #5b8ff9; }
  }
}
.monitor-map-toggle {
  position: absolute; top: 8px; right: 8px; z-index: 10;
}

.layer-btns .layer-btn {
  padding: 3px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;
  color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06);
  border: 1px solid rgba(100,160,255,0.15); transition: all 0.2s;
  &:hover { color: rgba(255,255,255,0.8); }
  &.active { background: rgba(91,143,249,0.25); color: #5b8ff9; border-color: rgba(91,143,249,0.4); }
}
.map-svg { width: 100%; max-width: 560px; height: auto; position: relative; z-index: 2; }

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
.layer-btns {
  display: flex; flex-direction: column; gap: 6px;
}
.map-layer-tabs {
  position: absolute; left: 50%; transform: translateX(-50%);
  display: flex; gap: 4px;
  background: rgba(13,31,60,0.85); border: 1px solid rgba(100,160,255,0.25); border-radius: 6px;
  padding: 4px 6px;
  .layer-tab {
    padding: 4px 16px; border-radius: 4px; font-size: 13px; cursor: pointer;
    color: rgba(255,255,255,0.55); background: transparent; transition: all 0.2s;
    &:hover { color: rgba(255,255,255,0.85); }
    &.active { background: rgba(91,143,249,0.3); color: #5b8ff9; font-weight: 500; }
  }
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

/* 任务清单 */
.task-list-v2 { display: flex; flex-direction: column; gap: 10px; }
.task-card {
  background: rgba(255,255,255,0.02); border-radius: 8px; padding: 10px 12px;
  border: 1px solid rgba(100,160,255,0.06);
}
.task-card-title {
  font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.75);
  margin-bottom: 8px; padding-left: 8px; border-left: 2px solid #5b8ff9;
}
.task-card-row { display: flex; align-items: center; gap: 8px; }
.task-mini-stats { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.tms-item { display: flex; align-items: baseline; gap: 4px; }
.tms-val { font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums;
  &.blue { color: #5b8ff9; } &.green { color: #5ad8a6; }
}
.tms-lbl { font-size: 10px; color: rgba(255,255,255,0.45); }
.task-ring-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.task-ring-title { font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 1px; }
.task-ring { width: 80px; height: 64px; }
.task-bar-chart { width: 100%; height: 72px; margin-top: 6px; }

/* 风险清单 */
.risk-card {
  display: flex; flex-direction: column; overflow: hidden; flex: 1;
}
.risk-type-tabs {
  display: flex; gap: 4px;
  .risk-type-tab {
    font-size: 11px; padding: 2px 8px; border-radius: 3px; cursor: pointer;
    color: rgba(255,255,255,0.5); border: 1px solid rgba(255,255,255,0.12);
    transition: all 0.2s;
    &:hover { color: rgba(255,255,255,0.8); }
    &.active { background: rgba(91,143,249,0.25); color: #5b8ff9; border-color: rgba(91,143,249,0.4); }
  }
}
.risk-section { margin-bottom: 6px; text-align: center; }
.risk-legend {
  display: flex; gap: 8px; margin-top: 4px; justify-content: center;
  .legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.6); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
}
.risk-metrics { display: flex; gap: 6px;
  .risk-item { flex: 1; text-align: center; background: rgba(255,255,255,0.03); border-radius: 6px; padding: 6px 4px; }
  .risk-num { font-size: 20px; font-weight: 700; margin-bottom: 2px;
    &.orange { color: #f6a816; } &.green { color: #5ad8a6; } &.cyan { color: #6dc8ec; }
  }
  .risk-label { font-size: 11px; color: rgba(255,255,255,0.5); }
}
.risk-placeholder { padding: 8px 0; }
.risk-alert-list {
  margin-top: 6px; flex: 1; min-height: 0; display: flex; flex-direction: column;
  .risk-alert-header {
    display: flex; align-items: center; padding: 4px 6px; font-size: 11px; gap: 4px;
    color: rgba(255,255,255,0.5); background: rgba(91,143,249,0.08);
    border-radius: 4px 4px 0 0; flex-shrink: 0;
  }
  .risk-alert-body {
    flex: 1; overflow-y: auto; min-height: 0;
    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.3); border-radius: 2px; }
  }
  .risk-alert-row {
    display: flex; align-items: center; padding: 4px 6px; font-size: 11px; gap: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    &:hover { background: rgba(91,143,249,0.06); }
  }
  .ra-col-area { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-point { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-item { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-project { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-entity { flex: 1.5; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-content { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-level { flex: 1; }
  .ra-col-grade { flex: 1; }
  .ra-col-rectype { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ra-col-status { flex: 1; }
}
.alert-tag-1 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(148,95,185,0.2); color: #945fb9; }
.alert-tag-2 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(91,143,249,0.2); color: #5b8ff9; }
.alert-tag-3 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(232,100,82,0.2); color: #e86452; }
.hidden-tag-1 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(91,143,249,0.2); color: #5b8ff9; }
.hidden-tag-2 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(246,189,22,0.2); color: #f6bd16; }
.hidden-tag-3 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(232,100,82,0.2); color: #e86452; }
.grade-tag-A { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(90,216,166,0.2); color: #5ad8a6; }
.grade-tag-B { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(91,143,249,0.2); color: #5b8ff9; }
.grade-tag-C { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(246,189,22,0.2); color: #f6bd16; }
.grade-tag-D { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(232,100,82,0.2); color: #e86452; }
.grade-tag-E { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(148,95,185,0.2); color: #945fb9; }
.status-done { font-size: 10px; color: #5ad8a6; }
.status-undone { font-size: 10px; color: #e86452; }
.risk-detail-btn-wrap {
  margin-top: auto; text-align: right; flex-shrink: 0;
}
.risk-detail-btn {
  font-size: 12px; color: #5b8ff9; cursor: pointer; padding: 4px 10px;
  border: 1px solid rgba(91,143,249,0.3); border-radius: 4px;
  transition: all 0.2s;
  &:hover { background: rgba(91,143,249,0.15); color: #7da8fb; }
}
.grade-tag-不合格 { font-size: 10px; padding: 1px 4px; border-radius: 2px; background: rgba(232,100,82,0.2); color: #e86452; }
</style>

<style lang="scss">
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

.facility-modal {
  .ant-modal-content {
    background: linear-gradient(180deg, #0d1f3c, #0a1628);
    border: 1px solid rgba(100,160,255,0.15); border-radius: 10px;
  }
  .ant-modal-header {
    background: transparent; border-bottom: 1px solid rgba(100,160,255,0.1);
    .ant-modal-title { color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 600; }
  }
  .ant-modal-close { color: rgba(255,255,255,0.4); &:hover { color: rgba(255,255,255,0.8); } }
  .ant-modal-body { padding: 16px 20px; }

  .facility-tabs {
    .ant-tabs-nav::before { border-bottom-color: rgba(100,160,255,0.1); }
    .ant-tabs-tab {
      color: rgba(255,255,255,0.5); padding: 8px 20px;
      &:hover { color: rgba(255,255,255,0.8); }
      &.ant-tabs-tab-active .ant-tabs-tab-btn { color: #5b8ff9; font-weight: 500; }
    }
    .ant-tabs-ink-bar { background: #5b8ff9; }
  }

  .ant-table {
    background: transparent; color: rgba(255,255,255,0.75);
    .ant-table-header {
      background: transparent; border-radius: 0;
    }
    &.ant-table-bordered .ant-table-thead > tr > th,
    &.ant-table-bordered .ant-table-tbody > tr > td {
      border-right: 1px solid rgba(100,160,255,0.2) !important;
    }
    &.ant-table-bordered .ant-table-thead > tr > th,
    &.ant-table-bordered .ant-table-tbody > tr > td,
    &.ant-table-bordered .ant-table-thead > tr > th[colspan] {
      border-bottom: 1px solid rgba(100,160,255,0.2) !important;
    }
    &.ant-table-bordered .ant-table-cell-fix-left-last::after {
      border-right: 1px solid rgba(100,160,255,0.2) !important;
    }
    &.ant-table-bordered > .ant-table-container {
      border: 1px solid rgba(100,160,255,0.2) !important;
      border-right: 0 !important;
      border-bottom: 0 !important;
    }
    &.ant-table-bordered > .ant-table-container > .ant-table-content > table,
    &.ant-table-bordered > .ant-table-container > .ant-table-header > table {
      border-top: 0;
    }
    .ant-table-thead > tr > th {
      background: rgba(91,143,249,0.1) !important;
      color: rgba(255,255,255,0.8);
      font-size: 12px; font-weight: 500; padding: 8px 10px;
      &::before { display: none; }
    }
    .ant-table-thead > tr > th[colspan] {
      background: rgba(91,143,249,0.15) !important; text-align: center;
    }
    .ant-table-tbody > tr > td {
      background: transparent !important; color: rgba(255,255,255,0.7);
      font-size: 12px; padding: 7px 10px;
    }
    .ant-table-tbody > tr:hover > td {
      background: rgba(91,143,249,0.08) !important;
    }
    .ant-table-placeholder { background: transparent; }
    .ant-empty-description { color: rgba(255,255,255,0.35); }
    /* 滚动条深色主题 */
    .ant-table-body, .ant-table-content {
      scrollbar-width: thin;
      scrollbar-color: rgba(91,143,249,0.5) rgba(255,255,255,0.04);
      &::-webkit-scrollbar { width: 8px; height: 8px; }
      &::-webkit-scrollbar-track { background: rgba(255,255,255,0.04); border-radius: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.5); border-radius: 4px; &:hover { background: rgba(91,143,249,0.7); } }
      &::-webkit-scrollbar-corner { background: rgba(255,255,255,0.04); }
    }
  }

  .ant-table-cell-fix-left {
    background: rgba(13,31,60,0.98) !important;
  }
  .ant-table-tbody > tr:hover .ant-table-cell-fix-left {
    background: rgba(20,40,70,0.98) !important;
  }
}

// 在线监测页面样式
.monitor-body {
  grid-template-columns: 440px 1fr 460px !important;
}
.monitor-left { display: flex; flex-direction: column; gap: 8px; }
.monitor-center { display: flex; flex-direction: column; gap: 8px; }
.monitor-right { display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }

.monitor-device-card { flex: 0 1 auto; display: flex; flex-direction: column; overflow: hidden; }
.device-list {
  flex: 1; overflow-y: auto; margin-top: 8px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.4); border-radius: 3px; }
}
.device-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 0 2px; border-top: 1px solid rgba(100,160,255,0.1); margin-top: 8px;
  font-size: 12px; color: rgba(255,255,255,0.5);
  b { color: #5b8ff9; }
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
}

.status-tag {
  display: inline-block; padding: 1px 8px; border-radius: 3px; font-size: 11px;
  &.normal { background: rgba(90,216,166,0.15); color: #5ad8a6; }
  &.abnormal { background: rgba(232,100,82,0.15); color: #e86452; }
}
.online-tag {
  display: inline-block; padding: 1px 8px; border-radius: 3px; font-size: 11px;
  &.online { background: rgba(90,216,166,0.15); color: #5ad8a6; }
  &.offline { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); }
}
.weight-cell { color: #f6a816; font-weight: 600; }

.monitor-map-card { flex: 1; min-height: 200px; display: flex; flex-direction: column; position: relative; }
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
.monitor-svg { width: 100%; height: 100%; position: relative; z-index: 2; }

.alarm-stats-card { flex: 1; min-height: 0; overflow: hidden; }
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
  .link-btn { font-size: 12px; }
}

.overlimit-card { flex-shrink: 0; }
.time-chart-card { flex-shrink: 0; }
.time-flow-chart { height: 130px; }
.max-overlimit-card { flex-shrink: 0; }

.card-sub-title { font-size: 12px; color: rgba(255,255,255,0.5); margin: 6px 0 4px; }
.map-filter-bar {
  position: absolute; top: 12px; left: 12px; z-index: 10;
  .map-city-select {
    background: rgba(13,31,60,0.9); border: 1px solid rgba(100,160,255,0.3); border-radius: 4px;
    color: rgba(255,255,255,0.8); padding: 4px 10px; font-size: 13px; outline: none;
    cursor: pointer; min-width: 100px;
    option { background: #0d1f3c; color: #fff; }
    &:focus { border-color: #5b8ff9; }
  }
}
.map-layer-panel {
  display: none; /* replaced by horizontal tabs */
}
.link-btn { font-size: 12px; color: #5b8ff9; cursor: pointer; text-decoration: none; &:hover { text-decoration: underline; } }

.modal-filter-bar {
  display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
  .filter-item {
    display: flex; align-items: center; gap: 6px;
    .filter-label { font-size: 13px; color: rgba(255,255,255,0.7); white-space: nowrap; }
  }
  .filter-select, .filter-input {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(100,160,255,0.2); border-radius: 4px;
    color: rgba(255,255,255,0.75); padding: 4px 10px; font-size: 13px; outline: none; height: 30px;
    &::placeholder { color: rgba(255,255,255,0.35); }
    &:focus { border-color: #5b8ff9; }
  }
  .filter-select { min-width: 120px; option { background: #0d1f3c; color: #fff; } }
  .filter-input { min-width: 140px; }
  .filter-btn {
    background: #5b8ff9; color: #fff; border: none; border-radius: 4px; padding: 4px 16px;
    font-size: 13px; cursor: pointer; height: 30px;
    &:hover { background: #4a7de8; }
  }
}

.device-detail-modal, .alarm-detail-modal, .risk-detail-modal {
  .ant-modal-content {
    background: linear-gradient(180deg, #0d1f3c, #0a1628);
    border: 1px solid rgba(100,160,255,0.15); border-radius: 10px;
  }
  .ant-modal-header {
    background: transparent; border-bottom: 1px solid rgba(100,160,255,0.1);
    .ant-modal-title { color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 600; }
  }
  .ant-modal-close { color: rgba(255,255,255,0.4); &:hover { color: rgba(255,255,255,0.8); } }
  .ant-modal-body { padding: 16px 20px; }
  .ant-table {
    background: transparent; color: rgba(255,255,255,0.75);
    .ant-table-header { background: transparent; border-radius: 0; }
    &.ant-table-bordered .ant-table-thead > tr > th,
    &.ant-table-bordered .ant-table-tbody > tr > td {
      border-right: 1px solid rgba(100,160,255,0.2) !important;
    }
    &.ant-table-bordered .ant-table-thead > tr > th,
    &.ant-table-bordered .ant-table-tbody > tr > td,
    &.ant-table-bordered .ant-table-thead > tr > th {
      border-color: rgba(100,160,255,0.15) !important;
    }
    .ant-table-thead > tr > th {
      background: rgba(91,143,249,0.08) !important; color: rgba(255,255,255,0.6) !important;
      font-size: 12px; padding: 8px 6px; border-bottom: 1px solid rgba(100,160,255,0.15);
    }
    .ant-table-tbody > tr > td {
      color: rgba(255,255,255,0.75) !important; font-size: 12px; padding: 7px 6px;
      border-bottom: 1px solid rgba(100,160,255,0.08);
      background: transparent !important;
    }
    .ant-table-tbody > tr:hover > td { background: rgba(91,143,249,0.06) !important; }
    .ant-pagination { margin-top: 12px;
      .ant-pagination-total-text { color: rgba(255,255,255,0.7); }
      .ant-pagination-item { background: transparent; border-color: rgba(100,160,255,0.2);
        a { color: rgba(255,255,255,0.7); }
      }
      .ant-pagination-item-active { border-color: #5b8ff9; background: rgba(91,143,249,0.15);
        a { color: #5b8ff9; }
      }
      .ant-pagination-prev, .ant-pagination-next {
        .ant-pagination-item-link { background: transparent; border-color: rgba(100,160,255,0.2); color: rgba(255,255,255,0.7); }
      }
    }
  }
}
</style>
