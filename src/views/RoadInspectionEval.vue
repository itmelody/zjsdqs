<template>
  <div class="eval-page">
    <div class="card">
      <div class="page-header"><h3>道路检测评价</h3></div>

      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">检测名称</span>
          <a-input v-model:value="filters.name" placeholder="请输入检测名称" allow-clear style="width: 180px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">所属区域</span>
          <a-select v-model:value="filters.area" placeholder="请选择所属区域" allow-clear style="width: 180px">
            <a-select-option value="杭州市市辖区">杭州市市辖区</a-select-option>
            <a-select-option value="宁波市市辖区">宁波市市辖区</a-select-option>
            <a-select-option value="温州市市辖区">温州市市辖区</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">道路名称</span>
          <a-input v-model:value="filters.roadName" placeholder="请输入道路名称" allow-clear style="width: 180px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">检测类型</span>
          <a-select v-model:value="filters.type" placeholder="请选择检测类型" allow-clear style="width: 160px">
            <a-select-option value="常规检测">常规检测</a-select-option>
            <a-select-option value="结构检测">结构检测</a-select-option>
            <a-select-option value="特殊检测">特殊检测</a-select-option>
          </a-select>
        </div>
        <div class="filter-actions">
          <a-button @click="handleReset">重置</a-button>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </div>
      </div>

      <!-- 操作栏 -->
      <div class="table-toolbar">
        <a-button type="primary" @click="handleAdd">+ 新增检测评价</a-button>
      </div>

      <!-- 数据表格（含展开行） -->
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }"
        size="small"
        row-key="id"
        class="eval-table"
        :expandable="{ expandedRowRender: (record: any) => renderSubTable(record) }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'roadNames'">
            <a style="color: #1890ff; cursor: pointer" @click="handleRoadNamesClick(record)">{{ record.roadNames.length }}</a>
          </template>
          <template v-else-if="column.key === 'type'">
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

        <!-- 展开行：二级列表 -->
        <template #expandedRowRender="{ record }">
          <div class="sub-table-wrapper">
            <a-table
              :columns="subColumns"
              :data-source="record.subList"
              :pagination="false"
              size="small"
              row-key="subId"
              class="sub-table"
            >
              <template #bodyCell="{ column: subCol, record: subRow }">
                <template v-if="subCol.key === 'grade'">
                  <span :class="subRow.grade === 'A' ? 'grade-a' : subRow.grade === 'B' ? 'grade-b' : subRow.grade === 'C' ? 'grade-c' : 'grade-d'">{{ subRow.grade }}</span>
                </template>
              </template>
            </a-table>
          </div>
        </template>
      </a-table>
    </div>

    <!-- 新增道路检测评价弹窗 -->
    <a-modal v-model:open="addModalVisible" :title="modalMode === 'view' ? '查看道路检测评价' : (modalMode === 'edit' ? '编辑道路检测评价' : '新增道路检测评价')" :footer="null" :width="formSaved ? '1000px' : '800px'" class="add-modal">
      <div class="add-form">
        <div class="form-grid">
          <!-- 左列 -->
          <div class="form-col">
            <div class="form-field">
              <label><span class="required">*</span> 检测名称：</label>
              <a-input v-model:value="addForm.name" placeholder="请输入检测名称" :disabled="formSaved || isViewMode" />
            </div>
            <div class="form-field">
              <label><span class="required">*</span> 检测周期：</label>
              <div class="cycle-input-group">
                <a-input v-model:value="addForm.cycleValue" placeholder="请输入" style="width: 50%" :disabled="formSaved || isViewMode" />
                <a-select v-model:value="addForm.cycleUnit" placeholder="请选择检..." style="width: 45%" :disabled="formSaved || isViewMode">
                  <a-select-option value="年">年</a-select-option>
                  <a-select-option value="月">月</a-select-option>
                  <a-select-option value="日">日</a-select-option>
                </a-select>
              </div>
            </div>
            <div class="form-field">
              <label><span class="required">*</span> 检测类型：</label>
              <a-select v-model:value="addForm.type" placeholder="请选择检测类型" style="width: 100%" :disabled="formSaved || isViewMode">
                <a-select-option value="常规检测">常规检测</a-select-option>
                <a-select-option value="结构检测">结构检测</a-select-option>
                <a-select-option value="特殊检测">特殊检测</a-select-option>
              </a-select>
            </div>
            <div class="form-field">
              <label><span class="required">*</span> 定期检测报告：</label>
              <a-upload :file-list="addForm.files" :before-upload="beforeUpload" @remove="handleRemoveFile">
                <a-button :disabled="formSaved || isViewMode"><UploadOutlined /> 文件上传</a-button>
              </a-upload>
            </div>
          </div>
          <!-- 右列 -->
          <div class="form-col">
            <div class="form-field road-field">
              <label><span class="required">*</span> 道路名称：</label>
              <div class="road-name-area">
                <a-button type="primary" size="small" @click="handleSelectRoad" :disabled="formSaved || isViewMode">选择道路</a-button>
                <div v-if="selectedRoadRecords.length > 0" class="road-tags">
                  <a-tag v-for="(road, idx) in selectedRoadRecords" :key="idx" :closable="!formSaved && !isViewMode" @close="handleRemoveRoad(idx)">{{ road.roadName }}</a-tag>
                </div>
              </div>
            </div>
            <div class="form-field">
              <label><span class="required">*</span> 检测时间：</label>
              <a-date-picker v-model:value="addForm.date" placeholder="请选择检测时间" style="width: 100%" :disabled="formSaved || isViewMode" />
            </div>
            <div class="form-field">
              <label><span class="required">*</span> 检测单位：</label>
              <a-select v-model:value="addForm.unit" placeholder="点击选择" style="width: 100%" :disabled="formSaved || isViewMode">
                <a-select-option value="测试单位">测试单位</a-select-option>
                <a-select-option value="越城区公用事业集团">越城区公用事业集团</a-select-option>
              </a-select>
            </div>
            <div class="form-field">
              <label><span class="required">*</span> 负责人：</label>
              <a-select v-model:value="addForm.person" placeholder="点击选择" style="width: 100%" :disabled="formSaved || isViewMode">
                <a-select-option value="王雨晴">王雨晴</a-select-option>
                <a-select-option value="张琦峰">张琦峰</a-select-option>
                <a-select-option value="李明">李明</a-select-option>
              </a-select>
            </div>
          </div>
        </div>

        <!-- 保存后显示编辑检测评价 -->
        <div v-if="formSaved" class="saved-section">
          <h4 class="section-title">编辑检测评价</h4>
          <!-- 查看模式下显示筛选项 -->
          <div v-if="isViewMode" class="view-filter-bar">
            <div class="filter-item">
              <span class="filter-label">道路名称：</span>
              <a-input v-model:value="viewFilterRoadName" placeholder="请输入道路名称" allow-clear size="small" style="width: 200px" />
            </div>
            <div class="filter-item">
              <span class="filter-label">道路综合评价等级：</span>
              <a-select v-model:value="viewFilterGrade" placeholder="请选择" allow-clear size="small" style="width: 120px">
                <a-select-option value="A">A</a-select-option>
                <a-select-option value="B">B</a-select-option>
                <a-select-option value="C">C</a-select-option>
                <a-select-option value="D">D</a-select-option>
              </a-select>
            </div>
          </div>
          <a-table
            :columns="savedRoadColumns"
            :data-source="filteredSavedRoadList"
            :pagination="false"
            size="small"
            row-key="subId"
            class="saved-table"
            :expandable="{ expandedRowRender: (record: any) => renderEvalIndicators(record.subId) }"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'pqi'">
                <a-input v-model:value="record.pqi" placeholder="请输入PQI" size="small" :disabled="isViewMode || (currentEditId !== null && newRecordIds.has(currentEditId))" />
              </template>
              <template v-else-if="column.key === 'grade'">
                <a-select v-model:value="record.grade" placeholder="请选择等级" size="small" :disabled="isViewMode || (currentEditId !== null && newRecordIds.has(currentEditId))">
                  <a-select-option value="A">A</a-select-option><a-select-option value="B">B</a-select-option><a-select-option value="C">C</a-select-option><a-select-option value="D">D</a-select-option>
                </a-select>
              </template>
            </template>
            <!-- 展开行：六大评价指标 -->
            <template #expandedRowRender="{ record }">
              <div class="eval-expand-content">
                <!-- 第一类 PCI -->
                <div class="eval-category">
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label><span class="required">*</span> 路面状况指数PCI：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].pci" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                    <div class="eval-field-row">
                      <label><span class="required">*</span> PCI评级：</label>
                      <a-select v-model:value="roadEvalMap[record.subId].pciGrade" placeholder="请选择" size="small" :disabled="isViewMode">
                        <a-select-option value="A">A</a-select-option><a-select-option value="B">B</a-select-option><a-select-option value="C">C</a-select-option><a-select-option value="D">D</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="eval-field-row">
                    <label><span class="required">*</span> 结论：</label>
                    <a-textarea v-model:value="roadEvalMap[record.subId].pciConclusion" placeholder="请输入路面状况结论" :rows="2" size="small" :disabled="isViewMode" />
                  </div>
                </div>
                <!-- 第二类 IRI -->
                <div class="eval-category">
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label><span class="required">*</span> 国际平整度指数IRI：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].iri" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                    <div class="eval-field-row">
                      <label><span class="required">*</span> 路面行驶质量指数RQI：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].rqi" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                  </div>
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label><span class="required">*</span> RQI评级：</label>
                      <a-select v-model:value="roadEvalMap[record.subId].rqiGrade" placeholder="请选择" size="small" :disabled="isViewMode">
                        <a-select-option value="A">A</a-select-option><a-select-option value="B">B</a-select-option><a-select-option value="C">C</a-select-option><a-select-option value="D">D</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="eval-field-row">
                    <label><span class="required">*</span> 结论：</label>
                    <a-textarea v-model:value="roadEvalMap[record.subId].rqiConclusion" placeholder="请输入平整度结论" :rows="2" size="small" :disabled="isViewMode" />
                  </div>
                </div>
                <!-- 第三类 结构强度 -->
                <div class="eval-category">
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label><span class="required">*</span> 结构强度弯沉值：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].structValue" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                    <div class="eval-field-row">
                      <label><span class="required">*</span> 结构强度等级：</label>
                      <a-select v-model:value="roadEvalMap[record.subId].structGrade" placeholder="请选择" size="small" :disabled="isViewMode">
                        <a-select-option value="足够">足够</a-select-option><a-select-option value="临界">临界</a-select-option><a-select-option value="不足">不足</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="eval-field-row">
                    <label><span class="required">*</span> 结论：</label>
                    <a-textarea v-model:value="roadEvalMap[record.subId].structConclusion" placeholder="请输入结构强度结论" :rows="2" size="small" :disabled="isViewMode" />
                  </div>
                </div>
                <!-- 第四类 抗滑能力 -->
                <div class="eval-category">
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label>抗滑能力：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].skid" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                    <div class="eval-field-row">
                      <label>抗滑能力等级：</label>
                      <a-select v-model:value="roadEvalMap[record.subId].skidGrade" placeholder="请选择" size="small" :disabled="isViewMode">
                        <a-select-option value="A">A</a-select-option><a-select-option value="B">B</a-select-option><a-select-option value="C">C</a-select-option><a-select-option value="D">D</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="eval-field-row">
                    <label>结论：</label>
                    <a-textarea v-model:value="roadEvalMap[record.subId].skidConclusion" placeholder="请输入抗滑能力结论" :rows="2" size="small" :disabled="isViewMode" />
                  </div>
                </div>
                <!-- 第五类 车辙深度 -->
                <div class="eval-category">
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label>车辙深度RDI：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].rutting" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                    <div class="eval-field-row">
                      <label>RDI等级：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].ruttingGrade" placeholder="自定义输入" size="small" :disabled="isViewMode" />
                    </div>
                  </div>
                  <div class="eval-field-row">
                    <label>结论：</label>
                    <a-textarea v-model:value="roadEvalMap[record.subId].ruttingConclusion" placeholder="请输入车辙深度结论" :rows="2" size="small" :disabled="isViewMode" />
                  </div>
                </div>
                <!-- 第六类 人行道状况 -->
                <div class="eval-category">
                  <div class="eval-pair-row">
                    <div class="eval-field-row">
                      <label>人行道状况FCI：</label>
                      <a-input v-model:value="roadEvalMap[record.subId].fci" placeholder="请输入" size="small" :disabled="isViewMode" />
                    </div>
                    <div class="eval-field-row">
                      <label>FCI等级：</label>
                      <a-select v-model:value="roadEvalMap[record.subId].fciGrade" placeholder="请选择" size="small" :disabled="isViewMode">
                        <a-select-option value="A">A</a-select-option><a-select-option value="B">B</a-select-option><a-select-option value="C">C</a-select-option><a-select-option value="D">D</a-select-option>
                      </a-select>
                    </div>
                  </div>
                  <div class="eval-field-row">
                    <label>结论：</label>
                    <a-textarea v-model:value="roadEvalMap[record.subId].fciConclusion" placeholder="请输入人行道状况结论" :rows="2" size="small" :disabled="isViewMode" />
                  </div>
                </div>
              </div>
            </template>
          </a-table>
        </div>
      </div>

      <div class="modal-footer">
        <template v-if="!formSaved">
          <a-button type="primary" @click="handleSaveAndEdit">保存并编辑</a-button>
          <a-button @click="handleResetForm">重置</a-button>
          <a-button @click="addModalVisible = false">关闭</a-button>
        </template>
        <template v-else-if="isViewMode">
          <a-button @click="addModalVisible = false">关闭</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="handleSubmit">提交</a-button>
          <a-button @click="handleResetSaved">重置</a-button>
          <a-button @click="handleCloseSaved">关闭</a-button>
        </template>
      </div>
    </a-modal>

    <!-- 查看道路名称弹窗 -->
    <a-modal v-model:open="roadNameViewModalVisible" title="道路名称" :footer="null" width="600px">
      <a-table :columns="roadNameViewColumns" :data-source="roadNameViewData" :pagination="false" size="small" row-key="idx" />
    </a-modal>

    <!-- 选择道路弹窗 -->
    <a-modal v-model:open="roadModalVisible" title="选择道路" :footer="null" width="90%" class="road-select-modal">
      <!-- 筛选区 -->
      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">归属地区：</span>
          <a-select v-model:value="roadFilters.area" placeholder="请选择归属地区" allow-clear style="width: 180px">
            <a-select-option value="杭州市余杭区">杭州市余杭区</a-select-option>
            <a-select-option value="丽水市缙云县">丽水市缙云县</a-select-option>
            <a-select-option value="宁波市镇海区">宁波市镇海区</a-select-option>
            <a-select-option value="杭州市拱墅区">杭州市拱墅区</a-select-option>
            <a-select-option value="嘉兴市嘉兴港区">嘉兴市嘉兴港区</a-select-option>
            <a-select-option value="绍兴市柯桥区">绍兴市柯桥区</a-select-option>
            <a-select-option value="湖州市南太湖新区">湖州市南太湖新区</a-select-option>
          </a-select>
        </div>
        <div class="filter-item">
          <span class="filter-label">道路名称：</span>
          <a-input v-model:value="roadFilters.roadName" placeholder="请输入道路名称" allow-clear style="width: 200px" />
        </div>
        <div class="filter-item">
          <span class="filter-label">道路等级：</span>
          <a-select v-model:value="roadFilters.roadLevel" placeholder="请选择" allow-clear style="width: 160px">
            <a-select-option value="主干道">主干道</a-select-option>
            <a-select-option value="次干道">次干道</a-select-option>
            <a-select-option value="支路">支路</a-select-option>
          </a-select>
        </div>
        <div class="filter-actions">
          <a-button @click="handleRoadReset">重置</a-button>
          <a-button type="primary" @click="handleRoadSearch">搜索</a-button>
          <a-button>展开 <DownOutlined /></a-button>
        </div>
      </div>

      <!-- 工具栏 -->
      <div class="table-toolbar-right">
        <ReloadOutlined style="margin-right: 12px; cursor: pointer" />
        <ColumnWidthOutlined style="margin-right: 12px; cursor: pointer" />
        <SettingOutlined style="cursor: pointer" />
      </div>

      <!-- 数据表格 -->
      <a-table
        :columns="roadColumns"
        :data-source="filteredRoadData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true, showQuickJumper: true }"
        size="small"
        row-key="id"
        :row-selection="{ selectedRowKeys: selectedRoadKeys, onChange: onRoadSelectChange }"
        class="road-table"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'grade'">
            <span>{{ record.grade || '-' }}</span>
          </template>
          <template v-else-if="column.key === 'dataComplete'">
            <span>{{ record.dataComplete ? '是' : '否' }}</span>
          </template>
          <template v-else-if="column.key === 'publishStatus'">
            <span>{{ record.publishStatus }}</span>
          </template>
          <template v-else-if="column.key === 'isOverdue'">
            <a-tag :color="record.isOverdue ? 'red' : 'default'">{{ record.isOverdue ? '已超期' : '未超期' }}</a-tag>
          </template>
        </template>
      </a-table>

      <!-- 底部按钮 -->
      <div class="road-modal-footer">
        <span class="selected-info">已选择 {{ selectedRoadKeys.length }} 条</span>
        <div class="footer-btns">
          <a-button type="primary" @click="handleRoadSubmit">提交</a-button>
          <a-button @click="roadModalVisible = false">关闭</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { UploadOutlined, DownOutlined, ReloadOutlined, ColumnWidthOutlined, SettingOutlined } from '@ant-design/icons-vue'

const filters = reactive({
  name: '',
  area: undefined as string | undefined,
  roadName: '',
  type: undefined as string | undefined,
})

function handleReset() {
  filters.name = ''
  filters.area = undefined
  filters.roadName = ''
  filters.type = undefined
}

function handleSearch() {}

// 主表列定义
const columns = [
  { title: '检测名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '道路名称', dataIndex: 'roadNames', key: 'roadNames', width: 200 },
  { title: '检测时间', dataIndex: 'date', key: 'date', width: 110 },
  { title: '检测周期', dataIndex: 'cycle', key: 'cycle', width: 110, align: 'center' as const },
  { title: '检测类型', dataIndex: 'type', key: 'type', width: 100, align: 'center' as const },
  { title: '检测单位', dataIndex: 'unit', key: 'unit', width: 160 },
  { title: '负责人', dataIndex: 'person', key: 'person', width: 80 },
  { title: '操作', key: 'action', width: 150, align: 'center' as const, fixed: 'right' as const },
]

// 二级列表列定义
const subColumns = [
  { title: '道路名称', dataIndex: 'roadName', key: 'roadName', width: 180 },
  { title: '所属区域', dataIndex: 'area', key: 'area', width: 150 },
  { title: '道路PQI', dataIndex: 'pqi', key: 'pqi', width: 140, align: 'center' as const },
  { title: '评价等级', dataIndex: 'grade', key: 'grade', width: 150, align: 'center' as const },
]

const tableData = ref([
  {
    id: 1,
    name: '测试0622',
    roadNames: ['测试道路A', '测试道路B', '测试道路C'],
    date: '2026-06-22',
    cycle: '1年',
    type: '常规检测',
    unit: '测试单位',
    person: '王雨晴',
    subList: [
      { subId: '1-1', roadName: '测试道路A', area: '杭州市市辖区', pqi: '85.6', grade: 'A' },
      { subId: '1-2', roadName: '测试道路B', area: '杭州市市辖区', pqi: '72.3', grade: 'B' },
      { subId: '1-3', roadName: '测试道路C', area: '杭州市市辖区', pqi: '45.8', grade: 'C' },
    ],
  },
  {
    id: 2,
    name: '测试001',
    roadNames: ['测试道路D'],
    date: '2026-06-18',
    cycle: '1年',
    type: '常规检测',
    unit: '测试单位',
    person: '王雨晴',
    subList: [
      { subId: '2-1', roadName: '测试道路D', area: '杭州市市辖区', pqi: '60.2', grade: 'B' },
    ],
  },
  {
    id: 3,
    name: '测试检测',
    roadNames: ['测试道路E', '测试道路F'],
    date: '2026-06-10',
    cycle: '1年',
    type: '常规检测',
    unit: '越城区公用事业集团',
    person: '张琦峰',
    subList: [
      { subId: '3-1', roadName: '测试道路E', area: '杭州市市辖区', pqi: '38.5', grade: 'D' },
      { subId: '3-2', roadName: '测试道路F', area: '杭州市市辖区', pqi: '55.0', grade: 'C' },
    ],
  },
])

const filteredData = computed(() => tableData.value.filter(row => {
  if (filters.name && !row.name.includes(filters.name)) return false
  if (filters.roadName && !row.roadNames.some(rn => rn.includes(filters.roadName))) return false
  if (filters.type && row.type !== filters.type) return false
  if (filters.area && !row.subList.some(s => s.area === filters.area)) return false
  return true
}))

function renderSubTable(record: any) {
  return h('div', { class: 'sub-table-wrapper' }, [
    h('span'), // placeholder to allow expandedRowRender slot
  ])
}

function handleAdd() {
  modalMode.value = 'add'
  currentEditId.value = null
  addModalVisible.value = true
}

const addModalVisible = ref(false)
const formSaved = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const isViewMode = computed(() => modalMode.value === 'view')
const newRecordIds = ref(new Set<number>())
const currentEditId = ref<number | null>(null)
const roadNameViewModalVisible = ref(false)
const roadNameViewData = ref<any[]>([])
const roadNameViewColumns = [
  { title: '序号', dataIndex: 'idx', key: 'idx', width: 60, align: 'center' as const },
  { title: '道路名称', dataIndex: 'roadName', key: 'roadName' },
  { title: '所属区域', dataIndex: 'area', key: 'area' },
]
const addForm = reactive({
  name: '',
  cycleValue: '',
  cycleUnit: undefined as string | undefined,
  type: undefined as string | undefined,
  files: [] as any[],
  roadName: undefined as string | undefined,
  date: undefined as any,
  unit: undefined as string | undefined,
  person: undefined as string | undefined,
})

function beforeUpload(file: File) {
  addForm.files.push({ uid: Date.now().toString(), name: file.name, status: 'done', originFileObj: file })
  return false
}

function handleRemoveFile(file: any) {
  addForm.files = addForm.files.filter(f => f.uid !== file.uid)
}

function handleResetForm() {
  addForm.name = ''
  addForm.cycleValue = ''
  addForm.cycleUnit = undefined
  addForm.unit = undefined
  addForm.type = undefined
  addForm.files = []
  addForm.roadName = ''
  selectedRoadRecords.value = []
  addForm.date = undefined
  addForm.person = undefined
  formSaved.value = false
  modalMode.value = 'add'
  currentEditId.value = null
  viewFilterRoadName.value = ''
  viewFilterGrade.value = undefined
  savedRoadList.value = []
  evalIndicatorData.value = []
  Object.keys(roadEvalMap).forEach(k => delete roadEvalMap[k])
  resetEvalData()
}

function handleSelectRoad() {
  // Pre-select previously chosen roads
  selectedRoadKeys.value = selectedRoadRecords.value.map(r => r.id)
  roadModalVisible.value = true
}

// 选择道路弹窗相关
const roadModalVisible = ref(false)
const roadFilters = reactive({
  area: undefined as string | undefined,
  roadName: '',
  roadLevel: undefined as string | undefined,
})
const selectedRoadKeys = ref<string[]>([])
const selectedRoadRecords = ref<any[]>([])

const roadColumns = [
  { title: '归属地区', dataIndex: 'area', key: 'area', width: 120 },
  { title: '道路名称', dataIndex: 'roadName', key: 'roadName', width: 280 },
  { title: '道路等级', dataIndex: 'roadLevel', key: 'roadLevel', width: 100, align: 'center' as const },
  { title: '综合评价等级', dataIndex: 'grade', key: 'grade', width: 120, align: 'center' as const },
  { title: '检测时间', dataIndex: 'detectDate', key: 'detectDate', width: 110 },
  { title: '数据是否完善', dataIndex: 'dataComplete', key: 'dataComplete', width: 120, align: 'center' as const },
  { title: '发布状态', dataIndex: 'publishStatus', key: 'publishStatus', width: 100, align: 'center' as const },
  { title: '检测是否超期', dataIndex: 'isOverdue', key: 'isOverdue', width: 120, align: 'center' as const },
]

const roadTableData = ref([
  { id: 'r1', area: '杭州市余杭区', roadName: '测试道路-01', roadLevel: '次干道', grade: 'B', detectDate: '2026-06-22', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r2', area: '丽水市缙云县', roadName: '缙云县大桥北路三里灯具市场段道路拓宽改造工程', roadLevel: '主干道', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r3', area: '宁波市镇海区', roadName: '骆驼街道马家桥及三五路（马家桥至南一路段）改造工程', roadLevel: '支路', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r4', area: '杭州市拱墅区', roadName: '运河新城一号支路（金昌路-谢村路）', roadLevel: '支路', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r5', area: '嘉兴市嘉兴港区', roadName: '嘉兴电厂一号进场路改造提升工程', roadLevel: '支路', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r6', area: '绍兴市柯桥区', roadName: '创意路及怡华北路段整治提升工程', roadLevel: '主干道', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r7', area: '绍兴市柯桥区', roadName: '万绣路改造提升工程（104国道至群贤路）', roadLevel: '主干道', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r8', area: '绍兴市柯桥区', roadName: '瓜渚路改造提升工程（临杭大道至镇东路）', roadLevel: '主干道', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r9', area: '湖州市南太湖新区', roadName: '宿渎港路', roadLevel: '主干道', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
  { id: 'r10', area: '湖州市南太湖新区', roadName: '大船湾路', roadLevel: '主干道', grade: '', detectDate: '', dataComplete: false, publishStatus: '草稿', isOverdue: false },
])

const filteredRoadData = computed(() => roadTableData.value.filter(row => {
  if (roadFilters.area && row.area !== roadFilters.area) return false
  if (roadFilters.roadName && !row.roadName.includes(roadFilters.roadName)) return false
  if (roadFilters.roadLevel && row.roadLevel !== roadFilters.roadLevel) return false
  return true
}))

function onRoadSelectChange(keys: string[], rows: any[]) {
  selectedRoadKeys.value = keys
  selectedRoadRecords.value = rows
}

function handleRoadReset() {
  roadFilters.area = undefined
  roadFilters.roadName = ''
  roadFilters.roadLevel = undefined
}

function handleRoadSearch() {}

function handleRoadSubmit() {
  if (selectedRoadKeys.value.length === 0) {
    message.warning('请选择道路')
    return
  }
  addForm.roadName = selectedRoadRecords.value.map((r: any) => r.roadName).join('、')
  roadModalVisible.value = false
}

function handleRemoveRoad(idx: number) {
  selectedRoadRecords.value.splice(idx, 1)
  addForm.roadName = selectedRoadRecords.value.map((r: any) => r.roadName).join('、')
}

function handleSaveAndEdit() {
  if (!addForm.name) { message.warning('请输入检测名称'); return }
  if (!addForm.cycleValue || !addForm.cycleUnit) { message.warning('请填写检测周期'); return }
  if (!addForm.type) { message.warning('请选择检测类型'); return }
  if (!addForm.roadName) { message.warning('请选择道路名称'); return }
  if (!addForm.date) { message.warning('请选择检测时间'); return }
  if (!addForm.unit) { message.warning('请选择检测单位'); return }
  if (!addForm.person) { message.warning('请选择负责人'); return }

  savedRoadList.value = selectedRoadRecords.value.map((r: any, i: number) => ({
    subId: `${i + 1}`,
    roadName: r.roadName,
    area: r.area || '杭州市市辖区',
    pqi: '',
    grade: r.grade || '',
  }))

  evalIndicatorData.value = [
    { indicator: '路面状况指数 PCI', subLabel: 'PCI评级', conclusion: '' },
    { indicator: '国际平整度指数 IRI', subLabel: 'RQI等级', conclusion: '' },
    { indicator: '结构强度等级', subLabel: '', conclusion: '' },
    { indicator: '抗滑能力等级', subLabel: '', conclusion: '' },
    { indicator: '车辙深度 RDI', subLabel: 'RDI等级', conclusion: '' },
    { indicator: '人行道状况 FCI', subLabel: 'FCI等级', conclusion: '' },
  ]
  resetEvalData()
  formSaved.value = true
  initRoadEvalMap()
}

const savedRoadList = ref<any[]>([])

// 查看模式筛选项
const viewFilterRoadName = ref('')
const viewFilterGrade = ref<string | undefined>(undefined)
const filteredSavedRoadList = computed(() => {
  return savedRoadList.value.filter((road: any) => {
    if (viewFilterRoadName.value && !road.roadName.includes(viewFilterRoadName.value)) return false
    if (viewFilterGrade.value && road.grade !== viewFilterGrade.value) return false
    return true
  })
})

// Per-road evaluation data map
const roadEvalMap = reactive<Record<string, any>>({})

function initRoadEvalMap() {
  const map: Record<string, any> = {}
  savedRoadList.value.forEach(road => {
    map[road.subId] = {
      pci: '', pciGrade: undefined, pciConclusion: '',
      iri: '', rqi: '', rqiGrade: undefined, rqiConclusion: '',
      structValue: '', structGrade: undefined, structConclusion: '',
      skid: '', skidGrade: undefined, skidConclusion: '',
      rutting: '', ruttingGrade: undefined, ruttingConclusion: '',
      fci: '', fciGrade: undefined, fciConclusion: '',
    }
  })
  Object.keys(roadEvalMap).forEach(k => delete roadEvalMap[k])
  Object.assign(roadEvalMap, map)
}

function renderEvalIndicators(_subId: string) {
  return null // using expandedRowRender slot instead
}

const savedRoadColumns = [
  { title: '序号', dataIndex: 'subId', key: 'subId', width: 60, align: 'center' as const },
  { title: '道路名称', dataIndex: 'roadName', key: 'roadName', width: 200 },
  { title: '所属区域', dataIndex: 'area', key: 'area', width: 150 },
  { title: '道路PQI *', dataIndex: 'pqi', key: 'pqi', width: 120, align: 'center' as const },
  { title: '道路综合评价等级 *', dataIndex: 'grade', key: 'grade', width: 180, align: 'center' as const },
]

const evalIndicatorColumns = [
  { title: '评价指标', dataIndex: 'indicator', key: 'indicator', width: 200 },
  { title: '等级', dataIndex: 'subLabel', key: 'subLabel', width: 150 },
  { title: '结论', dataIndex: 'conclusion', key: 'conclusion', width: 200 },
]

const evalIndicatorData = ref<any[]>([])

const evalData = reactive({
  pci: '', pciGrade: undefined as string | undefined, pciConclusion: '',
  iri: '', rqi: '', rqiGrade: undefined as string | undefined, rqiConclusion: '',
  structValue: '', structGrade: undefined as string | undefined, structConclusion: '',
  skid: '', skidGrade: undefined as string | undefined, skidConclusion: '',
  rutting: '', ruttingGrade: undefined as string | undefined, ruttingConclusion: '',
  fci: '', fciGrade: undefined as string | undefined, fciConclusion: '',
})

function resetEvalData() {
  Object.keys(evalData).forEach(key => {
    (evalData as any)[key] = ''
  })
}

function handleRoadNamesClick(record: any) {
  roadNameViewData.value = record.subList.map((s: any, i: number) => ({ idx: i + 1, roadName: s.roadName, area: s.area }))
  roadNameViewModalVisible.value = true
}

function handleSubmit() {
  // 校验每条道路的PQI和综合评价等级是否已填写
  const emptyRoads: string[] = []
  savedRoadList.value.forEach((r: any) => {
    const evalData = roadEvalMap[r.subId]
    const pqi = evalData?.pqi || r.pqi
    const grade = evalData?.grade || r.grade
    if (!pqi || !pqi.trim() || !grade) {
      emptyRoads.push(r.roadName)
    }
  })
  if (emptyRoads.length > 0) {
    message.warning(`以下道路未填写PQI或综合评价等级：${emptyRoads.join('、')}`)
    return
  }
  const now = new Date()
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  if (modalMode.value === 'edit' && currentEditId.value !== null) {
    const idx = tableData.value.findIndex(r => r.id === currentEditId.value)
    if (idx !== -1) {
      tableData.value[idx] = {
        ...tableData.value[idx],
        name: addForm.name,
        date: timeStr,
        subList: savedRoadList.value.map((r: any, i: number) => ({
          subId: r.subId, roadName: r.roadName, area: r.area,
          pqi: roadEvalMap[r.subId]?.pqi || r.pqi || '-',
          grade: roadEvalMap[r.subId]?.grade || r.grade || '-',
        })),
      }
    }
    message.success('保存成功')
    addModalVisible.value = false
    handleResetForm()
    return
  }
  const maxId = tableData.value.reduce((max, r) => Math.max(max, r.id), 0)
  const newId = maxId + 1
  const newRecord = {
    id: newId,
    name: addForm.name,
    roadNames: selectedRoadRecords.value.map((r: any) => r.roadName),
    date: timeStr,
    cycle: `${addForm.cycleValue}${addForm.cycleUnit}`,
    type: addForm.type!,
    unit: addForm.unit!,
    person: addForm.person!,
    subList: savedRoadList.value.map((r: any, i: number) => ({
      subId: `${newId}-${i + 1}`,
      roadName: r.roadName,
      area: r.area,
      pqi: roadEvalMap[r.subId]?.pqi || r.pqi || '-',
      grade: roadEvalMap[r.subId]?.grade || r.grade || '-',
    })),
  }
  tableData.value.unshift(newRecord)
  newRecordIds.value.add(newId)
  message.success('提交成功')
  addModalVisible.value = false
  handleResetForm()
  formSaved.value = false
}

function handleResetSaved() {
  resetEvalData()
}

function handleCloseSaved() {
  formSaved.value = false
  addModalVisible.value = false
  handleResetForm()
}

function handleView(record: any) {
  modalMode.value = 'view'
  currentEditId.value = record.id
  viewFilterRoadName.value = ''
  viewFilterGrade.value = undefined
  // Populate form with record data
  addForm.name = record.name
  const cycleMatch = record.cycle.match(/^(\d+)(.*)$/)
  if (cycleMatch) { addForm.cycleValue = cycleMatch[1]; addForm.cycleUnit = cycleMatch[2] }
  addForm.type = record.type
  addForm.unit = record.unit
  addForm.person = record.person
  addForm.date = undefined
  selectedRoadRecords.value = record.subList.map((s: any, i: number) => ({ id: `v-${i}`, roadName: s.roadName, area: s.area }))
  savedRoadList.value = record.subList.map((s: any) => ({ subId: s.subId, roadName: s.roadName, area: s.area, pqi: s.pqi, grade: s.grade }))
  const evalMap: Record<string, any> = {}
  record.subList.forEach((s: any) => {
    evalMap[s.subId] = { pci: '', pciGrade: undefined, pciConclusion: '', iri: '', rqi: '', rqiGrade: undefined, rqiConclusion: '', structValue: '', structGrade: undefined, structConclusion: '', skid: '', skidGrade: undefined, skidConclusion: '', rutting: '', ruttingGrade: undefined, ruttingConclusion: '', fci: '', fciGrade: undefined, fciConclusion: '', pqi: s.pqi, grade: s.grade }
  })
  Object.keys(roadEvalMap).forEach(k => delete roadEvalMap[k])
  Object.assign(roadEvalMap, evalMap)
  formSaved.value = true
  addModalVisible.value = true
}

function handleEdit(record: any) {
  modalMode.value = 'edit'
  currentEditId.value = record.id
  addForm.name = record.name
  const cycleMatch = record.cycle.match(/^(\d+)(.*)$/)
  if (cycleMatch) { addForm.cycleValue = cycleMatch[1]; addForm.cycleUnit = cycleMatch[2] }
  addForm.type = record.type
  addForm.unit = record.unit
  addForm.person = record.person
  addForm.date = undefined
  selectedRoadRecords.value = record.subList.map((s: any, i: number) => ({ id: `e-${i}`, roadName: s.roadName, area: s.area }))
  savedRoadList.value = record.subList.map((s: any) => ({ subId: s.subId, roadName: s.roadName, area: s.area, pqi: s.pqi, grade: s.grade }))
  const evalMap: Record<string, any> = {}
  record.subList.forEach((s: any) => {
    evalMap[s.subId] = { pci: '', pciGrade: undefined, pciConclusion: '', iri: '', rqi: '', rqiGrade: undefined, rqiConclusion: '', structValue: '', structGrade: undefined, structConclusion: '', skid: '', skidGrade: undefined, skidConclusion: '', rutting: '', ruttingGrade: undefined, ruttingConclusion: '', fci: '', fciGrade: undefined, fciConclusion: '', pqi: s.pqi, grade: s.grade }
  })
  Object.keys(roadEvalMap).forEach(k => delete roadEvalMap[k])
  Object.assign(roadEvalMap, evalMap)
  formSaved.value = true
  addModalVisible.value = true
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

.table-toolbar {
  margin-bottom: 12px;
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
  :deep(.ant-table-row-expand-icon) { font-size: 11px; }
}

.sub-table-wrapper {
  padding: 8px 16px;
  background: #fafbfc;
  border-radius: 6px;
  margin: 4px 0;
}

.sub-table {
  :deep(.ant-table) { font-size: 12px; }
  :deep(.ant-table-thead > tr > th) { padding: 8px; font-size: 12px; background: #f0f2f5; }
  :deep(.ant-table-tbody > tr > td) { padding: 8px; }
}

.grade-a { color: #52c41a; font-weight: 600; }
.grade-b { color: #1890ff; font-weight: 500; }
.grade-c { color: #faad14; font-weight: 500; }
.grade-d { color: #ff4d4f; font-weight: 500; }

.add-modal {
  :deep(.ant-modal-body) { padding: 24px 32px; }
}

.add-form {
  .form-grid {
    display: flex;
    gap: 40px;
  }

  .form-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-field {
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      font-size: 13px;
      color: #333;
      white-space: nowrap;
      min-width: 100px;
      text-align: right;

      .required {
        color: #ff4d4f;
        margin-right: 2px;
      }
    }

    .cycle-input-group {
      display: flex;
      gap: 8px;
      flex: 1;
    }

    .road-name-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .selected-road-text {
        font-size: 13px;
        color: #1890ff;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    &.road-field {
      align-items: flex-start;

      label {
        margin-top: 5px;
      }
    }

    .road-name-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .road-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
    }

    :deep(.ant-input),
    :deep(.ant-select),
    :deep(.ant-picker) {
      flex: 1;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.saved-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;

  .view-filter-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
    padding: 8px 12px;
    background: #fafbfc;
    border-radius: 6px;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .filter-label {
      font-size: 13px;
      color: #333;
      white-space: nowrap;
    }
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin: 0 0 12px 0;
  }

  .saved-table {
    :deep(.ant-table) { font-size: 13px; }
    :deep(.ant-table-thead > tr > th) { padding: 8px; font-size: 13px; font-weight: 500; background: #fafafa; }
    :deep(.ant-table-tbody > tr > td) { padding: 8px; }
  }

  .eval-indicators-grid {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 32px;
  }

  .eval-indicator-row {
    display: flex;
    align-items: center;
    gap: 12px;

    .eval-label {
      font-size: 13px;
      color: #333;
      white-space: nowrap;
      min-width: 160px;
      text-align: right;
    }

    .eval-input {
      flex: 1;
    }
  }

  .eval-category {
    margin-top: 16px;
    padding: 12px 16px;
    background: #fafbfc;
    border-radius: 6px;
    border: 1px solid #f0f0f0;
    &:first-child { margin-top: 8px; }
  }

  .eval-expand-content {
    padding: 8px 0;
  }

  .eval-pair-row {
    display: flex;
    gap: 16px;
    margin-bottom: 10px;

    .eval-field-row {
      flex: 1;
      margin-bottom: 0;
      // 单个字段时限制宽度，避免拉伸过长
      &:only-child {
        max-width: calc(50% - 8px);
      }
    }
  }

  .eval-field-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
    &:last-child { margin-bottom: 0; }

    label {
      font-size: 13px;
      color: #333;
      white-space: nowrap;
      min-width: 160px;
      text-align: right;
      line-height: 32px;

      .required {
        color: #ff4d4f;
        margin-right: 2px;
      }
    }

    :deep(.ant-input),
    :deep(.ant-select),
    :deep(.ant-input-affix-wrapper) {
      flex: 1;
    }

    :deep(textarea.ant-input) {
      resize: none;
    }
  }
}

.road-select-modal {
  :deep(.ant-modal-body) { padding: 16px 24px; }

  .filter-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;
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

  .table-toolbar-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666;
  }

  .road-table {
    :deep(.ant-table) { font-size: 13px; }
    :deep(.ant-table-thead > tr > th) { padding: 10px 8px; font-size: 13px; font-weight: 500; background: #fafafa; }
    :deep(.ant-table-tbody > tr > td) { padding: 10px 8px; }
  }

  .road-modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;

    .selected-info {
      font-size: 13px;
      color: #666;
    }

    .footer-btns {
      display: flex;
      gap: 8px;
    }
  }
}
</style>
