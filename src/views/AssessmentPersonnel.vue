<template>
  <div class="personnel-page">
    <div class="search-bar">
      <a-row :gutter="16" align="middle">
        <a-col><span class="search-label">所属评估单位：</span><a-input v-model:value="searchForm.unitName" placeholder="请输入" style="width: 150px" /></a-col>
        <a-col><span class="search-label">统一社会信用代码：</span><a-input v-model:value="searchForm.creditCode" placeholder="请输入" style="width: 170px" /></a-col>
        <a-col><span class="search-label">归属地区：</span><a-select v-model:value="searchForm.region" placeholder="请选择归属地区" style="width: 160px" allowClear><a-select-option v-for="opt in regionOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">姓名：</span><a-input v-model:value="searchForm.name" placeholder="请输入" style="width: 120px" /></a-col>
        <a-col><span class="search-label">身份证号码：</span><a-input v-model:value="searchForm.idCard" placeholder="请输入" style="width: 180px" /></a-col>
        <a-col><span class="search-label">学历：</span><a-select v-model:value="searchForm.education" placeholder="请选择" style="width: 120px" allowClear><a-select-option v-for="opt in educationOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
        <a-col><span class="search-label">角色：</span><a-select v-model:value="searchForm.role" placeholder="请选择" style="width: 120px" allowClear><a-select-option v-for="opt in roleOptions" :key="opt" :value="opt">{{ opt }}</a-select-option></a-select></a-col>
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
        <template v-if="column.key === 'verifyStatus'">
          <span :style="{ color: getRowVerifyColor(record as PersonnelRow), fontWeight: 500, fontSize: '13px' }">{{ getRowVerifyLabel(record as PersonnelRow) }}</span>
        </template>
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
        </a-row>
        <!-- 人员职称区域 -->
        <a-row v-if="showCerts">
          <a-col :span="24">
            <div class="cert-section">
              <div class="cert-section-header">
                <span class="cert-section-title">人员职称</span>
                <a-button v-if="formMode !== 'view'" type="dashed" size="small" @click="addCertificate"><PlusOutlined />新增证书</a-button>
              </div>
              <div v-if="noCertConfirmed" class="cert-confirmed">已确认人员无职称</div>
              <div v-else-if="certificates.length === 0" class="cert-empty">暂无资质证书，请点击“新增证书”添加</div>
              <div v-for="(cert, idx) in certificates" :key="idx" class="cert-item">
                <div class="cert-item-header">
                  <span class="cert-item-index">证书 {{ idx + 1 }}</span>
                  <div class="cert-item-actions">
                    <a-button v-if="formMode !== 'view'" type="link" size="small" :loading="cert.verifyStatus === 'verifying'" :disabled="cert.verifyStatus === 'verifying'" @click="verifyCertificate(idx)"><CheckOutlined />校验</a-button>
                    <span v-if="cert.verifyStatus === 'verifying'" class="cert-verify-status verifying">四库一平台校验中</span>
                    <span v-else-if="cert.verifyStatus === 'success'" class="cert-verify-status success">四库一平台校验成功</span>
                    <span v-else-if="cert.verifyStatus === 'fail'" class="cert-verify-status fail">四库一平台校验失败</span>
                    <span v-else class="cert-verify-status unverified">四库一平台未校验</span>
                    <a-button v-if="formMode !== 'view'" type="link" danger size="small" @click="removeCertificate(idx)"><DeleteOutlined />删除</a-button>
                  </div>
                </div>
                <a-row :gutter="12">
                  <a-col :span="8">
                    <a-form-item label="职称专业" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-input v-model:value="cert.certMajor" placeholder="请输入职称专业" :disabled="formMode === 'view'" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="职称等级" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-select v-model:value="cert.certLevel" placeholder="请选择职称等级" :disabled="formMode === 'view'" allowClear>
                        <a-select-option value="初级">初级</a-select-option>
                        <a-select-option value="中级">中级</a-select-option>
                        <a-select-option value="高级">高级</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="职称证书图片" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-upload v-if="formMode !== 'view'" :show-upload-list="false" :before-upload="(file: File) => { cert.certImage = file.name; return false }">
                        <a-button size="small"><PlusOutlined />上传图片</a-button>
                      </a-upload>
                      <span v-else>{{ cert.certImage || '未上传' }}</span>
                      <span v-if="cert.certImage && formMode !== 'view'" style="margin-left: 8px; color: #52c41a; font-size: 12px">{{ cert.certImage }}</span>
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row :gutter="16">
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
import { ref, computed, watch } from 'vue'
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'

interface CertItem { certMajor: string; certLevel: string; certImage: string; verifyStatus?: '' | 'verifying' | 'success' | 'fail' }
interface PersonnelRow { id: number; unitName: string; creditCode: string; region: string; name: string; idCard: string; phone: string; gender: string; education: string; role: string; status: string; certificates?: CertItem[]; noCertConfirmed?: boolean }

const searchForm = ref({ unitName: '', creditCode: '', region: undefined as string | undefined, name: '', idCard: '', education: undefined as string | undefined, role: undefined as string | undefined, status: undefined as string | undefined })
const regionOptions = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const educationOptions = ['高中', '大专', '本科', '硕士', '博士']
const roleOptions = ['操作人员', '审核人员', '管理人员']

const columns = [
  { title: '序号', key: 'index', width: 60 },
  { title: '所属评估单位', dataIndex: 'unitName', key: 'unitName', width: 160 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100 },
  { title: '身份证号码', dataIndex: 'idCard', key: 'idCard', width: 200 },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '性别', dataIndex: 'gender', key: 'gender', width: 70 },
  { title: '学历', dataIndex: 'education', key: 'education', width: 80 },
  { title: '角色', dataIndex: 'role', key: 'role', width: 100 },
  { title: '校验状态', key: 'verifyStatus', width: 120 },
  { title: '账号状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '操作', key: 'action', width: 220, fixed: 'right' as const },
]

const tableData = ref<PersonnelRow[]>([
  { id: 1, unitName: '浙江省安全评估有限公司', creditCode: '91330000MA2S0001X1', region: '杭州市余杭区', name: '周国安', idCard: '330110198506151234', phone: '13800004001', gender: '男', education: '本科', role: '审核人员', status: '启用' },
  { id: 2, unitName: '宁波市桥梁安全评估中心', creditCode: '91330200MA2T0002X2', region: '宁波市海曙区', name: '钱国栋', idCard: '330212199003221015', phone: '13800005001', gender: '男', education: '硕士', role: '操作人员、审核人员', status: '启用' },
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
    if (searchForm.value.status && row.status !== searchForm.value.status) return false
    return true
  })
})

function handleSearch() {}
function handleReset() { searchForm.value = { unitName: '', creditCode: '', region: undefined, name: '', idCard: '', education: undefined, role: undefined, status: undefined } }
function handleResetPwd(r: PersonnelRow) { console.log('重置密码', r) }
function handleDelete(r: PersonnelRow) { console.log('删除', r) }
function handleBatchDelete() { console.log('批量删除', selectedRowKeys.value) }
function getRowVerifyStatus(record: PersonnelRow): 'noNeed' | 'unverified' | 'verifying' | 'success' | 'fail' {
  if (record.noCertConfirmed) return 'noNeed'
  const certs = record.certificates || []
  if (certs.length === 0) return 'unverified'
  if (certs.some(c => c.verifyStatus === 'verifying')) return 'verifying'
  if (certs.every(c => c.verifyStatus === 'success')) return 'success'
  if (certs.some(c => c.verifyStatus === 'fail')) return 'fail'
  return 'unverified'
}
function getRowVerifyLabel(record: PersonnelRow): string {
  const map = { noNeed: '无需校验', unverified: '未校验', verifying: '校验中', success: '校验成功', fail: '校验失败' }
  return map[getRowVerifyStatus(record)]
}
function getRowVerifyColor(record: PersonnelRow): string {
  const map = { noNeed: '#999', unverified: '#999', verifying: '#faad14', success: '#52c41a', fail: '#ff4d4f' }
  return map[getRowVerifyStatus(record)]
}

const selectedRowKeys = ref<number[]>([])
function onSelectChange(keys: number[]) { selectedRowKeys.value = keys }

// ===== 弹窗逻辑 =====
const modalVisible = ref(false)
const formMode = ref<'add' | 'view' | 'edit'>('add')
const editingId = ref<number | null>(null)

const formData = ref({
  unitName: '', creditCode: '', name: '', idCard: '', phone: '', gender: undefined as string | undefined,
  education: undefined as string | undefined, status: '启用', roles: [] as string[],
})
const certificates = ref<CertItem[]>([])
const noCertConfirmed = ref(false)
const showCerts = computed(() => formData.value.idCard.trim().length > 0)
watch(showCerts, (val) => {
  if (val && certificates.value.length === 0 && !noCertConfirmed.value) {
    addCertificate()
  }
})
function addCertificate() { noCertConfirmed.value = false; certificates.value.push({ certMajor: '', certLevel: '', certImage: '', verifyStatus: '' }) }
function removeCertificate(idx: number) {
  if (certificates.value.length === 1) {
    Modal.confirm({
      title: '确认操作',
      content: '是否确认该人员无职称？',
      okText: '是',
      cancelText: '否',
      onOk() {
        certificates.value.splice(idx, 1)
        noCertConfirmed.value = true
      },
      onCancel() {
        // 取消时保留一条空数据
      }
    })
  } else {
    certificates.value.splice(idx, 1)
  }
}
function verifyCertificate(idx: number) {
  const cert = certificates.value[idx]
  cert.verifyStatus = 'verifying'
  setTimeout(() => {
    // 模拟校验：职称专业和职称等级都不为空时校验成功，否则失败
    cert.verifyStatus = (cert.certMajor && cert.certLevel) ? 'success' : 'fail'
  }, 1500)
}

const modalTitle = computed(() => {
  if (formMode.value === 'add') return '新增安全评估单位从业人员'
  if (formMode.value === 'view') return '查看安全评估单位从业人员'
  return '编辑安全评估单位从业人员'
})

function openModal(mode: 'add' | 'view' | 'edit', record?: PersonnelRow) {
  formMode.value = mode
  if (mode === 'add') {
    editingId.value = null
    formData.value = { unitName: '', creditCode: '', name: '', idCard: '', phone: '', gender: undefined, education: undefined, status: '启用', roles: [] }
    certificates.value = []
    noCertConfirmed.value = false
  } else if (record) {
    editingId.value = record.id
    formData.value = {
      unitName: record.unitName, creditCode: record.creditCode, name: record.name, idCard: record.idCard, phone: record.phone,
      gender: record.gender, education: record.education, status: record.status,
      roles: record.role.split('、').map(s => s.trim()),
    }
    certificates.value = record.certificates ? [...record.certificates] : []
    noCertConfirmed.value = record.noCertConfirmed || (certificates.value.length === 0 && record.idCard.trim().length > 0)
  }
  modalVisible.value = true
}

function submitForm() {
  if (formMode.value === 'add') {
    const newId = Math.max(...tableData.value.map(r => r.id), 0) + 1
    tableData.value.push({
      id: newId, unitName: formData.value.unitName, creditCode: formData.value.creditCode, region: '', name: formData.value.name,
      idCard: formData.value.idCard, phone: formData.value.phone, gender: formData.value.gender || '', education: formData.value.education || '',
      role: formData.value.roles.join('、'), status: formData.value.status, certificates: [...certificates.value], noCertConfirmed: noCertConfirmed.value,
    })
  } else if (formMode.value === 'edit' && editingId.value) {
    const row = tableData.value.find(r => r.id === editingId.value)
    if (row) {
      Object.assign(row, {
        unitName: formData.value.unitName, creditCode: formData.value.creditCode, name: formData.value.name, idCard: formData.value.idCard,
        phone: formData.value.phone, gender: formData.value.gender || '', education: formData.value.education || '',
        role: formData.value.roles.join('、'), status: formData.value.status, certificates: [...certificates.value], noCertConfirmed: noCertConfirmed.value,
      })
    }
  }
  modalVisible.value = false
}

function resetForm() {
  formData.value = { unitName: '', creditCode: '', name: '', idCard: '', phone: '', gender: undefined, education: undefined, status: '启用', roles: [] }
  certificates.value = []
  noCertConfirmed.value = false
}
</script>

<style scoped lang="scss">
.personnel-page { background: #fff; padding: 20px; border-radius: 8px; }
.search-bar { margin-bottom: 16px; padding: 16px; background: #fafafa; border-radius: 4px; .search-label { font-size: 14px; color: rgba(0, 0, 0, 0.85); } }
.action-bar { margin-bottom: 16px; }
.cert-section { margin: 8px 0 16px; padding: 16px; background: #f6f8fa; border: 1px solid #e8ecf0; border-radius: 6px; }
.cert-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.cert-section-title { font-weight: 600; font-size: 14px; color: rgba(0, 0, 0, 0.85); }
.cert-empty { text-align: center; color: #b0b8c4; padding: 20px 0; font-size: 13px; }
.cert-confirmed { text-align: center; color: #52c41a; font-weight: 600; padding: 20px 0; font-size: 14px; }
.cert-item { background: #fff; border: 1px solid #e8ecf0; border-radius: 4px; padding: 12px 16px 4px; margin-bottom: 12px; }
.cert-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.cert-item-actions { display: flex; align-items: center; gap: 8px; }
.cert-item-index { font-weight: 500; font-size: 13px; color: #1890ff; }
.cert-verify-status { font-size: 12px; font-weight: 500; &.verifying { color: #faad14; } &.success { color: #52c41a; } &.fail { color: #ff4d4f; } &.unverified { color: #999; } }
</style>
