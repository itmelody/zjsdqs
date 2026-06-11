<template>
  <div class="personnel-page">
    <div class="search-bar">
      <a-row :gutter="16" align="middle">
        <a-col><span class="search-label">所属养护单位：</span><a-input v-model:value="searchForm.unitName" placeholder="请输入" style="width: 150px" /></a-col>
        <a-col><span class="search-label">统一社会信用代码：</span><a-input v-model:value="searchForm.creditCode" placeholder="请输入" style="width: 170px" /></a-col>
        <a-col><span class="search-label">归属地区：</span><a-select v-model:value="searchForm.region" placeholder="请选择归属地区" style="width: 160px" allowClear><a-select-option v-for="opt in regionOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">姓名：</span><a-input v-model:value="searchForm.name" placeholder="请输入" style="width: 120px" /></a-col>
        <a-col><span class="search-label">身份证号码：</span><a-input v-model:value="searchForm.idCard" placeholder="请输入" style="width: 180px" /></a-col>
        <a-col><span class="search-label">学历：</span><a-select v-model:value="searchForm.education" placeholder="请选择" style="width: 120px" allowClear><a-select-option v-for="opt in educationOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">角色：</span><a-select v-model:value="searchForm.role" placeholder="请选择" style="width: 120px" allowClear><a-select-option v-for="opt in roleOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">工种：</span><a-select v-model:value="searchForm.jobType" placeholder="请选择" style="width: 120px" allowClear><a-select-option v-for="opt in jobTypeOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">账号状态：</span><a-select v-model:value="searchForm.status" placeholder="请选择" style="width: 120px" allowClear><a-select-option value="启用">启用</a-select-option><a-select-option value="停用">停用</a-select-option></a-select></a-col>
        <a-col><a-button @click="handleReset">重置</a-button><a-button type="primary" style="margin-left: 8px" @click="handleSearch">搜索</a-button></a-col>
      </a-row>
    </div>
    <div class="action-bar">
      <a-button type="primary" @click="openModal('add')"><PlusOutlined />新增人员</a-button>
      <a-button type="primary" danger @click="handleBatchDelete" style="margin-left: 8px; background-color: #ff4d4f; border-color: #ff4d4f; color: #fff;"><DeleteOutlined />批量删除</a-button>
    </div>
    <a-table :data-source="filteredData" :columns="columns" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }" size="middle" bordered row-key="id" :scroll="{ x: 'max-content' }" :row-selection="{ selectedRowKeys, onChange: onSelectChange }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">{{ index + 1 }}</template>
        <template v-if="column.key === 'status'">
          <a-switch v-model:checked="(record as PersonnelRow).status" checked-children="启用" un-checked-children="停用" :checkedValue="'启用'" :unCheckedValue="'停用'" />
        </template>
        <template v-if="column.key === 'action'">
          <a style="margin-right: 8px" @click="openModal('view', record as PersonnelRow)">查看</a>
          <a style="margin-right: 8px" @click="openModal('edit', record as PersonnelRow)">编辑</a>
          <a style="margin-right: 8px" @click="handleResetPwd(record as PersonnelRow)">重置密码</a>
          <a style="color: #ff4d4f" @click="handleDelete(record as PersonnelRow)">删除</a>
        </template>
      </template>
    </a-table>

    <a-modal v-model:open="modalVisible" :title="modalTitle" width="720px" :footer="formMode === 'view' ? null : undefined" @cancel="modalVisible = false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="单位名称" required><a-input v-model:value="formData.unitName" placeholder="请输入企业名称搜索选择" :disabled="formMode === 'view'" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="统一社会信用代码"><a-input v-model:value="formData.creditCode" placeholder="同步单位的统一社会信用代码" disabled /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="姓名" required><a-input v-model:value="formData.name" placeholder="请输入姓名" :disabled="formMode === 'view'" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="身份证号码" required><a-input v-model:value="formData.idCard" placeholder="请输入身份证号码" :disabled="formMode === 'view'" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="联系电话" required><a-input v-model:value="formData.phone" placeholder="手机号码作为登录账号，请输入正确手机号" :disabled="formMode === 'view'" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别" required>
              <a-select v-model:value="formData.gender" placeholder="请选择性别" :disabled="formMode === 'view'" allowClear>
                <a-select-option value="男">男</a-select-option>
                <a-select-option value="女">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="学历">
              <a-select v-model:value="formData.education" placeholder="请选择学历" :disabled="formMode === 'view'" allowClear>
                <a-select-option v-for="opt in educationOptions" :key="opt" :value="opt">{{ opt }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="人员状态" required>
              <a-radio-group v-model:value="formData.status" :disabled="formMode === 'view'">
                <a-radio value="停用">停用</a-radio>
                <a-radio value="启用">启用</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="角色" required :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-checkbox-group v-model:value="formData.roles" :disabled="formMode === 'view'">
                <a-checkbox value="操作人员">操作人员</a-checkbox>
                <a-checkbox value="审核人员">审核人员</a-checkbox>
                <a-checkbox value="管理员">管理员</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="工种" required :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-checkbox-group v-model:value="formData.jobTypes" :disabled="formMode === 'view'">
                <a-checkbox v-for="opt in jobTypeOptions" :key="opt" :value="opt">{{ opt }}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #footer v-if="formMode !== 'view'">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #ff4d4f; font-size: 13px;">提示：同一家单位至少配置一位审核人员</span>
          <div>
            <a-button type="primary" @click="submitForm">保存</a-button>
            <a-button @click="resetForm" style="margin-left: 8px;">重置</a-button>
            <a-button @click="modalVisible = false" style="margin-left: 8px;">取消</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'

interface PersonnelRow { id: number; unitName: string; creditCode: string; region: string; name: string; idCard: string; phone: string; gender: string; education: string; role: string; jobType: string; status: string }

const searchForm = ref({ unitName: '', creditCode: '', region: undefined as string | undefined, name: '', idCard: '', education: undefined as string | undefined, role: undefined as string | undefined, jobType: undefined as string | undefined, status: undefined as string | undefined })
const regionOptions = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const educationOptions = ['高中', '大专', '本科', '硕士', '博士']
const roleOptions = ['操作人员', '审核人员', '管理人员']
const jobTypeOptions = ['巡查人员', '安全员', '项目经理（技术负责人）', '施工负责人', '安全负责人', '项目负责人']

const columns = [
  { title: '序号', key: 'index', width: 60 },
  { title: '所属养护单位', dataIndex: 'unitName', key: 'unitName', width: 160 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
  { title: '身份证号码', dataIndex: 'idCard', key: 'idCard', width: 200 },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 70 },
  { title: '学历', dataIndex: 'education', key: 'education', width: 80 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 100 },
  { title: '工种', dataIndex: 'jobType', key: 'jobType', width: 160 },
  { title: '账号状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 220, fixed: 'right' as const },
]

const tableData = ref<PersonnelRow[]>([
  { id: 1, unitName: '越城区公用事业集团', creditCode: '91330602MA29D10B24', region: '绍兴市越城区', name: '张琦峰', idCard: '330602199010174518', phone: '13806751234', gender: '男', education: '本科', role: '审核人员', jobType: '巡查人员', status: '启用' },
  { id: 2, unitName: '花草养护公司', creditCode: '988111254441', region: '杭州市余杭区', name: '李四', idCard: '330124198802040622', phone: '13906751234', gender: '女', education: '本科', role: '操作人员', jobType: '项目经理（技术负责人）', status: '启用' },
  { id: 3, unitName: '养护单位001', creditCode: 'ceshi1111', region: '宁波市海曙区', name: '张三', idCard: '330124198802030622', phone: '13706751234', gender: '女', education: '本科', role: '操作人员、审核人员', jobType: '项目经理（技术负责人）', status: '启用' },
  { id: 4, unitName: '林木养护公司', creditCode: '991001002', region: '杭州市余杭区', name: '测试余杭', idCard: '371502196602128813', phone: '13606751234', gender: '女', education: '高中', role: '操作人员、审核人员', jobType: '巡查人员', status: '启用' },
])

const filteredData = computed(() => {
  return tableData.value.filter(row => {
    if (searchForm.value.unitName && !row.unitName.includes(searchForm.value.unitName)) return false
    if (searchForm.value.creditCode && !row.creditCode.includes(searchForm.value.creditCode)) return false
    if (searchForm.value.region && !row.region.includes(searchForm.value.region)) return false
    if (searchForm.value.name && !row.name.includes(searchForm.value.name)) return false
    if (searchForm.value.idCard && !row.idCard.includes(searchForm.value.idCard)) return false
    if (searchForm.value.education && row.education !== searchForm.value.education) return false
    if (searchForm.value.role && !row.role.includes(searchForm.value.role)) return false
    if (searchForm.value.jobType && !row.jobType.includes(searchForm.value.jobType)) return false
    if (searchForm.value.status && row.status !== searchForm.value.status) return false
    return true
  })
})

function handleSearch() {}
function handleReset() { searchForm.value = { unitName: '', creditCode: '', region: undefined, name: '', idCard: '', education: undefined, role: undefined, jobType: undefined, status: undefined } }
function handleResetPwd(r: PersonnelRow) { console.log('重置密码', r) }
function handleDelete(r: PersonnelRow) { console.log('删除', r) }
function handleBatchDelete() { console.log('批量删除', selectedRowKeys.value) }

const selectedRowKeys = ref<number[]>([])
function onSelectChange(keys: number[]) { selectedRowKeys.value = keys }

// ===== 弹窗逻辑 =====
const modalVisible = ref(false)
const formMode = ref<'add' | 'view' | 'edit'>('add')
const editingId = ref<number | null>(null)

const formData = ref({
  unitName: '', creditCode: '', name: '', idCard: '', phone: '', gender: undefined as string | undefined,
  education: undefined as string | undefined, status: '启用', roles: [] as string[], jobTypes: [] as string[],
})

const modalTitle = computed(() => {
  if (formMode.value === 'add') return '新增日常养护单位从业人员'
  if (formMode.value === 'view') return '查看日常养护单位从业人员'
  return '编辑日常养护单位从业人员'
})

function openModal(mode: 'add' | 'view' | 'edit', record?: PersonnelRow) {
  formMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    formData.value = { unitName: '', creditCode: '', name: '', idCard: '', phone: '', gender: undefined, education: undefined, status: '启用', roles: [], jobTypes: [] }
  } else if (record) {
    editingId.value = record.id
    formData.value = {
      unitName: record.unitName, creditCode: record.creditCode, name: record.name, idCard: record.idCard, phone: record.phone,
      gender: record.gender, education: record.education, status: record.status,
      roles: record.role.split('、').map(s => s.trim()), jobTypes: record.jobType.split('、').map(s => s.trim()),
    }
  }
  modalVisible.value = true
}

function submitForm() {
  if (formMode.value === 'add') {
    const newId = Math.max(...tableData.value.map(r => r.id), 0) + 1
    tableData.value.push({
      id: newId, unitName: formData.value.unitName, creditCode: formData.value.creditCode, region: '', name: formData.value.name,
      idCard: formData.value.idCard, phone: formData.value.phone, gender: formData.value.gender || '', education: formData.value.education || '',
      role: formData.value.roles.join('、'), jobType: formData.value.jobTypes.join('、'), status: formData.value.status,
    })
  } else if (formMode.value === 'edit' && editingId.value) {
    const row = tableData.value.find(r => r.id === editingId.value)
    if (row) {
      Object.assign(row, {
        unitName: formData.value.unitName, creditCode: formData.value.creditCode, name: formData.value.name, idCard: formData.value.idCard,
        phone: formData.value.phone, gender: formData.value.gender || '', education: formData.value.education || '',
        role: formData.value.roles.join('、'), jobType: formData.value.jobTypes.join('、'), status: formData.value.status,
      })
    }
  }
  modalVisible.value = false
}

function resetForm() {
  formData.value = { unitName: '', creditCode: '', name: '', idCard: '', phone: '', gender: undefined, education: undefined, status: '启用', roles: [], jobTypes: [] }
}
</script>

<style scoped lang="scss">
.personnel-page { background: #fff; padding: 20px; border-radius: 8px; }
.search-bar { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; .search-label { font-size: 14px; color: rgba(0, 0, 0, 0.85); } }
.action-bar { margin-bottom: 16px; }
</style>
