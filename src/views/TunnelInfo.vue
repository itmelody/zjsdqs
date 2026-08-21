<template>
  <div class="tunnel-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <HomeOutlined />
          <span>档案管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>基础信息管理</a-breadcrumb-item>
        <a-breadcrumb-item>隧道信息</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <a-form :model="searchForm" layout="inline">
        <a-form-item label="归属地区">
          <a-select
            v-model:value="searchForm.region"
            placeholder="请选择归属地区"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in regionOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="隧道名称">
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入隧道名称"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="隧道类型">
          <a-select
            v-model:value="searchForm.type"
            placeholder="请选择隧道类型"
            style="width: 200px"
            allow-clear
          >
            <a-select-opt-group label="城市道路隧道">
              <a-select-option
                v-for="item in tunnelTypeOptions.filter(i => i.group === '城市道路隧道')"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select-opt-group>
            <a-select-opt-group label="人行地道">
              <a-select-option
                v-for="item in tunnelTypeOptions.filter(i => i.group === '人行地道')"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <!-- 展开后的筛选条件 -->
        <template v-if="searchExpanded">
          <a-form-item label="城市道路隧道分类">
            <a-select
              v-model:value="searchForm.cityClassification"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in cityClassificationOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否地下隧道">
            <a-select
              v-model:value="searchForm.isUnderground"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in isUndergroundOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="综合评价等级">
            <a-select
              v-model:value="searchForm.evalLevel"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in evalLevelOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="searchForm.status"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in statusOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="数据是否完善">
            <a-select
              v-model:value="searchForm.dataComplete"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in dataCompleteOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="发布状态">
            <a-select
              v-model:value="searchForm.publishStatus"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="检测是否超期">
            <a-select
              v-model:value="searchForm.isOverdue"
              placeholder="请选择"
              style="width: 200px"
              allow-clear
            >
              <a-select-option
                v-for="item in isOverdueOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </template>
        <a-form-item>
          <a-button @click="handleReset" style="margin-right: 8px">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button type="link" @click="searchExpanded = !searchExpanded" class="expand-toggle-btn">
            {{ searchExpanded ? '收起' : '展开' }}
            <DownOutlined v-if="!searchExpanded" />
            <UpOutlined v-else />
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="action-bar-left">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          导出
        </a-button>
        <a-button @click="handleBatchImport">
          <template #icon><UploadOutlined /></template>
          批量导入
        </a-button>
        <a-button @click="handleTemplateDownload">
          <template #icon><DownloadOutlined /></template>
          模版下载
        </a-button>
        <a-button danger @click="handleBatchDelete" :disabled="selectedRowKeys.length === 0">
          <template #icon><DeleteOutlined /></template>
          批量删除
        </a-button>
        <a-button @click="handleBatchFill" :disabled="selectedRowKeys.length === 0">
          <template #icon><EditOutlined /></template>
          批量填写
        </a-button>
        <a-button @click="handleOpenTunnelMap">
          <template #icon><EnvironmentOutlined /></template>
          隧道地图
        </a-button>
        <span class="stat-tag" v-if="incompleteCount > 0">
          未完善信息的{{ incompleteCount }}条；未完成本年度评价任务的{{ incompleteCount }}条
        </span>
      </div>
      <div class="action-bar-right">
        <a-button type="link" @click="handleRefresh">
          <template #icon><ReloadOutlined /></template>
        </a-button>
        <a-button type="link">
          <template #icon><SettingOutlined /></template>
        </a-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading"
      :row-selection="rowSelection"
      :pagination="false"
      rowKey="key"
      size="middle"
      :scroll="{ x: 2000 }"
    >
      <template #bodyCell="{ column, record }">
        <!-- 隧道类型 -->
        <template v-if="column.key === 'type'">
          <a-tag :color="getTunnelTypeColor(record.type)">{{ record.type }}</a-tag>
        </template>
        <!-- 是否地下隧道 -->
        <template v-else-if="column.key === 'isUnderground'">
          {{ record.isUnderground ? '是' : '否' }}
        </template>
        <!-- 数据是否完善 -->
        <template v-else-if="column.key === 'dataComplete'">
          <a-tag :color="record.dataComplete ? 'success' : 'error'">
            {{ record.dataComplete ? '是' : '否' }}
          </a-tag>
        </template>
        <!-- 发布状态 -->
        <template v-else-if="column.key === 'publishStatus'">
          <a-tag :color="record.publishStatus === '已发布' ? 'blue' : 'default'">
            {{ record.publishStatus }}
          </a-tag>
        </template>
        <!-- 检测是否超期 -->
        <template v-else-if="column.key === 'isOverdue'">
          <span :style="{ color: record.isOverdue === '已超期' ? '#f5222d' : '' }">
            {{ record.isOverdue }}
          </span>
        </template>
        <!-- 综合评价等级 -->
        <template v-else-if="column.key === 'evalLevel'">
          <a-tag :color="getEvalLevelColor(record.evalLevel)">{{ record.evalLevel }}</a-tag>
        </template>

        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <div class="table-actions">
            <a-button type="link" size="small" class="table-actions-view" @click="handleView(record)">
              查看
            </a-button>
            <a-button type="link" size="small" class="table-actions-edit" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-button type="link" size="small" class="table-actions-delete" @click="handleDelete(record)">
              删除
            </a-button>
            <a-button type="link" size="small" class="table-actions-log" @click="handleLog(record)">
              日志
            </a-button>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :show-total="((total: number) => `共${total}条`) as any"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>

    <!-- 新增/编辑/查看弹窗 -->
    <a-modal
      v-model:open="addModalVisible"
      :footer="null"
      width="1000px"
      :body-style="{ padding: '0' }"
      class="add-tunnel-modal"
    >
      <template #title>
        <div class="add-modal-header">
          <span class="add-modal-title">{{ modalTitle }}</span>
        </div>
      </template>
      <div class="add-tunnel-content">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="basic" tab="基础信息">
            <div class="add-tunnel-form">
              <a-form :model="addForm" layout="horizontal" :label-col="{ style: { width: '100px' } }" :disabled="isViewMode">
                <!-- 基础信息区域 -->
                <div class="form-section">
                  <div class="form-section-title">基础信息</div>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="隧道名称" required>
                        <a-input v-model:value="addForm.name" placeholder="请输入隧道名称" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="隧道类型" required>
                        <a-select v-model:value="addForm.type" placeholder="请选择">
                          <a-select-opt-group label="城市道路隧道">
                            <a-select-option
                              v-for="item in tunnelTypeOptions.filter(i => i.group === '城市道路隧道')"
                              :key="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select-opt-group>
                          <a-select-opt-group label="人行地道">
                            <a-select-option
                              v-for="item in tunnelTypeOptions.filter(i => i.group === '人行地道')"
                              :key="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select-opt-group>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="衬砌类型" required>
                        <a-textarea v-model:value="addForm.liningType" placeholder="请输入衬砌类型" :rows="2" disabled style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="归属地区" required>
                        <a-select v-model:value="addForm.region" placeholder="请选择街道/乡镇">
                          <a-select-option
                            v-for="item in regionOptions"
                            :key="item.value"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="8" align="middle">
                    <a-col :span="18">
                      <a-form-item label="隧道位置" required>
                        <a-input v-model:value="addForm.location" placeholder="请输入隧道位置" disabled style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item class="location-btn-item" :colon="false" label=" ">
                        <a-button type="primary" size="small" class="location-btn">选择点位位置</a-button>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <!-- 城市道路隧道特有字段 -->
                  <template v-if="addForm.type === '城市道路隧道'">
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="城市道路隧道分类" required>
                          <a-select v-model:value="addForm.cityClassification" placeholder="请选择">
                            <a-select-option
                              v-for="item in cityClassificationOptions"
                              :key="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="是否地下隧道" required>
                          <a-radio-group v-model:value="addForm.isUnderground">
                            <a-radio :value="false">否</a-radio>
                            <a-radio :value="true">是</a-radio>
                          </a-radio-group>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </template>
                </div>

                <!-- 三级责任体系 -->
                <div class="form-section">
                  <div class="form-section-title">三级责任体系</div>
                  <!-- 行业主管单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">行业主管单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.industryUnit" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.industryPerson" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.industryContact" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 设施管理单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">设施管理单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.facilityUnit" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.facilityPerson" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.facilityContact" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 设施养护单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">设施养护单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.maintainUnit" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.maintainPerson" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="责任人联系方式" required>
                          <a-input v-model:value="addForm.maintainContact" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 公安交警联动单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">公安交警联动单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.policeUnit" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系人" required>
                          <a-input v-model:value="addForm.policeContact" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.policeContactPhone" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>

                <!-- 其他信息 -->
                <div class="form-section">
                  <div class="form-section-title">其他信息</div>
                  <a-row :gutter="24">
                    <a-col :span="24">
                      <a-form-item label="是否有多个隧道单元" required>
                        <a-radio-group v-model:value="addForm.hasMultipleUnits">
                          <a-radio :value="false">否</a-radio>
                          <a-radio :value="true">是</a-radio>
                        </a-radio-group>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>
          <!-- 资料卡页签（hasMultiUnit=否→隧道资料卡；=是→隧道单元1/2资料卡） -->
          <a-tab-pane
            v-for="card in cardTabs"
            :key="card.key"
            :tab="card.tab"
          >
            <div class="tunnel-card-form">
              <!-- 资料卡下载（仅查看模式） -->
              <div v-if="isViewMode" style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <a-form :model="card.form" layout="horizontal" :label-col="{ style: { width: '120px' } }" :disabled="isViewMode">
                <!-- 4个分组：行政识别/结构技术/附属设施/档案资料 -->
                <div v-for="section in cardSections" :key="section.title" class="card-section">
                  <div class="card-section-title">{{ section.title }}</div>
                  <a-table :show-header="false" :pagination="false" :data-source="section.rows" bordered>
                    <a-table-column v-for="col in 3" :key="col" :width="col === 2 ? 300 : 200">
                      <template #default="{ record }">
                        <template v-if="record[`key${col}` as keyof typeof record]">
                          <a-row :gutter="8" align="middle">
                            <a-col :span="10" class="card-cell-label">{{ record[`label${col}` as keyof typeof record] }}</a-col>
                            <a-col :span="14" class="card-cell-value">
                              <component
                                :is="getCardFieldComponent(record[`key${col}` as keyof typeof record] as string)"
                                v-bind="getCardFieldProps(record[`key${col}` as keyof typeof record] as string)"
                                v-model:value="(card.form as any)[record[`key${col}` as keyof typeof record] as string]"
                                style="width: 100%"
                              />
                              <span v-if="cardNumberUnitFields.has(record[`key${col}` as keyof typeof record] as string)" class="card-unit-suffix">{{ cardNumberUnitFields.get(record[`key${col}` as keyof typeof record] as string) }}</span>
                            </a-col>
                          </a-row>
                        </template>
                        <span v-else></span>
                      </template>
                    </a-table-column>
                  </a-table>
                </div>

                <!-- 隧道概况 -->
                <div class="card-section">
                  <a-form-item label="隧道概况">
                    <a-textarea
                      v-model:value="card.form.overview"
                      :rows="4"
                      :maxlength="2000"
                      show-count
                      placeholder=""
                    />
                  </a-form-item>
                </div>

                <!-- 附件 -->
                <div class="card-section">
                  <div class="card-section-title">附件</div>
                  <a-row :gutter="[24, 8]">
                    <a-col :span="8" v-for="item in attachmentItems" :key="item.key">
                      <a-form-item :label="item.label" :label-col="{ style: { width: '120px' } }">
                        <a-upload :before-upload="() => false" :disabled="isViewMode">
                          <a-button size="small" :disabled="isViewMode">
                            <template #icon><UploadOutlined /></template>
                            上传文件
                          </a-button>
                        </a-upload>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>

                <!-- 附照 -->
                <div class="card-section">
                  <a-form-item label="附照" :label-col="{ style: { width: '120px' } }">
                    <span style="color: rgba(0,0,0,0.45); margin-right: 8px">（隧道右洞进洞口）（隧道左洞进洞口）</span>
                    <a-upload :before-upload="() => false" :disabled="isViewMode" list-type="picture-card">
                      <a-button :disabled="isViewMode" type="dashed">
                        <template #icon><PlusOutlined /></template>
                      </a-button>
                    </a-upload>
                  </a-form-item>
                </div>

                <!-- 制表信息 -->
                <div class="card-section">
                  <h3 class="card-section-title">制表信息</h3>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item label="审定">
                        <a-input v-model:value="card.form.review" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="复核">
                        <a-input v-model:value="card.form.check" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="制表">
                        <a-input v-model:value="card.form.drafting" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="日期">
                        <a-date-picker v-model:value="card.form.cardDate" value-format="YYYY-MM-DD" style="width: 100%" placeholder="请选择日期" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 人行地道资料卡 Tab（当隧道类型为人行地道时显示） -->
          <a-tab-pane
            v-if="currentViewRecord && ((isViewMode && currentViewRecord.type === '人行地道') || (!isViewMode && addForm.type === '人行地道'))"
            key="underpass" tab="人行地道资料卡"
          >
            <!-- 查看模式：a-descriptions 3列 -->
            <div v-if="isViewMode" class="tunnel-card-form">
              <div style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <div v-for="grp in underpassViewGroups" :key="grp.title" class="card-section">
                <div class="card-section-title">{{ grp.title }}</div>
                <a-descriptions :column="3" size="small" bordered>
                  <a-descriptions-item
                    v-for="item in grp.rows"
                    :key="item.label"
                    :label="item.label"
                    :label-style="{ width: '130px' }"
                  >
                    {{ item.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
            <!-- 编辑模式：可编辑表单 -->
            <div v-else class="tunnel-card-form">
              <a-form :model="underpassCardForm" layout="horizontal" :label-col="{ style: { width: '120px' } }" :disabled="isViewMode">
                <div v-for="grp in underpassEditGroups" :key="grp.title" class="card-section">
                  <div class="card-section-title">{{ grp.title }}</div>
                  <a-table :show-header="false" :pagination="false" :data-source="underpassEditGridData(grp.start, grp.end)" bordered>
                    <a-table-column v-for="col in 3" :key="col" :width="col === 2 ? 300 : 200">
                      <template #default="{ record }">
                        <template v-if="record[`key${col}` as keyof typeof record]">
                          <a-row :gutter="8" align="middle">
                            <a-col :span="10" class="card-cell-label">{{ record[`label${col}` as keyof typeof record] }}</a-col>
                            <a-col :span="14" class="card-cell-value">
                              <a-input
                                v-model:value="underpassCardForm[record[`key${col}` as keyof typeof record] as string]"
                                style="width: 100%"
                              />
                            </a-col>
                          </a-row>
                        </template>
                        <span v-else></span>
                      </template>
                    </a-table-column>
                  </a-table>
                </div>
                <!-- 制表信息 -->
                <div class="card-section">
                  <h3 class="card-section-title">制表信息</h3>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item label="审定">
                        <a-input v-model:value="underpassCardForm.audit" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="复核">
                        <a-input v-model:value="underpassCardForm.review" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="制表">
                        <a-input v-model:value="underpassCardForm.draft" placeholder="" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="日期">
                        <a-date-picker v-model:value="underpassCardForm.cardDate" value-format="YYYY-MM-DD" style="width: 100%" placeholder="请选择日期" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 检测整改记录 Tab（仅查看模式） -->
          <a-tab-pane v-if="isViewMode && currentViewRecord" key="inspect" tab="检测整改记录">
            <div class="tunnel-inspect-form">
              <a-table
                :columns="tunnelInspectCols"
                :data-source="(currentViewRecord.detectRecords || []) as any[]"
                :pagination="false"
                row-key="id"
                size="middle"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'grade'">
                    <a-tag :color="record.grade === 'D' ? 'red' : 'blue'">{{ record.grade }}</a-tag>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-button type="link" size="small">定期检测报告</a-button>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
        <!-- 底部操作栏 -->
        <div class="add-modal-footer">
          <template v-if="isViewMode">
            <a-button @click="handleCancel">关 闭</a-button>
          </template>
          <template v-else>
            <a-button type="primary" @click="handleSaveDraft">暂存草稿</a-button>
            <a-button type="primary" @click="handleSubmit">提 交</a-button>
            <a-button @click="handleResetForm">重 置</a-button>
            <a-button @click="handleCancel">关 闭</a-button>
          </template>
        </div>
      </div>
    </a-modal>

    <!-- 隧道地图弹窗 -->
    <a-modal
      v-model:open="tunnelMapModalVisible"
      title="隧道地图"
      width="800px"
      :footer="null"
    >
      <div class="tunnel-map-placeholder">
        <EnvironmentOutlined style="font-size: 48px; color: #2A64FF" />
        <p style="margin-top: 16px; color: rgba(0, 0, 0, 0.45)">隧道地图功能开发中</p>
      </div>
    </a-modal>

    <!-- 批量填写弹窗 -->
    <a-modal
      v-model:open="batchFillModalVisible"
      :footer="null"
      width="800px"
      :body-style="{ padding: '0' }"
      class="batch-fill-modal"
    >
      <template #title>
        <div class="add-modal-header">
          <span class="add-modal-title">批量填写三级责任体系</span>
        </div>
      </template>
      <div class="add-tunnel-content">
        <div class="add-tunnel-form">
          <a-form :model="batchFillForm" layout="horizontal" :label-col="{ style: { width: '100px' } }">
            <!-- 行业主管单位 -->
            <div class="form-section">
              <div class="form-section-title">行业主管单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.industryUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.industryPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.industryContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <!-- 设施管理单位 -->
            <div class="form-section">
              <div class="form-section-title">设施管理单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.facilityUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.facilityPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.facilityContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <!-- 设施养护单位 -->
            <div class="form-section">
              <div class="form-section-title">设施养护单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.maintainUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.maintainPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.maintainContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <!-- 公安交警联动单位 -->
            <div class="form-section">
              <div class="form-section-title">公安交警联动单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.policeUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="联系人">
                    <a-input v-model:value="batchFillForm.policeContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.policeContactPhone" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
        <!-- 底部操作栏 -->
        <div class="add-modal-footer">
          <a-button @click="handleCancelBatchFill">取 消</a-button>
          <a-button type="primary" @click="handleSubmitBatchFill">确 定</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, markRaw } from 'vue'
import { useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  Input as AInput,
  DatePicker as ADatePicker,
  Select as ASelect,
} from 'ant-design-vue'
import {
  HomeOutlined,
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons-vue'
import type { TunnelItem, TunnelSearchParams } from '@/types/tunnel'
import {
  getTunnelList,
  tunnelTypeOptions,
  regionOptions,
  cityClassificationOptions,
  evalLevelOptions,
  isUndergroundOptions,
  publishStatusOptions,
  isOverdueOptions,
  dataCompleteOptions,
  statusOptions,
} from '@/utils/mockTunnelData'

const route = useRoute()

// 是否显示检测/评价单位列（从检测评价菜单进入时显示）
const showEvalUnit = computed(() => route.query.showEvalUnit === '1')

// 搜索展开状态
const searchExpanded = ref(false)

// 搜索表单
const searchForm = reactive<TunnelSearchParams>({
  region: undefined,
  name: undefined,
  type: undefined,
  cityClassification: undefined,
  isUnderground: undefined,
  evalLevel: undefined,
  status: '在用',
  dataComplete: undefined,
  publishStatus: undefined,
  isOverdue: undefined,
  page: 1,
  pageSize: 10,
})

// 表格数据
const tableData = ref<TunnelItem[]>([])
const loading = ref(false)

// 选中的行
const selectedRowKeys = ref<string[]>([])

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 行选择配置
const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: string[]) => {
    selectedRowKeys.value = keys
  },
}))

// 未完善信息数量
const incompleteCount = computed(() => {
  return tableData.value.filter((item) => !item.dataComplete).length
})

// 弹窗相关
const addModalVisible = ref(false)
const activeTab = ref('basic')
const formMode = ref<'add' | 'edit' | 'view'>('add')
const isViewMode = computed(() => formMode.value === 'view')
// 当前查看/编辑的记录
const currentViewRecord = ref<TunnelItem | null>(null)
const modalTitle = computed(() => {
  switch (formMode.value) {
    case 'add': return '新增隧道'
    case 'edit': return '编辑隧道'
    case 'view': return '查看隧道'
    default: return '新增隧道'
  }
})

// 表单数据
const addForm = reactive({
  name: '',
  type: undefined as string | undefined,
  liningType: '',
  region: undefined as string | undefined,
  location: '',
  cityClassification: undefined as string | undefined,
  isUnderground: false,
  // 三级责任体系 - 行业主管单位
  industryUnit: '',
  industryPerson: '',
  industryContact: '',
  // 三级责任体系 - 设施管理单位
  facilityUnit: '',
  facilityPerson: '',
  facilityContact: '',
  // 三级责任体系 - 设施养护单位
  maintainUnit: '',
  maintainPerson: '',
  maintainContact: '',
  // 三级责任体系 - 公安交警联动单位
  policeUnit: '',
  policeContact: '',
  policeContactPhone: '',
  // 其他信息
  hasMultipleUnits: false,
})

// ==================== 资料卡表单 ====================

// 资料卡表单类型
interface CardForm {
  // 一般资料
  name: string
  roadName: string
  district: string
  manageUnit: string
  maintainUnit: string
  crossOver: string
  buildDate: string | undefined
  buildUnit: string
  totalCost: string
  surveyUnit: string
  maintainCategory: string | undefined
  designUnit: string
  maintainGrade: string | undefined
  superviseUnit: string
  roadGrade: string | undefined
  constructUnit: string
  designLanes: string
  designLoad: string
  designSpeed: string
  designFlow: string
  emergencyPhone: string
  // 结构资料
  roadCrossSection: string
  motorPavement: string
  nonMotorPavement: string
  sidewalkPavement: string
  drivewayLengthSingle: string
  drivewayWidth: string
  drivewayLength: string
  sidewalkWidth: string
  motorMaxSlope: string
  nonMotorMaxSlope: string
  crossSlope: string
  waterproofGrade: string
  geology: string
  liningType: string | undefined
  liningThickness: string
  portalForm: string
  ceilingDecoration: string
  ceilingDecorationArea: string
  wallDecoration: string
  wallDecorationArea: string
  crashWallDecoration: string
  crashWallDecorationArea: string
  motorClearHeight: string
  nonMotorClearHeight: string
  designFloodLevel: string
  // 附属设施
  sewagePumpCount: string
  rainPumpCount: string
  railingForm: string
  railingLength: string
  drainForm: string
  drainLength: string
  topDrainForm: string
  // 隧道概况
  overview: string
  // 制表信息
  review: string
  check: string
  drafting: string
  cardDate: string | undefined
}

function createEmptyCardForm(): CardForm {
  return {
    name: '', roadName: '', district: '', manageUnit: '', maintainUnit: '', crossOver: '',
    buildDate: undefined, buildUnit: '', totalCost: '', surveyUnit: '',
    maintainCategory: undefined, designUnit: '', maintainGrade: undefined, superviseUnit: '',
    roadGrade: undefined, constructUnit: '', designLanes: '', designLoad: '', designSpeed: '',
    designFlow: '', emergencyPhone: '',
    roadCrossSection: '', motorPavement: '', nonMotorPavement: '', sidewalkPavement: '',
    drivewayLengthSingle: '', drivewayWidth: '', drivewayLength: '', sidewalkWidth: '',
    motorMaxSlope: '', nonMotorMaxSlope: '', crossSlope: '', waterproofGrade: '',
    geology: '', liningType: undefined, liningThickness: '', portalForm: '',
    ceilingDecoration: '', ceilingDecorationArea: '', wallDecoration: '', wallDecorationArea: '',
    crashWallDecoration: '', crashWallDecorationArea: '', motorClearHeight: '', nonMotorClearHeight: '',
    designFloodLevel: '',
    sewagePumpCount: '', rainPumpCount: '', railingForm: '', railingLength: '',
    drainForm: '', drainLength: '', topDrainForm: '',
    overview: '',
    review: '', check: '', drafting: '', cardDate: undefined,
  }
}

// 隧道资料卡表单（hasMultiUnit=否）
const tunnelCardForm = reactive<CardForm>(createEmptyCardForm())
// 隧道单元1/2资料卡表单（hasMultiUnit=是）
const unit1CardForm = reactive<CardForm>(createEmptyCardForm())
const unit2CardForm = reactive<CardForm>(createEmptyCardForm())

// ==================== 资料卡分组定义 ====================

// Select 选项
const liningTypeOptions = [
  { value: '复合式衬砌', label: '复合式衬砌' },
  { value: '喷锚衬砌', label: '喷锚衬砌' },
  { value: '整体式衬砌', label: '整体式衬砌' },
  { value: '其他', label: '其他' },
]
const maintainCategoryOptions = [
  { value: '一类', label: '一类' },
  { value: '二类', label: '二类' },
  { value: '三类', label: '三类' },
]
const maintainGradeOptions = [
  { value: '一级', label: '一级' },
  { value: '二级', label: '二级' },
  { value: '三级', label: '三级' },
]
const roadGradeOptions = [
  { value: '快速路', label: '快速路' },
  { value: '主干路', label: '主干路' },
  { value: '次干路', label: '次干路' },
  { value: '支路', label: '支路' },
]

// 资料卡 3 个分组（一般资料/结构资料/附属设施），对齐导则表A.1
const cardSections = [
  {
    title: '一般资料',
    rows: [
      { label1: '隧道名称', key1: 'name', label2: '所在路名', key2: 'roadName', label3: '所属城区', key3: 'district' },
      { label1: '管理单位', key1: 'manageUnit', label2: '养护单位', key2: 'maintainUnit', label3: '穿越（山/河/路）', key3: 'crossOver' },
      { label1: '建设单位', key1: 'buildUnit', label2: '竣工日期', key2: 'buildDate', label3: '勘察单位', key3: 'surveyUnit' },
      { label1: '总造价（万元）', key1: 'totalCost', label2: '养护类别', key2: 'maintainCategory', label3: '设计单位', key3: 'designUnit' },
      { label1: '养护等级', key1: 'maintainGrade', label2: '监理单位', key2: 'superviseUnit', label3: '道路等级', key3: 'roadGrade' },
      { label1: '施工单位', key1: 'constructUnit', label2: '设计车道', key2: 'designLanes', label3: '设计荷载', key3: 'designLoad' },
      { label1: '设计车速', key1: 'designSpeed', label2: '设计流量', key2: 'designFlow', label3: '紧急电话', key3: 'emergencyPhone' },
    ],
  },
  {
    title: '结构资料',
    rows: [
      { label1: '道路标准横断面', key1: 'roadCrossSection', label2: '机动车车道路面结构', key2: 'motorPavement', label3: '非机动车车道路面结构', key3: 'nonMotorPavement' },
      { label1: '人行道路面结构', key1: 'sidewalkPavement', label2: '车行道长（按单洞,m）', key2: 'drivewayLengthSingle', label3: '车行道宽', key3: 'drivewayWidth' },
      { label1: '车行道长', key1: 'drivewayLength', label2: '人行道宽', key2: 'sidewalkWidth', label3: '机动车道最大纵坡', key3: 'motorMaxSlope' },
      { label1: '非机动车道最大纵坡', key1: 'nonMotorMaxSlope', label2: '横坡', key2: 'crossSlope', label3: '结构防水等级', key3: 'waterproofGrade' },
      { label1: '岩层地质', key1: 'geology', label2: '衬砌类型', key2: 'liningType', label3: '衬砌厚度', key3: 'liningThickness' },
      { label1: '门洞形式', key1: 'portalForm', label2: '洞顶装修', key2: 'ceilingDecoration', label3: '洞顶装修面积', key3: 'ceilingDecorationArea' },
      { label1: '洞壁装修', key1: 'wallDecoration', label2: '洞壁装修面积', key2: 'wallDecorationArea', label3: '防撞墙装修', key3: 'crashWallDecoration' },
      { label1: '防撞墙装修面积', key1: 'crashWallDecorationArea', label2: '机动车道净高', key2: 'motorClearHeight', label3: '非机动车道净高', key3: 'nonMotorClearHeight' },
      { label1: '设计洪水位高程', key1: 'designFloodLevel', label2: '', key2: '', label3: '', key3: '' },
    ],
  },
  {
    title: '附属设施',
    rows: [
      { label1: '污水泵房数量', key1: 'sewagePumpCount', label2: '雨水泵房数量', key2: 'rainPumpCount', label3: '栏杆形式', key3: 'railingForm' },
      { label1: '栏杆长度', key1: 'railingLength', label2: '排水沟形式', key2: 'drainForm', label3: '排水沟长度', key3: 'drainLength' },
      { label1: '洞顶排水沟形式', key1: 'topDrainForm', label2: '', key2: '', label3: '', key3: '' },
    ],
  },
]

// 附件项（9个）
const attachmentItems = [
  { key: 'designFile', label: '设计文件' },
  { key: 'constructionFile', label: '施工文件' },
  { key: 'asBuiltDrawing', label: '竣工图纸' },
  { key: 'regularInspectionReport', label: '常规定期检测报告' },
  { key: 'structureInspectionReport', label: '结构定期检测报告' },
  { key: 'specialInspectionReport', label: '特殊检测报告' },
  { key: 'repairRecords', label: '历次维修资料' },
  { key: 'acceptanceFile', label: '验收文件' },
  { key: 'structureDiagram', label: '结构简图' },
]

// 带单位的字段（字段名→单位字符串），对齐导则表A.1
const cardNumberUnitFields = new Map<string, string>([
  ['drivewayLengthSingle', 'm'],
  ['drivewayWidth', 'm'],
  ['drivewayLength', 'm'],
  ['sidewalkWidth', 'm'],
  ['liningThickness', 'cm'],
  ['motorClearHeight', 'm'],
  ['nonMotorClearHeight', 'm'],
  ['railingLength', 'm'],
  ['drainLength', 'm'],
])

// Select 字段
const cardSelectFields: Record<string, { options: typeof liningTypeOptions }> = {
  liningType: { options: liningTypeOptions },
  maintainCategory: { options: maintainCategoryOptions },
  maintainGrade: { options: maintainGradeOptions },
  roadGrade: { options: roadGradeOptions },
}

// DatePicker 字段
const cardDateFields = new Set(['buildDate'])

// 带 m 单位的字段（Input + m 后缀）

// 资料卡页签（动态：人行地道→空；hasMultiUnit=否→隧道资料卡；=是→隧道单元1/2资料卡）
const cardTabs = computed(() => {
  // 人行地道时不显示隧道资料卡/隧道单元资料卡
  if (addForm.type === '人行地道') {
    return []
  }
  if (addForm.hasMultipleUnits) {
    return [
      { key: 'unit1', tab: '隧道单元1资料卡', form: unit1CardForm },
      { key: 'unit2', tab: '隧道单元2资料卡', form: unit2CardForm },
    ]
  }
  return [
    { key: 'card', tab: '隧道资料卡', form: tunnelCardForm },
  ]
})

// 字段组件类型
function getCardFieldComponent(key: string) {
  if (!key) return null
  if (cardSelectFields[key]) return markRaw(ASelect)
  if (cardDateFields.has(key)) return markRaw(ADatePicker)
  // InputNumber 用于纯数字字段（暂时不用，线上都是 Input + m 后缀）
  return markRaw(AInput)
}

// 字段 props
function getCardFieldProps(key: string) {
  const props: Record<string, any> = { placeholder: '' }
  if (cardSelectFields[key]) {
    props.options = cardSelectFields[key].options
    props.allowClear = true
  }
  if (cardDateFields.has(key)) {
    props.valueFormat = 'YYYY-MM-DD'
  }
  return props
}

// 从 TunnelUnitCard 填充到 CardForm
function fillCardFormFromUnit(form: CardForm, unit: any) {
  form.name = unit.name || ''
  form.roadName = unit.roadName || ''
  form.district = unit.district || ''
  form.manageUnit = unit.manageUnit || ''
  form.maintainUnit = unit.maintainUnit || ''
  form.crossOver = unit.crossOver || ''
  form.buildDate = unit.buildDate
  form.buildUnit = unit.buildUnit || ''
  form.totalCost = unit.totalCost || ''
  form.surveyUnit = unit.surveyUnit || ''
  form.maintainCategory = unit.maintainCategory
  form.designUnit = unit.designUnit || ''
  form.maintainGrade = unit.maintainGrade
  form.superviseUnit = unit.superviseUnit || ''
  form.roadGrade = unit.roadGrade
  form.constructUnit = unit.constructUnit || ''
  form.designLanes = unit.designLanes || ''
  form.designLoad = unit.designLoad || ''
  form.designSpeed = unit.designSpeed || ''
  form.designFlow = unit.designFlow || ''
  form.emergencyPhone = unit.emergencyPhone || ''
  form.roadCrossSection = unit.roadCrossSection || ''
  form.motorPavement = unit.motorPavement || ''
  form.nonMotorPavement = unit.nonMotorPavement || ''
  form.sidewalkPavement = unit.sidewalkPavement || ''
  form.drivewayLengthSingle = unit.drivewayLengthSingle || ''
  form.drivewayWidth = unit.drivewayWidth || ''
  form.drivewayLength = unit.drivewayLength || ''
  form.sidewalkWidth = unit.sidewalkWidth || ''
  form.motorMaxSlope = unit.motorMaxSlope || ''
  form.nonMotorMaxSlope = unit.nonMotorMaxSlope || ''
  form.crossSlope = unit.crossSlope || ''
  form.waterproofGrade = unit.waterproofGrade || ''
  form.geology = unit.geology || ''
  form.liningType = unit.liningType
  form.liningThickness = unit.liningThickness || ''
  form.portalForm = unit.portalForm || ''
  form.ceilingDecoration = unit.ceilingDecoration || ''
  form.ceilingDecorationArea = unit.ceilingDecorationArea || ''
  form.wallDecoration = unit.wallDecoration || ''
  form.wallDecorationArea = unit.wallDecorationArea || ''
  form.crashWallDecoration = unit.crashWallDecoration || ''
  form.crashWallDecorationArea = unit.crashWallDecorationArea || ''
  form.motorClearHeight = unit.motorClearHeight || ''
  form.nonMotorClearHeight = unit.nonMotorClearHeight || ''
  form.designFloodLevel = unit.designFloodLevel || ''
  form.sewagePumpCount = unit.sewagePumpCount || ''
  form.rainPumpCount = unit.rainPumpCount || ''
  form.railingForm = unit.railingForm || ''
  form.railingLength = unit.railingLength || ''
  form.drainForm = unit.drainForm || ''
  form.drainLength = unit.drainLength || ''
  form.topDrainForm = unit.topDrainForm || ''
  form.overview = unit.overview || ''
  form.review = unit.review || ''
  form.check = unit.check || ''
  form.drafting = unit.drafting || ''
  form.cardDate = unit.cardDate
}

// 从 record 填充到 tunnelCardForm（hasMultiUnit=否）
function fillCardFormFromRecord(form: CardForm, record: TunnelItem) {
  const cardData = (record as any).cardData
  if (cardData) {
    fillCardFormFromUnit(form, cardData)
  }
  // 基础信息同步
  form.name = record.name
  form.liningType = record.liningType || undefined
}

// ==================== 人行地道资料卡（查看 + 编辑模式，导则表A.2） ====================

// 查看模式分组数据（从 currentViewRecord.underpassCard 读取）
const underpassViewGroups = computed(() => {
  const c = (currentViewRecord.value as any)?.underpassCard || {}
  const row = (labels: Array<[string, string]>) => labels.map(([label, key]) => ({ label, value: (c as any)[key] ?? '' }))
  return [
    {
      title: '一般资料',
      rows: row([
        ['地道名称', 'name'],
        ['所在路名', 'roadName'],
        ['穿越', 'crossOver'],
        ['管理单位', 'manageUnit'],
        ['建设单位', 'buildUnit'],
        ['设计单位', 'designUnit'],
        ['监理单位', 'supervisorUnit'],
        ['施工单位', 'constructionUnit'],
        ['建造年月', 'buildDate'],
        ['地道总长(m)', 'totalLength'],
        ['通道总宽(m)', 'passageWidth'],
        ['高度(m)', 'height'],
      ]),
    },
    {
      title: '地道土建',
      rows: row([
        ['衬砌结构', 'liningStructure'],
        ['人行道铺装', 'sidewalkPavement'],
        ['伸缩缝形式', 'expansionJointType'],
        ['道路横坡', 'roadCrossSlope'],
      ]),
    },
    {
      title: '附属设施',
      rows: row([
        ['照明设施名称', 'lightingName'],
        ['照明设施数量', 'lightingCount'],
        ['供电设施名称', 'powerName'],
        ['供电设施数量', 'powerCount'],
        ['排水设施名称', 'drainageName'],
        ['排水设施数量', 'drainageCount'],
        ['通风设施名称', 'ventilationName'],
        ['通风设施数量', 'ventilationCount'],
        ['消防设施名称', 'fireFightingName'],
        ['消防设施数量', 'fireFightingCount'],
        ['电梯厂家', 'elevatorBrand'],
        ['电梯数量', 'elevatorCount'],
      ]),
    },
    {
      title: '制表信息',
      rows: row([
        ['审定', 'audit'],
        ['复核', 'review'],
        ['制表', 'draft'],
        ['日期', 'cardDate'],
      ]),
    },
  ]
})

// 编辑模式表单
const underpassCardForm = reactive<Record<string, string>>({})

function resetUnderpassCardForm() {
  Object.keys(underpassCardForm).forEach((k) => { underpassCardForm[k] = '' })
  underpassEditFields.forEach((f) => { underpassCardForm[f.key] = '' })
}

function fillUnderpassCardFromRecord(record: TunnelItem) {
  resetUnderpassCardForm()
  const c = (record as any).underpassCard || {}
  underpassEditFields.forEach((f) => {
    underpassCardForm[f.key] = c[f.key] ?? ''
  })
  underpassCardForm.name = record.name || ''
}

// 编辑字段配置
const underpassEditFields: Array<{ label: string; key: string }> = [
  // 一般资料（12字段）
  { label: '地道名称', key: 'name' },
  { label: '所在路名', key: 'roadName' },
  { label: '穿越', key: 'crossOver' },
  { label: '管理单位', key: 'manageUnit' },
  { label: '建设单位', key: 'buildUnit' },
  { label: '设计单位', key: 'designUnit' },
  { label: '监理单位', key: 'supervisorUnit' },
  { label: '施工单位', key: 'constructionUnit' },
  { label: '建造年月', key: 'buildDate' },
  { label: '地道总长(m)', key: 'totalLength' },
  { label: '通道总宽(m)', key: 'passageWidth' },
  { label: '高度(m)', key: 'height' },
  // 地道土建（4字段）
  { label: '衬砌结构', key: 'liningStructure' },
  { label: '人行道铺装', key: 'sidewalkPavement' },
  { label: '伸缩缝形式', key: 'expansionJointType' },
  { label: '道路横坡', key: 'roadCrossSlope' },
  // 附属设施（12字段）
  { label: '照明设施名称', key: 'lightingName' },
  { label: '照明设施数量', key: 'lightingCount' },
  { label: '供电设施名称', key: 'powerName' },
  { label: '供电设施数量', key: 'powerCount' },
  { label: '排水设施名称', key: 'drainageName' },
  { label: '排水设施数量', key: 'drainageCount' },
  { label: '通风设施名称', key: 'ventilationName' },
  { label: '通风设施数量', key: 'ventilationCount' },
  { label: '消防设施名称', key: 'fireFightingName' },
  { label: '消防设施数量', key: 'fireFightingCount' },
  { label: '电梯厂家', key: 'elevatorBrand' },
  { label: '电梯数量', key: 'elevatorCount' },
]

const underpassEditGroups = [
  { title: '一般资料', start: 0, end: 12 },
  { title: '地道土建', start: 12, end: 16 },
  { title: '附属设施', start: 16, end: 28 },
]

function underpassEditGridData(start: number, end: number) {
  const slice = underpassEditFields.slice(start, end)
  const rows: Array<Record<string, any>> = []
  for (let i = 0; i < slice.length; i += 3) {
    const row: Record<string, any> = {}
    const cols = [1, 2, 3]
    cols.forEach((col) => {
      const f = slice[i + col - 1]
      if (f) {
        row[`label${col}`] = f.label
        row[`key${col}`] = f.key
      }
    })
    rows.push(row)
  }
  return rows
}

// ==================== 检测整改记录（查看模式） ====================
const tunnelInspectCols: any[] = [
  { title: '检测名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '检测时间', dataIndex: 'checkTime', key: 'checkTime', width: 120 },
  { title: '检测类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '等级', dataIndex: 'grade', key: 'grade', width: 100 },
  { title: '整改销号结果', dataIndex: 'result', key: 'result', width: 150 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

// 隧道类型颜色映射
function getTunnelTypeColor(type?: string) {
  const colorMap: Record<string, string> = {
    '人行地道': 'blue',
    '城市道路隧道': 'green',
  }
  return colorMap[type || ''] || 'default'
}

// 评价等级颜色映射
function getEvalLevelColor(level?: string) {
  const colorMap: Record<string, string> = {
    'A': 'green',
    'B': 'blue',
    'C': 'gold',
    'D': 'orange',
    'E': 'red',
  }
  return colorMap[level || ''] || 'default'
}

// 重置资料卡表单
function resetTunnelCardForm() {
  Object.assign(tunnelCardForm, createEmptyCardForm())
  Object.assign(unit1CardForm, createEmptyCardForm())
  Object.assign(unit2CardForm, createEmptyCardForm())
  resetUnderpassCardForm()
}

// 同步基础信息到资料卡（编辑模式用）
function syncBasicToCard() {
  tunnelCardForm.name = addForm.name
  tunnelCardForm.liningType = addForm.liningType || undefined
  unit1CardForm.name = addForm.name
  unit1CardForm.liningType = addForm.liningType || undefined
  unit2CardForm.name = addForm.name
  unit2CardForm.liningType = addForm.liningType || undefined
}
// 保留 syncBasicToCard 供 watch 或其他逻辑使用
void syncBasicToCard

// 重置表单
function resetAddForm() {
  addForm.name = ''
  addForm.type = undefined
  addForm.liningType = ''
  addForm.region = undefined
  addForm.location = ''
  addForm.cityClassification = undefined
  addForm.isUnderground = false
  addForm.industryUnit = ''
  addForm.industryPerson = ''
  addForm.industryContact = ''
  addForm.facilityUnit = ''
  addForm.facilityPerson = ''
  addForm.facilityContact = ''
  addForm.maintainUnit = ''
  addForm.maintainPerson = ''
  addForm.maintainContact = ''
  addForm.policeUnit = ''
  addForm.policeContact = ''
  addForm.policeContactPhone = ''
  addForm.hasMultipleUnits = false
  resetTunnelCardForm()
  activeTab.value = 'basic'
}

// 取消
function handleCancel() {
  addModalVisible.value = false
  resetAddForm()
}

// 重置表单
function handleResetForm() {
  resetAddForm()
}

// 暂存草稿
function handleSaveDraft() {
  message.info('暂存草稿功能开发中')
}

// 提交
function handleSubmit() {
  message.success('提交成功')
  addModalVisible.value = false
  resetAddForm()
  loadData()
}

// 打开新增弹窗
function openAddModal() {
  formMode.value = 'add'
  resetAddForm()
  addModalVisible.value = true
}

// 打开编辑弹窗
function openEditModal(record: TunnelItem) {
  formMode.value = 'edit'
  currentViewRecord.value = record
  resetAddForm()
  // 填充基础信息
  addForm.name = record.name
  addForm.type = record.type
  addForm.liningType = record.liningType || ''
  addForm.region = record.region
  addForm.location = record.tunnelLocation || ''
  addForm.cityClassification = record.cityClassification
  addForm.isUnderground = record.isUnderground
  addForm.industryUnit = record.industryUnit || ''
  addForm.industryPerson = record.industryPerson || ''
  addForm.industryContact = record.industryContact || ''
  addForm.facilityUnit = record.facilityManageUnit || ''
  addForm.facilityPerson = record.facilityManagePerson || ''
  addForm.facilityContact = record.facilityManageContact || ''
  addForm.maintainUnit = record.facilityMaintainUnit || ''
  addForm.maintainPerson = record.facilityMaintainPerson || ''
  addForm.maintainContact = record.facilityMaintainContact || ''
  addForm.policeUnit = record.policeUnit || ''
  addForm.policeContact = record.policeContact || ''
  addForm.policeContactPhone = record.policeContactPhone || ''
  addForm.hasMultipleUnits = record.hasMultiUnit || false
  // 填充资料卡数据
  if (addForm.hasMultipleUnits) {
    // hasMultiUnit=是 → 填充单元1/2资料卡
    const units = (record as any).tunnelUnits || []
    if (units[0]) fillCardFormFromUnit(unit1CardForm, units[0])
    if (units[1]) fillCardFormFromUnit(unit2CardForm, units[1])
    // 同步基础信息到资料卡名称/衬砌类型
    unit1CardForm.name = addForm.name
    unit2CardForm.name = addForm.name
  } else {
    // hasMultiUnit=否 → 填充隧道资料卡
    fillCardFormFromRecord(tunnelCardForm, record)
  }
  // 填充人行地道资料卡
  fillUnderpassCardFromRecord(record)
  addModalVisible.value = true
}

// 打开查看弹窗
function openViewModal(record: TunnelItem) {
  formMode.value = 'view'
  currentViewRecord.value = record
  resetAddForm()
  // 填充基础信息
  addForm.name = record.name
  addForm.type = record.type
  addForm.liningType = record.liningType || ''
  addForm.region = record.region
  addForm.location = record.tunnelLocation || ''
  addForm.cityClassification = record.cityClassification
  addForm.isUnderground = record.isUnderground
  addForm.industryUnit = record.industryUnit || ''
  addForm.industryPerson = record.industryPerson || ''
  addForm.industryContact = record.industryContact || ''
  addForm.facilityUnit = record.facilityManageUnit || ''
  addForm.facilityPerson = record.facilityManagePerson || ''
  addForm.facilityContact = record.facilityManageContact || ''
  addForm.maintainUnit = record.facilityMaintainUnit || ''
  addForm.maintainPerson = record.facilityMaintainPerson || ''
  addForm.maintainContact = record.facilityMaintainContact || ''
  addForm.policeUnit = record.policeUnit || ''
  addForm.policeContact = record.policeContact || ''
  addForm.policeContactPhone = record.policeContactPhone || ''
  addForm.hasMultipleUnits = record.hasMultiUnit || false
  // 填充资料卡数据
  if (addForm.hasMultipleUnits) {
    const units = (record as any).tunnelUnits || []
    if (units[0]) fillCardFormFromUnit(unit1CardForm, units[0])
    if (units[1]) fillCardFormFromUnit(unit2CardForm, units[1])
    unit1CardForm.name = addForm.name
    unit2CardForm.name = addForm.name
  } else {
    fillCardFormFromRecord(tunnelCardForm, record)
  }
  // 填充人行地道资料卡
  fillUnderpassCardFromRecord(record)
  addModalVisible.value = true
}

// 表格列定义
const columns = computed<TableColumnsType>(() => {
  const base: TableColumnsType = [
    {
      title: '归属地区',
      dataIndex: 'region',
      key: 'region',
      width: 150,
      fixed: 'left',
    },
    {
      title: '隧道名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '隧道类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '城市道路隧道分类',
      dataIndex: 'cityClassification',
      key: 'cityClassification',
      width: 150,
    },
    {
      title: '是否地下隧道',
      dataIndex: 'isUnderground',
      key: 'isUnderground',
      width: 120,
    },
    {
      title: '综合评价等级',
      dataIndex: 'evalLevel',
      key: 'evalLevel',
      width: 120,
    },
    {
      title: '检测时间',
      dataIndex: 'detectTime',
      key: 'detectTime',
      width: 120,
    },
  ]
  // 从检测评价菜单进入时显示检测/评价单位列
  if (showEvalUnit.value) {
    base.push({
      title: '检测/评价单位',
      dataIndex: 'evalUnit',
      key: 'evalUnit',
      width: 160,
    })
  }
  base.push(
    {
      title: '数据是否完善',
      dataIndex: 'dataComplete',
      key: 'dataComplete',
      width: 120,
    },
    {
      title: '发布状态',
      dataIndex: 'publishStatus',
      key: 'publishStatus',
      width: 100,
    },
    {
      title: '检测是否超期',
      dataIndex: 'isOverdue',
      key: 'isOverdue',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 220,
    },
  )
  return base
})

// 隧道地图弹窗
const tunnelMapModalVisible = ref(false)

function handleOpenTunnelMap() {
  tunnelMapModalVisible.value = true
}

// 批量填写弹窗相关
const batchFillModalVisible = ref(false)
const batchFillForm = reactive({
  industryUnit: '',
  industryPerson: '',
  industryContact: '',
  facilityUnit: '',
  facilityPerson: '',
  facilityContact: '',
  maintainUnit: '',
  maintainPerson: '',
  maintainContact: '',
  policeUnit: '',
  policeContact: '',
  policeContactPhone: '',
})

// 打开批量填写弹窗
function handleBatchFill() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要批量填写的数据')
    return
  }
  resetBatchFillForm()
  batchFillModalVisible.value = true
}

// 重置批量填写表单
function resetBatchFillForm() {
  batchFillForm.industryUnit = ''
  batchFillForm.industryPerson = ''
  batchFillForm.industryContact = ''
  batchFillForm.facilityUnit = ''
  batchFillForm.facilityPerson = ''
  batchFillForm.facilityContact = ''
  batchFillForm.maintainUnit = ''
  batchFillForm.maintainPerson = ''
  batchFillForm.maintainContact = ''
  batchFillForm.policeUnit = ''
  batchFillForm.policeContact = ''
  batchFillForm.policeContactPhone = ''
}

// 取消批量填写
function handleCancelBatchFill() {
  batchFillModalVisible.value = false
  resetBatchFillForm()
}

// 提交批量填写
function handleSubmitBatchFill() {
  Modal.confirm({
    title: '确认批量填写',
    content: `确定要将选中的 ${selectedRowKeys.value.length} 条记录的三级责任体系信息批量填写吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      message.success(`已成功批量填写 ${selectedRowKeys.value.length} 条记录`)
      batchFillModalVisible.value = false
      resetBatchFillForm()
      selectedRowKeys.value = []
      loadData()
    },
  })
}

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const params: TunnelSearchParams = {
      region: searchForm.region,
      name: searchForm.name,
      type: searchForm.type,
      cityClassification: searchForm.cityClassification,
      isUnderground: searchForm.isUnderground,
      evalLevel: searchForm.evalLevel,
      status: searchForm.status,
      dataComplete: searchForm.dataComplete,
      publishStatus: searchForm.publishStatus,
      isOverdue: searchForm.isOverdue,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }

    const result = await getTunnelList(params)
    tableData.value = result.list
    pagination.total = result.total
  } catch (error) {
    message.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 搜索
function handleSearch() {
  pagination.current = 1
  loadData()
}

// 重置
function handleReset() {
  searchForm.region = undefined
  searchForm.name = undefined
  searchForm.type = undefined
  searchForm.cityClassification = undefined
  searchForm.isUnderground = undefined
  searchForm.evalLevel = undefined
  searchForm.status = '在用'
  searchForm.dataComplete = undefined
  searchForm.publishStatus = undefined
  searchForm.isOverdue = undefined
  pagination.current = 1
  loadData()
}

// 刷新
function handleRefresh() {
  loadData()
}

// 新增
function handleAdd() {
  openAddModal()
}

// 导出
function handleExport() {
  message.success('导出成功')
}

// 模版下载
function handleTemplateDownload() {
  message.success('模版下载成功')
}

// 资料卡下载
function handleCardDownload() {
  message.success('资料卡下载成功')
}

// 批量导入
function handleBatchImport() {
  message.info('批量导入功能开发中')
}

// 批量删除
function handleBatchDelete() {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 条记录吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      message.success('批量删除成功')
      selectedRowKeys.value = []
      loadData()
    },
  })
}

// 查看
function handleView(record: TunnelItem) {
  openViewModal(record)
}

// 编辑
function handleEdit(record: TunnelItem) {
  openEditModal(record)
}

// 删除
function handleDelete(record: TunnelItem) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除隧道 "${record.name}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      message.success('删除成功')
      loadData()
    },
  })
}

// 日志
function handleLog(record: TunnelItem) {
  message.info(`查看日志: ${record.name}`)
}

// 页码改变
function handlePageChange(page: number, pageSize: number) {
  pagination.current = page
  pagination.pageSize = pageSize
  loadData()
}

// 每页显示数量改变
function handlePageSizeChange(_current: number, size: number) {
  pagination.current = 1
  pagination.pageSize = size
  loadData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.tunnel-info-page {
  .search-section {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;

    .expand-toggle-btn {
      margin-left: 8px;
      padding-left: 4px;
    }
  }

  .action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    &-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &-right {
      display: flex;
      gap: 4px;
    }
  }

  .stat-tag {
    color: #fa8c16;
    background: #fff7e6;
    border: 1px solid #ffd591;
    border-radius: 2px;
    padding: 4px 12px;
    font-size: 12px;
    margin-left: 8px;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

// 新增/编辑/查看弹窗样式
.add-tunnel-modal {
  .add-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;

    .add-modal-title {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .add-tunnel-content {
    .add-tunnel-form {
      max-height: 520px;
      overflow-y: auto;
      padding: 16px 0;

      .form-section {
        margin-bottom: 24px;

        .form-section-title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 16px;
          padding-left: 10px;
          border-left: 3px solid #2A64FF;
        }
      }

      // 三级责任体系 - 纵向堆叠块
      .responsibility-block {
        margin-bottom: 16px;

        .responsibility-sub-title {
          font-size: 14px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.65);
          margin-bottom: 12px;
          padding-left: 8px;
          border-left: 2px solid #d9d9d9;
        }
      }

      .location-btn-item {
        margin-bottom: 0;

        .location-btn {
          width: 100%;
          background: #2A64FF;
          border-color: #2A64FF;
        }
      }
    }

    // 隧道资料卡样式
    .tunnel-card-form {
      max-height: 520px;
      overflow-y: auto;
      padding: 16px 24px;

      .card-section {
        margin-bottom: 24px;

        .card-section-title {
          font-size: 15px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          margin-bottom: 12px;
          padding-left: 10px;
          border-left: 3px solid #2A64FF;
        }
      }

      // 资料卡表格单元格
      :deep(.ant-table) {
        .ant-table-tbody > tr > td {
          padding: 4px 8px;
        }
      }

      .card-cell-label {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.65);
        font-weight: 500;
        text-align: right;
        padding-right: 8px;
      }

      .card-cell-value {
        :deep(.ant-input),
        :deep(.ant-input-number),
        :deep(.ant-picker) {
          width: 100%;
        }

        // 数字字段 + m 单位后缀
        .card-unit-suffix {
          margin-left: 4px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.65);
          white-space: nowrap;
        }
      }

      :deep(.ant-form-item) {
        margin-bottom: 16px;
      }
    }
  }

  .add-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;

    .ant-btn-primary {
      background: #2A64FF;
      border-color: #2A64FF;
    }
  }
}

// 隧道地图弹窗
.tunnel-map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #f5f5f5;
  border-radius: 4px;
}
</style>

<!-- 批量填写弹窗样式（不受 scoped 限制，因 modal 传送到 body） -->
<style lang="scss">
.batch-fill-modal {
  .add-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .add-modal-title {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .add-tunnel-form {
    max-height: 520px;
    overflow-y: auto;
    padding: 16px 24px;

    .form-section {
      margin-bottom: 24px;

      .form-section-title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
        padding-left: 10px;
        border-left: 3px solid #2A64FF;
      }
    }

    .ant-form-item {
      margin-bottom: 16px;
    }

    .ant-form-item-label > label {
      font-weight: 500;
    }
  }

  .add-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;

    .ant-btn-primary {
      background: #2A64FF;
      border-color: #2A64FF;
    }
  }
}
</style>
