<template>
  <div class="checklist-page">
    <div class="card">
      <div class="page-header"><h3>检查表配置</h3></div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">检查表名称</span>
          <a-input v-model:value="filters.name" placeholder="请输入检查表名称" allow-clear style="width: 180px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">归属地区</span>
          <a-select v-model:value="filters.area" placeholder="请选择" style="width: 140px">
            <a-select-option value="浙江省">浙江省</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">检查表类型</span>
          <a-select v-model:value="filters.type" placeholder="请选择" allow-clear style="width: 160px">
            <a-select-option value="日常检查">日常检查</a-select-option>
            <a-select-option value="专项检查">专项检查</a-select-option>
            <a-select-option value="综合安全隐患排查">综合安全隐患排查</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">检查场景</span>
          <a-input v-model:value="filters.scene" placeholder="请输入" allow-clear style="width: 140px" />
        </div>
        <div class="filter-actions">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </div>
      </div>

      <!-- 新建按钮 -->
      <div class="table-toolbar">
        <a-button type="primary" @click="openCreateForm">+ 新建填报表</a-button>
      </div>

      <!-- 数据表格 -->
      <a-table :columns="columns" :data-source="filteredData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }"
        size="small" row-key="id" class="checklist-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'specialCategory'">{{ record.specialCategory || '-' }}</template>
          <template v-else-if="column.key === 'action'">
            <div class="action-btns">
              <a-button type="link" size="small" @click="openDetail(record, false)">查看</a-button>
              <a-button type="link" size="small" @click="openDetail(record, true)">编辑</a-button>
              <a-button type="link" danger size="small" @click="handleDelete(record)">删除</a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 查看/编辑填报表弹窗 (P1/P2) -->
    <a-modal v-model:open="detailVisible" :title="isEditMode ? '编辑填报表' : '查看填报表'"
      :footer="null" width="1200px" class="detail-modal" @cancel="detailVisible = false">
      <!-- 基础信息 -->
      <div class="section-title">基础信息</div>
      <div class="info-grid">
        <div class="info-item">
          <label>检查表名称</label>
          <span v-if="!isEditMode" class="info-val">{{ currentRecord?.name }}</span>
          <a-input v-else v-model:value="currentRecord.name" style="width: 200px" />
        </div>
        <div class="info-item">
          <label>检查表类型</label>
          <span v-if="!isEditMode" class="info-val">{{ currentRecord?.type }}</span>
          <a-select v-else v-model:value="currentRecord.type" style="width: 200px">
            <a-select-option value="日常检查">日常检查</a-select-option>
            <a-select-option value="专项检查">专项检查</a-select-option>
            <a-select-option value="综合安全隐患排查">综合安全隐患排查</a-select-option>
          </a-select>
        </div>
        <div class="info-item">
          <label>检查项目</label>
          <span v-if="!isEditMode" class="info-val">{{ currentRecord?.project }}</span>
          <a-input v-else v-model:value="currentRecord.project" style="width: 200px" />
        </div>
        <div class="info-item">
          <label>适用地区</label>
          <span v-if="!isEditMode" class="info-val">{{ currentRecord?.region }}</span>
          <a-input v-else v-model:value="currentRecord.region" style="width: 200px" />
        </div>
        <div class="info-item">
          <label>检查场景</label>
          <span v-if="!isEditMode" class="info-val">{{ currentRecord?.scene }}</span>
          <a-input v-else v-model:value="currentRecord.scene" style="width: 200px" />
        </div>
      </div>

      <!-- 检查表设置 -->
      <div class="section-header">
        <span class="section-title">检查表设置</span>
        <div class="section-actions" v-if="isEditMode">
          <a-button type="primary" size="small" @click="openNewQuestion">+ 新建检查问题</a-button>
          <a-button type="primary" size="small" @click="openBankModal">+ 从题库中添加</a-button>
        </div>
      </div>
      <a-table :columns="detailColumns" :data-source="detailTableData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }"
        size="small" row-key="id" class="checklist-table">
        <template #bodyCell="{ column, record: row, index }">
          <template v-if="column.key === 'index'">{{ index + 1 }}</template>
          <template v-else-if="column.key === 'action'">
            <div class="action-btns" v-if="isEditMode">
              <a-button type="link" size="small" @click="moveRow(index, -1)" :disabled="index === 0">上移</a-button>
              <a-button type="link" size="small" @click="moveRow(index, 1)" :disabled="index === detailTableData.length - 1">下移</a-button>
              <a-button type="link" size="small" @click="openNewQuestion(index)">添加一项</a-button>
              <a-button type="link" size="small" @click="openNewQuestion(index, true)">编辑</a-button>
              <a-button type="link" danger size="small" @click="removeDetailRow(index)">删除</a-button>
            </div>
            <div class="action-btns" v-else>
              <a-button type="link" size="small" @click="viewRow(row)">查看</a-button>
            </div>
          </template>
        </template>
      </a-table>

      <div class="detail-footer" v-if="isEditMode">
        <a-button type="primary" @click="handleSaveReturn">保存并返回列表</a-button>
        <a-button type="primary" ghost @click="handleSaveStay">保存且留在当前页</a-button>
      </div>
    </a-modal>

    <!-- 编辑检查问题弹窗 (P3) -->
    <a-modal v-model:open="questionVisible" title="编辑检查问题"
      :footer="null" width="900px" class="question-modal">
      <div class="question-form">
        <div class="form-row">
          <div class="form-item required">
            <label>检查大类</label>
            <div class="form-row-inner">
              <a-select v-model:value="questionForm.category" placeholder="请选择" style="width: 260px">
                <a-select-option v-for="c in categoryList" :key="c" :value="c">{{ c }}</a-select-option>
              </a-select>
              <a-button type="link" size="small" @click="handleAddCategory">新增类别</a-button>
              <a-button type="link" size="small" @click="handleManageCategory">类别管理</a-button>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item required form-item-full">
            <label>隐患描述</label>
            <a-input v-model:value="questionForm.desc" placeholder="请输入隐患描述" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item">
            <label>隐患等级</label>
            <a-select v-model:value="questionForm.level" placeholder="请选择" style="width: 260px">
              <a-select-option value="一般隐患">一般隐患</a-select-option>
              <a-select-option value="较大隐患">较大隐患</a-select-option>
              <a-select-option value="重大隐患">重大隐患</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item required">
            <label>是否必查</label>
            <a-select v-model:value="questionForm.mustCheck" placeholder="请选择" style="width: 260px">
              <a-select-option value="选查">选查</a-select-option>
              <a-select-option value="必查">必查</a-select-option>
            </a-select>
          </div>
          <div class="form-item">
            <label>整改要求</label>
            <a-select v-model:value="questionForm.rectifyReq" placeholder="请选择" style="width: 260px" @change="handleRectifyReqChange">
              <a-select-option value="立即整改">立即整改</a-select-option>
              <a-select-option value="限期整改">限期整改</a-select-option>
              <a-select-option value="制定计划按期整改">制定计划按期整改</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row" v-if="questionForm.rectifyReq === '立即整改' || questionForm.rectifyReq === '限期整改'">
          <div class="form-item required">
            <label>整改时间</label>
            <a-input 
              v-model:value="questionForm.rectifyDays" 
              :disabled="questionForm.rectifyReq === '立即整改'"
              placeholder="请输入天数" 
              style="width: 260px" />
            <span v-if="questionForm.rectifyReq === '立即整改'" style="margin-left: 8px; color: #999; font-size: 12px;">（固定3天）</span>
            <span v-else style="margin-left: 8px; color: #999; font-size: 12px;">天</span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item required">
            <label>整改后是否审核</label>
            <a-select v-model:value="questionForm.needAudit" placeholder="请选择" style="width: 260px">
              <a-select-option value="否">否</a-select-option>
              <a-select-option value="区县审核">区县审核</a-select-option>
              <a-select-option value="市级审核">市级审核</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-item form-item-full">
            <label>检查说明</label>
            <a-input v-model:value="questionForm.checkNote" placeholder="请输入检查说明" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-item form-item-full">
            <label>整改标准</label>
            <a-input v-model:value="questionForm.rectifyStandard" placeholder="请输入整改标准" />
          </div>
        </div>
      </div>

      <!-- 快捷填报 -->
      <div class="quick-section">
        <div class="quick-header">
          <div class="quick-title-row">
            <span>快捷填报</span>
            <a-button type="link" size="small" @click="addQuickRow">添加一行</a-button>
          </div>
        </div>
        <a-table :columns="quickColumns" :data-source="quickTableData"
          :pagination="false" size="small" row-key="id" class="quick-table">
          <template #bodyCell="{ column, record: row, index }">
            <template v-if="column.key === 'index'">{{ index + 1 }}</template>
            <template v-else-if="column.key === 'content'">
              <a-input v-model:value="row.content" placeholder="请输入内容描述" size="small" />
            </template>
            <template v-else-if="column.key === 'action'">
              <a-button type="link" danger size="small" @click="removeQuickRow(index)">删除</a-button>
            </template>
          </template>
          <template #emptyText>
            <a-empty description="暂无数据" :image-style="{ height: '40px' }" />
          </template>
        </a-table>
      </div>

      <div class="modal-footer">
        <a-button type="primary" @click="handleSaveQuestion">保存</a-button>
        <a-button @click="questionVisible = false">取消</a-button>
      </div>
    </a-modal>

    <!-- 从题库中添加弹窗 (P4) -->
    <a-modal v-model:open="bankVisible" title="从题库中添加" :footer="null" width="1000px" class="bank-modal">
      <div class="bank-layout">
        <!-- 左侧填报表列表 -->
        <div class="bank-left">
          <div class="bank-left-title">填报表名称</div>
          <div class="bank-search">
            <a-input v-model:value="bankSearch" placeholder="请输入填报表名..." size="small" />
            <div class="bank-search-btns">
              <a-button size="small" @click="bankSearch = ''">重置</a-button>
              <a-button type="primary" size="small">搜索</a-button>
            </div>
          </div>
          <div class="bank-list">
            <div v-for="item in filteredBankList" :key="item.id" class="bank-list-item"
              :class="{ active: selectedBankItem?.id === item.id }" @click="selectBankItem(item)">
              {{ item.name }}
            </div>
          </div>
        </div>
        <!-- 右侧内容区 -->
        <div class="bank-right">
          <div class="bank-right-header">
            <span>关键字搜索：</span>
            <a-input v-model:value="bankKeyword" placeholder="输入关键字" size="small" style="width: 200px" />
            <a-button type="primary" size="small" style="margin-left: 8px">查询</a-button>
          </div>
          <a-table :columns="bankRightColumns" :data-source="bankRightData"
            :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }"
            size="small" row-key="id" class="checklist-table"
            :row-selection="{ selectedRowKeys: bankSelectedKeys, onChange: onBankSelectChange }">
            <template #bodyCell="{ column, index }">
              <template v-if="column.key === 'index'">{{ index + 1 }}</template>
            </template>
            <template #emptyText>
              <a-empty description="暂无数据" :image-style="{ height: '60px' }" />
            </template>
          </a-table>
        </div>
      </div>
      <div class="bank-footer">
        <span class="bank-selected-count">已选: {{ bankSelectedKeys.length }}</span>
        <a-button type="primary" @click="handleBankSave">保存</a-button>
        <a-button @click="bankVisible = false">取消</a-button>
      </div>
    </a-modal>
    
    <!-- 新增类别弹窗 -->
    <a-modal v-model:open="categoryModalVisible" title="编辑类别" :footer="null" width="500px">
      <div class="category-form">
        <div class="form-item required">
          <label>分项名称：</label>
          <a-input v-model:value="newCategoryName" placeholder="请输入分项名称" />
        </div>
        <div class="form-item">
          <label>备注：</label>
          <a-input v-model:value="newCategoryRemark" placeholder="请输入备注" />
        </div>
      </div>
      <div class="modal-footer">
        <a-button type="primary" @click="handleSaveCategory">保存</a-button>
        <a-button @click="categoryModalVisible = false">取消</a-button>
      </div>
    </a-modal>
    
    <!-- 类别管理弹窗 -->
    <a-modal v-model:open="categoryManageModalVisible" title="类别管理" :footer="null" width="900px">
      <div class="category-manage-tip">
        <span class="tip-icon">⚠️</span>
        <span>提示：分项名称必填</span>
      </div>
      <a-table 
        :columns="categoryManageColumns" 
        :data-source="categoryListWithStatus"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }"
        size="small" 
        row-key="id" 
        class="checklist-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'index'">{{ record.id }}</template>
          <template v-else-if="column.key === 'name'">
            <a-input v-model:value="record.name" placeholder="请输入分项名称" />
          </template>
          <template v-else-if="column.key === 'remark'">
            <a-input v-model:value="record.remark" placeholder="请输入备注" />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button 
              type="link" 
              size="small" 
              :style="{ color: record.status === '启用' ? '#faad14' : '#52c41a' }"
              @click="toggleCategoryStatus(record)">
              {{ record.status === '启用' ? '停用' : '启用' }}
            </a-button>
          </template>
        </template>
      </a-table>
      <div class="modal-footer">
        <a-button @click="categoryManageModalVisible = false">关闭</a-button>
      </div>
    </a-modal>

    <!-- 新建填报表弹窗 -->
    <a-modal v-model:open="createFormVisible" title="新建填报表" :footer="null" width="520px" class="create-form-modal">
      <div class="create-tip">
        <span class="tip-icon">❗</span>
        <span>提示：除填检查表名称外，其他字段保存后不可修改</span>
      </div>
      <div class="create-form">
        <div class="create-field required">
          <label>检查表名称</label>
          <a-input v-model:value="createForm.name" placeholder="请输入检查表名称" />
        </div>
        <div class="create-field required">
          <label>适用地区</label>
          <a-select v-model:value="createForm.region" placeholder="请选择区县" style="width: 100%">
            <a-select-option value="浙江省 / 杭州市 / 上城区">浙江省 / 杭州市 / 上城区</a-select-option>
            <a-select-option value="浙江省 / 杭州市 / 下城区">浙江省 / 杭州市 / 下城区</a-select-option>
            <a-select-option value="浙江省 / 宁波市 / 海曙区">浙江省 / 宁波市 / 海曙区</a-select-option>
          </a-select>
        </div>
        <div class="create-field required">
          <label>检查表类型</label>
          <a-select v-model:value="createForm.type" placeholder="请选择" style="width: 100%">
            <a-select-option value="日常检查">日常检查</a-select-option>
            <a-select-option value="专项检查">专项检查</a-select-option>
            <a-select-option value="综合安全隐患排查">综合安全隐患排查</a-select-option>
          </a-select>
        </div>
        <div class="create-field required" v-if="createForm.type === '专项检查'">
          <label>专项类别</label>
          <a-select v-model:value="createForm.specialCategory" placeholder="请选择" style="width: 100%">
            <a-select-option value="专项隐患排查">专项隐患排查</a-select-option>
            <a-select-option value="季节性隐患排查">季节性隐患排查</a-select-option>
            <a-select-option value="重大活动/重大节日保障隐患排查">重大活动/重大节日保障隐患排查</a-select-option>
          </a-select>
        </div>
        <div class="create-field required">
          <label>检查场景</label>
          <a-select v-model:value="createForm.scene" placeholder="请选择" style="width: 100%">
            <a-select-option value="道路检查">道路检查</a-select-option>
            <a-select-option value="桥梁检查">桥梁检查</a-select-option>
            <a-select-option value="隧道检查">隧道检查</a-select-option>
          </a-select>
        </div>
        <div class="create-field required">
          <label>检查项目</label>
          <a-select v-model:value="createForm.project" placeholder="请选择" style="width: 100%">
            <a-select-option v-for="item in availableProjects" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="create-footer">
        <a-button type="primary" @click="handleCreateSave">仅保存</a-button>
        <a-button type="primary" @click="handleCreateSaveAndEdit" style="background: #003a8c">保存并编辑报表</a-button>
        <a-button @click="handleCreateReset">重置</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Modal, message } from 'ant-design-vue'

/* ========== 主列表 ========== */
const filters = reactive({ name: '', area: '浙江省', type: undefined as string | undefined, scene: '' })
function handleReset() {
  filters.name = ''; filters.area = '浙江省'; filters.type = undefined; filters.scene = ''
}
function handleSearch() {}

const columns = [
  { title: '填报表ID', dataIndex: 'id', key: 'id', width: 90, align: 'center' as const },
  { title: '检查表名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '归属地区', dataIndex: 'area', key: 'area', width: 100, align: 'center' as const },
  { title: '检查表类型', dataIndex: 'type', key: 'type', width: 140, align: 'center' as const },
  { title: '专项类别', dataIndex: 'specialCategory', key: 'specialCategory', width: 120, align: 'center' as const },
  { title: '检查场景', dataIndex: 'scene', key: 'scene', width: 100, align: 'center' as const },
  { title: '检查项目', dataIndex: 'project', key: 'project', width: 120 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 170, align: 'center' as const },
  { title: '操作', key: 'action', width: 150, align: 'center' as const, fixed: 'right' as const },
]

const tableData = ref([
  { id: 9, name: '测试0618', area: '浙江省', type: '日常检查', specialCategory: '', scene: '桥梁检查', project: '桥梁设施', region: '浙江省 / 杭州市 / 上城区', updateTime: '2026-06-18 15:28:57' },
  { id: 8, name: '122', area: '浙江省', type: '专项检查', specialCategory: '专业隐患排查', scene: '桥梁检查', project: '桥梁设施', region: '浙江省 / 杭州市 / 上城区', updateTime: '2026-06-16 18:53:37' },
  { id: 7, name: '测试', area: '浙江省', type: '日常检查', specialCategory: '', scene: '桥梁检查', project: '桥梁设施', region: '浙江省 / 杭州市 / 上城区', updateTime: '2026-04-22 14:13:27' },
  { id: 6, name: '照明', area: '浙江省', type: '日常检查', specialCategory: '', scene: '桥梁检查', project: '照明设施', region: '浙江省 / 杭州市 / 上城区', updateTime: '2026-04-16 09:00:09' },
  { id: 5, name: '人行', area: '浙江省', type: '日常检查', specialCategory: '', scene: '桥梁检查', project: '人行天桥设施', region: '浙江省 / 杭州市 / 上城区', updateTime: '2026-04-16 08:59:44' },
])

const filteredData = computed(() => tableData.value.filter(row => {
  if (filters.name && !row.name.includes(filters.name)) return false
  if (filters.area && row.area !== filters.area) return false
  if (filters.type && row.type !== filters.type) return false
  if (filters.scene && !row.scene.includes(filters.scene)) return false
  return true
}))

function handleDelete(record: any) {
  Modal.confirm({ title: '确认删除', content: `确定要删除检查表「${record.name}」吗？`, okText: '确定', cancelText: '取消', onOk: () => { tableData.value = tableData.value.filter(r => r.id !== record.id) } })
}

/* ========== 查看/编辑弹窗 (P1/P2) ========== */
const detailVisible = ref(false)
const isEditMode = ref(false)
const currentRecord = ref<any>(null)

const detailColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const },
  { title: '检查大类', dataIndex: 'category', key: 'category', width: 120 },
  { title: '隐患描述', dataIndex: 'desc', key: 'desc', width: 150 },
  { title: '隐患等级', dataIndex: 'level', key: 'level', width: 100, align: 'center' as const },
  { title: '是否必查', dataIndex: 'mustCheck', key: 'mustCheck', width: 90, align: 'center' as const },
  { title: '整改要求', dataIndex: 'rectifyReq', key: 'rectifyReq', width: 120 },
  { title: '整改时间(天)', dataIndex: 'rectifyDays', key: 'rectifyDays', width: 100, align: 'center' as const },
  { title: '整改后是否审核', dataIndex: 'needAudit', key: 'needAudit', width: 120, align: 'center' as const },
  { title: '操作', key: 'action', width: 280, align: 'center' as const },
]

const detailTableData = ref<any[]>([
  { id: 1, category: 'AAA', desc: '1', level: '一般隐患', mustCheck: '必查', rectifyReq: '', rectifyDays: '', needAudit: '否' },
])

function openDetail(record: any, edit: boolean) {
  currentRecord.value = { ...record }
  isEditMode.value = edit
  detailTableData.value = [{ id: 1, category: 'AAA', desc: '1', level: '一般隐患', mustCheck: '必查', rectifyReq: '', rectifyDays: '', needAudit: '否' }]
  detailVisible.value = true
}

function moveRow(index: number, dir: number) {
  const arr = [...detailTableData.value]
  const target = index + dir
  if (target < 0 || target >= arr.length) return
  ;[arr[index], arr[target]] = [arr[target], arr[index]]
  detailTableData.value = arr
}

function removeDetailRow(index: number) {
  detailTableData.value.splice(index, 1)
}

function viewRow(row: any) {
  Modal.info({ title: '检查问题详情', content: `检查大类：${row.category}\n隐患描述：${row.desc}\n隐患等级：${row.level}`, okText: '确定' })
}

function handleSaveReturn() {
  message.success('保存成功')
  detailVisible.value = false
}
function handleSaveStay() {
  message.success('保存成功')
}

/* ========== 新建/编辑检查问题弹窗 (P3) ========== */
const questionVisible = ref(false)
const editingQuestionIdx = ref(-1)
const categoryList = ref(['AAA', 'BBB', '结构检查', '设施检查'])

// 新增类别弹窗状态
const categoryModalVisible = ref(false)
const newCategoryName = ref('')
const newCategoryRemark = ref('')
const editingCategoryId = ref<number | null>(null)

// 类别管理弹窗状态
const categoryManageModalVisible = ref(false)
const categoryListWithStatus = ref<any[]>([])

const questionForm = reactive({
  category: undefined as string | undefined,
  desc: '',
  level: undefined as string | undefined,
  rectifyReq: '',
  rectifyDays: '' as string | undefined,
  mustCheck: undefined as string | undefined,
  needAudit: undefined as string | undefined,
  checkNote: '',
  rectifyStandard: '',
})

const quickTableData = ref<{ id: number; content: string }[]>([])
let quickId = 1

const quickColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const },
  { title: '内容描述', key: 'content' },
  { title: '操作', key: 'action', width: 80, align: 'center' as const },
]

// 类别管理表格列定义
const categoryManageColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const },
  { title: '分项名称', key: 'name', width: 300 },
  { title: '备注', key: 'remark' },
  { title: '操作', key: 'action', width: 100, align: 'center' as const },
]

function openNewQuestion(insertIdx?: number, isEdit?: boolean) {
  editingQuestionIdx.value = (isEdit && insertIdx !== undefined) ? insertIdx : -1
  questionForm.category = undefined
  questionForm.desc = ''
  questionForm.level = undefined
  questionForm.rectifyReq = undefined
  questionForm.rectifyDays = undefined
  questionForm.mustCheck = undefined
  questionForm.needAudit = undefined
  questionForm.checkNote = ''
  questionForm.rectifyStandard = ''
  quickTableData.value = []
  quickId = 1
  if (isEdit && insertIdx !== undefined) {
    const row = detailTableData.value[insertIdx]
    questionForm.category = row.category
    questionForm.desc = row.desc
    questionForm.level = row.level
    questionForm.rectifyReq = row.rectifyReq
    questionForm.rectifyDays = row.rectifyDays || ''
    questionForm.mustCheck = row.mustCheck
    questionForm.needAudit = row.needAudit
    questionForm.checkNote = (row as any).checkNote || ''
    questionForm.rectifyStandard = (row as any).rectifyStandard || ''
  }
  questionVisible.value = true
}

function addQuickRow() {
  quickTableData.value.push({ id: quickId++, content: '' })
}
function removeQuickRow(index: number) {
  quickTableData.value.splice(index, 1)
}

function handleAddCategory() {
  editingCategoryId.value = null
  newCategoryName.value = ''
  newCategoryRemark.value = ''
  categoryModalVisible.value = true
}

function handleSaveCategory() {
  if (!newCategoryName.value.trim()) {
    message.warning('请输入分项名称')
    return
  }
  // 添加到 categoryList
  categoryList.value.push(newCategoryName.value.trim())
  message.success('添加成功')
  categoryModalVisible.value = false
}

function handleRectifyReqChange(value: string) {
  if (value === '立即整改') {
    questionForm.rectifyDays = '3'
  } else if (value === '限期整改') {
    questionForm.rectifyDays = ''
  } else {
    questionForm.rectifyDays = undefined
  }
}

function handleManageCategory() {
  // 将 categoryList 转换为带状态的列表
  categoryListWithStatus.value = categoryList.value.map((name, index) => ({
    id: index + 1,
    name,
    remark: '',
    status: '启用'
  }))
  categoryManageModalVisible.value = true
}

function toggleCategoryStatus(record: any) {
  Modal.confirm({
    title: '确认操作',
    content: `确定要${record.status === '启用' ? '停用' : '启用'}「${record.name}」吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: () => {
      record.status = record.status === '启用' ? '停用' : '启用'
      message.success('操作成功')
    }
  })
}

function handleSaveQuestion() {
  if (!questionForm.category) { message.warning('请选择检查大类'); return }
  if (!questionForm.desc) { message.warning('请输入隐患描述'); return }
  if (!questionForm.mustCheck) { message.warning('请选择是否必查'); return }
  if (!questionForm.needAudit) { message.warning('请选择整改后是否审核'); return }

  const newRow = {
    id: Date.now(),
    category: questionForm.category,
    desc: questionForm.desc || '',
    level: questionForm.level || '一般隐患',
    mustCheck: questionForm.mustCheck,
    rectifyReq: questionForm.rectifyReq || '',
    rectifyDays: questionForm.rectifyDays || '',
    needAudit: questionForm.needAudit,
  }

  if (editingQuestionIdx.value >= 0) {
    detailTableData.value[editingQuestionIdx.value] = newRow
  } else {
    detailTableData.value.push(newRow)
  }
  // 添加快捷填报中的行
  quickTableData.value.forEach(q => {
    if (q.content) {
      detailTableData.value.push({ ...newRow, id: Date.now() + Math.random(), desc: q.content })
    }
  })
  questionVisible.value = false
  message.success('保存成功')
}

/* ========== 从题库中添加弹窗 (P4) ========== */
const bankVisible = ref(false)
const bankSearch = ref('')
const bankKeyword = ref('')
const bankSelectedKeys = ref<any[]>([])
const selectedBankItem = ref<any>(null)

const bankList = ref([
  { id: 8, name: '122' },
  { id: 7, name: '测试' },
  { id: 6, name: '照明' },
  { id: 5, name: '人行' },
  { id: 3, name: 'rqqq' },
])

const filteredBankList = computed(() => {
  if (!bankSearch.value) return bankList.value
  return bankList.value.filter(item => item.name.includes(bankSearch.value))
})

function selectBankItem(item: any) {
  selectedBankItem.value = item
}

const bankRightColumns = [
  { title: '序号', key: 'index', width: 60, align: 'center' as const },
  { title: '检查大类', dataIndex: 'category', key: 'category', width: 120 },
  { title: '隐患描述', dataIndex: 'desc', key: 'desc', width: 200 },
]

const bankRightData = ref<any[]>([])

function onBankSelectChange(keys: any[]) {
  bankSelectedKeys.value = keys
}

function openBankModal() {
  bankSearch.value = ''
  bankKeyword.value = ''
  bankSelectedKeys.value = []
  selectedBankItem.value = null
  bankRightData.value = []
  bankVisible.value = true
}

function handleBankSave() {
  if (bankSelectedKeys.value.length === 0) { message.warning('请选择要添加的检查问题'); return }
  message.success(`已添加 ${bankSelectedKeys.value.length} 条检查问题`)
  bankVisible.value = false
}

/* ========== 新建填报表弹窗 ========== */
const createFormVisible = ref(false)
const createForm = reactive({
  name: '',
  region: undefined as string | undefined,
  type: undefined as string | undefined,
  specialCategory: undefined as string | undefined,
  scene: undefined as string | undefined,
  project: undefined as string | undefined,
})

// 根据检查表类型、专项类别和检查场景动态生成检查项目选项
const availableProjects = computed(() => {
  const type = createForm.type
  const specialCategory = createForm.specialCategory
  const scene = createForm.scene
  
  if (!type || !scene) return []
  
  // 日常检查
  if (type === '日常检查') {
    if (scene === '桥梁检查') {
      return ['桥梁设施', '人行天桥设施', '照明设施', '作业安全', '实施管理']
    } else if (scene === '道路检查') {
      return ['道路设施', '照明设施', '作业安全', '实施管理']
    } else if (scene === '隧道检查') {
      return ['隧道设施', '下穿通道设施', '人行地道设施', '作业安全', '实施管理']
    }
  }
  
  // 专项检查
  if (type === '专项检查') {
    if (specialCategory === '专业隐患排查') {
      if (scene === '桥梁检查') {
        return ['桥梁设施', '照明设施']
      } else if (scene === '道路检查') {
        return ['道路设施', '照明设施']
      } else if (scene === '隧道检查') {
        return ['隧道设施', '照明设施']
      }
    } else if (specialCategory === '季节性隐患排查') {
      return ['防汛抗台', '抗雪防冻', '抗高温']
    } else if (specialCategory === '重大活动/重大节日保障隐患排查') {
      return ['重大活动/重大节日保障隐患排查']
    }
  }
  
  // 综合安全隐患排查
  if (type === '综合安全隐患排查') {
    if (scene === '桥梁检查') {
      return ['桥梁管理', '桥梁设施']
    } else if (scene === '道路检查') {
      return ['道路管理', '道路设施']
    } else if (scene === '隧道检查') {
      return ['隧道管理', '隧道设施']
    }
  }
  
  return []
})

// 监听检查表类型、专项类别、检查场景变化，清空已选择的检查项目
watch([() => createForm.type, () => createForm.specialCategory, () => createForm.scene], () => {
  createForm.project = undefined
})

function openCreateForm() {
  createForm.name = ''
  createForm.region = undefined
  createForm.type = undefined
  createForm.specialCategory = undefined
  createForm.scene = undefined
  createForm.project = undefined
  createFormVisible.value = true
}

function handleCreateReset() {
  createForm.name = ''
  createForm.region = undefined
  createForm.type = undefined
  createForm.specialCategory = undefined
  createForm.scene = undefined
  createForm.project = undefined
}

function validateCreateForm(): boolean {
  if (!createForm.name) { message.warning('请输入检查表名称'); return false }
  if (!createForm.region) { message.warning('请选择适用地区'); return false }
  if (!createForm.type) { message.warning('请选择检查表类型'); return false }
  if (createForm.type === '专项检查' && !createForm.specialCategory) { message.warning('请选择专项类别'); return false }
  if (!createForm.scene) { message.warning('请选择检查场景'); return false }
  if (!createForm.project) { message.warning('请选择检查项目'); return false }
  return true
}

function createNewRecord() {
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  const maxId = tableData.value.reduce((max, r) => Math.max(max, r.id), 0)
  return {
    id: maxId + 1,
    name: createForm.name,
    area: '浙江省',
    type: createForm.type!,
    specialCategory: createForm.specialCategory || '',
    scene: createForm.scene!,
    project: createForm.project!,
    region: createForm.region!,
    updateTime: timeStr,
  }
}

function handleCreateSave() {
  if (!validateCreateForm()) return
  tableData.value.unshift(createNewRecord())
  message.success('保存成功')
  createFormVisible.value = false
}

function handleCreateSaveAndEdit() {
  if (!validateCreateForm()) return
  const record = createNewRecord()
  tableData.value.unshift(record)
  createFormVisible.value = false
  message.success('保存成功，已进入编辑模式')
  openDetail(record, true)
}
</script>

<style scoped lang="scss">
.checklist-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 20px 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.page-header { margin-bottom: 16px; h3 { margin: 0; font-size: 16px; font-weight: 600; color: #1f1f1f; } }
.filter-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.filter-item { display: flex; align-items: center; gap: 8px; }
.filter-label { font-size: 13px; color: #333; white-space: nowrap; }
.filter-actions { display: flex; gap: 8px; margin-left: auto; }
.action-btns { display: flex; gap: 4px; justify-content: center; }
.table-toolbar { margin-bottom: 12px; }
.checklist-table {
  :deep(.ant-table) { font-size: 13px; }
  :deep(.ant-table-thead > tr > th) { padding: 10px 8px; font-size: 13px; font-weight: 500; background: #fafafa; }
  :deep(.ant-table-tbody > tr > td) { padding: 10px 8px; }
}

/* 查看/编辑弹窗 */
.section-title { font-size: 15px; font-weight: 600; color: #1f1f1f; margin: 16px 0 12px; padding-left: 8px; border-left: 3px solid #1890ff; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin: 20px 0 12px; }
.section-actions { display: flex; gap: 8px; }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px 32px; margin-bottom: 8px; }
.info-item {
  display: flex; align-items: center; gap: 12px;
  label { font-size: 13px; color: #666; width: 80px; text-align: right; flex-shrink: 0; }
  .info-val { font-size: 13px; color: #333; }
}
.detail-footer { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0; }

/* 编辑检查问题弹窗 */
.question-form { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; }
.form-row { display: flex; gap: 24px; }
.form-item {
  flex: 1; display: flex; align-items: center; gap: 8px;
  label { font-size: 13px; color: #666; width: 90px; text-align: right; flex-shrink: 0; }
  &.required label::before { content: '* '; color: #ff4d4f; }
}
.form-item-full {
  flex: 1;
  :deep(.ant-input) { flex: 1; }
}
.form-row-inner { display: flex; align-items: center; gap: 8px; }
.quick-section { margin-top: 8px; }
.quick-header { margin-bottom: 8px; }
.quick-title-row {
  display: flex; align-items: center; gap: 12px;
  span { font-size: 14px; font-weight: 500; }
}
.quick-table {
  :deep(.ant-table) { font-size: 13px; }
  :deep(.ant-table-thead > tr > th) { padding: 10px 8px; font-size: 13px; font-weight: 500; background: #fafafa; }
  :deep(.ant-table-tbody > tr > td) { padding: 10px 8px; }
  :deep(.ant-table-thead > tr > th:nth-child(1)),
  :deep(.ant-table-tbody > tr > td:nth-child(1)) { width: 20%; }
  :deep(.ant-table-thead > tr > th:nth-child(2)),
  :deep(.ant-table-tbody > tr > td:nth-child(2)) { width: 60%; }
  :deep(.ant-table-thead > tr > th:nth-child(3)),
  :deep(.ant-table-tbody > tr > td:nth-child(3)) { width: 20%; }
}
.modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid #f0f0f0; }

/* 从题库中添加弹窗 */
.bank-layout { display: flex; gap: 16px; min-height: 360px; }
.bank-left { width: 240px; border: 1px solid #e8e8e8; border-radius: 6px; display: flex; flex-direction: column; }
.bank-left-title { font-size: 14px; font-weight: 500; padding: 12px 12px 8px; border-bottom: 1px solid #f0f0f0; }
.bank-search { padding: 8px 12px; display: flex; flex-direction: column; gap: 8px; }
.bank-search-btns { display: flex; gap: 8px; }
.bank-list { flex: 1; overflow-y: auto; padding: 4px 0; }
.bank-list-item { padding: 8px 12px; cursor: pointer; font-size: 13px; &:hover { background: #f5f7fa; } &.active { background: #e6f7ff; color: #1890ff; font-weight: 500; } }
.bank-right { flex: 1; }
.bank-right-header { display: flex; align-items: center; margin-bottom: 12px; span { font-size: 13px; color: #666; white-space: nowrap; } }
.bank-footer { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0; }
.bank-selected-count { font-size: 13px; color: #52c41a; margin-right: auto; }

/* 新建填报表弹窗 */
.create-tip {
  background: #fffbe6; border: 1px solid #ffe58f; border-radius: 6px;
  padding: 8px 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: #333;
  .tip-icon { color: #faad14; }
}
.create-form { display: flex; flex-direction: column; gap: 16px; }
.create-field {
  display: flex; align-items: center; gap: 12px;
  label { font-size: 13px; color: #333; width: 80px; text-align: right; flex-shrink: 0; }
  &.required label::before { content: '* '; color: #ff4d4f; }
  :deep(.ant-select), :deep(.ant-input) { flex: 1; }
}
.create-footer {
  display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px;
  padding-top: 16px; border-top: 1px solid #f0f0f0;
}

/* 新增类别弹窗 */
.category-form { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
.category-form .form-item {
  display: flex; align-items: center; gap: 12px;
  label { font-size: 13px; color: #333; width: 80px; text-align: right; flex-shrink: 0; }
  &.required label::before { content: '* '; color: #ff4d4f; }
  :deep(.ant-input) { flex: 1; }
}

/* 类别管理弹窗 */
.category-manage-tip {
  background: #fffbe6; border: 1px solid #ffe58f; border-radius: 6px;
  padding: 8px 12px; margin-bottom: 16px; display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: #333;
  .tip-icon { color: #faad14; }
}
</style>
