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
        <a-form-item>
          <a-button @click="handleReset" style="margin-right: 8px">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary" @click="handleSearch">
            <template #icon><SearchOutlined /></template>
            搜索
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
        <a-button @click="handleImport">
          <template #icon><UploadOutlined /></template>
          导入
        </a-button>
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          导出
        </a-button>
        <a-button @click="handleBatchFill" :disabled="selectedRowKeys.length === 0">
          <template #icon><EditOutlined /></template>
          批量填写
        </a-button>
        <a-button danger @click="handleBatchDelete" :disabled="selectedRowKeys.length === 0">
          <template #icon><DeleteOutlined /></template>
          批量删除
        </a-button>
        <span class="stat-tag" v-if="incompleteCount > 0">
          未完善信息的{{ incompleteCount }}条；未完成本年度评价任务的0条
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
      :scroll="{ x: 1600 }"
    >
      <template #bodyCell="{ column, record }">
        <!-- 是否设置监控设备 -->
        <template v-if="column.key === 'hasMonitorDevice'">
          {{ record.hasMonitorDevice ? '是' : '否' }}
        </template>
        
        <!-- 是否设置监测设施 -->
        <template v-else-if="column.key === 'hasMonitorFacility'">
          {{ record.hasMonitorFacility ? '是' : '否' }}
        </template>
        
        <!-- 数据是否完善 -->
        <template v-else-if="column.key === 'dataComplete'">
          <a-tag :color="record.dataComplete ? 'success' : 'error'">
            {{ record.dataComplete ? '是' : '否' }}
          </a-tag>
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
        <a-tabs v-model:activeKey="activeTab" :disabled="isViewMode">
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
            <div class="road-card-placeholder">
              <a-empty description="道路资料卡功能开发中" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
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
} from '@ant-design/icons-vue'
import type { RoadItem, RoadSearchParams } from '@/types/road'
import {
  getRoadList,
  roadLevelOptions,
  regionOptions,
} from '@/utils/mockRoadData'

// 搜索表单
const searchForm = reactive<RoadSearchParams>({
  region: undefined,
  name: undefined,
  level: undefined,
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
  return tableData.value.filter((item) => !item.dataComplete).length
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
const columns: TableColumnsType = [
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
]

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
  // 重置表单
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
  addModalVisible.value = true
}

// 查看
function handleView(record: RoadItem) {
  modalMode.value = 'view'
  currentEditId.value = record.key
  fillForm(record)
  addModalVisible.value = true
}

// 编辑
function handleEdit(record: RoadItem) {
  modalMode.value = 'edit'
  currentEditId.value = record.key
  fillForm(record)
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
  // 三级责任体系
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
  // 三级责任体系（从扩展字段获取）
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
}

// 提交
async function handleSubmit() {
  // 验证必填字段
  if (!addForm.region || !addForm.name || !addForm.level) {
    message.warning('请填写所有必填字段')
    return
  }

  try {
    if (modalMode.value === 'add') {
      // 新增
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
        // 三级责任体系
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
      // 编辑
      const idx = tableData.value.findIndex(r => r.key === currentEditId.value)
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
          // 三级责任体系
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

// 取消
function handleCancel() {
  addModalVisible.value = false
  resetForm()
}

// 导出
function handleExport() {
  message.info('导出功能开发中')
}

// 导入
function handleImport() {
  message.info('导入功能开发中')
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

  .road-card-placeholder {
    padding: 60px 0;
    text-align: center;
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

  // 选择点位位置按钮
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

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-form-item-label > label) {
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
