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
        <template v-if="column.key === 'verifyStatus'">
          <span :style="{ color: getRowVerifyColor(record as UnitRow), fontWeight: 500, fontSize: '13px' }">{{ getRowVerifyLabel(record as UnitRow) }}</span>
        </template>
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
        </a-row>
        <!-- 资质证书区域 -->
        <a-row v-if="showCerts">
          <a-col :span="24">
            <div class="cert-section">
              <div class="cert-section-header">
                <span class="cert-section-title">资质证书</span>
                <a-button v-if="formMode !== 'view'" type="dashed" size="small" @click="addCertificate"><PlusOutlined />新增证书</a-button>
              </div>
              <div v-if="noCertConfirmed" class="cert-confirmed">已确认企业无资质证书</div>
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
                    <a-form-item label="资质资格序列" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-input v-model:value="cert.certSequence" placeholder="请输入资质资格序列" :disabled="formMode === 'view'" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="专业名称" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-input v-model:value="cert.specialtyName" placeholder="请输入专业名称" :disabled="formMode === 'view'" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="资质资格等级" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-select v-model:value="cert.qualificationLevel" placeholder="请选择资质资格等级" :disabled="formMode === 'view'" allowClear>
                        <a-select-option value="甲级">甲级</a-select-option>
                        <a-select-option value="乙级">乙级</a-select-option>
                        <a-select-option value="丙级">丙级</a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="12">
                  <a-col :span="8">
                    <a-form-item label="资质明细" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-input v-model:value="cert.certDetail" placeholder="请输入资质明细" :disabled="formMode === 'view'" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="证书编号" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
                      <a-input v-model:value="cert.certNo" placeholder="请输入证书编号" :disabled="formMode === 'view'" />
                    </a-form-item>
                  </a-col>
                  <a-col :span="8">
                    <a-form-item label="证书图片" :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
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
import { ref, computed, watch } from 'vue'
import { PlusOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { Modal } from 'ant-design-vue'
interface CertItem { certSequence: string; specialtyName: string; qualificationLevel: string; certDetail: string; certNo: string; certImage: string; verifyStatus?: '' | 'verifying' | 'success' | 'fail' }
interface UnitRow { id: number; name: string; creditCode: string; region: string; address: string; legalPerson: string; legalPhone: string; unitHead: string; headPhone: string; dailyContact: string; contactPhone: string; status: string; supervisor: string; remark: string; certificates?: CertItem[]; noCertConfirmed?: boolean }
const searchForm = ref({ name: '', creditCode: '', region: undefined as string | undefined, status: undefined as string | undefined })
const regionOptions = ['杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const regionFullOptions = ['杭州市余杭区', '杭州市西湖区', '杭州市拱墅区', '宁波市海曙区', '宁波市鄞州区', '温州市鹿城区', '绍兴市越城区', '湖州市吴兴区', '嘉兴市南湖区', '金华市婺城区', '衢州市柯城区', '台州市黄岩区', '台州市椒江区', '丽水市莲都区', '舟山市定海区']
const columns = [
  { title: '序号', key: 'index', width: 60 }, { title: '单位名称', dataIndex: 'name', key: 'name', width: 160 },
  { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode', width: 200 }, { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '单位详细地址', dataIndex: 'address', key: 'address', width: 280 }, { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 100 },
  { title: '法人联系方式', dataIndex: 'legalPhone', key: 'legalPhone', width: 150 }, { title: '单位负责人', dataIndex: 'unitHead', key: 'unitHead', width: 100 },
  { title: '负责人联系方式', dataIndex: 'headPhone', key: 'headPhone', width: 130 }, { title: '日常联系人', dataIndex: 'dailyContact', key: 'dailyContact', width: 100 },
  { title: '联系方式', dataIndex: 'contactPhone', key: 'contactPhone', width: 130 }, { title: '校验状态', key: 'verifyStatus', width: 120 },
  { title: '当前状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
]
const tableData = ref<UnitRow[]>([
  { id: 1, name: '浙江省安全评估有限公司', creditCode: '91330000MA2S0001X1', region: '杭州市余杭区', address: '浙江省杭州市余杭区五常大道188号', legalPerson: '周国安', legalPhone: '13800004001', unitHead: '吴刚', headPhone: '13900004001', dailyContact: '郑辉', contactPhone: '13700004001', status: '启用', supervisor: '省应急管理厅', remark: '' },
  { id: 2, name: '宁波市桥梁安全评估中心', creditCode: '91330200MA2T0002X2', region: '宁波市海曙区', address: '浙江省宁波市海曙区中山西路500号', legalPerson: '钱国栋', legalPhone: '13800005001', unitHead: '冯明', headPhone: '13900005001', dailyContact: '何丽', contactPhone: '13700005001', status: '启用', supervisor: '宁波市应急管理局', remark: '' },
])
const filteredData = computed(() => { return tableData.value.filter(row => { if (searchForm.value.name && !row.name.includes(searchForm.value.name)) return false; if (searchForm.value.creditCode && !row.creditCode.includes(searchForm.value.creditCode)) return false; if (searchForm.value.region && !row.region.includes(searchForm.value.region)) return false; if (searchForm.value.status && row.status !== searchForm.value.status) return false; return true }) })
function handleSearch() {}
function handleReset() { searchForm.value = { name: '', creditCode: '', region: undefined, status: undefined } }
function handleResetPwd(r: UnitRow) { console.log('重置密码', r) }
function getRowVerifyStatus(record: UnitRow): 'noNeed' | 'unverified' | 'verifying' | 'success' | 'fail' {
  if (record.noCertConfirmed) return 'noNeed'
  const certs = record.certificates || []
  if (certs.length === 0) return 'unverified'
  if (certs.some(c => c.verifyStatus === 'verifying')) return 'verifying'
  if (certs.every(c => c.verifyStatus === 'success')) return 'success'
  if (certs.some(c => c.verifyStatus === 'fail')) return 'fail'
  return 'unverified'
}
function getRowVerifyLabel(record: UnitRow): string {
  const map = { noNeed: '无需校验', unverified: '未校验', verifying: '校验中', success: '校验成功', fail: '校验失败' }
  return map[getRowVerifyStatus(record)]
}
function getRowVerifyColor(record: UnitRow): string {
  const map = { noNeed: '#999', unverified: '#999', verifying: '#faad14', success: '#52c41a', fail: '#ff4d4f' }
  return map[getRowVerifyStatus(record)]
}
const modalVisible = ref(false)
const formMode = ref<'add' | 'view' | 'edit'>('add')
const editingId = ref<number | null>(null)
const formData = ref({ name: '', creditCode: '', region: undefined as string | undefined, address: '', legalPerson: '', legalPhone: '', unitHead: '', headPhone: '', dailyContact: '', contactPhone: '', status: '启用', supervisor: '', remark: '' })
const certificates = ref<CertItem[]>([])
const noCertConfirmed = ref(false)
const showCerts = computed(() => formData.value.creditCode.trim().length > 0)
watch(showCerts, (val) => {
  if (val && certificates.value.length === 0 && !noCertConfirmed.value) {
    addCertificate()
  }
})
function addCertificate() { noCertConfirmed.value = false; certificates.value.push({ certSequence: '', specialtyName: '', qualificationLevel: '', certDetail: '', certNo: '', certImage: '', verifyStatus: '' }) }
function removeCertificate(idx: number) {
  if (certificates.value.length === 1) {
    Modal.confirm({
      title: '确认操作',
      content: '是否确认企业无资质证书？',
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
    // 模拟校验：资质资格序列、专业名称和编号都不为空时校验成功，否则失败
    cert.verifyStatus = (cert.certSequence && cert.specialtyName && cert.certNo) ? 'success' : 'fail'
  }, 1500)
}
const modalTitle = computed(() => { if (formMode.value === 'add') return '新增安全评估单位'; if (formMode.value === 'view') return '查看安全评估单位'; return '编辑安全评估单位' })
function openModal(mode: 'add' | 'view' | 'edit', record?: UnitRow) {
  formMode.value = mode
  if (mode === 'add') { editingId.value = null; formData.value = { name: '', creditCode: '', region: undefined, address: '', legalPerson: '', legalPhone: '', unitHead: '', headPhone: '', dailyContact: '', contactPhone: '', status: '启用', supervisor: '', remark: '' }; certificates.value = []; noCertConfirmed.value = false }
  else if (record) { editingId.value = record.id; formData.value = { name: record.name, creditCode: record.creditCode, region: record.region, address: record.address, legalPerson: record.legalPerson, legalPhone: record.legalPhone, unitHead: record.unitHead, headPhone: record.headPhone, dailyContact: record.dailyContact, contactPhone: record.contactPhone, status: record.status, supervisor: record.supervisor, remark: record.remark }; certificates.value = record.certificates ? [...record.certificates] : []; noCertConfirmed.value = certificates.value.length === 0 && record.creditCode.trim().length > 0 }
  modalVisible.value = true
}
function submitForm() {
  if (formMode.value === 'add') { const newId = Math.max(...tableData.value.map(r => r.id), 0) + 1; tableData.value.push({ id: newId, ...formData.value, certificates: [...certificates.value], noCertConfirmed: noCertConfirmed.value } as UnitRow) }
  else if (formMode.value === 'edit' && editingId.value) { const row = tableData.value.find(r => r.id === editingId.value); if (row) Object.assign(row, formData.value, { certificates: [...certificates.value], noCertConfirmed: noCertConfirmed.value }) }
  modalVisible.value = false
}
function resetForm() { formData.value = { name: '', creditCode: '', region: undefined, address: '', legalPerson: '', legalPhone: '', unitHead: '', headPhone: '', dailyContact: '', contactPhone: '', status: '启用', supervisor: '', remark: '' }; certificates.value = []; noCertConfirmed.value = false }
</script>

<style scoped lang="scss">
.third-party-page { background: #fff; padding: 20px; border-radius: 8px; }
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
