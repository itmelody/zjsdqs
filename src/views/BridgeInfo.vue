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
        <a-button @click="handleExport">
          <template #icon><ExportOutlined /></template>
          导出
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
        :show-total="(total) => `共${total}条`"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>
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
  ExportOutlined,
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
const columns: TableColumnsType = [
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
    title: '结构类型',
    dataIndex: 'structureType',
    key: 'structureType',
    width: 100,
  },
  {
    title: '建成时间',
    dataIndex: 'buildTime',
    key: 'buildTime',
    width: 120,
  },
  {
    title: '跨度（米）',
    dataIndex: 'span',
    key: 'span',
    width: 100,
  },
  {
    title: '是否涉航桥梁',
    dataIndex: 'isNavigationBridge',
    key: 'isNavigationBridge',
    width: 120,
  },
  {
    title: '是否设置监控设备',
    dataIndex: 'hasMonitorDevice',
    key: 'hasMonitorDevice',
    width: 140,
  },
  {
    title: '是否设置监测设施',
    dataIndex: 'hasMonitorFacility',
    key: 'hasMonitorFacility',
    width: 140,
  },
  {
    title: '综合评价等级',
    dataIndex: 'evalLevel',
    key: 'evalLevel',
    width: 120,
  },
  {
    title: '评价年份',
    dataIndex: 'evalYear',
    key: 'evalYear',
    width: 100,
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
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
  },
]

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

// 新增
function handleAdd() {
  message.info('新增功能开发中')
}

// 导出
function handleExport() {
  message.info('导出功能开发中')
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

// 查看
function handleView(record: BridgeItem) {
  message.info(`查看桥梁: ${record.name}`)
}

// 编辑
function handleEdit(record: BridgeItem) {
  message.info(`编辑桥梁: ${record.name}`)
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
}
</style>
