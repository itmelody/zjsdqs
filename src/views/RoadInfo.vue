<template>
  <div class="road-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <HomeOutlined />
          <span>档案管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>基础信息管理</a-breadcrumb-item>
        <a-breadcrumb-item>道路信息</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <a-form :model="searchForm" layout="inline">
        <!-- 基础筛选（始终显示） -->
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
        <a-form-item label="道路名称">
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入道路名称"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="道路等级">
          <a-select
            v-model:value="searchForm.level"
            placeholder="请选择道路等级"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in roadLevelOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 展开后显示的筛选 -->
        <template v-if="expandSearch">
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
              placeholder="请选择状态"
              style="width: 200px"
              show-search
              option-filter-prop="label"
              allow-clear
            >
              <a-select-option
                v-for="item in statusOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
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

        <!-- 按钮区域 -->
        <a-form-item>
          <a-button @click="handleReset" style="margin-right: 8px">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary" @click="handleSearch" style="margin-right: 8px">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button type="link" @click="toggleExpand">
            {{ expandSearch ? '收起' : '展开' }}
            <DownOutlined v-if="!expandSearch" />
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
        <span class="stat-tag">
          未完善信息的{{ incompleteCount }}条；未完成本年度评价任务的0条
        </span>
        <a-button @click="handleRoadMap">
          <template #icon><EnvironmentOutlined /></template>
          道路地图
        </a-button>
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
      :scroll="{ x: 1600 }"
    >
      <template #bodyCell="{ column, record }">
        <!-- 数据是否完善 -->
        <template v-if="column.key === 'dataComplete'">
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
          <span :style="{ color: record.isOverdue === '已超期' ? '#ff4d4f' : '#52c41a' }">
            {{ record.isOverdue }}
          </span>
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
      class="add-road-modal"
    >
      <template #title>
        <div class="add-modal-header">
          <span class="add-modal-title">{{ modalTitle }}</span>
        </div>
      </template>
      <div class="add-road-content">
        <a-tabs v-model:activeKey="activeTab">
          <!-- 基础信息 Tab -->
          <a-tab-pane key="basic" tab="基础信息">
            <div class="add-road-form">
              <a-form :model="addForm" layout="horizontal" :label-col="{ style: { width: '100px' } }" :disabled="isViewMode">
                <!-- 基础信息区域 -->
                <div class="form-section">
                  <div class="form-section-title">基础信息</div>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="道路名称" required>
                        <a-input v-model:value="addForm.name" placeholder="请输入道路名称" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="道路等级" required>
                        <a-select v-model:value="addForm.level" placeholder="请选择">
                          <a-select-option
                            v-for="item in roadLevelOptions"
                            :key="item.value"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
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
                      <a-form-item label="道路位置" required>
                        <a-input v-model:value="addForm.roadLocation" placeholder="" style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item class="location-btn-item" :colon="false" label=" ">
                        <a-button type="primary" size="small" class="location-btn">选择点位位置</a-button>
                      </a-form-item>
                    </a-col>
                  </a-row>
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
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.industryPerson" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
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
                          <a-input v-model:value="addForm.facilityManageUnit" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.facilityManagePerson" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.facilityManageContact" placeholder="点击选择" />
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
                          <a-input v-model:value="addForm.facilityMaintainUnit" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.facilityMaintainPerson" placeholder="点击选择" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人联系方式" required>
                          <a-input v-model:value="addForm.facilityMaintainContact" placeholder="点击选择" />
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
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 道路资料卡 Tab -->
          <a-tab-pane key="card" tab="道路资料卡">
            <div class="road-card-form">
              <!-- 资料卡下载（仅查看模式） -->
              <div v-if="isViewMode" style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <!-- 制表单位 -->
              <div class="card-section">
                <div class="card-section-title">制表单位</div>
                <a-input
                  v-model:value="roadCardForm.tabUnit"
                  placeholder="请输入制表单位"
                  :disabled="isViewMode"
                  style="max-width: 300px"
                />
              </div>

              <!-- 一般资料 -->
              <div class="card-section">
                <div class="card-section-title">一般资料</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="generalInfoRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 车行道 -->
              <div class="card-section">
                <div class="card-section-title">车行道</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="drivingLaneRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 人行道-左侧 -->
              <div class="card-section">
                <div class="card-section-title">人行道-左侧</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="leftSidewalkRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 人行道-右侧 -->
              <div class="card-section">
                <div class="card-section-title">人行道-右侧</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="rightSidewalkRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 分隔带-左侧 -->
              <div class="card-section">
                <div class="card-section-title">分隔带-左侧</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="leftDividerRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 分隔带-中央 -->
              <div class="card-section">
                <div class="card-section-title">分隔带-中央</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="centerDividerRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 分隔带-右侧 -->
              <div class="card-section">
                <div class="card-section-title">分隔带-右侧</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="rightDividerRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 附属设施 -->
              <div class="card-section">
                <div class="card-section-title">附属设施</div>
                <a-table
                  :columns="cardColumns"
                  :data-source="facilityRows"
                  :show-header="false"
                  :pagination="false"
                  bordered
                  size="small"
                />
              </div>

              <!-- 道路概况 -->
              <div class="card-section">
                <div class="card-section-title">道路概况</div>
                <a-textarea
                  v-model:value="roadCardForm.roadOverview"
                  :rows="4"
                  :maxlength="200"
                  show-count
                  :disabled="isViewMode"
                  placeholder="请输入道路概况"
                />
              </div>

              <!-- 结构简图 -->
              <div class="card-section">
                <div class="card-section-title">结构简图</div>
                <a-upload :before-upload="() => false" :disabled="isViewMode">
                  <a-button :disabled="isViewMode">
                    <template #icon><UploadOutlined /></template>
                    点击上传
                  </a-button>
                </a-upload>
              </div>

              <!-- 附照 -->
              <div class="card-section">
                <div class="card-section-title">附照</div>
                <a-upload :before-upload="() => false" :disabled="isViewMode">
                  <a-button :disabled="isViewMode">
                    <template #icon><UploadOutlined /></template>
                    点击上传
                  </a-button>
                </a-upload>
              </div>

              <!-- 制表信息 -->
              <div class="card-section">
                <div class="card-section-title">制表信息</div>
                <a-form :model="roadCardForm" layout="horizontal" :label-col="{ style: { width: '60px' } }">
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item label="审定">
                        <a-input v-model:value="roadCardForm.approve" :disabled="isViewMode" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="复核">
                        <a-input v-model:value="roadCardForm.review" :disabled="isViewMode" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="制表">
                        <a-input v-model:value="roadCardForm.draw" :disabled="isViewMode" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="日期">
                        <a-date-picker
                          v-model:value="roadCardForm.tabDate"
                          :disabled="isViewMode"
                          style="width: 100%"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-form>
              </div>
            </div>
          </a-tab-pane>

          <!-- 检测整改记录 Tab（仅查看模式） -->
          <a-tab-pane v-if="isViewMode" key="inspect" tab="检测整改记录">
            <div class="road-inspect-form">
              <a-table
                :columns="roadInspectColumns"
                :data-source="(currentViewRecord?.detectRecords || []) as any[]"
                :pagination="false"
                row-key="id"
                size="middle"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'evalGrade'">
                    <span :class="['grade-badge', `grade-${record.evalGrade}`]">{{ record.evalGrade }}</span>
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
      <div class="add-road-content">
        <div class="add-road-form">
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
                    <a-input v-model:value="batchFillForm.facilityManageUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.facilityManagePerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.facilityManageContact" placeholder="点击选择" />
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
                    <a-input v-model:value="batchFillForm.facilityMaintainUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.facilityMaintainPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="责任人联系方式">
                    <a-input v-model:value="batchFillForm.facilityMaintainContact" placeholder="点击选择" />
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

    <!-- 道路地图弹窗 -->
    <a-modal
      v-model:open="roadMapVisible"
      title="道路地图"
      :footer="null"
      width="800px"
    >
      <div class="road-map-placeholder">
        地图加载中...
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message, Modal, Input, InputNumber, Select, DatePicker } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
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
  DownOutlined,
  UpOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons-vue'
import type { RoadItem, RoadSearchParams } from '@/types/road'
import {
  getRoadList,
  roadLevelOptions,
  regionOptions,
  evalLevelOptions,
  publishStatusOptions,
  isOverdueOptions,
  dataCompleteOptions,
  statusOptions,
} from '@/utils/mockRoadData'

const route = useRoute()

// 是否显示检测/评价单位列（从检测评价菜单进入时显示）
const showEvalUnit = computed(() => route.query.showEvalUnit === '1')

// 搜索展开/收起
const expandSearch = ref(false)

function toggleExpand() {
  expandSearch.value = !expandSearch.value
}

// 搜索表单
const searchForm = reactive<RoadSearchParams>({
  region: undefined,
  name: undefined,
  level: undefined,
  evalLevel: undefined,
  status: '在用',
  dataComplete: undefined,
  publishStatus: undefined,
  isOverdue: undefined,
  page: 1,
  pageSize: 10,
})

// 表格数据
const tableData = ref<RoadItem[]>([])
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
  const completeCount = tableData.value.filter((item) => item.dataComplete).length
  return pagination.total - completeCount
})

// 弹窗相关
const addModalVisible = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const isViewMode = computed(() => modalMode.value === 'view')
const modalTitle = computed(() => {
  const titles = { add: '新增道路', edit: '编辑道路', view: '查看道路' }
  return titles[modalMode.value]
})
const activeTab = ref('basic')
const currentEditId = ref<string | null>(null)
// 当前查看的记录（用于查看模式展示检测整改记录等）
const currentViewRecord = ref<RoadItem | null>(null)

// 道路地图弹窗
const roadMapVisible = ref(false)

// 新增表单
const addForm = reactive({
  key: '',
  region: undefined as string | undefined,
  name: '',
  level: undefined as string | undefined,
  roadLocation: '',
  buildTime: undefined as string | undefined,
  hasMonitorDevice: false,
  hasMonitorFacility: false,
  evalLevel: undefined as string | undefined,
  evalYear: undefined as number | undefined,
  dataComplete: false,
  publishStatus: undefined as string | undefined,
  // 三级责任体系 - 行业主管单位
  industryUnit: '',
  industryPerson: '',
  industryContact: '',
  // 三级责任体系 - 设施管理单位
  facilityManageUnit: '',
  facilityManagePerson: '',
  facilityManageContact: '',
  // 三级责任体系 - 设施养护单位
  facilityMaintainUnit: '',
  facilityMaintainPerson: '',
  facilityMaintainContact: '',
  // 三级责任体系 - 公安交警联动单位
  policeUnit: '',
  policeContact: '',
  policeContactPhone: '',
})

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
      title: '道路名称',
      dataIndex: 'name',
      key: 'name',
      width: 300,
    },
    {
      title: '道路等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
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
      width: 200,
    },
  )
  return base
})

// ==================== 道路资料卡 ====================

// 道路资料卡表单数据
const roadCardForm = reactive({
  // 制表单位
  tabUnit: '',
  // 一般资料
  roadName: '',
  roadCode: '',
  roadDirection: '',
  startPoint: '',
  endPoint: '',
  designUnit: '',
  constructionUnit: '',
  level: '',
  pavementLevel: '',
  designSpeed: '',
  roadWidthRange: '',
  roadLength: undefined as number | undefined,
  roadArea: undefined as number | undefined,
  aadt: '',
  trafficLevel: '',
  township: '',
  manageCategory: undefined as string | undefined,
  manageUnit: '',
  maintainUnit: '',
  buildDate: undefined as any,
  // 车行道
  pavementType: '',
  pavementThickness: undefined as number | undefined,
  baseType: '',
  baseThickness: undefined as number | undefined,
  laneCount: undefined as number | undefined,
  trafficDirection: '',
  motorLaneWidthRange: '',
  leftNonMotorWidthRange: '',
  rightNonMotorWidthRange: '',
  motorLaneArea: undefined as number | undefined,
  hasBusLane: undefined as string | undefined,
  curbType: '',
  curbLength: undefined as number | undefined,
  flatCurbType: '',
  flatCurbLength: undefined as number | undefined,
  // 人行道-左侧
  leftSidewalkPavementType: '',
  leftSidewalkLength: undefined as number | undefined,
  leftSidewalkWidthRange: '',
  leftSidewalkStraightArea: undefined as number | undefined,
  leftSidewalkIntersectionArea: undefined as number | undefined,
  leftSidewalkBlindRoadLength: undefined as number | undefined,
  leftSidewalkAccessibleArea: undefined as number | undefined,
  leftSidewalkGreenArea: undefined as number | undefined,
  leftSidewalkCurbType: '',
  leftSidewalkFlatCurbType: '',
  // 人行道-右侧
  rightSidewalkPavementType: '',
  rightSidewalkLength: undefined as number | undefined,
  rightSidewalkWidthRange: '',
  rightSidewalkStraightArea: undefined as number | undefined,
  rightSidewalkIntersectionArea: undefined as number | undefined,
  rightSidewalkBlindRoadLength: undefined as number | undefined,
  rightSidewalkAccessibleArea: undefined as number | undefined,
  rightSidewalkGreenArea: undefined as number | undefined,
  rightSidewalkCurbType: '',
  rightSidewalkFlatCurbType: '',
  // 分隔带-左侧
  leftDividerGuardrailLength: undefined as number | undefined,
  leftDividerGuardrailHeight: undefined as number | undefined,
  leftDividerGuardrailType: '',
  leftDividerLength: undefined as number | undefined,
  leftDividerWidthRange: '',
  leftDividerArea: undefined as number | undefined,
  leftDividerType: '',
  // 分隔带-中央
  centerDividerGuardrailHeight: undefined as number | undefined,
  centerDividerGuardrailType: '',
  centerDividerLength: undefined as number | undefined,
  centerDividerWidthRange: '',
  centerDividerArea: undefined as number | undefined,
  centerDividerType: '',
  // 分隔带-右侧
  rightDividerGuardrailLength: undefined as number | undefined,
  rightDividerGuardrailHeight: undefined as number | undefined,
  rightDividerGuardrailType: '',
  rightDividerLength: undefined as number | undefined,
  rightDividerWidthRange: '',
  rightDividerArea: undefined as number | undefined,
  rightDividerType: '',
  // 附属设施
  inspectionWellCount: undefined as number | undefined,
  rainwaterCount: undefined as number | undefined,
  roadSignCount: undefined as number | undefined,
  signBoardCount: undefined as number | undefined,
  treePoolArea: undefined as number | undefined,
  otherFacility: '',
  // 道路概况
  roadOverview: '',
  // 制表信息
  approve: '',
  review: '',
  draw: '',
  tabDate: undefined as any,
})

// 卡片行接口
interface CardRow {
  l1: string
  v1: string
  t1: string
  l2?: string
  v2?: string
  t2?: string
  l3?: string
  v3?: string
  t3?: string
}

// 管理分类选项
const manageCategoryOptions = [
  { label: '一类', value: '一类' },
  { label: '二类', value: '二类' },
  { label: '三类', value: '三类' },
  { label: '四类', value: '四类' },
]

// 有无选项
const yesNoOptions = [
  { label: '是', value: '是' },
  { label: '否', value: '否' },
]

// 获取下拉选项
function getCardSelectOptions(fieldKey: string): any[] {
  const optionsMap: Record<string, any[]> = {
    level: roadLevelOptions,
    manageCategory: manageCategoryOptions,
    hasBusLane: yesNoOptions,
  }
  return optionsMap[fieldKey] || []
}

// 卡片表格自定义渲染
function cardCustomRender({ record, column }: { record: any; column: any }) {
  const colKey = column.key as string
  // 标签列
  if (colKey.startsWith('l')) {
    return record[colKey] || ''
  }
  // 值列
  const num = colKey.slice(1)
  const type = record['t' + num] || 'input'
  const fieldKey = record[colKey]
  if (!fieldKey) return ''

  const disabled = isViewMode.value

  if (type === 'input') {
    return h(Input, {
      value: (roadCardForm as any)[fieldKey],
      'onUpdate:value': (v: string) => { (roadCardForm as any)[fieldKey] = v },
      disabled,
      size: 'small',
    } as any)
  }
  if (type === 'disabled') {
    return h(Input, {
      value: (roadCardForm as any)[fieldKey],
      disabled: true,
      size: 'small',
    } as any)
  }
  if (type === 'select') {
    return h(Select, {
      value: (roadCardForm as any)[fieldKey],
      'onUpdate:value': (v: string) => { (roadCardForm as any)[fieldKey] = v },
      disabled,
      size: 'small',
      style: 'width: 100%',
      options: getCardSelectOptions(fieldKey),
    } as any)
  }
  if (type === 'disabled-select') {
    return h(Select, {
      value: (roadCardForm as any)[fieldKey],
      disabled: true,
      size: 'small',
      style: 'width: 100%',
      options: getCardSelectOptions(fieldKey),
    } as any)
  }
  if (type === 'number') {
    return h(InputNumber, {
      value: (roadCardForm as any)[fieldKey],
      'onUpdate:value': (v: number | null) => { (roadCardForm as any)[fieldKey] = v },
      disabled,
      size: 'small',
      style: 'width: 100%',
    } as any)
  }
  if (type === 'date') {
    return h(DatePicker, {
      value: (roadCardForm as any)[fieldKey],
      'onUpdate:value': (v: any) => { (roadCardForm as any)[fieldKey] = v },
      disabled,
      size: 'small',
      style: 'width: 100%',
    } as any)
  }
  return h(Input, {
    value: (roadCardForm as any)[fieldKey],
    'onUpdate:value': (v: string) => { (roadCardForm as any)[fieldKey] = v },
    disabled,
    size: 'small',
  } as any)
}

// 卡片列定义（3列布局：6列 = 3对 label+input）
const cardColumns: any[] = [
  { title: '', dataIndex: 'l1', key: 'l1', width: '12%', customCell: () => ({ class: 'card-label-cell' }), customRender: cardCustomRender },
  { title: '', dataIndex: 'v1', key: 'v1', width: '21%', customRender: cardCustomRender },
  { title: '', dataIndex: 'l2', key: 'l2', width: '12%', customCell: () => ({ class: 'card-label-cell' }), customRender: cardCustomRender },
  { title: '', dataIndex: 'v2', key: 'v2', width: '21%', customRender: cardCustomRender },
  { title: '', dataIndex: 'l3', key: 'l3', width: '12%', customCell: () => ({ class: 'card-label-cell' }), customRender: cardCustomRender },
  { title: '', dataIndex: 'v3', key: 'v3', width: '22%', customRender: cardCustomRender },
]

// 一般资料数据行
const generalInfoRows: CardRow[] = [
  { l1: '道路名称', v1: 'roadName', t1: 'disabled', l2: '道路编号', v2: 'roadCode', t2: 'input', l3: '道路走向', v3: 'roadDirection', t3: 'input' },
  { l1: '起点', v1: 'startPoint', t1: 'input', l2: '终点', v2: 'endPoint', t2: 'input', l3: '设计单位', v3: 'designUnit', t3: 'input' },
  { l1: '施工单位', v1: 'constructionUnit', t1: 'input', l2: '道路等级', v2: 'level', t2: 'disabled-select', l3: '路面等级', v3: 'pavementLevel', t3: 'input' },
  { l1: '设计时速', v1: 'designSpeed', t1: 'input', l2: '路幅宽度/范围', v2: 'roadWidthRange', t2: 'input', l3: '道路长度(m)', v3: 'roadLength', t3: 'number' },
  { l1: '道路面积(m²)', v1: 'roadArea', t1: 'number', l2: 'AADT', v2: 'aadt', t2: 'input', l3: '交通量等级', v3: 'trafficLevel', t3: 'input' },
  { l1: '所属城区', v1: 'township', t1: 'input', l2: '管理分类', v2: 'manageCategory', t2: 'select', l3: '管理单位', v3: 'manageUnit', t3: 'input' },
  { l1: '养护单位', v1: 'maintainUnit', t1: 'input', l2: '建造年月', v2: 'buildDate', t2: 'date' },
]

// 车行道数据行
const drivingLaneRows: CardRow[] = [
  { l1: '路面类型', v1: 'pavementType', t1: 'input', l2: '路面厚度(cm)', v2: 'pavementThickness', t2: 'number', l3: '基础类型', v3: 'baseType', t3: 'input' },
  { l1: '基础厚度(cm)', v1: 'baseThickness', t1: 'number', l2: '车道数', v2: 'laneCount', t2: 'number', l3: '通行方向', v3: 'trafficDirection', t3: 'input' },
  { l1: '机动车道宽度范围', v1: 'motorLaneWidthRange', t1: 'input', l2: '左侧非机动车道宽度范围', v2: 'leftNonMotorWidthRange', t2: 'input', l3: '右侧非机动车道宽度范围', v3: 'rightNonMotorWidthRange', t3: 'input' },
  { l1: '车行道面积(m²)', v1: 'motorLaneArea', t1: 'number', l2: '有无公交专用道', v2: 'hasBusLane', t2: 'select', l3: '侧石类型', v3: 'curbType', t3: 'input' },
  { l1: '侧石长度(cm)', v1: 'curbLength', t1: 'number', l2: '平石类型', v2: 'flatCurbType', t2: 'input', l3: '平石长度(cm)', v3: 'flatCurbLength', t3: 'number' },
]

// 人行道-左侧数据行
const leftSidewalkRows: CardRow[] = [
  { l1: '铺面类型', v1: 'leftSidewalkPavementType', t1: 'input', l2: '长度(m)', v2: 'leftSidewalkLength', t2: 'number', l3: '宽度范围', v3: 'leftSidewalkWidthRange', t3: 'input' },
  { l1: '直线面积(m²)', v1: 'leftSidewalkStraightArea', t1: 'number', l2: '交叉口面积(m²)', v2: 'leftSidewalkIntersectionArea', t2: 'number', l3: '盲道长度(m)', v3: 'leftSidewalkBlindRoadLength', t3: 'number' },
  { l1: '无障碍通道面积(m²)', v1: 'leftSidewalkAccessibleArea', t1: 'number', l2: '绿化带面积(m²)', v2: 'leftSidewalkGreenArea', t2: 'number', l3: '侧石类型', v3: 'leftSidewalkCurbType', t3: 'input' },
  { l1: '平石类型', v1: 'leftSidewalkFlatCurbType', t1: 'input' },
]

// 人行道-右侧数据行
const rightSidewalkRows: CardRow[] = [
  { l1: '铺面类型', v1: 'rightSidewalkPavementType', t1: 'input', l2: '长度(m)', v2: 'rightSidewalkLength', t2: 'number', l3: '宽度范围', v3: 'rightSidewalkWidthRange', t3: 'input' },
  { l1: '直线面积(m²)', v1: 'rightSidewalkStraightArea', t1: 'number', l2: '交叉口面积(m²)', v2: 'rightSidewalkIntersectionArea', t2: 'number', l3: '盲道长度(m)', v3: 'rightSidewalkBlindRoadLength', t3: 'number' },
  { l1: '无障碍通道面积(m²)', v1: 'rightSidewalkAccessibleArea', t1: 'number', l2: '绿化带面积(m²)', v2: 'rightSidewalkGreenArea', t2: 'number', l3: '侧石类型', v3: 'rightSidewalkCurbType', t3: 'input' },
  { l1: '平石类型', v1: 'rightSidewalkFlatCurbType', t1: 'input' },
]

// 分隔带-左侧数据行
const leftDividerRows: CardRow[] = [
  { l1: '人行护栏长度(m)', v1: 'leftDividerGuardrailLength', t1: 'number', l2: '人行护栏高度(m)', v2: 'leftDividerGuardrailHeight', t2: 'number', l3: '人行护栏类型', v3: 'leftDividerGuardrailType', t3: 'input' },
  { l1: '长度(m)', v1: 'leftDividerLength', t1: 'number', l2: '宽度范围', v2: 'leftDividerWidthRange', t2: 'input', l3: '面积(m²)', v3: 'leftDividerArea', t3: 'number' },
  { l1: '类型', v1: 'leftDividerType', t1: 'input' },
]

// 分隔带-中央数据行
const centerDividerRows: CardRow[] = [
  { l1: '护栏高度(m)', v1: 'centerDividerGuardrailHeight', t1: 'number', l2: '护栏类型', v2: 'centerDividerGuardrailType', t2: 'input', l3: '长度(m)', v3: 'centerDividerLength', t3: 'number' },
  { l1: '宽度范围', v1: 'centerDividerWidthRange', t1: 'input', l2: '面积(m²)', v2: 'centerDividerArea', t2: 'number', l3: '类型', v3: 'centerDividerType', t3: 'input' },
]

// 分隔带-右侧数据行
const rightDividerRows: CardRow[] = [
  { l1: '人行护栏长度(m)', v1: 'rightDividerGuardrailLength', t1: 'number', l2: '人行护栏高度(m)', v2: 'rightDividerGuardrailHeight', t2: 'number', l3: '人行护栏类型', v3: 'rightDividerGuardrailType', t3: 'input' },
  { l1: '长度(m)', v1: 'rightDividerLength', t1: 'number', l2: '宽度范围', v2: 'rightDividerWidthRange', t2: 'input', l3: '面积(m²)', v3: 'rightDividerArea', t3: 'number' },
  { l1: '类型', v1: 'rightDividerType', t1: 'input' },
]

// 附属设施数据行
const facilityRows: CardRow[] = [
  { l1: '检查井数量(个)', v1: 'inspectionWellCount', t1: 'number', l2: '雨水口数量(个)', v2: 'rainwaterCount', t2: 'number', l3: '路名牌数量(个)', v3: 'roadSignCount', t3: 'number' },
  { l1: '标志牌数量(个)', v1: 'signBoardCount', t1: 'number', l2: '树池面积(m²)', v2: 'treePoolArea', t2: 'number', l3: '其他', v3: 'otherFacility', t3: 'input' },
]

// 同步基础信息到资料卡
watch(() => addForm.name, (v) => { roadCardForm.roadName = v || '' })
watch(() => addForm.level, (v) => { roadCardForm.level = v || '' })

// 重置资料卡表单
function resetRoadCardForm() {
  Object.keys(roadCardForm).forEach((key) => {
    const val = (roadCardForm as any)[key]
    if (typeof val === 'string') {
      (roadCardForm as any)[key] = ''
    } else {
      (roadCardForm as any)[key] = undefined
    }
  })
}

// 批量填写弹窗相关
const batchFillModalVisible = ref(false)
const batchFillForm = reactive({
  industryUnit: '',
  industryPerson: '',
  industryContact: '',
  facilityManageUnit: '',
  facilityManagePerson: '',
  facilityManageContact: '',
  facilityMaintainUnit: '',
  facilityMaintainPerson: '',
  facilityMaintainContact: '',
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
  batchFillForm.facilityManageUnit = ''
  batchFillForm.facilityManagePerson = ''
  batchFillForm.facilityManageContact = ''
  batchFillForm.facilityMaintainUnit = ''
  batchFillForm.facilityMaintainPerson = ''
  batchFillForm.facilityMaintainContact = ''
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
    const params: RoadSearchParams = {
      region: searchForm.region,
      name: searchForm.name,
      level: searchForm.level,
      evalLevel: searchForm.evalLevel,
      status: searchForm.status,
      dataComplete: searchForm.dataComplete,
      publishStatus: searchForm.publishStatus,
      isOverdue: searchForm.isOverdue,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }

    const result = await getRoadList(params)
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
  searchForm.level = undefined
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
  modalMode.value = 'add'
  currentEditId.value = null
  resetForm()
  resetRoadCardForm()
  activeTab.value = 'basic'
  addModalVisible.value = true
}

// 查看
function handleView(record: RoadItem) {
  modalMode.value = 'view'
  currentEditId.value = record.key
  currentViewRecord.value = record
  fillForm(record)
  activeTab.value = 'basic'
  addModalVisible.value = true
}

// 编辑
function handleEdit(record: RoadItem) {
  modalMode.value = 'edit'
  currentEditId.value = record.key
  currentViewRecord.value = record
  fillForm(record)
  activeTab.value = 'basic'
  addModalVisible.value = true
}

// 重置表单
function resetForm() {
  addForm.key = ''
  addForm.region = undefined
  addForm.name = ''
  addForm.level = undefined
  addForm.roadLocation = ''
  addForm.buildTime = undefined
  addForm.hasMonitorDevice = false
  addForm.hasMonitorFacility = false
  addForm.evalLevel = undefined
  addForm.evalYear = undefined
  addForm.dataComplete = false
  addForm.publishStatus = undefined
  addForm.industryUnit = ''
  addForm.industryPerson = ''
  addForm.industryContact = ''
  addForm.facilityManageUnit = ''
  addForm.facilityManagePerson = ''
  addForm.facilityManageContact = ''
  addForm.facilityMaintainUnit = ''
  addForm.facilityMaintainPerson = ''
  addForm.facilityMaintainContact = ''
  addForm.policeUnit = ''
  addForm.policeContact = ''
  addForm.policeContactPhone = ''
}

// 暂存草稿
function handleSaveDraft() {
  message.info('暂存草稿功能开发中')
}

// 重置表单（按钮调用）
function handleResetForm() {
  resetForm()
  resetRoadCardForm()
  message.success('已重置表单')
}

// 填充表单
function fillForm(record: RoadItem) {
  addForm.key = record.key
  addForm.region = record.region
  addForm.name = record.name
  addForm.level = record.level
  addForm.roadLocation = (record as any).roadLocation || ''
  addForm.buildTime = record.buildTime
  addForm.hasMonitorDevice = record.hasMonitorDevice
  addForm.hasMonitorFacility = record.hasMonitorFacility
  addForm.evalLevel = record.evalLevel
  addForm.evalYear = record.evalYear
  addForm.dataComplete = record.dataComplete
  addForm.publishStatus = record.publishStatus
  addForm.industryUnit = (record as any).industryUnit || ''
  addForm.industryPerson = (record as any).industryPerson || ''
  addForm.industryContact = (record as any).industryContact || ''
  addForm.facilityManageUnit = (record as any).facilityManageUnit || ''
  addForm.facilityManagePerson = (record as any).facilityManagePerson || ''
  addForm.facilityManageContact = (record as any).facilityManageContact || ''
  addForm.facilityMaintainUnit = (record as any).facilityMaintainUnit || ''
  addForm.facilityMaintainPerson = (record as any).facilityMaintainPerson || ''
  addForm.facilityMaintainContact = (record as any).facilityMaintainContact || ''
  addForm.policeUnit = (record as any).policeUnit || ''
  addForm.policeContact = (record as any).policeContact || ''
  addForm.policeContactPhone = (record as any).policeContactPhone || ''
  // 同步到资料卡
  roadCardForm.roadName = record.name
  roadCardForm.level = record.level
}

// 提交
async function handleSubmit() {
  if (!addForm.region || !addForm.name || !addForm.level) {
    message.warning('请填写所有必填字段')
    return
  }

  try {
    if (modalMode.value === 'add') {
      const newRecord: any = {
        key: `road_${Date.now()}`,
        region: addForm.region!,
        name: addForm.name,
        level: addForm.level!,
        roadLocation: addForm.roadLocation,
        buildTime: addForm.buildTime || '',
        hasMonitorDevice: addForm.hasMonitorDevice,
        hasMonitorFacility: addForm.hasMonitorFacility,
        evalLevel: addForm.evalLevel,
        evalYear: addForm.evalYear,
        dataComplete: addForm.dataComplete,
        publishStatus: addForm.publishStatus || '草稿',
        detectTime: new Date().toISOString().slice(0, 10),
        isOverdue: '未超期',
        status: '在用',
        industryUnit: addForm.industryUnit,
        industryPerson: addForm.industryPerson,
        industryContact: addForm.industryContact,
        facilityManageUnit: addForm.facilityManageUnit,
        facilityManagePerson: addForm.facilityManagePerson,
        facilityManageContact: addForm.facilityManageContact,
        facilityMaintainUnit: addForm.facilityMaintainUnit,
        facilityMaintainPerson: addForm.facilityMaintainPerson,
        facilityMaintainContact: addForm.facilityMaintainContact,
        policeUnit: addForm.policeUnit,
        policeContact: addForm.policeContact,
        policeContactPhone: addForm.policeContactPhone,
      }
      tableData.value.unshift(newRecord)
      message.success('新增成功')
    } else if (modalMode.value === 'edit' && currentEditId.value) {
      const idx = tableData.value.findIndex((r) => r.key === currentEditId.value)
      if (idx !== -1) {
        tableData.value[idx] = {
          ...tableData.value[idx],
          region: addForm.region!,
          name: addForm.name,
          level: addForm.level!,
          roadLocation: addForm.roadLocation,
          buildTime: addForm.buildTime || '',
          hasMonitorDevice: addForm.hasMonitorDevice,
          hasMonitorFacility: addForm.hasMonitorFacility,
          evalLevel: addForm.evalLevel,
          evalYear: addForm.evalYear,
          dataComplete: addForm.dataComplete,
          publishStatus: addForm.publishStatus || '草稿',
          industryUnit: addForm.industryUnit,
          industryPerson: addForm.industryPerson,
          industryContact: addForm.industryContact,
          facilityManageUnit: addForm.facilityManageUnit,
          facilityManagePerson: addForm.facilityManagePerson,
          facilityManageContact: addForm.facilityManageContact,
          facilityMaintainUnit: addForm.facilityMaintainUnit,
          facilityMaintainPerson: addForm.facilityMaintainPerson,
          facilityMaintainContact: addForm.facilityMaintainContact,
          policeUnit: addForm.policeUnit,
          policeContact: addForm.policeContact,
          policeContactPhone: addForm.policeContactPhone,
        } as any
      }
      message.success('保存成功')
    }

    addModalVisible.value = false
    loadData()
  } catch (error) {
    message.error('操作失败')
  }
}

// 检测整改记录表格列定义
const roadInspectColumns: any[] = [
  { title: '检测名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '检测时间', dataIndex: 'checkTime', key: 'checkTime', width: 120 },
  { title: '检测类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '评价等级', dataIndex: 'evalGrade', key: 'evalGrade', width: 100 },
  { title: '整改销号结果', dataIndex: 'result', key: 'result', width: 150 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

// 取消
function handleCancel() {
  addModalVisible.value = false
  resetForm()
}

// 导出
function handleExport() {
  message.success('导出成功')
}

// 批量导入
function handleBatchImport() {
  message.info('批量导入功能开发中')
}

// 模版下载
function handleTemplateDownload() {
  message.success('模版下载成功')
}

// 资料卡下载
function handleCardDownload() {
  message.success('资料卡下载成功')
}

// 道路地图
function handleRoadMap() {
  roadMapVisible.value = true
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

// 删除
function handleDelete(record: RoadItem) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除道路 "${record.name}" 吗？`,
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
function handleLog(record: RoadItem) {
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
.road-info-page {
  .search-section {
    margin-bottom: 16px;
    padding: 16px;
    background: #fff;
    border-radius: 4px;
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
      flex-wrap: wrap;
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

// 新增道路弹窗样式
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

.add-road-content {
  :deep(.ant-tabs) {
    .ant-tabs-nav {
      padding: 0 24px;
      margin-bottom: 0;

      &::before {
        border-bottom: 1px solid #f0f0f0;
      }
    }

    .ant-tabs-tab {
      font-size: 14px;
      padding: 12px 0;
    }

    .ant-tabs-content {
      padding: 0 24px;
    }
  }
}

.add-road-form {
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

  .location-btn-item {
    :deep(.ant-form-item-control) {
      display: flex;
      align-items: center;
    }
  }

  .location-btn {
    white-space: nowrap;
    height: 28px;
    font-size: 12px;
    padding: 0 12px;
    border-radius: 4px;
    background: #2A64FF;
    border-color: #2A64FF;
  }

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

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-form-item-label > label) {
    font-weight: 500;
  }
}

// 道路资料卡表单
.road-card-form {
  max-height: 520px;
  overflow-y: auto;
  padding: 16px 0;

  .card-section {
    margin-bottom: 20px;

    .card-section-title {
      font-size: 14px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 3px solid #2A64FF;
    }
  }

  // 卡片表格样式
  :deep(.card-label-cell) {
    background: #fafafa;
    text-align: right;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    padding-right: 12px;
    white-space: nowrap;
  }

  :deep(.ant-table-small) {
    .ant-table-cell {
      padding: 4px 8px;
    }
  }

  :deep(.ant-input),
  :deep(.ant-input-number),
  :deep(.ant-select) {
    width: 100%;
  }
}

// 道路地图占位
.road-map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;
  background: #f0f0f0;
  font-size: 16px;
  color: #999;
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

  .add-road-form {
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
