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
            <span class="map-btn active" @click="showFacilityModal = true">市级数据</span>
          </div>
          <!-- 道路统计 -->
          <template v-if="activeLayer === 'road'">
            <div class="road-stats">
              <div class="stat-grid">
                <div class="stat-block">
                  <div class="stat-label">路网密度</div>
                  <div class="stat-value cyan">8.35<span class="stat-unit"> km/km²</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">道路总长</div>
                  <div class="stat-value blue">17,669.381<span class="stat-unit"> km</span></div>
                </div>
              </div>
              <div class="stat-block sub">
                <div class="stat-label">本年度新建道路里程</div>
                <div class="stat-value orange">390.34<span class="stat-unit"> km</span></div>
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
                  <div class="stat-value blue">14,713<span class="stat-unit"> 座</span></div>
                </div>
                <div class="stat-block">
                  <div class="stat-label">30年以上桥龄</div>
                  <div class="stat-value cyan">1,039<span class="stat-unit"> 座</span></div>
                </div>
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

        <!-- 监测设备 -->
        <div class="card dark-card">
          <div class="card-title">{{ layerNameMap[activeLayer] }}监测设备</div>
          <div class="device-metrics">
            <div class="metric-card">
              <div class="metric-num blue">340</div>
              <div class="metric-label">设备总数</div>
            </div>
            <div class="metric-card">
              <div class="metric-num green">326</div>
              <div class="metric-label">在线数</div>
            </div>
            <div class="metric-card">
              <div class="metric-num cyan">95.9%</div>
              <div class="metric-label">在线率</div>
            </div>
            <div class="metric-card">
              <div class="metric-num orange">168</div>
              <div class="metric-label">接入{{ layerNameMap[activeLayer] }}数</div>
            </div>
            <div class="metric-card">
              <div class="metric-num cyan">49.4%</div>
              <div class="metric-label">接入率</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间地图区 -->
      <div class="panel panel-center">
        <div class="card dark-card map-card">
          <div class="map-toolbar">
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
            <img
              src="https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/120.15,30.27,6,0,0/600x520?access_token=pk.placeholder"
              alt="street map"
              class="street-map-img"
              @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
            />
            <svg viewBox="0 0 600 520" class="map-svg">
              <defs>
                <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#1a3a5c;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0d2137;stop-opacity:1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <!-- 街道网格 -->
              <g class="street-grid" opacity="0.35">
                <line v-for="i in 12" :key="'h'+i" :x1="40" :y1="i*40" :x2="560" :y2="i*40" stroke="#2a5a8a" stroke-width="0.5"/>
                <line v-for="i in 13" :key="'v'+i" :x1="i*40+20" :y1="20" :x2="i*40+20" :y2="500" stroke="#2a5a8a" stroke-width="0.5"/>
              </g>
              <!-- 主干路 -->
              <line v-show="roadTypeChecked.main" x1="40" y1="200" x2="560" y2="200" stroke="#5b8ff9" stroke-width="2.5" opacity="0.6"/>
              <path v-show="roadTypeChecked.main" d="M40,100 Q200,80 300,160 T560,120" stroke="#5b8ff9" stroke-width="1.8" fill="none" opacity="0.5"/>
              <!-- 次干路 -->
              <line v-show="roadTypeChecked.sub" x1="40" y1="360" x2="560" y2="360" stroke="#5ad8a6" stroke-width="2" opacity="0.5"/>
              <path v-show="roadTypeChecked.sub" d="M40,420 Q150,380 300,400 T560,380" stroke="#5ad8a6" stroke-width="1.5" fill="none" opacity="0.4"/>
              <!-- 支路 -->
              <line v-show="roadTypeChecked.branch" x1="180" y1="20" x2="180" y2="500" stroke="#f6bd16" stroke-width="2" opacity="0.5"/>
              <!-- 城市快速路 -->
              <line v-show="roadTypeChecked.highway" x1="380" y1="20" x2="380" y2="500" stroke="#e86452" stroke-width="2.5" opacity="0.6"/>
              <!-- 城市点位 -->
              <g v-for="city in cities" :key="city.name">
                <circle :cx="city.x" :cy="city.y" r="5" :fill="city.color" filter="url(#glow)" opacity="0.9"/>
                <circle :cx="city.x" :cy="city.y" r="10" :fill="city.color" opacity="0.2"/>
                <text :x="city.x + 12" :y="city.y + 4" fill="#8ab4f8" font-size="11">{{ city.name }}</text>
              </g>
              <!-- 信息弹窗 -->
              <!-- 道路图层弹窗 -->
              <g v-if="activeLayer === 'road'" transform="translate(260, 160)">
                <rect x="0" y="0" width="210" height="100" rx="6" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
                <text x="12" y="22" fill="rgba(255,255,255,0.6)" font-size="11">归属地区：<tspan fill="#fff">杭州市市辖区</tspan></text>
                <text x="12" y="42" fill="rgba(255,255,255,0.6)" font-size="11">道路名称：<tspan fill="#fff">石贯子巷（岳王路—中山中路）</tspan></text>
                <text x="12" y="62" fill="rgba(255,255,255,0.6)" font-size="11">道路等级：<tspan fill="#5ad8a6">支路</tspan></text>
                <text x="12" y="82" fill="rgba(255,255,255,0.6)" font-size="11">综合评价等级：<tspan fill="#5b8ff9" font-weight="700">B</tspan></text>
                <polygon points="95,100 105,115 115,100" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
              </g>
              <!-- 桥梁图层弹窗 -->
              <g v-else-if="activeLayer === 'bridge'" transform="translate(350, 120)">
                <rect x="0" y="0" width="190" height="100" rx="6" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
                <text x="12" y="22" fill="rgba(255,255,255,0.6)" font-size="11">归属地区：<tspan fill="#fff">杭州市市辖区</tspan></text>
                <text x="12" y="42" fill="rgba(255,255,255,0.6)" font-size="11">桥梁名称：<tspan fill="#fff">古墩路跨线桥</tspan></text>
                <text x="12" y="62" fill="rgba(255,255,255,0.6)" font-size="11">桥梁类型：<tspan fill="#5b8ff9">立交桥</tspan></text>
                <text x="12" y="82" fill="rgba(255,255,255,0.6)" font-size="11">综合评价等级：<tspan fill="#5b8ff9" font-weight="700">B</tspan></text>
                <polygon points="85,100 95,115 105,100" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
              </g>
              <!-- 隧道图层弹窗1：人行地道（4字段） -->
              <g v-else-if="activeLayer === 'tunnel'" transform="translate(120, 280)">
                <rect x="0" y="0" width="190" height="100" rx="6" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
                <text x="12" y="22" fill="rgba(255,255,255,0.6)" font-size="11">归属地区：<tspan fill="#fff">杭州市市辖区</tspan></text>
                <text x="12" y="42" fill="rgba(255,255,255,0.6)" font-size="11">隧道名称：<tspan fill="#fff">紫金港北路下穿道</tspan></text>
                <text x="12" y="62" fill="rgba(255,255,255,0.6)" font-size="11">隧道类型：<tspan fill="#5ad8a6">人行地道</tspan></text>
                <text x="12" y="82" fill="rgba(255,255,255,0.6)" font-size="11">综合评价等级：<tspan fill="#5b8ff9" font-weight="700">B</tspan></text>
                <polygon points="85,100 95,115 105,100" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
              </g>
              <!-- 隧道图层弹窗2：城市道路隧道（5字段） -->
              <g v-if="activeLayer === 'tunnel'" transform="translate(360, 180)">
                <rect x="0" y="0" width="190" height="118" rx="6" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
                <text x="12" y="22" fill="rgba(255,255,255,0.6)" font-size="11">归属地区：<tspan fill="#fff">杭州市市辖区</tspan></text>
                <text x="12" y="42" fill="rgba(255,255,255,0.6)" font-size="11">隧道名称：<tspan fill="#fff">苏嘉路下穿道</tspan></text>
                <text x="12" y="62" fill="rgba(255,255,255,0.6)" font-size="11">隧道类型：<tspan fill="#5b8ff9">城市道路隧道</tspan></text>
                <text x="12" y="82" fill="rgba(255,255,255,0.6)" font-size="11">是否地下隧道：<tspan fill="#fff">否</tspan></text>
                <text x="12" y="102" fill="rgba(255,255,255,0.6)" font-size="11">综合评价等级：<tspan fill="#e86452" font-weight="700">E</tspan></text>
                <polygon points="85,118 95,133 105,118" fill="rgba(13,31,60,0.95)" stroke="rgba(91,143,249,0.4)" stroke-width="1"/>
              </g>
            </svg>
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
            <!-- 右侧：子图层 + 图层 -->
            <div class="legend-control-panel">
              <div class="sub-layer-btns">
                <span class="radio-item" :class="{ selected: subLayer === 'type' }" @click="subLayer = 'type'"><span class="radio-dot"></span>{{ layerNameMap[activeLayer] }}类型</span>
                <span class="radio-item" :class="{ selected: subLayer === 'eval' }" @click="subLayer = 'eval'"><span class="radio-dot"></span>{{ layerNameMap[activeLayer] }}评价</span>
              </div>
              <div class="layer-btns">
                <span class="layer-btn" :class="{ active: activeLayer === 'road' }" @click="activeLayer = 'road'">道路</span>
                <span class="layer-btn" :class="{ active: activeLayer === 'bridge' }" @click="activeLayer = 'bridge'">桥梁</span>
                <span class="layer-btn" :class="{ active: activeLayer === 'tunnel' }" @click="activeLayer = 'tunnel'">隧道</span>
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
          <div class="task-list">
            <div class="task-section" v-for="t in taskSections" :key="t.title">
              <div class="task-section-title">{{ t.title }}</div>
              <div class="task-section-items">
                <div class="task-info-item" v-for="item in t.items" :key="item.label">
                  <div class="task-info-val">{{ item.value }}</div>
                  <div class="task-info-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 风险清单 -->
        <div class="card dark-card">
          <div class="card-title">{{ layerNameMap[activeLayer] }}风险清单</div>
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
          <div class="map-filter-bar">
            <select v-model="monitorCity" class="map-city-select">
              <option value="浙江省">浙江省</option>
              <option v-for="c in cityList" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="map-layer-panel">
            <div class="layer-item" :class="{ active: monitorLayer === 'road' }" @click="monitorLayer = 'road'">
              <span class="layer-radio"></span>道路
            </div>
            <div class="layer-item" :class="{ active: monitorLayer === 'bridge' }" @click="monitorLayer = 'bridge'">
              <span class="layer-radio"></span>桥梁
            </div>
            <div class="layer-item" :class="{ active: monitorLayer === 'tunnel' }" @click="monitorLayer = 'tunnel'">
              <span class="layer-radio"></span>隧道
            </div>
          </div>
          <div class="map-placeholder">
            <svg viewBox="0 0 600 300" class="monitor-svg">
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color="rgba(91,143,249,0.15)"/>
                  <stop offset="100%" stop-color="rgba(10,22,40,0)"/>
                </radialGradient>
              </defs>
              <rect width="600" height="300" fill="#0a1628"/>
              <circle cx="300" cy="150" r="140" fill="url(#mapGlow)"/>
              <g opacity="0.3">
                <line v-for="i in 8" :key="'mh'+i" x1="0" :y1="i*37" x2="600" :y2="i*37" stroke="#2a5a8a" stroke-width="0.5"/>
                <line v-for="i in 16" :key="'mv'+i" :x1="i*37" y1="0" :x2="i*37" y2="300" stroke="#2a5a8a" stroke-width="0.5"/>
              </g>
              <!-- 道路图层点位：线段 -->
              <g v-if="monitorLayer === 'road'">
                <line x1="270" y1="120" x2="295" y2="120" stroke="#e86452" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="298" y="124" fill="#8ab4f8" font-size="10">石贯子巷</text>
                <line x1="340" y1="100" x2="365" y2="100" stroke="#5b8ff9" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="368" y="104" fill="#8ab4f8" font-size="10">复兴大道</text>
                <line x1="210" y1="170" x2="235" y2="170" stroke="#5ad8a6" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="238" y="174" fill="#8ab4f8" font-size="10">备塘河桥路</text>
                <line x1="390" y1="180" x2="415" y2="180" stroke="#f6bd16" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="418" y="184" fill="#8ab4f8" font-size="10">环城西路</text>
                <line x1="300" y1="200" x2="325" y2="200" stroke="#e86452" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="328" y="204" fill="#8ab4f8" font-size="10">乌桥路</text>
                <line x1="170" y1="100" x2="195" y2="100" stroke="#5b8ff9" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="198" y="104" fill="#8ab4f8" font-size="10">拱墅路</text>
              </g>
              <!-- 桥梁图层点位：线段 -->
              <g v-else-if="monitorLayer === 'bridge'">
                <line x1="270" y1="120" x2="295" y2="120" stroke="#e86452" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="298" y="124" fill="#8ab4f8" font-size="10">武林桥</text>
                <line x1="340" y1="100" x2="365" y2="100" stroke="#5b8ff9" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="368" y="104" fill="#8ab4f8" font-size="10">复兴大桥</text>
                <line x1="210" y1="170" x2="235" y2="170" stroke="#5ad8a6" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="238" y="174" fill="#8ab4f8" font-size="10">备塘河桥</text>
                <line x1="390" y1="180" x2="415" y2="180" stroke="#f6bd16" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="418" y="184" fill="#8ab4f8" font-size="10">康家桥</text>
                <line x1="300" y1="200" x2="325" y2="200" stroke="#e86452" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="328" y="204" fill="#8ab4f8" font-size="10">乌桥</text>
                <line x1="170" y1="100" x2="195" y2="100" stroke="#5b8ff9" stroke-width="3" stroke-linecap="round" opacity="0.9"/><text x="198" y="104" fill="#8ab4f8" font-size="10">半山桥</text>
              </g>
              <!-- 隧道图层点位：矩形 -->
              <g v-else-if="monitorLayer === 'tunnel'">
                <rect x="270" y="114" width="20" height="10" rx="2" fill="#e86452" opacity="0.9"/><text x="294" y="124" fill="#8ab4f8" font-size="10">紫金港北路下穿道</text>
                <rect x="340" y="94" width="20" height="10" rx="2" fill="#5b8ff9" opacity="0.9"/><text x="364" y="104" fill="#8ab4f8" font-size="10">苏嘉路下穿道</text>
                <rect x="210" y="164" width="20" height="10" rx="2" fill="#5ad8a6" opacity="0.9"/><text x="234" y="174" fill="#8ab4f8" font-size="10">复兴路隧道</text>
                <rect x="390" y="174" width="20" height="10" rx="2" fill="#f6bd16" opacity="0.9"/><text x="414" y="184" fill="#8ab4f8" font-size="10">环城北路隧道</text>
                <rect x="300" y="194" width="20" height="10" rx="2" fill="#e86452" opacity="0.9"/><text x="324" y="204" fill="#8ab4f8" font-size="10">半山隧道</text>
                <rect x="170" y="94" width="20" height="10" rx="2" fill="#5b8ff9" opacity="0.9"/><text x="194" y="104" fill="#8ab4f8" font-size="10">乌桥路地道</text>
              </g>
              <text x="250" y="60" fill="rgba(255,255,255,0.3)" font-size="11">西溪</text>
              <text x="370" y="140" fill="rgba(255,255,255,0.3)" font-size="11">江干</text>
              <text x="150" y="220" fill="rgba(255,255,255,0.3)" font-size="11">拱墅</text>
            </svg>
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
                <th>道路名称</th>
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

    <!-- 设备详情弹窗 -->
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
import { ref, reactive, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Modal as AModal, Table as ATable } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import * as echarts from 'echarts'

const router = useRouter()

const statsChartRef = ref<HTMLElement | null>(null)
const riskChartRef = ref<HTMLElement | null>(null)
let statsChart: echarts.ECharts | null = null
let riskChart: echarts.ECharts | null = null

const activeLayer = ref<'road' | 'bridge' | 'tunnel'>('road')
const subLayer = ref<'type' | 'eval'>('type')
const cockpitTab = ref<'overview' | 'monitor'>('overview')

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
const currentCity = ref('浙江省')
const cityList = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const selectCity = (city: string) => {
  currentCity.value = city
  showCityDropdown.value = false
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

const roadCategories = [
  { name: '快速路', value: '153,975 km', num: 153975, color: '#e86452' },
  { name: '主干路', value: '6,133.11 km', num: 6133.11, color: '#5b8ff9' },
  { name: '次干路', value: '4,445.226 km', num: 4445.226, color: '#5ad8a6' },
  { name: '支路', value: '3,920.524 km', num: 3920.524, color: '#f6bd16' },
]
const bridgeCategories = [
  { name: '特大桥', value: '129 座', num: 129, color: '#e86452' },
  { name: '大桥', value: '913 座', num: 913, color: '#5b8ff9' },
  { name: '中小桥', value: '8,084 座', num: 8084, color: '#6dc8ec' },
  { name: '立交桥', value: '134 座', num: 134, color: '#5ad8a6' },
  { name: '高架桥', value: '76 座', num: 76, color: '#f6bd16' },
  { name: '人行天桥', value: '129 座', num: 129, color: '#945fb9' },
]
const tunnelCategories = [
  { name: '特长隧道', value: '28 座', num: 28, color: '#e86452' },
  { name: '长隧道', value: '96 座', num: 96, color: '#5b8ff9' },
  { name: '中隧道', value: '312 座', num: 312, color: '#5ad8a6' },
  { name: '短隧道', value: '256 座', num: 256, color: '#f6bd16' },
]
const currentCategories = computed(() => activeLayer.value === 'bridge' ? bridgeCategories : activeLayer.value === 'tunnel' ? tunnelCategories : roadCategories)

const riskCategories = [
  { name: '一级风险', color: '#945fb9' },
  { name: '二级风险', color: '#5b8ff9' },
  { name: '三级风险', color: '#e86452' },
]

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
        { value: '30', label: '检测即将超期' },
        { value: '10', label: '检测已逾期' },
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
        label: { show: false },
        data: [
          { name: '一级风险', value: 68, itemStyle: { color: '#945fb9' } },
          { name: '二级风险', value: 58, itemStyle: { color: '#5b8ff9' } },
          { name: '三级风险', value: 42, itemStyle: { color: '#e86452' } },
        ],
      }],
    })
  }
}
function updateStatsChart() {
  if (!statsChart) return
  const cats = currentCategories.value
  const isRoad = activeLayer.value === 'road'
  statsChart.setOption({
    tooltip: { trigger: 'item', formatter: isRoad ? '{b}: {c}km ({d}%)' : '{b}: {c}座 ({d}%)' },
    series: [{
      type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
      label: { show: false },
      data: cats.map(c => ({ name: c.name, value: c.num, itemStyle: { color: c.color } })),
    }],
  })
}

onMounted(() => { setTimeout(initCharts, 100) })
onUnmounted(() => {
  statsChart?.dispose(); riskChart?.dispose()
  alarmTrendChart?.dispose(); timeFlowChart?.dispose()
})

// 返回工作台
const handleGoToDashboard = () => {
  router.push('/dashboard')
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
    nextTick(() => { setTimeout(initMonitorCharts, 50) })
  }
})
watch(monitorLayer, (val) => {
  if (val === 'bridge' && cockpitTab.value === 'monitor') {
    nextTick(() => { setTimeout(initMonitorCharts, 50) })
  }
})
watch(activeLayer, () => {
  nextTick(() => {
    if (statsChart) { statsChart.dispose(); statsChart = null }
    if (statsChartRef.value) {
      statsChart = echarts.init(statsChartRef.value)
      updateStatsChart()
    }
  })
})
</script>

<style scoped lang="scss">
.cockpit-page {
  min-height: 100vh;
  background: #0a1628;
  display: flex;
  flex-direction: column;
  color: #e0e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.cockpit-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 48px;
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
  font-size: 20px; font-weight: 600; letter-spacing: 2px;
  background: linear-gradient(90deg, #5b8ff9, #5ad8a6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.cockpit-nav { display: flex; gap: 20px;
  .nav-link { font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; &:hover { color: #5b8ff9; } }
}

.cockpit-body {
  flex: 1; display: grid; grid-template-columns: 380px 1fr 380px;
  gap: 12px; padding: 12px; min-height: 0;
}
.panel { display: flex; flex-direction: column; gap: 12px; }
.panel-left, .panel-right { display: grid; grid-template-rows: 1fr 1fr; gap: 12px; }

.dark-card {
  background: linear-gradient(180deg, rgba(13,31,60,0.95), rgba(10,22,40,0.98));
  border: 1px solid rgba(100,160,255,0.12); border-radius: 8px; padding: 16px;
}
.card-title {
  font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9);
  margin-bottom: 14px; padding-left: 10px; border-left: 3px solid #5b8ff9;
}
.card-title-row {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;
  .card-title { margin-bottom: 0; }
}

/* 道路统计 */
.road-stats { margin-bottom: 14px; }
.stat-grid { display: flex; gap: 16px; margin-bottom: 10px; }
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

/* 监测设备 */
.device-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; &:has(> :nth-child(5)) { grid-template-columns: 1fr 1fr 1fr; } }
.metric-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(100,160,255,0.08);
  border-radius: 6px; padding: 10px; text-align: center;
}
.metric-num {
  font-size: 22px; font-weight: 700; margin-bottom: 2px; font-variant-numeric: tabular-nums;
  &.green { color: #5ad8a6; } &.red { color: #e86452; } &.blue { color: #5b8ff9; } &.cyan { color: #6dc8ec; }
}
.metric-label { font-size: 11px; color: rgba(255,255,255,0.5); }

/* 地图区 */
.map-card { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.map-toolbar { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 8px; }
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
.street-map-img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  opacity: 0.6; border-radius: 6px; pointer-events: none;
}

.layer-btns .layer-btn {
  padding: 3px 10px; border-radius: 4px; font-size: 11px; cursor: pointer;
  color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.06);
  border: 1px solid rgba(100,160,255,0.15); transition: all 0.2s;
  &:hover { color: rgba(255,255,255,0.8); }
  &.active { background: rgba(91,143,249,0.25); color: #5b8ff9; border-color: rgba(91,143,249,0.4); }
}
.map-svg { width: 100%; max-width: 560px; height: auto; }

.map-legend {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 10px 14px; margin-top: 8px;
  background: rgba(10,22,40,0.9); border: 1px solid rgba(100,160,255,0.1); border-radius: 6px;
}
.legend-checkbox-panel {
  display: flex; flex-direction: column; gap: 6px;
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
  display: flex; flex-direction: row; align-items: flex-start; gap: 16px;
}
.layer-btns {
  display: flex; flex-direction: column; gap: 6px;
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
.task-list { display: flex; flex-direction: column; gap: 12px; }
.task-section {
  background: rgba(255,255,255,0.02); border-radius: 6px; padding: 10px 12px;
}
.task-section-title {
  font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.7);
  margin-bottom: 8px; padding-left: 8px; border-left: 2px solid #5b8ff9;
}
.task-section-items { display: flex; gap: 4px; flex-wrap: wrap; }
.task-info-item {
  flex: 1; min-width: 60px; text-align: center;
  padding: 4px; background: rgba(91,143,249,0.06); border-radius: 4px;
}
.task-info-val { font-size: 16px; font-weight: 700; color: #5b8ff9; }
.task-info-label { font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 2px; }

/* 风险清单 */
.risk-section { margin-bottom: 12px; text-align: center; }
.risk-legend {
  display: flex; gap: 10px; margin-top: 8px; justify-content: center;
  .legend-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: rgba(255,255,255,0.6); }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
}
.risk-metrics { display: flex; gap: 8px;
  .risk-item { flex: 1; text-align: center; background: rgba(255,255,255,0.03); border-radius: 6px; padding: 10px 6px; }
  .risk-num { font-size: 22px; font-weight: 700; margin-bottom: 2px;
    &.orange { color: #f6a816; } &.green { color: #5ad8a6; } &.cyan { color: #6dc8ec; }
  }
  .risk-label { font-size: 11px; color: rgba(255,255,255,0.5); }
}
</style>

<style lang="scss">
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
  grid-template-columns: 380px 1fr 400px !important;
}
.monitor-left { display: flex; flex-direction: column; gap: 12px; }
.monitor-center { display: flex; flex-direction: column; gap: 12px; }
.monitor-right { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }

.monitor-device-card { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
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
.map-placeholder { flex: 1; display: flex; align-items: center; justify-content: center; }
.monitor-svg { width: 100%; height: 100%; }

.alarm-stats-card { flex-shrink: 0; }
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
  position: absolute; bottom: 12px; right: 12px; z-index: 10;
  background: rgba(13,31,60,0.9); border: 1px solid rgba(100,160,255,0.3); border-radius: 6px;
  padding: 8px 12px; display: flex; flex-direction: column; gap: 6px;
  .layer-item {
    display: flex; align-items: center; gap: 6px; cursor: pointer;
    font-size: 13px; color: rgba(255,255,255,0.6); white-space: nowrap;
    .layer-radio {
      display: inline-block; width: 12px; height: 12px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.4); flex-shrink: 0;
    }
    &.active {
      color: rgba(255,255,255,0.9);
      .layer-radio { border-color: #5b8ff9; background: #5b8ff9; }
    }
    &:hover { color: rgba(255,255,255,0.8); }
  }
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

.device-detail-modal, .alarm-detail-modal {
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
      .ant-pagination-item { background: transparent; border-color: rgba(100,160,255,0.2);
        a { color: rgba(255,255,255,0.6); }
      }
      .ant-pagination-item-active { border-color: #5b8ff9; background: rgba(91,143,249,0.15);
        a { color: #5b8ff9; }
      }
    }
  }
}
</style>
