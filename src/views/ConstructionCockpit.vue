<template>
  <div class="construction-cockpit">
    <!-- 顶部导航栏 -->
    <div class="cockpit-header">
      <div class="cockpit-tabs">
        <div class="cockpit-tab" @click="router.push('/cockpit')">设施概览</div>
        <div class="cockpit-tab" @click="router.push('/cockpit')">在线监测</div>
        <div class="cockpit-tab" @click="router.push('/cockpit')">安全隐患排查整治</div>
        <div class="cockpit-tab" @click="router.push('/cockpit')">安全隐患排查整治（备用）</div>
      </div>
      <div class="cockpit-title">浙江省城市道桥隧安全监管</div>
      <div class="cockpit-nav">
        <span class="nav-link active-nav">项目管理</span>
        <span class="nav-link" @click="handleGoToDashboard">工作台</span>
      </div>
    </div>

    <!-- 主体内容区 -->
    <div class="cockpit-body">
      <!-- 左侧面板 -->
      <div class="panel panel-left">
        <!-- 项目区域分布 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">项目区域分布</div>
            <button class="detail-btn" @click="showRegionDetail = true">查看详情</button>
          </div>
          <div ref="regionChartRef" class="chart-container"></div>
        </div>

        <!-- 项目类型分布 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">项目类型分布</div>
            <button class="detail-btn" @click="showTypeDetail = true">查看详情</button>
          </div>
          <div class="chart-area">
            <div class="type-grid">
              <div class="type-item" v-for="item in typeDistribution" :key="item.name">
                <div class="type-count" :style="{ color: item.color }">{{ item.count }}</div>
                <div class="type-name">{{ item.name }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 项目建设进度 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">项目建设进度</div>
            <button class="detail-btn" @click="showProgressDetail = true">查看详情</button>
          </div>
          <div class="chart-area">
            <div class="progress-grid">
              <div class="progress-block" v-for="(item, idx) in progressStages" :key="idx">
                <div class="progress-header">
                  <span class="progress-stage">{{ item.stage }}</span>
                  <span class="progress-percent" :style="{ color: item.color }">{{ item.percent }}%</span>
                </div>
                <div class="progress-detail">
                  <div>{{ item.planLabel }}：{{ item.planValue }}</div>
                  <div>{{ item.accumLabel }}：{{ item.accumValue }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中央地图区域 -->
      <div class="center-area">
        <!-- 项目概览 -->
        <div class="project-overview">
          <div class="overview-item">
            <div class="overview-value" style="color: #5b8ff9">{{ totalProjects }}</div>
            <div class="overview-label">项目总数量</div>
          </div>
          <div class="overview-item">
            <div class="overview-value" style="color: #5ad8a6">{{ buildingCount }}</div>
            <div class="overview-label">在建数量</div>
          </div>
          <div class="overview-item">
            <div class="overview-value" style="color: #f6bd16">{{ completedCount }}</div>
            <div class="overview-label">完工数量</div>
          </div>
          <div class="overview-item">
            <div class="overview-value" style="color: #e86452">{{ totalInvestment }}亿</div>
            <div class="overview-label">项目总投资</div>
          </div>
          <div class="overview-item">
            <div class="overview-value" style="color: #6dc8ec">{{ annualPlan }}亿</div>
            <div class="overview-label">本年度计划投资</div>
          </div>
          <div class="overview-item">
            <div class="overview-value" style="color: #945fb9">{{ completedInvestment }}亿</div>
            <div class="overview-label">累计完成投资</div>
          </div>
        </div>
        <!-- 地图容器 -->
        <div class="map-wrapper">
          <div ref="mapRef" class="amap-container"></div>
        </div>
        <!-- 底部图例控制面板 -->
        <div class="map-legend">
          <!-- 左侧：图例项（带复选框） -->
          <div class="legend-checkbox-panel">
            <label class="checkbox-item" v-for="lt in layerTypes" :key="lt">
              <span class="custom-checkbox" :class="{ checked: activeLayers.includes(lt) }" @click="toggleLayer(lt)">
                <svg v-if="activeLayers.includes(lt)" viewBox="0 0 12 12" class="check-icon"><path d="M2,6 L5,9 L10,3" stroke="#5b8ff9" stroke-width="2" fill="none"/></svg>
              </span>
              <span class="checkbox-label">{{ lt }}</span>
            </label>
          </div>
          <!-- 右侧：图例 -->
          <div class="legend-control-panel">
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-dot" style="background:#f6bd16"></span>
                <span>前期</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background:#5ad8a6"></span>
                <span>已开工</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background:#5b8ff9"></span>
                <span>完工</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="panel panel-right">
        <!-- 新建设施项目 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">新建设施项目</div>
            <button class="detail-btn" @click="openDetailModal('new')">查看详情</button>
          </div>
          <div class="project-list">
            <table class="project-table">
              <thead>
                <tr>
                  <th>归属地区</th>
                  <th>项目名称</th>
                  <th>项目类型</th>
                  <th>项目年份</th>
                  <th>建设单位</th>
                  <th>施工单位</th>
                  <th>计划开工时间</th>
                  <th>计划完工时间</th>
                  <th>关联设施</th>
                  <th>项目状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in newProjects" :key="i" @click="locateProject(p)">
                  <td>{{ p.region }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.type }}</td>
                  <td>{{ p.year }}</td>
                  <td>{{ p.constructionUnit }}</td>
                  <td>{{ p.contractor }}</td>
                  <td>{{ p.planStartDate }}</td>
                  <td>{{ p.planEndDate }}</td>
                  <td>{{ p.relatedFacility }}</td>
                  <td><span class="status-tag" :class="p.status">{{ p.status }}</span></td>
                  <td><button class="action-btn" @click.stop="openViewModal(newProjects, i)">查看</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 问题设施改造项目 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">问题设施改造项目</div>
            <button class="detail-btn" @click="openDetailModal('problem')">查看详情</button>
          </div>
          <div class="project-list">
            <table class="project-table">
              <thead>
                <tr>
                  <th>归属地区</th>
                  <th>项目名称</th>
                  <th>项目类型</th>
                  <th>项目年份</th>
                  <th>建设单位</th>
                  <th>施工单位</th>
                  <th>计划开工时间</th>
                  <th>计划完工时间</th>
                  <th>关联设施</th>
                  <th>项目状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in problemProjects" :key="i" @click="locateProject(p)">
                  <td>{{ p.region }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.type }}</td>
                  <td>{{ p.year }}</td>
                  <td>{{ p.constructionUnit }}</td>
                  <td>{{ p.contractor }}</td>
                  <td>{{ p.planStartDate }}</td>
                  <td>{{ p.planEndDate }}</td>
                  <td>{{ p.relatedFacility }}</td>
                  <td><span class="status-tag" :class="p.status">{{ p.status }}</span></td>
                  <td><button class="action-btn" @click.stop="openViewModal(problemProjects, i)">查看</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 重点项目跟进 -->
        <div class="card dark-card">
          <div class="card-title-row">
            <div class="card-title">重点项目跟进</div>
            <button class="detail-btn" @click="openDetailModal('key')">查看详情</button>
          </div>
          <div class="project-list">
            <table class="project-table">
              <thead>
                <tr>
                  <th>归属地区</th>
                  <th>项目名称</th>
                  <th>项目类型</th>
                  <th>项目年份</th>
                  <th>建设单位</th>
                  <th>施工单位</th>
                  <th>计划开工时间</th>
                  <th>计划完工时间</th>
                  <th>关联设施</th>
                  <th>项目状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in keyProjects" :key="i" @click="locateProject(p)">
                  <td>{{ p.region }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.type }}</td>
                  <td>{{ p.year }}</td>
                  <td>{{ p.constructionUnit }}</td>
                  <td>{{ p.contractor }}</td>
                  <td>{{ p.planStartDate }}</td>
                  <td>{{ p.planEndDate }}</td>
                  <td>{{ p.relatedFacility }}</td>
                  <td><span class="status-tag" :class="p.status">{{ p.status }}</span></td>
                  <td><button class="action-btn" @click.stop="openViewModal(keyProjects, i)">查看</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目区域分布详情弹窗 -->
    <div v-if="showRegionDetail" class="modal-overlay" @click.self="showRegionDetail = false">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title">项目区域分布详情</div>
          <span class="modal-close" @click="showRegionDetail = false">&times;</span>
        </div>
        <div class="modal-body">
          <table class="detail-table">
            <thead>
              <tr>
                <th>设市区</th>
                <th>项目数量</th>
                <th>在建数量</th>
                <th>完工数量</th>
                <th>总投资（亿元）</th>
                <th>本年度计划投资（亿元）</th>
                <th>累计完成投资（亿元）</th>
              </tr>
            </thead>
            <tbody>
              <tr class="total-row">
                <td>{{ regionTotal.city }}</td>
                <td>{{ regionTotal.totalCount }}</td>
                <td>{{ regionTotal.buildingCount }}</td>
                <td>{{ regionTotal.completedCount }}</td>
                <td>{{ regionTotal.totalInvestment }}</td>
                <td>{{ regionTotal.annualPlan }}</td>
                <td>{{ regionTotal.completedInvestment }}</td>
              </tr>
              <tr v-for="(item, idx) in regionDetailData" :key="idx">
                <td>{{ item.city }}</td>
                <td>{{ item.totalCount }}</td>
                <td>{{ item.buildingCount }}</td>
                <td>{{ item.completedCount }}</td>
                <td>{{ item.totalInvestment }}</td>
                <td>{{ item.annualPlan }}</td>
                <td>{{ item.completedInvestment }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 项目类型分布详情弹窗 -->
    <div v-if="showTypeDetail" class="modal-overlay" @click.self="showTypeDetail = false">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title">项目类型分布详情</div>
          <span class="modal-close" @click="showTypeDetail = false">&times;</span>
        </div>
        <div class="modal-body">
          <table class="detail-table">
            <thead>
              <tr>
                <th>设市区</th>
                <th>新建道路项目</th>
                <th>新建桥梁项目</th>
                <th>新建隧道项目</th>
                <th>问题道路改造项目</th>
                <th>问题桥梁改造项目</th>
                <th>问题隧道改造项目</th>
              </tr>
            </thead>
            <tbody>
              <tr class="total-row">
                <td>{{ typeTotal.city }}</td>
                <td>{{ typeTotal.newRoad }}</td>
                <td>{{ typeTotal.newBridge }}</td>
                <td>{{ typeTotal.newTunnel }}</td>
                <td>{{ typeTotal.problemRoad }}</td>
                <td>{{ typeTotal.problemBridge }}</td>
                <td>{{ typeTotal.problemTunnel }}</td>
              </tr>
              <tr v-for="(item, idx) in typeDetailData" :key="idx">
                <td>{{ item.city }}</td>
                <td>{{ item.newRoad }}</td>
                <td>{{ item.newBridge }}</td>
                <td>{{ item.newTunnel }}</td>
                <td>{{ item.problemRoad }}</td>
                <td>{{ item.problemBridge }}</td>
                <td>{{ item.problemTunnel }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 项目建设进度详情弹窗 -->
    <div v-if="showProgressDetail" class="modal-overlay" @click.self="showProgressDetail = false">
      <div class="modal-container modal-wide">
        <div class="modal-header">
          <div class="modal-title">项目建设进度详情</div>
          <span class="modal-close" @click="showProgressDetail = false">&times;</span>
        </div>
        <div class="modal-body">
          <table class="detail-table">
            <thead>
              <tr>
                <th>设市区</th>
                <th>计划新建道路</th><th>累计新建道路</th><th>新建道路进度</th>
                <th>计划新建桥梁</th><th>累计新建桥梁</th><th>新建桥梁进度</th>
                <th>计划新建隧道</th><th>累计新建隧道</th><th>新建隧道进度</th>
                <th>计划改造道路</th><th>累计改造道路</th><th>改造道路进度</th>
                <th>计划改造桥梁</th><th>累计改造桥梁</th><th>改造桥梁进度</th>
                <th>计划改造隧道</th><th>累计改造隧道</th><th>改造隧道进度</th>
              </tr>
            </thead>
            <tbody>
              <tr class="total-row">
                <td>{{ progressTotal.city }}</td>
                <td>{{ progressTotal.planNewRoad }}</td><td>{{ progressTotal.accumNewRoad }}</td><td>{{ progressTotal.rateNewRoad }}%</td>
                <td>{{ progressTotal.planNewBridge }}</td><td>{{ progressTotal.accumNewBridge }}</td><td>{{ progressTotal.rateNewBridge }}%</td>
                <td>{{ progressTotal.planNewTunnel }}</td><td>{{ progressTotal.accumNewTunnel }}</td><td>{{ progressTotal.rateNewTunnel }}%</td>
                <td>{{ progressTotal.planProblemRoad }}</td><td>{{ progressTotal.accumProblemRoad }}</td><td>{{ progressTotal.rateProblemRoad }}%</td>
                <td>{{ progressTotal.planProblemBridge }}</td><td>{{ progressTotal.accumProblemBridge }}</td><td>{{ progressTotal.rateProblemBridge }}%</td>
                <td>{{ progressTotal.planProblemTunnel }}</td><td>{{ progressTotal.accumProblemTunnel }}</td><td>{{ progressTotal.rateProblemTunnel }}%</td>
              </tr>
              <tr v-for="(item, idx) in progressDetailData" :key="idx">
                <td>{{ item.city }}</td>
                <td>{{ item.planNewRoad }}</td><td>{{ item.accumNewRoad }}</td><td>{{ item.rateNewRoad }}%</td>
                <td>{{ item.planNewBridge }}</td><td>{{ item.accumNewBridge }}</td><td>{{ item.rateNewBridge }}%</td>
                <td>{{ item.planNewTunnel }}</td><td>{{ item.accumNewTunnel }}</td><td>{{ item.rateNewTunnel }}%</td>
                <td>{{ item.planProblemRoad }}</td><td>{{ item.accumProblemRoad }}</td><td>{{ item.rateProblemRoad }}%</td>
                <td>{{ item.planProblemBridge }}</td><td>{{ item.accumProblemBridge }}</td><td>{{ item.rateProblemBridge }}%</td>
                <td>{{ item.planProblemTunnel }}</td><td>{{ item.accumProblemTunnel }}</td><td>{{ item.rateProblemTunnel }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 查看详情弹窗（含筛选） -->
    <div v-if="detailModalVisible" class="modal-overlay" @click.self="detailModalVisible = false">
      <div class="modal-container" style="width: 900px;">
        <div class="modal-header">
          <div class="modal-title">{{ detailModalTitle }}</div>
          <span class="modal-close" @click="detailModalVisible = false">&times;</span>
        </div>
        <div class="modal-body">
          <!-- 筛选项 -->
          <div class="filter-row">
            <select v-model="detailFilter.region" class="dark-select" style="width: 200px;">
              <option value="">全部归属地区</option>
              <option v-for="r in regionOptions" :key="r" :value="r">{{ r }}</option>
            </select>
            <input v-model="detailFilter.projectName" class="dark-input" placeholder="请输入项目名称" style="width: 200px;" />
            <select v-model="detailFilter.year" class="dark-select" style="width: 150px;">
              <option value="">全部年份</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <button class="dark-btn" @click="detailFilter.region = ''; detailFilter.projectName = ''; detailFilter.year = ''">重置</button>
          </div>
          <!-- 表格 -->
          <div class="project-list" style="max-height: 500px; overflow-y: auto;">
            <table class="project-table">
              <thead>
                <tr>
                  <th>归属地区</th>
                  <th>项目名称</th>
                  <th>项目类型</th>
                  <th>项目年份</th>
                  <th>建设单位</th>
                  <th>施工单位</th>
                  <th>计划开工时间</th>
                  <th>计划完工时间</th>
                  <th>关联设施</th>
                  <th>项目状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, i) in filteredDetailData" :key="i">
                  <td>{{ p.region }}</td>
                  <td>{{ p.name }}</td>
                  <td>{{ p.type }}</td>
                  <td>{{ p.year }}</td>
                  <td>{{ p.constructionUnit }}</td>
                  <td>{{ p.contractor }}</td>
                  <td>{{ p.planStartDate }}</td>
                  <td>{{ p.planEndDate }}</td>
                  <td>{{ p.relatedFacility }}</td>
                  <td><span class="status-tag" :class="p.status">{{ p.status }}</span></td>
                  <td><button class="action-btn" @click="openViewModalFromDetail(i)">查看</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看项目详情弹窗（深色样式） -->
    <div v-if="viewModalVisible" class="modal-overlay" @click.self="viewModalVisible = false">
      <div class="modal-container dark-detail-modal" style="width: 900px;">
        <div class="modal-header">
          <div class="modal-title">查看详情</div>
          <span class="modal-close" @click="viewModalVisible = false">&times;</span>
        </div>
        <div class="modal-body dark-detail-body">
          <div class="dark-form-grid">
            <div class="dark-form-item"><label>项目名称</label><span>{{ viewRecord.name }}</span></div>
            <div class="dark-form-item"><label>归属地区</label><span>{{ viewRecord.region }}</span></div>
            <div class="dark-form-item"><label>项目年份</label><span>{{ viewRecord.year }}</span></div>
            <div class="dark-form-item"><label>项目类型</label><span>{{ viewRecord.type }}</span></div>
            <div class="dark-form-item"><label>建设单位</label><span>{{ viewRecord.constructionUnit }}</span></div>
            <div class="dark-form-item"><label>建设单位责任人</label><span>{{ viewRecord.constructionContact || '-' }}</span></div>
            <div class="dark-form-item"><label>责任人联系方式</label><span>{{ viewRecord.constructionPhone || '-' }}</span></div>
            <div class="dark-form-item"><label>施工单位</label><span>{{ viewRecord.contractor }}</span></div>
            <div class="dark-form-item"><label>施工单位责任人</label><span>{{ viewRecord.contractorContact || '-' }}</span></div>
            <div class="dark-form-item"><label>责任人联系方式</label><span>{{ viewRecord.contractorPhone || '-' }}</span></div>
            <div class="dark-form-item"><label>项目状态</label><span>{{ viewRecord.status }}</span></div>
            <div class="dark-form-item"><label>计划开工时间</label><span>{{ viewRecord.planStartDate }}</span></div>
            <div class="dark-form-item"><label>计划完工时间</label><span>{{ viewRecord.planEndDate }}</span></div>
            <div class="dark-form-item"><label>关联设施</label><span>{{ viewRecord.relatedFacility }}</span></div>
            <div class="dark-form-item"><label>实际开工时间</label><span>{{ viewRecord.actualStartDate || '-' }}</span></div>
            <div class="dark-form-item"><label>实际完工时间</label><span>{{ viewRecord.actualEndDate || '-' }}</span></div>
            <div class="dark-form-item"><label>开工相关附件</label><span>{{ viewRecord.startAttachment || '无附件' }}</span></div>
            <div class="dark-form-item"><label>完工相关附件</label><span>{{ viewRecord.endAttachment || '无附件' }}</span></div>
          </div>

          <!-- 进度信息 -->
          <div v-if="viewRecord.progressList && viewRecord.progressList.length > 0">
            <div class="dark-section-title">进度信息</div>
            <div v-for="(pg, pi) in viewRecord.progressList" :key="pi" class="dark-progress-block">
              <div class="dark-progress-header">
                <span>{{ pg.facilityName }}</span>
                <span class="dark-progress-pct">{{ pg.computedProgress }}</span>
              </div>
              <div class="dark-progress-bar-bg">
                <div class="dark-progress-bar" :style="{ width: pg.computedProgress }"></div>
              </div>
              <div class="dark-progress-meta">
                <span v-if="viewIsRoad && viewIsNewProject">道路长度：{{ pg.roadLength }}m</span>
                <span v-if="viewIsRoad">{{ viewIsNewProject ? '目标建设长度' : '需改造长度' }}：{{ pg.totalRenovationLength }}m</span>
                <span v-if="viewIsRoad">{{ viewIsNewProject ? '已建设长度' : '已改造长度' }}：{{ pg.totalCompletedLength }}m</span>
                <span>状态：{{ pg.statusDesc }}</span>
                <span>计划投资：{{ pg.computedPlannedInvestment }}万元</span>
                <span>完成投资：{{ pg.computedCompletedInvestment }}万元</span>
              </div>
              <!-- 年份明细 -->
              <table v-if="pg.yearData && pg.yearData.length > 0" class="dark-progress-table">
                <thead>
                  <tr>
                    <th>年份</th>
                    <th v-if="viewIsRoad && !viewIsNewProject">需改造长度(m)</th>
                    <th v-if="viewIsRoad && !viewIsNewProject">已改造长度(m)</th>
                    <th>形象进度</th>
                    <th>状态描述</th>
                    <th>计划投资额(万元)</th>
                    <th>累计完成投资(万元)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(yd, yi) in pg.yearData" :key="yi">
                    <td>{{ yd.year }}</td>
                    <td v-if="viewIsRoad && !viewIsNewProject">{{ yd.renovationLength }}</td>
                    <td v-if="viewIsRoad && !viewIsNewProject">{{ yd.completedLength }}</td>
                    <td>{{ yd.progress }}</td>
                    <td>{{ yd.statusDesc }}</td>
                    <td>{{ yd.plannedInvestment }}</td>
                    <td>{{ yd.completedInvestment }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else>
            <div class="dark-section-title">进度信息</div>
            <div class="dark-empty">暂无进度数据</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mapRef = ref<HTMLElement | null>(null)
const regionChartRef = ref<HTMLElement | null>(null)
let map: any = null
let regionChart: any = null
let allMarkers: any[] = []

// 图层筛选状态
const layerTypes = ['新建道路', '新建桥梁', '新建隧道', '问题道路改造', '问题桥梁改造', '问题隧道改造']
const activeLayers = ref<string[]>([...layerTypes])

// 状态颜色映射
const statusColors: Record<string, string> = {
  '前期': '#f6bd16',
  '已开工': '#5ad8a6',
  '完工': '#5b8ff9',
}

// 项目数据 - 区域分布（用于ECharts柱状图+折线图）
const regionData = {
  cities: ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市'],
  counts: [720, 750, 620, 840, 670, 180, 730, 380, 560, 420, 290],
  investments: [65, 530, 105, 70, 185, 35, 75, 330, 120, 85, 48]
}

// 项目区域分布详情数据
const regionDetailData = [
  { city: '杭州市', totalCount: 720, buildingCount: 480, completedCount: 240, totalInvestment: 65, annualPlan: 22, completedInvestment: 15 },
  { city: '宁波市', totalCount: 750, buildingCount: 500, completedCount: 250, totalInvestment: 530, annualPlan: 180, completedInvestment: 125 },
  { city: '温州市', totalCount: 620, buildingCount: 410, completedCount: 210, totalInvestment: 105, annualPlan: 35, completedInvestment: 24 },
  { city: '嘉兴市', totalCount: 840, buildingCount: 560, completedCount: 280, totalInvestment: 70, annualPlan: 24, completedInvestment: 16 },
  { city: '湖州市', totalCount: 670, buildingCount: 445, completedCount: 225, totalInvestment: 185, annualPlan: 62, completedInvestment: 43 },
  { city: '绍兴市', totalCount: 180, buildingCount: 120, completedCount: 60, totalInvestment: 35, annualPlan: 12, completedInvestment: 8 },
  { city: '金华市', totalCount: 730, buildingCount: 485, completedCount: 245, totalInvestment: 75, annualPlan: 25, completedInvestment: 17 },
  { city: '衢州市', totalCount: 380, buildingCount: 252, completedCount: 128, totalInvestment: 330, annualPlan: 110, completedInvestment: 77 },
  { city: '台州市', totalCount: 560, buildingCount: 372, completedCount: 188, totalInvestment: 120, annualPlan: 40, completedInvestment: 28 },
  { city: '丽水市', totalCount: 420, buildingCount: 278, completedCount: 142, totalInvestment: 85, annualPlan: 28, completedInvestment: 19 },
  { city: '舟山市', totalCount: 290, buildingCount: 193, completedCount: 97, totalInvestment: 48, annualPlan: 16, completedInvestment: 11 },
]

// 浙江省总数（自动计算）
const regionTotal = {
  city: '浙江省',
  totalCount: regionDetailData.reduce((s, r) => s + r.totalCount, 0),
  buildingCount: regionDetailData.reduce((s, r) => s + r.buildingCount, 0),
  completedCount: regionDetailData.reduce((s, r) => s + r.completedCount, 0),
  totalInvestment: regionDetailData.reduce((s, r) => s + r.totalInvestment, 0),
  annualPlan: regionDetailData.reduce((s, r) => s + r.annualPlan, 0),
  completedInvestment: regionDetailData.reduce((s, r) => s + r.completedInvestment, 0),
}
const showRegionDetail = ref(false)
const showTypeDetail = ref(false)
const showProgressDetail = ref(false)

// 项目建设进度详情数据（11个地市）
const progressDetailData = [
  { city: '杭州市', planNewRoad: '180.5km', accumNewRoad: '168.2km', rateNewRoad: 93, planNewBridge: 12, accumNewBridge: 10, rateNewBridge: 83, planNewTunnel: 8, accumNewTunnel: 7, rateNewTunnel: 88, planProblemRoad: '95.2km', accumProblemRoad: '82.6km', rateProblemRoad: 87, planProblemBridge: 6, accumProblemBridge: 5, rateProblemBridge: 83, planProblemTunnel: 4, accumProblemTunnel: 3, rateProblemTunnel: 75 },
  { city: '宁波市', planNewRoad: '145.3km', accumNewRoad: '132.8km', rateNewRoad: 91, planNewBridge: 10, accumNewBridge: 8, rateNewBridge: 80, planNewTunnel: 6, accumNewTunnel: 5, rateNewTunnel: 83, planProblemRoad: '78.6km', accumProblemRoad: '68.2km', rateProblemRoad: 87, planProblemBridge: 5, accumProblemBridge: 4, rateProblemBridge: 80, planProblemTunnel: 3, accumProblemTunnel: 2, rateProblemTunnel: 67 },
  { city: '温州市', planNewRoad: '120.8km', accumNewRoad: '108.5km', rateNewRoad: 90, planNewBridge: 8, accumNewBridge: 6, rateNewBridge: 75, planNewTunnel: 5, accumNewTunnel: 4, rateNewTunnel: 80, planProblemRoad: '65.3km', accumProblemRoad: '55.8km', rateProblemRoad: 85, planProblemBridge: 4, accumProblemBridge: 3, rateProblemBridge: 75, planProblemTunnel: 2, accumProblemTunnel: 1, rateProblemTunnel: 50 },
  { city: '嘉兴市', planNewRoad: '98.6km', accumNewRoad: '88.2km', rateNewRoad: 89, planNewBridge: 6, accumNewBridge: 5, rateNewBridge: 83, planNewTunnel: 4, accumNewTunnel: 3, rateNewTunnel: 75, planProblemRoad: '52.1km', accumProblemRoad: '45.6km', rateProblemRoad: 88, planProblemBridge: 3, accumProblemBridge: 2, rateProblemBridge: 67, planProblemTunnel: 2, accumProblemTunnel: 2, rateProblemTunnel: 100 },
  { city: '湖州市', planNewRoad: '85.2km', accumNewRoad: '76.8km', rateNewRoad: 90, planNewBridge: 5, accumNewBridge: 4, rateNewBridge: 80, planNewTunnel: 3, accumNewTunnel: 2, rateNewTunnel: 67, planProblemRoad: '45.6km', accumProblemRoad: '38.2km', rateProblemRoad: 84, planProblemBridge: 3, accumProblemBridge: 2, rateProblemBridge: 67, planProblemTunnel: 1, accumProblemTunnel: 1, rateProblemTunnel: 100 },
  { city: '绍兴市', planNewRoad: '78.5km', accumNewRoad: '70.2km', rateNewRoad: 89, planNewBridge: 5, accumNewBridge: 4, rateNewBridge: 80, planNewTunnel: 3, accumNewTunnel: 2, rateNewTunnel: 67, planProblemRoad: '42.3km', accumProblemRoad: '36.5km', rateProblemRoad: 86, planProblemBridge: 2, accumProblemBridge: 2, rateProblemBridge: 100, planProblemTunnel: 1, accumProblemTunnel: 1, rateProblemTunnel: 100 },
  { city: '金华市', planNewRoad: '72.6km', accumNewRoad: '65.8km', rateNewRoad: 91, planNewBridge: 4, accumNewBridge: 3, rateNewBridge: 75, planNewTunnel: 3, accumNewTunnel: 3, rateNewTunnel: 100, planProblemRoad: '38.5km', accumProblemRoad: '32.6km', rateProblemRoad: 85, planProblemBridge: 2, accumProblemBridge: 1, rateProblemBridge: 50, planProblemTunnel: 1, accumProblemTunnel: 1, rateProblemTunnel: 100 },
  { city: '衢州市', planNewRoad: '58.3km', accumNewRoad: '52.6km', rateNewRoad: 90, planNewBridge: 3, accumNewBridge: 2, rateNewBridge: 67, planNewTunnel: 2, accumNewTunnel: 2, rateNewTunnel: 100, planProblemRoad: '32.8km', accumProblemRoad: '28.5km', rateProblemRoad: 87, planProblemBridge: 2, accumProblemBridge: 1, rateProblemBridge: 50, planProblemTunnel: 1, accumProblemTunnel: 0, rateProblemTunnel: 0 },
  { city: '台州市', planNewRoad: '52.6km', accumNewRoad: '47.2km', rateNewRoad: 90, planNewBridge: 3, accumNewBridge: 2, rateNewBridge: 67, planNewTunnel: 2, accumNewTunnel: 1, rateNewTunnel: 50, planProblemRoad: '28.6km', accumProblemRoad: '24.8km', rateProblemRoad: 87, planProblemBridge: 1, accumProblemBridge: 1, rateProblemBridge: 100, planProblemTunnel: 1, accumProblemTunnel: 1, rateProblemTunnel: 100 },
  { city: '丽水市', planNewRoad: '42.5km', accumNewRoad: '38.2km', rateNewRoad: 90, planNewBridge: 2, accumNewBridge: 2, rateNewBridge: 100, planNewTunnel: 2, accumNewTunnel: 1, rateNewTunnel: 50, planProblemRoad: '22.8km', accumProblemRoad: '19.6km', rateProblemRoad: 86, planProblemBridge: 1, accumProblemBridge: 1, rateProblemBridge: 100, planProblemTunnel: 1, accumProblemTunnel: 0, rateProblemTunnel: 0 },
  { city: '舟山市', planNewRoad: '31.1km', accumNewRoad: '28.4km', rateNewRoad: 91, planNewBridge: 2, accumNewBridge: 1, rateNewBridge: 50, planNewTunnel: 1, accumNewTunnel: 1, rateNewTunnel: 100, planProblemRoad: '18.2km', accumProblemRoad: '15.6km', rateProblemRoad: 86, planProblemBridge: 1, accumProblemBridge: 1, rateProblemBridge: 100, planProblemTunnel: 0, accumProblemTunnel: 0, rateProblemTunnel: 0 },
]
const calcRate = (plan: number, accum: number) => plan > 0 ? Math.round((accum / plan) * 100) : 0
const progressTotal = {
  city: '浙江省',
  planNewRoad: progressDetailData.reduce((s, r) => s + parseFloat(r.planNewRoad), 0).toFixed(1) + 'km',
  accumNewRoad: progressDetailData.reduce((s, r) => s + parseFloat(r.accumNewRoad), 0).toFixed(1) + 'km',
  rateNewRoad: calcRate(progressDetailData.reduce((s, r) => s + parseFloat(r.planNewRoad), 0), progressDetailData.reduce((s, r) => s + parseFloat(r.accumNewRoad), 0)),
  planNewBridge: progressDetailData.reduce((s, r) => s + r.planNewBridge, 0),
  accumNewBridge: progressDetailData.reduce((s, r) => s + r.accumNewBridge, 0),
  rateNewBridge: calcRate(progressDetailData.reduce((s, r) => s + r.planNewBridge, 0), progressDetailData.reduce((s, r) => s + r.accumNewBridge, 0)),
  planNewTunnel: progressDetailData.reduce((s, r) => s + r.planNewTunnel, 0),
  accumNewTunnel: progressDetailData.reduce((s, r) => s + r.accumNewTunnel, 0),
  rateNewTunnel: calcRate(progressDetailData.reduce((s, r) => s + r.planNewTunnel, 0), progressDetailData.reduce((s, r) => s + r.accumNewTunnel, 0)),
  planProblemRoad: progressDetailData.reduce((s, r) => s + parseFloat(r.planProblemRoad), 0).toFixed(1) + 'km',
  accumProblemRoad: progressDetailData.reduce((s, r) => s + parseFloat(r.accumProblemRoad), 0).toFixed(1) + 'km',
  rateProblemRoad: calcRate(progressDetailData.reduce((s, r) => s + parseFloat(r.planProblemRoad), 0), progressDetailData.reduce((s, r) => s + parseFloat(r.accumProblemRoad), 0)),
  planProblemBridge: progressDetailData.reduce((s, r) => s + r.planProblemBridge, 0),
  accumProblemBridge: progressDetailData.reduce((s, r) => s + r.accumProblemBridge, 0),
  rateProblemBridge: calcRate(progressDetailData.reduce((s, r) => s + r.planProblemBridge, 0), progressDetailData.reduce((s, r) => s + r.accumProblemBridge, 0)),
  planProblemTunnel: progressDetailData.reduce((s, r) => s + r.planProblemTunnel, 0),
  accumProblemTunnel: progressDetailData.reduce((s, r) => s + r.accumProblemTunnel, 0),
  rateProblemTunnel: calcRate(progressDetailData.reduce((s, r) => s + r.planProblemTunnel, 0), progressDetailData.reduce((s, r) => s + r.accumProblemTunnel, 0)),
}

// 项目类型分布详情数据（11个地市）
const typeDetailData = [
  { city: '杭州市', newRoad: 8, newBridge: 6, newTunnel: 5, problemRoad: 4, problemBridge: 3, problemTunnel: 2 },
  { city: '宁波市', newRoad: 6, newBridge: 5, newTunnel: 4, problemRoad: 3, problemBridge: 2, problemTunnel: 1 },
  { city: '温州市', newRoad: 5, newBridge: 4, newTunnel: 3, problemRoad: 2, problemBridge: 2, problemTunnel: 1 },
  { city: '嘉兴市', newRoad: 4, newBridge: 3, newTunnel: 2, problemRoad: 2, problemBridge: 1, problemTunnel: 1 },
  { city: '湖州市', newRoad: 3, newBridge: 2, newTunnel: 2, problemRoad: 1, problemBridge: 1, problemTunnel: 1 },
  { city: '绍兴市', newRoad: 3, newBridge: 2, newTunnel: 1, problemRoad: 1, problemBridge: 1, problemTunnel: 1 },
  { city: '金华市', newRoad: 2, newBridge: 2, newTunnel: 2, problemRoad: 1, problemBridge: 1, problemTunnel: 1 },
  { city: '衢州市', newRoad: 1, newBridge: 1, newTunnel: 1, problemRoad: 1, problemBridge: 1, problemTunnel: 1 },
  { city: '台州市', newRoad: 1, newBridge: 1, newTunnel: 1, problemRoad: 1, problemBridge: 1, problemTunnel: 0 },
  { city: '丽水市', newRoad: 1, newBridge: 1, newTunnel: 0, problemRoad: 1, problemBridge: 1, problemTunnel: 0 },
  { city: '舟山市', newRoad: 1, newBridge: 1, newTunnel: 1, problemRoad: 1, problemBridge: 1, problemTunnel: 0 },
]
const typeTotal = {
  city: '浙江省',
  newRoad: typeDetailData.reduce((s, r) => s + r.newRoad, 0),
  newBridge: typeDetailData.reduce((s, r) => s + r.newBridge, 0),
  newTunnel: typeDetailData.reduce((s, r) => s + r.newTunnel, 0),
  problemRoad: typeDetailData.reduce((s, r) => s + r.problemRoad, 0),
  problemBridge: typeDetailData.reduce((s, r) => s + r.problemBridge, 0),
  problemTunnel: typeDetailData.reduce((s, r) => s + r.problemTunnel, 0),
}

// 项目类型分布（6类）
const typeDistribution = [
  { name: '新建道路项目', count: 35, color: '#5b8ff9' },
  { name: '新建桥梁项目', count: 28, color: '#5ad8a6' },
  { name: '新建隧道项目', count: 22, color: '#f6bd16' },
  { name: '问题道路改造项目', count: 18, color: '#e86452' },
  { name: '问题桥梁改造项目', count: 15, color: '#6dc8ec' },
  { name: '问题隧道改造项目', count: 10, color: '#945fb9' },
]

// 项目建设进度（6个百分比指标）
const progressStages = [
  { stage: '新建道路', percent: 91, planLabel: '计划新建道路', planValue: '965.8km', accumLabel: '累计新建道路', accumValue: '876.9km', color: '#5b8ff9' },
  { stage: '新建桥梁', percent: 33, planLabel: '计划新建桥梁', planValue: '3座', accumLabel: '累计新建桥梁', accumValue: '1座', color: '#5ad8a6' },
  { stage: '新建隧道', percent: 33, planLabel: '计划新建隧道', planValue: '3座', accumLabel: '累计新建隧道', accumValue: '1座', color: '#f6bd16' },
  { stage: '改造道路', percent: 91, planLabel: '计划改造道路', planValue: '965.8km', accumLabel: '累计改造道路', accumValue: '876.9km', color: '#e86452' },
  { stage: '改造桥梁', percent: 33, planLabel: '计划改造桥梁', planValue: '3座', accumLabel: '累计改造桥梁', accumValue: '1座', color: '#6dc8ec' },
  { stage: '改造隧道', percent: 33, planLabel: '计划改造隧道', planValue: '3座', accumLabel: '累计改造隧道', accumValue: '1座', color: '#945fb9' },
]

// 项目概览指标
const totalProjects = 128
const buildingCount = 86
const completedCount = 42
const totalInvestment = 1250
const annualPlan = 380
const completedInvestment = 265

// 新建设施项目列表
const newProjects = [
  { name: '文一路延伸工程', region: '杭州市西湖区', type: '新建道路', year: '2024', constructionUnit: '杭州市西湖区城管局', contractor: '杭州道路建设有限公司', planStartDate: '2024-03-01', planEndDate: '2025-02-28', relatedFacility: '文一路延伸段', status: '已开工', position: [120.15, 30.28], progressList: [{ facilityName: '文一路延伸段', roadLength: '3200', totalRenovationLength: 3200, totalCompletedLength: 2100, computedProgress: '65.6%', statusDesc: '路基施工完成，路面铺设中', computedPlannedInvestment: 4500, computedCompletedInvestment: 2900, yearData: [{ year: '2024', renovationLength: 3200, completedLength: 2100, progress: '65.6%', statusDesc: '路基施工完成，路面铺设中', plannedInvestment: 4500, completedInvestment: 2900 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '秋石高架桥新建', region: '杭州市上城区', type: '新建桥梁', year: '2023', constructionUnit: '杭州市上城区城管局', contractor: '浙江桥梁工程有限公司', planStartDate: '2023-01-01', planEndDate: '2024-12-31', relatedFacility: '秋石高架桥', status: '完工', position: [120.20, 30.25], progressList: [{ facilityName: '秋石高架桥', totalRenovationLength: 1500, totalCompletedLength: 1500, computedProgress: '100%', statusDesc: '已完工验收', computedPlannedInvestment: 8000, computedCompletedInvestment: 7800, yearData: [{ year: '2023', renovationLength: 800, completedLength: 800, progress: '100%', statusDesc: '主体完工', plannedInvestment: 5000, completedInvestment: 4900 }, { year: '2024', renovationLength: 700, completedLength: 700, progress: '100%', statusDesc: '附属工程完工', plannedInvestment: 3000, completedInvestment: 2900 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
  { name: '萧山机场隧道工程', region: '杭州市萧山区', type: '新建隧道', year: '2024', constructionUnit: '杭州市萧山区城管局', contractor: '浙江隧道工程有限公司', planStartDate: '2024-06-01', planEndDate: '2026-05-31', relatedFacility: '萧山机场隧道', status: '前期', position: [120.33, 30.30], progressList: [], startAttachment: '', endAttachment: '' },
  { name: '运河大桥新建', region: '杭州市拱墅区', type: '新建桥梁', year: '2023', constructionUnit: '杭州市拱墅区城管局', contractor: '杭州桥梁工程有限公司', planStartDate: '2023-03-01', planEndDate: '2024-09-30', relatedFacility: '运河大桥', status: '已开工', position: [120.15, 30.32], progressList: [{ facilityName: '运河大桥', totalRenovationLength: 800, totalCompletedLength: 520, computedProgress: '65%', statusDesc: '桩基施工完成', computedPlannedInvestment: 3500, computedCompletedInvestment: 2200, yearData: [{ year: '2023', renovationLength: 400, completedLength: 400, progress: '100%', statusDesc: '桩基完成', plannedInvestment: 2000, completedInvestment: 1900 }, { year: '2024', renovationLength: 400, completedLength: 120, progress: '30%', statusDesc: '墩柱施工中', plannedInvestment: 1500, completedInvestment: 300 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '之江大桥新建', region: '杭州市西湖区', type: '新建桥梁', year: '2024', constructionUnit: '杭州市西湖区城管局', contractor: '浙江桥梁工程有限公司', planStartDate: '2024-05-01', planEndDate: '2026-04-30', relatedFacility: '之江大桥', status: '前期', position: [120.13, 30.22], progressList: [], startAttachment: '', endAttachment: '' },
  { name: '富阳江滨隧道', region: '杭州市富阳区', type: '新建隧道', year: '2023', constructionUnit: '杭州市富阳区城管局', contractor: '浙江隧道工程有限公司', planStartDate: '2023-02-01', planEndDate: '2024-12-31', relatedFacility: '富阳江滨隧道', status: '完工', position: [120.28, 30.18], progressList: [{ facilityName: '富阳江滨隧道', totalRenovationLength: 1800, totalCompletedLength: 1800, computedProgress: '100%', statusDesc: '已完工验收', computedPlannedInvestment: 12000, computedCompletedInvestment: 11500, yearData: [{ year: '2023', renovationLength: 900, completedLength: 900, progress: '100%', statusDesc: '贯通', plannedInvestment: 7000, completedInvestment: 6800 }, { year: '2024', renovationLength: 900, completedLength: 900, progress: '100%', statusDesc: '附属工程完成', plannedInvestment: 5000, completedInvestment: 4700 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
  { name: '余杭塘栖大道', region: '杭州市余杭区', type: '新建道路', year: '2024', constructionUnit: '杭州市余杭区城管局', contractor: '杭州道路建设有限公司', planStartDate: '2024-04-01', planEndDate: '2025-03-31', relatedFacility: '塘栖大道', status: '已开工', position: [120.08, 30.40], progressList: [{ facilityName: '塘栖大道', roadLength: '2500', totalRenovationLength: 2500, totalCompletedLength: 800, computedProgress: '32%', statusDesc: '路基施工中', computedPlannedInvestment: 3000, computedCompletedInvestment: 960, yearData: [{ year: '2024', renovationLength: 2500, completedLength: 800, progress: '32%', statusDesc: '路基施工中', plannedInvestment: 3000, completedInvestment: 960 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '钱塘路新建工程', region: '杭州市钱塘区', type: '新建道路', year: '2023', constructionUnit: '杭州市钱塘区城管局', contractor: '杭州道路建设有限公司', planStartDate: '2023-01-01', planEndDate: '2024-06-30', relatedFacility: '钱塘路', status: '完工', position: [119.98, 30.05], progressList: [{ facilityName: '钱塘路', roadLength: '1800', totalRenovationLength: 1800, totalCompletedLength: 1800, computedProgress: '100%', statusDesc: '已完工', computedPlannedInvestment: 2200, computedCompletedInvestment: 2100, yearData: [{ year: '2023', renovationLength: 1800, completedLength: 1800, progress: '100%', statusDesc: '已完工', plannedInvestment: 2200, completedInvestment: 2100 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
]

// 问题设施改造项目列表
const problemProjects = [
  { name: '德胜路改造工程', region: '杭州市拱墅区', type: '问题道路改造', year: '2024', constructionUnit: '杭州市拱墅区城管局', contractor: '杭州市政工程有限公司', planStartDate: '2024-02-01', planEndDate: '2024-12-31', relatedFacility: '德胜路', status: '已开工', position: [120.16, 30.34], progressList: [{ facilityName: '德胜路', totalRenovationLength: 2800, totalCompletedLength: 1500, computedProgress: '53.6%', statusDesc: '路面铣刨重铺中', computedPlannedInvestment: 3200, computedCompletedInvestment: 1700, yearData: [{ year: '2024', renovationLength: 2800, completedLength: 1500, progress: '53.6%', statusDesc: '路面铣刨重铺中', plannedInvestment: 3200, completedInvestment: 1700 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '环城北路改造', region: '杭州市下城区', type: '问题道路改造', year: '2023', constructionUnit: '杭州市下城区城管局', contractor: '杭州市政工程有限公司', planStartDate: '2023-03-01', planEndDate: '2024-03-31', relatedFacility: '环城北路', status: '完工', position: [120.18, 30.27], progressList: [{ facilityName: '环城北路', totalRenovationLength: 1600, totalCompletedLength: 1600, computedProgress: '100%', statusDesc: '已完工', computedPlannedInvestment: 2000, computedCompletedInvestment: 1900, yearData: [{ year: '2023', renovationLength: 1600, completedLength: 1600, progress: '100%', statusDesc: '已完工', plannedInvestment: 2000, completedInvestment: 1900 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
  { name: '文一路隧道修缮', region: '杭州市西湖区', type: '问题隧道改造', year: '2024', constructionUnit: '杭州市西湖区城管局', contractor: '浙江隧道工程有限公司', planStartDate: '2024-04-01', planEndDate: '2025-03-31', relatedFacility: '文一路隧道', status: '前期', position: [120.21, 30.20], progressList: [], startAttachment: '', endAttachment: '' },
  { name: '西溪路大桥加固', region: '杭州市西湖区', type: '问题桥梁改造', year: '2023', constructionUnit: '杭州市西湖区城管局', contractor: '杭州桥梁工程有限公司', planStartDate: '2023-06-01', planEndDate: '2024-05-31', relatedFacility: '西溪路大桥', status: '已开工', position: [120.09, 30.26], progressList: [{ facilityName: '西溪路大桥', totalRenovationLength: 450, totalCompletedLength: 280, computedProgress: '62.2%', statusDesc: '加固施工中', computedPlannedInvestment: 1500, computedCompletedInvestment: 930, yearData: [{ year: '2023', renovationLength: 200, completedLength: 200, progress: '100%', statusDesc: '基础加固完成', plannedInvestment: 800, completedInvestment: 780 }, { year: '2024', renovationLength: 250, completedLength: 80, progress: '32%', statusDesc: '桥面加固中', plannedInvestment: 700, completedInvestment: 150 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '临平新城市政路', region: '杭州市临平区', type: '问题道路改造', year: '2024', constructionUnit: '杭州市临平区城管局', contractor: '杭州市政工程有限公司', planStartDate: '2024-05-01', planEndDate: '2025-04-30', relatedFacility: '临平新城路', status: '前期', position: [120.31, 30.42], progressList: [], startAttachment: '', endAttachment: '' },
  { name: '良渚隧道改造', region: '杭州市余杭区', type: '问题隧道改造', year: '2023', constructionUnit: '杭州市余杭区城管局', contractor: '浙江隧道工程有限公司', planStartDate: '2023-04-01', planEndDate: '2024-03-31', relatedFacility: '良渚隧道', status: '完工', position: [120.03, 30.38], progressList: [{ facilityName: '良渚隧道', totalRenovationLength: 1200, totalCompletedLength: 1200, computedProgress: '100%', statusDesc: '已完工', computedPlannedInvestment: 5000, computedCompletedInvestment: 4800, yearData: [{ year: '2023', renovationLength: 1200, completedLength: 1200, progress: '100%', statusDesc: '已完工', plannedInvestment: 5000, completedInvestment: 4800 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
]

// 重点项目跟进列表
const keyProjects = [
  { name: '钱塘过江隧道', region: '杭州市上城区', type: '新建隧道', year: '2024', constructionUnit: '杭州市上城区城管局', contractor: '浙江隧道工程有限公司', planStartDate: '2024-01-01', planEndDate: '2027-12-31', relatedFacility: '钱塘过江隧道', status: '已开工', position: [120.21, 30.24], progressList: [{ facilityName: '钱塘过江隧道', totalRenovationLength: 4500, totalCompletedLength: 1200, computedProgress: '26.7%', statusDesc: '盾构掘进中', computedPlannedInvestment: 50000, computedCompletedInvestment: 13000, yearData: [{ year: '2024', renovationLength: 1500, completedLength: 1200, progress: '80%', statusDesc: '盾构掘进中', plannedInvestment: 20000, completedInvestment: 13000 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '亚运村配套道路', region: '杭州市萧山区', type: '问题道路改造', year: '2023', constructionUnit: '杭州市萧山区城管局', contractor: '杭州市政工程有限公司', planStartDate: '2023-06-01', planEndDate: '2024-06-30', relatedFacility: '亚运村道路', status: '完工', position: [120.23, 30.22], progressList: [{ facilityName: '亚运村道路', totalRenovationLength: 2000, totalCompletedLength: 2000, computedProgress: '100%', statusDesc: '已完工', computedPlannedInvestment: 3500, computedCompletedInvestment: 3400, yearData: [{ year: '2023', renovationLength: 2000, completedLength: 2000, progress: '100%', statusDesc: '已完工', plannedInvestment: 3500, completedInvestment: 3400 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
  { name: '临空经济示范区', region: '杭州市萧山区', type: '新建道路', year: '2024', constructionUnit: '杭州市萧山区城管局', contractor: '杭州道路建设有限公司', planStartDate: '2024-03-01', planEndDate: '2026-02-28', relatedFacility: '临空经济区道路', status: '前期', position: [120.37, 30.15], progressList: [], startAttachment: '', endAttachment: '' },
  { name: '城西科创大走廊', region: '杭州市余杭区', type: '新建道路', year: '2023', constructionUnit: '杭州市余杭区城管局', contractor: '杭州道路建设有限公司', planStartDate: '2023-01-01', planEndDate: '2025-12-31', relatedFacility: '科创大走廊道路', status: '已开工', position: [120.01, 30.30], progressList: [{ facilityName: '科创大走廊道路', roadLength: '5000', totalRenovationLength: 5000, totalCompletedLength: 3200, computedProgress: '64%', statusDesc: '路面施工中', computedPlannedInvestment: 8000, computedCompletedInvestment: 5100, yearData: [{ year: '2023', renovationLength: 2500, completedLength: 2500, progress: '100%', statusDesc: '路基完成', plannedInvestment: 4000, completedInvestment: 3900 }, { year: '2024', renovationLength: 2500, completedLength: 700, progress: '28%', statusDesc: '路面施工中', plannedInvestment: 4000, completedInvestment: 1200 }] }], startAttachment: '开工报告.pdf', endAttachment: '' },
  { name: '北部新城快速路', region: '杭州市余杭区', type: '新建道路', year: '2024', constructionUnit: '杭州市余杭区城管局', contractor: '杭州市政工程有限公司', planStartDate: '2024-06-01', planEndDate: '2026-05-31', relatedFacility: '北部新城快速路', status: '前期', position: [120.10, 30.38], progressList: [], startAttachment: '', endAttachment: '' },
  { name: '三江汇绿道工程', region: '杭州市西湖区', type: '新建道路', year: '2023', constructionUnit: '杭州市西湖区城管局', contractor: '杭州市政工程有限公司', planStartDate: '2023-03-01', planEndDate: '2024-09-30', relatedFacility: '三江汇绿道', status: '完工', position: [120.10, 30.18], progressList: [{ facilityName: '三江汇绿道', roadLength: '3000', totalRenovationLength: 3000, totalCompletedLength: 3000, computedProgress: '100%', statusDesc: '已完工', computedPlannedInvestment: 2500, computedCompletedInvestment: 2400, yearData: [{ year: '2023', renovationLength: 3000, completedLength: 3000, progress: '100%', statusDesc: '已完工', plannedInvestment: 2500, completedInvestment: 2400 }] }], startAttachment: '开工报告.pdf', endAttachment: '完工验收报告.pdf' },
]

// ===================== 查看详情弹窗 =====================
const detailModalVisible = ref(false)
const detailModalTitle = ref('')
const detailFilter = reactive({ region: '', projectName: '', year: '' })
let detailSourceData: any[] = []

const regionOptions = ['杭州市上城区', '杭州市下城区', '杭州市西湖区', '杭州市拱墅区', '杭州市萧山区', '杭州市余杭区', '杭州市临平区', '杭州市富阳区', '杭州市钱塘区', '杭州市滨江区', '杭州市临安区']

const filteredDetailData = computed(() => {
  return detailSourceData.filter(p => {
    if (detailFilter.region && p.region !== detailFilter.region) return false
    if (detailFilter.projectName && !p.name.includes(detailFilter.projectName)) return false
    if (detailFilter.year && p.year !== detailFilter.year) return false
    return true
  })
})

function openDetailModal(type: 'new' | 'problem' | 'key') {
  if (type === 'new') {
    detailSourceData = newProjects
    detailModalTitle.value = '新建设施项目详情'
  } else if (type === 'problem') {
    detailSourceData = problemProjects
    detailModalTitle.value = '问题设施改造项目详情'
  } else {
    detailSourceData = keyProjects
    detailModalTitle.value = '重点项目跟进详情'
  }
  detailFilter.region = ''
  detailFilter.projectName = ''
  detailFilter.year = ''
  detailModalVisible.value = true
}

function openViewModalFromDetail(index: number) {
  const p = filteredDetailData.value[index]
  viewRecord.value = { ...p }
  viewModalVisible.value = true
}

// ===================== 查看项目详情弹窗 =====================
const viewModalVisible = ref(false)
const viewRecord = ref<any>({})

const viewIsRoad = computed(() => viewRecord.value.type && viewRecord.value.type.includes('道路'))
const viewIsNewProject = computed(() => viewRecord.value.type && viewRecord.value.type.startsWith('新建'))

function openViewModal(list: any[], index: number) {
  const p = list[index]
  viewRecord.value = { ...p }
  viewModalVisible.value = true
}

function handleGoToDashboard() {
  router.push('/dashboard')
}

// 初始化地图
function initMap() {
  const AMap = (window as any).AMap
  if (!mapRef.value || !AMap) return
  if (map) map.destroy()
  map = new AMap.Map(mapRef.value, {
    zoom: 11,
    center: [120.15, 30.27],
    viewMode: '2D',
    dragEnable: true,
    zoomEnable: true,
    mapStyle: 'amap://styles/dark',
  })
  addProjectMarkers()
}

// 添加项目标记
function addProjectMarkers() {
  const AMap = (window as any).AMap
  if (!map || !AMap) return
  clearMarkers()
  const allProjects: any[] = [
    ...newProjects.map(p => ({ ...p, source: 'new' })),
    ...problemProjects.map(p => ({ ...p, source: 'problem' })),
    ...keyProjects.map(p => ({ ...p, source: 'key' })),
  ]
  allProjects.forEach(p => {
    const statusColor = statusColors[p.status] || '#5ad8a6'
    const marker = new AMap.Marker({
      position: new AMap.LngLat(p.position[0], p.position[1]),
      content: `<div style="width:12px;height:12px;border-radius:50%;background:${statusColor};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 6px ${statusColor}"></div>`,
      offset: new AMap.Pixel(-6, -6),
      extData: p,
    })
    marker.on('click', () => {
      const info = new AMap.InfoWindow({
        isCustom: true,
        autoMove: true,
        offset: new AMap.Pixel(0, -10),
        content: `<div style="background:rgba(13,31,60,0.95);border:1px solid rgba(100,160,255,0.3);border-radius:6px;padding:8px 12px;color:#e0e8f0;font-size:12px;min-width:180px;">
          <div style="font-weight:600;margin-bottom:4px;">${p.name}</div>
          <div>归属地区：${p.region}</div>
          <div>项目类型：${p.type}</div>
          <div>项目年份：${p.year}</div>
          <div>建设单位：${p.constructionUnit}</div>
          <div>施工单位：${p.contractor}</div>
          <div>关联设施：${p.relatedFacility}</div>
          <div>项目状态：<span style="color:${statusColor}">${p.status}</span></div>
        </div>`,
      })
      info.open(map, marker.getPosition())
    })
    // 根据图层筛选控制显示
    if (activeLayers.value.includes(p.type)) {
      map.add(marker)
    }
    allMarkers.push({ marker, data: p })
  })
}

// 清除所有标记
function clearMarkers() {
  const AMap = (window as any).AMap
  if (!map || !AMap) return
  allMarkers.forEach(({ marker }) => map.remove(marker))
  allMarkers = []
}

// 更新图层显示
function updateLayerVisibility() {
  const AMap = (window as any).AMap
  if (!map || !AMap) return
  allMarkers.forEach(({ marker, data }) => {
    if (activeLayers.value.includes(data.type)) {
      map.add(marker)
    } else {
      map.remove(marker)
    }
  })
}

// 切换图层
function toggleLayer(layer: string) {
  const idx = activeLayers.value.indexOf(layer)
  if (idx >= 0) {
    activeLayers.value.splice(idx, 1)
  } else {
    activeLayers.value.push(layer)
  }
  updateLayerVisibility()
}

// 定位项目
function locateProject(p: any) {
  const AMap = (window as any).AMap
  if (!map || !AMap || !p.position) return
  const statusColor = statusColors[p.status] || '#5ad8a6'
  map.setZoomAndCenter(14, new AMap.LngLat(p.position[0], p.position[1]))
  // 触发对应 marker 的点击弹窗
  const info = new AMap.InfoWindow({
    isCustom: true,
    autoMove: true,
    offset: new AMap.Pixel(0, -10),
    content: `<div style="background:rgba(13,31,60,0.95);border:1px solid rgba(100,160,255,0.3);border-radius:6px;padding:8px 12px;color:#e0e8f0;font-size:12px;min-width:180px;">
      <div style="font-weight:600;margin-bottom:4px;">${p.name}</div>
      <div>归属地区：${p.region}</div>
      <div>项目类型：${p.type}</div>
      <div>项目年份：${p.year}</div>
      <div>建设单位：${p.constructionUnit}</div>
      <div>施工单位：${p.contractor}</div>
      <div>关联设施：${p.relatedFacility}</div>
      <div>项目状态：<span style="color:${statusColor}">${p.status}</span></div>
    </div>`,
  })
  info.open(map, new AMap.LngLat(p.position[0], p.position[1]))
}

// 初始化区域分布图表（ECharts柱状图+折线图）
function initRegionChart() {
  const echarts = (window as any).echarts
  if (!regionChartRef.value || !echarts) return
  if (regionChart) regionChart.dispose()
  
  regionChart = echarts.init(regionChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(13,31,60,0.9)',
      borderColor: 'rgba(100,160,255,0.3)',
      textStyle: { color: '#e0e8f0', fontSize: 12 }
    },
    legend: {
      data: ['项目数量', '总投资'],
      top: 5,
      textStyle: { color: 'rgba(200,220,240,0.7)', fontSize: 11 }
    },
    grid: {
      left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true
    },
    xAxis: {
      type: 'category',
      data: regionData.cities,
      axisLine: { lineStyle: { color: 'rgba(100,160,255,0.2)' } },
      axisLabel: { color: 'rgba(200,220,240,0.6)', fontSize: 10 }
    },
    yAxis: [
      {
        type: 'value',
        name: '(个)',
        position: 'left',
        axisLine: { show: false },
        splitLine: { lineStyle: { color: 'rgba(100,160,255,0.1)', type: 'dashed' } },
        axisLabel: { color: 'rgba(200,220,240,0.6)', fontSize: 10 },
        nameTextStyle: { color: 'rgba(200,220,240,0.6)', fontSize: 10 }
      },
      {
        type: 'value',
        name: '(亿元)',
        position: 'right',
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: { color: 'rgba(200,220,240,0.6)', fontSize: 10 },
        nameTextStyle: { color: 'rgba(200,220,240,0.6)', fontSize: 10 }
      }
    ],
    series: [
      {
        name: '项目数量',
        type: 'bar',
        barWidth: '40%',
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#5ad8a6' },
            { offset: 1, color: 'rgba(90,216,166,0.3)' }
          ]),
          borderRadius: [4, 4, 0, 0]
        },
        data: regionData.counts
      },
      {
        name: '总投资',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#f6bd16', width: 2 },
        itemStyle: { color: '#f6bd16', borderColor: '#fff', borderWidth: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(246,189,22,0.3)' },
            { offset: 1, color: 'rgba(246,189,22,0.05)' }
          ])
        },
        data: regionData.investments
      }
    ]
  }
  regionChart.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    // 初始化地图
    const checkAMap = setInterval(() => {
      if ((window as any).AMap) {
        clearInterval(checkAMap)
        initMap()
      }
    }, 100)
    setTimeout(() => clearInterval(checkAMap), 5000)
    
    // 初始化ECharts
    const checkEcharts = setInterval(() => {
      if ((window as any).echarts) {
        clearInterval(checkEcharts)
        initRegionChart()
      }
    }, 100)
    setTimeout(() => clearInterval(checkEcharts), 5000)
  })
})

onUnmounted(() => {
  if (map) map.destroy()
  if (regionChart) regionChart.dispose()
})
</script>

<style scoped>
.construction-cockpit {
  width: 1920px; height: 1080px;
  background: #0a1628;
  display: flex; flex-direction: column;
  color: #e0e8f0;
  overflow: hidden;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 顶部导航 */
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
}
.cockpit-tab:hover { color: rgba(255,255,255,0.8); }
.cockpit-title {
  position: absolute; left: 50%; transform: translateX(-50%);
  font-size: 18px; font-weight: 600; letter-spacing: 2px;
  background: linear-gradient(90deg, #5b8ff9, #5ad8a6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.cockpit-nav { display: flex; gap: 20px; }
.nav-link { font-size: 13px; color: rgba(255,255,255,0.6); cursor: pointer; }
.nav-link:hover { color: #5b8ff9; }
.nav-link.active-nav { color: #5b8ff9; font-weight: 500; }

/* 主体布局 */
.cockpit-body {
  flex: 1; display: grid; grid-template-columns: 440px 1fr 440px;
  gap: 8px; padding: 8px; min-height: 0; overflow: hidden;
}
.panel { display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden; }
.panel-left { display: grid; grid-template-rows: 1fr 1fr 1fr; gap: 8px; min-height: 0; }
.panel-right { display: grid; grid-template-rows: 1fr 1fr 1fr; gap: 8px; min-height: 0; }

/* 中央区域 */
.center-area {
  display: flex; flex-direction: column; gap: 8px; min-height: 0; overflow: hidden;
}

/* 项目概览 */
.project-overview {
  display: flex; justify-content: space-around; align-items: center;
  background: linear-gradient(180deg, rgba(13,31,60,0.95), rgba(10,22,40,0.98));
  border: 1px solid rgba(100,160,255,0.12); border-radius: 8px;
  padding: 10px 8px; flex-shrink: 0;
}
.overview-item { text-align: center; }
.overview-value { font-size: 20px; font-weight: 700; }
.overview-label { font-size: 10px; color: rgba(200,220,240,0.6); margin-top: 2px; white-space: nowrap; }

/* 地图容器 */
.map-wrapper {
  flex: 1; position: relative; border-radius: 8px; overflow: hidden;
  border: 1px solid rgba(100,160,255,0.12); min-height: 0;
}
.amap-container { width: 100%; height: 100%; }

/* 底部图例控制面板 */
.map-legend {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 8px 10px; margin-top: 4px;
  background: rgba(10,22,40,0.9); border: 1px solid rgba(100,160,255,0.1); border-radius: 6px;
}
.legend-checkbox-panel {
  display: flex; flex-wrap: wrap; gap: 4px 10px;
}
.checkbox-item {
  display: flex; align-items: center; gap: 6px; cursor: pointer; user-select: none;
}
.custom-checkbox {
  width: 14px; height: 14px; border: 1px solid rgba(100,160,255,0.3);
  border-radius: 3px; display: flex; align-items: center; justify-content: center;
  background: rgba(10,22,40,0.6); transition: all 0.2s;
}
.custom-checkbox.checked {
  border-color: #5b8ff9; background: rgba(91,143,249,0.15);
}
.check-icon { width: 10px; height: 10px; }
.checkbox-label {
  font-size: 11px; color: rgba(200,220,240,0.8);
}
.legend-control-panel {
  display: flex; align-items: center;
}
.legend-items {
  display: flex; gap: 12px;
}
.legend-item {
  display: flex; align-items: center; gap: 4px;
  font-size: 11px; color: rgba(200,220,240,0.8);
}
.legend-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.5);
}

/* 卡片样式 */
.dark-card {
  background: linear-gradient(180deg, rgba(13,31,60,0.95), rgba(10,22,40,0.98));
  border: 1px solid rgba(100,160,255,0.12); border-radius: 8px; padding: 10px;
  display: flex; flex-direction: column; min-height: 0; overflow: hidden;
}
.card-title-row {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
}
.card-title {
  font-size: 13px; font-weight: 600; color: rgba(200,220,240,0.9);
  padding-left: 8px; border-left: 3px solid #5b8ff9;
}
.card-badge {
  font-size: 11px; background: rgba(91,143,249,0.2); color: #5b8ff9;
  padding: 2px 8px; border-radius: 10px;
}
.card-badge.warning { background: rgba(232,100,82,0.2); color: #e86452; }
.card-badge.key { background: rgba(246,189,22,0.2); color: #f6bd16; }

/* 查看详情按钮 */
.detail-btn {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 3px;
  border: 1px solid rgba(91,143,249,0.3);
  background: rgba(91,143,249,0.1);
  color: #5b8ff9;
  cursor: pointer;
  transition: all 0.2s;
}
.detail-btn:hover {
  background: rgba(91,143,249,0.2);
  border-color: rgba(91,143,249,0.5);
}

/* 图表区域 */
.chart-area { flex: 1; display: flex; flex-direction: column; min-height: 0; }

/* 区域分布 */
.region-list { display: flex; flex-direction: column; gap: 6px; }
.region-item { display: flex; align-items: center; gap: 6px; font-size: 11px; }
.region-name { width: 50px; color: rgba(200,220,240,0.7); text-align: right; flex-shrink: 0; }
.region-bar-wrap {
  flex: 1; height: 14px; background: rgba(100,160,255,0.06); border-radius: 3px; overflow: hidden;
}
.region-bar { height: 100%; border-radius: 3px; transition: width 0.6s ease; }
.region-count { width: 36px; color: rgba(200,220,240,0.8); font-size: 11px; }

/* 图表容器（ECharts） */
.chart-container {
  flex: 1; min-height: 0; width: 100%;
}

/* 类型分布网格 */
.type-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;
  height: 100%; align-content: center;
}
.type-item { 
  text-align: center; 
  padding: 8px 4px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.type-count { font-size: 22px; font-weight: 700; line-height: 1.3; }
.type-name { font-size: 10px; color: rgba(200,220,240,0.7); margin-top: 4px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* 建设进度网格 */
.progress-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px;
  height: 100%; align-content: center;
}
.progress-block {
  padding: 8px 6px; background: rgba(100,160,255,0.04); border-radius: 4px;
  border: 1px solid rgba(100,160,255,0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.progress-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 4px;
}
.progress-stage { font-size: 11px; color: rgba(200,220,240,0.85); font-weight: 500; }
.progress-percent { font-size: 16px; font-weight: 700; }
.progress-detail {
  font-size: 10px; color: rgba(200,220,240,0.7); line-height: 1.4;
}

/* 项目列表 */
.project-list {
  flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; min-height: 0;
}
.project-list::-webkit-scrollbar { width: 3px; }
.project-list::-webkit-scrollbar-thumb { background: rgba(100,160,255,0.2); border-radius: 2px; }
.project-item {
  padding: 6px 8px; border-radius: 4px; cursor: pointer;
  background: rgba(100,160,255,0.04); transition: all 0.2s;
  border: 1px solid transparent;
}
.project-item:hover {
  background: rgba(91,143,249,0.1); border-color: rgba(91,143,249,0.2);
}
.project-name { font-size: 12px; color: rgba(200,220,240,0.9); margin-bottom: 3px; }
.project-meta { display: flex; justify-content: space-between; font-size: 10px; }
.project-region { color: rgba(200,220,240,0.5); }
.project-status.online { color: #5ad8a6; }
.project-status.problem { color: #e86452; }
.project-progress { color: #f6bd16; }
.project-progress-bar {
  height: 3px; background: rgba(100,160,255,0.08); border-radius: 2px; margin-top: 4px; overflow: hidden;
}

/* 项目表格样式 */
.project-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}
.project-table thead {
  position: sticky;
  top: 0;
  background: rgba(10,22,40,0.98);
  z-index: 10;
}
.project-table th {
  padding: 6px 4px;
  text-align: left;
  color: rgba(200,220,240,0.7);
  font-weight: 500;
  border-bottom: 1px solid rgba(100,160,255,0.15);
  white-space: nowrap;
}
.project-table tbody tr {
  cursor: pointer;
  transition: background 0.2s;
}
.project-table tbody tr:hover {
  background: rgba(91,143,249,0.08);
}
.project-table td {
  padding: 5px 4px;
  color: rgba(200,220,240,0.85);
  border-bottom: 1px solid rgba(100,160,255,0.06);
}

/* 项目状态标签 */
.status-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 500;
}
.status-tag.前期 {
  background: rgba(246,189,22,0.15);
  color: #f6bd16;
}
.status-tag.已开工 {
  background: rgba(90,216,166,0.15);
  color: #5ad8a6;
}
.status-tag.完工 {
  background: rgba(91,143,249,0.15);
  color: #5b8ff9;
}
.project-progress-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

/* 弹窗样式 */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
}
.modal-container {
  background: linear-gradient(180deg, rgba(13,31,60,0.98), rgba(10,22,40,0.99));
  border: 1px solid rgba(100,160,255,0.2); border-radius: 8px;
  width: 800px; max-height: 80vh; display: flex; flex-direction: column;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
.modal-container.modal-wide {
  width: 1400px;
}
.modal-wide .detail-table {
  font-size: 11px;
}
.modal-wide .detail-table th,
.modal-wide .detail-table td {
  padding: 6px 4px;
  white-space: nowrap;
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; border-bottom: 1px solid rgba(100,160,255,0.15);
}
.modal-title {
  font-size: 14px; font-weight: 600; color: rgba(200,220,240,0.9);
}
.modal-close {
  font-size: 20px; color: rgba(200,220,240,0.5); cursor: pointer;
  line-height: 1; transition: color 0.2s;
}
.modal-close:hover { color: rgba(200,220,240,0.9); }
.modal-body {
  flex: 1; overflow-y: auto; padding: 12px 16px;
}
.detail-table {
  width: 100%; border-collapse: collapse; font-size: 12px;
}
.detail-table th {
  padding: 8px 6px; text-align: left;
  color: rgba(200,220,240,0.7); font-weight: 500;
  border-bottom: 1px solid rgba(100,160,255,0.15);
  white-space: nowrap;
}
.detail-table td {
  padding: 7px 6px; color: rgba(200,220,240,0.85);
  border-bottom: 1px solid rgba(100,160,255,0.06);
}
.detail-table tbody tr:hover {
  background: rgba(91,143,249,0.06);
}
.detail-table .total-row {
  background: rgba(91,143,249,0.1);
  font-weight: 600;
}
.detail-table .total-row td {
  color: #5b8ff9;
  border-top: 1px solid rgba(100,160,255,0.2);
}

/* 操作按钮 */
.action-btn {
  background: rgba(91,143,249,0.15);
  color: #5b8ff9;
  border: 1px solid rgba(91,143,249,0.3);
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.action-btn:hover {
  background: rgba(91,143,249,0.3);
  border-color: #5b8ff9;
}

/* 筛选行 */
.filter-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: center;
}
.dark-select, .dark-input {
  background: rgba(20,30,50,0.8);
  border: 1px solid rgba(100,160,255,0.2);
  color: #e0e6f0;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 13px;
  outline: none;
}
.dark-select:focus, .dark-input:focus {
  border-color: #5b8ff9;
}
.dark-select option {
  background: #1a2640;
  color: #e0e6f0;
}
.dark-btn {
  background: rgba(91,143,249,0.15);
  color: #5b8ff9;
  border: 1px solid rgba(91,143,249,0.3);
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
}
.dark-btn:hover {
  background: rgba(91,143,249,0.3);
}

/* 深色详情弹窗 */
.dark-detail-modal {
  background: linear-gradient(135deg, #1a2640 0%, #1e3050 100%);
  border: 1px solid rgba(100,160,255,0.2);
}
.dark-detail-modal .modal-header {
  border-bottom: 1px solid rgba(100,160,255,0.15);
}
.dark-detail-modal .modal-title {
  color: #e0e6f0;
}
.dark-detail-body {
  color: #c0c8d8;
}
.dark-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
}
.dark-form-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dark-form-item label {
  color: #8090b0;
  font-size: 12px;
  font-weight: 500;
}
.dark-form-item span {
  color: #e0e6f0;
  font-size: 14px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(100,160,255,0.08);
}

/* 深色分区标题 */
.dark-section-title {
  color: #5b8ff9;
  font-size: 14px;
  font-weight: 600;
  margin: 20px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(100,160,255,0.15);
}

/* 进度块 */
.dark-progress-block {
  background: rgba(20,30,50,0.6);
  border: 1px solid rgba(100,160,255,0.1);
  border-radius: 6px;
  padding: 14px;
  margin-bottom: 12px;
}
.dark-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.dark-progress-header span:first-child {
  color: #e0e6f0;
  font-size: 14px;
  font-weight: 500;
}
.dark-progress-pct {
  color: #5ad8a6;
  font-size: 16px;
  font-weight: 700;
}
.dark-progress-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(100,160,255,0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}
.dark-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #5b8ff9, #5ad8a6);
  border-radius: 4px;
  transition: width 0.3s;
}
.dark-progress-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8090b0;
  margin-bottom: 10px;
}

/* 进度年份明细表 */
.dark-progress-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.dark-progress-table th {
  background: rgba(91,143,249,0.12);
  color: #8090b0;
  padding: 6px 10px;
  text-align: left;
  font-weight: 500;
  border-bottom: 1px solid rgba(100,160,255,0.15);
}
.dark-progress-table td {
  color: #c0c8d8;
  padding: 6px 10px;
  border-bottom: 1px solid rgba(100,160,255,0.06);
}
.dark-progress-table tbody tr:hover {
  background: rgba(91,143,249,0.06);
}

/* 空数据提示 */
.dark-empty {
  color: #607090;
  font-size: 13px;
  text-align: center;
  padding: 20px 0;
}
</style>
