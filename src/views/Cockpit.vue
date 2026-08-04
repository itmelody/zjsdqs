<template>
  <div class="cockpit-page">
    <!-- 顶部子导航 -->
    <div class="cockpit-header">
      <div class="cockpit-tabs">
        <div class="cockpit-tab" :class="{ active: cockpitTab === 'overview' }" @click="cockpitTab = 'overview'">设施概览</div>
        <div class="cockpit-tab" :class="{ active: cockpitTab === 'monitor' }" @click="cockpitTab = 'monitor'">在线监测</div>
        <div class="cockpit-tab" :class="{ active: cockpitTab === 'ops2' }" @click="cockpitTab = 'ops2'">安全隐患排查整治</div>
        <div class="cockpit-tab" :class="{ active: cockpitTab === 'ops3' }" @click="cockpitTab = 'ops3'">安全隐患排查整治（备用）</div>
      </div>
      <div class="cockpit-title">浙江省城市道桥隧安全监管</div>
      <div class="cockpit-nav">
        <span class="nav-link" @click="router.push('/construction-projects')">项目管理</span>
        <span class="nav-link" @click="handleGoToDashboard">工作台</span>
      </div>
    </div>

    <!-- 总体态势主体内容区 -->
    <div class="cockpit-body" v-show="cockpitTab === 'overview'">
      <!-- 左侧面板 -->
      <div class="panel panel-left">
        <!-- 道路统计卡片 -->
        <div class="card dark-card stat-card-compact" @click="activeLayer = 'road'">
          <div class="card-title-row">
            <div class="card-title">道路统计</div>
            <span class="map-btn active" @click.stop="showFacilityModal = true">查看详情</span>
          </div>
          <div class="road-stats compact">
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
          <div class="road-detail compact">
            <div ref="statsChartRef" class="chart-small"></div>
            <div class="road-categories">
              <div class="cat-item" v-for="c in roadCategories" :key="c.name">
                <span class="cat-dot" :style="{ background: c.color }"></span>
                <span class="cat-name">{{ c.name }}</span>
                <span class="cat-val">{{ c.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 桥梁统计卡片 -->
        <div class="card dark-card stat-card-compact" @click="activeLayer = 'bridge'">
          <div class="card-title-row">
            <div class="card-title">桥梁统计</div>
            <span class="map-btn active" @click.stop="showBridgeModal = true">查看详情</span>
          </div>
          <div class="road-stats compact">
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
          <div class="road-detail compact">
            <div ref="bridgeStatsChartRef" class="chart-small"></div>
            <div class="road-categories">
              <div class="cat-item" v-for="c in bridgeCategories" :key="c.name">
                <span class="cat-dot" :style="{ background: c.color }"></span>
                <span class="cat-name">{{ c.name }}</span>
                <span class="cat-val">{{ c.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 隧道统计卡片 -->
        <div class="card dark-card stat-card-compact" @click="activeLayer = 'tunnel'">
          <div class="card-title-row">
            <div class="card-title">隧道统计</div>
            <span class="map-btn active" @click.stop="showTunnelModal = true">查看详情</span>
          </div>
          <div class="road-stats compact">
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
          <div class="road-detail compact">
            <div ref="tunnelStatsChartRef" class="chart-small"></div>
            <div class="road-categories">
              <div class="cat-item" v-for="c in tunnelCategories" :key="c.name">
                <span class="cat-dot" :style="{ background: c.color }"></span>
                <span class="cat-name">{{ c.name }}</span>
                <span class="cat-val">{{ c.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间地图区 -->
      <div class="panel panel-center">
        <div class="card dark-card map-card">
          <div class="map-toolbar">
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
        <!-- 道路列表 -->
        <div class="card dark-card facility-list-card">
          <div class="card-title-row">
            <div class="card-title">道路列表</div>
            <span class="map-btn active" @click.stop="showRoadListModal = true">查看详情</span>
          </div>
          <div class="facility-list-scroll">
            <table class="facility-table">
              <thead>
                <tr><th>归属地区</th><th>道路名称</th><th>道路等级</th><th>综合评价等级</th><th>检测时间</th><th>数据是否完善</th><th>发布状态</th><th>检测是否超期</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-for="(r, i) in overviewRoadList" :key="i" :class="{ 'row-selected': selectedFacility === r }" @click="handleRowSelect(r, 'road')">
                  <td>{{ r.region }}</td>
                  <td>{{ r.name }}</td>
                  <td>{{ r.level }}</td>
                  <td><span :class="'grade-tag-' + r.grade">{{ r.grade }}</span></td>
                  <td>{{ r.checkTime }}</td>
                  <td>{{ r.dataComplete }}</td>
                  <td>{{ r.publishStatus }}</td>
                  <td :class="r.overdue === '是' ? 'overdue-yes' : 'overdue-no'">{{ r.overdue }}</td>
                  <td><span class="op-link" @click.stop="handleFacilityView(r, 'road')">查看</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 桥梁列表 -->
        <div class="card dark-card facility-list-card">
          <div class="card-title-row">
            <div class="card-title">桥梁列表</div>
            <span class="map-btn active" @click.stop="showBridgeListModal = true">查看详情</span>
          </div>
          <div class="facility-list-scroll">
            <table class="facility-table">
              <thead>
                <tr><th>归属地区</th><th>桥梁名称</th><th>桥梁类型</th><th>是否涉航桥梁</th><th>综合评价等级</th><th>检测时间</th><th>数据是否完善</th><th>发布状态</th><th>检测是否超期</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-for="(b, i) in overviewBridgeList" :key="i" :class="{ 'row-selected': selectedFacility === b }" @click="handleRowSelect(b, 'bridge')">
                  <td>{{ b.region }}</td>
                  <td>{{ b.name }}</td>
                  <td>{{ b.type }}</td>
                  <td>{{ b.navigable }}</td>
                  <td><span :class="'grade-tag-' + b.grade">{{ b.grade }}</span></td>
                  <td>{{ b.checkTime }}</td>
                  <td>{{ b.dataComplete }}</td>
                  <td>{{ b.publishStatus }}</td>
                  <td :class="b.overdue === '是' ? 'overdue-yes' : 'overdue-no'">{{ b.overdue }}</td>
                  <td><span class="op-link" @click.stop="handleFacilityView(b, 'bridge')">查看</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 隧道列表 -->
        <div class="card dark-card facility-list-card">
          <div class="card-title-row">
            <div class="card-title">隧道列表</div>
            <span class="map-btn active" @click.stop="showTunnelListModal = true">查看详情</span>
          </div>
          <div class="facility-list-scroll">
            <table class="facility-table">
              <thead>
                <tr><th>归属地区</th><th>隧道名称</th><th>隧道类型</th><th>城市道路隧道分类</th><th>是否地下隧道</th><th>综合评价等级</th><th>检测时间</th><th>数据是否完善</th><th>发布状态</th><th>检测是否超期</th><th>操作</th></tr>
              </thead>
              <tbody>
                <tr v-for="(t, i) in overviewTunnelList" :key="i" :class="{ 'row-selected': selectedFacility === t }" @click="handleRowSelect(t, 'tunnel')">
                  <td>{{ t.region }}</td>
                  <td>{{ t.name }}</td>
                  <td>{{ t.type }}</td>
                  <td>{{ t.roadClass }}</td>
                  <td>{{ t.underground }}</td>
                  <td><span :class="'grade-tag-' + t.grade">{{ t.grade }}</span></td>
                  <td>{{ t.checkTime }}</td>
                  <td>{{ t.dataComplete }}</td>
                  <td>{{ t.publishStatus }}</td>
                  <td :class="t.overdue === '是' ? 'overdue-yes' : 'overdue-no'">{{ t.overdue }}</td>
                  <td><span class="op-link" @click.stop="handleFacilityView(t, 'tunnel')">查看</span></td>
                </tr>
              </tbody>
            </table>
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

    <!-- 安全隐患排查整治子页签 -->
    <div class="ops2-sub-tabs" v-show="cockpitTab === 'ops2'">
      <span class="risk-hint-btn" @click="showRiskHintModal = true" style="position:absolute;left:16px;top:6px">
        <span class="risk-hint-icon">!</span>风险提醒
      </span>
      <div 
        v-for="tab in ops2SubTabs" 
        :key="tab" 
        class="ops2-sub-tab" 
        :class="{ active: ops2SubTab === tab }" 
        @click="ops2SubTab = tab"
      >{{ tab }}</div>
    </div>

    <!-- 定期检测 -->
    <div class="cockpit-body ops2-body" v-show="cockpitTab === 'ops2' && ops2SubTab === '定期检测'">
      <!-- 城市道路 -->
      <div class="ops2-card road-card">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 常规检测 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">常规检测</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-road"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检数</div>
                  <div class="item-value digital">3329.07<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">本年度累计检测</div>
                  <div class="item-value">2,774.09<span class="unit">km</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clock"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">即将超期(不足30天)</div>
                  <div class="item-value digital">170.16<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未检</div>
                  <div class="item-value warning">554.82<span class="unit">km</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clipboard"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检未检数</div>
                  <div class="item-value warning">554.98<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">检测完成率</div>
                  <div class="item-value highlight">83.33<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 路段分级情况统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">路段分级情况统计</span>
            </div>
            <div class="grade-stats">
              <div class="ring-chart-wrapper">
                <div class="ring-chart road-ring" @click="showRingTooltip('road', $event)">
                  <div class="ring-center">
                    <div class="center-text">道路<br/>数据占比</div>
                  </div>
                </div>
                <div class="ring-labels">
                  <div class="label-item"><span class="label-dot a"></span>A级 49.97%</div>
                  <div class="label-item"><span class="label-dot b"></span>B级 47.87%</div>
                  <div class="label-item"><span class="label-dot c"></span>C级 1.3%</div>
                  <div class="label-item"><span class="label-dot d"></span>D级 0.86%</div>
                </div>
              </div>
              <div class="grade-list">
                <div class="grade-row"><span class="grade-label">A级</span><span class="grade-value">1831.60km</span></div>
                <div class="grade-row"><span class="grade-label">B级</span><span class="grade-value">1754.46km</span></div>
                <div class="grade-row"><span class="grade-label">C级</span><span class="grade-value">47.80km</span></div>
                <div class="grade-row"><span class="grade-label">D级</span><span class="grade-value">31.53km</span></div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>应检数<br/>(km)</th>
                    <th>即将超期<br/>(km)</th>
                    <th>超期未检<br/>(km)</th>
                    <th>检测完成率<br/>(%)</th>
                    <th>A级路段<br/>(km)</th>
                    <th>B级路段<br/>(km)</th>
                    <th>C级路段<br/>(km)</th>
                    <th>D级路段<br/>(km)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>1020</td><td>52.0</td><td>170.2</td><td>85.0</td><td>510.5</td><td>497.2</td><td>10.6</td><td>8.0</td></tr>
                  <tr><td>宁波市</td><td>520</td><td>26.5</td><td>86.7</td><td>83.5</td><td>260.3</td><td>255.8</td><td>5.4</td><td>4.1</td></tr>
                  <tr><td>温州市</td><td>230</td><td>11.7</td><td>38.4</td><td>83.8</td><td>115.1</td><td>91.8</td><td>51.3</td><td>21.1</td></tr>
                  <tr><td>嘉兴市</td><td>71</td><td>3.6</td><td>11.9</td><td>83.2</td><td>35.5</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>湖州市</td><td>212</td><td>10.8</td><td>35.4</td><td>83.3</td><td>106.3</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>绍兴市</td><td>351</td><td>17.9</td><td>58.6</td><td>83.3</td><td>175.7</td><td>125.3</td><td>1.8</td><td>0</td></tr>
                  <tr><td>金华市</td><td>375</td><td>19.1</td><td>62.5</td><td>83.3</td><td>188.4</td><td>150.5</td><td>18.9</td><td>7.1</td></tr>
                  <tr><td>衢州市</td><td>175</td><td>8.9</td><td>29.1</td><td>83.3</td><td>87.4</td><td>69.1</td><td>15.6</td><td>5.1</td></tr>
                  <tr><td>舟山市</td><td>95</td><td>4.8</td><td>15.8</td><td>83.3</td><td>47.4</td><td>36.9</td><td>8.8</td><td>2.1</td></tr>
                  <tr><td>台州市</td><td>320</td><td>16.3</td><td>53.5</td><td>83.3</td><td>160.2</td><td>128.0</td><td>22.1</td><td>6.0</td></tr>
                  <tr><td>丽水市</td><td>196</td><td>10.0</td><td>32.8</td><td>83.3</td><td>98.1</td><td>73.7</td><td>18.4</td><td>7.3</td></tr>
                  <tr class="total-row"><td>合计</td><td>3565</td><td>181.6</td><td>594.8</td><td>83.3</td><td>1784.9</td><td>1428.3</td><td>152.7</td><td>60.8</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card bridge-card">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 常规检测 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">常规检测</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-bridge"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检数</div>
                  <div class="item-value digital">05128<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">本年度累计检测</div>
                  <div class="item-value digital">03513<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clock"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">即将超期(不足30天)</div>
                  <div class="item-value digital">00855<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未检</div>
                  <div class="item-value digital">00703<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clipboard"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检未检数</div>
                  <div class="item-value warning">1615<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">检测完成率</div>
                  <div class="item-value highlight">68.73<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 桥梁分级情况统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">桥梁分级情况统计</span>
            </div>
            <div class="grade-stats">
              <div class="ring-chart-wrapper">
                <div class="ring-chart bridge-ring" @click="showRingTooltip('bridge', $event)">
                  <div class="ring-center">
                    <div class="center-text">桥梁<br/>数据占比</div>
                  </div>
                </div>
                <div class="ring-labels">
                  <div class="label-item"><span class="label-dot a"></span>A级 44.89%</div>
                  <div class="label-item"><span class="label-dot b"></span>B级 48.34%</div>
                  <div class="label-item"><span class="label-dot c"></span>C级 6.23%</div>
                  <div class="label-item"><span class="label-dot d"></span>D级 0.54%</div>
                  <div class="label-item"><span class="label-dot e"></span>E级 0%</div>
                  <div class="label-item"><span class="label-dot pass"></span>合格 99.46%</div>
                  <div class="label-item"><span class="label-dot fail"></span>不合格 0.54%</div>
                </div>
              </div>
              <div class="grade-list">
                <div class="grade-row"><span class="grade-label">A级</span><span class="grade-value">2095座</span></div>
                <div class="grade-row"><span class="grade-label">B级</span><span class="grade-value">2256座</span></div>
                <div class="grade-row"><span class="grade-label">C级</span><span class="grade-value">291座</span></div>
                <div class="grade-row"><span class="grade-label">D级</span><span class="grade-value">25座</span></div>
                <div class="grade-row"><span class="grade-label">E级</span><span class="grade-value">0座</span></div>
                <div class="grade-row"><span class="grade-label">合格</span><span class="grade-value">4646座</span></div>
                <div class="grade-row"><span class="grade-label">不合格</span><span class="grade-value">25座</span></div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>应检数<br/>(座)</th>
                    <th>即将超期<br/>(座)</th>
                    <th>超期未检<br/>(座)</th>
                    <th>检测完成率<br/>(%)</th>
                    <th>合格桥梁<br/>(座)</th>
                    <th>不合格桥梁<br/>(座)</th>
                    <th>A级桥梁<br/>(座)</th>
                    <th>B级桥梁<br/>(座)</th>
                    <th>C级桥梁<br/>(座)</th>
                    <th>D级桥梁<br/>(座)</th>
                    <th>E级桥梁<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>500</td><td>48</td><td>80</td><td>72.0</td><td>478</td><td>2</td><td>111</td><td>99</td><td>21</td><td>0</td><td>0</td></tr>
                  <tr><td>宁波市</td><td>420</td><td>40</td><td>67</td><td>72.1</td><td>405</td><td>1</td><td>37</td><td>33</td><td>7</td><td>0</td><td>0</td></tr>
                  <tr><td>温州市</td><td>400</td><td>38</td><td>63</td><td>72.3</td><td>383</td><td>1</td><td>82</td><td>167</td><td>27</td><td>5</td><td>0</td></tr>
                  <tr><td>嘉兴市</td><td>620</td><td>60</td><td>99</td><td>72.3</td><td>598</td><td>2</td><td>680</td><td>552</td><td>64</td><td>7</td><td>0</td></tr>
                  <tr><td>湖州市</td><td>300</td><td>29</td><td>48</td><td>72.0</td><td>288</td><td>1</td><td>247</td><td>225</td><td>10</td><td>1</td><td>0</td></tr>
                  <tr><td>绍兴市</td><td>500</td><td>48</td><td>80</td><td>72.0</td><td>480</td><td>2</td><td>350</td><td>606</td><td>89</td><td>6</td><td>0</td></tr>
                  <tr><td>金华市</td><td>460</td><td>44</td><td>74</td><td>72.2</td><td>442</td><td>1</td><td>289</td><td>312</td><td>45</td><td>8</td><td>0</td></tr>
                  <tr><td>衢州市</td><td>240</td><td>23</td><td>38</td><td>72.5</td><td>230</td><td>1</td><td>156</td><td>178</td><td>22</td><td>3</td><td>0</td></tr>
                  <tr><td>舟山市</td><td>180</td><td>17</td><td>28</td><td>72.2</td><td>173</td><td>1</td><td>98</td><td>112</td><td>15</td><td>2</td><td>0</td></tr>
                  <tr><td>台州市</td><td>430</td><td>41</td><td>69</td><td>72.1</td><td>414</td><td>1</td><td>267</td><td>289</td><td>38</td><td>4</td><td>0</td></tr>
                  <tr><td>丽水市</td><td>280</td><td>27</td><td>45</td><td>72.1</td><td>268</td><td>1</td><td>178</td><td>195</td><td>28</td><td>6</td><td>0</td></tr>
                  <tr class="total-row"><td>合计</td><td>4330</td><td>415</td><td>691</td><td>72.2</td><td>4079</td><td>14</td><td>2495</td><td>2768</td><td>366</td><td>42</td><td>0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card tunnel-card">
        <div class="ops2-card-header">
          <span class="header-icon"></span>
          <span class="header-title">城市隧道</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 常规检测 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">常规检测</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-tunnel"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检数</div>
                  <div class="item-value digital">00225<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">本年度累计检测</div>
                  <div class="item-value digital">00178<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clock"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">即将超期(不足30天)</div>
                  <div class="item-value digital">00047<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未检</div>
                  <div class="item-value digital">00058<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clipboard"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检未检数</div>
                  <div class="item-value warning">00047<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">检测完成率</div>
                  <div class="item-value highlight">73.78<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 隧道分级情况统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">隧道分级情况统计</span>
            </div>
            <div class="grade-stats">
              <div class="ring-chart-wrapper">
                <div class="ring-chart tunnel-ring" @click="showRingTooltip('tunnel', $event)">
                  <div class="ring-center">
                    <div class="center-text">隧道<br/>数据占比</div>
                  </div>
                </div>
                <div class="ring-labels">
                  <div class="label-item"><span class="label-dot a"></span>A级 50.41%</div>
                  <div class="label-item"><span class="label-dot b"></span>B级 33.61%</div>
                  <div class="label-item"><span class="label-dot c"></span>C级 15.98%</div>
                  <div class="label-item"><span class="label-dot d"></span>D级 0%</div>
                  <div class="label-item"><span class="label-dot e"></span>E级 0%</div>
                </div>
              </div>
              <div class="grade-list">
                <div class="grade-row"><span class="grade-label">A级</span><span class="grade-value">123座</span></div>
                <div class="grade-row"><span class="grade-label">B级</span><span class="grade-value">82座</span></div>
                <div class="grade-row"><span class="grade-label">C级</span><span class="grade-value">39座</span></div>
                <div class="grade-row"><span class="grade-label">D级</span><span class="grade-value">0座</span></div>
                <div class="grade-row"><span class="grade-label">E级</span><span class="grade-value">0座</span></div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>应检数<br/>(座)</th>
                    <th>即将超期<br/>(座)</th>
                    <th>超期未检<br/>(座)</th>
                    <th>检测完成率<br/>(%)</th>
                    <th>A级隧道<br/>(座)</th>
                    <th>B级隧道<br/>(座)</th>
                    <th>C级隧道<br/>(座)</th>
                    <th>D级隧道<br/>(座)</th>
                    <th>E级隧道<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>25</td><td>3</td><td>5</td><td>76.0</td><td>19</td><td>11</td><td>7</td><td>0</td><td>0</td></tr>
                  <tr><td>宁波市</td><td>20</td><td>2</td><td>4</td><td>75.0</td><td>7</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>温州市</td><td>12</td><td>1</td><td>3</td><td>75.0</td><td>2</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>嘉兴市</td><td>4</td><td>1</td><td>1</td><td>75.0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>湖州市</td><td>4</td><td>1</td><td>1</td><td>75.0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>绍兴市</td><td>6</td><td>1</td><td>1</td><td>83.3</td><td>0</td><td>4</td><td>1</td><td>0</td><td>0</td></tr>
                  <tr><td>金华市</td><td>12</td><td>1</td><td>2</td><td>83.3</td><td>5</td><td>2</td><td>1</td><td>0</td><td>0</td></tr>
                  <tr><td>衢州市</td><td>5</td><td>1</td><td>1</td><td>80.0</td><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>舟山市</td><td>3</td><td>0</td><td>1</td><td>66.7</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>台州市</td><td>8</td><td>1</td><td>1</td><td>87.5</td><td>3</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>丽水市</td><td>5</td><td>1</td><td>1</td><td>80.0</td><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr class="total-row"><td>合计</td><td>104</td><td>14</td><td>21</td><td>79.8</td><td>43</td><td>26</td><td>9</td><td>0</td><td>0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 日常巡检 -->
    <div class="cockpit-body ops2-body" v-show="cockpitTab === 'ops2' && ops2SubTab === '日常巡检'">
      <!-- 城市道路 -->
      <div class="ops2-card road-card hazard-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 排查指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">排查情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-road"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查总数</div>
                  <div class="item-value digital">3580.25<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查已完成</div>
                  <div class="item-value">2,985.12<span class="unit">km</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未巡</div>
                  <div class="item-value warning">595.13<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">完成率</div>
                  <div class="item-value highlight">83.38<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>排查总数<br/>(km)</th>
                    <th>排查已完成<br/>(km)</th>
                    <th>排查未完成<br/>(km)</th>
                    <th>超期未巡<br/>(km)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>1095</td><td>912</td><td>183</td><td>180</td></tr>
                  <tr><td>宁波市</td><td>560</td><td>468</td><td>92</td><td>90</td></tr>
                  <tr><td>温州市</td><td>248</td><td>207</td><td>41</td><td>40</td></tr>
                  <tr><td>嘉兴市</td><td>76</td><td>63</td><td>13</td><td>13</td></tr>
                  <tr><td>湖州市</td><td>228</td><td>190</td><td>38</td><td>37</td></tr>
                  <tr><td>绍兴市</td><td>378</td><td>315</td><td>63</td><td>62</td></tr>
                  <tr><td>金华市</td><td>404</td><td>337</td><td>67</td><td>66</td></tr>
                  <tr><td>衢州市</td><td>188</td><td>157</td><td>31</td><td>30</td></tr>
                  <tr><td>舟山市</td><td>102</td><td>85</td><td>17</td><td>17</td></tr>
                  <tr><td>台州市</td><td>344</td><td>287</td><td>57</td><td>56</td></tr>
                  <tr><td>丽水市</td><td>211</td><td>176</td><td>35</td><td>34</td></tr>
                  <tr class="total-row"><td>合计</td><td>3834</td><td>3197</td><td>637</td><td>625</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card bridge-card hazard-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 排查指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">排查情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-bridge"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查总数</div>
                  <div class="item-value digital">05520<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查已完成</div>
                  <div class="item-value digital">04598<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未巡</div>
                  <div class="item-value warning">00922<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">完成率</div>
                  <div class="item-value highlight">83.30<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>排查总数<br/>(座)</th>
                    <th>排查已完成<br/>(座)</th>
                    <th>排查未完成<br/>(座)</th>
                    <th>超期未巡<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>538</td><td>448</td><td>90</td><td>88</td></tr>
                  <tr><td>宁波市</td><td>452</td><td>377</td><td>75</td><td>73</td></tr>
                  <tr><td>温州市</td><td>430</td><td>359</td><td>71</td><td>70</td></tr>
                  <tr><td>嘉兴市</td><td>668</td><td>557</td><td>111</td><td>109</td></tr>
                  <tr><td>湖州市</td><td>323</td><td>270</td><td>53</td><td>52</td></tr>
                  <tr><td>绍兴市</td><td>538</td><td>449</td><td>89</td><td>87</td></tr>
                  <tr><td>金华市</td><td>495</td><td>413</td><td>82</td><td>80</td></tr>
                  <tr><td>衢州市</td><td>258</td><td>215</td><td>43</td><td>42</td></tr>
                  <tr><td>舟山市</td><td>194</td><td>162</td><td>32</td><td>31</td></tr>
                  <tr><td>台州市</td><td>463</td><td>386</td><td>77</td><td>75</td></tr>
                  <tr><td>丽水市</td><td>301</td><td>251</td><td>50</td><td>49</td></tr>
                  <tr class="total-row"><td>合计</td><td>4660</td><td>3887</td><td>773</td><td>756</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card tunnel-card hazard-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市隧道</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 排查指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">排查情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-tunnel"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查总数</div>
                  <div class="item-value digital">00242<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查已完成</div>
                  <div class="item-value digital">00201<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未巡</div>
                  <div class="item-value digital">00041<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">完成率</div>
                  <div class="item-value highlight">83.06<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>排查总数<br/>(座)</th>
                    <th>排查已完成<br/>(座)</th>
                    <th>排查未完成<br/>(座)</th>
                    <th>超期未巡<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>27</td><td>22</td><td>5</td><td>5</td></tr>
                  <tr><td>宁波市</td><td>22</td><td>18</td><td>4</td><td>4</td></tr>
                  <tr><td>温州市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>嘉兴市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>湖州市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>绍兴市</td><td>6</td><td>5</td><td>1</td><td>1</td></tr>
                  <tr><td>金华市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>衢州市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr><td>舟山市</td><td>3</td><td>3</td><td>0</td><td>0</td></tr>
                  <tr><td>台州市</td><td>9</td><td>7</td><td>2</td><td>2</td></tr>
                  <tr><td>丽水市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr class="total-row"><td>合计</td><td>111</td><td>91</td><td>20</td><td>20</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 病害处理 -->
    <div class="cockpit-body ops2-body disease-body" v-show="cockpitTab === 'ops2' && ops2SubTab === '病害处理'">
      <!-- 城市道路 -->
      <div class="ops2-card disease-card">
        <div class="disease-card-header">
          <span class="header-deco">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-deco">▌▌</span>
        </div>
        <!-- 子页签 -->
        <div class="disease-sub-tabs">
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '隐患排查' }" @click="diseaseRoadSubTab = '隐患排查'">隐患排查</div>
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '设施检测' }" @click="diseaseRoadSubTab = '设施检测'">设施检测</div>
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '设备监控' }" @click="diseaseRoadSubTab = '设备监控'">设备监控</div>
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '安全评估' }" @click="diseaseRoadSubTab = '安全评估'">安全评估</div>
        </div>
        <div class="disease-card-content">
          <template v-if="diseaseRoadSubTab === '隐患排查'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">512</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">447</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">87.36</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">168</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">21</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">17</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:81.55%"></div>
                <div class="risk-bar-segment larger" style="width:10.19%"></div>
                <div class="risk-bar-segment major" style="width:8.25%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: diseaseRoadCaseFilter === '未整改' }" @click="diseaseRoadCaseFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseRoadCaseFilter === '已整改' }" @click="diseaseRoadCaseFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseRoadCaseFilter === '全部' }" @click="diseaseRoadCaseFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">检查对象：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检查项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'road')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseRoadSubTab === '设施检测'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">D级道路数</div>
                  <div class="metric-value large"><span class="num">28</span><span class="unit">条</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已维修整治</div>
                  <div class="metric-value rate"><span class="num">18</span><span class="unit">条</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已拆除或完全封控</div>
                  <div class="metric-value timely"><span class="num">5</span><span class="unit">条</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">82.14</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadInspectRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>问题分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row inspect-levels">
                <div class="risk-level-item d-level"><span class="risk-label">D级道路</span><span class="risk-count">28</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment d-level" style="width:100%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">问题列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: roadInspectFilter === '未整改' }" @click="roadInspectFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: roadInspectFilter === '已整改' }" @click="roadInspectFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: roadInspectFilter === '全部' }" @click="roadInspectFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadInspectList" :key="ci" class="case-item inspect-item">
                  <div class="case-info inspect-info">
                    <div class="case-info-row"><span class="info-label">道路名称：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测时间：</span><span>{{ c.checkTime }}</span></div>
                    <div class="case-info-row"><span class="info-label">综合评价等级：</span><span class="inspect-grade" :class="'grade-' + c.grade">{{ c.grade }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改类型：</span><span>{{ c.rectifyType }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="问题照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openInspectDetail(c, 'road')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseRoadSubTab === '设备监控'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">风险总数</div>
                  <div class="metric-value large"><span class="num">156</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已处置</div>
                  <div class="metric-value rate"><span class="num">128</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">处置率</div>
                  <div class="metric-value rate"><span class="num">82.05</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">处置率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadMonitorRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>风险分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item level1"><span class="risk-label">一级预警</span><span class="risk-count">45</span></div>
                <div class="risk-level-item level2"><span class="risk-label">二级预警</span><span class="risk-count">68</span></div>
                <div class="risk-level-item level3"><span class="risk-label">三级预警</span><span class="risk-count">43</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment level1" style="width:29%"></div>
                <div class="risk-bar-segment level2" style="width:44%"></div>
                <div class="risk-bar-segment level3" style="width:27%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">预警列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: roadMonitorFilter === '未完成' }" @click="roadMonitorFilter = '未完成'">▶ 未完成</div>
                  <div class="case-filter-tab" :class="{ active: roadMonitorFilter === '已完成' }" @click="roadMonitorFilter = '已完成'">▶ 已完成</div>
                  <div class="case-filter-tab" :class="{ active: roadMonitorFilter === '全部' }" @click="roadMonitorFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadMonitorList" :key="ci" class="case-item monitor-item">
                  <div class="case-info monitor-info">
                    <div class="case-info-row"><span class="info-label">设施名称：</span><span>{{ c.facilityName }}</span></div>
                    <div class="case-info-row"><span class="info-label">设备名称：</span><span>{{ c.deviceName }}</span></div>
                    <div class="case-info-row"><span class="info-label">点位名称：</span><span>{{ c.pointName }}</span></div>
                    <div class="case-info-row"><span class="info-label">监测项：</span><span>{{ c.monitorItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">预警等级：</span><span class="alert-level" :class="'level-' + c.alertLevel">{{ c.alertLevel }}</span></div>
                    <div class="case-info-row"><span class="info-label">处置状态：</span><span class="status-pending">{{ c.handleStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="监测照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openDeviceMonitorDetail(c, 'road')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseRoadSubTab === '安全评估'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">512</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">447</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">87.36</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">168</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">21</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">17</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:81.55%"></div>
                <div class="risk-bar-segment larger" style="width:10.19%"></div>
                <div class="risk-bar-segment major" style="width:8.25%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: roadAssessFilter === '未整改' }" @click="roadAssessFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: roadAssessFilter === '已整改' }" @click="roadAssessFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: roadAssessFilter === '全部' }" @click="roadAssessFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">评估单元：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">评估项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'road', 'assess')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="sub-tab-placeholder"><div class="placeholder-text">{{ diseaseRoadSubTab }}模块开发中...</div></div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card disease-card">
        <div class="disease-card-header">
          <span class="header-deco">▌▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-deco">▌▌</span>
        </div>
        <div class="disease-sub-tabs">
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '隐患排查' }" @click="diseaseBridgeSubTab = '隐患排查'">隐患排查</div>
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '设施检测' }" @click="diseaseBridgeSubTab = '设施检测'">设施检测</div>
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '设备监控' }" @click="diseaseBridgeSubTab = '设备监控'">设备监控</div>
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '安全评估' }" @click="diseaseBridgeSubTab = '安全评估'">安全评估</div>
        </div>
        <div class="disease-card-content">
          <template v-if="diseaseBridgeSubTab === '隐患排查'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">356</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">306</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">85.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">85</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">37</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">33</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:54.84%"></div>
                <div class="risk-bar-segment larger" style="width:23.87%"></div>
                <div class="risk-bar-segment major" style="width:21.29%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: diseaseBridgeCaseFilter === '未整改' }" @click="diseaseBridgeCaseFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseBridgeCaseFilter === '已整改' }" @click="diseaseBridgeCaseFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseBridgeCaseFilter === '全部' }" @click="diseaseBridgeCaseFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">检查对象：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检查项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'bridge')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseBridgeSubTab === '设施检测'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">D、E级桥梁数</div>
                  <div class="metric-value large"><span class="num">45</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">不合格桥梁数</div>
                  <div class="metric-value large"><span class="num">12</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已维修整治</div>
                  <div class="metric-value rate"><span class="num">30</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已拆除或完全封控</div>
                  <div class="metric-value timely"><span class="num">8</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">75.56</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeInspectRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>问题分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row inspect-levels three-level">
                <div class="risk-level-item d-level"><span class="risk-label">D级桥梁</span><span class="risk-count">25</span></div>
                <div class="risk-level-item e-level"><span class="risk-label">E级桥梁</span><span class="risk-count">20</span></div>
                <div class="risk-level-item unqualified"><span class="risk-label">不合格桥梁</span><span class="risk-count">12</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment d-level" style="width:43%"></div>
                <div class="risk-bar-segment e-level" style="width:34%"></div>
                <div class="risk-bar-segment unqualified" style="width:23%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">问题列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: bridgeInspectFilter === '未整改' }" @click="bridgeInspectFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeInspectFilter === '已整改' }" @click="bridgeInspectFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeInspectFilter === '全部' }" @click="bridgeInspectFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeInspectList" :key="ci" class="case-item inspect-item">
                  <div class="case-info inspect-info">
                    <div class="case-info-row"><span class="info-label">桥梁名称：</span><span>{{ c.bridgeName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测时间：</span><span>{{ c.checkTime }}</span></div>
                    <div class="case-info-row"><span class="info-label">综合评价等级：</span><span class="inspect-grade" :class="'grade-' + c.grade">{{ c.grade }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改类型：</span><span>{{ c.rectifyType }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="问题照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openInspectDetail(c, 'bridge')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseBridgeSubTab === '设备监控'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">风险总数</div>
                  <div class="metric-value large"><span class="num">203</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已处置</div>
                  <div class="metric-value rate"><span class="num">175</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">处置率</div>
                  <div class="metric-value rate"><span class="num">86.21</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">处置率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeMonitorRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>风险分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item level1"><span class="risk-label">一级预警</span><span class="risk-count">58</span></div>
                <div class="risk-level-item level2"><span class="risk-label">二级预警</span><span class="risk-count">89</span></div>
                <div class="risk-level-item level3"><span class="risk-label">三级预警</span><span class="risk-count">56</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment level1" style="width:29%"></div>
                <div class="risk-bar-segment level2" style="width:44%"></div>
                <div class="risk-bar-segment level3" style="width:27%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">预警列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: bridgeMonitorFilter === '未完成' }" @click="bridgeMonitorFilter = '未完成'">▶ 未完成</div>
                  <div class="case-filter-tab" :class="{ active: bridgeMonitorFilter === '已完成' }" @click="bridgeMonitorFilter = '已完成'">▶ 已完成</div>
                  <div class="case-filter-tab" :class="{ active: bridgeMonitorFilter === '全部' }" @click="bridgeMonitorFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeMonitorList" :key="ci" class="case-item monitor-item">
                  <div class="case-info monitor-info">
                    <div class="case-info-row"><span class="info-label">设施名称：</span><span>{{ c.facilityName }}</span></div>
                    <div class="case-info-row"><span class="info-label">设备名称：</span><span>{{ c.deviceName }}</span></div>
                    <div class="case-info-row"><span class="info-label">点位名称：</span><span>{{ c.pointName }}</span></div>
                    <div class="case-info-row"><span class="info-label">监测项：</span><span>{{ c.monitorItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">预警等级：</span><span class="alert-level" :class="'level-' + c.alertLevel">{{ c.alertLevel }}</span></div>
                    <div class="case-info-row"><span class="info-label">处置状态：</span><span class="status-pending">{{ c.handleStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="监测照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openDeviceMonitorDetail(c, 'bridge')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseBridgeSubTab === '安全评估'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">356</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">306</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">85.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">85</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">37</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">33</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:54.84%"></div>
                <div class="risk-bar-segment larger" style="width:23.87%"></div>
                <div class="risk-bar-segment major" style="width:21.29%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: bridgeAssessFilter === '未整改' }" @click="bridgeAssessFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeAssessFilter === '已整改' }" @click="bridgeAssessFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeAssessFilter === '全部' }" @click="bridgeAssessFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">评估单元：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">评估项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'bridge', 'assess')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="sub-tab-placeholder"><div class="placeholder-text">{{ diseaseBridgeSubTab }}模块开发中...</div></div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card disease-card">
        <div class="disease-card-header">
          <span class="header-deco">▌▌</span>
          <span class="header-title">城市隧道</span>
          <span class="header-deco">▌▌</span>
        </div>
        <div class="disease-sub-tabs">
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '隐患排查' }" @click="diseaseTunnelSubTab = '隐患排查'">隐患排查</div>
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '设施检测' }" @click="diseaseTunnelSubTab = '设施检测'">设施检测</div>
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '设备监控' }" @click="diseaseTunnelSubTab = '设备监控'">设备监控</div>
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '安全评估' }" @click="diseaseTunnelSubTab = '安全评估'">安全评估</div>
        </div>
        <div class="disease-card-content">
          <template v-if="diseaseTunnelSubTab === '隐患排查'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">414</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">360</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">86.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">94</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">38</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">26</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:59.49%"></div>
                <div class="risk-bar-segment larger" style="width:24.05%"></div>
                <div class="risk-bar-segment major" style="width:16.46%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: diseaseTunnelCaseFilter === '未整改' }" @click="diseaseTunnelCaseFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseTunnelCaseFilter === '已整改' }" @click="diseaseTunnelCaseFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseTunnelCaseFilter === '全部' }" @click="diseaseTunnelCaseFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">检查对象：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检查项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'tunnel')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseTunnelSubTab === '设施检测'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">D、E级隧道数</div>
                  <div class="metric-value large"><span class="num">18</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已维修整治</div>
                  <div class="metric-value rate"><span class="num">12</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已拆除或完全封控</div>
                  <div class="metric-value timely"><span class="num">3</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">83.33</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelInspectRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>问题分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row inspect-levels two-level">
                <div class="risk-level-item d-level"><span class="risk-label">D级隧道</span><span class="risk-count">10</span></div>
                <div class="risk-level-item e-level"><span class="risk-label">E级隧道</span><span class="risk-count">8</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment d-level" style="width:56%"></div>
                <div class="risk-bar-segment e-level" style="width:44%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">问题列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: tunnelInspectFilter === '未整改' }" @click="tunnelInspectFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelInspectFilter === '已整改' }" @click="tunnelInspectFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelInspectFilter === '全部' }" @click="tunnelInspectFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelInspectList" :key="ci" class="case-item inspect-item">
                  <div class="case-info inspect-info">
                    <div class="case-info-row"><span class="info-label">隧道名称：</span><span>{{ c.tunnelName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测时间：</span><span>{{ c.checkTime }}</span></div>
                    <div class="case-info-row"><span class="info-label">综合评价等级：</span><span class="inspect-grade" :class="'grade-' + c.grade">{{ c.grade }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改类型：</span><span>{{ c.rectifyType }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="问题照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openInspectDetail(c, 'tunnel')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseTunnelSubTab === '设备监控'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">风险总数</div>
                  <div class="metric-value large"><span class="num">98</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已处置</div>
                  <div class="metric-value rate"><span class="num">82</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">处置率</div>
                  <div class="metric-value rate"><span class="num">83.67</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">处置率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelMonitorRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>风险分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item level1"><span class="risk-label">一级预警</span><span class="risk-count">28</span></div>
                <div class="risk-level-item level2"><span class="risk-label">二级预警</span><span class="risk-count">42</span></div>
                <div class="risk-level-item level3"><span class="risk-label">三级预警</span><span class="risk-count">28</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment level1" style="width:29%"></div>
                <div class="risk-bar-segment level2" style="width:43%"></div>
                <div class="risk-bar-segment level3" style="width:28%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">预警列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: tunnelMonitorFilter === '未完成' }" @click="tunnelMonitorFilter = '未完成'">▶ 未完成</div>
                  <div class="case-filter-tab" :class="{ active: tunnelMonitorFilter === '已完成' }" @click="tunnelMonitorFilter = '已完成'">▶ 已完成</div>
                  <div class="case-filter-tab" :class="{ active: tunnelMonitorFilter === '全部' }" @click="tunnelMonitorFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelMonitorList" :key="ci" class="case-item monitor-item">
                  <div class="case-info monitor-info">
                    <div class="case-info-row"><span class="info-label">设施名称：</span><span>{{ c.facilityName }}</span></div>
                    <div class="case-info-row"><span class="info-label">设备名称：</span><span>{{ c.deviceName }}</span></div>
                    <div class="case-info-row"><span class="info-label">点位名称：</span><span>{{ c.pointName }}</span></div>
                    <div class="case-info-row"><span class="info-label">监测项：</span><span>{{ c.monitorItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">预警等级：</span><span class="alert-level" :class="'level-' + c.alertLevel">{{ c.alertLevel }}</span></div>
                    <div class="case-info-row"><span class="info-label">处置状态：</span><span class="status-pending">{{ c.handleStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="监测照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openDeviceMonitorDetail(c, 'tunnel')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseTunnelSubTab === '安全评估'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">414</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">360</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">86.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">94</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">38</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">26</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:59.49%"></div>
                <div class="risk-bar-segment larger" style="width:24.05%"></div>
                <div class="risk-bar-segment major" style="width:16.46%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: tunnelAssessFilter === '未整改' }" @click="tunnelAssessFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelAssessFilter === '已整改' }" @click="tunnelAssessFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelAssessFilter === '全部' }" @click="tunnelAssessFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">评估单元：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">评估项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'tunnel', 'assess')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="sub-tab-placeholder"><div class="placeholder-text">{{ diseaseTunnelSubTab }}模块开发中...</div></div>
        </div>
      </div>
    </div>

    <!-- 隐患详情弹窗 -->
    <a-modal v-model:open="showHazardDetail" :title="hazardDetailSource === 'assess' ? (hazardDetailType === 'road' ? '道路安全评估详情' : hazardDetailType === 'bridge' ? '桥梁安全评估详情' : '隧道安全评估详情') : (hazardDetailType === 'road' ? '道路隐患详情' : hazardDetailType === 'bridge' ? '桥梁隐患详情' : '隧道隐患详情')" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentHazardDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentHazardDetail.photo" alt="隐患照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">{{ hazardDetailSource === 'assess' ? '评估单元' : '检查对象' }}：</span>
            <span class="field-value">{{ currentHazardDetail.roadName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">所属地区：</span>
            <span class="field-value">{{ currentHazardDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">{{ hazardDetailSource === 'assess' ? '评估项目' : '检查项目' }}：</span>
            <span class="field-value">{{ currentHazardDetail.checkItem }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">上报时间：</span>
            <span class="field-value">{{ currentHazardDetail.time }}</span>
          </div>
          <div class="detail-field full-width">
            <span class="field-label">上报内容：</span>
            <span class="field-value">{{ currentHazardDetail.content }}</span>
          </div>
          <div class="detail-field" v-if="hazardDetailSource === 'assess'">
            <span class="field-label">评估单位：</span>
            <span class="field-value">{{ currentHazardDetail.assessUnit || '-' }}</span>
          </div>
          <div class="detail-field full-width" v-if="hazardDetailSource === 'assess'">
            <span class="field-label">隐患排查方式：</span>
            <span class="field-value">{{ currentHazardDetail.checkMethod || '-' }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">隐患等级：</span>
            <span class="field-value hazard-level" :class="'level-' + currentHazardDetail.level">{{ currentHazardDetail.level }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改状态：</span>
            <span class="field-value status-pending">{{ currentHazardDetail.rectifyStatus }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改完成时间：</span>
            <span class="field-value">{{ currentHazardDetail.rectifyTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改人：</span>
            <span class="field-value">{{ currentHazardDetail.rectifyPerson }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span v-if="!currentHazardDetail.attachments || currentHazardDetail.attachments.length === 0" class="no-data">暂无数据</span>
            <div v-else class="attachment-list">
              <div v-for="(att, ai) in currentHazardDetail.attachments" :key="ai" class="attachment-item">{{ att }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 设施检测详情弹窗 -->
    <a-modal v-model:open="showInspectDetail" :title="inspectDetailType === 'road' ? '道路检测详情' : inspectDetailType === 'bridge' ? '桥梁检测详情' : '隧道检测详情'" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentInspectDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentInspectDetail.photo" alt="检测照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">所属区域：</span>
            <span class="field-value">{{ currentInspectDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检测名称：</span>
            <span class="field-value">{{ currentInspectDetail.checkName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">{{ inspectDetailType === 'road' ? '道路' : inspectDetailType === 'bridge' ? '桥梁' : '隧道' }}名称：</span>
            <span class="field-value">{{ inspectDetailType === 'road' ? currentInspectDetail.roadName : inspectDetailType === 'bridge' ? currentInspectDetail.bridgeName : currentInspectDetail.tunnelName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检测时间：</span>
            <span class="field-value">{{ currentInspectDetail.checkTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检测类型：</span>
            <span class="field-value">{{ currentInspectDetail.checkType }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">综合评价等级：</span>
            <span class="field-value inspect-grade" :class="'grade-' + currentInspectDetail.grade">{{ currentInspectDetail.grade }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改类型：</span>
            <span class="field-value">{{ currentInspectDetail.rectifyType }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改完成状态：</span>
            <span class="field-value status-pending">{{ currentInspectDetail.rectifyStatus }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改销号日期：</span>
            <span class="field-value">{{ currentInspectDetail.rectifyFinishDate }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改后评级：</span>
            <span class="field-value">{{ currentInspectDetail.rectifyGrade }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span class="no-data">暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 设备监控详情弹窗 -->
    <a-modal v-model:open="showDeviceMonitorDetail" :title="deviceMonitorDetailType === 'road' ? '道路设备监控详情' : deviceMonitorDetailType === 'bridge' ? '桥梁设备监控详情' : '隧道设备监控详情'" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentDeviceMonitorDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentDeviceMonitorDetail.photo" alt="监控照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">所属区域：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">设施名称：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.facilityName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">设备名称：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.deviceName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">点位名称：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.pointName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">监测项：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.monitorItem }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">报警开始时间：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.alertStartTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">报警结束时间：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.alertEndTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">预警值：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.alertValue }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">预警等级：</span>
            <span class="field-value"><span class="alert-level" :class="'level-' + currentDeviceMonitorDetail.alertLevel">{{ currentDeviceMonitorDetail.alertLevel }}</span></span>
          </div>
          <div class="detail-field">
            <span class="field-label">处置状态：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.handleStatus }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">处置完成时间：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.handleFinishTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">处置人：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.handlePerson }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span class="no-data">暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 安全评估详情弹窗 -->
    <a-modal v-model:open="showAssessDetail" :title="assessDetailType === 'road' ? '道路安全评估详情' : assessDetailType === 'bridge' ? '桥梁安全评估详情' : '隧道安全评估详情'" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentAssessDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentAssessDetail.photo" alt="评估照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">所属区域：</span>
            <span class="field-value">{{ currentAssessDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">{{ assessDetailType === 'road' ? '道路' : assessDetailType === 'bridge' ? '桥梁' : '隧道' }}名称：</span>
            <span class="field-value">{{ assessDetailType === 'road' ? currentAssessDetail.roadName : assessDetailType === 'bridge' ? currentAssessDetail.bridgeName : currentAssessDetail.tunnelName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检查项目：</span>
            <span class="field-value">{{ currentAssessDetail.checkItem }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">评估时间：</span>
            <span class="field-value">{{ currentAssessDetail.time }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">评估内容：</span>
            <span class="field-value">{{ currentAssessDetail.content }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">安全等级：</span>
            <span class="field-value"><span class="hazard-level" :class="'level-' + currentAssessDetail.level">{{ currentAssessDetail.level }}</span></span>
          </div>
          <div class="detail-field">
            <span class="field-label">完成状态：</span>
            <span class="field-value">{{ currentAssessDetail.status }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span class="no-data">暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 安全评估 -->
    <div class="cockpit-body ops2-body" v-show="cockpitTab === 'ops2' && ops2SubTab === '安全评估'">
      <!-- 城市道路 -->
      <div class="ops2-card road-card assess-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 评估指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">评估情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-road"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估单元总数</div>
                  <div class="item-value digital">3580<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估已完成</div>
                  <div class="item-value">2985<span class="unit">个</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估覆盖率</div>
                  <div class="item-value highlight">83.38<span class="unit">%</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">重要风险源</div>
                  <div class="item-value warning">126<span class="unit">处</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未评</div>
                  <div class="item-value warning">595<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item"></div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>评估单元<br/>(个)</th>
                    <th>评估已完成<br/>(个)</th>
                    <th>评估未完成<br/>(个)</th>
                    <th>超期未评<br/>(个)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>1095</td><td>912</td><td>183</td><td>180</td></tr>
                  <tr><td>宁波市</td><td>560</td><td>468</td><td>92</td><td>90</td></tr>
                  <tr><td>温州市</td><td>248</td><td>207</td><td>41</td><td>40</td></tr>
                  <tr><td>嘉兴市</td><td>76</td><td>63</td><td>13</td><td>13</td></tr>
                  <tr><td>湖州市</td><td>228</td><td>190</td><td>38</td><td>37</td></tr>
                  <tr><td>绍兴市</td><td>378</td><td>315</td><td>63</td><td>62</td></tr>
                  <tr><td>金华市</td><td>404</td><td>337</td><td>67</td><td>66</td></tr>
                  <tr><td>衢州市</td><td>188</td><td>157</td><td>31</td><td>30</td></tr>
                  <tr><td>舟山市</td><td>102</td><td>85</td><td>17</td><td>17</td></tr>
                  <tr><td>台州市</td><td>344</td><td>287</td><td>57</td><td>56</td></tr>
                  <tr><td>丽水市</td><td>211</td><td>176</td><td>35</td><td>34</td></tr>
                  <tr class="total-row"><td>合计</td><td>3834</td><td>3197</td><td>637</td><td>625</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card bridge-card assess-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 评估指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">评估情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-bridge"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估单元总数</div>
                  <div class="item-value digital">05520<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估已完成</div>
                  <div class="item-value digital">04598<span class="unit">个</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估覆盖率</div>
                  <div class="item-value highlight">83.30<span class="unit">%</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">重要风险源</div>
                  <div class="item-value warning">89<span class="unit">处</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未评</div>
                  <div class="item-value warning">00922<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item"></div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>评估单元<br/>(个)</th>
                    <th>评估已完成<br/>(个)</th>
                    <th>评估未完成<br/>(个)</th>
                    <th>超期未评<br/>(个)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>538</td><td>448</td><td>90</td><td>88</td></tr>
                  <tr><td>宁波市</td><td>452</td><td>377</td><td>75</td><td>73</td></tr>
                  <tr><td>温州市</td><td>430</td><td>359</td><td>71</td><td>70</td></tr>
                  <tr><td>嘉兴市</td><td>668</td><td>557</td><td>111</td><td>109</td></tr>
                  <tr><td>湖州市</td><td>323</td><td>270</td><td>53</td><td>52</td></tr>
                  <tr><td>绍兴市</td><td>538</td><td>449</td><td>89</td><td>87</td></tr>
                  <tr><td>金华市</td><td>495</td><td>413</td><td>82</td><td>80</td></tr>
                  <tr><td>衢州市</td><td>258</td><td>215</td><td>43</td><td>42</td></tr>
                  <tr><td>舟山市</td><td>194</td><td>162</td><td>32</td><td>31</td></tr>
                  <tr><td>台州市</td><td>463</td><td>386</td><td>77</td><td>75</td></tr>
                  <tr><td>丽水市</td><td>301</td><td>251</td><td>50</td><td>49</td></tr>
                  <tr class="total-row"><td>合计</td><td>4660</td><td>3887</td><td>773</td><td>756</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card tunnel-card assess-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市隧道</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 评估指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">评估情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-tunnel"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估单元总数</div>
                  <div class="item-value digital">00242<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估已完成</div>
                  <div class="item-value digital">00201<span class="unit">个</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估覆盖率</div>
                  <div class="item-value highlight">83.06<span class="unit">%</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">重要风险源</div>
                  <div class="item-value warning">18<span class="unit">处</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未评</div>
                  <div class="item-value warning">00041<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item"></div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>评估单元<br/>(个)</th>
                    <th>评估已完成<br/>(个)</th>
                    <th>评估未完成<br/>(个)</th>
                    <th>超期未评<br/>(个)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>27</td><td>22</td><td>5</td><td>5</td></tr>
                  <tr><td>宁波市</td><td>22</td><td>18</td><td>4</td><td>4</td></tr>
                  <tr><td>温州市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>嘉兴市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>湖州市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>绍兴市</td><td>6</td><td>5</td><td>1</td><td>1</td></tr>
                  <tr><td>金华市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>衢州市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr><td>舟山市</td><td>3</td><td>3</td><td>0</td><td>0</td></tr>
                  <tr><td>台州市</td><td>9</td><td>7</td><td>2</td><td>2</td></tr>
                  <tr><td>丽水市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr class="total-row"><td>合计</td><td>111</td><td>91</td><td>20</td><td>20</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 安全隐患排查整治（备用）子页签 -->
    <div class="ops2-sub-tabs" v-show="cockpitTab === 'ops3'">
      <div 
        v-for="tab in ops3SubTabs" 
        :key="tab" 
        class="ops2-sub-tab" 
        :class="{ active: ops3SubTab === tab }" 
        @click="ops3SubTab = tab"
      >{{ tab }}</div>
    </div>

    <!-- 备用-定期检测 -->
    <div class="cockpit-body ops2-body" v-show="cockpitTab === 'ops3' && ops3SubTab === '定期检测'">
      <!-- 城市道路 -->
      <div class="ops2-card road-card">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 常规检测 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">常规检测</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-road"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检数</div>
                  <div class="item-value digital">3329.07<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">本年度累计检测</div>
                  <div class="item-value">2,774.09<span class="unit">km</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clock"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">即将超期(不足30天)</div>
                  <div class="item-value digital">170.16<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未检</div>
                  <div class="item-value warning">554.82<span class="unit">km</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clipboard"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检未检数</div>
                  <div class="item-value warning">554.98<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">检测完成率</div>
                  <div class="item-value highlight">83.33<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 路段分级情况统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">路段分级情况统计</span>
            </div>
            <div class="grade-stats">
              <div class="ring-chart-wrapper">
                <div class="ring-chart road-ring" @click="showRingTooltip('road', $event)">
                  <div class="ring-center">
                    <div class="center-text">道路<br/>数据占比</div>
                  </div>
                </div>
                <div class="ring-labels">
                  <div class="label-item"><span class="label-dot a"></span>A级 49.97%</div>
                  <div class="label-item"><span class="label-dot b"></span>B级 47.87%</div>
                  <div class="label-item"><span class="label-dot c"></span>C级 1.3%</div>
                  <div class="label-item"><span class="label-dot d"></span>D级 0.86%</div>
                </div>
              </div>
              <div class="grade-list">
                <div class="grade-row"><span class="grade-label">A级</span><span class="grade-value">1831.60km</span></div>
                <div class="grade-row"><span class="grade-label">B级</span><span class="grade-value">1754.46km</span></div>
                <div class="grade-row"><span class="grade-label">C级</span><span class="grade-value">47.80km</span></div>
                <div class="grade-row"><span class="grade-label">D级</span><span class="grade-value">31.53km</span></div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>应检数<br/>(km)</th>
                    <th>即将超期<br/>(km)</th>
                    <th>超期未检<br/>(km)</th>
                    <th>检测完成率<br/>(%)</th>
                    <th>A级路段<br/>(km)</th>
                    <th>B级路段<br/>(km)</th>
                    <th>C级路段<br/>(km)</th>
                    <th>D级路段<br/>(km)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>1020</td><td>52.0</td><td>170.2</td><td>85.0</td><td>510.5</td><td>497.2</td><td>10.6</td><td>8.0</td></tr>
                  <tr><td>宁波市</td><td>520</td><td>26.5</td><td>86.7</td><td>83.5</td><td>260.3</td><td>255.8</td><td>5.4</td><td>4.1</td></tr>
                  <tr><td>温州市</td><td>230</td><td>11.7</td><td>38.4</td><td>83.8</td><td>115.1</td><td>91.8</td><td>51.3</td><td>21.1</td></tr>
                  <tr><td>嘉兴市</td><td>71</td><td>3.6</td><td>11.9</td><td>83.2</td><td>35.5</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>湖州市</td><td>212</td><td>10.8</td><td>35.4</td><td>83.3</td><td>106.3</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>绍兴市</td><td>351</td><td>17.9</td><td>58.6</td><td>83.3</td><td>175.7</td><td>125.3</td><td>1.8</td><td>0</td></tr>
                  <tr><td>金华市</td><td>375</td><td>19.1</td><td>62.5</td><td>83.3</td><td>188.4</td><td>150.5</td><td>18.9</td><td>7.1</td></tr>
                  <tr><td>衢州市</td><td>175</td><td>8.9</td><td>29.1</td><td>83.3</td><td>87.4</td><td>69.1</td><td>15.6</td><td>5.1</td></tr>
                  <tr><td>舟山市</td><td>95</td><td>4.8</td><td>15.8</td><td>83.3</td><td>47.4</td><td>36.9</td><td>8.8</td><td>2.1</td></tr>
                  <tr><td>台州市</td><td>320</td><td>16.3</td><td>53.5</td><td>83.3</td><td>160.2</td><td>128.0</td><td>22.1</td><td>6.0</td></tr>
                  <tr><td>丽水市</td><td>196</td><td>10.0</td><td>32.8</td><td>83.3</td><td>98.1</td><td>73.7</td><td>18.4</td><td>7.3</td></tr>
                  <tr class="total-row"><td>合计</td><td>3565</td><td>181.6</td><td>594.8</td><td>83.3</td><td>1784.9</td><td>1428.3</td><td>152.7</td><td>60.8</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card bridge-card">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 常规检测 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">常规检测</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-bridge"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检数</div>
                  <div class="item-value digital">05128<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">本年度累计检测</div>
                  <div class="item-value digital">03513<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clock"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">即将超期(不足30天)</div>
                  <div class="item-value digital">00855<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未检</div>
                  <div class="item-value digital">00703<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clipboard"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检未检数</div>
                  <div class="item-value warning">1615<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">检测完成率</div>
                  <div class="item-value highlight">68.73<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 桥梁分级情况统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">桥梁分级情况统计</span>
            </div>
            <div class="grade-stats">
              <div class="ring-chart-wrapper">
                <div class="ring-chart bridge-ring" @click="showRingTooltip('bridge', $event)">
                  <div class="ring-center">
                    <div class="center-text">桥梁<br/>数据占比</div>
                  </div>
                </div>
                <div class="ring-labels">
                  <div class="label-item"><span class="label-dot a"></span>A级 44.89%</div>
                  <div class="label-item"><span class="label-dot b"></span>B级 48.34%</div>
                  <div class="label-item"><span class="label-dot c"></span>C级 6.23%</div>
                  <div class="label-item"><span class="label-dot d"></span>D级 0.54%</div>
                  <div class="label-item"><span class="label-dot e"></span>E级 0%</div>
                  <div class="label-item"><span class="label-dot pass"></span>合格 99.46%</div>
                  <div class="label-item"><span class="label-dot fail"></span>不合格 0.54%</div>
                </div>
              </div>
              <div class="grade-list">
                <div class="grade-row"><span class="grade-label">A级</span><span class="grade-value">2095座</span></div>
                <div class="grade-row"><span class="grade-label">B级</span><span class="grade-value">2256座</span></div>
                <div class="grade-row"><span class="grade-label">C级</span><span class="grade-value">291座</span></div>
                <div class="grade-row"><span class="grade-label">D级</span><span class="grade-value">25座</span></div>
                <div class="grade-row"><span class="grade-label">E级</span><span class="grade-value">0座</span></div>
                <div class="grade-row"><span class="grade-label">合格</span><span class="grade-value">4646座</span></div>
                <div class="grade-row"><span class="grade-label">不合格</span><span class="grade-value">25座</span></div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>应检数<br/>(座)</th>
                    <th>即将超期<br/>(座)</th>
                    <th>超期未检<br/>(座)</th>
                    <th>检测完成率<br/>(%)</th>
                    <th>合格桥梁<br/>(座)</th>
                    <th>不合格桥梁<br/>(座)</th>
                    <th>A级桥梁<br/>(座)</th>
                    <th>B级桥梁<br/>(座)</th>
                    <th>C级桥梁<br/>(座)</th>
                    <th>D级桥梁<br/>(座)</th>
                    <th>E级桥梁<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>500</td><td>48</td><td>80</td><td>72.0</td><td>478</td><td>2</td><td>111</td><td>99</td><td>21</td><td>0</td><td>0</td></tr>
                  <tr><td>宁波市</td><td>420</td><td>40</td><td>67</td><td>72.1</td><td>405</td><td>1</td><td>37</td><td>33</td><td>7</td><td>0</td><td>0</td></tr>
                  <tr><td>温州市</td><td>400</td><td>38</td><td>63</td><td>72.3</td><td>383</td><td>1</td><td>82</td><td>167</td><td>27</td><td>5</td><td>0</td></tr>
                  <tr><td>嘉兴市</td><td>620</td><td>60</td><td>99</td><td>72.3</td><td>598</td><td>2</td><td>680</td><td>552</td><td>64</td><td>7</td><td>0</td></tr>
                  <tr><td>湖州市</td><td>300</td><td>29</td><td>48</td><td>72.0</td><td>288</td><td>1</td><td>247</td><td>225</td><td>10</td><td>1</td><td>0</td></tr>
                  <tr><td>绍兴市</td><td>500</td><td>48</td><td>80</td><td>72.0</td><td>480</td><td>2</td><td>350</td><td>606</td><td>89</td><td>6</td><td>0</td></tr>
                  <tr><td>金华市</td><td>460</td><td>44</td><td>74</td><td>72.2</td><td>442</td><td>1</td><td>289</td><td>312</td><td>45</td><td>8</td><td>0</td></tr>
                  <tr><td>衢州市</td><td>240</td><td>23</td><td>38</td><td>72.5</td><td>230</td><td>1</td><td>156</td><td>178</td><td>22</td><td>3</td><td>0</td></tr>
                  <tr><td>舟山市</td><td>180</td><td>17</td><td>28</td><td>72.2</td><td>173</td><td>1</td><td>98</td><td>112</td><td>15</td><td>2</td><td>0</td></tr>
                  <tr><td>台州市</td><td>430</td><td>41</td><td>69</td><td>72.1</td><td>414</td><td>1</td><td>267</td><td>289</td><td>38</td><td>4</td><td>0</td></tr>
                  <tr><td>丽水市</td><td>280</td><td>27</td><td>45</td><td>72.1</td><td>268</td><td>1</td><td>178</td><td>195</td><td>28</td><td>6</td><td>0</td></tr>
                  <tr class="total-row"><td>合计</td><td>4330</td><td>415</td><td>691</td><td>72.2</td><td>4079</td><td>14</td><td>2495</td><td>2768</td><td>366</td><td>42</td><td>0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card tunnel-card">
        <div class="ops2-card-header">
          <span class="header-icon"></span>
          <span class="header-title">城市隧道</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 常规检测 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">常规检测</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-tunnel"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检数</div>
                  <div class="item-value digital">00225<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">本年度累计检测</div>
                  <div class="item-value digital">00178<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clock"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">即将超期(不足30天)</div>
                  <div class="item-value digital">00047<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未检</div>
                  <div class="item-value digital">00058<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-clipboard"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">应检未检数</div>
                  <div class="item-value warning">00047<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">检测完成率</div>
                  <div class="item-value highlight">73.78<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 隧道分级情况统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">隧道分级情况统计</span>
            </div>
            <div class="grade-stats">
              <div class="ring-chart-wrapper">
                <div class="ring-chart tunnel-ring" @click="showRingTooltip('tunnel', $event)">
                  <div class="ring-center">
                    <div class="center-text">隧道<br/>数据占比</div>
                  </div>
                </div>
                <div class="ring-labels">
                  <div class="label-item"><span class="label-dot a"></span>A级 50.41%</div>
                  <div class="label-item"><span class="label-dot b"></span>B级 33.61%</div>
                  <div class="label-item"><span class="label-dot c"></span>C级 15.98%</div>
                  <div class="label-item"><span class="label-dot d"></span>D级 0%</div>
                  <div class="label-item"><span class="label-dot e"></span>E级 0%</div>
                </div>
              </div>
              <div class="grade-list">
                <div class="grade-row"><span class="grade-label">A级</span><span class="grade-value">123座</span></div>
                <div class="grade-row"><span class="grade-label">B级</span><span class="grade-value">82座</span></div>
                <div class="grade-row"><span class="grade-label">C级</span><span class="grade-value">39座</span></div>
                <div class="grade-row"><span class="grade-label">D级</span><span class="grade-value">0座</span></div>
                <div class="grade-row"><span class="grade-label">E级</span><span class="grade-value">0座</span></div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>应检数<br/>(座)</th>
                    <th>即将超期<br/>(座)</th>
                    <th>超期未检<br/>(座)</th>
                    <th>检测完成率<br/>(%)</th>
                    <th>A级隧道<br/>(座)</th>
                    <th>B级隧道<br/>(座)</th>
                    <th>C级隧道<br/>(座)</th>
                    <th>D级隧道<br/>(座)</th>
                    <th>E级隧道<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>25</td><td>3</td><td>5</td><td>76.0</td><td>19</td><td>11</td><td>7</td><td>0</td><td>0</td></tr>
                  <tr><td>宁波市</td><td>20</td><td>2</td><td>4</td><td>75.0</td><td>7</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>温州市</td><td>12</td><td>1</td><td>3</td><td>75.0</td><td>2</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>嘉兴市</td><td>4</td><td>1</td><td>1</td><td>75.0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>湖州市</td><td>4</td><td>1</td><td>1</td><td>75.0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>绍兴市</td><td>6</td><td>1</td><td>1</td><td>83.3</td><td>0</td><td>4</td><td>1</td><td>0</td><td>0</td></tr>
                  <tr><td>金华市</td><td>12</td><td>1</td><td>2</td><td>83.3</td><td>5</td><td>2</td><td>1</td><td>0</td><td>0</td></tr>
                  <tr><td>衢州市</td><td>5</td><td>1</td><td>1</td><td>80.0</td><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>舟山市</td><td>3</td><td>0</td><td>1</td><td>66.7</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>台州市</td><td>8</td><td>1</td><td>1</td><td>87.5</td><td>3</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr><td>丽水市</td><td>5</td><td>1</td><td>1</td><td>80.0</td><td>2</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
                  <tr class="total-row"><td>合计</td><td>104</td><td>14</td><td>21</td><td>79.8</td><td>43</td><td>26</td><td>9</td><td>0</td><td>0</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 备用-日常巡检 -->
    <div class="cockpit-body ops2-body" v-show="cockpitTab === 'ops3' && ops3SubTab === '日常巡检'">
      <!-- 城市道路 -->
      <div class="ops2-card road-card hazard-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 排查指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">排查情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-road"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查总数</div>
                  <div class="item-value digital">3580.25<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查已完成</div>
                  <div class="item-value">2,985.12<span class="unit">km</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未巡</div>
                  <div class="item-value warning">595.13<span class="unit">km</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">完成率</div>
                  <div class="item-value highlight">83.38<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>排查总数<br/>(km)</th>
                    <th>排查已完成<br/>(km)</th>
                    <th>排查未完成<br/>(km)</th>
                    <th>超期未巡<br/>(km)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>1095</td><td>912</td><td>183</td><td>180</td></tr>
                  <tr><td>宁波市</td><td>560</td><td>468</td><td>92</td><td>90</td></tr>
                  <tr><td>温州市</td><td>248</td><td>207</td><td>41</td><td>40</td></tr>
                  <tr><td>嘉兴市</td><td>76</td><td>63</td><td>13</td><td>13</td></tr>
                  <tr><td>湖州市</td><td>228</td><td>190</td><td>38</td><td>37</td></tr>
                  <tr><td>绍兴市</td><td>378</td><td>315</td><td>63</td><td>62</td></tr>
                  <tr><td>金华市</td><td>404</td><td>337</td><td>67</td><td>66</td></tr>
                  <tr><td>衢州市</td><td>188</td><td>157</td><td>31</td><td>30</td></tr>
                  <tr><td>舟山市</td><td>102</td><td>85</td><td>17</td><td>17</td></tr>
                  <tr><td>台州市</td><td>344</td><td>287</td><td>57</td><td>56</td></tr>
                  <tr><td>丽水市</td><td>211</td><td>176</td><td>35</td><td>34</td></tr>
                  <tr class="total-row"><td>合计</td><td>3834</td><td>3197</td><td>637</td><td>625</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card bridge-card hazard-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 排查指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">排查情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-bridge"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查总数</div>
                  <div class="item-value digital">05520<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查已完成</div>
                  <div class="item-value digital">04598<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未巡</div>
                  <div class="item-value warning">00922<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">完成率</div>
                  <div class="item-value highlight">83.30<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>排查总数<br/>(座)</th>
                    <th>排查已完成<br/>(座)</th>
                    <th>排查未完成<br/>(座)</th>
                    <th>超期未巡<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>538</td><td>448</td><td>90</td><td>88</td></tr>
                  <tr><td>宁波市</td><td>452</td><td>377</td><td>75</td><td>73</td></tr>
                  <tr><td>温州市</td><td>430</td><td>359</td><td>71</td><td>70</td></tr>
                  <tr><td>嘉兴市</td><td>668</td><td>557</td><td>111</td><td>109</td></tr>
                  <tr><td>湖州市</td><td>323</td><td>270</td><td>53</td><td>52</td></tr>
                  <tr><td>绍兴市</td><td>538</td><td>449</td><td>89</td><td>87</td></tr>
                  <tr><td>金华市</td><td>495</td><td>413</td><td>82</td><td>80</td></tr>
                  <tr><td>衢州市</td><td>258</td><td>215</td><td>43</td><td>42</td></tr>
                  <tr><td>舟山市</td><td>194</td><td>162</td><td>32</td><td>31</td></tr>
                  <tr><td>台州市</td><td>463</td><td>386</td><td>77</td><td>75</td></tr>
                  <tr><td>丽水市</td><td>301</td><td>251</td><td>50</td><td>49</td></tr>
                  <tr class="total-row"><td>合计</td><td>4660</td><td>3887</td><td>773</td><td>756</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card tunnel-card hazard-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市隧道</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 排查指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">排查情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-tunnel"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查总数</div>
                  <div class="item-value digital">00242<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">排查已完成</div>
                  <div class="item-value digital">00201<span class="unit">座</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未巡</div>
                  <div class="item-value digital">00041<span class="unit">座</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">完成率</div>
                  <div class="item-value highlight">83.06<span class="unit">%</span></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>排查总数<br/>(座)</th>
                    <th>排查已完成<br/>(座)</th>
                    <th>排查未完成<br/>(座)</th>
                    <th>超期未巡<br/>(座)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>27</td><td>22</td><td>5</td><td>5</td></tr>
                  <tr><td>宁波市</td><td>22</td><td>18</td><td>4</td><td>4</td></tr>
                  <tr><td>温州市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>嘉兴市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>湖州市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>绍兴市</td><td>6</td><td>5</td><td>1</td><td>1</td></tr>
                  <tr><td>金华市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>衢州市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr><td>舟山市</td><td>3</td><td>3</td><td>0</td><td>0</td></tr>
                  <tr><td>台州市</td><td>9</td><td>7</td><td>2</td><td>2</td></tr>
                  <tr><td>丽水市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr class="total-row"><td>合计</td><td>111</td><td>91</td><td>20</td><td>20</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 备用-病害处理 -->
    <div class="cockpit-body ops2-body disease-body" v-show="cockpitTab === 'ops3' && ops3SubTab === '病害处理'">
      <!-- 城市道路 -->
      <div class="ops2-card disease-card">
        <div class="disease-card-header">
          <span class="header-deco">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-deco">▌▌</span>
        </div>
        <!-- 子页签 -->
        <div class="disease-sub-tabs">
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '隐患排查' }" @click="diseaseRoadSubTab = '隐患排查'">隐患排查</div>
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '设施检测' }" @click="diseaseRoadSubTab = '设施检测'">设施检测</div>
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '设备监控' }" @click="diseaseRoadSubTab = '设备监控'">设备监控</div>
          <div class="sub-tab" :class="{ active: diseaseRoadSubTab === '安全评估' }" @click="diseaseRoadSubTab = '安全评估'">安全评估</div>
        </div>
        <div class="disease-card-content">
          <template v-if="diseaseRoadSubTab === '隐患排查'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">512</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">447</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">87.36</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">168</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">21</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">17</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:81.55%"></div>
                <div class="risk-bar-segment larger" style="width:10.19%"></div>
                <div class="risk-bar-segment major" style="width:8.25%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: diseaseRoadCaseFilter === '未整改' }" @click="diseaseRoadCaseFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseRoadCaseFilter === '已整改' }" @click="diseaseRoadCaseFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseRoadCaseFilter === '全部' }" @click="diseaseRoadCaseFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">检查对象：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检查项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'road')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseRoadSubTab === '设施检测'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">D级道路数</div>
                  <div class="metric-value large"><span class="num">28</span><span class="unit">条</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已维修整治</div>
                  <div class="metric-value rate"><span class="num">18</span><span class="unit">条</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已拆除或完全封控</div>
                  <div class="metric-value timely"><span class="num">5</span><span class="unit">条</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">82.14</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadInspectRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>问题分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row inspect-levels">
                <div class="risk-level-item d-level"><span class="risk-label">D级道路</span><span class="risk-count">28</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment d-level" style="width:100%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">问题列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: roadInspectFilter === '未整改' }" @click="roadInspectFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: roadInspectFilter === '已整改' }" @click="roadInspectFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: roadInspectFilter === '全部' }" @click="roadInspectFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadInspectList" :key="ci" class="case-item inspect-item">
                  <div class="case-info inspect-info">
                    <div class="case-info-row"><span class="info-label">道路名称：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测时间：</span><span>{{ c.checkTime }}</span></div>
                    <div class="case-info-row"><span class="info-label">综合评价等级：</span><span class="inspect-grade" :class="'grade-' + c.grade">{{ c.grade }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改类型：</span><span>{{ c.rectifyType }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="问题照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openInspectDetail(c, 'road')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseRoadSubTab === '设备监控'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">风险总数</div>
                  <div class="metric-value large"><span class="num">156</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已处置</div>
                  <div class="metric-value rate"><span class="num">128</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">处置率</div>
                  <div class="metric-value rate"><span class="num">82.05</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">处置率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadMonitorRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>风险分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item level1"><span class="risk-label">一级预警</span><span class="risk-count">45</span></div>
                <div class="risk-level-item level2"><span class="risk-label">二级预警</span><span class="risk-count">68</span></div>
                <div class="risk-level-item level3"><span class="risk-label">三级预警</span><span class="risk-count">43</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment level1" style="width:29%"></div>
                <div class="risk-bar-segment level2" style="width:44%"></div>
                <div class="risk-bar-segment level3" style="width:27%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">预警列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: roadMonitorFilter === '未完成' }" @click="roadMonitorFilter = '未完成'">▶ 未完成</div>
                  <div class="case-filter-tab" :class="{ active: roadMonitorFilter === '已完成' }" @click="roadMonitorFilter = '已完成'">▶ 已完成</div>
                  <div class="case-filter-tab" :class="{ active: roadMonitorFilter === '全部' }" @click="roadMonitorFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadMonitorList" :key="ci" class="case-item monitor-item">
                  <div class="case-info monitor-info">
                    <div class="case-info-row"><span class="info-label">设施名称：</span><span>{{ c.facilityName }}</span></div>
                    <div class="case-info-row"><span class="info-label">设备名称：</span><span>{{ c.deviceName }}</span></div>
                    <div class="case-info-row"><span class="info-label">点位名称：</span><span>{{ c.pointName }}</span></div>
                    <div class="case-info-row"><span class="info-label">监测项：</span><span>{{ c.monitorItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">预警等级：</span><span class="alert-level" :class="'level-' + c.alertLevel">{{ c.alertLevel }}</span></div>
                    <div class="case-info-row"><span class="info-label">处置状态：</span><span class="status-pending">{{ c.handleStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="监测照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openDeviceMonitorDetail(c, 'road')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseRoadSubTab === '安全评估'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">512</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">447</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">87.36</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in roadHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">168</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">21</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">17</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:81.55%"></div>
                <div class="risk-bar-segment larger" style="width:10.19%"></div>
                <div class="risk-bar-segment major" style="width:8.25%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: roadAssessFilter === '未整改' }" @click="roadAssessFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: roadAssessFilter === '已整改' }" @click="roadAssessFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: roadAssessFilter === '全部' }" @click="roadAssessFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in roadHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">评估单元：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">评估项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'road', 'assess')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="sub-tab-placeholder"><div class="placeholder-text">{{ diseaseRoadSubTab }}模块开发中...</div></div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card disease-card">
        <div class="disease-card-header">
          <span class="header-deco">▌▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-deco">▌▌</span>
        </div>
        <div class="disease-sub-tabs">
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '隐患排查' }" @click="diseaseBridgeSubTab = '隐患排查'">隐患排查</div>
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '设施检测' }" @click="diseaseBridgeSubTab = '设施检测'">设施检测</div>
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '设备监控' }" @click="diseaseBridgeSubTab = '设备监控'">设备监控</div>
          <div class="sub-tab" :class="{ active: diseaseBridgeSubTab === '安全评估' }" @click="diseaseBridgeSubTab = '安全评估'">安全评估</div>
        </div>
        <div class="disease-card-content">
          <template v-if="diseaseBridgeSubTab === '隐患排查'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">356</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">306</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">85.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">85</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">37</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">33</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:54.84%"></div>
                <div class="risk-bar-segment larger" style="width:23.87%"></div>
                <div class="risk-bar-segment major" style="width:21.29%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: diseaseBridgeCaseFilter === '未整改' }" @click="diseaseBridgeCaseFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseBridgeCaseFilter === '已整改' }" @click="diseaseBridgeCaseFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseBridgeCaseFilter === '全部' }" @click="diseaseBridgeCaseFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">检查对象：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检查项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'bridge')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseBridgeSubTab === '设施检测'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">D、E级桥梁数</div>
                  <div class="metric-value large"><span class="num">45</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">不合格桥梁数</div>
                  <div class="metric-value large"><span class="num">12</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已维修整治</div>
                  <div class="metric-value rate"><span class="num">30</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已拆除或完全封控</div>
                  <div class="metric-value timely"><span class="num">8</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">75.56</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeInspectRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>问题分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row inspect-levels three-level">
                <div class="risk-level-item d-level"><span class="risk-label">D级桥梁</span><span class="risk-count">25</span></div>
                <div class="risk-level-item e-level"><span class="risk-label">E级桥梁</span><span class="risk-count">20</span></div>
                <div class="risk-level-item unqualified"><span class="risk-label">不合格桥梁</span><span class="risk-count">12</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment d-level" style="width:43%"></div>
                <div class="risk-bar-segment e-level" style="width:34%"></div>
                <div class="risk-bar-segment unqualified" style="width:23%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">问题列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: bridgeInspectFilter === '未整改' }" @click="bridgeInspectFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeInspectFilter === '已整改' }" @click="bridgeInspectFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeInspectFilter === '全部' }" @click="bridgeInspectFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeInspectList" :key="ci" class="case-item inspect-item">
                  <div class="case-info inspect-info">
                    <div class="case-info-row"><span class="info-label">桥梁名称：</span><span>{{ c.bridgeName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测时间：</span><span>{{ c.checkTime }}</span></div>
                    <div class="case-info-row"><span class="info-label">综合评价等级：</span><span class="inspect-grade" :class="'grade-' + c.grade">{{ c.grade }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改类型：</span><span>{{ c.rectifyType }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="问题照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openInspectDetail(c, 'bridge')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseBridgeSubTab === '设备监控'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">风险总数</div>
                  <div class="metric-value large"><span class="num">203</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已处置</div>
                  <div class="metric-value rate"><span class="num">175</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">处置率</div>
                  <div class="metric-value rate"><span class="num">86.21</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">处置率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeMonitorRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>风险分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item level1"><span class="risk-label">一级预警</span><span class="risk-count">58</span></div>
                <div class="risk-level-item level2"><span class="risk-label">二级预警</span><span class="risk-count">89</span></div>
                <div class="risk-level-item level3"><span class="risk-label">三级预警</span><span class="risk-count">56</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment level1" style="width:29%"></div>
                <div class="risk-bar-segment level2" style="width:44%"></div>
                <div class="risk-bar-segment level3" style="width:27%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">预警列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: bridgeMonitorFilter === '未完成' }" @click="bridgeMonitorFilter = '未完成'">▶ 未完成</div>
                  <div class="case-filter-tab" :class="{ active: bridgeMonitorFilter === '已完成' }" @click="bridgeMonitorFilter = '已完成'">▶ 已完成</div>
                  <div class="case-filter-tab" :class="{ active: bridgeMonitorFilter === '全部' }" @click="bridgeMonitorFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeMonitorList" :key="ci" class="case-item monitor-item">
                  <div class="case-info monitor-info">
                    <div class="case-info-row"><span class="info-label">设施名称：</span><span>{{ c.facilityName }}</span></div>
                    <div class="case-info-row"><span class="info-label">设备名称：</span><span>{{ c.deviceName }}</span></div>
                    <div class="case-info-row"><span class="info-label">点位名称：</span><span>{{ c.pointName }}</span></div>
                    <div class="case-info-row"><span class="info-label">监测项：</span><span>{{ c.monitorItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">预警等级：</span><span class="alert-level" :class="'level-' + c.alertLevel">{{ c.alertLevel }}</span></div>
                    <div class="case-info-row"><span class="info-label">处置状态：</span><span class="status-pending">{{ c.handleStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="监测照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openDeviceMonitorDetail(c, 'bridge')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseBridgeSubTab === '安全评估'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">356</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">306</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">85.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in bridgeHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">85</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">37</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">33</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:54.84%"></div>
                <div class="risk-bar-segment larger" style="width:23.87%"></div>
                <div class="risk-bar-segment major" style="width:21.29%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: bridgeAssessFilter === '未整改' }" @click="bridgeAssessFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeAssessFilter === '已整改' }" @click="bridgeAssessFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: bridgeAssessFilter === '全部' }" @click="bridgeAssessFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in bridgeHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">评估单元：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">评估项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'bridge', 'assess')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="sub-tab-placeholder"><div class="placeholder-text">{{ diseaseBridgeSubTab }}模块开发中...</div></div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card disease-card">
        <div class="disease-card-header">
          <span class="header-deco">▌▌</span>
          <span class="header-title">城市隧道</span>
          <span class="header-deco">▌▌</span>
        </div>
        <div class="disease-sub-tabs">
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '隐患排查' }" @click="diseaseTunnelSubTab = '隐患排查'">隐患排查</div>
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '设施检测' }" @click="diseaseTunnelSubTab = '设施检测'">设施检测</div>
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '设备监控' }" @click="diseaseTunnelSubTab = '设备监控'">设备监控</div>
          <div class="sub-tab" :class="{ active: diseaseTunnelSubTab === '安全评估' }" @click="diseaseTunnelSubTab = '安全评估'">安全评估</div>
        </div>
        <div class="disease-card-content">
          <template v-if="diseaseTunnelSubTab === '隐患排查'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">414</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">360</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">86.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">94</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">38</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">26</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:59.49%"></div>
                <div class="risk-bar-segment larger" style="width:24.05%"></div>
                <div class="risk-bar-segment major" style="width:16.46%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: diseaseTunnelCaseFilter === '未整改' }" @click="diseaseTunnelCaseFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseTunnelCaseFilter === '已整改' }" @click="diseaseTunnelCaseFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: diseaseTunnelCaseFilter === '全部' }" @click="diseaseTunnelCaseFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">检查对象：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检查项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'tunnel')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseTunnelSubTab === '设施检测'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">D、E级隧道数</div>
                  <div class="metric-value large"><span class="num">18</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已维修整治</div>
                  <div class="metric-value rate"><span class="num">12</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已拆除或完全封控</div>
                  <div class="metric-value timely"><span class="num">3</span><span class="unit">座</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">83.33</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelInspectRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>问题分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row inspect-levels two-level">
                <div class="risk-level-item d-level"><span class="risk-label">D级隧道</span><span class="risk-count">10</span></div>
                <div class="risk-level-item e-level"><span class="risk-label">E级隧道</span><span class="risk-count">8</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment d-level" style="width:56%"></div>
                <div class="risk-bar-segment e-level" style="width:44%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">问题列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: tunnelInspectFilter === '未整改' }" @click="tunnelInspectFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelInspectFilter === '已整改' }" @click="tunnelInspectFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelInspectFilter === '全部' }" @click="tunnelInspectFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelInspectList" :key="ci" class="case-item inspect-item">
                  <div class="case-info inspect-info">
                    <div class="case-info-row"><span class="info-label">隧道名称：</span><span>{{ c.tunnelName }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">检测时间：</span><span>{{ c.checkTime }}</span></div>
                    <div class="case-info-row"><span class="info-label">综合评价等级：</span><span class="inspect-grade" :class="'grade-' + c.grade">{{ c.grade }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改类型：</span><span>{{ c.rectifyType }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="问题照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openInspectDetail(c, 'tunnel')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseTunnelSubTab === '设备监控'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">风险总数</div>
                  <div class="metric-value large"><span class="num">98</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已处置</div>
                  <div class="metric-value rate"><span class="num">82</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">处置率</div>
                  <div class="metric-value rate"><span class="num">83.67</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">处置率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelMonitorRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>风险分级统计图</span>
                <span class="title-deco">▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item level1"><span class="risk-label">一级预警</span><span class="risk-count">28</span></div>
                <div class="risk-level-item level2"><span class="risk-label">二级预警</span><span class="risk-count">42</span></div>
                <div class="risk-level-item level3"><span class="risk-label">三级预警</span><span class="risk-count">28</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment level1" style="width:29%"></div>
                <div class="risk-bar-segment level2" style="width:43%"></div>
                <div class="risk-bar-segment level3" style="width:28%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">预警列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: tunnelMonitorFilter === '未完成' }" @click="tunnelMonitorFilter = '未完成'">▶ 未完成</div>
                  <div class="case-filter-tab" :class="{ active: tunnelMonitorFilter === '已完成' }" @click="tunnelMonitorFilter = '已完成'">▶ 已完成</div>
                  <div class="case-filter-tab" :class="{ active: tunnelMonitorFilter === '全部' }" @click="tunnelMonitorFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelMonitorList" :key="ci" class="case-item monitor-item">
                  <div class="case-info monitor-info">
                    <div class="case-info-row"><span class="info-label">设施名称：</span><span>{{ c.facilityName }}</span></div>
                    <div class="case-info-row"><span class="info-label">设备名称：</span><span>{{ c.deviceName }}</span></div>
                    <div class="case-info-row"><span class="info-label">点位名称：</span><span>{{ c.pointName }}</span></div>
                    <div class="case-info-row"><span class="info-label">监测项：</span><span>{{ c.monitorItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">预警等级：</span><span class="alert-level" :class="'level-' + c.alertLevel">{{ c.alertLevel }}</span></div>
                    <div class="case-info-row"><span class="info-label">处置状态：</span><span class="status-pending">{{ c.handleStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="监测照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openDeviceMonitorDetail(c, 'tunnel')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="diseaseTunnelSubTab === '安全评估'">
            <div class="disease-top-row">
              <div class="disease-metrics">
                <div class="metric-item">
                  <div class="metric-label">隐患总数</div>
                  <div class="metric-value large"><span class="num">414</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">已整改</div>
                  <div class="metric-value rate"><span class="num">360</span><span class="unit">项</span></div>
                </div>
                <div class="metric-item">
                  <div class="metric-label">整改率</div>
                  <div class="metric-value rate"><span class="num">86.95</span><span class="unit">%</span></div>
                </div>
              </div>
              <div class="disease-ranking">
                <div class="ranking-title">整改率排名：</div>
                <div class="ranking-grid">
                  <div v-for="(item, idx) in tunnelHazardRanking" :key="idx" class="ranking-item">
                    <span class="rank-badge" :class="'rank-' + (idx+1)">no.{{ idx+1 }}</span>
                    <span class="rank-city">{{ item.city }}</span>
                    <span class="rank-rate">{{ item.rate }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="disease-risk-section">
              <div class="risk-section-title">
                <span class="title-deco">▌▌</span>
                <span>隐患分级统计图</span>
                <span class="title-deco">▌▌</span>
              </div>
              <div class="risk-levels-row three-level">
                <div class="risk-level-item general"><span class="risk-label">一般隐患</span><span class="risk-count">94</span></div>
                <div class="risk-level-item larger"><span class="risk-label">较大隐患</span><span class="risk-count">38</span></div>
                <div class="risk-level-item major"><span class="risk-label">重大隐患</span><span class="risk-count">26</span></div>
              </div>
              <div class="risk-bar-track">
                <div class="risk-bar-segment general" style="width:59.49%"></div>
                <div class="risk-bar-segment larger" style="width:24.05%"></div>
                <div class="risk-bar-segment major" style="width:16.46%"></div>
              </div>
            </div>
            <div class="disease-case-section">
              <div class="case-section-header">
                <div class="case-title-row">
                  <span class="case-diamond">◆</span>
                  <span class="case-title-text">隐患列表</span>
                </div>
                <div class="case-filters">
                  <div class="case-filter-tab" :class="{ active: tunnelAssessFilter === '未整改' }" @click="tunnelAssessFilter = '未整改'">▶ 未整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelAssessFilter === '已整改' }" @click="tunnelAssessFilter = '已整改'">▶ 已整改</div>
                  <div class="case-filter-tab" :class="{ active: tunnelAssessFilter === '全部' }" @click="tunnelAssessFilter = '全部'">▶ 全部</div>
                  <select class="case-province-select"><option>浙江省</option></select>
                </div>
              </div>
              <div class="case-list">
                <div v-for="(c, ci) in tunnelHazardList" :key="ci" class="case-item hazard-item">
                  <div class="case-info hazard-info">
                    <div class="case-info-row"><span class="info-label">评估单元：</span><span>{{ c.roadName }}</span></div>
                    <div class="case-info-row"><span class="info-label">评估项目：</span><span>{{ c.checkItem }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报时间：</span><span>{{ c.time }}</span></div>
                    <div class="case-info-row"><span class="info-label">上报内容：</span><span>{{ c.content }}</span></div>
                    <div class="case-info-row"><span class="info-label">隐患等级：</span><span class="hazard-level" :class="'level-' + c.level">{{ c.level }}</span></div>
                    <div class="case-info-row"><span class="info-label">整改状态：</span><span class="status-pending">{{ c.rectifyStatus }}</span></div>
                  </div>
                  <div class="hazard-right">
                    <div class="hazard-photo"><img :src="c.photo" alt="隐患照片" /></div>
                    <button class="detail-btn hazard-detail-btn" @click="openHazardDetail(c, 'tunnel', 'assess')">详情</button>
                  </div>
                </div>
              </div>
              <div class="case-pagination">
                <span class="pagination-info">共搜索到3条数据</span>
                <div class="pagination-btns">
                  <button class="page-btn">&lt;</button>
                  <button class="page-btn active">1</button>
                  <button class="page-btn">&gt;</button>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="sub-tab-placeholder"><div class="placeholder-text">{{ diseaseTunnelSubTab }}模块开发中...</div></div>
        </div>
      </div>
    </div>

    <!-- 隐患详情弹窗 -->
    <a-modal v-model:open="showHazardDetail" :title="hazardDetailSource === 'assess' ? (hazardDetailType === 'road' ? '道路安全评估详情' : hazardDetailType === 'bridge' ? '桥梁安全评估详情' : '隧道安全评估详情') : (hazardDetailType === 'road' ? '道路隐患详情' : hazardDetailType === 'bridge' ? '桥梁隐患详情' : '隧道隐患详情')" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentHazardDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentHazardDetail.photo" alt="隐患照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">{{ hazardDetailSource === 'assess' ? '评估单元' : '检查对象' }}：</span>
            <span class="field-value">{{ currentHazardDetail.roadName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">所属地区：</span>
            <span class="field-value">{{ currentHazardDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">{{ hazardDetailSource === 'assess' ? '评估项目' : '检查项目' }}：</span>
            <span class="field-value">{{ currentHazardDetail.checkItem }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">上报时间：</span>
            <span class="field-value">{{ currentHazardDetail.time }}</span>
          </div>
          <div class="detail-field full-width">
            <span class="field-label">上报内容：</span>
            <span class="field-value">{{ currentHazardDetail.content }}</span>
          </div>
          <div class="detail-field" v-if="hazardDetailSource === 'assess'">
            <span class="field-label">评估单位：</span>
            <span class="field-value">{{ currentHazardDetail.assessUnit || '-' }}</span>
          </div>
          <div class="detail-field full-width" v-if="hazardDetailSource === 'assess'">
            <span class="field-label">隐患排查方式：</span>
            <span class="field-value">{{ currentHazardDetail.checkMethod || '-' }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">隐患等级：</span>
            <span class="field-value hazard-level" :class="'level-' + currentHazardDetail.level">{{ currentHazardDetail.level }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改状态：</span>
            <span class="field-value status-pending">{{ currentHazardDetail.rectifyStatus }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改完成时间：</span>
            <span class="field-value">{{ currentHazardDetail.rectifyTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改人：</span>
            <span class="field-value">{{ currentHazardDetail.rectifyPerson }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span v-if="!currentHazardDetail.attachments || currentHazardDetail.attachments.length === 0" class="no-data">暂无数据</span>
            <div v-else class="attachment-list">
              <div v-for="(att, ai) in currentHazardDetail.attachments" :key="ai" class="attachment-item">{{ att }}</div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 设施检测详情弹窗 -->
    <a-modal v-model:open="showInspectDetail" :title="inspectDetailType === 'road' ? '道路检测详情' : inspectDetailType === 'bridge' ? '桥梁检测详情' : '隧道检测详情'" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentInspectDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentInspectDetail.photo" alt="检测照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">所属区域：</span>
            <span class="field-value">{{ currentInspectDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检测名称：</span>
            <span class="field-value">{{ currentInspectDetail.checkName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">{{ inspectDetailType === 'road' ? '道路' : inspectDetailType === 'bridge' ? '桥梁' : '隧道' }}名称：</span>
            <span class="field-value">{{ inspectDetailType === 'road' ? currentInspectDetail.roadName : inspectDetailType === 'bridge' ? currentInspectDetail.bridgeName : currentInspectDetail.tunnelName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检测时间：</span>
            <span class="field-value">{{ currentInspectDetail.checkTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检测类型：</span>
            <span class="field-value">{{ currentInspectDetail.checkType }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">综合评价等级：</span>
            <span class="field-value inspect-grade" :class="'grade-' + currentInspectDetail.grade">{{ currentInspectDetail.grade }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改类型：</span>
            <span class="field-value">{{ currentInspectDetail.rectifyType }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改完成状态：</span>
            <span class="field-value status-pending">{{ currentInspectDetail.rectifyStatus }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改销号日期：</span>
            <span class="field-value">{{ currentInspectDetail.rectifyFinishDate }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">整改后评级：</span>
            <span class="field-value">{{ currentInspectDetail.rectifyGrade }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span class="no-data">暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 设备监控详情弹窗 -->
    <a-modal v-model:open="showDeviceMonitorDetail" :title="deviceMonitorDetailType === 'road' ? '道路设备监控详情' : deviceMonitorDetailType === 'bridge' ? '桥梁设备监控详情' : '隧道设备监控详情'" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentDeviceMonitorDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentDeviceMonitorDetail.photo" alt="监控照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">所属区域：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">设施名称：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.facilityName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">设备名称：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.deviceName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">点位名称：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.pointName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">监测项：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.monitorItem }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">报警开始时间：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.alertStartTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">报警结束时间：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.alertEndTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">预警值：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.alertValue }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">预警等级：</span>
            <span class="field-value"><span class="alert-level" :class="'level-' + currentDeviceMonitorDetail.alertLevel">{{ currentDeviceMonitorDetail.alertLevel }}</span></span>
          </div>
          <div class="detail-field">
            <span class="field-label">处置状态：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.handleStatus }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">处置完成时间：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.handleFinishTime }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">处置人：</span>
            <span class="field-value">{{ currentDeviceMonitorDetail.handlePerson }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span class="no-data">暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 安全评估详情弹窗 -->
    <a-modal v-model:open="showAssessDetail" :title="assessDetailType === 'road' ? '道路安全评估详情' : assessDetailType === 'bridge' ? '桥梁安全评估详情' : '隧道安全评估详情'" width="900px" :footer="null" class="hazard-detail-modal" v-if="currentAssessDetail">
      <div class="hazard-detail-body">
        <div class="hazard-detail-top">
          <div class="hazard-detail-photo-label">图片记录：</div>
          <div class="hazard-detail-photo"><img :src="currentAssessDetail.photo" alt="评估照片" /></div>
        </div>
        <div class="hazard-detail-fields">
          <div class="detail-field">
            <span class="field-label">所属区域：</span>
            <span class="field-value">{{ currentAssessDetail.region }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">{{ assessDetailType === 'road' ? '道路' : assessDetailType === 'bridge' ? '桥梁' : '隧道' }}名称：</span>
            <span class="field-value">{{ assessDetailType === 'road' ? currentAssessDetail.roadName : assessDetailType === 'bridge' ? currentAssessDetail.bridgeName : currentAssessDetail.tunnelName }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">检查项目：</span>
            <span class="field-value">{{ currentAssessDetail.checkItem }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">评估时间：</span>
            <span class="field-value">{{ currentAssessDetail.time }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">评估内容：</span>
            <span class="field-value">{{ currentAssessDetail.content }}</span>
          </div>
          <div class="detail-field">
            <span class="field-label">安全等级：</span>
            <span class="field-value"><span class="hazard-level" :class="'level-' + currentAssessDetail.level">{{ currentAssessDetail.level }}</span></span>
          </div>
          <div class="detail-field">
            <span class="field-label">完成状态：</span>
            <span class="field-value">{{ currentAssessDetail.status }}</span>
          </div>
        </div>
        <div class="hazard-detail-attachments">
          <div class="attachments-title">相关附件</div>
          <div class="attachments-content">
            <span class="no-data">暂无数据</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 备用-安全评估 -->
    <div class="cockpit-body ops2-body" v-show="cockpitTab === 'ops3' && ops3SubTab === '安全评估'">
      <!-- 城市道路 -->
      <div class="ops2-card road-card assess-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市道路</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 评估指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">评估情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-road"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估单元总数</div>
                  <div class="item-value digital">3580<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估已完成</div>
                  <div class="item-value">2985<span class="unit">个</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估覆盖率</div>
                  <div class="item-value highlight">83.38<span class="unit">%</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">重要风险源</div>
                  <div class="item-value warning">126<span class="unit">处</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未评</div>
                  <div class="item-value warning">595<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item"></div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>评估单元<br/>(个)</th>
                    <th>评估已完成<br/>(个)</th>
                    <th>评估未完成<br/>(个)</th>
                    <th>超期未评<br/>(个)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>1095</td><td>912</td><td>183</td><td>180</td></tr>
                  <tr><td>宁波市</td><td>560</td><td>468</td><td>92</td><td>90</td></tr>
                  <tr><td>温州市</td><td>248</td><td>207</td><td>41</td><td>40</td></tr>
                  <tr><td>嘉兴市</td><td>76</td><td>63</td><td>13</td><td>13</td></tr>
                  <tr><td>湖州市</td><td>228</td><td>190</td><td>38</td><td>37</td></tr>
                  <tr><td>绍兴市</td><td>378</td><td>315</td><td>63</td><td>62</td></tr>
                  <tr><td>金华市</td><td>404</td><td>337</td><td>67</td><td>66</td></tr>
                  <tr><td>衢州市</td><td>188</td><td>157</td><td>31</td><td>30</td></tr>
                  <tr><td>舟山市</td><td>102</td><td>85</td><td>17</td><td>17</td></tr>
                  <tr><td>台州市</td><td>344</td><td>287</td><td>57</td><td>56</td></tr>
                  <tr><td>丽水市</td><td>211</td><td>176</td><td>35</td><td>34</td></tr>
                  <tr class="total-row"><td>合计</td><td>3834</td><td>3197</td><td>637</td><td>625</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市桥梁 -->
      <div class="ops2-card bridge-card assess-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市桥梁</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 评估指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">评估情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-bridge"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估单元总数</div>
                  <div class="item-value digital">05520<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估已完成</div>
                  <div class="item-value digital">04598<span class="unit">个</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估覆盖率</div>
                  <div class="item-value highlight">83.30<span class="unit">%</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">重要风险源</div>
                  <div class="item-value warning">89<span class="unit">处</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未评</div>
                  <div class="item-value warning">00922<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item"></div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>评估单元<br/>(个)</th>
                    <th>评估已完成<br/>(个)</th>
                    <th>评估未完成<br/>(个)</th>
                    <th>超期未评<br/>(个)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>538</td><td>448</td><td>90</td><td>88</td></tr>
                  <tr><td>宁波市</td><td>452</td><td>377</td><td>75</td><td>73</td></tr>
                  <tr><td>温州市</td><td>430</td><td>359</td><td>71</td><td>70</td></tr>
                  <tr><td>嘉兴市</td><td>668</td><td>557</td><td>111</td><td>109</td></tr>
                  <tr><td>湖州市</td><td>323</td><td>270</td><td>53</td><td>52</td></tr>
                  <tr><td>绍兴市</td><td>538</td><td>449</td><td>89</td><td>87</td></tr>
                  <tr><td>金华市</td><td>495</td><td>413</td><td>82</td><td>80</td></tr>
                  <tr><td>衢州市</td><td>258</td><td>215</td><td>43</td><td>42</td></tr>
                  <tr><td>舟山市</td><td>194</td><td>162</td><td>32</td><td>31</td></tr>
                  <tr><td>台州市</td><td>463</td><td>386</td><td>77</td><td>75</td></tr>
                  <tr><td>丽水市</td><td>301</td><td>251</td><td>50</td><td>49</td></tr>
                  <tr class="total-row"><td>合计</td><td>4660</td><td>3887</td><td>773</td><td>756</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- 城市隧道 -->
      <div class="ops2-card tunnel-card assess-layout">
        <div class="ops2-card-header">
          <span class="header-icon">▌</span>
          <span class="header-title">城市隧道</span>
          <span class="header-icon">▌</span>
        </div>
        <div class="ops2-card-content">
          <!-- 评估指标 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-arrow">▶</span>
              <span class="section-name">评估情况</span>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-tunnel"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估单元总数</div>
                  <div class="item-value digital">00242<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-chart"><path d="M3 13h2v8H3zm4-6h2v14H7zm4 4h2v10h-2zm4-8h2v18h-2zm4 6h2v12h-2z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估已完成</div>
                  <div class="item-value digital">00201<span class="unit">个</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box">
                  <svg viewBox="0 0 24 24" class="icon-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#00e5ff"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">评估覆盖率</div>
                  <div class="item-value highlight">83.06<span class="unit">%</span></div>
                </div>
              </div>
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">重要风险源</div>
                  <div class="item-value warning">18<span class="unit">处</span></div>
                </div>
              </div>
            </div>
            <div class="inspection-row">
              <div class="inspection-item">
                <div class="item-icon-box warning">
                  <svg viewBox="0 0 24 24" class="icon-alert"><path d="M12 2L1 21h22L12 2zm0 4l7.53 13H4.47L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z" fill="#ffeb3b"/></svg>
                </div>
                <div class="item-content">
                  <div class="item-label">超期未评</div>
                  <div class="item-value warning">00041<span class="unit">个</span></div>
                </div>
              </div>
              <div class="inspection-item"></div>
            </div>
          </div>
          <!-- 设区市数据统计 -->
          <div class="ops2-section">
            <div class="section-header">
              <span class="section-diamond">◆</span>
              <span class="section-name">设区市数据统计</span>
            </div>
            <!-- 列表视图 -->
            <div class="ops2-table-wrapper">
              <table class="ops2-table">
                <thead>
                  <tr>
                    <th>设区市</th>
                    <th>评估单元<br/>(个)</th>
                    <th>评估已完成<br/>(个)</th>
                    <th>评估未完成<br/>(个)</th>
                    <th>超期未评<br/>(个)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>杭州市</td><td>27</td><td>22</td><td>5</td><td>5</td></tr>
                  <tr><td>宁波市</td><td>22</td><td>18</td><td>4</td><td>4</td></tr>
                  <tr><td>温州市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>嘉兴市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>湖州市</td><td>4</td><td>3</td><td>1</td><td>1</td></tr>
                  <tr><td>绍兴市</td><td>6</td><td>5</td><td>1</td><td>1</td></tr>
                  <tr><td>金华市</td><td>13</td><td>11</td><td>2</td><td>2</td></tr>
                  <tr><td>衢州市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr><td>舟山市</td><td>3</td><td>3</td><td>0</td><td>0</td></tr>
                  <tr><td>台州市</td><td>9</td><td>7</td><td>2</td><td>2</td></tr>
                  <tr><td>丽水市</td><td>5</td><td>4</td><td>1</td><td>1</td></tr>
                  <tr class="total-row"><td>合计</td><td>111</td><td>91</td><td>20</td><td>20</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 运维管理-设施检测详情弹窗（同工作台检测管理详情） -->
    <a-modal v-model:open="showOpsInspectDetail" title="检测管理详情" width="900px" :footer="null" class="risk-detail-modal">
      <a-tabs v-model:activeKey="opsInspectDetailTab" class="detail-tabs">
        <a-tab-pane v-if="opsLayer === 'road'" key="road" tab="道路">
          <div v-if="opsInspectDrillType" class="drill-down-header">
            <a-button size="small" @click="opsInspectDrillType = null"><template #icon><ArrowLeftOutlined /></template>返回</a-button>
            <span class="drill-down-title">{{ opsInspectDrillTitle }}</span>
          </div>
          <a-table v-if="!opsInspectDrillType" :columns="opsInspectColumns.road" :data-source="opsInspectDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          <a-table v-else :columns="opsDrillColumns" :data-source="opsDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
        </a-tab-pane>
        <a-tab-pane v-if="opsLayer === 'bridge'" key="bridge" tab="桥梁">
          <div v-if="opsInspectDrillType" class="drill-down-header">
            <a-button size="small" @click="opsInspectDrillType = null"><template #icon><ArrowLeftOutlined /></template>返回</a-button>
            <span class="drill-down-title">{{ opsInspectDrillTitle }}</span>
          </div>
          <a-table v-if="!opsInspectDrillType" :columns="opsInspectColumns.bridge" :data-source="opsInspectDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          <a-table v-else :columns="opsDrillColumns" :data-source="opsDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
        </a-tab-pane>
        <a-tab-pane v-if="opsLayer === 'tunnel'" key="tunnel" tab="隧道">
          <div v-if="opsInspectDrillType" class="drill-down-header">
            <a-button size="small" @click="opsInspectDrillType = null"><template #icon><ArrowLeftOutlined /></template>返回</a-button>
            <span class="drill-down-title">{{ opsInspectDrillTitle }}</span>
          </div>
          <a-table v-if="!opsInspectDrillType" :columns="opsInspectColumns.tunnel" :data-source="opsInspectDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
          <a-table v-else :columns="opsDrillColumns" :data-source="opsDrillData" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 400 }" bordered />
        </a-tab-pane>
      </a-tabs>
    </a-modal>
    <!-- 运维管理-隐患排查详情弹窗 -->
    <a-modal v-model:open="showOpsHiddenDetail" title="隐患排查详情" width="1100px" :footer="null" class="risk-detail-modal">
      <a-table :columns="riskDetailColumns.hidden" :data-source="riskDetailData.hidden" :pagination="false" size="small" bordered />
    </a-modal>
    <!-- 运维管理-安全评估详情弹窗 -->
    <a-modal v-model:open="showOpsAssessDetail" title="安全评估详情" width="1100px" :footer="null" class="risk-detail-modal">
      <a-table :columns="riskDetailColumns.assess" :data-source="riskDetailData.assess" :pagination="false" size="small" bordered />
    </a-modal>

    <!-- 市级数据弹窗 -->
    <a-modal
      v-model:open="showFacilityModal"
      :title="`${layerNameMap[activeLayer]}详情`"
      width="960px"
      :footer="null"
      class="facility-modal"
    >
      <a-table :columns="facilityColumns[activeLayer]" :data-source="facilityData[activeLayer]" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 桥梁市级数据弹窗 -->
    <a-modal
      v-model:open="showBridgeModal"
      title="桥梁详情"
      width="960px"
      :footer="null"
      class="facility-modal"
    >
      <a-table :columns="facilityColumns.bridge" :data-source="facilityData.bridge" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 隧道市级数据弹窗 -->
    <a-modal
      v-model:open="showTunnelModal"
      title="隧道详情"
      width="960px"
      :footer="null"
      class="facility-modal"
    >
      <a-table :columns="facilityColumns.tunnel" :data-source="facilityData.tunnel" :pagination="false" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
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

    <!-- 道路列表详情弹窗 -->
    <a-modal v-model:open="showRoadListModal" title="道路详情" width="1400px" :footer="null" class="facility-modal">
      <div class="modal-filter-bar">
        <div class="filter-item"><span class="filter-label">归属地区</span><input class="filter-input" v-model="roadFilter.region" placeholder="请输入" /></div>
        <div class="filter-item"><span class="filter-label">道路名称</span><input class="filter-input" v-model="roadFilter.name" placeholder="请输入" /></div>
        <div class="filter-item"><span class="filter-label">道路等级</span><select class="filter-select" v-model="roadFilter.level"><option value=""></option><option>主干路</option><option>次干路</option><option>支路</option><option>城市快速路</option></select></div>
        <div class="filter-item"><span class="filter-label">综合评价等级</span><select class="filter-select" v-model="roadFilter.grade"><option value=""></option><option>A</option><option>B</option><option>C</option><option>D</option></select></div>
        <div class="filter-item"><span class="filter-label">状态</span><select class="filter-select" v-model="roadFilter.status"><option value=""></option><option>在用</option><option>拆除或完全封控</option></select></div>
        <div class="filter-item"><span class="filter-label">数据是否完善</span><select class="filter-select" v-model="roadFilter.dataComplete"><option value=""></option><option>是</option><option>否</option></select></div>
        <div class="filter-item"><span class="filter-label">发布状态</span><select class="filter-select" v-model="roadFilter.publishStatus"><option value=""></option><option>草稿</option><option>已发布</option></select></div>
        <div class="filter-item"><span class="filter-label">检测是否超期</span><select class="filter-select" v-model="roadFilter.overdue"><option value=""></option><option>未超期</option><option>即将超期</option><option>已超期</option></select></div>
      </div>
      <a-table :columns="roadListModalColumns" :data-source="filteredRoadList" :pagination="{ pageSize: 20, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 420 }" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span class="op-link" @click="handleFacilityView(record, 'road')">查看</span>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 桥梁列表详情弹窗 -->
    <a-modal v-model:open="showBridgeListModal" title="桥梁详情" width="1500px" :footer="null" class="facility-modal">
      <div class="modal-filter-bar">
        <div class="filter-item"><span class="filter-label">归属地区</span><input class="filter-input" v-model="bridgeFilter.region" placeholder="请输入" /></div>
        <div class="filter-item"><span class="filter-label">桥梁名称</span><input class="filter-input" v-model="bridgeFilter.name" placeholder="请输入" /></div>
        <div class="filter-item"><span class="filter-label">桥梁类型</span><select class="filter-select" v-model="bridgeFilter.type"><option value=""></option><option>特大桥</option><option>大桥</option><option>中桥</option><option>小桥</option><option>立交桥</option><option>高架桥</option><option>其他</option></select></div>
        <div class="filter-item"><span class="filter-label">是否涉航桥梁</span><select class="filter-select" v-model="bridgeFilter.navigable"><option value=""></option><option>是</option><option>否</option></select></div>
        <div class="filter-item"><span class="filter-label">综合评价等级</span><select class="filter-select" v-model="bridgeFilter.grade"><option value=""></option><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>合格</option><option>不合格</option></select></div>
        <div class="filter-item"><span class="filter-label">状态</span><select class="filter-select" v-model="bridgeFilter.status"><option value=""></option><option>在用</option><option>拆除或完全封控</option></select></div>
        <div class="filter-item"><span class="filter-label">数据是否完善</span><select class="filter-select" v-model="bridgeFilter.dataComplete"><option value=""></option><option>是</option><option>否</option></select></div>
        <div class="filter-item"><span class="filter-label">发布状态</span><select class="filter-select" v-model="bridgeFilter.publishStatus"><option value=""></option><option>草稿</option><option>已发布</option></select></div>
        <div class="filter-item"><span class="filter-label">检测是否超期</span><select class="filter-select" v-model="bridgeFilter.overdue"><option value=""></option><option>未超期</option><option>即将超期</option><option>已超期</option></select></div>
      </div>
      <a-table :columns="bridgeListModalColumns" :data-source="filteredBridgeList" :pagination="{ pageSize: 20, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 420 }" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span class="op-link" @click="handleFacilityView(record, 'bridge')">查看</span>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 隧道列表详情弹窗 -->
    <a-modal v-model:open="showTunnelListModal" title="隧道详情" width="1600px" :footer="null" class="facility-modal">
      <div class="modal-filter-bar">
        <div class="filter-item"><span class="filter-label">归属地区</span><input class="filter-input" v-model="tunnelFilter.region" placeholder="请输入" /></div>
        <div class="filter-item"><span class="filter-label">隧道名称</span><input class="filter-input" v-model="tunnelFilter.name" placeholder="请输入" /></div>
        <div class="filter-item"><span class="filter-label">隧道类型</span><select class="filter-select" v-model="tunnelFilter.type"><option value=""></option><option>城市道路隧道</option><option>人行地道</option></select></div>
        <div class="filter-item"><span class="filter-label">城市道路隧道分类</span><select class="filter-select" v-model="tunnelFilter.roadClass"><option value=""></option><option>特长隧道(L&gt;3000m)</option><option>长隧道(1000m&lt;L≤3000m)</option><option>中隧道(500m&lt;L≤1000m)</option><option>短隧道(L≤500m)</option></select></div>
        <div class="filter-item"><span class="filter-label">是否地下隧道</span><select class="filter-select" v-model="tunnelFilter.underground"><option value=""></option><option>是</option><option>否</option></select></div>
        <div class="filter-item"><span class="filter-label">综合评价等级</span><select class="filter-select" v-model="tunnelFilter.grade"><option value=""></option><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option></select></div>
        <div class="filter-item"><span class="filter-label">状态</span><select class="filter-select" v-model="tunnelFilter.status"><option value=""></option><option>在用</option><option>拆除或完全封控</option></select></div>
        <div class="filter-item"><span class="filter-label">数据是否完善</span><select class="filter-select" v-model="tunnelFilter.dataComplete"><option value=""></option><option>是</option><option>否</option></select></div>
        <div class="filter-item"><span class="filter-label">发布状态</span><select class="filter-select" v-model="tunnelFilter.publishStatus"><option value=""></option><option>草稿</option><option>已发布</option></select></div>
        <div class="filter-item"><span class="filter-label">检测是否超期</span><select class="filter-select" v-model="tunnelFilter.overdue"><option value=""></option><option>未超期</option><option>即将超期</option><option>已超期</option></select></div>
      </div>
      <a-table :columns="tunnelListModalColumns" :data-source="filteredTunnelList" :pagination="{ pageSize: 20, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 420 }" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span class="op-link" @click="handleFacilityView(record, 'tunnel')">查看</span>
          </template>
        </template>
      </a-table>
    </a-modal>

    <!-- 风险隐患表和提示单弹窗 -->
    <a-modal v-model:open="showRiskHintModal" title="风险隐患表和提示单" width="1000px" :footer="null" class="risk-hint-modal">
      <div class="risk-hint-tabs">
        <div class="risk-hint-tab" :class="{ active: riskHintTab === 'road' }" @click="riskHintTab = 'road'">道路</div>
        <div class="risk-hint-tab" :class="{ active: riskHintTab === 'bridge' }" @click="riskHintTab = 'bridge'">桥梁</div>
        <div class="risk-hint-tab" :class="{ active: riskHintTab === 'tunnel' }" @click="riskHintTab = 'tunnel'">隧道</div>
        <span class="risk-hint-download" @click="handleRiskHintDownload">
          <span class="download-icon">⬇</span>下载
        </span>
      </div>
      <div class="risk-hint-content">
        <!-- 设施检测 -->
        <div class="risk-hint-section">
          <div class="risk-hint-section-title">设施检测</div>
          <div class="risk-hint-section-body">
            <template v-if="riskHintTab === 'road'">
              <p>全省开展设施检测，应检测道路<strong>{{ riskHintData.road.facilityInspection.shouldInspect }}</strong>条，已检测<strong>{{ riskHintData.road.facilityInspection.inspected }}</strong>条，应检未检<strong class="text-orange">{{ riskHintData.road.facilityInspection.uninspected }}</strong>条，超期未检<strong class="text-red">{{ riskHintData.road.facilityInspection.overdue }}</strong>条，检测出D级道路<strong class="text-red">{{ riskHintData.road.facilityInspection.gradeD }}</strong>条，应修未修<strong class="text-orange">{{ riskHintData.road.facilityInspection.shouldRepair }}</strong>条。</p>
            </template>
            <template v-else-if="riskHintTab === 'bridge'">
              <p>全省开展设施检测，应检测桥梁<strong>{{ riskHintData.bridge.facilityInspection.shouldInspect }}</strong>座，已检测<strong>{{ riskHintData.bridge.facilityInspection.inspected }}</strong>座，应检未检<strong class="text-orange">{{ riskHintData.bridge.facilityInspection.uninspected }}</strong>座，超期未检<strong class="text-red">{{ riskHintData.bridge.facilityInspection.overdue }}</strong>座，检测出D、E级桥梁<strong class="text-red">{{ riskHintData.bridge.facilityInspection.gradeDE }}</strong>座，不合格桥梁<strong class="text-red">{{ riskHintData.bridge.facilityInspection.unqualified }}</strong>座，应修未修<strong class="text-orange">{{ riskHintData.bridge.facilityInspection.shouldRepair }}</strong>座。</p>
            </template>
            <template v-else>
              <p>全省开展设施检测，应检测隧道<strong>{{ riskHintData.tunnel.facilityInspection.shouldInspect }}</strong>座，已检测<strong>{{ riskHintData.tunnel.facilityInspection.inspected }}</strong>座，应检未检<strong class="text-orange">{{ riskHintData.tunnel.facilityInspection.uninspected }}</strong>座，超期未检<strong class="text-red">{{ riskHintData.tunnel.facilityInspection.overdue }}</strong>座，检测出D、E级隧道<strong class="text-red">{{ riskHintData.tunnel.facilityInspection.gradeDE }}</strong>座，应修未修<strong class="text-orange">{{ riskHintData.tunnel.facilityInspection.shouldRepair }}</strong>座。</p>
            </template>
          </div>
        </div>
        <!-- 隐患排查 -->
        <div class="risk-hint-section">
          <div class="risk-hint-section-title">隐患排查</div>
          <div class="risk-hint-section-body">
            <template v-if="riskHintTab === 'road'">
              <p>全省开展隐患排查，应排查道路<strong>{{ riskHintData.road.hiddenDanger.shouldCheck }}</strong>条，已排查<strong>{{ riskHintData.road.hiddenDanger.checked }}</strong>条。排查出问题隐患<strong>{{ riskHintData.road.hiddenDanger.totalHazards }}</strong>个，一般隐患<strong>{{ riskHintData.road.hiddenDanger.general }}</strong>个，较大隐患<strong class="text-orange">{{ riskHintData.road.hiddenDanger.larger }}</strong>个，重大隐患<strong class="text-red">{{ riskHintData.road.hiddenDanger.major }}</strong>个，已整改问题隐患<strong class="text-green">{{ riskHintData.road.hiddenDanger.fixed }}</strong>个。</p>
            </template>
            <template v-else-if="riskHintTab === 'bridge'">
              <p>全省开展隐患排查，应排查桥梁<strong>{{ riskHintData.bridge.hiddenDanger.shouldCheck }}</strong>座，已排查<strong>{{ riskHintData.bridge.hiddenDanger.checked }}</strong>座。排查出问题隐患<strong>{{ riskHintData.bridge.hiddenDanger.totalHazards }}</strong>个，一般隐患<strong>{{ riskHintData.bridge.hiddenDanger.general }}</strong>个，较大隐患<strong class="text-orange">{{ riskHintData.bridge.hiddenDanger.larger }}</strong>个，重大隐患<strong class="text-red">{{ riskHintData.bridge.hiddenDanger.major }}</strong>个，已整改问题隐患<strong class="text-green">{{ riskHintData.bridge.hiddenDanger.fixed }}</strong>个。</p>
            </template>
            <template v-else>
              <p>全省开展隐患排查，应排查隧道<strong>{{ riskHintData.tunnel.hiddenDanger.shouldCheck }}</strong>座，已排查<strong>{{ riskHintData.tunnel.hiddenDanger.checked }}</strong>座。排查出问题隐患<strong>{{ riskHintData.tunnel.hiddenDanger.totalHazards }}</strong>个，一般隐患<strong>{{ riskHintData.tunnel.hiddenDanger.general }}</strong>个，较大隐患<strong class="text-orange">{{ riskHintData.tunnel.hiddenDanger.larger }}</strong>个，重大隐患<strong class="text-red">{{ riskHintData.tunnel.hiddenDanger.major }}</strong>个，已整改问题隐患<strong class="text-green">{{ riskHintData.tunnel.hiddenDanger.fixed }}</strong>个。</p>
            </template>
          </div>
        </div>
        <!-- 设备监测 -->
        <div class="risk-hint-section">
          <div class="risk-hint-section-title">设备监测</div>
          <div class="risk-hint-section-body">
            <template v-if="riskHintTab === 'road'">
              <p>全省应接入监测设备道路<strong>{{ riskHintData.road.deviceMonitor.shouldConnect }}</strong>条，已接入<strong>{{ riskHintData.road.deviceMonitor.connected }}</strong>条，接入率<strong>{{ riskHintData.road.deviceMonitor.connectRate }}%</strong>，监测设备总数<strong>{{ riskHintData.road.deviceMonitor.totalDevices }}</strong>个，在线数<strong>{{ riskHintData.road.deviceMonitor.online }}</strong>个，在线率<strong>{{ riskHintData.road.deviceMonitor.onlineRate }}%</strong>。监测出预警<strong>{{ riskHintData.road.deviceMonitor.warnings }}</strong>条，一级预警<strong class="text-red">{{ riskHintData.road.deviceMonitor.warningLevel1 }}</strong>条，二级预警<strong class="text-orange">{{ riskHintData.road.deviceMonitor.warningLevel2 }}</strong>条，三级预警<strong>{{ riskHintData.road.deviceMonitor.warningLevel3 }}</strong>条。已处置预警<strong class="text-green">{{ riskHintData.road.deviceMonitor.handled }}</strong>条。</p>
            </template>
            <template v-else-if="riskHintTab === 'bridge'">
              <p>全省应接入监测设备桥梁<strong>{{ riskHintData.bridge.deviceMonitor.shouldConnect }}</strong>座，已接入<strong>{{ riskHintData.bridge.deviceMonitor.connected }}</strong>座，接入率<strong>{{ riskHintData.bridge.deviceMonitor.connectRate }}%</strong>，监测设备总数<strong>{{ riskHintData.bridge.deviceMonitor.totalDevices }}</strong>个，在线数<strong>{{ riskHintData.bridge.deviceMonitor.online }}</strong>个，在线率<strong>{{ riskHintData.bridge.deviceMonitor.onlineRate }}%</strong>。监测出预警<strong>{{ riskHintData.bridge.deviceMonitor.warnings }}</strong>条，一级预警<strong class="text-red">{{ riskHintData.bridge.deviceMonitor.warningLevel1 }}</strong>条，二级预警<strong class="text-orange">{{ riskHintData.bridge.deviceMonitor.warningLevel2 }}</strong>条，三级预警<strong>{{ riskHintData.bridge.deviceMonitor.warningLevel3 }}</strong>条。已处置预警<strong class="text-green">{{ riskHintData.bridge.deviceMonitor.handled }}</strong>条。</p>
            </template>
            <template v-else>
              <p>全省应接入监测设备隧道<strong>{{ riskHintData.tunnel.deviceMonitor.shouldConnect }}</strong>座，已接入<strong>{{ riskHintData.tunnel.deviceMonitor.connected }}</strong>座，接入率<strong>{{ riskHintData.tunnel.deviceMonitor.connectRate }}%</strong>，监测设备总数<strong>{{ riskHintData.tunnel.deviceMonitor.totalDevices }}</strong>个，在线数<strong>{{ riskHintData.tunnel.deviceMonitor.online }}</strong>个，在线率<strong>{{ riskHintData.tunnel.deviceMonitor.onlineRate }}%</strong>。监测出预警<strong>{{ riskHintData.tunnel.deviceMonitor.warnings }}</strong>条，一级预警<strong class="text-red">{{ riskHintData.tunnel.deviceMonitor.warningLevel1 }}</strong>条，二级预警<strong class="text-orange">{{ riskHintData.tunnel.deviceMonitor.warningLevel2 }}</strong>条，三级预警<strong>{{ riskHintData.tunnel.deviceMonitor.warningLevel3 }}</strong>条。已处置预警<strong class="text-green">{{ riskHintData.tunnel.deviceMonitor.handled }}</strong>条。</p>
            </template>
          </div>
        </div>
        <!-- 安全评估 -->
        <div class="risk-hint-section">
          <div class="risk-hint-section-title">安全评估</div>
          <div class="risk-hint-section-body">
            <template v-if="riskHintTab === 'road'">
              <p>全省开展安全评估，应评估道路<strong>{{ riskHintData.road.safetyAssess.shouldAssess }}</strong>条，已评估<strong>{{ riskHintData.road.safetyAssess.assessed }}</strong>条。评估出问题隐患<strong>{{ riskHintData.road.safetyAssess.totalHazards }}</strong>个，一般隐患<strong>{{ riskHintData.road.safetyAssess.general }}</strong>个，较大隐患<strong class="text-orange">{{ riskHintData.road.safetyAssess.larger }}</strong>个，重大隐患<strong class="text-red">{{ riskHintData.road.safetyAssess.major }}</strong>个，已整改问题隐患<strong class="text-green">{{ riskHintData.road.safetyAssess.fixed }}</strong>个。</p>
            </template>
            <template v-else-if="riskHintTab === 'bridge'">
              <p>全省开展安全评估，应评估桥梁<strong>{{ riskHintData.bridge.safetyAssess.shouldAssess }}</strong>座，已评估<strong>{{ riskHintData.bridge.safetyAssess.assessed }}</strong>座。评估出问题隐患<strong>{{ riskHintData.bridge.safetyAssess.totalHazards }}</strong>个，一般隐患<strong>{{ riskHintData.bridge.safetyAssess.general }}</strong>个，较大隐患<strong class="text-orange">{{ riskHintData.bridge.safetyAssess.larger }}</strong>个，重大隐患<strong class="text-red">{{ riskHintData.bridge.safetyAssess.major }}</strong>个，已整改问题隐患<strong class="text-green">{{ riskHintData.bridge.safetyAssess.fixed }}</strong>个。</p>
            </template>
            <template v-else>
              <p>全省开展安全评估，应评估隧道<strong>{{ riskHintData.tunnel.safetyAssess.shouldAssess }}</strong>座，已评估<strong>{{ riskHintData.tunnel.safetyAssess.assessed }}</strong>座。评估出问题隐患<strong>{{ riskHintData.tunnel.safetyAssess.totalHazards }}</strong>个，一般隐患<strong>{{ riskHintData.tunnel.safetyAssess.general }}</strong>个，较大隐患<strong class="text-orange">{{ riskHintData.tunnel.safetyAssess.larger }}</strong>个，重大隐患<strong class="text-red">{{ riskHintData.tunnel.safetyAssess.major }}</strong>个，已整改问题隐患<strong class="text-green">{{ riskHintData.tunnel.safetyAssess.fixed }}</strong>个。</p>
            </template>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 预警详情弹窗 -->
    <a-modal v-model:open="showAlarmDetailModal" :title="`${layerNameMap[monitorLayer]}报警详情`" width="1000px" :footer="null" class="alarm-detail-modal">
      <a-table :columns="alarmSummaryColumns" :data-source="alarmSummaryData" :pagination="{ pageSize: 15, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>

    <!-- 报警下钻明细弹窗 -->
    <a-modal v-model:open="showAlarmDrillDownModal" :title="`${drillDownCity}${getDrillDownTitle()}明细`" width="1400px" :footer="null" class="alarm-drilldown-modal">
      <div class="modal-filter-bar drilldown-filter-bar">
        <a-form layout="inline" :model="drillDownFilters" style="margin-bottom: 12px;">
          <a-form-item label="设施名称" :label-style="{ color: '#fff' }">
            <a-input v-model:value="drillDownFilters.facilityName" placeholder="请输入" allow-clear style="width: 180px" />
          </a-form-item>
          <a-form-item label="监测项" :label-style="{ color: '#fff' }">
            <a-select v-model:value="drillDownFilters.monitorItem" placeholder="请选择" allow-clear style="width: 160px">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option v-if="monitorLayer === 'road'" value="路面状况">路面状况</a-select-option>
              <a-select-option v-if="monitorLayer === 'bridge'" value="应变">应变</a-select-option>
              <a-select-option v-if="monitorLayer === 'bridge'" value="位移">位移</a-select-option>
              <a-select-option v-if="monitorLayer === 'bridge'" value="加速度">加速度</a-select-option>
              <a-select-option v-if="monitorLayer === 'bridge'" value="吊杆索力振动">吊杆索力振动</a-select-option>
              <a-select-option v-if="monitorLayer === 'bridge'" value="挠度">挠度</a-select-option>
              <a-select-option v-if="monitorLayer === 'tunnel'" value="位移">位移</a-select-option>
              <a-select-option v-if="monitorLayer === 'tunnel'" value="沉降">沉降</a-select-option>
              <a-select-option v-if="monitorLayer === 'tunnel'" value="收敛">收敛</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="处置状态" :label-style="{ color: '#fff' }">
            <a-select v-model:value="drillDownFilters.handleStatus" placeholder="请选择" allow-clear style="width: 140px">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="已完成">已完成</a-select-option>
              <a-select-option value="未完成">未完成</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button @click="resetDrillDownFilters">重置</a-button>
              <a-button type="primary" @click="handleDrillDownSearch">搜索</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <a-table :columns="alarmDrillDownColumns" :data-source="filteredDrillDownData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="small" :scroll="{ x: 'max-content', y: 460 }" bordered />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, reactive, computed, watch, nextTick, onMounted, onUnmounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Modal as AModal, Table as ATable } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import * as echarts from 'echarts'

const router = useRouter()
const route = useRoute()

const statsChartRef = ref<HTMLElement | null>(null)
const bridgeStatsChartRef = ref<HTMLElement | null>(null)
const tunnelStatsChartRef = ref<HTMLElement | null>(null)
const riskChartRef = ref<HTMLElement | null>(null)
let statsChart: echarts.ECharts | null = null
let bridgeStatsChart: echarts.ECharts | null = null
let tunnelStatsChart: echarts.ECharts | null = null
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
const cockpitTab = ref<'overview' | 'monitor' | 'ops2' | 'ops3'>('overview')
const ops2SubTab = ref('日常巡检')
const ops2SubTabs = ['日常巡检', '安全评估', '定期检测']
const ops3SubTab = ref('定期检测')
const ops3SubTabs = ['定期检测', '日常巡检', '病害处理', '安全评估']

// 隐患排查页签状态（道路、桥梁、隧道）
const hazardRoadView = ref<'chart' | 'list'>('chart')
const hazardBridgeView = ref<'chart' | 'list'>('chart')
const hazardTunnelView = ref<'chart' | 'list'>('chart')

// 隐患排查数据
const roadHazardData = [
  { city: '杭州市', total: 1095, completed: 912, incomplete: 183, overdue: 180 },
  { city: '宁波市', total: 560, completed: 468, incomplete: 92, overdue: 90 },
  { city: '温州市', total: 248, completed: 207, incomplete: 41, overdue: 40 },
  { city: '嘉兴市', total: 76, completed: 63, incomplete: 13, overdue: 13 },
  { city: '湖州市', total: 228, completed: 190, incomplete: 38, overdue: 37 },
  { city: '绍兴市', total: 378, completed: 315, incomplete: 63, overdue: 62 },
  { city: '金华市', total: 404, completed: 337, incomplete: 67, overdue: 66 },
  { city: '衢州市', total: 188, completed: 157, incomplete: 31, overdue: 30 },
  { city: '舟山市', total: 102, completed: 85, incomplete: 17, overdue: 17 },
  { city: '台州市', total: 344, completed: 287, incomplete: 57, overdue: 56 },
  { city: '丽水市', total: 211, completed: 176, incomplete: 35, overdue: 34 }
]

const bridgeHazardData = [
  { city: '杭州市', total: 538, completed: 448, incomplete: 90, overdue: 88 },
  { city: '宁波市', total: 452, completed: 377, incomplete: 75, overdue: 73 },
  { city: '温州市', total: 430, completed: 359, incomplete: 71, overdue: 70 },
  { city: '嘉兴市', total: 668, completed: 557, incomplete: 111, overdue: 109 },
  { city: '湖州市', total: 323, completed: 270, incomplete: 53, overdue: 52 },
  { city: '绍兴市', total: 538, completed: 449, incomplete: 89, overdue: 87 },
  { city: '金华市', total: 495, completed: 413, incomplete: 82, overdue: 80 },
  { city: '衢州市', total: 258, completed: 215, incomplete: 43, overdue: 42 },
  { city: '舟山市', total: 194, completed: 162, incomplete: 32, overdue: 31 },
  { city: '台州市', total: 463, completed: 386, incomplete: 77, overdue: 75 },
  { city: '丽水市', total: 301, completed: 251, incomplete: 50, overdue: 49 }
]

const tunnelHazardData = [
  { city: '杭州市', total: 27, completed: 22, incomplete: 5, overdue: 5 },
  { city: '宁波市', total: 22, completed: 18, incomplete: 4, overdue: 4 },
  { city: '温州市', total: 13, completed: 11, incomplete: 2, overdue: 2 },
  { city: '嘉兴市', total: 4, completed: 3, incomplete: 1, overdue: 1 },
  { city: '湖州市', total: 4, completed: 3, incomplete: 1, overdue: 1 },
  { city: '绍兴市', total: 6, completed: 5, incomplete: 1, overdue: 1 },
  { city: '金华市', total: 13, completed: 11, incomplete: 2, overdue: 2 },
  { city: '衢州市', total: 5, completed: 4, incomplete: 1, overdue: 1 },
  { city: '舟山市', total: 3, completed: 3, incomplete: 0, overdue: 0 },
  { city: '台州市', total: 9, completed: 7, incomplete: 2, overdue: 2 },
  { city: '丽水市', total: 5, completed: 4, incomplete: 1, overdue: 1 }
]

// 安全评估页签状态（道路、桥梁、隧道）
const assessRoadView = ref<'chart' | 'list'>('chart')
const assessBridgeView = ref<'chart' | 'list'>('chart')
const assessTunnelView = ref<'chart' | 'list'>('chart')

// 安全评估设区市数据
const roadAssessData = [
  { city: '杭州市', total: 1095, completed: 912, incomplete: 183, overdue: 180 },
  { city: '宁波市', total: 560, completed: 468, incomplete: 92, overdue: 90 },
  { city: '温州市', total: 248, completed: 207, incomplete: 41, overdue: 40 },
  { city: '嘉兴市', total: 76, completed: 63, incomplete: 13, overdue: 13 },
  { city: '湖州市', total: 228, completed: 190, incomplete: 38, overdue: 37 },
  { city: '绍兴市', total: 378, completed: 315, incomplete: 63, overdue: 62 },
  { city: '金华市', total: 404, completed: 337, incomplete: 67, overdue: 66 },
  { city: '衢州市', total: 188, completed: 157, incomplete: 31, overdue: 30 },
  { city: '舟山市', total: 102, completed: 85, incomplete: 17, overdue: 17 },
  { city: '台州市', total: 344, completed: 287, incomplete: 57, overdue: 56 },
  { city: '丽水市', total: 211, completed: 176, incomplete: 35, overdue: 34 }
]

const bridgeAssessData = [
  { city: '杭州市', total: 538, completed: 448, incomplete: 90, overdue: 88 },
  { city: '宁波市', total: 452, completed: 377, incomplete: 75, overdue: 73 },
  { city: '温州市', total: 430, completed: 359, incomplete: 71, overdue: 70 },
  { city: '嘉兴市', total: 668, completed: 557, incomplete: 111, overdue: 109 },
  { city: '湖州市', total: 323, completed: 270, incomplete: 53, overdue: 52 },
  { city: '绍兴市', total: 538, completed: 449, incomplete: 89, overdue: 87 },
  { city: '金华市', total: 495, completed: 413, incomplete: 82, overdue: 80 },
  { city: '衢州市', total: 258, completed: 215, incomplete: 43, overdue: 42 },
  { city: '舟山市', total: 194, completed: 162, incomplete: 32, overdue: 31 },
  { city: '台州市', total: 463, completed: 386, incomplete: 77, overdue: 75 },
  { city: '丽水市', total: 301, completed: 251, incomplete: 50, overdue: 49 }
]

const tunnelAssessData = [
  { city: '杭州市', total: 27, completed: 22, incomplete: 5, overdue: 5 },
  { city: '宁波市', total: 22, completed: 18, incomplete: 4, overdue: 4 },
  { city: '温州市', total: 13, completed: 11, incomplete: 2, overdue: 2 },
  { city: '嘉兴市', total: 4, completed: 3, incomplete: 1, overdue: 1 },
  { city: '湖州市', total: 4, completed: 3, incomplete: 1, overdue: 1 },
  { city: '绍兴市', total: 6, completed: 5, incomplete: 1, overdue: 1 },
  { city: '金华市', total: 13, completed: 11, incomplete: 2, overdue: 2 },
  { city: '衢州市', total: 5, completed: 4, incomplete: 1, overdue: 1 },
  { city: '舟山市', total: 3, completed: 3, incomplete: 0, overdue: 0 },
  { city: '台州市', total: 9, completed: 7, incomplete: 2, overdue: 2 },
  { city: '丽水市', total: 5, completed: 4, incomplete: 1, overdue: 1 }
]

// 病害处理视图状态
const diseaseRoadSubTab = ref<'隐患排查' | '设施检测' | '设备监控' | '安全评估'>('隐患排查')
const diseaseBridgeSubTab = ref<'隐患排查' | '设施检测' | '设备监控' | '安全评估'>('隐患排查')
const diseaseTunnelSubTab = ref<'隐患排查' | '设施检测' | '设备监控' | '安全评估'>('隐患排查')
const diseaseRoadCaseFilter = ref<'未整改' | '已整改' | '全部'>('未整改')
const diseaseBridgeCaseFilter = ref<'未整改' | '已整改' | '全部'>('未整改')
const diseaseTunnelCaseFilter = ref<'未整改' | '已整改' | '全部'>('未整改')

// 病害处理地市整改率排名数据
const roadHazardRanking = [
  { city: '温州', rate: '92.50' }, { city: '宁波', rate: '92.00' },
  { city: '温州', rate: '90.50' }, { city: '湖州', rate: '89.00' },
  { city: '嘉兴', rate: '87.50' }, { city: '绍兴', rate: '87.00' },
  { city: '金华', rate: '86.00' }, { city: '衢州', rate: '86.00' },
  { city: '舟山', rate: '85.50' }, { city: '台州', rate: '83.50' },
  { city: '丽水', rate: '81.50' }
]
const bridgeHazardRanking = [
  { city: '嘉兴', rate: '90.50' }, { city: '绍兴', rate: '88.00' },
  { city: '金华', rate: '88.00' }, { city: '衢州', rate: '87.50' },
  { city: '舟山', rate: '86.50' }, { city: '台州', rate: '86.50' },
  { city: '丽水', rate: '86.50' }, { city: '杭州', rate: '86.00' },
  { city: '宁波', rate: '83.00' }, { city: '温州', rate: '82.00' },
  { city: '湖州', rate: '81.00' }
]
const tunnelHazardRanking = [
  { city: '金华', rate: '92.50' }, { city: '衢州', rate: '92.00' },
  { city: '舟山', rate: '89.00' }, { city: '台州', rate: '89.00' },
  { city: '丽水', rate: '88.50' }, { city: '杭州', rate: '88.00' },
  { city: '宁波', rate: '86.00' }, { city: '温州', rate: '84.00' },
  { city: '湖州', rate: '84.00' }, { city: '嘉兴', rate: '82.00' },
  { city: '绍兴', rate: '82.00' }
]

// SVG业务照片生成
const mkPhoto = (bg: string, accent: string, icon: string, label: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect width="200" height="120" fill="${bg}"/><rect x="5" y="5" width="190" height="110" rx="4" fill="none" stroke="${accent}" stroke-width="1" opacity="0.5"/><text x="100" y="40" text-anchor="middle" font-size="28">${icon}</text><text x="100" y="72" text-anchor="middle" fill="white" font-size="13" font-family="sans-serif">${label}</text><text x="100" y="105" text-anchor="middle" fill="${accent}" font-size="9" font-family="sans-serif" opacity="0.7">现场影像</text></svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

// 隐患排查照片
const hpRoad1 = mkPhoto('#1a3050', '#ff9800', '⚠', '路面纵向裂缝')
const hpRoad2 = mkPhoto('#1a3050', '#ffc107', '⚠', '路面横向裂缝')
const hpRoad3 = mkPhoto('#1a3050', '#f44336', '⚠', '路面网状龟裂')
const hpBridge1 = mkPhoto('#0d2844', '#42a5f5', '🌉', '桥梁支座锈蚀')
const hpBridge2 = mkPhoto('#0d2844', '#66bb6a', '🌉', '桥面面层网裂')
const hpBridge3 = mkPhoto('#0d2844', '#ffa726', '🌉', '桥面栏杆破损')
const hpTunnel1 = mkPhoto('#0d2d2d', '#26c6da', '🚇', '隧道衬砌裂缝')
const hpTunnel2 = mkPhoto('#0d2d2d', '#ffca28', '🚇', '隧道照明损坏')
const hpTunnel3 = mkPhoto('#0d2d2d', '#66bb6a', '🚇', '隧道衬砌渗水')

// 设施检测照片
const ssRoad1 = mkPhoto('#1a3050', '#ff9800', '🔍', '路面平整度检测')
const ssRoad2 = mkPhoto('#1a3050', '#ffc107', '🔍', '路面结构强度检测')
const ssRoad3 = mkPhoto('#1a3050', '#f44336', '🔍', '路基沉降检测')
const ssBridge1 = mkPhoto('#0d2844', '#42a5f5', '🔍', '桥梁支座检测')
const ssBridge2 = mkPhoto('#0d2844', '#66bb6a', '🔍', '桥梁结构检测')
const ssBridge3 = mkPhoto('#0d2844', '#ffa726', '🔍', '桥梁荷载检测')
const ssTunnel1 = mkPhoto('#0d2d2d', '#26c6da', '🔍', '衬砌裂缝检测')
const ssTunnel2 = mkPhoto('#0d2d2d', '#ffca28', '🔍', '渗漏水检测')
const ssTunnel3 = mkPhoto('#0d2d2d', '#66bb6a', '🔍', '通风系统检测')

// 设备监控照片
const sbRoad1 = mkPhoto('#1a3050', '#ff9800', '📡', '路基沉降监测')
const sbRoad2 = mkPhoto('#1a3050', '#ffc107', '📡', '路面裂缝监测')
const sbRoad3 = mkPhoto('#1a3050', '#f44336', '📡', '边坡位移监测')
const sbBridge1 = mkPhoto('#0d2844', '#42a5f5', '📡', '结构应变监测')
const sbBridge2 = mkPhoto('#0d2844', '#66bb6a', '📡', '结构振动监测')
const sbBridge3 = mkPhoto('#0d2844', '#ffa726', '📡', '桥梁挠度监测')
const sbTunnel1 = mkPhoto('#0d2d2d', '#26c6da', '📡', 'CO浓度监测')
const sbTunnel2 = mkPhoto('#0d2d2d', '#ffca28', '📡', '温湿度监测')
const sbTunnel3 = mkPhoto('#0d2d2d', '#66bb6a', '📡', '通风风速监测')

// 安全评估照片
const aqRoad1 = mkPhoto('#1a2040', '#ab47bc', '📝', '路面安全评估')
const aqRoad2 = mkPhoto('#1a2040', '#7e57c2', '📝', '路基安全评估')
const aqRoad3 = mkPhoto('#1a2040', '#ef5350', '📝', '交通安全评估')
const aqBridge1 = mkPhoto('#0d2040', '#ab47bc', '📝', '结构安全评估')
const aqBridge2 = mkPhoto('#0d2040', '#7e57c2', '📝', '耐久性评估')
const aqBridge3 = mkPhoto('#0d2040', '#ef5350', '📝', '抗震安全评估')
const aqTunnel1 = mkPhoto('#0d2030', '#ab47bc', '📝', '结构安全评估')
const aqTunnel2 = mkPhoto('#0d2030', '#7e57c2', '📝', '通风安全评估')
const aqTunnel3 = mkPhoto('#0d2030', '#ef5350', '📝', '电气安全评估')

// 病害处理隐患列表数据
const roadHazardList = [
  { roadName: '鲲鹏路', checkItem: '路面裂缝检查', time: '2023-11-28 16:14:10', content: '路面出现多处纵向裂缝，长度约50m，宽度2-5mm', level: '一般隐患', rectifyStatus: '未整改', photo: hpRoad1, region: '杭州市上城区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '浙江安盛检测有限公司', checkMethod: '查阅检测报告、查阅文件、分析监测数据、现场检查' },
  { roadName: '姚江路', checkItem: '路面裂缝检查', time: '2023-11-28 16:11:50', content: '路面出现横向裂缝，长度约30m，宽度3-8mm', level: '较大隐患', rectifyStatus: '未整改', photo: hpRoad2, region: '杭州市拱墅区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '杭州市政工程检测中心', checkMethod: '查阅检测报告、现场检查' },
  { roadName: '东教路(绍兴路-石祥路)', checkItem: '路面龟裂检查', time: '2023-11-28 15:58:07', content: '路面出现网状龟裂，面积约20㎡，深度15mm', level: '重大隐患', rectifyStatus: '未整改', photo: hpRoad3, region: '杭州市拱墅区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '浙江中检工程技术有限公司', checkMethod: '查阅检测报告、分析监测数据、现场检查' }
]
const bridgeHazardList = [
  { roadName: '衍家桥', checkItem: '土建结构检查', time: '2023-11-28 14:29:15', content: '桥梁支座出现明显锈蚀，部分支座垫石开裂', level: '重大隐患', rectifyStatus: '未整改', photo: hpBridge1, region: '杭州市西湖区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '杭州道桥检测有限公司', checkMethod: '查阅检测报告、查阅文件、现场检查' },
  { roadName: '轻纺桥', checkItem: '桥面系检查', time: '2023-11-28 13:58:13', content: '人行道面层出现网裂，面积约5㎡', level: '一般隐患', rectifyStatus: '未整改', photo: hpBridge2, region: '杭州市滨江区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '浙江省建设工程质量检测站', checkMethod: '现场检查' },
  { roadName: '登云大桥', checkItem: '桥面系检查', time: '2023-11-28 13:56:41', content: '人行道面层出现网裂，面积约8㎡，栏杆局部破损', level: '较大隐患', rectifyStatus: '未整改', photo: hpBridge3, region: '杭州市余杭区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '浙江安盛检测有限公司', checkMethod: '查阅检测报告、现场检查' }
]
const tunnelHazardList = [
  { roadName: '五老峰隧道', checkItem: '土建结构检查', time: '2023-11-28 15:22:24', content: '隧道衬砌出现裂缝，宽度约3mm，长度约2m', level: '重大隐患', rectifyStatus: '未整改', photo: hpTunnel1, region: '杭州市西湖区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '杭州市政工程检测中心', checkMethod: '查阅检测报告、查阅文件、现场检查' },
  { roadName: '灵溪隧道', checkItem: '强电系统检查', time: '2023-11-28 15:07:07', content: '照明灯具损坏3盏，应急照明系统部分失效', level: '较大隐患', rectifyStatus: '未整改', photo: hpTunnel2, region: '杭州市上城区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '浙江中检工程技术有限公司', checkMethod: '分析监测数据、现场检查' },
  { roadName: '新天地街隧道', checkItem: '土建结构检查', time: '2023-11-28 13:57:22', content: '隧道衬砌局部渗水，面积约1.5㎡', level: '一般隐患', rectifyStatus: '未整改', photo: hpTunnel3, region: '杭州市拱墅区', rectifyTime: '-', rectifyPerson: '-', attachments: [], assessUnit: '杭州道桥检测有限公司', checkMethod: '查阅检测报告、现场检查' }
]

// 设施检测页签数据
const roadInspectFilter = ref<'未整改' | '已整改' | '全部'>('未整改')
const bridgeInspectFilter = ref<'未整改' | '已整改' | '全部'>('未整改')
const tunnelInspectFilter = ref<'未整改' | '已整改' | '全部'>('未整改')

const roadInspectRanking = [
  { city: '绍兴', rate: '95.00' }, { city: '金华', rate: '92.50' },
  { city: '衢州', rate: '90.00' }, { city: '舟山', rate: '88.00' },
  { city: '台州', rate: '87.50' }, { city: '丽水', rate: '86.00' },
  { city: '杭州', rate: '85.00' }, { city: '宁波', rate: '84.00' },
  { city: '温州', rate: '82.00' }, { city: '湖州', rate: '80.00' },
  { city: '嘉兴', rate: '78.00' }
]
const bridgeInspectRanking = [
  { city: '绍兴', rate: '93.00' }, { city: '金华', rate: '90.50' },
  { city: '衢州', rate: '88.00' }, { city: '舟山', rate: '86.00' },
  { city: '台州', rate: '85.50' }, { city: '丽水', rate: '84.00' },
  { city: '杭州', rate: '82.00' }, { city: '宁波', rate: '80.00' },
  { city: '温州', rate: '78.00' }, { city: '湖州', rate: '76.00' },
  { city: '嘉兴', rate: '74.00' }
]
const tunnelInspectRanking = [
  { city: '绍兴', rate: '96.00' }, { city: '金华', rate: '93.50' },
  { city: '衢州', rate: '91.00' }, { city: '舟山', rate: '89.00' },
  { city: '台州', rate: '88.50' }, { city: '丽水', rate: '87.00' },
  { city: '杭州', rate: '86.00' }, { city: '宁波', rate: '85.00' },
  { city: '温州', rate: '83.00' }, { city: '湖州', rate: '81.00' },
  { city: '嘉兴', rate: '79.00' }
]

const roadInspectList = [
  { roadName: '鲲鹏路', grade: 'D级', rectifyType: '维修整治', rectifyStatus: '未完成', checkItem: '路面平整度检测', checkName: '鲲鹏路常规检测', checkTime: '2023-11-20 10:30:00', checkType: '常规检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市上城区', photo: ssRoad1 },
  { roadName: '姚江路', grade: 'D级', rectifyType: '拆除或完全封控', rectifyStatus: '未完成', checkItem: '路面结构强度检测', checkName: '姚江路结构检测', checkTime: '2023-11-21 14:20:00', checkType: '结构检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市拱墅区', photo: ssRoad2 },
  { roadName: '东教路(绍兴路-石祥路)', grade: 'D级', rectifyType: '维修整治', rectifyStatus: '未完成', checkItem: '路基沉降检测', checkName: '东教路特殊检测', checkTime: '2023-11-22 09:15:00', checkType: '特殊检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市拱墅区', photo: ssRoad3 }
]
const bridgeInspectList = [
  { bridgeName: '衍家桥', grade: 'D级', rectifyType: '维修整治', rectifyStatus: '未完成', checkItem: '桥梁支座检测', checkName: '衍家桥常规检测', checkTime: '2023-11-18 11:00:00', checkType: '常规检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市西湖区', photo: ssBridge1 },
  { bridgeName: '轻纺桥', grade: 'E级', rectifyType: '拆除或完全封控', rectifyStatus: '未完成', checkItem: '桥梁结构检测', checkName: '轻纺桥结构检测', checkTime: '2023-11-19 15:30:00', checkType: '结构检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市滨江区', photo: ssBridge2 },
  { bridgeName: '登云大桥', grade: '不合格', rectifyType: '拆除或完全封控', rectifyStatus: '未完成', checkItem: '桥梁荷载检测', checkName: '登云大桥特殊检测', checkTime: '2023-11-20 08:45:00', checkType: '特殊检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市余杭区', photo: ssBridge3 }
]
const tunnelInspectList = [
  { tunnelName: '五老峰隧道', grade: 'D级', rectifyType: '维修整治', rectifyStatus: '未完成', checkItem: '衬砌裂缝检测', checkName: '五老峰隧道常规检测', checkTime: '2023-11-15 10:00:00', checkType: '常规检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市西湖区', photo: ssTunnel1 },
  { tunnelName: '灵溪隧道', grade: 'E级', rectifyType: '拆除或完全封控', rectifyStatus: '未完成', checkItem: '渗漏水检测', checkName: '灵溪隧道结构检测', checkTime: '2023-11-16 14:30:00', checkType: '结构检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市上城区', photo: ssTunnel2 },
  { tunnelName: '新天地街隧道', grade: 'D级', rectifyType: '维修整治', rectifyStatus: '未完成', checkItem: '通风系统检测', checkName: '新天地街隧道常规检测', checkTime: '2023-11-17 09:20:00', checkType: '常规检测', rectifyFinishDate: '-', rectifyGrade: '-', region: '杭州市拱墅区', photo: ssTunnel3 }
]

// 道路/桥梁/隧道列表详情弹窗
const showRoadListModal = ref(false)
const showBridgeListModal = ref(false)
const showTunnelListModal = ref(false)
const roadFilter = reactive({ region: '', name: '', level: '', grade: '', status: '', dataComplete: '', publishStatus: '', overdue: '' })
const bridgeFilter = reactive({ region: '', name: '', type: '', navigable: '', grade: '', status: '', dataComplete: '', publishStatus: '', overdue: '' })
const tunnelFilter = reactive({ region: '', name: '', type: '', roadClass: '', underground: '', grade: '', status: '', dataComplete: '', publishStatus: '', overdue: '' })

// 点击列表查看按钮：切换地图图层、定位并弹出设施详情
// 行选中：定位到地图并高亮
function handleRowSelect(record: any, type: 'road' | 'bridge' | 'tunnel') {
  selectedFacility.value = record
  // 切换到对应图层
  activeLayer.value = type
  
  // 等待地图 overlays 重新渲染后定位并弹出详情
  nextTick(() => {
    nextTick(() => {
      const AMap = (window as any).AMap
      if (!overviewMap || !AMap || !record.path) return
      // 根据归属地区确定缩放中心
      const regionKey = Object.keys(cityCoords).find(k => record.region?.includes(k.replace('市', '')))
      const center = regionKey ? cityCoords[regionKey] : [record.path[0][0], record.path[0][1]]
      overviewMap.setZoomAndCenter(14, new AMap.LngLat(center[0], center[1]))
      // 使用 record.info 构建弹窗内容（与地图设施点位数据一致）
      const gradeColor = (g: string) => ({ A: '#5b8ff9', B: '#5ad8a6', C: '#f6bd16', D: '#e86452', E: '#e86452' }[g] || '#fff')
      const info: Record<string, string> = record.info || {}
      let html = '<div class="map-info-popup">'
      for (const [k, v] of Object.entries(info)) {
        if (k.includes('等级')) {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value grade" style="color:${gradeColor(v)}">${v}</span></div>`
        } else {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value">${v}</span></div>`
        }
      }
      html += '</div>'
      if (!mapInfoWindow) {
        mapInfoWindow = new AMap.InfoWindow({ isCustom: true, autoMove: true, offset: new AMap.Pixel(0, -10) })
      }
      const mid = record.path[Math.floor(record.path.length / 2)]
      // 高亮对应的 polyline
      const matched = mapOverlays.find(o => o.extData?.fac?.name === record.name)
      if (matched) highlightPolyline(matched)
      mapInfoWindow.setContent(html)
      mapInfoWindow.open(overviewMap, new AMap.LngLat(mid[0], mid[1]))
    })
  })
}

function handleFacilityView(record: any, type: 'road' | 'bridge' | 'tunnel') {
  // 关闭列表弹窗
  if (type === 'road') showRoadListModal.value = false
  else if (type === 'bridge') showBridgeListModal.value = false
  else showTunnelListModal.value = false
  
  // 调用行选中逻辑（复用）
  handleRowSelect(record, type)
}

const roadListModalColumns = [
  { title: '归属地区', dataIndex: 'region', width: 120 },
  { title: '道路名称', dataIndex: 'name', width: 100 },
  { title: '道路等级', dataIndex: 'level', width: 100 },
  { title: '综合评价等级', dataIndex: 'grade', width: 100 },
  { title: '检测时间', dataIndex: 'checkTime', width: 110 },
  { title: '数据是否完善', dataIndex: 'dataComplete', width: 100 },
  { title: '发布状态', dataIndex: 'publishStatus', width: 90 },
  { title: '检测是否超期', dataIndex: 'overdue', width: 100 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]
const bridgeListModalColumns = [
  { title: '归属地区', dataIndex: 'region', width: 120 },
  { title: '桥梁名称', dataIndex: 'name', width: 100 },
  { title: '桥梁类型', dataIndex: 'type', width: 90 },
  { title: '是否涉航桥梁', dataIndex: 'navigable', width: 100 },
  { title: '综合评价等级', dataIndex: 'grade', width: 100 },
  { title: '检测时间', dataIndex: 'checkTime', width: 110 },
  { title: '数据是否完善', dataIndex: 'dataComplete', width: 100 },
  { title: '发布状态', dataIndex: 'publishStatus', width: 90 },
  { title: '检测是否超期', dataIndex: 'overdue', width: 100 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]
const tunnelListModalColumns = [
  { title: '归属地区', dataIndex: 'region', width: 120 },
  { title: '隧道名称', dataIndex: 'name', width: 120 },
  { title: '隧道类型', dataIndex: 'type', width: 110 },
  { title: '城市道路隧道分类', dataIndex: 'roadClass', width: 140 },
  { title: '是否地下隧道', dataIndex: 'underground', width: 110 },
  { title: '综合评价等级', dataIndex: 'grade', width: 100 },
  { title: '检测时间', dataIndex: 'checkTime', width: 110 },
  { title: '数据是否完善', dataIndex: 'dataComplete', width: 100 },
  { title: '发布状态', dataIndex: 'publishStatus', width: 90 },
  { title: '检测是否超期', dataIndex: 'overdue', width: 100 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

// 导出功能
const exportToCsv = (columns: { title: string; dataIndex?: string }[], data: any[], filename: string) => {
  const header = columns.map(c => c.title).join(',')
  const rows = data.map(row => columns.map(c => {
    if (!c.dataIndex) return ''
    const val = row[c.dataIndex] ?? ''
    return typeof val === 'string' && val.includes(',') ? `"${val}"` : val
  }).join(','))
  const csv = '\uFEFF' + [header, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
const exportRoadList = () => exportToCsv(roadListModalColumns as any, filteredRoadList.value, '道路列表')
const exportBridgeList = () => exportToCsv(bridgeListModalColumns as any, filteredBridgeList.value, '桥梁列表')
const exportTunnelList = () => exportToCsv(tunnelListModalColumns as any, filteredTunnelList.value, '隧道列表')

// 设备监控页签数据
const roadMonitorFilter = ref<'未完成' | '已完成' | '全部'>('未完成')
const bridgeMonitorFilter = ref<'未完成' | '已完成' | '全部'>('未完成')
const tunnelMonitorFilter = ref<'未完成' | '已完成' | '全部'>('未完成')

const roadMonitorRanking = [
  { city: '绍兴', rate: '95.00' }, { city: '金华', rate: '90.50' },
  { city: '衢州', rate: '88.00' }, { city: '舟山', rate: '85.00' },
  { city: '台州', rate: '84.50' }, { city: '丽水', rate: '82.00' },
  { city: '杭州', rate: '80.00' }, { city: '宁波', rate: '78.00' },
  { city: '温州', rate: '76.00' }, { city: '湖州', rate: '74.00' },
  { city: '嘉兴', rate: '72.00' }
]
const bridgeMonitorRanking = [
  { city: '绍兴', rate: '93.00' }, { city: '金华', rate: '88.50' },
  { city: '衢州', rate: '86.00' }, { city: '舟山', rate: '84.00' },
  { city: '台州', rate: '83.50' }, { city: '丽水', rate: '81.00' },
  { city: '杭州', rate: '79.00' }, { city: '宁波', rate: '77.00' },
  { city: '温州', rate: '75.00' }, { city: '湖州', rate: '73.00' },
  { city: '嘉兴', rate: '71.00' }
]
const tunnelMonitorRanking = [
  { city: '绍兴', rate: '92.00' }, { city: '金华', rate: '87.50' },
  { city: '衢州', rate: '85.00' }, { city: '舟山', rate: '83.00' },
  { city: '台州', rate: '82.50' }, { city: '丽水', rate: '80.00' },
  { city: '杭州', rate: '78.00' }, { city: '宁波', rate: '76.00' },
  { city: '温州', rate: '74.00' }, { city: '湖州', rate: '72.00' },
  { city: '嘉兴', rate: '70.00' }
]

const roadMonitorList = [
  { facilityName: '鲲鹏路', deviceName: '沉降监测仪-001', pointName: 'KP-K001', monitorItem: '路基沉降', alertLevel: '一级预警', handleStatus: '未完成', photo: sbRoad1, region: '杭州市上城区', alertStartTime: '2023-11-25 08:30:00', alertEndTime: '-', alertValue: '15.2mm', handleFinishTime: '-', handlePerson: '-' },
  { facilityName: '姚江路', deviceName: '裂缝监测仪-002', pointName: 'YJ-L002', monitorItem: '路面裂缝', alertLevel: '二级预警', handleStatus: '未完成', photo: sbRoad2, region: '杭州市拱墅区', alertStartTime: '2023-11-26 10:15:00', alertEndTime: '-', alertValue: '8.5mm', handleFinishTime: '-', handlePerson: '-' },
  { facilityName: '东教路', deviceName: '位移监测仪-003', pointName: 'DJ-W003', monitorItem: '边坡位移', alertLevel: '三级预警', handleStatus: '未完成', photo: sbRoad3, region: '杭州市拱墅区', alertStartTime: '2023-11-27 14:20:00', alertEndTime: '-', alertValue: '12.8mm', handleFinishTime: '-', handlePerson: '-' }
]
const bridgeMonitorList = [
  { facilityName: '衍家桥', deviceName: '应变监测仪-001', pointName: 'YJ-S001', monitorItem: '结构应变', alertLevel: '一级预警', handleStatus: '未完成', photo: sbBridge1, region: '杭州市西湖区', alertStartTime: '2023-11-24 09:00:00', alertEndTime: '-', alertValue: '1200με', handleFinishTime: '-', handlePerson: '-' },
  { facilityName: '轻纺桥', deviceName: '振动监测仪-002', pointName: 'QF-V002', monitorItem: '结构振动', alertLevel: '二级预警', handleStatus: '未完成', photo: sbBridge2, region: '杭州市滨江区', alertStartTime: '2023-11-25 11:30:00', alertEndTime: '-', alertValue: '0.85m/s²', handleFinishTime: '-', handlePerson: '-' },
  { facilityName: '登云大桥', deviceName: '挠度监测仪-003', pointName: 'DY-D003', monitorItem: '桥梁挠度', alertLevel: '三级预警', handleStatus: '未完成', photo: sbBridge3, region: '杭州市余杭区', alertStartTime: '2023-11-26 16:45:00', alertEndTime: '-', alertValue: 'L/850', handleFinishTime: '-', handlePerson: '-' }
]
const tunnelMonitorList = [
  { facilityName: '五老峰隧道', deviceName: '气体监测仪-001', pointName: 'WLF-G001', monitorItem: 'CO浓度', alertLevel: '一级预警', handleStatus: '未完成', photo: sbTunnel1, region: '杭州市西湖区', alertStartTime: '2023-11-23 07:20:00', alertEndTime: '-', alertValue: '85ppm', handleFinishTime: '-', handlePerson: '-' },
  { facilityName: '灵溪隧道', deviceName: '温湿度监测仪-002', pointName: 'LX-T002', monitorItem: '环境温湿度', alertLevel: '二级预警', handleStatus: '未完成', photo: sbTunnel2, region: '杭州市上城区', alertStartTime: '2023-11-24 13:10:00', alertEndTime: '-', alertValue: '92%RH', handleFinishTime: '-', handlePerson: '-' },
  { facilityName: '新天地街隧道', deviceName: '风速监测仪-003', pointName: 'XTD-W003', monitorItem: '通风风速', alertLevel: '三级预警', handleStatus: '未完成', photo: sbTunnel3, region: '杭州市拱墅区', alertStartTime: '2023-11-25 15:30:00', alertEndTime: '-', alertValue: '2.8m/s', handleFinishTime: '-', handlePerson: '-' }
]

// 安全评估页签数据
const roadAssessFilter = ref<'未整改' | '已整改' | '全部'>('未整改')
const bridgeAssessFilter = ref<'未整改' | '已整改' | '全部'>('未整改')
const tunnelAssessFilter = ref<'未整改' | '已整改' | '全部'>('未整改')

const roadAssessRanking = [
  { city: '绍兴', rate: '95.00' }, { city: '金华', rate: '92.50' },
  { city: '衢州', rate: '90.00' }, { city: '舟山', rate: '88.00' },
  { city: '台州', rate: '87.50' }, { city: '丽水', rate: '86.00' },
  { city: '杭州', rate: '85.00' }, { city: '宁波', rate: '84.00' },
  { city: '温州', rate: '82.00' }, { city: '湖州', rate: '80.00' },
  { city: '嘉兴', rate: '78.00' }
]
const bridgeAssessRanking = [
  { city: '绍兴', rate: '93.00' }, { city: '金华', rate: '90.50' },
  { city: '衢州', rate: '88.00' }, { city: '舟山', rate: '86.00' },
  { city: '台州', rate: '85.50' }, { city: '丽水', rate: '83.00' },
  { city: '杭州', rate: '82.00' }, { city: '宁波', rate: '80.00' },
  { city: '温州', rate: '78.00' }, { city: '湖州', rate: '76.00' },
  { city: '嘉兴', rate: '74.00' }
]
const tunnelAssessRanking = [
  { city: '绍兴', rate: '92.00' }, { city: '金华', rate: '89.50' },
  { city: '衢州', rate: '87.00' }, { city: '舟山', rate: '85.00' },
  { city: '台州', rate: '84.50' }, { city: '丽水', rate: '82.00' },
  { city: '杭州', rate: '81.00' }, { city: '宁波', rate: '79.00' },
  { city: '温州', rate: '77.00' }, { city: '湖州', rate: '75.00' },
  { city: '嘉兴', rate: '73.00' }
]

const roadAssessList = [
  { roadName: '鲲鹏路', checkItem: '路面安全评估', time: '2023-11-20 10:30:00', content: '路面平整度、抗滑性能综合评估', level: '优良', status: '已完成', photo: aqRoad1, region: '杭州市上城区', assessUnit: '浙江安盛检测有限公司', checkMethod: '查阅检测报告、查阅文件、分析监测数据、现场检查' },
  { roadName: '姚江路', checkItem: '路基安全评估', time: '2023-11-21 14:20:00', content: '路基沉降、边坡稳定性评估', level: '合格', status: '已完成', photo: aqRoad2, region: '杭州市拱墅区', assessUnit: '杭州市政工程检测中心', checkMethod: '查阅检测报告、现场检查' },
  { roadName: '东教路(绍兴路-石祥路)', checkItem: '交通安全评估', time: '2023-11-22 09:15:00', content: '交通标志标线、安全设施评估', level: '不合格', status: '未完成', photo: aqRoad3, region: '杭州市拱墅区', assessUnit: '浙江中检工程技术有限公司', checkMethod: '查阅检测报告、分析监测数据、现场检查' }
]
const bridgeAssessList = [
  { bridgeName: '衍家桥', checkItem: '结构安全评估', time: '2023-11-18 11:00:00', content: '桥梁主体结构承载能力评估', level: '优良', status: '已完成', photo: aqBridge1, region: '杭州市西湖区', assessUnit: '杭州道桥检测有限公司', checkMethod: '查阅检测报告、查阅文件、现场检查' },
  { bridgeName: '轻纺桥', checkItem: '耐久性评估', time: '2023-11-19 15:30:00', content: '混凝土碳化、钢筋锈蚀评估', level: '合格', status: '已完成', photo: aqBridge2, region: '杭州市滨江区', assessUnit: '浙江省建设工程质量检测站', checkMethod: '现场检查' },
  { bridgeName: '登云大桥', checkItem: '抗震安全评估', time: '2023-11-20 08:45:00', content: '抗震性能、支座状态评估', level: '不合格', status: '未完成', photo: aqBridge3, region: '杭州市余杭区', assessUnit: '浙江安盛检测有限公司', checkMethod: '查阅检测报告、现场检查' }
]
const tunnelAssessList = [
  { tunnelName: '五老峰隧道', checkItem: '结构安全评估', time: '2023-11-15 10:00:00', content: '衬砌结构、防水系统综合评估', level: '优良', status: '已完成', photo: aqTunnel1, region: '杭州市西湖区', assessUnit: '杭州市政工程检测中心', checkMethod: '查阅检测报告、查阅文件、现场检查' },
  { tunnelName: '灵溪隧道', checkItem: '通风安全评估', time: '2023-11-16 14:30:00', content: '通风系统、消防系统评估', level: '合格', status: '已完成', photo: aqTunnel2, region: '杭州市上城区', assessUnit: '浙江中检工程技术有限公司', checkMethod: '分析监测数据、现场检查' },
  { tunnelName: '新天地街隧道', checkItem: '电气安全评估', time: '2023-11-17 09:20:00', content: '供配电系统、应急电源评估', level: '不合格', status: '未完成', photo: aqTunnel3, region: '杭州市拱墅区', assessUnit: '杭州道桥检测有限公司', checkMethod: '查阅检测报告、现场检查' }
]

// 隐患详情弹窗
const showHazardDetail = ref(false)
const currentHazardDetail = ref<any>(null)
const hazardDetailType = ref<'road' | 'bridge' | 'tunnel'>('road')
const hazardDetailSource = ref<'hazard' | 'assess'>('hazard')

const openHazardDetail = (item: any, type: 'road' | 'bridge' | 'tunnel', source: 'hazard' | 'assess' = 'hazard') => {
  currentHazardDetail.value = item
  hazardDetailType.value = type
  hazardDetailSource.value = source
  showHazardDetail.value = true
}

// 设施检测详情弹窗
const showInspectDetail = ref(false)
const currentInspectDetail = ref<any>(null)
const inspectDetailType = ref<'road' | 'bridge' | 'tunnel'>('road')

const openInspectDetail = (item: any, type: 'road' | 'bridge' | 'tunnel') => {
  currentInspectDetail.value = item
  inspectDetailType.value = type
  showInspectDetail.value = true
}

// 设备监控详情弹窗
const showDeviceMonitorDetail = ref(false)
const currentDeviceMonitorDetail = ref<any>(null)
const deviceMonitorDetailType = ref<'road' | 'bridge' | 'tunnel'>('road')

const openDeviceMonitorDetail = (item: any, type: 'road' | 'bridge' | 'tunnel') => {
  currentDeviceMonitorDetail.value = item
  deviceMonitorDetailType.value = type
  showDeviceMonitorDetail.value = true
}

// 安全评估详情弹窗
const showAssessDetail = ref(false)
const currentAssessDetail = ref<any>(null)
const assessDetailType = ref<'road' | 'bridge' | 'tunnel'>('road')

const openAssessDetail = (item: any, type: 'road' | 'bridge' | 'tunnel') => {
  currentAssessDetail.value = item
  assessDetailType.value = type
  showAssessDetail.value = true
}

// 高德地图
const overviewMapRef = ref<HTMLElement | null>(null)
const monitorMapRef = ref<HTMLElement | null>(null)
const opsMapRef = ref<HTMLElement | null>(null)
const mapStyle = ref<'standard' | 'satellite'>('standard')
let overviewMap: any = null
let monitorMap: any = null
let opsMap: any = null
let opsMapOverlays: any[] = []
let opsMapInfoWindow: any = null
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
interface FacilityPoint {
  name: string; region?: string; level?: string; type?: string; navigable?: string;
  roadClass?: string; underground?: string; grade?: string; checkTime?: string;
  dataComplete?: string; publishStatus?: string; overdue?: string;
  path: [number, number][]; color: string; info: Record<string, string>
}
const roadFacilities: FacilityPoint[] = [
  { name: '鲲鹏路', region: '杭州市上城区', level: '主干路', grade: 'A', checkTime: '2025-06-15', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.160, 30.250], [120.165, 30.252], [120.170, 30.248], [120.175, 30.250]], color: '#f6bd16', info: { '归属地区': '杭州市上城区', '道路名称': '鲲鹏路', '道路等级': '主干路', '综合评价等级': 'A', '检测时间': '2025-06-15' } },
  { name: '姚江路', region: '杭州市拱墅区', level: '次干路', grade: 'B', checkTime: '2025-05-20', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.148, 30.310], [120.153, 30.312], [120.158, 30.308], [120.163, 30.310]], color: '#5b8ff9', info: { '归属地区': '杭州市拱墅区', '道路名称': '姚江路', '道路等级': '次干路', '综合评价等级': 'B', '检测时间': '2025-05-20' } },
  { name: '环城西路', region: '杭州市西湖区', level: '城市快速路', grade: 'A', checkTime: '2025-07-01', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.158, 30.270], [120.156, 30.275], [120.159, 30.280], [120.158, 30.285]], color: '#5ad8a6', info: { '归属地区': '杭州市西湖区', '道路名称': '环城西路', '道路等级': '城市快速路', '综合评价等级': 'A', '检测时间': '2025-07-01' } },
  { name: '复兴大道', region: '杭州市滨江区', level: '主干路', grade: 'B', checkTime: '2025-04-10', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.185, 30.218], [120.192, 30.221], [120.200, 30.216], [120.210, 30.218]], color: '#e86452', info: { '归属地区': '杭州市滨江区', '道路名称': '复兴大道', '道路等级': '主干路', '综合评价等级': 'B', '检测时间': '2025-04-10' } },
  { name: '中山西路', region: '宁波市海曙区', level: '主干路', grade: 'A', checkTime: '2025-06-28', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.540, 29.865], [121.545, 29.867], [121.550, 29.863], [121.555, 29.865]], color: '#945fb9', info: { '归属地区': '宁波市海曙区', '道路名称': '中山西路', '道路等级': '主干路', '综合评价等级': 'A', '检测时间': '2025-06-28' } },
  { name: '人民路', region: '温州市鹿城区', level: '次干路', grade: 'C', checkTime: '2025-03-15', dataComplete: '是', publishStatus: '已发布', overdue: '是', path: [[120.690, 28.005], [120.695, 28.007], [120.700, 28.003], [120.705, 28.005]], color: '#6dc8ec', info: { '归属地区': '温州市鹿城区', '道路名称': '人民路', '道路等级': '次干路', '综合评价等级': 'C', '检测时间': '2025-03-15' } },
  { name: '解放路', region: '绍兴市越城区', level: '主干路', grade: 'B', checkTime: '2025-05-08', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.570, 30.005], [120.575, 30.007], [120.580, 30.003], [120.585, 30.005]], color: '#f6bd16', info: { '归属地区': '绍兴市越城区', '道路名称': '解放路', '道路等级': '主干路', '综合评价等级': 'B', '检测时间': '2025-05-08' } },
  { name: '红旗路', region: '湖州市吴兴区', level: '支路', grade: 'A', checkTime: '2025-06-20', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.075, 30.865], [120.080, 30.867], [120.085, 30.863], [120.090, 30.865]], color: '#5b8ff9', info: { '归属地区': '湖州市吴兴区', '道路名称': '红旗路', '道路等级': '支路', '综合评价等级': 'A', '检测时间': '2025-06-20' } },
  { name: '中环南路', region: '嘉兴市南湖区', level: '主干路', grade: 'B', checkTime: '2025-04-25', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.750, 30.745], [120.755, 30.747], [120.760, 30.743], [120.765, 30.745]], color: '#5ad8a6', info: { '归属地区': '嘉兴市南湖区', '道路名称': '中环南路', '道路等级': '主干路', '综合评价等级': 'B', '检测时间': '2025-04-25' } },
  { name: '宾虹路', region: '金华市婺城区', level: '次干路', grade: 'C', checkTime: '2025-07-05', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[119.640, 29.085], [119.645, 29.087], [119.650, 29.083], [119.655, 29.085]], color: '#e86452', info: { '归属地区': '金华市婺城区', '道路名称': '宾虹路', '道路等级': '次干路', '综合评价等级': 'C', '检测时间': '2025-07-05' } },
  { name: '衢化路', region: '衢州市柯城区', level: '支路', grade: 'B', checkTime: '2025-06-12', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[118.860, 28.945], [118.865, 28.947], [118.870, 28.943], [118.875, 28.945]], color: '#945fb9', info: { '归属地区': '衢州市柯城区', '道路名称': '衢化路', '道路等级': '支路', '综合评价等级': 'B', '检测时间': '2025-06-12' } },
  { name: '丽阳路', region: '丽水市莲都区', level: '主干路', grade: 'A', checkTime: '2025-05-18', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[119.910, 28.475], [119.915, 28.477], [119.920, 28.473], [119.925, 28.475]], color: '#6dc8ec', info: { '归属地区': '丽水市莲都区', '道路名称': '丽阳路', '道路等级': '主干路', '综合评价等级': 'A', '检测时间': '2025-05-18' } },
  { name: '望梅路', region: '杭州市临平区', level: '次干路', grade: 'B', checkTime: '2025-04-22', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.290, 30.425], [120.295, 30.427], [120.300, 30.423], [120.305, 30.425]], color: '#f6bd16', info: { '归属地区': '杭州市临平区', '道路名称': '望梅路', '道路等级': '次干路', '综合评价等级': 'B', '检测时间': '2025-04-22' } },
  { name: '江北大道', region: '宁波市江北区', level: '城市快速路', grade: 'A', checkTime: '2025-03-28', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.540, 29.895], [121.545, 29.897], [121.550, 29.893], [121.555, 29.895]], color: '#5b8ff9', info: { '归属地区': '宁波市江北区', '道路名称': '江北大道', '道路等级': '城市快速路', '综合评价等级': 'A', '检测时间': '2025-03-28' } },
  { name: '永强路', region: '温州市龙湾区', level: '主干路', grade: 'C', checkTime: '2025-06-05', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.800, 27.945], [120.805, 27.947], [120.810, 27.943], [120.815, 27.945]], color: '#5ad8a6', info: { '归属地区': '温州市龙湾区', '道路名称': '永强路', '道路等级': '主干路', '综合评价等级': 'C', '检测时间': '2025-06-05' } },
  { name: '百官街道', region: '绍兴市上虞区', level: '次干路', grade: 'B', checkTime: '2025-07-10', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.860, 30.045], [120.865, 30.047], [120.870, 30.043], [120.875, 30.045]], color: '#e86452', info: { '归属地区': '绍兴市上虞区', '道路名称': '百官街道', '道路等级': '次干路', '综合评价等级': 'B', '检测时间': '2025-07-10' } },
  { name: '市心中路', region: '杭州市萧山区', level: '主干路', grade: 'A', checkTime: '2025-05-30', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.260, 30.175], [120.265, 30.177], [120.270, 30.173], [120.275, 30.175]], color: '#945fb9', info: { '归属地区': '杭州市萧山区', '道路名称': '市心中路', '道路等级': '主干路', '综合评价等级': 'A', '检测时间': '2025-05-30' } },
  { name: '武康路', region: '湖州市德清县', level: '支路', grade: 'B', checkTime: '2025-04-15', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.180, 30.545], [120.185, 30.547], [120.190, 30.543], [120.195, 30.545]], color: '#6dc8ec', info: { '归属地区': '湖州市德清县', '道路名称': '武康路', '道路等级': '支路', '综合评价等级': 'B', '检测时间': '2025-04-15' } },
]
const bridgeFacilities: FacilityPoint[] = [
  { name: '武林桥', region: '杭州市西湖区', type: '拱桥', navigable: '否', grade: 'B', checkTime: '2025-06-15', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.160, 30.265], [120.165, 30.267], [120.170, 30.263], [120.175, 30.265]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '桥梁名称': '武林桥', '桥梁类型': '拱桥', '综合评价等级': 'B', '检测时间': '2025-06-15' } },
  { name: '复兴大桥', region: '杭州市滨江区', type: '斜拉桥', navigable: '是', grade: 'A', checkTime: '2025-05-20', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.175, 30.215], [120.180, 30.218], [120.185, 30.213], [120.190, 30.215]], color: '#5b8ff9', info: { '归属地区': '杭州市滨江区', '桥梁名称': '复兴大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'A', '检测时间': '2025-05-20' } },
  { name: '备塘河桥', region: '杭州市上城区', type: '梁桥', navigable: '否', grade: 'C', checkTime: '2025-04-10', dataComplete: '是', publishStatus: '草稿', overdue: '是', path: [[120.110, 30.295], [120.115, 30.297], [120.120, 30.293], [120.125, 30.295]], color: '#5ad8a6', info: { '归属地区': '杭州市上城区', '桥梁名称': '备塘河桥', '桥梁类型': '梁桥', '综合评价等级': 'C', '检测时间': '2025-04-10' } },
  { name: '半山桥', region: '杭州市拱墅区', type: '梁桥', navigable: '否', grade: 'A', checkTime: '2025-07-01', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.135, 30.325], [120.140, 30.327], [120.145, 30.323], [120.150, 30.325]], color: '#f6bd16', info: { '归属地区': '杭州市拱墅区', '桥梁名称': '半山桥', '桥梁类型': '梁桥', '综合评价等级': 'A', '检测时间': '2025-07-01' } },
  { name: '明州大桥', region: '宁波市鄞州区', type: '斜拉桥', navigable: '是', grade: 'A', checkTime: '2025-06-28', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.560, 29.835], [121.565, 29.837], [121.570, 29.833], [121.575, 29.835]], color: '#945fb9', info: { '归属地区': '宁波市鄞州区', '桥梁名称': '明州大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'A', '检测时间': '2025-06-28' } },
  { name: '温州大桥', region: '温州市瓯海区', type: '悬索桥', navigable: '是', grade: 'B', checkTime: '2025-03-15', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.660, 27.985], [120.665, 27.987], [120.670, 27.983], [120.675, 27.985]], color: '#6dc8ec', info: { '归属地区': '温州市瓯海区', '桥梁名称': '温州大桥', '桥梁类型': '悬索桥', '综合评价等级': 'B', '检测时间': '2025-03-15' } },
  { name: '柯桥大桥', region: '绍兴市柯桥区', type: '拱桥', navigable: '是', grade: 'B', checkTime: '2025-05-08', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.480, 30.075], [120.485, 30.077], [120.490, 30.073], [120.495, 30.075]], color: '#f6bd16', info: { '归属地区': '绍兴市柯桥区', '桥梁名称': '柯桥大桥', '桥梁类型': '拱桥', '综合评价等级': 'B', '检测时间': '2025-05-08' } },
  { name: '南浔大桥', region: '湖州市南浔区', type: '梁桥', navigable: '否', grade: 'C', checkTime: '2025-06-20', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.440, 30.355], [120.445, 30.357], [120.450, 30.353], [120.455, 30.355]], color: '#5b8ff9', info: { '归属地区': '湖州市南浔区', '桥梁名称': '南浔大桥', '桥梁类型': '梁桥', '综合评价等级': 'C', '检测时间': '2025-06-20' } },
  { name: '秀洲大桥', region: '嘉兴市秀洲区', type: '梁桥', navigable: '否', grade: 'B', checkTime: '2025-04-25', dataComplete: '是', publishStatus: '已发布', overdue: '是', path: [[120.680, 30.775], [120.685, 30.777], [120.690, 30.773], [120.695, 30.775]], color: '#5ad8a6', info: { '归属地区': '嘉兴市秀洲区', '桥梁名称': '秀洲大桥', '桥梁类型': '梁桥', '综合评价等级': 'B', '检测时间': '2025-04-25' } },
  { name: '金东大桥', region: '金华市金东区', type: '拱桥', navigable: '否', grade: 'A', checkTime: '2025-07-05', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[119.680, 29.085], [119.685, 29.087], [119.690, 29.083], [119.695, 29.085]], color: '#e86452', info: { '归属地区': '金华市金东区', '桥梁名称': '金东大桥', '桥梁类型': '拱桥', '综合评价等级': 'A', '检测时间': '2025-07-05' } },
  { name: '椒江大桥', region: '台州市椒江区', type: '斜拉桥', navigable: '是', grade: 'B', checkTime: '2025-06-12', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.430, 28.685], [121.435, 28.687], [121.440, 28.683], [121.445, 28.685]], color: '#945fb9', info: { '归属地区': '台州市椒江区', '桥梁名称': '椒江大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'B', '检测时间': '2025-06-12' } },
  { name: '紫金大桥', region: '丽水市莲都区', type: '拱桥', navigable: '否', grade: 'A', checkTime: '2025-05-18', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[119.930, 28.465], [119.935, 28.467], [119.940, 28.463], [119.945, 28.465]], color: '#6dc8ec', info: { '归属地区': '丽水市莲都区', '桥梁名称': '紫金大桥', '桥梁类型': '拱桥', '综合评价等级': 'A', '检测时间': '2025-05-18' } },
  { name: '临平大桥', region: '杭州市临平区', type: '梁桥', navigable: '否', grade: 'B', checkTime: '2025-04-22', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.310, 30.415], [120.315, 30.417], [120.320, 30.413], [120.325, 30.415]], color: '#f6bd16', info: { '归属地区': '杭州市临平区', '桥梁名称': '临平大桥', '桥梁类型': '梁桥', '综合评价等级': 'B', '检测时间': '2025-04-22' } },
  { name: '江北大桥', region: '宁波市江北区', type: '斜拉桥', navigable: '是', grade: 'A', checkTime: '2025-03-28', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.530, 29.895], [121.535, 29.897], [121.540, 29.893], [121.545, 29.895]], color: '#5b8ff9', info: { '归属地区': '宁波市江北区', '桥梁名称': '江北大桥', '桥梁类型': '斜拉桥', '综合评价等级': 'A', '检测时间': '2025-03-28' } },
  { name: '龙湾大桥', region: '温州市龙湾区', type: '梁桥', navigable: '是', grade: 'C', checkTime: '2025-06-05', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.820, 27.935], [120.825, 27.937], [120.830, 27.933], [120.835, 27.935]], color: '#5ad8a6', info: { '归属地区': '温州市龙湾区', '桥梁名称': '龙湾大桥', '桥梁类型': '梁桥', '综合评价等级': 'C', '检测时间': '2025-06-05' } },
  { name: '上虞大桥', region: '绍兴市上虞区', type: '拱桥', navigable: '否', grade: 'B', checkTime: '2025-07-10', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.870, 30.025], [120.875, 30.027], [120.880, 30.023], [120.885, 30.025]], color: '#e86452', info: { '归属地区': '绍兴市上虞区', '桥梁名称': '上虞大桥', '桥梁类型': '拱桥', '综合评价等级': 'B', '检测时间': '2025-07-10' } },
  { name: '萧山大桥', region: '杭州市萧山区', type: '梁桥', navigable: '是', grade: 'A', checkTime: '2025-05-30', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.270, 30.165], [120.275, 30.167], [120.280, 30.163], [120.285, 30.165]], color: '#945fb9', info: { '归属地区': '杭州市萧山区', '桥梁名称': '萧山大桥', '桥梁类型': '梁桥', '综合评价等级': 'A', '检测时间': '2025-05-30' } },
  { name: '德清大桥', region: '湖州市德清县', type: '拱桥', navigable: '否', grade: 'B', checkTime: '2025-04-15', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.190, 30.535], [120.195, 30.537], [120.200, 30.533], [120.205, 30.535]], color: '#6dc8ec', info: { '归属地区': '湖州市德清县', '桥梁名称': '德清大桥', '桥梁类型': '拱桥', '综合评价等级': 'B', '检测时间': '2025-04-15' } },
]
const tunnelFacilities: FacilityPoint[] = [
  { name: '紫金港北路下穿道', region: '杭州市西湖区', type: '人行地道', roadClass: '-', underground: '否', grade: 'B', checkTime: '2025-06-15', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.088, 30.310], [120.093, 30.312], [120.098, 30.308], [120.103, 30.310]], color: '#e86452', info: { '归属地区': '杭州市西湖区', '隧道名称': '紫金港北路下穿道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'B', '检测时间': '2025-06-15' } },
  { name: '苏嘉路下穿道', region: '杭州市上城区', type: '城市道路隧道', roadClass: '特长隧道(L>3000m)', underground: '否', grade: 'E', checkTime: '2025-05-20', dataComplete: '是', publishStatus: '已发布', overdue: '是', path: [[120.168, 30.248], [120.173, 30.250], [120.178, 30.246], [120.183, 30.248]], color: '#5b8ff9', info: { '归属地区': '杭州市上城区', '隧道名称': '苏嘉路下穿道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'E', '检测时间': '2025-05-20' } },
  { name: '复兴路隧道', region: '杭州市滨江区', type: '人行地道', roadClass: '-', underground: '否', grade: 'A', checkTime: '2025-04-10', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.172, 30.225], [120.177, 30.227], [120.182, 30.223], [120.187, 30.225]], color: '#5ad8a6', info: { '归属地区': '杭州市滨江区', '隧道名称': '复兴路隧道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'A', '检测时间': '2025-04-10' } },
  { name: '环城北路隧道', region: '杭州市下城区', type: '城市道路隧道', roadClass: '长隧道(1000m<L≤3000m)', underground: '是', grade: 'B', checkTime: '2025-07-01', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.155, 30.278], [120.160, 30.280], [120.165, 30.276], [120.170, 30.278]], color: '#f6bd16', info: { '归属地区': '杭州市下城区', '隧道名称': '环城北路隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '长隧道(1000m<L≤3000m)', '综合评价等级': 'B', '检测时间': '2025-07-01' } },
  { name: '半山隧道', region: '杭州市拱墅区', type: '人行地道', roadClass: '-', underground: '否', grade: 'C', checkTime: '2025-06-28', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.138, 30.328], [120.143, 30.330], [120.148, 30.326], [120.153, 30.328]], color: '#945fb9', info: { '归属地区': '杭州市拱墅区', '隧道名称': '半山隧道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'C', '检测时间': '2025-06-28' } },
  { name: '天一隧道', region: '宁波市海曙区', type: '城市道路隧道', roadClass: '中隧道(500m<L≤1000m)', underground: '是', grade: 'A', checkTime: '2025-03-15', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.548, 29.868], [121.553, 29.870], [121.558, 29.866], [121.563, 29.868]], color: '#6dc8ec', info: { '归属地区': '宁波市海曙区', '隧道名称': '天一隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '中隧道(500m<L≤1000m)', '综合评价等级': 'A', '检测时间': '2025-03-15' } },
  { name: '五马隧道', region: '温州市鹿城区', type: '城市道路隧道', roadClass: '特长隧道(L>3000m)', underground: '是', grade: 'B', checkTime: '2025-05-08', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.688, 28.008], [120.693, 28.010], [120.698, 28.006], [120.703, 28.008]], color: '#f6bd16', info: { '归属地区': '温州市鹿城区', '隧道名称': '五马隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'B', '检测时间': '2025-05-08' } },
  { name: '鲁迅路隧道', region: '绍兴市越城区', type: '城市道路隧道', roadClass: '短隧道(L≤500m)', underground: '是', grade: 'B', checkTime: '2025-06-20', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.578, 30.008], [120.583, 30.010], [120.588, 30.006], [120.593, 30.008]], color: '#5b8ff9', info: { '归属地区': '绍兴市越城区', '隧道名称': '鲁迅路隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '短隧道(L≤500m)', '综合评价等级': 'B', '检测时间': '2025-06-20' } },
  { name: '太湖隧道', region: '湖州市吴兴区', type: '城市道路隧道', roadClass: '特长隧道(L>3000m)', underground: '是', grade: 'A', checkTime: '2025-04-25', dataComplete: '是', publishStatus: '已发布', overdue: '是', path: [[120.078, 30.868], [120.083, 30.870], [120.088, 30.866], [120.093, 30.868]], color: '#5ad8a6', info: { '归属地区': '湖州市吴兴区', '隧道名称': '太湖隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'A', '检测时间': '2025-04-25' } },
  { name: '南湖隧道', region: '嘉兴市南湖区', type: '人行地道', roadClass: '-', underground: '否', grade: 'C', checkTime: '2025-07-05', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.758, 30.748], [120.763, 30.750], [120.768, 30.746], [120.773, 30.748]], color: '#e86452', info: { '归属地区': '嘉兴市南湖区', '隧道名称': '南湖隧道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'C', '检测时间': '2025-07-05' } },
  { name: '双龙隧道', region: '金华市婺城区', type: '城市道路隧道', roadClass: '中隧道(500m<L≤1000m)', underground: '是', grade: 'B', checkTime: '2025-06-12', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[119.648, 29.088], [119.653, 29.090], [119.658, 29.086], [119.663, 29.088]], color: '#945fb9', info: { '归属地区': '金华市婺城区', '隧道名称': '双龙隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '中隧道(500m<L≤1000m)', '综合评价等级': 'B', '检测时间': '2025-06-12' } },
  { name: '紫金隧道', region: '丽水市莲都区', type: '城市道路隧道', roadClass: '特长隧道(L>3000m)', underground: '是', grade: 'A', checkTime: '2025-05-18', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[119.918, 28.478], [119.923, 28.480], [119.928, 28.476], [119.933, 28.478]], color: '#6dc8ec', info: { '归属地区': '丽水市莲都区', '隧道名称': '紫金隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'A', '检测时间': '2025-05-18' } },
  { name: '临平下穿道', region: '杭州市临平区', type: '人行地道', roadClass: '-', underground: '否', grade: 'B', checkTime: '2025-04-22', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.298, 30.418], [120.303, 30.420], [120.308, 30.416], [120.313, 30.418]], color: '#f6bd16', info: { '归属地区': '杭州市临平区', '隧道名称': '临平下穿道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'B', '检测时间': '2025-04-22' } },
  { name: '江北隧道', region: '宁波市江北区', type: '城市道路隧道', roadClass: '特长隧道(L>3000m)', underground: '是', grade: 'A', checkTime: '2025-03-28', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[121.538, 29.888], [121.543, 29.890], [121.548, 29.886], [121.553, 29.888]], color: '#5b8ff9', info: { '归属地区': '宁波市江北区', '隧道名称': '江北隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'A', '检测时间': '2025-03-28' } },
  { name: '龙湾下穿道', region: '温州市龙湾区', type: '人行地道', roadClass: '-', underground: '否', grade: 'C', checkTime: '2025-06-05', dataComplete: '否', publishStatus: '已发布', overdue: '是', path: [[120.808, 27.938], [120.813, 27.940], [120.818, 27.936], [120.823, 27.938]], color: '#5ad8a6', info: { '归属地区': '温州市龙湾区', '隧道名称': '龙湾下穿道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'C', '检测时间': '2025-06-05' } },
  { name: '上虞隧道', region: '绍兴市上虞区', type: '城市道路隧道', roadClass: '短隧道(L≤500m)', underground: '是', grade: 'B', checkTime: '2025-07-10', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.868, 30.028], [120.873, 30.030], [120.878, 30.026], [120.883, 30.028]], color: '#e86452', info: { '归属地区': '绍兴市上虞区', '隧道名称': '上虞隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '短隧道(L≤500m)', '综合评价等级': 'B', '检测时间': '2025-07-10' } },
  { name: '萧山隧道', region: '杭州市萧山区', type: '城市道路隧道', roadClass: '特长隧道(L>3000m)', underground: '是', grade: 'A', checkTime: '2025-05-30', dataComplete: '是', publishStatus: '已发布', overdue: '否', path: [[120.268, 30.168], [120.273, 30.170], [120.278, 30.166], [120.283, 30.168]], color: '#945fb9', info: { '归属地区': '杭州市萧山区', '隧道名称': '萧山隧道', '隧道类型': '城市道路隧道', '城市道路隧道分类': '特长隧道(L>3000m)', '综合评价等级': 'A', '检测时间': '2025-05-30' } },
  { name: '德清下穿道', region: '湖州市德清县', type: '人行地道', roadClass: '-', underground: '否', grade: 'B', checkTime: '2025-04-15', dataComplete: '是', publishStatus: '草稿', overdue: '否', path: [[120.188, 30.538], [120.193, 30.540], [120.198, 30.536], [120.203, 30.538]], color: '#6dc8ec', info: { '归属地区': '湖州市德清县', '隧道名称': '德清下穿道', '隧道类型': '人行地道', '城市道路隧道分类': '-', '综合评价等级': 'B', '检测时间': '2025-04-15' } },
]

// 设施概览右侧列表数据（引用地图设施点位数据，单一数据源）
const overviewRoadList = roadFacilities
const overviewBridgeList = bridgeFacilities
const overviewTunnelList = tunnelFacilities

const filteredRoadList = computed(() => {
  return overviewRoadList.filter(r => {
    if (roadFilter.region && !r.region?.includes(roadFilter.region)) return false
    if (roadFilter.name && !r.name.includes(roadFilter.name)) return false
    if (roadFilter.level && r.level !== roadFilter.level) return false
    if (roadFilter.grade && r.grade !== roadFilter.grade) return false
    if (roadFilter.dataComplete && r.dataComplete !== roadFilter.dataComplete) return false
    if (roadFilter.publishStatus && r.publishStatus !== roadFilter.publishStatus) return false
    return true
  })
})
const filteredBridgeList = computed(() => {
  return overviewBridgeList.filter(b => {
    if (bridgeFilter.region && !b.region?.includes(bridgeFilter.region)) return false
    if (bridgeFilter.name && !b.name.includes(bridgeFilter.name)) return false
    if (bridgeFilter.type && b.type !== bridgeFilter.type) return false
    if (bridgeFilter.navigable && b.navigable !== bridgeFilter.navigable) return false
    if (bridgeFilter.grade && b.grade !== bridgeFilter.grade) return false
    if (bridgeFilter.dataComplete && b.dataComplete !== bridgeFilter.dataComplete) return false
    if (bridgeFilter.publishStatus && b.publishStatus !== bridgeFilter.publishStatus) return false
    return true
  })
})
const filteredTunnelList = computed(() => {
  return overviewTunnelList.filter(t => {
    if (tunnelFilter.region && !t.region?.includes(tunnelFilter.region)) return false
    if (tunnelFilter.name && !t.name.includes(tunnelFilter.name)) return false
    if (tunnelFilter.type && t.type !== tunnelFilter.type) return false
    if (tunnelFilter.roadClass && t.roadClass !== tunnelFilter.roadClass) return false
    if (tunnelFilter.underground && t.underground !== tunnelFilter.underground) return false
    if (tunnelFilter.grade && t.grade !== tunnelFilter.grade) return false
    if (tunnelFilter.dataComplete && t.dataComplete !== tunnelFilter.dataComplete) return false
    if (tunnelFilter.publishStatus && t.publishStatus !== tunnelFilter.publishStatus) return false
    return true
  })
})

let mapOverlays: any[] = []
let mapInfoWindow: any = null
let highlightedOverlay: any = null
const selectedFacility = shallowRef<any>(null)

// 高亮指定 polyline，重置其余
function highlightPolyline(target: any) {
  mapOverlays.forEach(o => {
    if (o === target) {
      o.setOptions({ strokeWeight: 10, strokeOpacity: 1, strokeColor: '#FFD700' })
    } else {
      const fac = o.extData?.fac
      o.setOptions({ strokeWeight: 4, strokeOpacity: 0.9, strokeColor: fac?.color || '#1890ff' })
    }
  })
  highlightedOverlay = target
}

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
  highlightedOverlay = null
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
    polyline.on('mouseover', () => {
      if (polyline !== highlightedOverlay) polyline.setOptions({ strokeWeight: 7, strokeOpacity: 1 })
    })
    polyline.on('mouseout', () => {
      if (polyline !== highlightedOverlay) polyline.setOptions({ strokeWeight: 4, strokeOpacity: 0.9 })
    })
    polyline.on('click', () => {
      highlightPolyline(polyline)
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

// ===== 运维管理 =====
const opsLayer = ref<'road' | 'bridge' | 'tunnel'>('road')
const opsSubLayer = ref<'type' | 'eval'>('type')
const showOpsInspectDetail = ref(false)
const showOpsHiddenDetail = ref(false)
const showOpsAssessDetail = ref(false)

// 运维管理2环形图悬浮展示
const showRingTooltip = (type: string, e?: MouseEvent) => {
  // 关闭已有的tooltip
  const existing = document.querySelector('.ring-tooltip')
  if (existing) existing.remove()
  
  let title = ''
  let items: any[] = []
  
  if (type === 'road') {
    title = '道路分级情况统计'
    items = [
      { grade: 'A级', count: 1831.60, unit: 'km', percent: 49.97, color: '#5b8ff9' },
      { grade: 'B级', count: 1754.46, unit: 'km', percent: 47.87, color: '#5ad8a6' },
      { grade: 'C级', count: 47.80, unit: 'km', percent: 1.3, color: '#f6bd16' },
      { grade: 'D级', count: 31.54, unit: 'km', percent: 0.86, color: '#e86452' }
    ]
  } else if (type === 'bridge') {
    title = '桥梁分级情况统计'
    items = [
      { grade: 'A级', count: 2095, unit: '座', percent: 44.89, color: '#5b8ff9' },
      { grade: 'B级', count: 2256, unit: '座', percent: 48.34, color: '#5ad8a6' },
      { grade: 'C级', count: 291, unit: '座', percent: 6.23, color: '#f6bd16' },
      { grade: 'D级', count: 25, unit: '座', percent: 0.54, color: '#e86452' },
      { grade: 'E级', count: 0, unit: '座', percent: 0, color: '#945fb9' },
      { grade: '合格', count: 4646, unit: '座', percent: 99.46, color: '#52c41a' },
      { grade: '不合格', count: 25, unit: '座', percent: 0.54, color: '#ff4d4f' }
    ]
  } else if (type === 'tunnel') {
    title = '隧道分级情况统计'
    items = [
      { grade: 'A级', count: 123, unit: '座', percent: 50.41, color: '#5b8ff9' },
      { grade: 'B级', count: 82, unit: '座', percent: 33.61, color: '#5ad8a6' },
      { grade: 'C级', count: 39, unit: '座', percent: 15.98, color: '#f6bd16' },
      { grade: 'D级', count: 0, unit: '座', percent: 0, color: '#e86452' },
      { grade: 'E级', count: 0, unit: '座', percent: 0, color: '#945fb9' }
    ]
  }
  
  // 创建悬浮提示框
  const tooltip = document.createElement('div')
  tooltip.className = 'ring-tooltip'
  tooltip.innerHTML = `
    <div class="tooltip-title">${title}</div>
    ${items.map(item => `
      <div class="tooltip-item">
        <span class="tooltip-dot" style="background: ${item.color}"></span>
        <span class="tooltip-label">${item.grade}</span>
        <span class="tooltip-value">${item.count}${item.unit} (${item.percent}%)</span>
      </div>
    `).join('')}
  `
  
  // 添加到页面
  document.body.appendChild(tooltip)
  
  // 定位到点击位置附近
  if (e) {
    const x = e.clientX
    const y = e.clientY
    tooltip.style.left = `${x + 15}px`
    tooltip.style.top = `${y - 10}px`
  }
  
  // 点击其他区域关闭
  const closeHandler = (ev: MouseEvent) => {
    if (!tooltip.contains(ev.target as Node)) {
      tooltip.remove()
      document.removeEventListener('click', closeHandler)
    }
  }
  setTimeout(() => {
    document.addEventListener('click', closeHandler)
  }, 100)
  
  // 5秒后自动关闭
  setTimeout(() => {
    if (document.body.contains(tooltip)) {
      tooltip.remove()
    }
  }, 5000)
}

// 风险隐患表和提示单弹窗
const showRiskHintModal = ref(false)
const riskHintTab = ref<'road' | 'bridge' | 'tunnel'>('road')
let hasShownRiskHint = false // 标记是否已显示过

// 风险隐患表和提示单下载
const handleRiskHintDownload = () => {
  const tabLabel = { road: '道路', bridge: '桥梁', tunnel: '隧道' }[riskHintTab.value]
  const data = riskHintData[riskHintTab.value]
  let content = `风险隐患表和提示单 - ${tabLabel}\n`
  content += '='.repeat(50) + '\n\n'
  // 设施检测
  const fi = data.facilityInspection
  content += `【设施检测】\n应检测: ${fi.shouldInspect}条, 已检测: ${fi.inspected}条, 应检未检: ${fi.uninspected}条, 超期未检: ${fi.overdue}条`
  if ('gradeD' in fi) content += `, D级: ${fi.gradeD}条`
  if ('gradeDE' in fi) content += `, D/E级: ${fi.gradeDE}条`
  if ('unqualified' in fi) content += `, 不合格: ${fi.unqualified}条`
  content += `, 应修未修: ${fi.shouldRepair}条\n\n`
  // 隐患排查
  const hd = data.hiddenDanger
  content += `【隐患排查】\n应排查: ${hd.shouldCheck}条, 已排查: ${hd.checked}条, 问题隐患: ${hd.totalHazards}个, 一般隐患: ${hd.general}个, 较大隐患: ${hd.larger}个, 重大隐患: ${hd.major}个, 已整改: ${hd.fixed}个\n\n`
  // 设备监测
  const dm = data.deviceMonitor
  content += `【设备监测】\n应接入: ${dm.shouldConnect}条, 已接入: ${dm.connected}条, 接入率: ${dm.connectRate}%, 设备总数: ${dm.totalDevices}个, 在线: ${dm.online}个, 在线率: ${dm.onlineRate}%\n预警: ${dm.warnings}条 (一级: ${dm.warningLevel1}, 二级: ${dm.warningLevel2}, 三级: ${dm.warningLevel3}), 已处置: ${dm.handled}条\n\n`
  // 安全评估
  const sa = data.safetyAssess
  content += `【安全评估】\n应评估: ${sa.shouldAssess}条, 已评估: ${sa.assessed}条, 问题隐患: ${sa.totalHazards}个, 一般隐患: ${sa.general}个, 较大隐患: ${sa.larger}个, 重大隐患: ${sa.major}个, 已整改: ${sa.fixed}个\n`
  // 下载
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `风险隐患表和提示单_${tabLabel}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
const opsInspectChartRef = ref<HTMLElement | null>(null)
const opsExpiringChartRef = ref<HTMLElement | null>(null)
const opsGradeChartRef = ref<HTMLElement | null>(null)
const opsHiddenChartRef = ref<HTMLElement | null>(null)
const opsAssessChartRef = ref<HTMLElement | null>(null)
let opsInspectChart: echarts.ECharts | null = null
let opsExpiringChart: echarts.ECharts | null = null
let opsGradeChart: echarts.ECharts | null = null
let opsHiddenChart: echarts.ECharts | null = null
let opsAssessChart: echarts.ECharts | null = null

// 运维管理地市选择
const opsCity = ref('浙江省')
const showOpsCityDropdown = ref(false)
const selectOpsCity = (city: string) => { opsCity.value = city; showOpsCityDropdown.value = false }

// 运维管理图例
const opsTypeLegend = computed(() => opsLayer.value === 'bridge' ? bridgeTypeLegend : opsLayer.value === 'tunnel' ? tunnelTypeLegend : roadTypeLegend)
const opsEvalLegend = computed(() => opsLayer.value === 'bridge' ? bridgeEvalLegend : opsLayer.value === 'tunnel' ? tunnelEvalLegend : roadEvalLegend)
const opsTypeChecked = reactive({ main: true, sub: true, branch: true, highway: true, cable: true, arch: true, beam: true, pier: true, env: true, mech: true, struct: true })
const opsEvalChecked = reactive({ A: true, B: true, C: true, D: true })

// 运维管理-设施检测列表（同总体态势风险清单设施检测列表）
const opsInspectList = [
  { id: 1, area: '上城区', name: '石贯子巷', inspectName: '石贯子巷常规检测', inspectTime: '2026-01-15', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-03-20', afterGrade: 'C' },
  { id: 2, area: '上城区', name: '中山中路', inspectName: '中山中路结构检测', inspectTime: '2026-02-20', inspectType: '结构检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-04-15', afterGrade: 'C' },
  { id: 3, area: '拱墅区', name: '环城北路', inspectName: '环城北路特殊检测', inspectTime: '2025-12-10', inspectType: '特殊检测', grade: 'D', rectype: '拆除或完全封控', status: '已完成', doneTime: '2026-02-10', afterGrade: '-' },
  { id: 4, area: '西湖区', name: '文三路', inspectName: '文三路常规检测', inspectTime: '2026-03-05', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '未完成', doneTime: '-', afterGrade: '-' },
  { id: 5, area: '滨江区', name: '江南大道', inspectName: '江南大道结构检测', inspectTime: '2025-11-25', inspectType: '结构检测', grade: 'D', rectype: '拆除或完全封控', status: '已完成', doneTime: '2026-01-25', afterGrade: '-' },
  { id: 6, area: '上城区', name: '解放路', inspectName: '解放路常规检测', inspectTime: '2026-04-10', inspectType: '常规检测', grade: 'D', rectype: '维修整治', status: '已完成', doneTime: '2026-05-08', afterGrade: 'C' },
]

// 运维管理-设施检测详情（同工作台检测管理详情）
const opsInspectDetailTab = ref<'road' | 'bridge' | 'tunnel'>('road')
const opsInspectDrillType = ref<string | null>(null)
const opsInspectDrillCity = ref('')

const opsInspectDrillTitle = computed(() => {
  const t = opsInspectDrillType.value
  const tab = opsInspectDetailTab.value
  if (t === 'overdue') return `${opsInspectDrillCity.value} - 超期未检${tab === 'bridge' ? '桥梁' : tab === 'tunnel' ? '隧道' : '道路'}详情`
  if (t === 'expiringSoon') return `${opsInspectDrillCity.value} - 即将超期${tab === 'bridge' ? '桥梁' : tab === 'tunnel' ? '隧道' : '道路'}详情`
  const map: Record<string, string> = { gradeD: 'D级道路详情', gradeDE: 'D、E级详情', unqualified: '不合格桥梁详情' }
  return `${opsInspectDrillCity.value} - ${map[t || ''] || ''}`
})

function openOpsInspectDetail() {
  opsInspectDetailTab.value = opsLayer.value
  opsInspectDrillType.value = null
  showOpsInspectDetail.value = true
}

function enterOpsDrill(field: string, cityName: string) {
  opsInspectDrillType.value = field
  opsInspectDrillCity.value = cityName
}

// 运维管理检测管理列（同工作台detectionColumns，支持下钻）
const opsClickLink = (field: string) => ({ customRender: ({ text, record }: any) => ({ children: h('a', { onClick: () => enterOpsDrill(field, record.city) }, text) }) })
const opsInspectColumns = {
  road: [{ title: '地市', dataIndex: 'city', key: 'city', width: 70 }, { title: '道路总数(条)', dataIndex: 'total', key: 'total', width: 90 }, { title: '已检测', dataIndex: 'detected', key: 'detected', width: 70 }, { title: '检测率', dataIndex: 'rate', key: 'rate', width: 70 }, { title: 'D级道路', dataIndex: 'gradeD', key: 'gradeD', width: 70, ...opsClickLink('gradeD') }, { title: '已维修整治', dataIndex: 'repaired', key: 'repaired', width: 90 }, { title: '已拆除或完全封控', dataIndex: 'removed', key: 'removed', width: 95 }, { title: '超期未检', dataIndex: 'overdue', key: 'overdue', width: 80, ...opsClickLink('overdue') }, { title: '即将超期\n(不足30天)', dataIndex: 'expiringSoon', key: 'expiringSoon', width: 100, ...opsClickLink('expiringSoon') }],
  bridge: [{ title: '地市', dataIndex: 'city', key: 'city', width: 70 }, { title: '桥梁总数(座)', dataIndex: 'total', key: 'total', width: 95 }, { title: '已检测', dataIndex: 'detected', key: 'detected', width: 70 }, { title: '检测率', dataIndex: 'rate', key: 'rate', width: 70 }, { title: 'D、E级桥梁', dataIndex: 'gradeDE', key: 'gradeDE', width: 90, ...opsClickLink('gradeDE') }, { title: '不合格桥梁', dataIndex: 'unqualified', key: 'unqualified', width: 90, ...opsClickLink('unqualified') }, { title: '已维修整治', dataIndex: 'repaired', key: 'repaired', width: 90 }, { title: '已拆除或完全封控', dataIndex: 'removed', key: 'removed', width: 95 }, { title: '超期未检', dataIndex: 'overdue', key: 'overdue', width: 80, ...opsClickLink('overdue') }, { title: '即将超期\n(不足30天)', dataIndex: 'expiringSoon', key: 'expiringSoon', width: 100, ...opsClickLink('expiringSoon') }],
  tunnel: [{ title: '地市', dataIndex: 'city', key: 'city', width: 70 }, { title: '隧道总数(座)', dataIndex: 'total', key: 'total', width: 95 }, { title: '已检测', dataIndex: 'detected', key: 'detected', width: 70 }, { title: '检测率', dataIndex: 'rate', key: 'rate', width: 70 }, { title: 'D、E级隧道', dataIndex: 'gradeDE', key: 'gradeDE', width: 90, ...opsClickLink('gradeDE') }, { title: '已维修整治', dataIndex: 'repaired', key: 'repaired', width: 90 }, { title: '已拆除或完全封控', dataIndex: 'removed', key: 'removed', width: 95 }, { title: '超期未检', dataIndex: 'overdue', key: 'overdue', width: 80, ...opsClickLink('overdue') }, { title: '即将超期\n(不足30天)', dataIndex: 'expiringSoon', key: 'expiringSoon', width: 100, ...opsClickLink('expiringSoon') }],
}

// 运维管理检测数据（同工作台detectionData）
const opsInspectDrillData = computed(() => {
  const cities = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
  const tab = opsInspectDetailTab.value
  if (tab === 'road') return cities.map((c: string, i: number) => ({ key: i, city: c, total: [86, 72, 64, 48, 32, 42, 38, 28, 45, 22, 14][i], detected: [78, 65, 58, 42, 28, 38, 34, 24, 40, 19, 12][i], rate: ['90.7%', '90.3%', '90.6%', '87.5%', '87.5%', '90.5%', '89.5%', '85.7%', '88.9%', '86.4%', '85.7%'][i], gradeD: [5, 3, 4, 2, 1, 2, 2, 1, 3, 1, 0][i], repaired: [3, 1, 2, 1, 0, 1, 0, 0, 2, 0, 0][i], removed: [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0][i], overdue: [4, 3, 2, 2, 1, 2, 1, 1, 2, 1, 1][i], expiringSoon: [6, 4, 4, 3, 2, 2, 2, 2, 3, 1, 1][i] }))
  if (tab === 'bridge') return cities.map((c: string, i: number) => ({ key: i, city: c, total: [567, 423, 389, 256, 178, 234, 198, 145, 267, 123, 87][i], detected: [512, 382, 351, 228, 158, 210, 176, 128, 238, 108, 76][i], rate: ['90.3%', '90.3%', '90.2%', '89.1%', '88.8%', '89.7%', '88.9%', '88.3%', '89.1%', '87.8%', '87.4%'][i], gradeDE: [28, 21, 18, 12, 8, 11, 10, 7, 14, 6, 4][i], unqualified: [15, 11, 9, 6, 4, 6, 5, 3, 7, 3, 2][i], repaired: [18, 12, 10, 6, 4, 6, 5, 3, 8, 3, 2][i], removed: [5, 4, 3, 2, 1, 2, 1, 1, 3, 1, 0][i], overdue: [18, 13, 12, 8, 6, 8, 7, 5, 10, 5, 4][i], expiringSoon: [24, 18, 16, 10, 7, 10, 8, 6, 12, 5, 4][i] }))
  return cities.map((c: string, i: number) => ({ key: i, city: c, total: [98, 76, 68, 45, 32, 41, 35, 26, 48, 21, 14][i], detected: [89, 68, 62, 40, 28, 37, 31, 23, 43, 18, 12][i], rate: ['90.8%', '89.5%', '91.2%', '88.9%', '87.5%', '90.2%', '88.6%', '88.5%', '89.6%', '85.7%', '85.7%'][i], gradeDE: [6, 4, 4, 2, 2, 2, 2, 1, 3, 1, 1][i], repaired: [3, 2, 2, 1, 0, 1, 0, 0, 1, 0, 0][i], removed: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0][i], overdue: [5, 4, 3, 2, 2, 2, 2, 1, 3, 2, 1][i], expiringSoon: [7, 5, 5, 3, 2, 3, 2, 2, 4, 2, 1][i] }))
})

// 运维管理下钻列
const opsDrillColumns = computed(() => {
  const t = opsInspectDrillType.value
  if (t === 'overdue' || t === 'expiringSoon') {
    const nameTitle = opsInspectDetailTab.value === 'bridge' ? '桥梁名称' : opsInspectDetailTab.value === 'tunnel' ? '隧道名称' : '道路名称'
    return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: nameTitle, dataIndex: 'name', key: 'name', width: 150 }, { title: '最新检测时间', dataIndex: 'lastInspectDate', key: 'lastInspectDate', width: 120 }, { title: '检测周期', dataIndex: 'cycle', key: 'cycle', width: 90 }, { title: '检测到期时间', dataIndex: 'expireDate', key: 'expireDate', width: 120 }]
  }
  const tab = opsInspectDetailTab.value
  const nameTitle = tab === 'bridge' ? '桥梁名称' : tab === 'tunnel' ? '隧道名称' : '道路名称'
  const resultTitle = tab === 'bridge' ? '桥梁整改销号结果' : tab === 'tunnel' ? '隧道整改销号结果' : '道路整改销号结果'
  return [{ title: '地市', dataIndex: 'city', key: 'city', width: 80 }, { title: '检测名称', dataIndex: 'inspectName', key: 'inspectName', width: 120 }, { title: '检测时间', dataIndex: 'inspectDate', key: 'inspectDate', width: 110 }, { title: '检测类型', dataIndex: 'inspectType', key: 'inspectType', width: 90 }, { title: nameTitle, dataIndex: 'name', key: 'name', width: 120 }, { title: '综合评价等级', dataIndex: 'grade', key: 'grade', width: 100 }, { title: resultTitle, dataIndex: 'result', key: 'result', width: 240 }]
})

// 运维管理下钻数据
const opsDrillData = computed(() => {
  const city = opsInspectDrillCity.value
  const t = opsInspectDrillType.value
  const tab = opsInspectDetailTab.value
  const data = opsInspectDrillData.value
  const row = data.find((r: any) => r.city === city)
  if (!row) return []
  const count = (row as any)?.[t === 'overdue' ? 'overdue' : t === 'expiringSoon' ? 'expiringSoon' : t === 'gradeD' ? 'gradeD' : t === 'unqualified' ? 'unqualified' : 'gradeDE'] ?? 2
  const namePrefix = { road: '路段', bridge: '桥梁', tunnel: '隧道' }
  const inspectionCycles = ['一年', '两年', '三年']
  if (t === 'overdue') {
    return Array.from({ length: count }, (_, i) => {
      const cycle = inspectionCycles[i % 3]
      const years = cycle === '一年' ? 1 : cycle === '两年' ? 2 : 3
      const lastYear = 2024 - years - 1
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
      return { key: i, city, name: `${city}${namePrefix[tab as 'road' | 'bridge' | 'tunnel']}${String(i + 1).padStart(3, '0')}`, lastInspectDate: `${lastYear}-${month}-${day}`, cycle, expireDate: `${lastYear + years}-${month}-${day}` }
    })
  }
  if (t === 'expiringSoon') {
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return Array.from({ length: count }, (_, i) => {
      const cycle = inspectionCycles[i % 3]
      const years = cycle === '一年' ? 1 : cycle === '两年' ? 2 : 3
      const offsetDays = 1 + (i * 29 / Math.max(count, 1)) | 0
      const expireDate = new Date(today.getTime() + offsetDays * 86400000)
      const expStr = `${expireDate.getFullYear()}-${pad(expireDate.getMonth() + 1)}-${pad(expireDate.getDate())}`
      const lastDate = new Date(expireDate)
      lastDate.setFullYear(lastDate.getFullYear() - years)
      return { key: i, city, name: `${city}${namePrefix[tab as 'road' | 'bridge' | 'tunnel']}${String(i + 1).padStart(3, '0')}`, lastInspectDate: `${lastDate.getFullYear()}-${pad(lastDate.getMonth() + 1)}-${pad(lastDate.getDate())}`, cycle, expireDate: expStr }
    })
  }
  const typeMap: Record<string, string> = { road: '常规检测', bridge: '常规检测', tunnel: '常规检测', unqualified: '专项检测' }
  const results = ['未完成', '已完成（销号日期2024-08-19；新评级A）', '已完成（销号日期2024-08-19；拆除或完全封控）']
  const grades = ['D', 'D', 'E', 'D', 'E']
  const newGrades = ['A', 'B', 'C']
  return Array.from({ length: count }, (_, i) => ({
    key: i, city,
    inspectName: `${city}${namePrefix[tab as 'road' | 'bridge' | 'tunnel']}检测-2024-${String(i + 1).padStart(3, '0')}`,
    inspectDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    inspectType: typeMap[t || 'road'],
    name: `${city}${namePrefix[tab as 'road' | 'bridge' | 'tunnel']}${String(i + 1).padStart(3, '0')}`,
    grade: t === 'unqualified' ? '不合格' : tab === 'road' ? 'D' : grades[i % grades.length],
    result: (() => { const r = results[i % results.length]; if (r.includes('新评级') && t !== 'unqualified') { const g = newGrades[i % newGrades.length]; return r.replace(/新评级[A-Z]/, `新评级${g}`) } return r })(),
  }))
})

// 运维管理-隐患排查列表（按区域统计）
const opsHiddenList = [
  { id: 1, area: '上城区', checkTotal: 20, checkDone: 18, hiddenTotal: 15, fixedCount: 12, fixRate: 80.0 },
  { id: 2, area: '拱墅区', checkTotal: 18, checkDone: 14, hiddenTotal: 12, fixedCount: 9, fixRate: 75.0 },
  { id: 3, area: '西湖区', checkTotal: 16, checkDone: 12, hiddenTotal: 10, fixedCount: 8, fixRate: 80.0 },
  { id: 4, area: '滨江区', checkTotal: 14, checkDone: 10, hiddenTotal: 8, fixedCount: 6, fixRate: 75.0 },
  { id: 5, area: '萧山区', checkTotal: 12, checkDone: 8, hiddenTotal: 6, fixedCount: 4, fixRate: 66.7 },
  { id: 6, area: '余杭区', checkTotal: 10, checkDone: 6, hiddenTotal: 5, fixedCount: 3, fixRate: 60.0 },
  { id: 7, area: '临平区', checkTotal: 8, checkDone: 5, hiddenTotal: 4, fixedCount: 2, fixRate: 50.0 },
  { id: 8, area: '钱塘区', checkTotal: 6, checkDone: 4, hiddenTotal: 3, fixedCount: 2, fixRate: 66.7 },
]

function getFixRateClass(rate: number) {
  return rate >= 80 ? 'rate-high' : rate >= 60 ? 'rate-mid' : 'rate-low'
}

// 风险隐患表和提示单数据
const riskHintData = {
  road: {
    facilityInspection: {
      shouldInspect: 1076,
      inspected: 620,
      uninspected: 456,
      overdue: 65,
      gradeD: 78,
      shouldRepair: 56,
    },
    hiddenDanger: {
      shouldCheck: 980,
      checked: 900,
      totalHazards: 98,
      general: 67,
      larger: 18,
      major: 13,
      fixed: 87,
    },
    deviceMonitor: {
      shouldConnect: 980,
      connected: 960,
      connectRate: 98.0,
      totalDevices: 3467,
      online: 3400,
      onlineRate: 99.0,
      warnings: 87,
      warningLevel1: 12,
      warningLevel2: 20,
      warningLevel3: 55,
      handled: 60,
    },
    safetyAssess: {
      shouldAssess: 980,
      assessed: 900,
      totalHazards: 98,
      general: 67,
      larger: 18,
      major: 13,
      fixed: 87,
    },
  },
  bridge: {
    facilityInspection: {
      shouldInspect: 856,
      inspected: 520,
      uninspected: 336,
      overdue: 45,
      gradeDE: 58,
      unqualified: 32,
      shouldRepair: 42,
    },
    hiddenDanger: {
      shouldCheck: 780,
      checked: 720,
      totalHazards: 76,
      general: 52,
      larger: 14,
      major: 10,
      fixed: 68,
    },
    deviceMonitor: {
      shouldConnect: 780,
      connected: 760,
      connectRate: 97.4,
      totalDevices: 2856,
      online: 2800,
      onlineRate: 98.0,
      warnings: 65,
      warningLevel1: 8,
      warningLevel2: 15,
      warningLevel3: 42,
      handled: 48,
    },
    safetyAssess: {
      shouldAssess: 780,
      assessed: 720,
      totalHazards: 76,
      general: 52,
      larger: 14,
      major: 10,
      fixed: 68,
    },
  },
  tunnel: {
    facilityInspection: {
      shouldInspect: 656,
      inspected: 420,
      uninspected: 236,
      overdue: 35,
      gradeDE: 42,
      shouldRepair: 28,
    },
    hiddenDanger: {
      shouldCheck: 580,
      checked: 540,
      totalHazards: 54,
      general: 38,
      larger: 10,
      major: 6,
      fixed: 48,
    },
    deviceMonitor: {
      shouldConnect: 580,
      connected: 560,
      connectRate: 96.6,
      totalDevices: 1856,
      online: 1820,
      onlineRate: 98.1,
      warnings: 42,
      warningLevel1: 5,
      warningLevel2: 10,
      warningLevel3: 27,
      handled: 32,
    },
    safetyAssess: {
      shouldAssess: 580,
      assessed: 540,
      totalHazards: 54,
      general: 38,
      larger: 10,
      major: 6,
      fixed: 48,
    },
  },
}

// 运维管理-安全评估列表
const opsAssessList = [
  { id: 1, area: '上城区', name: '石贯子巷', project: '道路设施', level: 3, fixed: true },
  { id: 2, area: '拱墅区', name: '环城北路', project: '道路设施', level: 3, fixed: false },
  { id: 3, area: '西湖区', name: '文三路', project: '道路照明设施', level: 1, fixed: true },
  { id: 4, area: '滨江区', name: '江南大道', project: '道路设施', level: 1, fixed: true },
  { id: 5, area: '上城区', name: '解放路', project: '道路照明设施', level: 2, fixed: false },
  { id: 6, area: '拱墅区', name: '莫干山路', project: '道路设施', level: 3, fixed: true },
]

function initOpsMap() {
  const AMap = (window as any).AMap
  if (!opsMapRef.value || !AMap) return
  if (opsMap) opsMap.destroy()
  const layers: any[] = []
  if (mapStyle.value === 'satellite') {
    layers.push(new AMap.TileLayer.Satellite())
    layers.push(new AMap.TileLayer.RoadNet())
  }
  opsMap = new AMap.Map(opsMapRef.value, {
    zoom: 11, center: [120.15, 30.27], layers,
    viewMode: '2D', dragEnable: true, zoomEnable: true,
    mapStyle: 'amap://styles/dark',
  })
  initOpsMapOverlays()
}

function initOpsMapOverlays() {
  const AMap = (window as any).AMap
  if (!opsMap || !AMap) return
  opsMapOverlays.forEach(o => opsMap.remove(o))
  opsMapOverlays = []
  if (opsMapInfoWindow) { opsMapInfoWindow.close(); opsMapInfoWindow = null }
  const facilities = opsLayer.value === 'road' ? roadFacilities
    : opsLayer.value === 'bridge' ? bridgeFacilities : tunnelFacilities
  opsMapInfoWindow = new AMap.InfoWindow({ isCustom: true, autoMove: true, offset: new AMap.Pixel(0, -10) })
  facilities.forEach((fac: any, idx: number) => {
    const polyline = new AMap.Polyline({
      path: fac.path.map((p: [number, number]) => new AMap.LngLat(p[0], p[1])),
      strokeColor: fac.color, strokeWeight: 4, strokeOpacity: 0.9,
      lineJoin: 'round', lineCap: 'round', cursor: 'pointer', extData: { fac, idx },
    })
    polyline.on('mouseover', () => polyline.setOptions({ strokeWeight: 7, strokeOpacity: 1 }))
    polyline.on('mouseout', () => polyline.setOptions({ strokeWeight: 4, strokeOpacity: 0.9 }))
    polyline.on('click', () => {
      const gradeColor = (g: string) => ({ A: '#5b8ff9', B: '#5ad8a6', C: '#f6bd16', D: '#e86452', E: '#e86452' }[g] || '#fff')
      let html = '<div class="map-popup">'
      Object.entries(fac.info).forEach(([k, v]) => {
        if (k.includes('等级')) {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value grade" style="color:${gradeColor(String(v))}">${v}</span></div>`
        } else {
          html += `<div class="popup-row"><span class="popup-label">${k}</span><span class="popup-value">${v}</span></div>`
        }
      })
      html += '</div>'
      const path = fac.path
      const mid = path[Math.floor(path.length / 2)]
      opsMapInfoWindow!.setContent(html)
      opsMapInfoWindow!.open(opsMap, new AMap.LngLat(mid[0], mid[1]))
    })
    opsMap.add(polyline)
    opsMapOverlays.push(polyline)
  })
}

// 各地市D级/DE级数据
const opsGradeData = {
  road: {
    title: 'D级道路',
    cities: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州', '台州', '丽水', '舟山'],
    series: [{ name: 'D级道路', type: 'bar', data: [5, 4, 3, 2, 2, 2, 2, 1, 3, 1, 0], itemStyle: { color: '#e86452' }, barWidth: 12 }],
  },
  bridge: {
    title: 'D、E级桥梁 / 不合格桥梁',
    cities: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州', '台州', '丽水', '舟山'],
    series: [
      { name: 'D、E级桥梁', type: 'bar', stack: 'grade', data: [3, 3, 2, 2, 1, 2, 1, 1, 2, 1, 0], itemStyle: { color: '#e86452' }, barWidth: 12 },
      { name: '不合格桥梁', type: 'bar', stack: 'grade', data: [2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0], itemStyle: { color: '#f6bd16' }, barWidth: 12 },
    ],
  },
  tunnel: {
    title: 'D、E级隧道',
    cities: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州', '台州', '丽水', '舟山'],
    series: [{ name: 'D、E级隧道', type: 'bar', data: [2, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0], itemStyle: { color: '#e86452' }, barWidth: 12 }],
  },
}

function updateOpsGradeChart() {
  if (!opsGradeChartRef.value) return
  if (opsGradeChart) opsGradeChart.dispose()
  opsGradeChart = echarts.init(opsGradeChartRef.value)
  const layer = opsLayer.value as 'road' | 'bridge' | 'tunnel'
  const data = opsGradeData[layer]
  opsGradeChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: layer === 'bridge' ? { top: 0, right: 0, textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }, itemWidth: 10, itemHeight: 8 } : undefined,
    grid: { top: layer === 'bridge' ? 18 : 6, right: 10, bottom: 18, left: 30 },
    xAxis: { type: 'category', data: data.cities, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, rotate: 15 }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.15)' } } },
    yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.08)' } } },
    series: data.series,
  })
}

function initOpsCharts() {
  const cities = ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州', '台州', '丽水', '舟山']
  // 设施检测柱状图（11地市）
  if (opsInspectChartRef.value) {
    if (opsInspectChart) opsInspectChart.dispose()
    opsInspectChart = echarts.init(opsInspectChartRef.value)
    opsInspectChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { top: 10, right: 10, bottom: 20, left: 40 },
      xAxis: { type: 'category', data: cities, axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, rotate: 15 }, axisLine: { lineStyle: { color: 'rgba(100,160,255,0.15)' } } },
      yAxis: { type: 'value', axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 }, splitLine: { lineStyle: { color: 'rgba(100,160,255,0.08)' } } },
      series: [
        { name: '应检', type: 'bar', data: [86, 72, 64, 48, 32, 42, 38, 28, 45, 22, 14], itemStyle: { color: '#5b8ff9' }, barWidth: 10 },
        { name: '已检', type: 'bar', data: [78, 65, 58, 42, 28, 38, 34, 24, 40, 19, 12], itemStyle: { color: '#5ad8a6' }, barWidth: 10 },
      ],
    })
  }
  // 即将超期/超期未检柱状图
  if (opsExpiringChartRef.value) {
    if (opsExpiringChart) opsExpiringChart.dispose()
    opsExpiringChart = echarts.init(opsExpiringChartRef.value)
    opsExpiringChart.setOption({
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
      }],
    })
  }
  // D级/DE级等级柱状图
  setTimeout(() => {
    if (opsGradeChartRef.value) {
      updateOpsGradeChart()
    }
  }, 200)
  // 隐患排查饼图（同总体态势风险清单隐患排查饼图）
  if (opsHiddenChartRef.value) {
    if (opsHiddenChart) opsHiddenChart.dispose()
    opsHiddenChart = echarts.init(opsHiddenChartRef.value)
    opsHiddenChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 0, textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 }, itemWidth: 10, itemHeight: 10 },
      series: [{
        type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
        label: { show: true, position: 'inside', fontSize: 11, fontWeight: 700, color: '#fff', formatter: '{c}' },
        data: [
          { name: '一般隐患', value: 52, itemStyle: { color: '#5b8ff9' } },
          { name: '较大隐患', value: 32, itemStyle: { color: '#f6bd16' } },
          { name: '重大隐患', value: 12, itemStyle: { color: '#e86452' } },
        ],
      }],
    })
  }
  // 安全评估饼图
  if (opsAssessChartRef.value) {
    if (opsAssessChart) opsAssessChart.dispose()
    opsAssessChart = echarts.init(opsAssessChartRef.value)
    opsAssessChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 10 } },
      series: [{
        type: 'pie', radius: ['40%', '65%'], center: ['50%', '45%'],
        label: { show: false },
        data: [
          { value: 30, name: 'A级', itemStyle: { color: '#5ad8a6' } },
          { value: 25, name: 'B级', itemStyle: { color: '#5b8ff9' } },
          { value: 20, name: 'C级', itemStyle: { color: '#f6bd16' } },
          { value: 11, name: 'D级', itemStyle: { color: '#e86452' } },
        ],
      }],
    })
  }
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
const bridgeTypeChecked = reactive({ extraLarge: true, large: true, overpass: true, viaduct: true, mediumBridge: true, smallBridge: true, other: true })
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
const showBridgeModal = ref(false)
const showTunnelModal = ref(false)

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
// 报警下钻明细弹窗
const showAlarmDrillDownModal = ref(false)
const drillDownCity = ref('') // 当前下钻的城市
const drillDownType = ref('') // 下钻类型：total/level1/level2/level3/handled

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
  { title: '市区县', dataIndex: 'area', key: 'area', width: 100 },
  { title: '设施名称', dataIndex: 'facName', key: 'facName', width: 120 },
  { title: '设备名称', dataIndex: 'devName', key: 'devName', width: 160 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 100 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 240 },
  { title: '报警开始时间', dataIndex: 'alarmTime', key: 'alarmTime', width: 160 },
  { title: '报警结束时间', dataIndex: 'alarmEndTime', key: 'alarmEndTime', width: 160 },
  { title: '预警值', dataIndex: 'alarmValue', key: 'alarmValue', width: 90 },
  { title: '预警等级', dataIndex: 'alarmLevel', key: 'alarmLevel', width: 100 },
  { title: '处置状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '处置完成时间', dataIndex: 'finishTime', key: 'finishTime', width: 160 },
  { title: '处置人', dataIndex: 'handler', key: 'handler', width: 80 },
]
const alarmDetailData = computed(() => {
  if (monitorLayer.value === 'road') {
    return [
      { key: 1, area: '绍兴市越城区', facName: '石贯子巷', devName: '石贯子巷路面设备', monitorItem: '路面状况', pointName: 'K2+300路面平整度监测点', alarmTime: '2026-4-25 15:30:00', alarmEndTime: '2026-4-25 16:00:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15', handler: '张伟' },
      { key: 2, area: '绍兴市越城区', facName: '石贯子巷', devName: '石贯子巷路面设备', monitorItem: '路面状况', pointName: 'K3+100路面平整度监测点', alarmTime: '2026-4-25 16:20:00', alarmEndTime: '', alarmValue: -733.8, alarmLevel: '一级预警', status: '未完成', finishTime: '/', handler: '' },
      { key: 3, area: '杭州市滨江区', facName: '复兴大道', devName: '复兴大道路面设备', monitorItem: '路面状况', pointName: 'K5+500路面平整度监测点', alarmTime: '2026-4-26 08:10:00', alarmEndTime: '2026-4-26 09:00:00', alarmValue: -520.3, alarmLevel: '二级预警', status: '已完成', finishTime: '2026-4-26 09:25:00', handler: '李明' },
      { key: 4, area: '杭州市上城区', facName: '备塘河桥路', devName: '备塘河桥路路面设备', monitorItem: '路面状况', pointName: 'K1+200路面平整度监测点', alarmTime: '2026-4-27 10:05:00', alarmEndTime: '2026-4-27 11:00:00', alarmValue: 2.15, alarmLevel: '三级预警', status: '已完成', finishTime: '2026-4-27 11:30:00', handler: '王芳' },
      { key: 5, area: '杭州市拱墅区', facName: '拱墅路', devName: '拱墅路路面设备', monitorItem: '路面状况', pointName: 'K4+800路面平整度监测点', alarmTime: '2026-4-28 14:45:00', alarmEndTime: '', alarmValue: -480.6, alarmLevel: '一级预警', status: '未完成', finishTime: '/', handler: '' },
    ]
  }
  if (monitorLayer.value === 'tunnel') {
    return [
      { key: 1, area: '绍兴市越城区', facName: '紫金港北路下穿道', devName: '紫金港北路下穿道位移设备', monitorItem: '位移', pointName: '25-北侧位移·第2跨截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmEndTime: '2026-4-25 16:00:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15', handler: '张伟' },
      { key: 2, area: '绍兴市越城区', facName: '紫金港北路下穿道', devName: '紫金港北路下穿道位移设备', monitorItem: '位移', pointName: '25-南侧位移·第2跨截面1/2等分点', alarmTime: '2026-4-25 16:20:00', alarmEndTime: '', alarmValue: -733.8, alarmLevel: '一级预警', status: '未完成', finishTime: '/', handler: '' },
      { key: 3, area: '杭州市滨江区', facName: '复兴路隧道', devName: '复兴路隧道位移设备', monitorItem: '位移', pointName: '18-南侧位移·第1跨截面1/3等分点', alarmTime: '2026-4-26 08:10:00', alarmEndTime: '2026-4-26 09:00:00', alarmValue: -520.3, alarmLevel: '二级预警', status: '已完成', finishTime: '2026-4-26 09:25:00', handler: '李明' },
      { key: 4, area: '杭州市上城区', facName: '环城北路隧道', devName: '环城北路隧道位移设备', monitorItem: '位移', pointName: '12-东侧位移·第3跨截面1/2等分点', alarmTime: '2026-4-27 10:05:00', alarmEndTime: '2026-4-27 11:00:00', alarmValue: 2.15, alarmLevel: '三级预警', status: '已完成', finishTime: '2026-4-27 11:30:00', handler: '王芳' },
      { key: 5, area: '杭州市拱墅区', facName: '半山隧道', devName: '半山隧道位移设备', monitorItem: '位移', pointName: '8-西侧位移·第2跨截面1/4等分点', alarmTime: '2026-4-28 14:45:00', alarmEndTime: '', alarmValue: -480.6, alarmLevel: '一级预警', status: '未完成', finishTime: '/', handler: '' },
    ]
  }
  return [
    { key: 1, area: '绍兴市越城区', facName: '沪德立交桥', devName: '沪德立交桥应变设备', monitorItem: '应变', pointName: '25-北侧应变·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmEndTime: '2026-4-25 16:00:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15', handler: '张伟' },
    { key: 2, area: '绍兴市越城区', facName: '沪德立交桥', devName: '沪德立交桥应变设备', monitorItem: '应变', pointName: '25-南侧应变·第2跨拱肋截面1/2等分点', alarmTime: '2026-4-25 16:20:00', alarmEndTime: '', alarmValue: -733.8, alarmLevel: '一级预警', status: '未完成', finishTime: '/', handler: '' },
    { key: 3, area: '杭州市滨江区', facName: '复兴大桥', devName: '复兴大桥应变设备', monitorItem: '应变', pointName: '18-南侧应变·第1跨拱肋截面1/3等分点', alarmTime: '2026-4-26 08:10:00', alarmEndTime: '2026-4-26 09:00:00', alarmValue: -520.3, alarmLevel: '二级预警', status: '已完成', finishTime: '2026-4-26 09:25:00', handler: '李明' },
    { key: 4, area: '杭州市上城区', facName: '备塘河桥', devName: '备塘河桥倾角设备', monitorItem: '应变', pointName: '12-东侧倾角·第3跨拱肋截面1/2等分点', alarmTime: '2026-4-27 10:05:00', alarmEndTime: '2026-4-27 11:00:00', alarmValue: 2.15, alarmLevel: '三级预警', status: '已完成', finishTime: '2026-4-27 11:30:00', handler: '王芳' },
    { key: 5, area: '杭州市拱墅区', facName: '半山桥', devName: '半山桥应变设备', monitorItem: '应变', pointName: '8-西侧应变·第2跨拱肋截面1/4等分点', alarmTime: '2026-4-28 14:45:00', alarmEndTime: '', alarmValue: -480.6, alarmLevel: '一级预警', status: '未完成', finishTime: '/', handler: '' },
  ]
})

// 报警汇总表列定义（按地市统计）
const alarmSummaryColumns: TableColumnsType = [
  { title: '地市', dataIndex: 'city', key: 'city', width: 100, fixed: 'left' as const },
  { 
    title: '预警总数', 
    dataIndex: 'total', 
    key: 'total', 
    width: 100,
    customRender: ({ record }: { record: any }) => h('span', { style: { color: '#5b8ff9', cursor: 'pointer' }, onClick: () => handleAlarmDrillDown(record, 'total') }, record.total)
  },
  { 
    title: '一级预警', 
    dataIndex: 'level1', 
    key: 'level1', 
    width: 100,
    customRender: ({ record }: { record: any }) => h('span', { style: { color: '#ff4d4f', cursor: 'pointer' }, onClick: () => handleAlarmDrillDown(record, 'level1') }, record.level1)
  },
  { 
    title: '二级预警', 
    dataIndex: 'level2', 
    key: 'level2', 
    width: 100,
    customRender: ({ record }: { record: any }) => h('span', { style: { color: '#faad14', cursor: 'pointer' }, onClick: () => handleAlarmDrillDown(record, 'level2') }, record.level2)
  },
  { 
    title: '三级预警', 
    dataIndex: 'level3', 
    key: 'level3', 
    width: 100,
    customRender: ({ record }: { record: any }) => h('span', { style: { color: '#52c41a', cursor: 'pointer' }, onClick: () => handleAlarmDrillDown(record, 'level3') }, record.level3)
  },
  { 
    title: '处置总数', 
    dataIndex: 'handled', 
    key: 'handled', 
    width: 100,
    customRender: ({ record }: { record: any }) => h('span', { style: { color: '#5b8ff9', cursor: 'pointer' }, onClick: () => handleAlarmDrillDown(record, 'handled') }, record.handled)
  },
  { title: '处置率', dataIndex: 'rate', key: 'rate', width: 100 },
]

// 报警汇总数据（按地市统计）
const alarmSummaryData = computed(() => {
  // 根据图层返回不同的统计数据
  if (monitorLayer.value === 'road') {
    return [
      { key: 1, city: '宁波市', total: 96, level1: 14, level2: 38, level3: 44, handled: 84, rate: '87.5%' },
      { key: 2, city: '温州市', total: 84, level1: 12, level2: 34, level3: 38, handled: 73, rate: '86.9%' },
      { key: 3, city: '绍兴市', total: 62, level1: 8, level2: 25, level3: 29, handled: 54, rate: '87.1%' },
      { key: 4, city: '湖州市', total: 44, level1: 6, level2: 18, level3: 20, handled: 38, rate: '86.4%' },
      { key: 5, city: '嘉兴市', total: 58, level1: 8, level2: 24, level3: 26, handled: 50, rate: '86.2%' },
      { key: 6, city: '金华市', total: 52, level1: 7, level2: 21, level3: 24, handled: 45, rate: '86.5%' },
      { key: 7, city: '衢州市', total: 38, level1: 5, level2: 15, level3: 18, handled: 33, rate: '86.8%' },
      { key: 8, city: '台州市', total: 68, level1: 10, level2: 28, level3: 30, handled: 59, rate: '86.8%' },
      { key: 9, city: '丽水市', total: 32, level1: 5, level2: 13, level3: 14, handled: 28, rate: '87.5%' },
      { key: 10, city: '舟山市', total: 22, level1: 3, level2: 9, level3: 10, handled: 19, rate: '86.4%' },
    ]
  }
  if (monitorLayer.value === 'bridge') {
    return [
      { key: 1, city: '宁波市', total: 108, level1: 16, level2: 42, level3: 50, handled: 94, rate: '87.0%' },
      { key: 2, city: '温州市', total: 92, level1: 14, level2: 38, level3: 40, handled: 80, rate: '87.0%' },
      { key: 3, city: '绍兴市', total: 68, level1: 10, level2: 28, level3: 30, handled: 59, rate: '86.8%' },
      { key: 4, city: '湖州市', total: 48, level1: 7, level2: 20, level3: 21, handled: 42, rate: '87.5%' },
      { key: 5, city: '嘉兴市', total: 64, level1: 9, level2: 26, level3: 29, handled: 56, rate: '87.5%' },
      { key: 6, city: '金华市', total: 58, level1: 8, level2: 24, level3: 26, handled: 50, rate: '86.2%' },
      { key: 7, city: '衢州市', total: 42, level1: 6, level2: 17, level3: 19, handled: 37, rate: '88.1%' },
      { key: 8, city: '台州市', total: 76, level1: 11, level2: 31, level3: 34, handled: 66, rate: '86.8%' },
      { key: 9, city: '丽水市', total: 36, level1: 5, level2: 15, level3: 16, handled: 31, rate: '86.1%' },
      { key: 10, city: '舟山市', total: 24, level1: 4, level2: 10, level3: 10, handled: 21, rate: '87.5%' },
    ]
  }
  // tunnel
  return [
    { key: 1, city: '宁波市', total: 120, level1: 18, level2: 48, level3: 54, handled: 105, rate: '87.5%' },
    { key: 2, city: '温州市', total: 98, level1: 15, level2: 40, level3: 43, handled: 85, rate: '86.7%' },
    { key: 3, city: '绍兴市', total: 72, level1: 11, level2: 30, level3: 31, handled: 63, rate: '87.5%' },
    { key: 4, city: '湖州市', total: 52, level1: 8, level2: 22, level3: 22, handled: 45, rate: '86.5%' },
    { key: 5, city: '嘉兴市', total: 68, level1: 10, level2: 28, level3: 30, handled: 59, rate: '86.8%' },
    { key: 6, city: '金华市', total: 62, level1: 9, level2: 26, level3: 27, handled: 54, rate: '87.1%' },
    { key: 7, city: '衢州市', total: 46, level1: 7, level2: 19, level3: 20, handled: 40, rate: '87.0%' },
    { key: 8, city: '台州市', total: 82, level1: 12, level2: 34, level3: 36, handled: 72, rate: '87.8%' },
    { key: 9, city: '丽水市', total: 38, level1: 6, level2: 16, level3: 16, handled: 33, rate: '86.8%' },
    { key: 10, city: '舟山市', total: 26, level1: 4, level2: 11, level3: 11, handled: 23, rate: '88.5%' },
  ]
})

// 过滤后的汇总数据（简化版，暂不实现复杂过滤）
const filteredAlarmSummaryData = computed(() => {
  return alarmSummaryData.value
})

// 报警下钻明细列定义
const alarmDrillDownColumns: TableColumnsType = [
  { title: '市区县', dataIndex: 'area', key: 'area', width: 100 },
  { title: '设施名称', dataIndex: 'facName', key: 'facName', width: 120 },
  { title: '设备名称', dataIndex: 'devName', key: 'devName', width: 160 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 100 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 240 },
  { title: '报警开始时间', dataIndex: 'alarmTime', key: 'alarmTime', width: 160 },
  { title: '报警结束时间', dataIndex: 'alarmEndTime', key: 'alarmEndTime', width: 160 },
  { title: '预警值', dataIndex: 'alarmValue', key: 'alarmValue', width: 90 },
  { title: '预警等级', dataIndex: 'alarmLevel', key: 'alarmLevel', width: 100 },
  { title: '处置状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '处置完成时间', dataIndex: 'finishTime', key: 'finishTime', width: 160 },
  { title: '处置人', dataIndex: 'handler', key: 'handler', width: 80 },
]

// 报警下钻明细数据
const alarmDrillDownData = ref<any[]>([])

// 点击数字下钻处理函数
function handleAlarmDrillDown(record: any, type: string) {
  drillDownCity.value = record.city
  drillDownType.value = type
  
  // 根据图层、城市和下钻类型生成明细数据
  const layer = monitorLayer.value
  let data: any[] = []
  
  if (layer === 'road') {
    data = generateRoadAlarmData(record.city, type)
  } else if (layer === 'bridge') {
    data = generateBridgeAlarmData(record.city, type)
  } else {
    data = generateTunnelAlarmData(record.city, type)
  }
  
  alarmDrillDownData.value = data
  showAlarmDrillDownModal.value = true
  
  // 动态设置表单标签白色
  nextTick(() => {
    const labels = document.querySelectorAll('.alarm-drilldown-modal .ant-form-item-label > label')
    labels.forEach((label: any) => {
      label.style.color = '#fff'
      label.style.setProperty('color', '#fff', 'important')
    })
  })
}

// 生成道路报警数据
function generateRoadAlarmData(city: string, type: string): any[] {
  const baseData = [
    { area: `${city}XX区`, facName: `${city}XX路`, devName: `${city}XX路面设备`, monitorItem: '路面状况', pointName: 'Kx+xxx路面平整度监测点', alarmTime: '2026-4-25 15:30:00', alarmEndTime: '2026-4-25 16:00:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15', handler: '张伟' },
  ]
  
  // 根据下钻类型筛选数据
  if (type === 'level1') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '一级预警' }))
  } else if (type === 'level2') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '二级预警', alarmValue: -520.3 }))
  } else if (type === 'level3') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '三级预警', alarmValue: 2.15 }))
  } else if (type === 'handled') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, status: '已完成' }))
  } else {
    // total: 返回所有类型
    return [
      ...baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '一级预警' })),
      ...baseData.map((item, i) => ({ ...item, key: i + 10, alarmLevel: '二级预警', alarmValue: -520.3 })),
      ...baseData.map((item, i) => ({ ...item, key: i + 20, alarmLevel: '三级预警', alarmValue: 2.15 })),
    ]
  }
}

// 生成桥梁报警数据
function generateBridgeAlarmData(city: string, type: string): any[] {
  const baseData = [
    { area: `${city}XX区`, facName: `${city}XX大桥`, devName: `${city}XX应变设备`, monitorItem: '应变', pointName: 'XX-北侧应变·第X跨拱肋截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmEndTime: '2026-4-25 16:00:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15', handler: '张伟' },
  ]
  
  if (type === 'level1') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '一级预警' }))
  } else if (type === 'level2') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '二级预警', alarmValue: -520.3 }))
  } else if (type === 'level3') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '三级预警', alarmValue: 2.15 }))
  } else if (type === 'handled') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, status: '已完成' }))
  } else {
    return [
      ...baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '一级预警' })),
      ...baseData.map((item, i) => ({ ...item, key: i + 10, alarmLevel: '二级预警', alarmValue: -520.3 })),
      ...baseData.map((item, i) => ({ ...item, key: i + 20, alarmLevel: '三级预警', alarmValue: 2.15 })),
    ]
  }
}

// 生成隧道报警数据
function generateTunnelAlarmData(city: string, type: string): any[] {
  const baseData = [
    { area: `${city}XX区`, facName: `${city}XX隧道`, devName: `${city}XX位移设备`, monitorItem: '位移', pointName: 'XX-北侧位移·第X跨截面1/2等分点', alarmTime: '2026-4-25 15:30:00', alarmEndTime: '2026-4-25 16:00:00', alarmValue: -633.8, alarmLevel: '一级预警', status: '已完成', finishTime: '2026-4-25 15:49:15', handler: '张伟' },
  ]
  
  if (type === 'level1') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '一级预警' }))
  } else if (type === 'level2') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '二级预警', alarmValue: -520.3 }))
  } else if (type === 'level3') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '三级预警', alarmValue: 2.15 }))
  } else if (type === 'handled') {
    return baseData.map((item, i) => ({ ...item, key: i + 1, status: '已完成' }))
  } else {
    return [
      ...baseData.map((item, i) => ({ ...item, key: i + 1, alarmLevel: '一级预警' })),
      ...baseData.map((item, i) => ({ ...item, key: i + 10, alarmLevel: '二级预警', alarmValue: -520.3 })),
      ...baseData.map((item, i) => ({ ...item, key: i + 20, alarmLevel: '三级预警', alarmValue: 2.15 })),
    ]
  }
}

// 下钻明细筛选条件
interface DrillDownFilters {
  facilityName: string
  monitorItem: string
  handleStatus: string
}

const drillDownFilters = ref<DrillDownFilters>({
  facilityName: '',
  monitorItem: '',
  handleStatus: '',
})

function resetDrillDownFilters() {
  drillDownFilters.value = {
    facilityName: '',
    monitorItem: '',
    handleStatus: '',
  }
}

function handleDrillDownSearch() {
  // 搜索逻辑由computed自动处理
}

// 过滤后的下钻明细数据
const filteredDrillDownData = computed(() => {
  return alarmDrillDownData.value.filter(row => {
    if (drillDownFilters.value.facilityName && !row.facName.includes(drillDownFilters.value.facilityName)) return false
    if (drillDownFilters.value.monitorItem && row.monitorItem !== drillDownFilters.value.monitorItem) return false
    if (drillDownFilters.value.handleStatus && row.status !== drillDownFilters.value.handleStatus) return false
    return true
  })
})

// 获取下钻标题
function getDrillDownTitle(): string {
  const typeMap: Record<string, string> = {
    'total': '预警总数',
    'level1': '一级预警',
    'level2': '二级预警',
    'level3': '三级预警',
    'handled': '处置总数',
  }
  return typeMap[drillDownType.value] || ''
}

// 报警详情筛选条件
const cityDistrictMap: Record<string, string[]> = {
  '杭州市': ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
  '宁波市': ['海曙区', '江北区', '镇海区', '北仑区', '鄞州区', '奉化区', '余姚市', '慈溪市', '象山县', '宁海县'],
  '温州市': ['鹿城区', '龙湾区', '瓯海区', '洞头区', '瑞安市', '乐清市', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '龙港市'],
  '绍兴市': ['越城区', '柯桥区', '上虞区', '诸暨市', '嵊州市', '新昌县'],
  '湖州市': ['吴兴区', '南浔区', '德清县', '长兴县', '安吉县'],
  '嘉兴市': ['南湖区', '秀洲区', '海宁市', '平湖市', '桐乡市', '嘉善县', '海盐县'],
  '金华市': ['婺城区', '金东区', '义乌市', '东阳市', '永康市', '兰溪市', '浦江县', '武义县', '磐安县'],
  '衢州市': ['柯城区', '衢江区', '江山市', '龙游县', '常山县', '开化县'],
  '台州市': ['椒江区', '黄岩区', '路桥区', '临海市', '温岭市', '玉环市', '天台县', '仙居县', '三门县'],
  '丽水市': ['莲都区', '龙泉市', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁畲族自治县'],
  '舟山市': ['定海区', '普陀区', '岱山县', '泗县'],
}

const cityDistrictCascaderOptions = Object.keys(cityDistrictMap).map(city => ({
  value: city,
  label: city,
  children: cityDistrictMap[city].map(d => ({ value: d, label: d })),
}))

interface AlarmFilters {
  regionValue?: string[]
  facilityName: string
  deviceName: string
  monitorItem: string
  pointName: string
  alertLevel: string
  handleStatus: string
}

const alarmFilters = ref<AlarmFilters>({
  regionValue: undefined,
  facilityName: '',
  deviceName: '',
  monitorItem: '',
  pointName: '',
  alertLevel: '',
  handleStatus: '',
})

function resetAlarmFilters() {
  alarmFilters.value = {
    regionValue: undefined,
    facilityName: '',
    deviceName: '',
    monitorItem: '',
    pointName: '',
    alertLevel: '',
    handleStatus: '',
  }
}

function handleAlarmSearch() {
  // 搜索逻辑由computed自动处理
}

// 过滤后的报警数据
const filteredAlarmData = computed(() => {
  return alarmDetailData.value.filter(row => {
    const rv = alarmFilters.value.regionValue
    if (rv && rv[0] && !row.area.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.area.includes(rv[1])) return false
    if (alarmFilters.value.facilityName && !row.facName.includes(alarmFilters.value.facilityName)) return false
    if (alarmFilters.value.deviceName && !row.devName.includes(alarmFilters.value.deviceName)) return false
    if (alarmFilters.value.monitorItem && row.monitorItem !== alarmFilters.value.monitorItem) return false
    if (alarmFilters.value.pointName && !row.pointName.includes(alarmFilters.value.pointName)) return false
    if (alarmFilters.value.alertLevel && row.alarmLevel !== alarmFilters.value.alertLevel) return false
    if (alarmFilters.value.handleStatus && row.status !== alarmFilters.value.handleStatus) return false
    return true
  })
})

const C = (field: string, w?: number) => ({ title: '设市区', dataIndex: field, key: field, width: w || 80, fixed: 'left' as const })
const facilityColumns: Record<string, TableColumnsType> = {
  road: [C('city'), { title: '道路总长(km)', dataIndex: 'totalLength', key: 'totalLength' }, { title: '道路总面积(km²)', dataIndex: 'totalArea', key: 'totalArea' }, { title: '建成区面积(km²)', dataIndex: 'builtArea', key: 'builtArea' }, { title: '路网密度', dataIndex: 'density', key: 'density' }, { title: '道路面积率', dataIndex: 'areaRatio', key: 'areaRatio' }, { title: '快速路', children: [{ title: '道路长度(km)', dataIndex: 'expressway', key: 'expressway' }, { title: '路网密度', dataIndex: 'expresswayDensity', key: 'expresswayDensity' }] }, { title: '主干路', children: [{ title: '道路长度(km)', dataIndex: 'arterial', key: 'arterial' }, { title: '路网密度', dataIndex: 'arterialDensity', key: 'arterialDensity' }] }, { title: '次干路', children: [{ title: '道路长度(km)', dataIndex: 'collector', key: 'collector' }, { title: '路网密度', dataIndex: 'collectorDensity', key: 'collectorDensity' }] }, { title: '支路', children: [{ title: '道路长度(km)', dataIndex: 'local', key: 'local' }, { title: '路网密度', dataIndex: 'localDensity', key: 'localDensity' }] }],
  bridge: [C('city'), { title: '桥梁总数(座)', dataIndex: 'total', key: 'total' }, { title: '涉航桥梁总数', dataIndex: 'navigable', key: 'navigable' }, { title: '30年以上桥龄', dataIndex: 'oldBridge', key: 'oldBridge' }, { title: '特大桥', dataIndex: 'extraLarge', key: 'extraLarge' }, { title: '大桥', dataIndex: 'large', key: 'large' }, { title: '中桥', dataIndex: 'mediumBridge', key: 'mediumBridge' }, { title: '小桥', dataIndex: 'smallBridge', key: 'smallBridge' }, { title: '高架桥', dataIndex: 'viaduct', key: 'viaduct' }, { title: '立交桥', dataIndex: 'overpass', key: 'overpass' }, { title: '其他', dataIndex: 'other', key: 'other' }],
  tunnel: [C('city'), { title: '城市隧道总数(座)', dataIndex: 'total', key: 'total' }, { title: '城市道路隧道', dataIndex: 'roadTunnel', key: 'roadTunnel' }, { title: '人行地道', dataIndex: 'pedestrian', key: 'pedestrian' }, { title: '地下隧道', dataIndex: 'underground', key: 'underground' }, { title: '特长隧道', dataIndex: 'extraLong', key: 'extraLong' }, { title: '长隧道', dataIndex: 'longTunnel', key: 'longTunnel' }, { title: '中隧道', dataIndex: 'mediumTunnel', key: 'mediumTunnel' }, { title: '短隧道', dataIndex: 'shortTunnel', key: 'shortTunnel' }],
}
const facilityData = {
  road: ['杭州市','宁波市','温州市','绍兴市','湖州市','嘉兴市','金华市','衢州市','台州市','丽水市','舟山市'].map((c, i) => ({ key: i, city: c, totalLength: [1256,987,845,623,412,534,478,356,567,298,186][i], totalArea: [186.5,142.3,118.7,89.4,62.1,78.9,71.2,52.8,84.6,45.3,28.5][i], builtArea: [98.2,76.5,62.3,45.8,32.6,41.2,37.8,28.4,44.9,23.7,15.1][i], density: [8.5,7.2,6.8,6.1,5.4,5.9,5.6,4.8,6.2,4.5,3.8][i], areaRatio: [14.8,13.5,12.9,11.8,10.5,11.2,10.8,9.6,12.1,8.9,7.5][i]+'%', expressway: [156,124,98,78,52,68,62,45,72,38,24][i], expresswayDensity: [1.2,1.1,1.0,0.9,0.8,0.9,0.85,0.75,0.95,0.7,0.6][i], arterial: [423,334,286,212,142,182,164,123,194,102,64][i], arterialDensity: [3.2,2.8,2.6,2.3,2.0,2.2,2.1,1.8,2.4,1.7,1.4][i], collector: [356,278,238,176,116,152,136,102,162,84,52][i], collectorDensity: [2.7,2.3,2.1,1.9,1.6,1.8,1.7,1.5,1.9,1.4,1.2][i], local: [321,251,223,157,102,132,116,86,139,74,46][i], localDensity: [4.5,4.0,3.8,3.5,3.0,3.3,3.2,2.8,3.6,2.6,2.2][i] })),
  bridge: ['杭州市','宁波市','温州市','绍兴市','湖州市','嘉兴市','金华市','衢州市','台州市','丽水市','舟山市'].map((c, i) => ({ key: i, city: c, total: [567,423,389,256,178,234,198,145,267,123,87][i], navigable: [86,64,58,38,26,35,30,22,41,18,13][i], oldBridge: [124,92,85,56,38,52,44,32,58,27,19][i], extraLarge: [23,18,15,12,8,10,9,6,11,5,3][i], large: [89,67,58,42,28,38,32,24,45,19,14][i], mediumBridge: [142,108,95,68,47,60,50,38,72,33,23][i], smallBridge: [92,70,61,44,31,38,32,24,46,21,15][i], viaduct: [120,95,85,58,42,55,48,35,65,28,20][i], overpass: [101,65,75,44,30,43,34,26,53,22,15][i], other: [100,55,50,38,22,33,28,21,39,17,12][i] })),
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
  { key: 'mediumBridge' as const, name: '中桥', color: '#6dc8ec' },
    { key: 'smallBridge' as const, name: '小桥', color: '#e86452' },
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
  { name: '中桥', value: '1,420 座', num: 1420, color: '#6dc8ec' },
    { name: '小桥', value: '936 座', num: 936, color: '#e86452' },
  { name: '立交桥', value: '289 座', num: 289, color: '#5ad8a6' },
  { name: '高架桥', value: '567 座', num: 567, color: '#f6bd16' },
  { name: '其他', value: '495 座', num: 495, color: '#945fb9' },
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
    { title: '检查对象', dataIndex: 'road', width: 160 },
    { title: '检查项目', dataIndex: 'project', width: 130 },
    { title: '上报时间', dataIndex: 'reportTime', width: 150 },
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
    { title: '评估单元', dataIndex: 'road', width: 160 },
    { title: '检查项目', dataIndex: 'project', width: 130 },
    { title: '上报时间', dataIndex: 'reportTime', width: 150 },
    { title: '上报内容', dataIndex: 'reportContent', width: 150 },
    { title: '评估单位', dataIndex: 'entity', width: 200 },
    { title: '隐患等级', dataIndex: 'levelText', width: 100 },
    { title: '整改状态', dataIndex: 'status', width: 100 },
    { title: '整改完成时间', dataIndex: 'doneTime', width: 150 },
    { title: '整改人', dataIndex: 'handler', width: 100 },
  ],
}))

const hiddenDetailBase = [
  { area: '上城区', road: '石贯子巷', project: '道路设施', reportTime: '2026-01-10 09:30:00', content: '路面破损严重', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-15', handler: '张伟' },
  { area: '上城区', road: '中山中路', project: '道路照明设施', reportTime: '2026-01-15 14:20:00', content: '路灯不亮多处', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '环城北路', project: '道路设施', reportTime: '2026-01-22 10:45:00', content: '路面沉降严重', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '文三路', project: '道路照明设施', reportTime: '2026-02-05 16:10:00', content: '灯杆倾斜危险', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-02', handler: '李明' },
  { area: '滨江区', road: '江南大道', project: '道路设施', reportTime: '2026-02-12 08:55:00', content: '路面裂缝扩展', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-20', handler: '王芳' },
  { area: '上城区', road: '解放路', project: '道路照明设施', reportTime: '2026-02-18 11:30:00', content: '线路老化故障', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '莫干山路', project: '道路设施', reportTime: '2026-03-01 09:15:00', content: '路基塌陷风险', levelText: '重大隐患', status: '已整改', doneTime: '2026-05-10', handler: '陈强' },
  { area: '西湖区', road: '天目山路', project: '道路照明设施', reportTime: '2026-03-08 15:40:00', content: '灯具缺失严重', levelText: '一般隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '滨江区', road: '时代大道', project: '道路设施', reportTime: '2026-03-15 10:20:00', content: '人行道砖松动', levelText: '较大隐患', status: '已整改', doneTime: '2026-01-25', handler: '赵军' },
  { area: '上城区', road: '延安路', project: '道路照明设施', reportTime: '2026-03-22 14:05:00', content: '配电箱损坏', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '萧山区', road: '市心路', project: '道路设施', reportTime: '2026-04-02 08:30:00', content: '路面坑洼严重', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-08', handler: '刘洋' },
  { area: '余杭区', road: '文一西路', project: '道路照明设施', reportTime: '2026-04-10 16:45:00', content: '电缆破损漏电', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-15', handler: '周伟' },
  { area: '上城区', road: '清泰路', project: '道路设施', reportTime: '2026-04-18 09:50:00', content: '井盖缺失破损', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-18', handler: '吴静' },
  { area: '拱墅区', road: '大关路', project: '道路照明设施', reportTime: '2026-04-25 13:25:00', content: '灯臂锈蚀断裂', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '古翠路', project: '道路设施', reportTime: '2026-05-05 10:10:00', content: '路面沥青剥落', levelText: '一般隐患', status: '已整改', doneTime: '2026-05-22', handler: '孙磊' },
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
  { area: '上城区', road: '石贯子巷', project: '道路设施', reportContent: '路面破损严重，影响行车安全', reportTime: '2026-01-10 09:30:00', entity: '浙江安盛检测有限公司', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-15', handler: '张伟' },
  { area: '上城区', road: '中山中路', project: '道路照明设施', reportContent: '路灯不亮多处，夜间照明不足', reportTime: '2026-01-15 14:20:00', entity: '杭州市政工程检测中心', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '环城北路', project: '道路设施', reportContent: '路面沉降严重，存在安全隐患', reportTime: '2026-01-22 10:45:00', entity: '浙江中检工程技术有限公司', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '文三路', project: '道路照明设施', reportContent: '灯杆倾斜危险，存在倒伏风险', reportTime: '2026-02-05 16:10:00', entity: '杭州道桥检测有限公司', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-10', handler: '李明' },
  { area: '滨江区', road: '江南大道', project: '道路设施', reportContent: '路面裂缝扩展，需紧急处理', reportTime: '2026-02-12 08:55:00', entity: '浙江省建设工程质量检测站', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-25', handler: '王芳' },
  { area: '上城区', road: '解放路', project: '道路照明设施', reportContent: '线路老化故障，存在短路风险', reportTime: '2026-02-18 11:30:00', entity: '浙江安盛检测有限公司', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '拱墅区', road: '莫干山路', project: '道路设施', reportContent: '路基塌陷风险，影响通行安全', reportTime: '2026-03-01 09:15:00', entity: '杭州市政工程检测中心', levelText: '重大隐患', status: '已整改', doneTime: '2026-05-12', handler: '陈强' },
  { area: '西湖区', road: '天目山路', project: '道路照明设施', reportContent: '灯具缺失严重，照明效果差', reportTime: '2026-03-08 15:40:00', entity: '浙江中检工程技术有限公司', levelText: '一般隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '滨江区', road: '时代大道', project: '道路设施', reportContent: '人行道砖松动，行人通行不便', reportTime: '2026-03-15 10:20:00', entity: '杭州道桥检测有限公司', levelText: '较大隐患', status: '已整改', doneTime: '2026-01-28', handler: '赵军' },
  { area: '上城区', road: '延安路', project: '道路照明设施', reportContent: '配电箱损坏，存在漏电隐患', reportTime: '2026-03-22 14:05:00', entity: '浙江省建设工程质量检测站', levelText: '重大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '萧山区', road: '市心路', project: '道路设施', reportContent: '路面坑洼严重，车辆通行困难', reportTime: '2026-04-02 08:30:00', entity: '浙江安盛检测有限公司', levelText: '一般隐患', status: '已整改', doneTime: '2026-03-22', handler: '刘洋' },
  { area: '余杭区', road: '文一西路', project: '道路照明设施', reportContent: '电缆破损漏电，存在安全风险', reportTime: '2026-04-10 16:45:00', entity: '杭州市政工程检测中心', levelText: '较大隐患', status: '已整改', doneTime: '2026-04-18', handler: '周伟' },
  { area: '上城区', road: '清泰路', project: '道路设施', reportContent: '井盖缺失破损，行人安全隐患', reportTime: '2026-04-18 09:50:00', entity: '浙江中检工程技术有限公司', levelText: '一般隐患', status: '已整改', doneTime: '2026-02-15', handler: '吴静' },
  { area: '拱墅区', road: '大关路', project: '道路照明设施', reportContent: '灯臂锈蚀断裂，灯具脱落风险', reportTime: '2026-04-25 13:25:00', entity: '杭州道桥检测有限公司', levelText: '较大隐患', status: '待整改', doneTime: '-', handler: '-' },
  { area: '西湖区', road: '古翠路', project: '道路设施', reportContent: '路面沥青剥落，影响行车舒适', reportTime: '2026-05-05 10:10:00', entity: '浙江省建设工程质量检测站', levelText: '一般隐患', status: '已整改', doneTime: '2026-05-28', handler: '孙磊' },
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
  if (bridgeStatsChartRef.value) {
    bridgeStatsChart = echarts.init(bridgeStatsChartRef.value)
    updateBridgeStatsChart()
  }
  if (tunnelStatsChartRef.value) {
    tunnelStatsChart = echarts.init(tunnelStatsChartRef.value)
    updateTunnelStatsChart()
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
  // 道路统计卡片始终使用道路数据
  const cats = roadCategories
  
  let tooltipConfig: any = {
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
  
  statsChart.setOption({
    tooltip: tooltipConfig,
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      label: { show: false },
      data: cats.map(c => ({ name: c.name, value: c.num, itemStyle: { color: c.color } })),
    }],
  })
}

function updateBridgeStatsChart() {
  if (!bridgeStatsChart) return
  bridgeStatsChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}座 ({d}%)' },
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      label: { show: false },
      data: bridgeCategories.map(c => ({ name: c.name, value: c.num, itemStyle: { color: c.color } })),
    }],
  })
}

function updateTunnelStatsChart() {
  if (!tunnelStatsChart) return
  tunnelStatsChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}座 ({d}%)' },
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      label: { show: false },
      data: tunnelCategories.map(c => ({ name: c.name, value: c.num, itemStyle: { color: c.color } })),
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
  statsChart?.dispose(); bridgeStatsChart?.dispose(); tunnelStatsChart?.dispose(); riskChart?.dispose()
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
  if (val === 'overview') {
    nextTick(() => {
      setTimeout(initOverviewMap, 200)
    })
  }
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
watch(opsLayer, () => {
  initOpsMapOverlays()
  nextTick(() => updateOpsGradeChart())
})
watch(activeLayer, () => {
  bridgeDeviceDrillDown.value = false
  nextTick(() => {
    if (statsChart) { statsChart.dispose(); statsChart = null }
    if (bridgeStatsChart) { bridgeStatsChart.dispose(); bridgeStatsChart = null }
    if (tunnelStatsChart) { tunnelStatsChart.dispose(); tunnelStatsChart = null }
    if (statsChartRef.value) {
      statsChart = echarts.init(statsChartRef.value)
      updateStatsChart()
    }
    if (bridgeStatsChartRef.value) {
      bridgeStatsChart = echarts.init(bridgeStatsChartRef.value)
      updateBridgeStatsChart()
    }
    if (tunnelStatsChartRef.value) {
      tunnelStatsChart = echarts.init(tunnelStatsChartRef.value)
      updateTunnelStatsChart()
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
  padding: 0 16px; height: 40px; position: relative;
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
  position: absolute; left: 50%; transform: translateX(-50%);
  font-size: 18px; font-weight: 600; letter-spacing: 2px;
  background: linear-gradient(90deg, #5b8ff9, #5ad8a6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.cockpit-nav { display: flex; gap: 20px;
  .nav-link { font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; &:hover { color: #5b8ff9; } }
}

// 运维管理2子页签
.ops2-sub-tabs {
  display: flex;
  justify-content: center;
  gap: 2px;
  padding: 6px 16px;
  background: linear-gradient(90deg, #0d1f3c, #152d50, #0d1f3c);
  border-bottom: 1px solid rgba(100, 160, 255, 0.15);
  flex-shrink: 0;
  position: relative;
}

.ops2-sub-tab {
  padding: 5px 24px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  transition: all 0.2s;
  border: 1px solid transparent;
  
  &.active {
    background: rgba(91,143,249,0.2);
    color: #5b8ff9;
    font-weight: 600;
    border-color: rgba(91,143,249,0.4);
    box-shadow: 0 0 8px rgba(91,143,249,0.2);
  }
  
  &:hover:not(.active) {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.05);
  }
}

.ops2-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  
  .placeholder-content {
    font-size: 18px;
    color: rgba(255,255,255,0.3);
    letter-spacing: 2px;
  }
}

// ===== 病害处理页面样式 =====
.disease-body {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  height: calc(100vh - 100px);
  width: 100%;
  box-sizing: border-box;
}

.disease-card {
  flex: 1;
  min-width: 0;
  width: 33.333%;
  max-width: 33.333%;
  background: linear-gradient(180deg, rgba(10,25,50,0.98) 0%, rgba(5,15,35,0.98) 100%);
  border: 2px solid rgba(0,180,255,0.4);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00b4ff, transparent);
  }
}

.disease-card-header {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(180deg, rgba(0,180,255,0.15) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0,180,255,0.3);
  
  .header-deco {
    color: #00e5ff;
    font-size: 14px;
    text-shadow: 0 0 8px rgba(0,229,255,0.6);
  }
  
  .header-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(0,180,255,0.5);
  }
}

.disease-sub-tabs {
  display: flex;
  padding: 0 8px;
  background: rgba(0,20,40,0.6);
  border-bottom: 1px solid rgba(0,180,255,0.2);
  
  .sub-tab {
    flex: 1;
    text-align: center;
    padding: 8px 0;
    font-size: 13px;
    color: rgba(255,255,255,0.65);
    cursor: pointer;
    transition: all 0.3s;
    border-bottom: 2px solid transparent;
    
    &:hover {
      color: rgba(255,255,255,0.85);
      background: rgba(0,180,255,0.05);
    }
    
    &.active {
      color: #00e5ff;
      border-bottom-color: #00e5ff;
      background: rgba(0,180,255,0.1);
      font-weight: 600;
    }
  }
}

.sub-tab-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  
  .placeholder-text {
    color: rgba(255,255,255,0.4);
    font-size: 14px;
  }
}

.hazard-item {
  flex-direction: row;
  align-items: flex-start;
  
  .hazard-info {
    flex: 1;
    min-width: 0;
  }
}

.hazard-detail-btn {
  display: block;
  width: 100%;
  padding: 6px 0;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 4px;
  text-align: center;
  color: #fff;
  background: linear-gradient(90deg, #1565c0, #0d47a1);
  border: 1px solid rgba(33,150,243,0.5);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  box-sizing: border-box;
  
  &:hover {
    background: linear-gradient(90deg, #1976d2, #1565c0);
    box-shadow: 0 0 8px rgba(33,150,243,0.4);
  }
}

.hazard-level {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  
  &.level-一般隐患 {
    color: #52c41a;
    background: rgba(82,196,26,0.15);
    border: 1px solid rgba(82,196,26,0.3);
  }
  
  &.level-较大隐患 {
    color: #faad14;
    background: rgba(250,173,20,0.15);
    border: 1px solid rgba(250,173,20,0.3);
  }
  
  &.level-重大隐患 {
    color: #ff4d4f;
    background: rgba(255,77,79,0.15);
    border: 1px solid rgba(255,77,79,0.3);
  }
  
  &.level-优良 {
    color: #52c41a;
    background: rgba(82,196,26,0.15);
    border: 1px solid rgba(82,196,26,0.3);
  }
  
  &.level-合格 {
    color: #faad14;
    background: rgba(250,173,20,0.15);
    border: 1px solid rgba(250,173,20,0.3);
  }
  
  &.level-不合格 {
    color: #ff4d4f;
    background: rgba(255,77,79,0.15);
    border: 1px solid rgba(255,77,79,0.3);
  }
}

.risk-levels-row.three-level {
  .risk-level-item {
    flex: 1;
  }
}

.risk-levels-row.inspect-levels {
  .risk-level-item {
    flex: 1;
    padding: 6px 8px;
    border-radius: 4px;
    text-align: center;
    
    &.d-level {
      background: rgba(255,77,79,0.12);
      border: 1px solid rgba(255,77,79,0.3);
      .risk-count { color: #ff4d4f; }
    }
    &.e-level {
      background: rgba(250,173,20,0.12);
      border: 1px solid rgba(250,173,20,0.3);
      .risk-count { color: #faad14; }
    }
    &.unqualified {
      background: rgba(232,100,82,0.12);
      border: 1px solid rgba(232,100,82,0.3);
      .risk-count { color: #e86452; }
    }
  }
}

.risk-levels-row.two-level {
  .risk-level-item {
    flex: 1;
  }
}

.risk-bar-segment {
  &.d-level { background: linear-gradient(180deg, #ff4d4f, #cf1322); }
  &.e-level { background: linear-gradient(180deg, #faad14, #d48806); }
  &.unqualified { background: linear-gradient(180deg, #e86452, #b33b2e); }
  &.level1 { background: linear-gradient(180deg, #ff4d4f, #cf1322); }
  &.level2 { background: linear-gradient(180deg, #faad14, #d48806); }
  &.level3 { background: linear-gradient(180deg, #52c41a, #389e0d); }
}

.risk-level-item {
  &.level1 {
    background: rgba(255,77,79,0.12);
    border: 1px solid rgba(255,77,79,0.3);
    .risk-count { color: #ff4d4f; }
  }
  &.level2 {
    background: rgba(250,173,20,0.12);
    border: 1px solid rgba(250,173,20,0.3);
    .risk-count { color: #faad14; }
  }
  &.level3 {
    background: rgba(82,196,26,0.12);
    border: 1px solid rgba(82,196,26,0.3);
    .risk-count { color: #52c41a; }
  }
}

.alert-level {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  
  &.level-一级预警 {
    color: #ff4d4f;
    background: rgba(255,77,79,0.15);
    border: 1px solid rgba(255,77,79,0.3);
  }
  &.level-二级预警 {
    color: #faad14;
    background: rgba(250,173,20,0.15);
    border: 1px solid rgba(250,173,20,0.3);
  }
  &.level-三级预警 {
    color: #52c41a;
    background: rgba(82,196,26,0.15);
    border: 1px solid rgba(82,196,26,0.3);
  }
}

.monitor-item {
  flex-direction: row;
  align-items: flex-start;
  
  .monitor-info {
    flex: 1;
    min-width: 0;
  }
}

.inspect-grade {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 12px;
  
  &.grade-D级 {
    color: #ff4d4f;
    background: rgba(255,77,79,0.15);
    border: 1px solid rgba(255,77,79,0.3);
  }
  &.grade-E级 {
    color: #faad14;
    background: rgba(250,173,20,0.15);
    border: 1px solid rgba(250,173,20,0.3);
  }
  &.grade-不合格 {
    color: #e86452;
    background: rgba(232,100,82,0.15);
    border: 1px solid rgba(232,100,82,0.3);
  }
}

.inspect-item {
  .inspect-info {
    flex: 1;
    min-width: 0;
  }
  .case-action {
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
}

.disease-card-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 12px;
  box-sizing: border-box;
  min-width: 0;
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 10px;
  
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}

// 顶部指标+排名行
.disease-top-row {
  display: flex;
  gap: 12px;
  min-height: 240px;
}

.disease-metrics {
  min-width: 130px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-item {
  .metric-label {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 2px;
  }
  
  .metric-value {
    .num {
      font-size: 22px;
      font-weight: 700;
      color: #00e5ff;
      font-family: 'DIN', 'Arial', sans-serif;
    }
    .unit {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      margin-left: 2px;
    }
  }
  
  .metric-value.large .num {
    font-size: 26px;
    color: #00e5ff;
  }
  
  .metric-value.rate .num {
    color: #00e676;
  }
  
  .metric-value.timely .num {
    color: #ff9800;
  }
}

// 地市排名
.disease-ranking {
  flex: 1;
  min-width: 0;
  
  .ranking-title {
    font-size: 12px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 6px;
  }
  
  .ranking-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px 12px;
  }
  
  .ranking-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    
    .rank-badge {
      display: inline-block;
      min-width: 42px;
      padding: 1px 6px;
      border-radius: 3px;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      text-align: center;
      background: rgba(0,180,255,0.3);
      
      &.rank-1 { background: #f44336; }
      &.rank-2 { background: #ff9800; }
      &.rank-3 { background: #2196f3; }
    }
    
    .rank-city {
      color: rgba(255,255,255,0.8);
      flex: 1;
    }
    
    .rank-rate {
      color: #00e5ff;
      font-weight: 600;
    }
  }
}

// 风险分析统计图
.disease-risk-section {
  border: 1px solid rgba(0,180,255,0.2);
  border-radius: 8px;
  padding: 10px 12px;
  background: rgba(0,20,40,0.5);
}

.risk-section-title {
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 2px;
  
  .title-deco {
    color: #00e5ff;
    font-size: 12px;
    margin: 0 8px;
  }
}

.risk-levels-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.risk-level-item {
  text-align: center;
  
  .risk-label {
    display: block;
    font-size: 11px;
    margin-bottom: 2px;
  }
  
  .risk-count {
    display: block;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
  }
  
  &.major .risk-label { color: #f44336; }
  &.larger .risk-label { color: #ff9800; }
  &.general .risk-label { color: #ffc107; }
  &.minor .risk-label { color: #4caf50; }
}

.risk-bar-track {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
}

.risk-bar-segment {
  height: 100%;
  transition: width 0.3s;
  
  &.major { background: #f44336; }
  &.larger { background: #ff9800; }
  &.general { background: #ffc107; }
  &.minor { background: #4caf50; }
}

// 重大案卷列表
.disease-case-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.case-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.case-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .case-diamond {
    color: #00e5ff;
    font-size: 14px;
  }
  
  .case-title-text {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }
}

.case-filters {
  display: flex;
  align-items: center;
  gap: 6px;
  
  .case-filter-tab {
    font-size: 11px;
    padding: 3px 10px;
    border-radius: 3px;
    color: rgba(255,255,255,0.6);
    cursor: pointer;
    border: 1px solid rgba(255,255,255,0.15);
    background: transparent;
    transition: all 0.2s;
    
    &.active {
      color: #fff;
      background: rgba(0,180,255,0.3);
      border-color: rgba(0,180,255,0.5);
    }
  }
  
  .case-province-select {
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 3px;
    background: rgba(0,180,255,0.2);
    color: #fff;
    border: 1px solid rgba(0,180,255,0.4);
    outline: none;
    
    option {
      background: #0a1929;
      color: #fff;
    }
  }
}

.case-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.case-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(0,30,60,0.6);
  border: 1px solid rgba(0,180,255,0.2);
  border-radius: 6px;
  
  .hazard-right {
    flex-shrink: 0;
    width: 130px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    margin-left: 10px;
  }
  
  .hazard-photo {
    height: 90px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(0,180,255,0.3);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

.case-thumb {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(0,0,0,0.3);
  
  .thumb-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: linear-gradient(135deg, rgba(0,60,120,0.5), rgba(0,30,60,0.8));
  }
}

.case-info {
  flex: 1;
  min-width: 0;
  
  .case-info-row {
    font-size: 11px;
    line-height: 1.6;
    color: rgba(255,255,255,0.7);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    .info-label {
      color: rgba(255,255,255,0.4);
    }
  }
}

.status-pending {
  color: #ff9800;
}

.case-action {
  flex-shrink: 0;
  align-self: center;
  
  .detail-btn {
    padding: 4px 16px;
    font-size: 12px;
    color: #fff;
    background: linear-gradient(90deg, #1565c0, #0d47a1);
    border: 1px solid rgba(33,150,243,0.5);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: linear-gradient(90deg, #1976d2, #1565c0);
    }
  }
}

.case-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(255,255,255,0.08);
  
  .pagination-info {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
  }
  
  .pagination-btns {
    display: flex;
    gap: 4px;
    
    .page-btn {
      width: 24px;
      height: 24px;
      font-size: 12px;
      color: rgba(255,255,255,0.6);
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 3px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.active {
        color: #fff;
        background: rgba(0,180,255,0.3);
        border-color: rgba(0,180,255,0.5);
      }
    }
  }
}

.cockpit-body {
  flex: 1; display: grid; grid-template-columns: 440px 1fr 440px;
  gap: 8px; padding: 8px; min-height: 0; overflow: hidden;
}
.panel { display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden; }
.panel-left { display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden; }
.panel-right { display: grid; grid-template-rows: 1fr 1fr 1fr; gap: 8px; min-height: 0; overflow: hidden; }

.dark-card {
  background: linear-gradient(180deg, rgba(13,31,60,0.95), rgba(10,22,40,0.98));
  border: 1px solid rgba(100,160,255,0.12); border-radius: 8px; padding: 10px;
}
.stat-card-compact {
  flex: 1; min-height: 0; overflow: auto;
}
.card-title {
  font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9);
  margin-bottom: 6px; padding-left: 10px; border-left: 3px solid #5b8ff9;
}
.card-title-row {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  .card-title { margin-bottom: 0; }
}

.card-title-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.risk-hint-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 4px;
}

.risk-hint-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  font-size: 11px;
  color: #f6bd16;
  border: 1px solid rgba(246, 189, 22, 0.4);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(246, 189, 22, 0.12);
    border-color: #f6bd16;
    color: #f6bd16;
  }
}

.risk-hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 11px;
  height: 11px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: #f6bd16;
  border-radius: 50%;
}

/* 道路统计 */
.road-stats { margin-bottom: 12px; }
.road-stats.compact { margin-bottom: 8px; }
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
.road-detail.compact { gap: 8px; }
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

.facility-list-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 8px 10px 4px;
  .card-title { font-size: 13px; font-weight: 700; color: #e0e8f0; margin-bottom: 2px; }
}
.facility-list-scroll {
  overflow-y: auto; flex: 1;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(100,160,255,0.3); border-radius: 3px; }
}
.facility-table {
  width: 100%; border-collapse: collapse; font-size: 10px;
  th { background: rgba(30,60,100,0.5); color: rgba(255,255,255,0.7); padding: 5px 3px; text-align: center; font-weight: 600; position: sticky; top: 0; z-index: 1; white-space: nowrap; }
  td { padding: 7px 3px; text-align: center; color: rgba(255,255,255,0.85); border-bottom: 1px solid rgba(100,160,255,0.08); white-space: nowrap; }
  tbody tr:hover { background: rgba(91,143,249,0.1); }
  tbody tr.row-selected { background: rgba(91,143,249,0.25) !important; }
}
.grade-tag-A { color: #5ad8a6; font-weight: 600; }
.grade-tag-B { color: #5b8ff9; font-weight: 600; }
.grade-tag-C { color: #f6bd16; font-weight: 600; }
.grade-tag-D { color: #e86452; font-weight: 600; }
.grade-tag-E { color: #945fb9; font-weight: 600; }
.overdue-yes { color: #e86452; font-weight: 600; }
.overdue-no { color: #5ad8a6; }
.op-link { color: #5b8ff9; cursor: pointer; text-decoration: underline; }

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
  :deep(.ant-form-item) {
    margin-bottom: 8px;
  }
  :deep(.ant-form-item-label > label) {
    color: #fff !important;
  }
  :deep(.ant-input), :deep(.ant-select-selector), :deep(.ant-cascader-picker) {
    background: rgba(255,255,255,0.08) !important;
    border-color: rgba(100,160,255,0.2) !important;
    color: rgba(255,255,255,0.75) !important;
    height: 30px !important;
    .ant-input::placeholder { color: rgba(255,255,255,0.35) !important; }
    .ant-select-selection-placeholder { color: rgba(255,255,255,0.35) !important; }
    .ant-select-selection-item { color: rgba(255,255,255,0.75) !important; }
  }
  :deep(.ant-input:hover), :deep(.ant-select-selector:hover), :deep(.ant-cascader-picker:hover) {
    border-color: #5b8ff9 !important;
  }
  :deep(.ant-btn) {
    background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75);
    border-color: rgba(100,160,255,0.2); height: 30px;
    &:hover { background: rgba(255,255,255,0.12); border-color: #5b8ff9; }
    &.ant-btn-primary { background: #5b8ff9; border-color: #5b8ff9; color: #fff;
      &:hover { background: #4a7de8; border-color: #4a7de8; }
    }
  }
}

.device-detail-modal, .alarm-detail-modal, .risk-detail-modal, .road-device-detail-modal, .bridge-device-detail-modal, .tunnel-device-detail-modal, .alarm-drilldown-modal, .facility-modal {
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
  
  // 筛选项美化排列
  .modal-filter-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px 16px;
    margin-bottom: 12px;
    
    .filter-item {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .filter-label {
        color: #fff;
        font-size: 13px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      .filter-select,
      .filter-input {
        flex: 1;
        min-width: 0;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(100,160,255,0.2);
        border-radius: 4px;
        color: #fff;
        height: 30px;
        padding: 0 10px;
        font-size: 13px;
        outline: none;
        transition: all 0.3s;
        
        &::placeholder {
          color: rgba(255,255,255,0.35);
        }
        
        &:hover,
        &:focus {
          border-color: #5b8ff9;
          background: rgba(255,255,255,0.12);
        }
        
        option {
          background: #0d1f3c;
          color: #fff;
        }
      }
    }
  }
  
  // 表单标签白色
  :deep(.ant-form-item-label > label) {
    color: #fff !important;
  }
  
  // 设备列表筛选区横向排列样式
  &.device-detail-modal {
    .device-filter-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
      
      .filter-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .filter-label {
          color: rgba(255,255,255,0.85);
          font-size: 13px;
          white-space: nowrap;
        }
        
        .filter-select,
        .filter-input {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(100,160,255,0.2);
          border-radius: 4px;
          color: rgba(255,255,255,0.75);
          height: 30px;
          padding: 0 12px;
          font-size: 13px;
          outline: none;
          transition: all 0.3s;
          
          &::placeholder {
            color: rgba(255,255,255,0.35);
          }
          
          &:hover,
          &:focus {
            border-color: #5b8ff9;
            background: rgba(255,255,255,0.12);
          }
          
          option {
            background: #0d1f3c;
            color: rgba(255,255,255,0.75);
          }
        }
        
        .filter-select {
          min-width: 140px;
        }
        
        .filter-input {
          min-width: 160px;
        }
      }
    }
  }
  
  :deep(.ant-select-dropdown), :deep(.ant-cascader-menus) {
    background: #0d1f3c !important;
    border-color: rgba(100,160,255,0.2) !important;
    .ant-select-item, .ant-cascader-menu-item {
      color: rgba(255,255,255,0.75) !important;
      &:hover { background: rgba(91,143,249,0.12) !important; }
      &.ant-select-item-active, &.ant-cascader-menu-item-active { background: rgba(91,143,249,0.15) !important; }
      &.ant-select-item-selected, &.ant-cascader-menu-item-selected { color: #5b8ff9 !important; }
    }
  }
  .ant-cascader {
    .ant-select-selector {
      background: rgba(255,255,255,0.08) !important;
      border-color: rgba(100,160,255,0.2) !important;
      color: rgba(255,255,255,0.75) !important;
      height: 30px !important;
      .ant-select-selection-placeholder { color: rgba(255,255,255,0.35) !important; }
      .ant-select-selection-item { color: rgba(255,255,255,0.75) !important; }
    }
    &:hover .ant-select-selector { border-color: #5b8ff9 !important; }
  }
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

// 运维管理页面样式
.ops-body {
  grid-template-columns: 400px 1fr 400px !important;
}
.ops-left { display: flex; flex-direction: column; gap: 8px; }
.ops-center { display: flex; flex-direction: column; gap: 8px; }
.ops-right { display: flex; flex-direction: column; gap: 8px; }
.ops-card {
  flex: 1; display: flex; flex-direction: column; overflow: hidden;
  padding: 12px 14px;
}
.ops-metrics {
  display: flex; gap: 12px; margin-bottom: 8px;
}
.ops-metrics-sub {
  margin-top: 4px; margin-bottom: 4px;
  .ops-metric-item { padding: 4px 0; }
  .ops-metric-val { font-size: 16px; }
}
.ops-metric-item {
  flex: 1; text-align: center; padding: 6px 0;
  background: rgba(91,143,249,0.06); border-radius: 4px;
}
.ops-metric-val {
  font-size: 20px; font-weight: 600; line-height: 1.2;
  &.blue { color: #5b8ff9; }
  &.green { color: #5ad8a6; }
  &.cyan { color: #5ad8a6; }
  &.yellow { color: #f6bd16; }
  &.red { color: #e86452; }
  &.orange { color: #f6bd16; }
}
.rate-high { color: #5ad8a6; font-weight: 600; }
.rate-mid { color: #f6bd16; font-weight: 600; }
.rate-low { color: #e86452; font-weight: 600; }
.ops-metric-label {
  font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px;
}
.ops-chart {
  height: 120px; margin-bottom: 8px;
}
.ops-expiring-chart {
  height: 60px; margin-bottom: 8px;
}
.ops-grade-chart {
  height: 100px; margin-top: 4px; margin-bottom: 4px;
}
.ops-list {
  flex: 1; overflow: hidden; display: flex; flex-direction: column;
}
.ops-list-header {
  display: flex; gap: 4px; padding: 6px 4px;
  background: rgba(91,143,249,0.08); border-radius: 3px;
  font-size: 11px; color: rgba(255,255,255,0.5);
  span { flex: 1; text-align: center; }
  .ops-col-area { flex: 0.7; }
  .ops-col-total { flex: 0.8; }
  .ops-col-done { flex: 0.8; }
  .ops-col-hiddentotal { flex: 0.8; }
  .ops-col-fixed { flex: 0.8; }
  .ops-col-rate { flex: 0.7; }
  .ops-col-inspect-name { flex: 1.3; }
  .ops-col-inspect-time { flex: 0.9; }
  .ops-col-inspect-type { flex: 0.7; }
  .ops-col-name { flex: 1; }
  .ops-col-grade { flex: 0.5; }
  .ops-col-rectype { flex: 0.9; }
  .ops-col-status { flex: 0.7; }
  .ops-col-donetime { flex: 0.9; }
  .ops-col-aftergrade { flex: 0.5; }
}
.ops-list-body {
  flex: 1; overflow-y: auto;
}
.ops-list-row {
  display: flex; gap: 4px; padding: 5px 4px;
  border-bottom: 1px solid rgba(100,160,255,0.06);
  font-size: 11px; color: rgba(255,255,255,0.7);
  span { flex: 1; text-align: center; }
  .ops-col-area { flex: 0.7; }
  .ops-col-total { flex: 0.8; }
  .ops-col-done { flex: 0.8; }
  .ops-col-hiddentotal { flex: 0.8; }
  .ops-col-fixed { flex: 0.8; }
  .ops-col-rate { flex: 0.7; }
  .ops-col-inspect-name { flex: 1.3; }
  .ops-col-inspect-time { flex: 0.9; }
  .ops-col-inspect-type { flex: 0.7; }
  .ops-col-name { flex: 1; }
  .ops-col-grade { flex: 0.5; }
  .ops-col-rectype { flex: 0.9; }
  .ops-col-status { flex: 0.7; }
  .ops-col-donetime { flex: 0.9; }
  .ops-col-aftergrade { flex: 0.5; }
  &:hover { background: rgba(91,143,249,0.04); }
}

// 风险隐患表和提示单弹窗样式
.risk-hint-modal {
  .ant-modal-content {
    background: #1a2332;
    border: 1px solid rgba(91,143,249,0.2);
    color: rgba(255,255,255,0.85);
  }
  .ant-modal-header {
    background: #1a2332;
    border-bottom: 1px solid rgba(91,143,249,0.15);
    .ant-modal-title { color: rgba(255,255,255,0.9); }
  }
  .ant-modal-close {
    color: rgba(255,255,255,0.5);
    &:hover { color: #fff; }
  }
}

.risk-hint-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(91,143,249,0.15);
  align-items: center;
}

.risk-hint-download {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  margin-left: auto;
  margin-right: 8px;
  font-size: 12px;
  color: #5b8ff9;
  border: 1px solid rgba(91,143,249,0.4);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { background: rgba(91,143,249,0.12); border-color: #5b8ff9; }
  .download-icon { font-size: 13px; }
}

.risk-hint-tab {
  flex: 1;
  padding: 10px 16px;
  text-align: center;
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  &:hover { color: rgba(255,255,255,0.85); }
  &.active {
    color: #5b8ff9;
    border-bottom-color: #5b8ff9;
    font-weight: 600;
  }
}

.risk-hint-content {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 4px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(91,143,249,0.3); border-radius: 2px; }
}

.risk-hint-section {
  margin-bottom: 16px;
  border: 1px solid rgba(91,143,249,0.12);
  border-radius: 6px;
  overflow: hidden;
  &:last-child { margin-bottom: 0; }
}

.risk-hint-section-title {
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #5b8ff9;
  background: rgba(91,143,249,0.08);
  border-bottom: 1px solid rgba(91,143,249,0.1);
}

.risk-hint-section-body {
  padding: 10px 14px;
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.8;
    color: rgba(255,255,255,0.75);
  }
  strong {
    color: rgba(255,255,255,0.95);
    font-weight: 600;
    margin: 0 2px;
  }
  .text-red { color: #e86452; }
  .text-orange { color: #f6bd16; }
  .text-green { color: #5ad8a6; }
}

// ===== 运维管理2样式 =====
.cockpit-body.ops2-body {
  display: flex;
  grid-template-columns: none;
  gap: 12px;
  padding: 10px 12px;
  height: calc(100vh - 100px);
  width: 100%;
  box-sizing: border-box;
}

.ops2-card {
  flex: 1;
  min-width: 0;
  width: 33.333%;
  max-width: 33.333%;
  background: linear-gradient(180deg, rgba(10,25,50,0.98) 0%, rgba(5,15,35,0.98) 100%);
  border: 2px solid rgba(0,180,255,0.4);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #00b4ff, transparent);
  }
}

.ops2-card-header {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(180deg, rgba(0,180,255,0.15) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0,180,255,0.3);
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00b4ff);
  }
  
  &::before {
    left: 20px;
  }
  
  &::after {
    right: 20px;
    transform: scaleX(-1);
  }
  
  .header-icon {
    color: #00e5ff;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(0,229,255,0.6);
  }
  
  .header-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(0,180,255,0.5);
  }
}

.ops2-card-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 12px;
  box-sizing: border-box;
  min-width: 0;
  display: grid;
  grid-template-rows: 260px 250px 1fr;
  gap: 8px;
  align-content: start;
}

.ops2-header {
  padding: 10px 12px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(90deg, rgba(91,143,249,0.25) 0%, transparent 100%);
  border-bottom: 2px solid rgba(91,143,249,0.4);
  text-align: center;
  letter-spacing: 2px;
}

.ops2-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.ops2-section {
  min-width: 0;
  overflow-y: auto;
  &:nth-child(1) { height: 260px; }
  &:nth-child(2) { height: 250px; }
  &:nth-child(3) { flex: 1; min-height: 0; }
}

// 隐患排查页签：2个 section布局（排查情况 + 设区市数据统计）
.ops2-card.hazard-layout .ops2-card-content {
  grid-template-rows: 190px 1fr;
}
.ops2-card.hazard-layout .ops2-section {
  overflow-y: hidden;
  &:nth-child(1) { height: 190px; }
  &:nth-child(2) { height: auto; }
}

// 安全评估页签：2个 section布局（评估情况 + 设区市数据统计）
.ops2-card.assess-layout .ops2-card-content {
  grid-template-rows: 255px 1fr;
}
.ops2-card.assess-layout .ops2-section {
  overflow-y: hidden;
  &:nth-child(1) { height: 255px; }
  &:nth-child(2) { height: auto; }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding: 6px 10px;
  background: linear-gradient(90deg, rgba(0,180,255,0.1) 0%, transparent 100%);
  border-left: 3px solid #00b4ff;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,180,255,0.3), transparent);
  }
  
  .section-arrow {
    color: #00e5ff;
    font-size: 12px;
    text-shadow: 0 0 6px rgba(0,229,255,0.5);
  }
  
  .section-diamond {
    color: #f6bd16;
    font-size: 14px;
    text-shadow: 0 0 6px rgba(246,189,22,0.5);
  }
  
  .section-name {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
  }
}

.ops2-table-wrapper {
  width: 100%;
  overflow: hidden;
  min-width: 0;
  background: rgba(0,20,40,0.3);
  border-radius: 6px;
}

// 隐患排查页签样式
.ops2-view-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
}

.ops2-view-tab {
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  color: rgba(255,255,255,0.5);
  transition: all 0.2s;
  border: 1px solid transparent;
  
  &.active {
    background: rgba(91,143,249,0.2);
    color: #5b8ff9;
    font-weight: 600;
    border-color: rgba(91,143,249,0.4);
  }
  
  &:hover:not(.active) {
    color: rgba(255,255,255,0.8);
    background: rgba(255,255,255,0.05);
  }
}

// 横向柱状图样式
.ops2-chart-wrapper {
  width: 100%;
  min-width: 0;
}

.bar-chart-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 380px;
  overflow-y: auto;
  padding-right: 4px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
}

.bar-label {
  width: 50px;
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-align: right;
}

.bar-group {
  flex: 1;
  display: flex;
  height: 18px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.bar-item {
  height: 100%;
  transition: width 0.3s ease;
  
  &.completed {
    background: linear-gradient(90deg, #52c41a, #73d13d);
  }
  
  &.incomplete {
    background: linear-gradient(90deg, #5b8ff9, #7caaf7);
  }
  
  &.overdue {
    background: linear-gradient(90deg, #ffeb3b, #fff176);
  }
}

.bar-value {
  width: 40px;
  flex-shrink: 0;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  text-align: left;
}

.bar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  
  &.completed {
    background: linear-gradient(90deg, #52c41a, #73d13d);
  }
  
  &.incomplete {
    background: linear-gradient(90deg, #5b8ff9, #7caaf7);
  }
  
  &.overdue {
    background: linear-gradient(90deg, #ffeb3b, #fff176);
  }
}

.ops2-table-wrapper {
  border: 1px solid rgba(0,180,255,0.2);
}

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: #5b8ff9;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid #5b8ff9;
}

.inspection-row {
  display: flex;
  gap: 8px;
  min-width: 0;
  
  &.single {
    .inspection-item {
      flex: none;
      width: 100%;
    }
  }
}

.inspection-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: linear-gradient(135deg, rgba(0,180,255,0.08) 0%, rgba(0,180,255,0.03) 100%);
  border-radius: 8px;
  border: 1px solid rgba(0,180,255,0.2);
  min-width: 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00b4ff, transparent);
  }
}

.item-icon-box {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0,180,255,0.2) 0%, rgba(0,180,255,0.1) 100%);
  border-radius: 10px;
  border: 2px solid rgba(0,229,255,0.4);
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(0,180,255,0.3), inset 0 0 8px rgba(0,180,255,0.1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(0,229,255,0.3), transparent);
    z-index: -1;
  }
  
  &.warning {
    background: linear-gradient(135deg, rgba(246,189,22,0.2) 0%, rgba(246,189,22,0.1) 100%);
    border-color: rgba(255,235,59,0.4);
    box-shadow: 0 0 12px rgba(246,189,22,0.3), inset 0 0 8px rgba(246,189,22,0.1);
    
    &::before {
      background: linear-gradient(135deg, rgba(255,235,59,0.3), transparent);
    }
  }
  
  svg {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 0 4px currentColor);
  }
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.item-label {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 6px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.item-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  font-family: 'Courier New', monospace;
  &.highlight { 
    color: #00e5ff;
    text-shadow: 0 0 8px rgba(0,229,255,0.5);
  }
  &.warning { 
    color: #f6bd16;
    text-shadow: 0 0 8px rgba(246,189,22,0.5);
  }
  &.digital {
    font-family: 'Courier New', monospace;
    letter-spacing: 6px;
    color: #00e5ff;
    text-shadow: 0 0 10px rgba(0,229,255,0.6);
    background: linear-gradient(180deg, rgba(0,180,255,0.15) 0%, rgba(0,180,255,0.05) 100%);
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid rgba(0,180,255,0.3);
    display: inline-block;
  }
  .unit {
    font-size: 13px;
    margin-left: 6px;
    opacity: 0.85;
    font-weight: 500;
  }
}

.grade-stats {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.ring-chart-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  min-width: 0;
}

.ring-chart {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: conic-gradient(#5b8ff9 0% 49.97%, #5ad8a6 49.97% 97.84%, #f6bd16 97.84% 99.14%, rgba(255,255,255,0.3) 99.14% 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0,180,255,0.3), inset 0 0 15px rgba(0,180,255,0.2);
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 2px solid rgba(0,180,255,0.4);
    box-shadow: 0 0 10px rgba(0,180,255,0.3);
  }
  
  .ring-center {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(180deg, rgba(10,25,50,0.98) 0%, rgba(5,15,35,0.98) 100%);
    border: 2px solid rgba(0,180,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 11px;
    color: rgba(255,255,255,0.85);
    line-height: 1.4;
    font-weight: 600;
    box-shadow: inset 0 0 10px rgba(0,180,255,0.2);
  }
}

// 道路环形图 - ABCD四色
.road-ring {
  background: conic-gradient(
    #5b8ff9 0% 49.97%,
    #5ad8a6 49.97% 97.84%,
    #f6bd16 97.84% 99.14%,
    #e86452 99.14% 100%
  );
}

// 桥梁环形图 - ABCDE五色
.bridge-ring {
  background: conic-gradient(
    #5b8ff9 0% 44.89%,
    #5ad8a6 44.89% 93.23%,
    #f6bd16 93.23% 99.46%,
    #e86452 99.46% 100%,
    #945fb9 100% 100%
  );
}

// 隧道环形图 - ABCDE五色
.tunnel-ring {
  background: conic-gradient(
    #5b8ff9 0% 50.41%,
    #5ad8a6 50.41% 84.02%,
    #f6bd16 84.02% 100%,
    #e86452 100% 100%
  );
}

.ring-labels {
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  .label-item {
    font-size: 11px;
    color: rgba(255,255,255,0.85);
    display: flex;
    align-items: center;
    gap: 6px;
    
    .label-dot {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      box-shadow: 0 0 4px currentColor;
      &.a { background: #5b8ff9; }
      &.b { background: #5ad8a6; }
      &.c { background: #f6bd16; }
      &.d { background: #e86452; }
      &.e { background: #945fb9; }
      &.pass { background: #52c41a; }
      &.fail { background: #ff4d4f; }
      &.i { background: #5b8ff9; }
      &.ii { background: #5ad8a6; }
      &.iii { background: #f6bd16; }
    }
  }
}

.ring-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  gap: 6px;
  
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    box-shadow: 0 0 4px currentColor;
    &.a { background: #5b8ff9; }
    &.b { background: #5ad8a6; }
    &.c { background: #f6bd16; }
    &.i { background: #5b8ff9; }
    &.ii { background: #5ad8a6; }
    &.iii { background: #f6bd16; }
  }
}

.grade-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  overflow-y: auto;
}

.grade-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  background: linear-gradient(90deg, rgba(0,180,255,0.08) 0%, transparent 100%);
  border-radius: 4px;
  border-left: 2px solid rgba(0,180,255,0.3);
  font-size: 11px;
  color: rgba(255,255,255,0.85);
  
  .grade-label {
    font-weight: 600;
    color: #fff;
  }
  
  .grade-value {
    color: #00e5ff;
    font-weight: 700;
    text-shadow: 0 0 4px rgba(0,229,255,0.4);
  }
}

// 环形图悬浮提示框
.ring-tooltip {
  position: fixed;
  z-index: 9999;
  background: linear-gradient(135deg, rgba(10,30,60,0.96) 0%, rgba(5,15,40,0.96) 100%);
  border: 1px solid rgba(0,180,255,0.5);
  border-radius: 8px;
  padding: 14px 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(0,180,255,0.2);
  backdrop-filter: blur(10px);
  min-width: 220px;
  pointer-events: auto;
  animation: tooltipFadeIn 0.2s ease;
  
  .tooltip-title {
    font-size: 14px;
    font-weight: 700;
    color: #00e5ff;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0,180,255,0.3);
    text-shadow: 0 0 6px rgba(0,229,255,0.4);
  }
  
  .tooltip-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    font-size: 12px;
    color: rgba(255,255,255,0.9);
    
    .tooltip-dot {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      flex-shrink: 0;
      box-shadow: 0 0 4px currentColor;
    }
    
    .tooltip-label {
      flex: 1;
      font-weight: 600;
    }
    
    .tooltip-value {
      color: #00e5ff;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }
}

@keyframes tooltipFadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.ops2-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  table-layout: fixed;
  min-width: 0;
  
  thead {
    tr {
      height: 52px;
    }
    th {
      padding: 6px 4px;
      background: linear-gradient(180deg, rgba(0,180,255,0.2) 0%, rgba(0,180,255,0.1) 100%);
      color: #fff;
      font-weight: 700;
      border: 1px solid rgba(0,180,255,0.3);
      text-align: center;
      white-space: normal;
      word-break: break-all;
      line-height: 1.2;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      text-shadow: 0 0 4px rgba(0,180,255,0.3);
    }
  }
  
  tbody {
    td {
      padding: 5px 4px;
      text-align: center;
      border: 1px solid rgba(0,180,255,0.15);
      color: rgba(255,255,255,0.9);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: rgba(0,30,60,0.2);
    }
    
    tr:nth-child(even) {
      td {
        background: rgba(0,40,80,0.25);
      }
    }
    
    .total-row {
      td {
        background: linear-gradient(90deg, rgba(0,180,255,0.15) 0%, rgba(0,180,255,0.05) 100%);
        font-weight: 700;
        color: #fff;
        text-shadow: 0 0 4px rgba(0,180,255,0.3);
      }
    }
  }
}

// 滚动条样式
.ops2-content::-webkit-scrollbar {
  width: 6px;
}

.ops2-content::-webkit-scrollbar-track {
  background: rgba(91,143,249,0.1);
  border-radius: 3px;
}

.ops2-content::-webkit-scrollbar-thumb {
  background: rgba(91,143,249,0.3);
  border-radius: 3px;
  
  &:hover {
    background: rgba(91,143,249,0.5);
  }
}
</style>

<style lang="scss">
// 全局样式（非scoped）：确保所有深色modal中的表单标签白色
.alarm-drilldown-modal,
.device-detail-modal,
.alarm-detail-modal,
.risk-detail-modal,
.road-device-detail-modal,
.bridge-device-detail-modal,
.tunnel-device-detail-modal {
  .ant-form-item-label > label {
    color: #fff !important;
  }
}

.hazard-detail-modal {
  .ant-modal-content {
    background: linear-gradient(180deg, #0d1f3c, #0a1628);
    border: 1px solid rgba(100,160,255,0.15);
    border-radius: 10px;
  }
  .ant-modal-header {
    background: linear-gradient(90deg, rgba(0,100,200,0.4), rgba(0,60,120,0.2));
    border-bottom: 1px solid rgba(0,180,255,0.3);
    .ant-modal-title {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .ant-modal-close {
    .ant-modal-close-x {
      color: rgba(255,255,255,0.6);
      &:hover { color: #fff; }
    }
  }
}

.hazard-detail-body {
  padding: 16px 20px;
}

.hazard-detail-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 20px;
  
  .hazard-detail-photo-label {
    color: #00e5ff;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    padding-top: 8px;
  }
  
  .hazard-detail-photo {
    width: 160px;
    height: 110px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid rgba(0,180,255,0.3);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

.hazard-detail-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px 24px;
  margin-bottom: 20px;
  
  .detail-field {
    display: flex;
    align-items: center;
    gap: 8px;
    
    &.full-width {
      grid-column: 1 / -1;
    }
    
    .field-label {
      color: #00e5ff;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }
    
    .field-value {
      color: #fff;
      font-size: 13px;
    }
  }
}

.hazard-detail-attachments {
  border-top: 1px solid rgba(0,180,255,0.2);
  padding-top: 12px;
  
  .attachments-title {
    text-align: center;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
    padding: 8px 0;
    background: rgba(0,100,200,0.15);
    border: 1px solid rgba(0,180,255,0.2);
    border-radius: 4px;
  }
  
  .attachments-content {
    min-height: 40px;
    
    .no-data {
      color: rgba(255,255,255,0.4);
      font-size: 13px;
    }
    
    .attachment-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .attachment-item {
        padding: 4px 12px;
        background: rgba(0,180,255,0.1);
        border: 1px solid rgba(0,180,255,0.3);
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
      }
    }
  }
}
</style>

