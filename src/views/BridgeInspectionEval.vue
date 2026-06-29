<template>
  <div class="eval-page">
    <div class="card">
      <div class="page-header"><h3>桥梁检测评价</h3></div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">检测名称</span>
          <a-input v-model:value="filters.name" placeholder="请输入检测名称" allow-clear style="width: 180px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">桥梁名称</span>
          <a-input v-model:value="filters.bridgeName" placeholder="请输入桥梁名称" allow-clear style="width: 180px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">归属地区</span>
          <a-select v-model:value="filters.area" placeholder="请选择归属地区" allow-clear style="width: 180px">
            <a-select-option value="杭州市市辖区">杭州市市辖区</a-select-option>
            <a-select-option value="宁波市市辖区">宁波市市辖区</a-select-option>
          </a-select>
        </div>
        <div class="filter-actions">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="filterExpanded = !filterExpanded">{{ filterExpanded ? '收起' : '展开' }} <span :class="{ 'arrow-up': filterExpanded }">&#9662;</span></a-button>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <a-button type="primary" @click="handleAdd">+ 新增检测评价</a-button>
          <a-button @click="handleExport">导出</a-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }"
        size="small"
        row-key="id"
        class="eval-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag>{{ record.type }}</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <div class="action-btns">
              <a-button type="link" size="small" @click="handleView(record)">查看</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Modal, message } from 'ant-design-vue'

const filterExpanded = ref(true)

const filters = reactive({
  name: '',
  bridgeName: '',
  area: undefined as string | undefined,
})

function handleReset() {
  filters.name = ''
  filters.bridgeName = ''
  filters.area = undefined
}

function handleSearch() {}

const columns = [
  { title: '检测名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '桥梁名称', dataIndex: 'bridgeName', key: 'bridgeName', width: 120 },
  { title: '归属地区', dataIndex: 'area', key: 'area', width: 130 },
  { title: '检测时间', dataIndex: 'date', key: 'date', width: 110 },
  { title: '检测单位', dataIndex: 'unit', key: 'unit', width: 160 },
  { title: '负责人', dataIndex: 'person', key: 'person', width: 80 },
  { title: '检测类型', dataIndex: 'type', key: 'type', width: 100, align: 'center' as const },
  { title: '养护类别', dataIndex: 'maintain', key: 'maintain', width: 100 },
  { title: '桥梁BCI', dataIndex: 'bci', key: 'bci', width: 90, align: 'center' as const },
  { title: '评价等级', dataIndex: 'grade', key: 'grade', width: 90, align: 'center' as const },
  { title: '操作', key: 'action', width: 150, align: 'center' as const, fixed: 'right' as const },
]

const tableData = ref([
  { id: 1, name: '测试0622', bridgeName: '测试桥梁', area: '杭州市市辖区', date: '2026-06-22', unit: '测试单位', person: '王雨晴', type: '常规检测', maintain: 'I类养护', bci: '', grade: '合格' },
  { id: 2, name: '测试001', bridgeName: '测试桥梁', area: '杭州市市辖区', date: '2026-06-18', unit: '测试单位', person: '王雨晴', type: '常规检测', maintain: 'I类养护', bci: '', grade: '不合格' },
  { id: 3, name: '测试检测', bridgeName: '测试桥梁', area: '杭州市市辖区', date: '2026-06-10', unit: '越城区公用事业集团', person: '张琦峰', type: '常规检测', maintain: 'I类养护', bci: '', grade: '不合格' },
])

const filteredData = computed(() => tableData.value.filter(row => {
  if (filters.name && !row.name.includes(filters.name)) return false
  if (filters.bridgeName && !row.bridgeName.includes(filters.bridgeName)) return false
  if (filters.area && row.area !== filters.area) return false
  return true
}))

function handleAdd() {
  Modal.info({ title: '新增检测评价', content: '功能开发中', okText: '确定' })
}

function handleExport() {
  message.info('导出功能开发中')
}

function handleView(record: any) {
  Modal.info({ title: '查看详情', content: `检测名称：${record.name}`, okText: '确定' })
}

function handleEdit(record: any) {
  Modal.info({ title: '编辑', content: `编辑检测评价：${record.name}`, okText: '确定' })
}

function handleDelete(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除「${record.name}」吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      tableData.value = tableData.value.filter(r => r.id !== record.id)
    },
  })
}
</script>

<style scoped lang="scss">
.eval-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.page-header {
  margin-bottom: 16px;
  h3 { margin: 0; font-size: 16px; font-weight: 600; color: #1f1f1f; }
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.arrow-up {
  transform: rotate(180deg);
  display: inline-block;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.action-btns {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.eval-table {
  :deep(.ant-table) { font-size: 13px; }
  :deep(.ant-table-thead > tr > th) { padding: 10px 8px; font-size: 13px; font-weight: 500; background: #fafafa; }
  :deep(.ant-table-tbody > tr > td) { padding: 10px 8px; }
}
</style>
