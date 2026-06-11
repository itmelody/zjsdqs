<template>
  <div class="third-party-page">
    <div class="search-bar">
      <a-row :gutter="16" align="middle">
        <a-col><span class="search-label">单位名称：</span><a-input v-model:value="searchForm.name" placeholder="请输入" style="width: 160px" /></a-col>
        <a-col><span class="search-label">统一社会信用代码：</span><a-input v-model:value="searchForm.creditCode" placeholder="请输入" style="width: 180px" /></a-col>
        <a-col><span class="search-label">归属地区：</span><a-select v-model:value="searchForm.region" placeholder="请选择归属地区" style="width: 180px" allowClear><a-select-option v-for="opt in regionOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">当前状态：</span><a-select v-model:value="searchForm.status" placeholder="请选择" style="width: 120px" allowClear><a-select-option value="启用">启用</a-select-option><a-select-option value="停用">停用</a-select-option></a-select></a-col>
        <a-col><a-button @click="handleReset">重置</a-button><a-button type="primary" style="margin-left: 8px" @click="handleSearch">搜索</a-button></a-col>
      </a-row>
    </div>
    <div class="action-bar"><a-button type="primary" @click="openModal('add')"><PlusOutlined />新增</a-button></div>
    <a-table :data-source="filteredData" :columns="columns" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }" size="middle" bordered row-key="id" :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'index'">{{ index + 1 }}</template>
        <template v-if="column.key === 'status'"><a-tag :color="(record as UnitRow).status === '启用' ? 'green' : 'red'">{{ (record as UnitRow).status }}</a-tag></template>
        <template v-if="column.key === 'action'">
          <a style="margin-right: 8px" @click="openModal('view', record as UnitRow)">查看</a>
          <a style="margin-right: 8px" @click="openModal('edit', record as UnitRow)">编辑</a>
          <a @click="handleResetPwd(record as UnitRow)">重置密码</a>
        </template>
      </template>
    </a-table>
    <a-modal v-model:open="modalVisible" :title="modalTitle" width="720px" :footer="formMode === 'view' ? null : undefined" @ok="submitForm" @cancel="modalVisible = false">
      <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="16">
          <a-col :span="12"><a-form-item label="单位名称" required><a-input v-model:value="formData.name" placeholder="请输入企业全称" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="统一社会信用代码" required><a-input v-model:value="formData.creditCode" placeholder="请输入统一社会信用代码" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="归属地区" required><a-select v-model:value="formData.region" placeholder="请选择地区" :disabled="formMode === 'view'" allowClear><a-select-option v-for="opt in regionFullOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="详细地址" required><a-input v-model:value="formData.address" placeholder="请输入单位详细地址" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="法定代表人" required><a-input v-model:value="formData.legalPerson" placeholder="请输入法定代表人" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="法定代表人联系方式" required><a-input v-model:value="formData.legalPhone" placeholder="请输入法定代表人联系方式" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="单位负责人" required><a-input v-model:value="formData.unitHead" placeholder="请输入单位负责人" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="单位负责人联系方式" required><a-input v-model:value="formData.headPhone" placeholder="请输入单位负责人联系方式" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="日常联系人" required><a-input v-model:value="formData.dailyContact" placeholder="请输入日常联系人" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="日常联系人联系方式" required><a-input v-model:value="formData.contactPhone" placeholder="请输入日常联系人联系方式" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="企业状态" required><a-radio-group v-model:value="formData.status" :disabled="formMode === 'view'"><a-radio value="停用">停用</a-radio><a-radio value="启用">启用</a-radio></a-radio-group></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="行业主管单位" required><a-input v-model:value="formData.supervisor" placeholder="请输入行业主管单位" :disabled="formMode === 'view'" /></a-form-item></a-col>
          <a-col :span="24"><a-form-item label="备注" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }"><a-textarea v-model:value="formData.remark" placeholder="请输入备注" :rows="3" :disabled="formMode === 'view'" /></a-form-item></a-col>
        </a-row>
      </a-form>
      <template #footer v-if="formMode !== 'view'">
        <a-button type="primary" @click="submitForm">确定</a-button><a-button @click="resetForm">重置</a-button><a-button @click="modalVisible = false">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
interface UnitRow { id: number; name: string; creditCode: string; region: string; address: string; legalPerson: string; legalPhone: string; unitHead: string; headPhone: string; dailyContact: string; contactPhone: string; status: string; supervisor: string; remark: string }
const searchForm = ref({ name: '', creditCode: '', region: undefined as string | undefined, status: undefined as string | undefined })
const regionOptions = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const regionFullOptions = ['杭州市余杭区', '杭州市西湖区', '杭州市拱墅区', '宁波市海曙区', '宁波市鄞州区', '温州市鹿城区', '绍兴市越城区', '湖州市吴兴区', '嘉兴市南湖区', '金华市婺城区', '衢州市柯城区', '台州市黄岩区', '台州市椒江区', '丽水市莲都区', '舟山市定海区']
const columns = [
  { title: '序号', key: 'index', width: 60 }, { title: '单位名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 }, { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '单位详细地址', dataIndex: 'address', key: 'address', width: 280 }, { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 100 },
  { title: '法人联系方式', dataIndex: 'legalPhone', key: 'legalPhone', width: 150 }, { title: '单位负责人', dataIndex: 'unitHead', key: 'unitHead', width: 100 },
  { title: '负责人联系方式', dataIndex: 'headPhone', key: 'headPhone', width: 130 }, { title: '日常联系人', dataIndex: 'dailyContact', key: 'dailyContact', width: 100 },
  { title: '联系方式', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 }, { title: '当前状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]
const tableData = ref<UnitRow[]>([
  { id: 1, name: '浙江省交通检测中心', creditCode: '91330000MA1H0001X1', region: '杭州市西湖区', address: '浙江省杭州市西湖区文三路100号', legalPerson: '陈建国', legalPhone: '13800001001', unitHead: '刘明', headPhone: '13900001001', dailyContact: '张伟', contactPhone: '13700001001', status: '启用', supervisor: '省交通厅', remark: '' },
  { id: 2, name: '宁波市桥梁检测中心', creditCode: '91330200MA2K0002X2', region: '宁波市鄞州区', address: '浙江省宁波市鄞州区甬江大道200号', legalPerson: '王志强', legalPhone: '13800002001', unitHead: '赵磊', headPhone: '13900002001', dailyContact: '孙丽', contactPhone: '13700002001', status: '启用', supervisor: '宁波市住建局', remark: '' },
  { id: 3, name: '温州市隧道检测所', creditCode: '91330300MA2L0003X3', region: '温州市鹿城区', address: '浙江省温州市鹿城区大罗山路300号', legalPerson: '林小峰', legalPhone: '13800003001', unitHead: '黄伟', headPhone: '13900003001', dailyContact: '周琳', contactPhone: '13700003001', status: '启用', supervisor: '温州市住建局', remark: '' },
])
const filteredData = computed(() => { return tableData.value.filter(row => { if (searchForm.value.name && !row.name.includes(searchForm.value.name)) return false; if (searchForm.value.creditCode && !row.creditCode.includes(searchForm.value.creditCode)) return false; if (searchForm.value.region && !row.region.includes(searchForm.value.region)) return false; if (searchForm.value.status && row.status !== searchForm.value.status) return false; return true }) })
function handleSearch() {}
function handleReset() { searchForm.value = { name: '', creditCode: '', region: undefined, status: undefined } }
function handleResetPwd(r: UnitRow) { console.log('重置密码', r) }
const modalVisible = ref(false)
const formMode = ref<'add' | 'view' | 'edit'>('add')
const editingId = ref<number | null>(null)
const formData = ref({ name: '', creditCode: '', region: undefined as string | undefined, address: '', legalPerson: '', legalPhone: '', unitHead: '', headPhone: '', dailyContact: '', contactPhone: '', status: '启用', supervisor: '', remark: '' })
const modalTitle = computed(() => { if (formMode.value === 'add') return '新增检测单位'; if (formMode.value === 'view') return '查看检测单位'; return '编辑检测单位' })
function openModal(mode: 'add' | 'view' | 'edit', record?: UnitRow) {
  formMode.value = mode
  if (mode === 'add') { editingId.value = null; formData.value = { name: '', creditCode: '', region: undefined, address: '', legalPerson: '', legalPhone: '', unitHead: '', headPhone: '', dailyContact: '', contactPhone: '', status: '启用', supervisor: '', remark: '' } }
  else if (record) { editingId.value = record.id; formData.value = { name: record.name, creditCode: record.creditCode, region: record.region, address: record.address, legalPerson: record.legalPerson, legalPhone: record.legalPhone, unitHead: record.unitHead, headPhone: record.headPhone, dailyContact: record.dailyContact, contactPhone: record.contactPhone, status: record.status, supervisor: record.supervisor, remark: record.remark } }
  modalVisible.value = true
}
function submitForm() {
  if (formMode.value === 'add') { const newId = Math.max(...tableData.value.map(r => r.id), 0) + 1; tableData.value.push({ id: newId, ...formData.value } as UnitRow) }
  else if (formMode.value === 'edit' && editingId.value) { const row = tableData.value.find(r => r.id === editingId.value); if (row) Object.assign(row, formData.value) }
  modalVisible.value = false
}
function resetForm() { formData.value = { name: '', creditCode: '', region: undefined, address: '', legalPerson: '', legalPhone: '', unitHead: '', headPhone: '', dailyContact: '', contactPhone: '', status: '启用', supervisor: '', remark: '' } }
</script>

<style scoped lang="scss">
.third-party-page { background: #fff; padding: 20px; border-radius: 8px; }
.search-bar { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; .search-label { font-size: 14px; color: rgba(0, 0, 0, 0.85); } }
.action-bar { margin-bottom: 16px; }
</style>
