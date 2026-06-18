<template>
  <div class="todo-page">
    <!-- 上方：待办审批 -->
    <div class="panel approval-panel">
      <div class="panel-header">
        <h3>待办审批</h3>
        <a-button type="primary" size="small" @click="batchApprove">批量审核</a-button>
      </div>
      <a-table
        :columns="approvalColumns"
        :data-source="approvalData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }"
        size="small"
        bordered
        row-key="id"
        :row-selection="{ selectedRowKeys: selectedApprovalKeys, onChange: (keys: any[]) => selectedApprovalKeys = keys }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'typeTime'">
            <span class="type-tag">[{{ (record as ApprovalRow).type }}]</span>{{ (record as ApprovalRow).applyTime }}
          </template>
          <template v-else-if="column.key === 'hazardLevel'">
            <a-tag :color="levelColor[(record as ApprovalRow).hazardLevel]">{{ (record as ApprovalRow).hazardLevel }}</a-tag>
          </template>
          <template v-else-if="column.key === 'approvalStatus'">
            <a-tag :color="(record as ApprovalRow).approvalStatus === '已审批' ? 'success' : 'processing'">{{ (record as ApprovalRow).approvalStatus }}</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="viewApprovalDetail(record as ApprovalRow)">详情</a-button>
            <a-button v-if="(record as ApprovalRow).approvalStatus === '审核中'" type="link" size="small" @click="approveItem(record as ApprovalRow)">审核</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 下方：风险闭环处置 -->
    <div class="panel risk-panel">
      <div class="panel-header">
        <h3>风险闭环处置</h3>
      </div>
      <a-tabs v-model:activeKey="riskTab" class="risk-tabs">
        <a-tab-pane key="hazard" tab="隐患排查">
          <!-- 筛选项 -->
          <div class="filter-bar">
            <a-cascader v-model:value="hazardFilters.regionValue" :options="cascaderOptions" placeholder="市区县" allow-clear style="width: 200px" @change="(v: any) => hazardFilters.regionValue = v || undefined" />
            <a-input v-model:value="hazardFilters.taskName" placeholder="检查任务名称" allow-clear style="width: 180px" />
            <a-select v-model:value="hazardFilters.category" placeholder="排查类别" allow-clear style="width: 180px">
              <a-select-option value="日常隐患排查">日常隐患排查</a-select-option>
              <a-select-option value="专项隐患排查">专项隐患排查</a-select-option>
              <a-select-option value="综合性安全隐患排查">综合性安全隐患排查</a-select-option>
            </a-select>
            <a-input v-model:value="hazardFilters.facilityName" placeholder="检查设施名称" allow-clear style="width: 160px" />
            <a-button type="primary" @click="() => {}">搜索</a-button>
            <a-button @click="resetHazardFilters">重置</a-button>
          </div>

          <!-- 列表 -->
          <a-table
            :columns="hazardColumns"
            :data-source="filteredHazardData"
            :pagination="{ pageSize: 8, showTotal: (t: number) => `共${t}条` }"
            size="small"
            bordered
            row-key="id"
            :scroll="{ x: 'max-content' }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'reportContent'">
                <a-tooltip title="点击查看上报详情">
                  <a @click="showContentDetail((record as HazardRow).reportContent, (record as HazardRow).reportImages)">查看</a>
                </a-tooltip>
              </template>
              <template v-else-if="column.key === 'fixContent'">
                <template v-if="(record as HazardRow).fixContent">
                  <a-tooltip title="点击查看整改详情">
                    <a @click="showContentDetail((record as HazardRow).fixContent!, (record as HazardRow).fixImages!)">查看</a>
                  </a-tooltip>
                </template>
                <span v-else style="color: rgba(0,0,0,0.25)">-</span>
              </template>
              <template v-else-if="column.key === 'status'">
                <a-tag :color="(record as HazardRow).status === '已整改' ? 'success' : 'processing'">{{ (record as HazardRow).status }}</a-tag>
              </template>
              <template v-else-if="column.key === 'overdue'">
                <a-tag v-if="(record as HazardRow).overdue === '是'" color="error">是</a-tag>
                <span v-else>否</span>
              </template>
              <template v-else-if="column.key === 'supervised'">
                <a-tag v-if="(record as HazardRow).supervised === '是'" color="warning">是</a-tag>
                <span v-else>否</span>
              </template>
              <template v-else-if="column.key === 'specialCategory'">
                {{ (record as HazardRow).specialCategory || '-' }}
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" size="small" @click="openFixModal(record as HazardRow)">整改结果填报</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>

        <a-tab-pane key="facility" tab="设施检测">
          <!-- 筛选项 -->
          <div class="filter-bar">
            <a-cascader v-model:value="facilityFilters.regionValue" :options="cascaderOptions" placeholder="所属区域" allow-clear style="width: 200px" @change="(v: any) => facilityFilters.regionValue = v || undefined" />
            <a-input v-model:value="facilityFilters.name" placeholder="检测名称" allow-clear style="width: 160px" />
            <a-select v-model:value="facilityFilters.facilityType" placeholder="设施类别" allow-clear style="width: 120px">
              <a-select-option value="道路">道路</a-select-option>
              <a-select-option value="桥梁">桥梁</a-select-option>
              <a-select-option value="隧道">隧道</a-select-option>
            </a-select>
            <a-input v-model:value="facilityFilters.facilityName" placeholder="设施名称" allow-clear style="width: 160px" />
            <a-button type="primary" @click="() => {}">搜索</a-button>
            <a-button @click="resetFacilityFilters">重置</a-button>
          </div>

          <a-table
            :columns="facilityColumns"
            :data-source="filteredFacilityData"
            :pagination="{ pageSize: 8, showTotal: (t: number) => `共${t}条` }"
            size="small"
            bordered
            row-key="id"
            :scroll="{ x: 'max-content' }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'evaluationGrade'">
                <a-tag :color="gradeColor[(record as FacilityRow).evaluationGrade]">{{ (record as FacilityRow).evaluationGrade }}</a-tag>
              </template>
              <template v-else-if="column.key === 'fixType'">
                {{ (record as FacilityRow).fixType || '-' }}
              </template>
              <template v-else-if="column.key === 'fixStatus'">
                <a-tag :color="(record as FacilityRow).fixStatus === '已完成' ? 'success' : 'processing'">{{ (record as FacilityRow).fixStatus }}</a-tag>
              </template>
              <template v-else-if="column.key === 'fixAfterGrade'">
                <template v-if="(record as FacilityRow).fixAfterGrade">
                  <a-tag :color="gradeColor[(record as FacilityRow).fixAfterGrade]">{{ (record as FacilityRow).fixAfterGrade }}</a-tag>
                </template>
                <span v-else style="color: rgba(0,0,0,0.25)">-</span>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button type="link" size="small" @click="openEditFacilityModal(record as FacilityRow)">编辑</a-button>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </div>

    <!-- 上报/整改内容详情弹窗 -->
    <a-modal v-model:open="contentDetailVisible" title="内容详情" :footer="null" width="520px">
      <p>{{ contentDetailText }}</p>
      <div v-if="contentDetailImgs.length" class="detail-images">
        <div v-for="(img, idx) in contentDetailImgs" :key="idx" class="detail-img-item">{{ img }}</div>
      </div>
    </a-modal>

    <!-- 整改结果填报弹窗 -->
    <a-modal v-model:open="fixModalVisible" title="整改结果填报" @cancel="fixModalVisible = false" width="520px">
      <div class="fix-modal-body">
        <div class="fix-problem">
          <strong>问题：</strong>{{ fixRecord?.reportContent }}
        </div>
        <a-form layout="vertical" style="margin-top: 16px">
          <a-form-item label="处置结果描述" required>
            <a-textarea
              v-model:value="fixForm.description"
              placeholder="请输入处置结果描述(控制在30个字内)"
              :maxlength="30"
              show-count
              :rows="3"
            />
          </a-form-item>
          <a-form-item label="处置照片" required>
            <a-upload
              v-model:file-list="fixForm.fileList"
              list-type="picture-card"
              :before-upload="() => false"
            >
              <div v-if="fixForm.fileList.length < 5">
                <PlusOutlined />
                <div style="margin-top: 8px">上传处置照片</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button @click="fixModalVisible = false">取消</a-button>
        <a-button type="primary" @click="submitFix">提交</a-button>
      </template>
    </a-modal>

    <!-- 编辑设施检测风险清单弹窗 -->
    <a-modal v-model:open="editFacilityVisible" :title="`编辑${editFacilityForm.facilityType}风险清单`" width="720px" @cancel="editFacilityVisible = false">
      <a-form :model="editFacilityForm" layout="horizontal" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }" style="margin-top: 12px">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="检测名称">
              <a-input v-model:value="editFacilityForm.name" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label="`${editFacilityForm.facilityType}名称`">
              <a-input v-model:value="editFacilityForm.facilityName" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="所属区域">
              <a-input v-model:value="editFacilityForm.region" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测时间">
              <a-date-picker v-model:value="editFacilityForm.detectTime" style="width: 100%" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测周期">
              <a-select v-model:value="editFacilityForm.cycle" disabled>
                <a-select-option value="一年">一年</a-select-option>
                <a-select-option value="半年">半年</a-select-option>
                <a-select-option value="季度">季度</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测单位">
              <a-input v-model:value="editFacilityForm.unit" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="负责人">
              <a-input v-model:value="editFacilityForm.manager" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="检测类型">
              <a-input v-model:value="editFacilityForm.detectType" disabled />
            </a-form-item>
          </a-col>
          <template v-if="editFacilityForm.facilityType === '桥梁'">
            <a-col :span="12">
              <a-form-item label="养护类别">
                <a-input v-model:value="editFacilityForm.maintainCategory" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="桥梁BCI">
                <a-input v-model:value="editFacilityForm.bridgeBCI" disabled />
              </a-form-item>
            </a-col>
          </template>
          <template v-if="editFacilityForm.facilityType === '道路'">
            <a-col :span="12">
              <a-form-item label="道路PQI">
                <a-input v-model:value="editFacilityForm.roadPQI" disabled />
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="12">
            <a-form-item :label="`${editFacilityForm.facilityType}综合评价等级`" :label-col="{ span: 9 }" :wrapper-col="{ span: 14 }">
              <a-select v-model:value="editFacilityForm.evaluationGrade" disabled>
                <template v-if="editFacilityForm.facilityType === '道路'">
                  <a-select-option v-for="g in ['A','B','C','D']" :key="g" :value="g">{{ g }}</a-select-option>
                </template>
                <template v-else-if="editFacilityForm.facilityType === '桥梁'">
                  <a-select-option v-for="g in ['A','B','C','D','E','合格','不合格']" :key="g" :value="g">{{ g }}</a-select-option>
                </template>
                <template v-else>
                  <a-select-option v-for="g in ['A','B','C','D','E']" :key="g" :value="g">{{ g }}</a-select-option>
                </template>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="定期检测报告">
              <a-upload
                :file-list="reportFileList"
                :before-upload="() => false"
                :remove="() => false"
                :show-upload-list="{ showRemoveIcon: false }"
              >
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider style="margin: 16px 0 12px" />
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="主要问题" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea v-model:value="editFacilityForm.mainProblem" placeholder="请输入主要问题" :rows="3" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="发现时间">
              <a-date-picker v-model:value="editFacilityForm.problemTime" style="width: 100%" placeholder="选择日期" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划完成时间">
              <a-date-picker v-model:value="editFacilityForm.planTime" style="width: 100%" placeholder="选择日期" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="已开展整治/管控措施" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
              <a-textarea v-model:value="editFacilityForm.measures" placeholder="请输入已开展整治/管控措施" :rows="2" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="下部整改设施" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea v-model:value="editFacilityForm.nextFix" placeholder="请输入下部整改设施" :rows="2" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="整改类型">
              <a-select v-model:value="editFacilityForm.fixType" placeholder="请选择">
                <a-select-option value="维修整治">维修整治</a-select-option>
                <a-select-option value="拆除或完全封控">拆除或完全封控</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="整改完成状态">
              <a-select v-model:value="editFacilityForm.fixStatus" placeholder="请选择">
                <a-select-option value="已完成">已完成</a-select-option>
                <a-select-option value="未完成">未完成</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="editFacilityForm.fixStatus === '已完成'">
            <a-form-item label="整改销号日期">
              <a-date-picker v-model:value="editFacilityForm.fixCancelDate" style="width: 100%" placeholder="选择日期" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="editFacilityForm.fixStatus === '已完成'">
            <a-form-item label="销号申请">
              <a-upload
                :file-list="cancelApplyFileList"
                :before-upload="() => false"
                :show-upload-list="{ showRemoveIcon: true }"
                @remove="() => { editFacilityForm.cancelApply = ''; return true }"
              >
                <a-button><PlusOutlined />上传附件</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="editFacilityForm.fixType === '维修整治' && editFacilityForm.fixStatus === '已完成'">
            <a-form-item label="整改后评级">
              <a-select v-model:value="editFacilityForm.fixAfterGrade" placeholder="请选择">
                <a-select-option v-for="g in fixAfterGradeOptions" :key="g" :value="g">{{ g }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="editFacilityForm.fixType === '维修整治' && editFacilityForm.fixStatus === '已完成'">
            <a-form-item label="整改后评级报告">
              <a-upload
                :file-list="gradeReportFileList"
                :before-upload="() => false"
                :show-upload-list="{ showRemoveIcon: true }"
                @remove="() => { editFacilityForm.gradeReport = ''; return true }"
              >
                <a-button><PlusOutlined />上传附件</a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #footer>
        <a-button @click="editFacilityVisible = false">取消</a-button>
        <a-button type="primary" @click="submitEditFacility">保存</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { UploadFile } from 'ant-design-vue'
import dayjs from 'dayjs'

const riskTab = ref('hazard')

// 市区县两级联动数据
const cityDistrictMap: Record<string, string[]> = {
  '杭州市': ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区', '富阳区', '临安区', '桐庐县', '淳安县', '建德市'],
  '宁波市': ['海曙区', '江北区', '镇海区', '北仑区', '鄞州区', '奉化区', '余姚市', '慈溪市', '象山县', '宁海县'],
  '温州市': ['鹿城区', '龙湾区', '瓯海区', '洞头区', '瑞安市', '乐清市', '永嘉县', '平阳县', '苍南县', '文成县', '泰顺县', '龙港市'],
  '绍兴市': ['越城区', '柯桥区', '上虞区', '诸暨市', '嵊州市', '新昌县'],
  '湖州市': ['吴兴区', '南浔区', '德清县', '长兴县', '安吉县'],
  '嘉兴市': ['南湖区', '秀洲区', '海宁市', '平湖市', '桐乡市', '嘉善县', '海盐县'],
  '金华市': ['婺城区', '金东区', '义乌市', '东阳市', '永康市', '兰溪市', '浦江县', '武义县', '磐安县'],
  '衢州市': ['柯城区', '衢江区', '江山市', '龙游县', '常山县', '开化县'],
  '台州市': ['椒江区', '黄岩区', '路桥区', '临海市', '温岭市', '玉环市', '天台县', '仙居县', '三门县'],
  '丽水市': ['莲都区', '龙泉市', '青田县', '缙云县', '遂昌县', '松阳县', '云和县', '庆元县', '景宁畲族自治县'],
  '舟山市': ['定海区', '普陀区', '岱山县', '嵊泗县'],
}

const cascaderOptions = Object.keys(cityDistrictMap).map(city => ({
  value: city,
  label: city,
  children: cityDistrictMap[city].map(d => ({ value: d, label: d })),
}))

// ===== 隐患排查 =====
interface HazardRow {
  id: number
  city: string
  reportTime: string
  taskName: string
  category: string
  specialCategory: string
  scene: string
  facilityName: string
  address: string
  inspector: string
  reportContent: string
  reportImages: string[]
  hazardLevel: string
  fixDeadline: string
  fixCompleteTime: string
  fixSubmitter: string
  fixContent: string
  fixImages: string[]
  status: string
  overdue: string
  supervised: string
}

const hazardFilters = ref({ regionValue: undefined as string[] | undefined, taskName: '', category: undefined as string | undefined, facilityName: '' })

function resetHazardFilters() {
  hazardFilters.value = { regionValue: undefined, taskName: '', category: undefined, facilityName: '' }
}

const hazardColumns = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 100 },
  { title: '问题上报时间', dataIndex: 'reportTime', key: 'reportTime', width: 120 },
  { title: '检查任务名称', dataIndex: 'taskName', key: 'taskName', width: 160 },
  { title: '排查类别', dataIndex: 'category', key: 'category', width: 130 },
  { title: '专项类别', dataIndex: 'specialCategory', key: 'specialCategory', width: 150 },
  { title: '检查场景', dataIndex: 'scene', key: 'scene', width: 90 },
  { title: '检查对象名称', dataIndex: 'facilityName', key: 'facilityName', width: 160 },
  { title: '详细地址', dataIndex: 'address', key: 'address', width: 200 },
  { title: '检查人', dataIndex: 'inspector', key: 'inspector', width: 70 },
  { title: '上报内容', dataIndex: 'reportContent', key: 'reportContent', width: 80 },
  { title: '隐患等级', dataIndex: 'hazardLevel', key: 'hazardLevel', width: 90 },
  { title: '整改时限', dataIndex: 'fixDeadline', key: 'fixDeadline', width: 100 },
  { title: '完成整改时间', dataIndex: 'fixCompleteTime', key: 'fixCompleteTime', width: 110 },
  { title: '整改提交人员', dataIndex: 'fixSubmitter', key: 'fixSubmitter', width: 110 },
  { title: '整改内容', dataIndex: 'fixContent', key: 'fixContent', width: 80 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 75 },
  { title: '超期未整改', dataIndex: 'overdue', key: 'overdue', width: 90 },
  { title: '是否督办', dataIndex: 'supervised', key: 'supervised', width: 80 },
  { title: '操作', key: 'action', width: 130, fixed: 'right' as const },
]

const hazardData = ref<HazardRow[]>([
  { id: 1, city: '杭州市西湖区', reportTime: '2026-05-20 09:30', taskName: '2026年杭州市日常隐患排查', category: '日常隐患排查', specialCategory: '', scene: '道路检查', facilityName: '杭州市西湖区文三路路段', address: '浙江省杭州市西湖区文三路268号', inspector: '张三', reportContent: '路面出现多处裂缝，长度约15米，宽度约2cm，存在安全隐患', reportImages: ['裂缝照片1.jpg', '裂缝照片2.jpg'], hazardLevel: '较大隐患', fixDeadline: '2026-06-05', fixCompleteTime: '2026-06-03', fixSubmitter: '李四', fixContent: '已完成裂缝灌缝处理，共修复15米裂缝', fixImages: ['修复后照片.jpg'], status: '已整改', overdue: '否', supervised: '否' },
  { id: 2, city: '宁波市鄞州区', reportTime: '2026-05-27 14:15', taskName: '2026年宁波市专项隐患排查', category: '专项隐患排查', specialCategory: '季节性隐患排查', scene: '桥梁检查', facilityName: '宁波市鄞州区甬江大桥', address: '浙江省宁波市鄞州区甬江大道188号', inspector: '王五', reportContent: '桥梁伸缩缝处出现渗水现象，下部结构有水渍', reportImages: ['渗水照片.jpg'], hazardLevel: '重大隐患', fixDeadline: '2026-06-01', fixCompleteTime: '', fixSubmitter: '', fixContent: '', fixImages: [], status: '待整改', overdue: '是', supervised: '是' },
  { id: 3, city: '温州市鹿城区', reportTime: '2026-06-01 10:45', taskName: '2026年温州市综合性安全隐患排查', category: '综合性安全隐患排查', specialCategory: '', scene: '隧道检查', facilityName: '温州市鹿城区大罗山隧道', address: '浙江省温州市鹿城区大罗山隧道入口', inspector: '赵六', reportContent: '隧道内照明灯具损坏3处，能见度不足', reportImages: ['照明损坏照片.jpg'], hazardLevel: '一般隐患', fixDeadline: '2026-06-15', fixCompleteTime: '', fixSubmitter: '', fixContent: '', fixImages: [], status: '待整改', overdue: '否', supervised: '否' },
  { id: 4, city: '绍兴市越城区', reportTime: '2026-06-02 08:20', taskName: '2026年绍兴市专项隐患排查', category: '专项隐患排查', specialCategory: '重大活动/重大节日保障隐患排查', scene: '道路检查', facilityName: '绍兴市越城区解放路主干道', address: '浙江省绍兴市越城区解放路100号', inspector: '钱七', reportContent: '道路标线磨损严重，部分路段已无法辨识', reportImages: ['标线磨损照片.jpg'], hazardLevel: '较大隐患', fixDeadline: '2026-06-20', fixCompleteTime: '2026-06-18', fixSubmitter: '孙八', fixContent: '已重新施划道路标线，共修复200米', fixImages: ['修复后标线.jpg'], status: '已整改', overdue: '否', supervised: '否' },
  { id: 5, city: '湖州市吴兴区', reportTime: '2026-06-03 16:30', taskName: '2026年湖州市日常隐患排查', category: '日常隐患排查', specialCategory: '', scene: '桥梁检查', facilityName: '湖州市吴兴区苕溪桥', address: '浙江省湖州市吴兴区苕溪路55号', inspector: '周九', reportContent: '桥面护栏有2处松动，存在行人安全风险', reportImages: ['护栏松动照片.jpg'], hazardLevel: '一般隐患', fixDeadline: '2026-06-10', fixCompleteTime: '', fixSubmitter: '', fixContent: '', fixImages: [], status: '待整改', overdue: '否', supervised: '否' },
  { id: 6, city: '嘉兴市南湖区', reportTime: '2026-04-15 11:00', taskName: '2026年嘉兴市专项隐患排查', category: '专项隐患排查', specialCategory: '专业隐患排查', scene: '隧道检查', facilityName: '嘉兴市南湖区南湖隧道', address: '浙江省嘉兴市南湖区南湖大道隧道段', inspector: '吴十', reportContent: '隧道内壁出现渗水裂缝，长约3米', reportImages: ['渗水裂缝.jpg'], hazardLevel: '重大隐患', fixDeadline: '2026-05-15', fixCompleteTime: '', fixSubmitter: '', fixContent: '', fixImages: [], status: '待整改', overdue: '是', supervised: '是' },
])

const filteredHazardData = computed(() => {
  return hazardData.value.filter(row => {
    // 删除状态为已整改的数据
    if (row.status === '已整改') return false
    const rv = hazardFilters.value.regionValue
    if (rv && rv[0] && !row.city.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.city.includes(rv[1])) return false
    if (hazardFilters.value.taskName && !row.taskName.includes(hazardFilters.value.taskName)) return false
    if (hazardFilters.value.category && row.category !== hazardFilters.value.category) return false
    if (hazardFilters.value.facilityName && !row.facilityName.includes(hazardFilters.value.facilityName)) return false
    return true
  })
})

// ===== 内容详情弹窗 =====
const contentDetailVisible = ref(false)
const contentDetailText = ref('')
const contentDetailImgs = ref<string[]>([])

function showContentDetail(text: string, images: string[]) {
  contentDetailText.value = text
  contentDetailImgs.value = images || []
  contentDetailVisible.value = true
}

// ===== 设施检测 =====
interface FacilityRow {
  id: number
  city: string
  name: string
  facilityType: string
  facilityName: string
  detectTime: string
  detectType: string
  evaluationGrade: string
  fixType: string
  fixStatus: string
  fixCancelDate: string
  fixAfterGrade: string
  region: string
  cycle: string
  unit: string
  manager: string
  report: string
  mainProblem: string
  problemTime: string
  planTime: string
  measures: string
  nextFix: string
  maintainCategory: string
  bridgeBCI: string
  roadPQI: string
  cancelApply: string
  gradeReport: string
}

const gradeColor: Record<string, string> = { A: 'green', B: 'blue', C: 'orange', D: 'red', E: 'purple', '合格': 'green', '不合格': 'red' }

const facilityFilters = ref({ regionValue: undefined as string[] | undefined, name: '', facilityType: undefined as string | undefined, facilityName: '' })

function resetFacilityFilters() {
  facilityFilters.value = { regionValue: undefined, name: '', facilityType: undefined, facilityName: '' }
}

const facilityColumns = [
  { title: '检测名称', dataIndex: 'name', key: 'name', width: 140 },
  { title: '设施类别', dataIndex: 'facilityType', key: 'facilityType', width: 80 },
  { title: '设施名称', dataIndex: 'facilityName', key: 'facilityName', width: 160 },
  { title: '所属区域', dataIndex: 'city', key: 'city', width: 120 },
  { title: '检测时间', dataIndex: 'detectTime', key: 'detectTime', width: 110 },
  { title: '检测周期', dataIndex: 'cycle', key: 'cycle', width: 90 },
  { title: '检测类型', dataIndex: 'detectType', key: 'detectType', width: 90 },
  { title: '综合评价等级', dataIndex: 'evaluationGrade', key: 'evaluationGrade', width: 120 },
  { title: '整改类型', dataIndex: 'fixType', key: 'fixType', width: 110 },
  { title: '整改完成状态', dataIndex: 'fixStatus', key: 'fixStatus', width: 110 },
  { title: '整改销号日期', dataIndex: 'fixCancelDate', key: 'fixCancelDate', width: 120 },
  { title: '整改后评级', dataIndex: 'fixAfterGrade', key: 'fixAfterGrade', width: 100 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const facilityData = ref<FacilityRow[]>([
  { id: 1, city: '杭州市西湖区', name: '2026年杭州市道路常规检测', facilityType: '道路', facilityName: '杭州市西湖区文三路路段', detectTime: '2026-05-06', detectType: '常规检测', evaluationGrade: 'B', fixType: '维修整治', fixStatus: '已完成', fixCancelDate: '2026-06-01', fixAfterGrade: 'A', region: '杭州市西湖区', cycle: '一年', unit: '浙江省交通检测中心', manager: '张三', report: '文三路检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '85.32', cancelApply: '', gradeReport: '' },
  { id: 2, city: '宁波市鄞州区', name: '2026年宁波市桥梁常规检测', facilityType: '桥梁', facilityName: '宁波市鄞州区甬江大桥', detectTime: '2026-04-20', detectType: '常规检测', evaluationGrade: 'C', fixType: '维修整治', fixStatus: '未完成', fixCancelDate: '', fixAfterGrade: '', region: '宁波市鄞州区', cycle: '一年', unit: '宁波市桥梁检测中心', manager: '李四', report: '甬江大桥检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: 'II类养护', bridgeBCI: '72.56', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 3, city: '温州市鹿城区', name: '2026年温州市隧道常规检测', facilityType: '隧道', facilityName: '温州市鹿城区大罗山隧道', detectTime: '2026-05-15', detectType: '常规检测', evaluationGrade: 'D', fixType: '', fixStatus: '未完成', fixCancelDate: '', fixAfterGrade: '', region: '温州市鹿城区', cycle: '一年', unit: '浙江省隧道检测所', manager: '王五', report: '大罗山隧道检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 4, city: '绍兴市越城区', name: '2026年绍兴市道路常规检测', facilityType: '道路', facilityName: '绍兴市越城区解放路', detectTime: '2026-03-28', detectType: '常规检测', evaluationGrade: 'C', fixType: '维修整治', fixStatus: '已完成', fixCancelDate: '2026-05-10', fixAfterGrade: 'B', region: '绍兴市越城区', cycle: '半年', unit: '绍兴市道路检测站', manager: '钱七', report: '解放路检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '78.45', cancelApply: '', gradeReport: '' },
  { id: 5, city: '湖州市吴兴区', name: '2026年湖州市桥梁常规检测', facilityType: '桥梁', facilityName: '湖州市吴兴区苕溪桥', detectTime: '2026-05-22', detectType: '常规检测', evaluationGrade: '不合格', fixType: '', fixStatus: '未完成', fixCancelDate: '', fixAfterGrade: '', region: '湖州市吴兴区', cycle: '一年', unit: '湖州市桥梁检测中心', manager: '周九', report: '苕溪桥检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: 'I类养护', bridgeBCI: '', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 6, city: '嘉兴市南湖区', name: '2026年嘉兴市隧道常规检测', facilityType: '隧道', facilityName: '嘉兴市南湖区南湖隧道', detectTime: '2026-04-10', detectType: '常规检测', evaluationGrade: 'E', fixType: '维修整治', fixStatus: '已完成', fixCancelDate: '2026-05-20', fixAfterGrade: 'C', region: '嘉兴市南湖区', cycle: '一年', unit: '浙江省交通检测中心', manager: '吴十', report: '南湖隧道检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 7, city: '金华市婺城区', name: '2026年金华市道路常规检测', facilityType: '道路', facilityName: '金华市婺城区宾虹路', detectTime: '2026-04-18', detectType: '常规检测', evaluationGrade: 'D', fixType: '', fixStatus: '未完成', fixCancelDate: '', fixAfterGrade: '', region: '金华市婺城区', cycle: '一年', unit: '金华市道路检测站', manager: '孙八', report: '宾虹路检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '65.18', cancelApply: '', gradeReport: '' },
  { id: 8, city: '衢州市柯城区', name: '2026年衢州市桥梁常规检测', facilityType: '桥梁', facilityName: '衢州市柯城区西安门大桥', detectTime: '2026-05-08', detectType: '常规检测', evaluationGrade: 'D', fixType: '维修整治', fixStatus: '已完成', fixCancelDate: '2026-06-05', fixAfterGrade: 'B', region: '衢州市柯城区', cycle: '一年', unit: '衢州市桥梁检测中心', manager: '赵六', report: '西安门大桥检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: 'III类养护', bridgeBCI: '68.90', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 9, city: '台州市黄岩区', name: '2026年台州市隧道常规检测', facilityType: '隧道', facilityName: '台州市黄岩区方山隧道', detectTime: '2026-03-22', detectType: '常规检测', evaluationGrade: 'D', fixType: '拆除或完全封控', fixStatus: '已完成', fixCancelDate: '2026-04-30', fixAfterGrade: 'B', region: '台州市黄岩区', cycle: '一年', unit: '浙江省隧道检测所', manager: '吴十', report: '方山隧道检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 10, city: '丽水市莲都区', name: '2026年丽水市桥梁常规检测', facilityType: '桥梁', facilityName: '丽水市莲都区小水门大桥', detectTime: '2026-05-30', detectType: '常规检测', evaluationGrade: 'E', fixType: '', fixStatus: '未完成', fixCancelDate: '', fixAfterGrade: '', region: '丽水市莲都区', cycle: '一年', unit: '丽水市桥梁检测中心', manager: '钱七', report: '小水门大桥检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: 'II类养护', bridgeBCI: '55.23', roadPQI: '', cancelApply: '', gradeReport: '' },
  { id: 11, city: '台州市椒江区', name: '2026年台州市道路常规检测', facilityType: '道路', facilityName: '台州市椒江区中山东路', detectTime: '2026-04-05', detectType: '常规检测', evaluationGrade: 'D', fixType: '维修整治', fixStatus: '已完成', fixCancelDate: '2026-05-15', fixAfterGrade: 'B', region: '台州市椒江区', cycle: '一年', unit: '台州市道路检测站', manager: '孙八', report: '中山东路检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '71.65', cancelApply: '', gradeReport: '' },
  { id: 12, city: '舟山市定海区', name: '2026年舟山市隧道常规检测', facilityType: '隧道', facilityName: '舟山市定海区东港隧道', detectTime: '2026-05-12', detectType: '常规检测', evaluationGrade: 'E', fixType: '', fixStatus: '未完成', fixCancelDate: '', fixAfterGrade: '', region: '舟山市定海区', cycle: '一年', unit: '浙江省隧道检测所', manager: '周九', report: '东港隧道检测报告', mainProblem: '', problemTime: '', planTime: '', measures: '', nextFix: '', maintainCategory: '', bridgeBCI: '', roadPQI: '', cancelApply: '', gradeReport: '' },
])

const filteredFacilityData = computed(() => {
  return facilityData.value.filter(row => {
    // 整改完成状态为已完成的归集到此表单
    if (row.fixStatus === '已完成') return false
    // 只归集：D级道路、D/E级和不合格桥梁、D/E级隧道
    const g = row.evaluationGrade
    if (row.facilityType === '道路' && g !== 'D') return false
    if (row.facilityType === '桥梁' && g !== 'D' && g !== 'E' && g !== '不合格') return false
    if (row.facilityType === '隧道' && g !== 'D' && g !== 'E') return false
    const frv = facilityFilters.value.regionValue
    if (frv && frv[0] && !row.city.startsWith(frv[0])) return false
    if (frv && frv[1] && !row.city.includes(frv[1])) return false
    if (facilityFilters.value.name && !row.name.includes(facilityFilters.value.name)) return false
    if (facilityFilters.value.facilityType && row.facilityType !== facilityFilters.value.facilityType) return false
    if (facilityFilters.value.facilityName && !row.facilityName.includes(facilityFilters.value.facilityName)) return false
    return true
  })
})

// ===== 编辑设施检测弹窗 =====
const editFacilityVisible = ref(false)
const editingFacilityId = ref<number | null>(null)
const editFacilityForm = ref({
  name: '', region: '', cycle: '', unit: '', detectType: '常规检测', facilityType: '', facilityName: '',
  detectTime: null as any, manager: '', evaluationGrade: '', report: '',
  mainProblem: '', problemTime: null as any, planTime: null as any, measures: '', nextFix: '',
  fixType: undefined as string | undefined, fixStatus: '未完成' as string | undefined, fixCancelDate: null as any, fixAfterGrade: undefined as string | undefined,
  maintainCategory: '', bridgeBCI: '', roadPQI: '',
  cancelApply: '', gradeReport: '',
})

function openEditFacilityModal(record: FacilityRow) {
  editingFacilityId.value = record.id
  editFacilityForm.value = {
    name: record.name, region: record.region, cycle: record.cycle, unit: record.unit,
    detectType: record.detectType, facilityType: record.facilityType, facilityName: record.facilityName,
    detectTime: record.detectTime ? dayjs(record.detectTime) : null,
    manager: record.manager, evaluationGrade: record.evaluationGrade,
    report: record.report, mainProblem: record.mainProblem,
    problemTime: record.problemTime ? dayjs(record.problemTime) : null,
    planTime: record.planTime ? dayjs(record.planTime) : null,
    measures: record.measures, nextFix: record.nextFix,
    fixType: record.fixType || undefined, fixStatus: record.fixStatus || undefined,
    fixCancelDate: record.fixCancelDate ? dayjs(record.fixCancelDate) : null,
    fixAfterGrade: record.fixAfterGrade || undefined,
    maintainCategory: record.maintainCategory, bridgeBCI: record.bridgeBCI, roadPQI: record.roadPQI,
    cancelApply: record.cancelApply, gradeReport: record.gradeReport,
  }
  editFacilityVisible.value = true
}

const reportFileList = computed<UploadFile[]>(() => {
  if (!editFacilityForm.value.report) return []
  return [{
    uid: '-1',
    name: editFacilityForm.value.report,
    status: 'done' as const,
    url: '#',
  }]
})

const cancelApplyFileList = computed<UploadFile[]>(() => {
  if (!editFacilityForm.value.cancelApply) return []
  return [{
    uid: '-1',
    name: editFacilityForm.value.cancelApply,
    status: 'done' as const,
    url: '#',
  }]
})

const gradeReportFileList = computed<UploadFile[]>(() => {
  if (!editFacilityForm.value.gradeReport) return []
  return [{
    uid: '-1',
    name: editFacilityForm.value.gradeReport,
    status: 'done' as const,
    url: '#',
  }]
})

const fixAfterGradeOptions = computed(() => {
  const ft = editFacilityForm.value.facilityType
  if (ft === '道路') return ['A', 'B', 'C', 'D']
  if (ft === '桥梁') {
    return editFacilityForm.value.maintainCategory === 'I类养护' ? ['合格', '不合格'] : ['A', 'B', 'C', 'D', 'E']
  }
  // 隧道
  return ['A', 'B', 'C', 'D', 'E']
})

function submitEditFacility() {
  const row = facilityData.value.find(r => r.id === editingFacilityId.value)
  if (!row) return
  row.name = editFacilityForm.value.name
  row.region = editFacilityForm.value.region
  row.cycle = editFacilityForm.value.cycle
  row.unit = editFacilityForm.value.unit
  row.facilityName = editFacilityForm.value.facilityName
  row.manager = editFacilityForm.value.manager
  row.evaluationGrade = editFacilityForm.value.evaluationGrade
  row.report = editFacilityForm.value.report
  row.mainProblem = editFacilityForm.value.mainProblem
  row.measures = editFacilityForm.value.measures
  row.nextFix = editFacilityForm.value.nextFix
  row.fixType = editFacilityForm.value.fixType || ''
  row.fixStatus = editFacilityForm.value.fixStatus || '未完成'
  row.fixCancelDate = editFacilityForm.value.fixCancelDate ? editFacilityForm.value.fixCancelDate.format('YYYY-MM-DD') : ''
  row.fixAfterGrade = editFacilityForm.value.fixAfterGrade || ''
  row.cancelApply = editFacilityForm.value.cancelApply
  row.gradeReport = editFacilityForm.value.gradeReport
  editFacilityVisible.value = false
}

// ===== 整改结果填报弹窗 =====
const fixModalVisible = ref(false)
const fixRecord = ref<HazardRow | null>(null)
const fixForm = ref({ description: '', fileList: [] as UploadFile[] })

function openFixModal(record: HazardRow) {
  fixRecord.value = record
  fixForm.value = { description: '', fileList: [] }
  fixModalVisible.value = true
}

function submitFix() {
  if (!fixForm.value.description) return
  if (fixRecord.value) {
    fixRecord.value.status = '已整改'
    fixRecord.value.fixContent = fixForm.value.description
    fixRecord.value.fixCompleteTime = new Date().toISOString().slice(0, 10)
    fixRecord.value.fixSubmitter = '当前用户'
    fixRecord.value.overdue = '否'
  }
  fixModalVisible.value = false
}

// ===== 待办审批 =====
interface ApprovalRow {
  id: number
  type: string
  applyTime: string
  hazardLevel: string
  approvalStatus: string
}

const levelColor: Record<string, string> = { '一般隐患': 'blue', '较大隐患': 'orange', '重大隐患': 'red' }

const approvalColumns = [
  { title: '类型与时间', dataIndex: 'typeTime', key: 'typeTime', width: 180 },
  { title: '隐患等级', dataIndex: 'hazardLevel', key: 'hazardLevel', width: 100 },
  { title: '审核状态', dataIndex: 'approvalStatus', key: 'approvalStatus', width: 100 },
  { title: '操作', key: 'action', width: 120 },
]

const selectedApprovalKeys = ref<number[]>([])

const approvalData = ref<ApprovalRow[]>([
  { id: 1, type: '政府检查', applyTime: '2026-05-27', hazardLevel: '一般隐患', approvalStatus: '审核中' },
  { id: 2, type: '政府检查', applyTime: '2026-03-15', hazardLevel: '较大隐患', approvalStatus: '审核中' },
  { id: 3, type: '政府检查', applyTime: '2026-03-13', hazardLevel: '较大隐患', approvalStatus: '审核中' },
])

function viewApprovalDetail(_record: ApprovalRow) {
  // 预留详情弹窗
}

function approveItem(record: ApprovalRow) {
  record.approvalStatus = '已审批'
}

function batchApprove() {
  if (selectedApprovalKeys.value.length === 0) return
  approvalData.value.forEach(row => {
    if (selectedApprovalKeys.value.includes(row.id) && row.approvalStatus === '审核中') {
      row.approvalStatus = '已审批'
    }
  })
  selectedApprovalKeys.value = []
}
</script>

<style scoped lang="scss">
.todo-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: calc(100vh - 64px - 48px);
}

.panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.risk-panel {
  flex: 1;
  min-height: 0;
}

.approval-panel {
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
}

.risk-tabs {
  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
    padding: 0 16px;
  }
  :deep(.ant-tabs-content) {
    padding: 12px 16px;
  }
}

.filter-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.placeholder-info {
  text-align: center;
  padding: 60px 0;
  color: rgba(0, 0, 0, 0.45);
  font-size: 15px;
}

.type-tag {
  color: #1677ff;
  margin-right: 4px;
}

.fix-modal-body {
  .fix-problem {
    padding: 12px 16px;
    background: #fafafa;
    border-radius: 6px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 1.6;
  }
}

.detail-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.detail-img-item {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
}
</style>
