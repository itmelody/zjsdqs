<template>
  <div class="bridge-info-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <HomeOutlined />
          <span>档案管理</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>基础信息管理</a-breadcrumb-item>
        <a-breadcrumb-item>桥梁信息</a-breadcrumb-item>
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
        <a-form-item label="桥梁名称">
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入桥梁名称"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="桥梁类型">
          <a-select
            v-model:value="searchForm.type"
            placeholder="请选择桥梁类型"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in bridgeTypeOptions"
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
        <!-- 是否涉航桥梁 -->
        <template v-if="column.key === 'isNavigationBridge'">
          {{ record.isNavigationBridge ? '是' : '否' }}
        </template>
        
        <!-- 是否设置监控设备 -->
        <template v-else-if="column.key === 'hasMonitorDevice'">
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

    <!-- 桥梁表单弹窗（新增/查看/编辑共用） -->
    <a-modal
      v-model:open="addVisible"
      :footer="null"
      width="1000px"
      :body-style="{ padding: '0' }"
      class="add-bridge-modal"
    >
      <template #title>
        <div class="add-modal-header">
          <span class="add-modal-title">{{ formTitle }}</span>
          <a-button v-if="formMode !== 'view'" type="primary" class="add-sub-card-btn">
            <template #icon><PlusOutlined /></template>
            新增子桥资料卡
          </a-button>
        </div>
      </template>
      <div class="add-bridge-content">
        <a-tabs v-model:activeKey="addActiveTab">
          <a-tab-pane key="basic" tab="基础信息">
            <div class="add-bridge-form">
              <a-form :model="addForm" layout="horizontal" :label-col="{ style: { width: '100px' } }">
                <!-- 基础信息区域 -->
                <div class="form-section">
                  <div class="form-section-title">基础信息</div>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="桥梁名称" required>
                        <a-input v-model:value="addForm.name" placeholder="请输入桥梁名称" :disabled="isView" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="桥梁类型" required>
                        <a-select v-model:value="addForm.type" placeholder="请选择" :disabled="isView">
                          <a-select-option
                            v-for="item in bridgeTypeOptions"
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
                      <a-form-item label="结构类型" required>
                        <a-input v-model:value="addForm.structureType" placeholder="请选择" disabled style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="归属地区" required>
                        <a-select v-model:value="addForm.region" placeholder="请选择区县" :disabled="isView">
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
                      <a-form-item label="桥梁位置" required>
                        <a-input v-model:value="addForm.location" placeholder="请输入桥梁位置" :disabled="isView" style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item class="location-btn-item" :colon="false" label=" ">
                        <a-button type="primary" size="small" class="location-btn">查看点位位置</a-button>
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
                          <a-input v-model:value="addForm.industryUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.industryPerson" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.industryContact" placeholder="点击选择" :disabled="isView" />
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
                          <a-input v-model:value="addForm.facilityUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.facilityPerson" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.facilityContact" placeholder="点击选择" :disabled="isView" />
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
                          <a-input v-model:value="addForm.maintainUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.maintainPerson" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.maintainContact" placeholder="点击选择" :disabled="isView" />
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
                          <a-input v-model:value="addForm.policeUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="联系人" required>
                          <a-input v-model:value="addForm.policeContact" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.policeContactPhone" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                </div>

                <!-- 安全管理 -->
                <div class="form-section">
                  <div class="form-section-title">安全管理</div>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="是否涉航桥梁" required>
                        <a-radio-group v-model:value="addForm.isNavigationBridge" :disabled="isView">
                          <a-radio :value="false">否</a-radio>
                          <a-radio :value="true">是</a-radio>
                        </a-radio-group>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="是否为大件运输通道" required :label-col="{ style: { width: '140px' } }">
                        <a-input v-model:value="addForm.isHeavyTransport" placeholder="" :disabled="isView" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>
          <a-tab-pane key="card" tab="桥梁资料卡">
            <div class="bridge-card-placeholder">
              <a-empty description="桥梁资料卡功能开发中" />
            </div>
          </a-tab-pane>
        </a-tabs>
        <!-- 底部操作栏 -->
        <div class="add-modal-footer">
          <template v-if="formMode === 'view'">
            <a-button @click="addVisible = false">关 闭</a-button>
          </template>
          <template v-else>
            <a-button type="primary" @click="handleSaveDraft">暂存草稿</a-button>
            <a-button type="primary" @click="handleSubmitAdd">提 交</a-button>
            <a-button @click="handleResetAdd">重 置</a-button>
            <a-button @click="addVisible = false">关 闭</a-button>
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
      <div class="add-bridge-content">
        <div class="add-bridge-form">
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
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
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
import type { BridgeItem, BridgeSearchParams } from '@/types/bridge'
import {
  getBridgeList,
  deleteBridge,
  batchDeleteBridge,
  regionOptions,
  bridgeTypeOptions,
} from '@/utils/mockData'

const route = useRoute()

// 是否显示检测/评价单位列（从检测评价菜单进入时显示）
const showEvalUnit = computed(() => route.query.showEvalUnit === '1')

// 搜索表单
const searchForm = reactive<BridgeSearchParams>({
  region: undefined,
  name: undefined,
  type: undefined,
  page: 1,
  pageSize: 10,
})

// 表格数据
const tableData = ref<BridgeItem[]>([])
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
      title: '桥梁名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '桥梁类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '是否涉航桥梁',
      dataIndex: 'isNavigationBridge',
      key: 'isNavigationBridge',
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
      width: 200,
    },
  )
  return base
})

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
    const params: BridgeSearchParams = {
      region: searchForm.region,
      name: searchForm.name,
      type: searchForm.type,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }
    
    const result = await getBridgeList(params)
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
  pagination.current = 1
  loadData()
}

// 刷新
function handleRefresh() {
  loadData()
}

// 新增/查看/编辑弹窗
const addVisible = ref(false)
const addActiveTab = ref('basic')
const formMode = ref<'add' | 'view' | 'edit'>('add')
const isView = computed(() => formMode.value === 'view')
const formTitle = computed(() => {
  switch (formMode.value) {
    case 'view': return '查看桥梁'
    case 'edit': return '编辑桥梁'
    default: return '新增桥梁'
  }
})
const editingRecordKey = ref('')
const addForm = reactive({
  name: '',
  type: undefined as string | undefined,
  structureType: '',
  region: undefined as string | undefined,
  location: '',
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
  isNavigationBridge: undefined as boolean | undefined,
  isHeavyTransport: '',
})

function resetAddForm() {
  addForm.name = ''
  addForm.type = undefined
  addForm.structureType = ''
  addForm.region = undefined
  addForm.location = ''
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
  addForm.isNavigationBridge = undefined
  addForm.isHeavyTransport = ''
  addActiveTab.value = 'basic'
}

// 新增
function handleAdd() {
  resetAddForm()
  formMode.value = 'add'
  addVisible.value = true
}

// 暂存草稿
function handleSaveDraft() {
  message.success('草稿暂存成功')
}

// 提交新增
function handleSubmitAdd() {
  if (!addForm.name) { message.warning('请输入桥梁名称'); return }
  if (!addForm.type) { message.warning('请选择桥梁类型'); return }
  if (!addForm.region) { message.warning('请选择归属地区'); return }
  if (addForm.isNavigationBridge === undefined) { message.warning('请选择是否涉航桥梁'); return }
  message.success('提交成功')
  addVisible.value = false
  loadData()
}

// 重置
function handleResetAdd() {
  resetAddForm()
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
      try {
        await batchDeleteBridge(selectedRowKeys.value)
        message.success('批量删除成功')
        selectedRowKeys.value = []
        loadData()
      } catch (error) {
        message.error('批量删除失败')
      }
    },
  })
}

// 编辑
function handleEdit(record: BridgeItem) {
  resetAddForm()
  formMode.value = 'edit'
  editingRecordKey.value = record.key
  // 填充表单数据
  addForm.name = record.name
  addForm.type = record.type
  addForm.structureType = record.structureType || ''
  addForm.region = record.region
  addForm.location = ''
  addForm.isNavigationBridge = record.isNavigationBridge
  addVisible.value = true
}

// 删除
function handleDelete(record: BridgeItem) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除桥梁 "${record.name}" 吗？`,
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        await deleteBridge(record.key)
        message.success('删除成功')
        loadData()
      } catch (error) {
        message.error('删除失败')
      }
    },
  })
}

// 日志
function handleLog(record: BridgeItem) {
  message.info(`查看日志: ${record.name}`)
}

// 查看详情
function handleView(record: BridgeItem) {
  resetAddForm()
  formMode.value = 'view'
  // 填充表单数据
  addForm.name = record.name
  addForm.type = record.type
  addForm.structureType = record.structureType || ''
  addForm.region = record.region
  addForm.location = ''
  addForm.isNavigationBridge = record.isNavigationBridge
  addVisible.value = true
}

// 页码改变
function handlePageChange(page: number, pageSize: number) {
  pagination.current = page
  pagination.pageSize = pageSize
  loadData()
}

// 每页显示数量改变
function handlePageSizeChange(current: number, size: number) {
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
.bridge-info-page {
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
  
  .bridge-card-placeholder {
    padding: 60px 0;
    text-align: center;
  }
}

// 新增桥梁弹窗样式
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

  .add-sub-card-btn {
    background: #2A64FF;
    border-color: #2A64FF;
    border-radius: 6px;
    font-size: 13px;
  }
}

.add-bridge-content {
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

.add-bridge-form {
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

  // 查看点位位置按钮
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

  .add-bridge-form {
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
