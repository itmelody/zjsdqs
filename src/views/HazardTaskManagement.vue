<template>
  <div class="task-page">
    <div class="card">
      <div class="page-header"><h3>任务管理及发布</h3></div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">检查任务</span>
          <a-input v-model:value="filters.taskName" placeholder="请输入检查任务名称" allow-clear style="width: 180px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">检查类型</span>
          <a-select v-model:value="filters.checkType" placeholder="请选择" allow-clear style="width: 140px">
            <a-select-option value="日常检查">日常检查</a-select-option>
            <a-select-option value="专项检查">专项检查</a-select-option>
            <a-select-option value="综合安全隐患排查">综合安全隐患排查</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">检查场景</span>
          <a-select v-model:value="filters.checkScene" placeholder="请选择" allow-clear style="width: 140px">
            <a-select-option value="桥梁检查">桥梁检查</a-select-option>
            <a-select-option value="道路检查">道路检查</a-select-option>
            <a-select-option value="隧道检查">隧道检查</a-select-option>
          </a-select>
        </div>
        <div class="filter-actions">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </div>
      </div>

      <!-- 新建按钮 -->
      <div class="table-toolbar">
        <a-button type="primary" @click="openCreateModal">+ 新建填报表</a-button>
      </div>

      <!-- 数据表格 -->
      <a-table :columns="columns" :data-source="filteredData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }"
        size="small" row-key="id" class="task-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'maintenanceCount'">
            <span>{{ record.maintenanceUnits?.length || 0 }}</span>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'specialCategory'">
            <span v-if="record.checkType === '专项检查'">{{ record.specialCategory || '-' }}</span>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <div class="action-btns">
              <a-button type="link" size="small" @click="openEditModal(record)">编辑检查任务</a-button>
              <a-button type="link" size="small" @click="openAddMaintenanceModal(record)">添加养护单位</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新建/编辑检查任务弹窗 -->
    <a-modal v-model:open="createModalVisible" :title="isEditMode ? '编辑检查任务' : '新增检查任务'"
      :footer="null" width="1200px" class="task-create-modal">
      <div class="task-form">
        <!-- 第一行：检查主题、发布单位 -->
        <div class="form-row">
          <div class="form-item required">
            <label>检查主题：</label>
            <a-input v-model:value="createForm.name" placeholder="请输入检查主题" />
          </div>
          <div class="form-item required">
            <label>发布单位：</label>
            <a-input v-model:value="createForm.publishUnit" placeholder="请输入发布单位" disabled />
          </div>
        </div>

        <!-- 第二行：检查时间、检查地区 -->
        <div class="form-row">
          <div class="form-item required">
            <label>检查时间：</label>
            <a-range-picker v-model:value="createForm.checkTime" style="width: 100%" />
          </div>
          <div class="form-item required">
            <label>检查地区：</label>
            <a-select v-model:value="createForm.region" placeholder="请选择检查地区" style="width: 100%">
              <a-select-option value="浙江省 / 杭州市 / 上城区">浙江省 / 杭州市 / 上城区</a-select-option>
              <a-select-option value="浙江省 / 杭州市 / 下城区">浙江省 / 杭州市 / 下城区</a-select-option>
              <a-select-option value="浙江省 / 宁波市 / 海曙区">浙江省 / 宁波市 / 海曙区</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 第三行：检查类型、检查场景 -->
        <div class="form-row">
          <div class="form-item required">
            <label>检查类型：</label>
            <a-select v-model:value="createForm.checkType" placeholder="请选择" style="width: 100%">
              <a-select-option value="日常检查">日常检查</a-select-option>
              <a-select-option value="专项检查">专项检查</a-select-option>
              <a-select-option value="综合安全隐患排查">综合安全隐患排查</a-select-option>
            </a-select>
          </div>
          <div class="form-item required">
            <label>检查场景：</label>
            <a-select v-model:value="createForm.checkScene" placeholder="请选择" style="width: 100%">
              <a-select-option value="桥梁检查">桥梁检查</a-select-option>
              <a-select-option value="道路检查">道路检查</a-select-option>
              <a-select-option value="隧道检查">隧道检查</a-select-option>
            </a-select>
          </div>
        </div>

        <!-- 第四行：专项类别（仅专项检查时显示） -->
        <div class="form-row" v-if="createForm.checkType === '专项检查'">
          <div class="form-item required">
            <label>专项类别：</label>
            <a-select v-model:value="createForm.specialCategory" placeholder="请选择" style="width: 100%">
              <a-select-option value="专业隐患排查">专业隐患排查</a-select-option>
              <a-select-option value="季节性隐患排查">季节性隐患排查</a-select-option>
              <a-select-option value="重大活动/重大节日保障隐患排查">重大活动/重大节日保障隐患排查</a-select-option>
            </a-select>
          </div>
          <div class="form-item-placeholder"></div>
        </div>

        <!-- 检查项目表格 -->
        <div class="form-row check-items-section">
          <label class="section-label">检查项目：</label>
          <div class="check-items-table">
            <div class="table-header">
              <div class="col-enable">是否启用</div>
              <div class="col-item">检查项</div>
              <div class="col-form">填报表</div>
            </div>
            <div class="table-body">
              <div v-for="(item, index) in checkItemsList" :key="index" class="table-row">
                <div class="col-enable">
                  <a-switch v-model:checked="item.enabled" size="small" />
                </div>
                <div class="col-item">{{ item.name }}</div>
                <div class="col-form">
                  <a-select 
                    v-model:value="item.formId" 
                    placeholder="请选择填报表" 
                    :disabled="!item.enabled"
                    style="width: 100%">
                    <a-select-option v-for="form in getAvailableFormsForItem(item.name)" :key="form.id" :value="form.id">
                      {{ form.name }}
                    </a-select-option>
                  </a-select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <a-button type="primary" @click="handleSaveTask">提交</a-button>
        <a-button @click="handleResetForm">重置</a-button>
        <a-button @click="createModalVisible = false">关闭</a-button>
      </div>
    </a-modal>

    <!-- 添加养护单位弹窗 -->
    <a-modal v-model:open="addMaintenanceModalVisible" :footer="null" width="1400px" class="maintenance-unit-modal">
      <template #title>
        <span>添加养护单位</span>
      </template>
      
      <!-- 工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <a-button type="primary" size="small" @click="handleAddNewTask">+ 新增任务</a-button>
        </div>
        <div class="toolbar-right">
          <a-icon type="reload" style="cursor: pointer; margin-right: 8px;" />
          <a-icon type="setting" style="cursor: pointer; margin-right: 8px;" />
          <a-icon type="download" style="cursor: pointer;" />
        </div>
      </div>

      <!-- 数据表格 -->
      <a-table 
        :columns="maintenanceUnitColumns" 
        :data-source="maintenanceUnitTableData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true, defaultPageSize: 10 }"
        size="small" 
        row-key="id" 
        class="maintenance-unit-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === '进行中' ? 'processing' : 'default'">{{ record.status }}</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="handleEditMaintenance(record)">编辑</a-button>
          </template>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

/* ========== 筛选 ========== */
const filters = reactive({
  taskName: '',
  checkType: undefined as string | undefined,
  checkScene: undefined as string | undefined,
})

function handleReset() {
  filters.taskName = ''
  filters.checkType = undefined
  filters.checkScene = undefined
}

function handleSearch() {}

/* ========== 表格列定义 ========== */
const columns = [
  { title: '检查任务', dataIndex: 'name', key: 'name', width: 180 },
  { title: '检查时间', dataIndex: 'checkTime', key: 'checkTime', width: 200 },
  { title: '发布单位', dataIndex: 'publishUnit', key: 'publishUnit', width: 120 },
  { title: '养护单位', key: 'maintenanceCount', width: 100, align: 'center' as const },
  { title: '状态', key: 'status', width: 100, align: 'center' as const },
  { title: '检查类型', dataIndex: 'checkType', key: 'checkType', width: 140, align: 'center' as const },
  { title: '检查场景', dataIndex: 'checkScene', key: 'checkScene', width: 120, align: 'center' as const },
  { title: '专项类别', key: 'specialCategory', width: 180, align: 'center' as const },
  { title: '检查项目', dataIndex: 'checkProject', key: 'checkProject', width: 120 },
  { title: '操作', key: 'action', width: 200, align: 'center' as const, fixed: 'right' as const },
]

function getStatusColor(status: string) {
  const colorMap: Record<string, string> = {
    '未开始': 'default',
    '进行中': 'processing',
    '已结束': 'success',
  }
  return colorMap[status] || 'default'
}

/* ========== 表格数据 ========== */
const tableData = ref([
  {
    id: 1,
    name: '2024年第一季度桥梁日常检查',
    checkTime: '2024-01-01 ~ 2024-03-31',
    publishUnit: '杭州市城管局',
    maintenanceUnits: ['杭州路桥有限公司', '浙江市政工程有限公司'],
    status: '进行中',
    checkType: '日常检查',
    checkScene: '桥梁检查',
    specialCategory: '',
    checkProject: '桥梁设施',
  },
  {
    id: 2,
    name: '防汛抗台专项检查',
    checkTime: '2024-06-01 ~ 2024-09-30',
    publishUnit: '宁波市交通局',
    maintenanceUnits: ['宁波市政集团'],
    status: '未开始',
    checkType: '专项检查',
    checkScene: '道路检查',
    specialCategory: '季节性隐患排查',
    checkProject: '防汛抗台',
  },
  {
    id: 3,
    name: '隧道综合安全隐患排查',
    checkTime: '2024-02-01 ~ 2024-02-28',
    publishUnit: '温州市住建局',
    maintenanceUnits: [],
    status: '已结束',
    checkType: '综合安全隐患排查',
    checkScene: '隧道检查',
    specialCategory: '',
    checkProject: '隧道管理',
  },
])

const filteredData = computed(() => {
  return tableData.value.filter(row => {
    if (filters.taskName && !row.name.includes(filters.taskName)) return false
    if (filters.checkType && row.checkType !== filters.checkType) return false
    if (filters.checkScene && row.checkScene !== filters.checkScene) return false
    return true
  })
})

/* ========== 新建/编辑检查任务弹窗 ========== */
const createModalVisible = ref(false)
const isEditMode = ref(false)
const editingTaskId = ref<number | null>(null)

const createForm = reactive({
  name: '',
  publishUnit: '当前用户单位', // 发布单位，默认当前用户单位
  checkType: undefined as string | undefined,
  specialCategory: undefined as string | undefined,
  checkScene: undefined as string | undefined,
  region: undefined as string | undefined,
  checkTime: undefined as [any, any] | undefined,
})

// 模拟已配置的检查表列表（从检查表配置页面获取）
// 注意：实际项目中应该从后端API或共享store获取
// 这里模拟从 HazardChecklistConfig.vue 的 tableData 中获取的数据
const configuredChecklists = ref([
  { id: 9, name: '测试0618', type: '日常检查', scene: '桥梁检查', project: '桥梁设施' },
  { id: 7, name: '测试', type: '日常检查', scene: '桥梁检查', project: '桥梁设施' },
  { id: 6, name: '照明', type: '日常检查', scene: '桥梁检查', project: '照明设施' },
  { id: 5, name: '人行', type: '日常检查', scene: '桥梁检查', project: '人行天桥设施' },
  // 其他场景的检查表
  { id: 10, name: '道路设施检查表', type: '日常检查', scene: '道路检查', project: '道路设施' },
  { id: 11, name: '隧道设施检查表', type: '日常检查', scene: '隧道检查', project: '隧道设施' },
])

// 根据类型、场景、专项类别和检查项目过滤可用的填报表
const availableChecklistForms = computed(() => {
  const type = createForm.checkType
  const scene = createForm.checkScene
  const specialCategory = createForm.specialCategory
  
  if (!type || !scene) return []
  
  return configuredChecklists.value.filter(form => {
    // 类型必须匹配
    if (form.type !== type) return false
    // 场景必须匹配
    if (form.scene !== scene) return false
    // 如果是专项检查，专项类别也必须匹配
    if (type === '专项检查' && form.specialCategory !== specialCategory) return false
    return true
  })
})

// 获取当前检查项可用的填报表选项
function getAvailableFormsForItem(itemName: string) {
  return availableChecklistForms.value.filter(form => form.project === itemName)
}

// 检查项目列表（根据类型和场景动态生成）
const checkItemsList = ref<any[]>([])

// 防止编辑模式下初始化表单赋值触发watch重新生成检查项
let skipWatchCheckItems = false

// 根据检查类型、专项类别和检查场景动态生成检查项目
function generateCheckItems() {
  const type = createForm.checkType
  const specialCategory = createForm.specialCategory
  const scene = createForm.checkScene
  
  if (!type || !scene) {
    checkItemsList.value = []
    return
  }
  
  let items: string[] = []
  
  // 日常检查
  if (type === '日常检查') {
    if (scene === '桥梁检查') {
      items = ['桥梁设施', '人行天桥设施', '照明设施', '作业安全', '实施管理']
    } else if (scene === '道路检查') {
      items = ['道路设施', '照明设施', '作业安全', '实施管理']
    } else if (scene === '隧道检查') {
      items = ['隧道设施', '下穿通道设施', '人行地道设施', '作业安全', '实施管理']
    }
  }
  
  // 专项检查
  if (type === '专项检查') {
    if (specialCategory === '专业隐患排查') {
      if (scene === '桥梁检查') {
        items = ['桥梁设施', '照明设施']
      } else if (scene === '道路检查') {
        items = ['道路设施', '照明设施']
      } else if (scene === '隧道检查') {
        items = ['隧道设施', '照明设施']
      }
    } else if (specialCategory === '季节性隐患排查') {
      items = ['防汛抗台', '抗雪防冻', '抗高温']
    } else if (specialCategory === '重大活动/重大节日保障隐患排查') {
      items = ['重大活动/重大节日保障隐患排查']
    }
  }
  
  // 综合安全隐患排查
  if (type === '综合安全隐患排查') {
    if (scene === '桥梁检查') {
      items = ['桥梁管理', '桥梁设施']
    } else if (scene === '道路检查') {
      items = ['道路管理', '道路设施']
    } else if (scene === '隧道检查') {
      items = ['隧道管理', '隧道设施']
    }
  }
  
  // 生成带enabled和formId的检查项列表
  checkItemsList.value = items.map(name => ({
    name,
    enabled: false,
    formId: undefined as number | undefined,
  }))
}

// 监听变化，重新生成检查项目列表
watch([() => createForm.checkType, () => createForm.specialCategory, () => createForm.checkScene], () => {
  if (skipWatchCheckItems) return
  generateCheckItems()
})

function openCreateModal() {
  isEditMode.value = false
  editingTaskId.value = null
  resetCreateForm()
  createModalVisible.value = true
}

function openEditModal(record: any) {
  isEditMode.value = true
  editingTaskId.value = record.id
  
  // 禁止watch在初始化赋值时触发generateCheckItems
  skipWatchCheckItems = true
  
  createForm.name = record.name
  createForm.publishUnit = record.publishUnit
  createForm.checkType = record.checkType
  createForm.specialCategory = record.specialCategory || undefined
  createForm.checkScene = record.checkScene
  createForm.region = record.region || undefined
  createForm.checkTime = undefined // 实际应该解析日期范围
  
  // 生成检查项目列表并恢复已选中的项
  generateCheckItems()
  
  // 如果有checkItems数据，用它来恢复
  if (record.checkItems && record.checkItems.length > 0) {
    record.checkItems.forEach((savedItem: any) => {
      const item = checkItemsList.value.find(i => i.name === savedItem.name)
      if (item) {
        item.enabled = savedItem.enabled
        item.formId = savedItem.formId
      }
    })
  } else if (record.checkProject) {
    // 否则根据checkProject字段来预选对应的检查项
    const projectList = record.checkProject.split('\n').filter((s: string) => s.trim())
    checkItemsList.value.forEach(item => {
      if (projectList.includes(item.name)) {
        item.enabled = true
      }
    })
  }
  
  createModalVisible.value = true
  
  // 等待DOM更新后重新启用watch
  nextTick(() => {
    skipWatchCheckItems = false
  })
}

function resetCreateForm() {
  createForm.name = ''
  createForm.publishUnit = '当前用户单位'
  createForm.checkType = undefined
  createForm.specialCategory = undefined
  createForm.checkScene = undefined
  createForm.region = undefined
  createForm.checkTime = undefined
  checkItemsList.value = []
}

function handleResetForm() {
  resetCreateForm()
  message.success('已重置')
}

function handleSaveTask() {
  if (!createForm.name) { message.warning('请输入检查主题'); return }
  if (!createForm.publishUnit) { message.warning('请输入发布单位'); return }
  if (!createForm.checkType) { message.warning('请选择检查类型'); return }
  if (createForm.checkType === '专项检查' && !createForm.specialCategory) {
    message.warning('请选择专项类别')
    return
  }
  if (!createForm.checkScene) { message.warning('请选择检查场景'); return }
  if (!createForm.region) { message.warning('请选择检查地区'); return }
  if (!createForm.checkTime) { message.warning('请选择检查时间'); return }
  
  // 验证至少有一个检查项被启用并选择了填报表
  const enabledItems = checkItemsList.value.filter(item => item.enabled)
  if (enabledItems.length === 0) {
    message.warning('请至少启用一个检查项并选择填报表')
    return
  }
  
  const invalidItems = enabledItems.filter(item => !item.formId)
  if (invalidItems.length > 0) {
    message.warning('请为所有启用的检查项选择填报表')
    return
  }

  if (isEditMode.value && editingTaskId.value) {
    // 编辑模式
    const index = tableData.value.findIndex(t => t.id === editingTaskId.value)
    if (index !== -1) {
      const enabledCheckItems = checkItemsList.value.filter(item => item.enabled)
      const newCheckProject = enabledCheckItems.map(item => item.name).join('\n')
      tableData.value[index] = {
        ...tableData.value[index],
        name: createForm.name,
        publishUnit: createForm.publishUnit,
        checkType: createForm.checkType!,
        specialCategory: createForm.specialCategory || '',
        checkScene: createForm.checkScene!,
        region: createForm.region,
        checkTime: `${dayjs(createForm.checkTime![0]).format('YYYY-MM-DD')} ~ ${dayjs(createForm.checkTime![1]).format('YYYY-MM-DD')}`,
        checkProject: newCheckProject,
        checkItems: enabledCheckItems.map(item => ({
          name: item.name,
          enabled: true,
          formId: item.formId,
        })),
      }
      message.success('修改成功')
    }
  } else {
    // 新建模式
    const enabledCheckItems = checkItemsList.value.filter(item => item.enabled)
    const newCheckProject = enabledCheckItems.map(item => item.name).join('\n')
    const newTask = {
      id: Date.now(),
      name: createForm.name,
      checkTime: `${dayjs(createForm.checkTime![0]).format('YYYY-MM-DD')} ~ ${dayjs(createForm.checkTime![1]).format('YYYY-MM-DD')}`,
      publishUnit: createForm.publishUnit,
      maintenanceUnits: [],
      status: '未开始',
      checkType: createForm.checkType!,
      checkScene: createForm.checkScene!,
      specialCategory: createForm.specialCategory || '',
      region: createForm.region,
      checkProject: newCheckProject,
      checkItems: enabledCheckItems.map(item => ({
        name: item.name,
        enabled: true,
        formId: item.formId,
      })),
    }
    tableData.value.unshift(newTask)
    message.success('创建成功')
  }
  createModalVisible.value = false
}

/* ========== 添加养护单位弹窗 ========= */
const addMaintenanceModalVisible = ref(false)
const currentTaskId = ref<number | null>(null)
const currentTaskRecord = ref<any>(null)

// 养护单位表格列定义
const maintenanceUnitColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const },
  { title: '养护单位名称', dataIndex: 'unitName', key: 'unitName', width: 200 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 180 },
  { title: '发布单位', dataIndex: 'publishUnit', key: 'publishUnit', width: 200 },
  { title: '授权区域', dataIndex: 'region', key: 'region', width: 150 },
  { title: '检查时间', dataIndex: 'checkTime', key: 'checkTime', width: 200 },
  { title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', width: 120 },
  { title: '合同时间', dataIndex: 'contractTime', key: 'contractTime', width: 150 },
  { title: '状态', key: 'status', width: 80, align: 'center' as const },
  { title: '检查项目', dataIndex: 'checkProject', key: 'checkProject', width: 120 },
  { title: '操作', key: 'action', width: 80, align: 'center' as const },
]

// 养护单位表格数据（动态根据任务的检查项目过滤）
const maintenanceUnitTableData = ref<any[]>([])

function handleAddNewTask() {
  message.info('新增任务功能待实现')
}

function handleEditMaintenance(record: any) {
  message.info(`编辑养护单位：${record.unitName}`)
}

function openAddMaintenanceModal(record: any) {
  currentTaskId.value = record.id
  currentTaskRecord.value = record
  // 根据当前任务的检查项目过滤养护单位数据
  loadMaintenanceUnitData(record)
  addMaintenanceModalVisible.value = true
}

// 根据任务的养护单位列表动态过滤养护单位表格数据
function loadMaintenanceUnitData(record: any) {
  const taskMaintenanceUnits = record.maintenanceUnits || []
  // 模拟养护单位数据库
  const allMaintenanceUnits = [
    {
      id: 1,
      unitName: '杭州路桥有限公司',
      creditCode: '91330100MA2K8FQY11',
      publishUnit: '浙江省-地（市）-杭州市-政府机构-杭州市城管局',
      region: '杭州市',
      checkTime: '2024-01-01 ~ 2024-03-31',
      contractNo: 'HZ-2024-001',
      contractTime: '2024-01-01',
      status: '进行中',
      checkProject: '桥梁设施'
    },
    {
      id: 2,
      unitName: '浙江市政工程有限公司',
      creditCode: '91330000MA2K8FQY12',
      publishUnit: '浙江省-地（市）-杭州市-政府机构-杭州市城管局',
      region: '杭州市',
      checkTime: '2024-01-01 ~ 2024-03-31',
      contractNo: 'HZ-2024-002',
      contractTime: '2024-01-01',
      status: '进行中',
      checkProject: '桥梁设施'
    },
    {
      id: 3,
      unitName: '宁波市政集团',
      creditCode: '91330200MA2L9GRT33',
      publishUnit: '浙江省-地（市）-宁波市-政府机构-宁波市交通局',
      region: '宁波市',
      checkTime: '2024-06-01 ~ 2024-09-30',
      contractNo: 'NB-2024-001',
      contractTime: '2024-06-01',
      status: '未开始',
      checkProject: '防汛抗台'
    },
    {
      id: 4,
      unitName: '浙江慧威城市设施养护有限公司',
      creditCode: '91330800MA8W7BJX56',
      publishUnit: '浙江省-地（市）-衢州市-政府机构-衢州智慧新城管理委员会-智慧城管部',
      region: '衢州市智慧新城',
      checkTime: '2026-01-01 ~ 2027-01-01',
      contractNo: '',
      contractTime: '',
      status: '进行中',
      checkProject: '桥梁设施'
    },
    {
      id: 5,
      unitName: '衢州市慧城市政绿化工程有限公司',
      creditCode: '91330800MA2DILN0XY',
      publishUnit: '浙江省-地（市）-衢州市-政府机构-衢州智慧新城管理委员会-智慧城管部',
      region: '衢州市智慧新城',
      checkTime: '2026-01-01 ~ 2027-01-01',
      contractNo: '',
      contractTime: '',
      status: '进行中',
      checkProject: '人行天桥设施'
    },
    {
      id: 6,
      unitName: '温州隧道管理有限公司',
      creditCode: '91330300MA2L9GRT34',
      publishUnit: '浙江省-地（市）-温州市-政府机构-温州市住建局',
      region: '温州市',
      checkTime: '2026-02-15 ~ 2027-02-15',
      contractNo: '',
      contractTime: '',
      status: '进行中',
      checkProject: '隧道管理'
    }
  ]
  // 只显示当前任务关联的养护单位
  maintenanceUnitTableData.value = allMaintenanceUnits.filter(unit => {
    return taskMaintenanceUnits.includes(unit.unitName)
  })
}
</script>

<style scoped lang="scss">
.task-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 20px 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.page-header { margin-bottom: 16px; h3 { margin: 0; font-size: 16px; font-weight: 600; color: #1f1f1f; } }
.filter-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; gap: 8px; }
.filter-label { font-size: 13px; color: #333; white-space: nowrap; }
.filter-actions { display: flex; gap: 8px; margin-left: auto; }
.action-btns { display: flex; gap: 4px; justify-content: center; }
.table-toolbar { margin-bottom: 12px; }
.task-table {
  :deep(.ant-table) { font-size: 13px; }
  :deep(.ant-table-thead > tr > th) { padding: 10px 8px; font-size: 13px; font-weight: 500; background: #fafafa; }
  :deep(.ant-table-tbody > tr > td) { padding: 10px 8px; white-space: pre-line; }
}

/* 新建/编辑弹窗 */
.task-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.form-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  label {
    font-size: 13px;
    color: #333;
    white-space: nowrap;
    width: 80px;
    flex-shrink: 0;
    &::before {
      content: '* ';
      color: #ff4d4f;
    }
  }
  :deep(.ant-select), :deep(.ant-input) {
    flex: 1;
  }
}

.form-item-placeholder {
  flex: 1;
}

.check-items-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
  .section-label {
    font-size: 13px;
    color: #333;
    font-weight: 500;
    &::before {
      content: '* ';
      color: #ff4d4f;
    }
  }
}

.check-items-table {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
  
  .table-header {
    display: grid;
    grid-template-columns: 100px 280px 1fr;
    background: #fafafa;
    padding: 10px 12px;
    border-bottom: 1px solid #e8e8e8;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    
    .col-enable { text-align: center; }
    .col-item { text-align: center; }
    .col-form { 
      text-align: center;
      padding-left: 88px; /* 对齐到表单字段的输入框区域 */
    }
  }
  
  .table-body {
    .table-row {
      display: grid;
      grid-template-columns: 100px 280px 1fr;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      align-items: center;
      min-height: 50px;
      
      &:last-child {
        border-bottom: none;
      }
      
      .col-enable {
        display: flex;
        justify-content: center;
      }
      
      .col-item {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        color: #333;
      }
      
      .col-form {
        padding-left: 88px; /* 对齐到表单字段的输入框区域 */
        :deep(.ant-select) {
          width: 100%;
        }
      }
    }
  }
}

.modal-footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 添加养护单位弹窗 */
.maintenance-unit-modal {
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .toolbar-left {
      display: flex;
      align-items: center;
    }
    
    .toolbar-right {
      display: flex;
      align-items: center;
    }
  }
  
  .maintenance-unit-table {
    :deep(.ant-table) { font-size: 13px; }
    :deep(.ant-table-thead > tr > th) { 
      padding: 10px 8px; 
      font-size: 13px; 
      font-weight: 500; 
      background: #fafafa; 
    }
    :deep(.ant-table-tbody > tr > td) { 
      padding: 10px 8px; 
      white-space: pre-line;
    }
  }
}
</style>
