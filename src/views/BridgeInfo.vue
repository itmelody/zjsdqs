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
        <!-- 基础筛选（始终显示） -->
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
            <a-select-opt-group label="城市道路桥梁">
              <a-select-option
                v-for="item in bridgeTypeOptions.filter(i => i.group === '城市道路桥梁')"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select-opt-group>
            <a-select-opt-group label="人行天桥">
              <a-select-option
                v-for="item in bridgeTypeOptions.filter(i => i.group === '人行天桥')"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button @click="handleReset" style="margin-right: 8px">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary" @click="handleSearch" style="margin-right: 8px">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button type="link" @click="searchExpanded = !searchExpanded">
            {{ searchExpanded ? '收起' : '展开' }}
            <DownOutlined :class="{ 'search-toggle-icon': true, 'search-toggle-icon-up': searchExpanded }" />
          </a-button>
        </a-form-item>
      </a-form>
      <!-- 展开筛选 -->
      <a-form
        v-if="searchExpanded"
        :model="searchForm"
        layout="inline"
        style="margin-top: 16px"
      >
        <a-form-item label="城市道路桥梁分类">
          <a-select
            v-model:value="searchForm.cityClassification"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in bridgeClassificationOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="综合评价等级">
          <a-select
            v-model:value="searchForm.evalLevel"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in evalLevelOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否涉航桥梁">
          <a-select
            v-model:value="searchForm.isNavigationBridge"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in isNavigationBridgeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select
            v-model:value="searchForm.status"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="数据是否完善">
          <a-select
            v-model:value="searchForm.dataComplete"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in dataCompleteOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="发布状态">
          <a-select
            v-model:value="searchForm.publishStatus"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in publishStatusOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="检测是否超期">
          <a-select
            v-model:value="searchForm.isOverdue"
            placeholder="请选择"
            style="width: 200px"
            allow-clear
          >
            <a-select-option
              v-for="item in isOverdueOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
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
        <a-button @click="handleBatchImport">
          <template #icon><UploadOutlined /></template>
          批量导入
        </a-button>
        <a-button @click="handleTemplateDownload">
          <template #icon><DownloadOutlined /></template>
          模版下载
        </a-button>
        <a-button danger @click="handleBatchDelete" :disabled="selectedRowKeys.length === 0">
          <template #icon><DeleteOutlined /></template>
          批量删除
        </a-button>
        <a-button @click="handleBatchFill" :disabled="selectedRowKeys.length === 0">
          <template #icon><EditOutlined /></template>
          批量填写
        </a-button>
        <a-button @click="handleBridgeMap">
          <template #icon><EnvironmentOutlined /></template>
          桥梁地图
        </a-button>
        <span class="stat-tag">
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
        <!-- 桥梁类型 -->
        <template v-if="column.key === 'type'">
          <a-tag :color="getBridgeTypeColor(record.type)">{{ record.type }}</a-tag>
        </template>

        <!-- 城市道路桥梁分类 -->
        <template v-else-if="column.key === 'cityClassification'">
          {{ record.cityClassification || '—' }}
        </template>

        <!-- 是否涉航桥梁 -->
        <template v-if="column.key === 'isNavigationBridge'">
          <a-tag :color="record.isNavigationBridge ? 'blue' : 'default'">
            {{ record.isNavigationBridge ? '是' : '否' }}
          </a-tag>
        </template>

        <!-- 数据是否完善 -->
        <template v-else-if="column.key === 'dataComplete'">
          <a-tag :color="record.dataComplete ? 'success' : 'error'">
            {{ record.dataComplete ? '是' : '否' }}
          </a-tag>
        </template>

        <!-- 检测是否超期 -->
        <template v-else-if="column.key === 'isOverdue'">
          <a-tag :color="record.isOverdue === '已超期' ? 'error' : 'success'">
            {{ record.isOverdue }}
          </a-tag>
        </template>

        <!-- 发布状态 -->
        <template v-else-if="column.key === 'publishStatus'">
          <a-tag :color="record.publishStatus === '已发布' ? 'success' : 'default'">
            {{ record.publishStatus }}
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
        :show-total="((total: number) => `共${total}条`) as any"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
      />
    </div>

    <!-- 桥梁表单弹窗（新增/查看/编辑共用） -->
    <a-modal
      v-model:open="addVisible"
      :footer="null"
      width="1100px"
      :body-style="{ padding: '0' }"
      class="add-bridge-modal"
    >
      <template #title>
        <div class="add-modal-header">
          <span class="add-modal-title">{{ formTitle }}</span>
          <a-button v-if="formMode !== 'view' && !isOverpass" type="primary" class="add-sub-card-btn" @click="addSubCard">
            <template #icon><PlusOutlined /></template>
            新增子桥资料卡
          </a-button>
        </div>
      </template>
      <div class="add-bridge-content">
        <a-tabs v-model:activeKey="addActiveTab">
          <!-- 基础信息 Tab -->
          <a-tab-pane key="basic" tab="基础信息">
            <div class="add-bridge-form">
              <a-form :model="addForm" layout="horizontal" :label-col="{ style: { width: '100px' } }">
                <!-- 基础信息区域 -->
                <div class="form-section">
                  <div class="form-section-title">基础信息</div>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="桥梁名称" required>
                        <a-input v-model:value="addForm.name" placeholder="请输入桥梁名称" :disabled="isView" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="桥梁类型" required>
                        <a-select v-model:value="addForm.type" placeholder="请选择" :disabled="isView">
                          <a-select-opt-group label="城市道路桥梁">
                            <a-select-option
                              v-for="item in bridgeTypeOptions.filter(i => i.group === '城市道路桥梁')"
                              :key="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select-opt-group>
                          <a-select-opt-group label="人行天桥">
                            <a-select-option
                              v-for="item in bridgeTypeOptions.filter(i => i.group === '人行天桥')"
                              :key="item.value"
                              :value="item.value"
                            >
                              {{ item.label }}
                            </a-select-option>
                          </a-select-opt-group>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="结构类型" required>
                        <a-input v-model:value="addForm.structureType" placeholder="请选择" disabled style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="归属地区" required>
                        <a-select v-model:value="addForm.region" placeholder="请选择区县" :disabled="isView">
                          <a-select-option
                            v-for="item in regionOptions"
                            :key="item.value"
                            :value="item.value"
                          >
                            {{ item.label }}
                          </a-select-option>
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
                  <a-row :gutter="8" align="middle">
                    <a-col :span="18">
                      <a-form-item label="桥梁位置" required>
                        <a-input v-model:value="addForm.location" placeholder="请输入桥梁位置" :disabled="isView" style="background: #f5f5f5" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item class="location-btn-item" :colon="false" label=" ">
                        <a-button type="primary" size="small" class="location-btn">选择点位位置</a-button>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>

                <!-- 三级责任体系 -->
                <div class="form-section">
                  <div class="form-section-title">三级责任体系</div>
<!-- 行业主管单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">行业主管单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.industryUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.industryPerson" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.industryContact" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 设施管理单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">设施管理单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.facilityUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.facilityPerson" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="联系方式" required>
                          <a-input v-model:value="addForm.facilityContact" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 设施养护单位 -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">设施养护单位</div>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="单位名称" required>
                          <a-input v-model:value="addForm.maintainUnit" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                    <a-row :gutter="24">
                      <a-col :span="12">
                        <a-form-item label="责任人" required>
                          <a-input v-model:value="addForm.maintainPerson" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="责任人联系方式" required>
                          <a-input v-model:value="addForm.maintainContact" placeholder="点击选择" :disabled="isView" />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </div>
                  <!-- 公安交警联动单位（多条记录，对齐线上） -->
                  <div class="responsibility-block">
                    <div class="responsibility-sub-title">公安交警联动单位</div>
                    <template v-for="(item, idx) in addForm.policeRecords" :key="idx">
                      <div class="police-record-row">
                        <a-row :gutter="24">
                          <a-col :span="12">
                            <a-form-item label="单位名称" required>
                              <a-input v-model:value="item.unit" placeholder="点击选择" :disabled="isView" />
                            </a-form-item>
                          </a-col>
                          <a-col :span="12">
                            <a-form-item label="联系人" required>
                              <a-input v-model:value="item.contact" placeholder="点击选择" :disabled="isView" />
                            </a-form-item>
                          </a-col>
                        </a-row>
                        <a-row :gutter="24">
                          <a-col :span="12">
                            <a-form-item label="联系方式" required>
                              <a-input v-model:value="item.phone" placeholder="点击选择" :disabled="isView" />
                            </a-form-item>
                          </a-col>
                          <a-col :span="12" v-if="!isView">
                            <a-form-item :label="' '">
                              <a-button v-if="addForm.policeRecords.length > 1" type="link" danger @click="removePoliceRecord(idx)">删除该记录</a-button>
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </div>
                    </template>
                    <!-- 空状态时显示单条输入（新增模式） -->
                    <template v-if="addForm.policeRecords.length === 0">
                      <a-row :gutter="24">
                        <a-col :span="12">
                          <a-form-item label="单位名称" required>
                            <a-input v-model:value="addForm.policeUnit" placeholder="点击选择" :disabled="isView" />
                          </a-form-item>
                        </a-col>
                        <a-col :span="12">
                          <a-form-item label="联系人" required>
                            <a-input v-model:value="addForm.policeContact" placeholder="点击选择" :disabled="isView" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                      <a-row :gutter="24">
                        <a-col :span="12">
                          <a-form-item label="联系方式" required>
                            <a-input v-model:value="addForm.policeContactPhone" placeholder="点击选择" :disabled="isView" />
                          </a-form-item>
                        </a-col>
                      </a-row>
                    </template>
                    <a-button v-if="!isView" size="small" class="add-record-btn" @click="addPoliceRecord">新增联动单位</a-button>
                  </div>
                </div>

                <!-- 安全管理 -->
                <div class="form-section">
                  <div class="form-section-title">安全管理</div>
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="是否涉航桥梁" required>
                        <a-radio-group v-model:value="addForm.isNavigationBridge" :disabled="isView">
                          <a-radio :value="false">否</a-radio>
                          <a-radio :value="true">是</a-radio>
                        </a-radio-group>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="是否为大件运输通道" required :label-col="{ style: { width: '140px' } }">
                        <a-input v-model:value="addForm.isHeavyTransport" placeholder="" :disabled="isView" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 桥梁资料卡 Tab（人行天桥时不显示） -->
          <a-tab-pane v-if="!isOverpass" key="card" tab="桥梁资料卡">
            <!-- 查看模式：完整只读资料卡（对齐线上 ant-descriptions 每行3字段） -->
            <div v-if="isView" class="bridge-view-card">
              <!-- 资料卡下载 -->
              <div style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <!-- 基础信息区（对齐线上：ant-col-12/24 布局） -->
              <div class="card-top-form">
                <a-row :gutter="24">
                  <a-col :span="12">
                    <a-form-item label="桥梁名称">
                      <a-input :value="cardBasicInfo.name" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="所在道路">
                      <a-input :value="cardBasicInfo.roadName" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="跨越">
                      <a-input :value="cardBasicInfo.cross" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="等级">
                      <a-input :value="cardBasicInfo.grade" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="桥梁位置">
                      <a-input :value="cardBasicInfo.location" disabled />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <!-- 6 个 ant-descriptions 分组（每行3字段，label 130px） -->
              <div v-for="grp in cardViewGroups" :key="grp.title" class="card-section">
                <div class="card-section-title">{{ grp.title }}</div>
                <a-descriptions :column="3" size="small" bordered>
                  <a-descriptions-item
                    v-for="item in grp.rows"
                    :key="item.label"
                    :label="item.label"
                    :label-style="{ width: '130px' }"
                  >
                    {{ item.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
              <!-- 桥梁概况 -->
              <div class="card-section">
                <div class="card-section-title">桥梁概况</div>
                <a-textarea :value="cardText.overview" disabled :rows="3" style="resize: none" />
              </div>
              <!-- 附件上传 -->
              <div class="card-section">
                <div class="card-section-title">附件上传</div>
                <div class="card-empty-hint">暂无附件</div>
              </div>
              <!-- 结构简图 -->
              <div class="card-section">
                <div class="card-section-title">结构简图</div>
                <div class="card-empty-hint">暂无结构简图</div>
              </div>
              <!-- 附照（桥梁平面图、桥梁立面图） -->
              <div class="card-section">
                <div class="card-section-title">附照（桥梁平面图、桥梁立面图）</div>
                <div class="card-empty-hint">暂无附照</div>
              </div>
              <!-- 制表信息 -->
              <div class="card-section">
                <div class="card-section-title">制表信息</div>
                <a-descriptions :column="2" size="small" bordered>
                  <a-descriptions-item label="审定" :label-style="{ width: '130px' }">{{ cardTextInfo.audit }}</a-descriptions-item>
                  <a-descriptions-item label="复核" :label-style="{ width: '130px' }">{{ cardTextInfo.review }}</a-descriptions-item>
                  <a-descriptions-item label="制表" :label-style="{ width: '130px' }">{{ cardTextInfo.draft }}</a-descriptions-item>
                  <a-descriptions-item label="日期" :label-style="{ width: '130px' }">{{ cardTextInfo.cardDate }}</a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
            <!-- 编辑/新增模式：可编辑表单 -->
            <div v-else class="bridge-card-form">
              <a-form :model="bridgeCardForm" layout="horizontal" :label-col="{ style: { width: '110px' } }" :disabled="isView">
                <div v-for="grp in bridgeCardEditGroups" :key="grp.title" class="card-section">
                  <div class="card-section-title">{{ grp.title }}</div>
                  <a-form-item v-if="grp.single" :label="bridgeCardEditFields[grp.start].label">
                    <a-input v-model:value="bridgeCardForm[bridgeCardEditFields[grp.start].field]" style="width: 40%" />
                  </a-form-item>
                  <a-table
                    v-else
                    :columns="cardThreeCols"
                    :data-source="bridgeCardEditGridData(grp.start, grp.end)"
                    :show-header="false"
                    :pagination="false"
                    bordered
                    size="small"
                    :class="'card-table'"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'label'">
                        <div class="card-cell-label">{{ record.label }}</div>
                      </template>
                      <template v-else-if="column.key === 'value'">
                        <component
                          :is="record.component || 'a-input'"
                          v-bind="record.props || {}"
                          v-model:value="bridgeCardForm[record.field]"
                          :disabled="record.disabled"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix">
                            <span>{{ record.suffix }}</span>
                          </template>
                        </component>
                      </template>
                      <template v-else-if="column.key === 'label2'">
                        <div class="card-cell-label">{{ record.label2 }}</div>
                      </template>
                      <template v-else-if="column.key === 'value2'">
                        <component
                          :is="record.component2 || 'a-input'"
                          v-bind="record.props2 || {}"
                          v-model:value="bridgeCardForm[record.field2]"
                          :disabled="record.disabled2"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix2">
                            <span>{{ record.suffix2 }}</span>
                          </template>
                        </component>
                      </template>
                      <template v-else-if="column.key === 'label3'">
                        <div class="card-cell-label">{{ record.label3 }}</div>
                      </template>
                      <template v-else-if="column.key === 'value3'">
                        <component
                          :is="record.component3 || 'a-input'"
                          v-bind="record.props3 || {}"
                          v-model:value="bridgeCardForm[record.field3]"
                          :disabled="record.disabled3"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix3">
                            <span>{{ record.suffix3 }}</span>
                          </template>
                        </component>
                      </template>
                    </template>
                  </a-table>
                </div>

                <!-- 桥梁概况 -->
                <div class="card-section">
                  <div class="card-section-title">桥梁概况</div>
                  <a-form-item label="桥梁概况" :label-col="{ style: { width: '110px' } }">
                    <a-textarea
                      v-model:value="bridgeCardForm.overview"
                      :rows="4"
                      :maxlength="200"
                      placeholder="请输入桥梁概况"
                      show-count
                    />
                  </a-form-item>
                </div>

                <!-- 结构简图 / 附照 -->
                <div class="card-section">
                  <a-row :gutter="24">
                    <a-col :span="12">
                      <a-form-item label="结构简图" :label-col="{ style: { width: '110px' } }">
                        <a-upload :before-upload="() => false" :disabled="isView">
                          <a-button :disabled="isView">
                            <template #icon><UploadOutlined /></template>
                            上传文件
                          </a-button>
                        </a-upload>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="附照" :label-col="{ style: { width: '110px' } }">
                        <a-upload :before-upload="() => false" :disabled="isView">
                          <a-button :disabled="isView">
                            <template #icon><UploadOutlined /></template>
                            上传文件
                          </a-button>
                        </a-upload>
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>

                <!-- 制表信息 -->
                <div class="card-section">
                  <div class="card-section-title">制表信息</div>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item label="审定" :label-col="{ style: { width: '60px' } }">
                        <a-input v-model:value="bridgeCardForm.audit" placeholder="请输入" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="复核" :label-col="{ style: { width: '60px' } }">
                        <a-input v-model:value="bridgeCardForm.review" placeholder="请输入" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="制表" :label-col="{ style: { width: '60px' } }">
                        <a-input v-model:value="bridgeCardForm.draft" placeholder="请输入" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="日期" :label-col="{ style: { width: '60px' } }">
                        <a-date-picker
                          v-model:value="bridgeCardForm.cardDate"
                          style="width: 100%"
                          value-format="YYYY-MM-DD"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 通航资料卡 Tab（人行天桥时不显示） -->
          <a-tab-pane v-if="!isOverpass && currentViewRecord" key="nav" tab="通航资料卡">
            <!-- 查看模式：对齐线上布局（span=12/24 混合、radio、InputNumber、textarea） -->
            <div v-if="isView" class="bridge-sub-card-form nav-card-view">
              <a-form layout="horizontal" :label-col="{ style: { width: '180px' } }">
                <a-row :gutter="10">
                  <a-col v-for="item in navCardData" :key="item.label" :span="item.span">
                    <a-form-item
                      :label="item.label"
                      :class="{ 'nav-extra-long-label': item.extraLong }"
                      :label-col="item.extraLong ? { style: { width: '240px', whiteSpace: 'normal', lineHeight: '1.5' } } : undefined"
                    >
                      <!-- radio 字段 -->
                      <template v-if="item.type === 'radio'">
                        <a-radio-group :value="item.value" disabled>
                          <a-radio value="否" disabled>否</a-radio>
                          <a-radio value="是" disabled>是</a-radio>
                        </a-radio-group>
                      </template>
                      <!-- textarea 字段 -->
                      <template v-else-if="item.type === 'textarea'">
                        <a-textarea :value="item.value" disabled :rows="2" />
                      </template>
                      <!-- InputNumber 字段 -->
                      <template v-else-if="item.type === 'number'">
                        <a-input-number :value="item.value" disabled style="width: 100%" />
                      </template>
                      <!-- 普通文本 -->
                      <template v-else>
                        <a-input :value="item.value" disabled />
                      </template>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <!-- 编辑/新增模式：动态表单（对齐线上：每行1个字段） -->
            <div v-else class="nav-card-edit-form">
              <a-form :model="navCardEditForm" layout="horizontal" :label-col="{ style: { width: '300px' } }" :disabled="false">
                <a-row :gutter="24">
                  <a-col :span="24" v-for="f in navCardEditFields" :key="f.field">
                    <a-form-item :label="f.label">
                      <template v-if="f.type === 'radio' || f.options">
                        <a-radio-group v-model:value="navCardEditForm[f.field]" button-style="solid">
                          <a-radio-button v-for="opt in f.options" :key="opt" :value="opt">{{ opt }}</a-radio-button>
                        </a-radio-group>
                      </template>
                      <template v-else>
                        <a-input v-model:value="navCardEditForm[f.field]" :disabled="f.disabled" placeholder="请输入" />
                      </template>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 子桥资料卡 Tab（查看模式：固定子桥1/子桥2；编辑模式：动态列表） -->
          <!-- 查看模式：子桥1 -->
          <a-tab-pane v-if="!isOverpass && isView && currentViewRecord" key="sub1" tab="子桥1资料卡">
            <div class="bridge-sub-card-form">
              <!-- 资料卡下载 -->
              <div style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <!-- 基础信息区 -->
              <div class="card-top-form">
                <a-row :gutter="24">
                  <a-col :span="12">
                    <a-form-item label="桥梁名称">
                      <a-input :value="subBasicInfo(0).name" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="所在道路">
                      <a-input :value="subBasicInfo(0).roadName" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="跨越">
                      <a-input :value="subBasicInfo(0).cross" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="等级">
                      <a-input :value="subBasicInfo(0).grade" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="桥梁位置">
                      <a-input :value="subBasicInfo(0).location" disabled />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div v-for="grp in subCardData(currentViewRecord, 0)" :key="grp.title" class="card-section">
                <div class="card-section-title">{{ grp.title }}</div>
                <a-descriptions :column="3" size="small" bordered>
                  <a-descriptions-item
                    v-for="item in grp.rows"
                    :key="item.label"
                    :label="item.label"
                    :label-style="{ width: '130px' }"
                  >
                    {{ item.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
          </a-tab-pane>

          <!-- 查看模式：子桥2 -->
          <a-tab-pane v-if="!isOverpass && isView && currentViewRecord" key="sub2" tab="子桥2资料卡">
            <div class="bridge-sub-card-form">
              <!-- 资料卡下载 -->
              <div style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <!-- 基础信息区 -->
              <div class="card-top-form">
                <a-row :gutter="24">
                  <a-col :span="12">
                    <a-form-item label="桥梁名称">
                      <a-input :value="subBasicInfo(1).name" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="所在道路">
                      <a-input :value="subBasicInfo(1).roadName" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="跨越">
                      <a-input :value="subBasicInfo(1).cross" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="等级">
                      <a-input :value="subBasicInfo(1).grade" disabled />
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="桥梁位置">
                      <a-input :value="subBasicInfo(1).location" disabled />
                    </a-form-item>
                  </a-col>
                </a-row>
              </div>
              <div v-for="grp in subCardData(currentViewRecord, 1)" :key="grp.title" class="card-section">
                <div class="card-section-title">{{ grp.title }}</div>
                <a-descriptions :column="3" size="small" bordered>
                  <a-descriptions-item
                    v-for="item in grp.rows"
                    :key="item.label"
                    :label="item.label"
                    :label-style="{ width: '130px' }"
                  >
                    {{ item.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
          </a-tab-pane>

          <!-- 编辑/新增模式：动态子桥 tab -->
          <a-tab-pane v-for="sk in subCardFormKeys" v-if="!isView" :key="sk.key" :tab="sk.label" :force-render="true">
            <div class="bridge-sub-card-edit">
              <a-form :model="subCardEditForms[sk.key]" layout="horizontal" :label-col="{ style: { width: '100px' } }">
                <div v-for="grp in subCardEditGroups" :key="grp.title" class="card-section">
                  <div class="card-section-title">{{ grp.title }}</div>
                  <!-- 单行分组（制表单位） -->
                  <a-form-item v-if="grp.single" :label="subCardEditFields[grp.start].label">
                    <a-input v-model:value="subCardEditForms[sk.key][subCardEditFields[grp.start].field]" style="width: 40%" />
                  </a-form-item>
                  <!-- 3列分组 -->
                  <a-table
                    v-else
                    :columns="cardThreeCols"
                    :data-source="subCardEditGridData(sk.key, grp.start, grp.end)"
                    :show-header="false"
                    :pagination="false"
                    bordered
                    size="small"
                    :class="'card-table'"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'label'">
                        <div class="card-cell-label">{{ record.label }}</div>
                      </template>
                      <template v-else-if="column.key === 'value'">
                        <component
                          :is="record.component || 'a-input'"
                          v-bind="record.props || {}"
                          v-model:value="subCardEditForms[sk.key][record.field]"
                          :disabled="record.disabled"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix">
                            <span>{{ record.suffix }}</span>
                          </template>
                        </component>
                      </template>
                      <template v-else-if="column.key === 'label2'">
                        <div class="card-cell-label">{{ record.label2 }}</div>
                      </template>
                      <template v-else-if="column.key === 'value2'">
                        <component
                          :is="record.component2 || 'a-input'"
                          v-bind="record.props2 || {}"
                          v-model:value="subCardEditForms[sk.key][record.field2]"
                          :disabled="record.disabled2"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix2">
                            <span>{{ record.suffix2 }}</span>
                          </template>
                        </component>
                      </template>
                      <template v-else-if="column.key === 'label3'">
                        <div class="card-cell-label">{{ record.label3 }}</div>
                      </template>
                      <template v-else-if="column.key === 'value3'">
                        <component
                          :is="record.component3 || 'a-input'"
                          v-bind="record.props3 || {}"
                          v-model:value="subCardEditForms[sk.key][record.field3]"
                          :disabled="record.disabled3"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix3">
                            <span>{{ record.suffix3 }}</span>
                          </template>
                        </component>
                      </template>
                    </template>
                  </a-table>
                </div>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 人行天桥资料卡 Tab（当桥梁类型为人行天桥时显示，查看/编辑双模式） -->
          <a-tab-pane
            v-if="currentViewRecord && ((isView && currentViewRecord.type === '人行天桥') || (!isView && addForm.type === '人行天桥'))"
            key="overpass" tab="人行天桥资料卡"
          >
            <!-- 查看模式：a-descriptions 3列 -->
            <div v-if="isView" class="bridge-view-card">
              <div style="margin-bottom: 12px">
                <a-button size="small" @click="handleCardDownload">资料卡下载</a-button>
              </div>
              <div v-for="grp in overpassViewGroups" :key="grp.title" class="card-section">
                <div class="card-section-title">{{ grp.title }}</div>
                <a-descriptions :column="3" size="small" bordered>
                  <a-descriptions-item
                    v-for="item in grp.rows"
                    :key="item.label"
                    :label="item.label"
                    :label-style="{ width: '130px' }"
                  >
                    {{ item.value }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>
            </div>
            <!-- 编辑模式：可编辑表单 -->
            <div v-else class="bridge-card-form">
              <a-form :model="overpassCardForm" layout="horizontal" :label-col="{ style: { width: '110px' } }" :disabled="isView">
                <div v-for="grp in overpassEditGroups" :key="grp.title" class="card-section">
                  <div class="card-section-title">{{ grp.title }}</div>
                  <a-table
                    :columns="cardThreeCols"
                    :data-source="overpassEditGridData(grp.start, grp.end)"
                    :show-header="false"
                    :pagination="false"
                    bordered
                    size="small"
                    :class="'card-table'"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'label'">
                        <div class="card-cell-label">{{ record.label }}</div>
                      </template>
                      <template v-else-if="column.key === 'value'">
                        <component
                          :is="record.component || 'a-input'"
                          v-bind="record.props || {}"
                          v-model:value="overpassCardForm[record.field]"
                          :disabled="record.disabled"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix">
                            <span>{{ record.suffix }}</span>
                          </template>
                        </component>
                      </template>
                      <template v-else-if="column.key === 'label2'">
                        <div class="card-cell-label">{{ record.label2 }}</div>
                      </template>
                      <template v-else-if="column.key === 'value2'">
                        <component
                          :is="record.component2 || 'a-input'"
                          v-bind="record.props2 || {}"
                          v-model:value="overpassCardForm[record.field2]"
                          :disabled="record.disabled2"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix2">
                            <span>{{ record.suffix2 }}</span>
                          </template>
                        </component>
                      </template>
                      <template v-else-if="column.key === 'label3'">
                        <div class="card-cell-label">{{ record.label3 }}</div>
                      </template>
                      <template v-else-if="column.key === 'value3'">
                        <component
                          :is="record.component3 || 'a-input'"
                          v-bind="record.props3 || {}"
                          v-model:value="overpassCardForm[record.field3]"
                          :disabled="record.disabled3"
                          style="width: 100%"
                        >
                          <template v-if="record.suffix3">
                            <span>{{ record.suffix3 }}</span>
                          </template>
                        </component>
                      </template>
                    </template>
                  </a-table>
                </div>
                <!-- 制表信息 -->
                <div class="card-section">
                  <div class="card-section-title">制表信息</div>
                  <a-row :gutter="24">
                    <a-col :span="6">
                      <a-form-item label="审定" :label-col="{ style: { width: '60px' } }">
                        <a-input v-model:value="overpassCardForm.audit" placeholder="请输入" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="复核" :label-col="{ style: { width: '60px' } }">
                        <a-input v-model:value="overpassCardForm.review" placeholder="请输入" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="制表" :label-col="{ style: { width: '60px' } }">
                        <a-input v-model:value="overpassCardForm.draft" placeholder="请输入" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="6">
                      <a-form-item label="日期" :label-col="{ style: { width: '60px' } }">
                        <a-date-picker
                          v-model:value="overpassCardForm.cardDate"
                          style="width: 100%"
                          value-format="YYYY-MM-DD"
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </div>
              </a-form>
            </div>
          </a-tab-pane>

          <!-- 检测整改记录 Tab（仅查看模式） -->
          <a-tab-pane v-if="isView && currentViewRecord" key="inspect" tab="检测整改记录">
            <div class="bridge-inspect-form">
              <a-table
                :columns="bridgeInspectCols"
                :data-source="(currentViewRecord.detectRecords || []) as any[]"
                :pagination="false"
                row-key="id"
                size="middle"
                bordered
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'evalLevel'">
                    <a-tag :color="record.evalLevel === '不合格' ? 'red' : 'green'">{{ record.evalLevel }}</a-tag>
                  </template>
                  <template v-else-if="column.key === 'action'">
                    <a-button type="link" size="small">定期检测报告</a-button>
                  </template>
                </template>
              </a-table>
            </div>
          </a-tab-pane>
        </a-tabs>
        <!-- 底部操作栏 -->
        <div class="add-modal-footer">
          <template v-if="formMode === 'view'">
            <a-button @click="addVisible = false">关 闭</a-button>
          </template>
          <template v-else>
            <a-button type="primary" @click="handleSaveDraft">暂存草稿</a-button>
            <a-button type="primary" @click="handleSubmitAdd">提 交</a-button>
            <a-button @click="handleResetAdd">重 置</a-button>
            <a-button @click="addVisible = false">关 闭</a-button>
          </template>
        </div>
      </div>
    </a-modal>

    <!-- 批量填写弹窗 -->
    <a-modal
      v-model:open="batchFillModalVisible"
      :footer="null"
      width="800px"
      :body-style="{ padding: '0' }"
      class="batch-fill-modal"
    >
      <template #title>
        <div class="add-modal-header">
          <span class="add-modal-title">批量填写三级责任体系</span>
        </div>
      </template>
      <div class="add-bridge-content">
        <div class="add-bridge-form">
          <a-form :model="batchFillForm" layout="horizontal" :label-col="{ style: { width: '100px' } }">
            <!-- 行业主管单位 -->
            <div class="form-section">
              <div class="form-section-title">行业主管单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.industryUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.industryPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.industryContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <!-- 设施管理单位 -->
            <div class="form-section">
              <div class="form-section-title">设施管理单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.facilityUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.facilityPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.facilityContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <!-- 设施养护单位 -->
            <div class="form-section">
              <div class="form-section-title">设施养护单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.maintainUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="责任人">
                    <a-input v-model:value="batchFillForm.maintainPerson" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.maintainContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
            <!-- 公安交警联动单位 -->
            <div class="form-section">
              <div class="form-section-title">公安交警联动单位</div>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="单位名称">
                    <a-input v-model:value="batchFillForm.policeUnit" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="联系人">
                    <a-input v-model:value="batchFillForm.policeContact" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="24">
                <a-col :span="12">
                  <a-form-item label="联系方式">
                    <a-input v-model:value="batchFillForm.policeContactPhone" placeholder="点击选择" />
                  </a-form-item>
                </a-col>
              </a-row>
            </div>
          </a-form>
        </div>
        <!-- 底部操作栏 -->
        <div class="add-modal-footer">
          <a-button @click="handleCancelBatchFill">取 消</a-button>
          <a-button type="primary" @click="handleSubmitBatchFill">确 定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 桥梁地图弹窗 -->
    <a-modal
      v-model:open="mapModalVisible"
      title="桥梁地图"
      width="900px"
      :footer="null"
      class="bridge-map-modal"
    >
      <div class="bridge-map-placeholder">
        <EnvironmentOutlined style="font-size: 64px; color: #2A64FF" />
        <p style="margin-top: 16px; color: rgba(0, 0, 0, 0.45)">桥梁地图功能开发中</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, markRaw, watch } from 'vue'
import { useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'
import {
  HomeOutlined,
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  UploadOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
  DownloadOutlined,
  DownOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons-vue'
import { Input, InputNumber, DatePicker, Textarea, RadioGroup } from 'ant-design-vue'
import type { BridgeItem, BridgeSearchParams } from '@/types/bridge'
import {
  getBridgeList,
  deleteBridge,
  batchDeleteBridge,
  regionOptions,
  bridgeTypeOptions,
  bridgeClassificationOptions,
  evalLevelOptions,
  publishStatusOptions,
  isOverdueOptions,
  dataCompleteOptions,
  statusOptions,
  isNavigationBridgeOptions,
} from '@/utils/mockData'

const route = useRoute()

// 是否显示检测/评价单位列（从检测评价菜单进入时显示）
const showEvalUnit = computed(() => route.query.showEvalUnit === '1')

// 搜索展开/收起
const searchExpanded = ref(false)

// 搜索表单（状态默认选中"在用"）
const searchForm = reactive<BridgeSearchParams>({
  region: undefined,
  name: undefined,
  type: undefined,
  cityClassification: undefined,
  evalLevel: undefined,
  isNavigationBridge: undefined,
  status: '在用',
  dataComplete: undefined,
  publishStatus: undefined,
  isOverdue: undefined,
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

// 桥梁类型颜色映射
function getBridgeTypeColor(type?: string) {
  const colorMap: Record<string, string> = {
    '人行天桥': 'blue',
    '城市道路桥梁': 'green',
  }
  return colorMap[type || ''] || 'default'
}

// 表格列定义
const columns = computed<TableColumnsType>(() => {
  const base: TableColumnsType = [
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
      title: '城市道路桥梁分类',
      dataIndex: 'cityClassification',
      key: 'cityClassification',
      width: 150,
    },
    {
      title: '是否涉航桥梁',
      dataIndex: 'isNavigationBridge',
      key: 'isNavigationBridge',
      width: 120,
    },
    {
      title: '综合评价等级',
      dataIndex: 'evalLevel',
      key: 'evalLevel',
      width: 120,
    },
    {
      title: '检测时间',
      dataIndex: 'detectTime',
      key: 'detectTime',
      width: 120,
    },
  ]
  // 从检测评价菜单进入时显示检测/评价单位列
  if (showEvalUnit.value) {
    base.push({
      title: '检测/评价单位',
      dataIndex: 'evalUnit',
      key: 'evalUnit',
      width: 160,
    })
  }
  base.push(
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
      title: '检测是否超期',
      dataIndex: 'isOverdue',
      key: 'isOverdue',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
    },
  )
  return base
})

// 批量填写弹窗相关
const batchFillModalVisible = ref(false)
const batchFillForm = reactive({
  industryUnit: '',
  industryPerson: '',
  industryContact: '',
  facilityUnit: '',
  facilityPerson: '',
  facilityContact: '',
  maintainUnit: '',
  maintainPerson: '',
  maintainContact: '',
  policeUnit: '',
  policeContact: '',
  policeContactPhone: '',
})

// 打开批量填写弹窗
function handleBatchFill() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要批量填写的数据')
    return
  }
  resetBatchFillForm()
  batchFillModalVisible.value = true
}

// 重置批量填写表单
function resetBatchFillForm() {
  batchFillForm.industryUnit = ''
  batchFillForm.industryPerson = ''
  batchFillForm.industryContact = ''
  batchFillForm.facilityUnit = ''
  batchFillForm.facilityPerson = ''
  batchFillForm.facilityContact = ''
  batchFillForm.maintainUnit = ''
  batchFillForm.maintainPerson = ''
  batchFillForm.maintainContact = ''
  batchFillForm.policeUnit = ''
  batchFillForm.policeContact = ''
  batchFillForm.policeContactPhone = ''
}

// 取消批量填写
function handleCancelBatchFill() {
  batchFillModalVisible.value = false
  resetBatchFillForm()
}

// 提交批量填写
function handleSubmitBatchFill() {
  Modal.confirm({
    title: '确认批量填写',
    content: `确定要将选中的 ${selectedRowKeys.value.length} 条记录的三级责任体系信息批量填写吗？`,
    okText: '确定',
    cancelText: '取消',
    onOk: async () => {
      message.success(`已成功批量填写 ${selectedRowKeys.value.length} 条记录`)
      batchFillModalVisible.value = false
      resetBatchFillForm()
      selectedRowKeys.value = []
      loadData()
    },
  })
}

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const params: BridgeSearchParams = {
      region: searchForm.region,
      name: searchForm.name,
      type: searchForm.type,
      cityClassification: searchForm.cityClassification,
      evalLevel: searchForm.evalLevel,
      isNavigationBridge: searchForm.isNavigationBridge,
      status: searchForm.status,
      dataComplete: searchForm.dataComplete,
      publishStatus: searchForm.publishStatus,
      isOverdue: searchForm.isOverdue,
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
  searchForm.cityClassification = undefined
  searchForm.evalLevel = undefined
  searchForm.isNavigationBridge = undefined
  searchForm.status = '在用'
  searchForm.dataComplete = undefined
  searchForm.publishStatus = undefined
  searchForm.isOverdue = undefined
  pagination.current = 1
  loadData()
}

// 刷新
function handleRefresh() {
  loadData()
}

// 新增/查看/编辑弹窗
const addVisible = ref(false)
const addActiveTab = ref('basic')
const formMode = ref<'add' | 'view' | 'edit'>('add')
const isView = computed(() => formMode.value === 'view')
// 是否人行天桥（用于 tab 互斥：人行天桥时不显示桥梁资料卡/通航/子桥 tab）
const isOverpass = computed(() => {
  if (isView.value && currentViewRecord.value) return currentViewRecord.value.type === '人行天桥'
  return addForm.type === '人行天桥'
})
const formTitle = computed(() => {
  switch (formMode.value) {
    case 'view': return '查看桥梁'
    case 'edit': return '编辑桥梁'
    default: return '新增桥梁'
  }
})
const editingRecordKey = ref('')
// 当前查看/编辑的记录
const currentViewRecord = ref<BridgeItem | null>(null)
const addForm = reactive({
  name: '',
  type: undefined as string | undefined,
  structureType: '',
  region: undefined as string | undefined,
  location: '',
  industryUnit: '',
  industryPerson: '',
  industryContact: '',
  facilityUnit: '',
  facilityPerson: '',
  facilityContact: '',
  maintainUnit: '',
  maintainPerson: '',
  maintainContact: '',
  policeUnit: '',
  policeContact: '',
  policeContactPhone: '',
  // 公安交警联动单位（多条记录，对齐线上）
  policeRecords: [] as Array<{ unit: string; contact: string; phone: string }>,
  isNavigationBridge: undefined as boolean | undefined,
  isHeavyTransport: '',
})

function resetAddForm() {
  addForm.name = ''
  addForm.type = undefined
  addForm.structureType = ''
  addForm.region = undefined
  addForm.location = ''
  addForm.industryUnit = ''
  addForm.industryPerson = ''
  addForm.industryContact = ''
  addForm.facilityUnit = ''
  addForm.facilityPerson = ''
  addForm.facilityContact = ''
  addForm.maintainUnit = ''
  addForm.maintainPerson = ''
  addForm.maintainContact = ''
  addForm.policeUnit = ''
  addForm.policeContact = ''
  addForm.policeContactPhone = ''
  addForm.policeRecords = []
  addForm.isNavigationBridge = undefined
  addForm.isHeavyTransport = ''
  addActiveTab.value = 'basic'
  resetBridgeCardForm()
  // 重置通航资料卡编辑表单
  resetNavCardEditForm()
  // 重置子桥资料卡编辑表单
  Object.keys(subCardEditForms).forEach((k) => { delete subCardEditForms[k] })
}

// 新增
function handleAdd() {
  resetAddForm()
  formMode.value = 'add'
  addVisible.value = true
}

// 暂存草稿
function handleSaveDraft() {
  message.success('草稿暂存成功')
}

// 提交新增
function handleSubmitAdd() {
  if (!addForm.name) { message.warning('请输入桥梁名称'); return }
  if (!addForm.type) { message.warning('请选择桥梁类型'); return }
  if (!addForm.region) { message.warning('请选择归属地区'); return }
  if (addForm.isNavigationBridge === undefined) { message.warning('请选择是否涉航桥梁'); return }
  // 同步公安交警首条记录到单字段（兼容旧查看模式）
  if (addForm.policeRecords.length > 0) {
    addForm.policeUnit = addForm.policeRecords[0].unit
    addForm.policeContact = addForm.policeRecords[0].contact
    addForm.policeContactPhone = addForm.policeRecords[0].phone
  }
  // 合并通航资料卡编辑数据到当前记录（演示联动）
  if (currentViewRecord.value) {
    const nav = (currentViewRecord.value as any).navigationCard || {}
    Object.assign(nav, collectNavCardEditForm())
    // 合并子桥编辑数据
    const subs = (currentViewRecord.value as any).subBridges || []
    const collected = collectSubCardEditForms()
    Object.keys(collected).forEach((key, idx) => {
      const data = { ...collected[key] }
      // 附挂管线字段写回嵌套对象
      const attachedPipe: Record<string, any> = {}
      ;['waterPipe', 'gasPipe', 'powerCable', 'telecomCable'].forEach((p) => {
        if (data[p]) { attachedPipe[p] = data[p]; delete data[p] }
      })
      if (subs[idx]) {
        subs[idx].card = { ...(subs[idx].card || {}), ...data }
        if (Object.keys(attachedPipe).length > 0) {
          subs[idx].card.attachedPipe = { ...(subs[idx].card.attachedPipe || {}), ...attachedPipe }
        }
      } else {
        const newCard = { ...data }
        if (Object.keys(attachedPipe).length > 0) { newCard.attachedPipe = attachedPipe }
        subs.push({ name: data.cardName || `子桥${idx + 1}`, structureType: data.structureType || '', card: newCard })
      }
    })
  }
  message.success('提交成功')
  addVisible.value = false
  loadData()
}

// 重置
function handleResetAdd() {
  resetAddForm()
}

// 公安交警联动单位：新增记录
function addPoliceRecord() {
  addForm.policeRecords.push({ unit: '', contact: '', phone: '' })
}

// 公安交警联动单位：删除记录
function removePoliceRecord(idx: number) {
  addForm.policeRecords.splice(idx, 1)
}

// 导出
function handleExport() {
  message.success('导出成功')
}

// 模版下载
function handleTemplateDownload() {
  message.success('模版下载成功')
}

// 资料卡下载
function handleCardDownload() {
  message.success('资料卡下载成功')
}

// 批量导入
function handleBatchImport() {
  message.info('批量导入功能开发中')
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

// 桥梁地图
const mapModalVisible = ref(false)
function handleBridgeMap() {
  mapModalVisible.value = true
}

// 编辑
function handleEdit(record: BridgeItem) {
  resetAddForm()
  formMode.value = 'edit'
  currentViewRecord.value = record
  editingRecordKey.value = record.key
  // 填充表单数据
  addForm.name = record.name
  addForm.type = record.type
  addForm.structureType = record.structureType || ''
  addForm.region = record.region
  addForm.location = record.bridgeLocation || ''
  addForm.isNavigationBridge = record.isNavigationBridge
  addForm.isHeavyTransport = record.isLargeTransportChannel || ''
  // 填充三级责任体系
  addForm.industryUnit = record.industryUnit || ''
  addForm.industryPerson = record.industryPerson || ''
  addForm.industryContact = record.industryContact || ''
  addForm.facilityUnit = record.facilityManageUnit || ''
  addForm.facilityPerson = record.facilityManagePerson || ''
  addForm.facilityContact = record.facilityManageContact || ''
  addForm.maintainUnit = record.facilityMaintainUnit || ''
  addForm.maintainPerson = record.facilityMaintainPerson || ''
  addForm.maintainContact = record.facilityMaintainContact || ''
  addForm.policeUnit = record.policeUnit || ''
  addForm.policeContact = record.policeContact || ''
  addForm.policeContactPhone = record.policeContactPhone || ''
  addForm.policeRecords = (record.policeRecords && record.policeRecords.length > 0)
    ? record.policeRecords.map((r) => ({ ...r }))
    : (record.policeUnit ? [{ unit: record.policeUnit, contact: record.policeContact || '', phone: record.policeContactPhone || '' }] : [])
  // 填充资料卡
  fillBridgeCardFromRecord(record)
  // 填充通航资料卡编辑表单
  fillNavCardFromRecord(record)
  // 填充子桥资料卡编辑表单
  fillSubCardEditForms(record)
  // 填充人行天桥资料卡编辑表单
  fillOverpassCardFromRecord(record)
  addVisible.value = true
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

// 查看详情
function handleView(record: BridgeItem) {
  resetAddForm()
  formMode.value = 'view'
  currentViewRecord.value = record
  // 填充表单数据
  addForm.name = record.name
  addForm.type = record.type
  addForm.structureType = record.structureType || ''
  addForm.region = record.region
  addForm.location = record.bridgeLocation || ''
  addForm.isNavigationBridge = record.isNavigationBridge
  addForm.isHeavyTransport = record.isLargeTransportChannel || ''
  // 填充三级责任体系
  addForm.industryUnit = record.industryUnit || ''
  addForm.industryPerson = record.industryPerson || ''
  addForm.industryContact = record.industryContact || ''
  addForm.facilityUnit = record.facilityManageUnit || ''
  addForm.facilityPerson = record.facilityManagePerson || ''
  addForm.facilityContact = record.facilityManageContact || ''
  addForm.maintainUnit = record.facilityMaintainUnit || ''
  addForm.maintainPerson = record.facilityMaintainPerson || ''
  addForm.maintainContact = record.facilityMaintainContact || ''
  addForm.policeUnit = record.policeUnit || ''
  addForm.policeContact = record.policeContact || ''
  addForm.policeContactPhone = record.policeContactPhone || ''
  addForm.policeRecords = (record.policeRecords && record.policeRecords.length > 0)
    ? record.policeRecords.map((r) => ({ ...r }))
    : (record.policeUnit ? [{ unit: record.policeUnit, contact: record.policeContact || '', phone: record.policeContactPhone || '' }] : [])
  // 填充资料卡
  fillBridgeCardFromRecord(record)
  // 填充通航资料卡编辑表单
  fillNavCardFromRecord(record)
  // 填充子桥资料卡编辑表单
  fillSubCardEditForms(record)
  // 填充人行天桥资料卡编辑表单
  fillOverpassCardFromRecord(record)
  addVisible.value = true
}

// 页码改变
function handlePageChange(page: number, pageSize: number) {
  pagination.current = page
  pagination.pageSize = pageSize
  loadData()
}

// 每页显示数量改变
function handlePageSizeChange(_current: number, size: number) {
  pagination.current = 1
  pagination.pageSize = size
  loadData()
}

// ==================== 桥梁资料卡 ====================
const AInput = markRaw(Input)
const AInputNumber = markRaw(InputNumber)
const ADatePicker = markRaw(DatePicker)
const ATextarea = markRaw(Textarea)

// 资料卡表单数据
const bridgeCardForm = reactive<Record<string, any>>({
  unit: '',
  cardName: '',
  roadName: '',
  crossLevel: '',
  cardLocation: '',
  // 一般资料
  manageUnit: '',
  maintainUnit: '',
  buildUnit: '',
  designUnit: '',
  supervisorUnit: '',
  constructionUnit: '',
  buildDate: '',
  totalCost: '',
  maintainGrade: '',
  maintainLevel: '',
  roadGrade: '',
  structureType: '',
  designLoad: '',
  limitLoad: '',
  seismicIntensity: '',
  skewAngle: '',
  bridgeSpans: '',
  spanCombination: '',
  deckArea: '',
  bridgeTotalLength: '',
  bridgeTotalWidth: '',
  carriagewayWidth: '',
  sidewalkWidth: '',
  riverGrade: '',
  highestWaterLevel: '',
  normalWaterLevel: '',
  // 上部结构
  girderForm: '',
  girderSize: '',
  girderCount: '',
  crossBeamForm: '',
  mainSpanClearance: '',
  bridgeClearHeight: '',
  archRiseSpanRatio: '',
  bearingType: '',
  bearingCount: '',
  deckStructure: '',
  deckPavementThickness: '',
  expansionJointType: '',
  expansionJointCount: '',
  mainBridgeLongitudinalSlope: '',
  mainBridgeTransverseSlope: '',
  approachBridgeLongitudinalSlope: '',
  approachBridgeTransverseSlope: '',
  // 下部结构 - 桥墩
  pierForm: '',
  pierCount: '',
  pierElevation: '',
  capBeamSize: '',
  pierBaseElevation: '',
  pierBaseplateSize: '',
  pierPileSize: '',
  pierPileCount: '',
  // 下部结构 - 桥台
  abutmentForm: '',
  abutmentCount: '',
  abutmentElevation: '',
  abutmentBaseElevation: '',
  capSize: '',
  abutmentBaseplateSize: '',
  abutmentPileSize: '',
  abutmentPileCount: '',
  retainingPlateThickness: '',
  wingWallForm: '',
  wingWallLength: '',
  // 附属工程
  collectorSize: '',
  collectorCount: '',
  drainPipeSize: '',
  drainPipeLength: '',
  railingTotalLength: '',
  railingStructure: '',
  endColumnSize: '',
  bankProtectionType: '',
  approachRetainingWallType: '',
  // 附挂管线
  waterPipe: '',
  gasPipe: '',
  powerCable: '',
  telecomCable: '',
  // 桥梁概况
  overview: '',
  // 制表信息
  audit: '',
  review: '',
  draft: '',
  cardDate: '',
})

function resetBridgeCardForm() {
  Object.keys(bridgeCardForm).forEach((key) => {
    bridgeCardForm[key] = ''
  })
}

// 从记录填充资料卡（自动带入字段）
function fillBridgeCardFromRecord(record: BridgeItem) {
  resetBridgeCardForm()
  bridgeCardForm.cardName = record.name || ''
  bridgeCardForm.cardLocation = (record as any).bridgeLocation || ''
  bridgeCardForm.manageUnit = (record as any).facilityManageUnit || ''
  bridgeCardForm.maintainUnit = (record as any).facilityMaintainUnit || ''
}

// 资料卡表格列定义（3列布局：标签-值-标签-值-标签-值）
const cardThreeCols: TableColumnsType = [
  { title: '', dataIndex: 'label', key: 'label', width: 120, customCell: () => ({ style: { background: '#fafafa', padding: '0' } }) },
  { title: '', dataIndex: 'value', key: 'value', width: 200, customCell: () => ({ style: { padding: '4px 8px' } }) },
  { title: '', dataIndex: 'label2', key: 'label2', width: 120, customCell: () => ({ style: { background: '#fafafa', padding: '0' } }) },
  { title: '', dataIndex: 'value2', key: 'value2', width: 200, customCell: () => ({ style: { padding: '4px 8px' } }) },
  { title: '', dataIndex: 'label3', key: 'label3', width: 120, customCell: () => ({ style: { background: '#fafafa', padding: '0' } }) },
  { title: '', dataIndex: 'value3', key: 'value3', width: 200, customCell: () => ({ style: { padding: '4px 8px' } }) },
]

// 桥梁资料卡编辑字段配置（对齐导则表A.1，每行3字段）
const bridgeCardEditFields: Array<{ label: string; field: string; component?: any; disabled?: boolean; props?: Record<string, any>; suffix?: string }> = [
  // 制表单位
  { label: '制表单位', field: 'unit' },
  // 一般资料（含基础信息4字段 + 导则26字段 = 30字段）
  { label: '桥梁名称', field: 'cardName', disabled: true },
  { label: '所在道路', field: 'roadName' },
  { label: '跨越', field: 'crossLevel' },
  { label: '桥梁位置', field: 'cardLocation' },
  { label: '管理单位', field: 'manageUnit' },
  { label: '养护单位', field: 'maintainUnit' },
  { label: '建设单位', field: 'buildUnit' },
  { label: '设计单位', field: 'designUnit' },
  { label: '监理单位', field: 'supervisorUnit' },
  { label: '施工单位', field: 'constructionUnit' },
  { label: '建成年月', field: 'buildDate', component: ADatePicker, props: { valueFormat: 'YYYY-MM-DD' } },
  { label: '总造价', field: 'totalCost', suffix: '元', props: { addonAfter: '元' } },
  { label: '养护类别', field: 'maintainGrade' },
  { label: '养护等级', field: 'maintainLevel' },
  { label: '道路等级', field: 'roadGrade' },
  { label: '结构类型', field: 'structureType' },
  { label: '设计荷载', field: 'designLoad' },
  { label: '限载标准', field: 'limitLoad', suffix: 't', props: { addonAfter: 't' } },
  { label: '抗震烈度', field: 'seismicIntensity' },
  { label: '正斜交角', field: 'skewAngle', suffix: '°', props: { addonAfter: '°' } },
  { label: '桥梁跨数', field: 'bridgeSpans' },
  { label: '跨径组合', field: 'spanCombination', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '桥面面积', field: 'deckArea', suffix: 'm²', props: { addonAfter: 'm²' } },
  { label: '桥梁总长', field: 'bridgeTotalLength', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '桥梁总宽', field: 'bridgeTotalWidth', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '车行道净宽', field: 'carriagewayWidth', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '人行道净宽', field: 'sidewalkWidth', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '河道等级', field: 'riverGrade' },
  { label: '最高水位', field: 'highestWaterLevel', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '常水位', field: 'normalWaterLevel', suffix: 'm', props: { addonAfter: 'm' } },
  // 上部结构（17字段）
  { label: '主梁形式', field: 'girderForm' },
  { label: '主梁尺寸（宽×高×长）', field: 'girderSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '主梁数量', field: 'girderCount' },
  { label: '横梁形式', field: 'crossBeamForm' },
  { label: '主跨桥下净空', field: 'mainSpanClearance', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '桥下限高', field: 'bridgeClearHeight', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '拱桥矢跨比', field: 'archRiseSpanRatio' },
  { label: '支座型式', field: 'bearingType' },
  { label: '支座数量', field: 'bearingCount' },
  { label: '桥面结构', field: 'deckStructure' },
  { label: '桥面铺装厚度', field: 'deckPavementThickness', suffix: 'cm', props: { addonAfter: 'cm' } },
  { label: '伸缩缝型式', field: 'expansionJointType' },
  { label: '伸缩缝数量', field: 'expansionJointCount' },
  { label: '主桥纵坡', field: 'mainBridgeLongitudinalSlope', suffix: '%', props: { addonAfter: '%' } },
  { label: '主桥横坡', field: 'mainBridgeTransverseSlope', suffix: '%', props: { addonAfter: '%' } },
  { label: '引桥纵坡', field: 'approachBridgeLongitudinalSlope', suffix: '%', props: { addonAfter: '%' } },
  { label: '引桥横坡', field: 'approachBridgeTransverseSlope', suffix: '%', props: { addonAfter: '%' } },
  // 下部结构-桥墩（8字段）
  { label: '形式', field: 'pierForm' },
  { label: '桥墩数量', field: 'pierCount' },
  { label: '桥墩标高', field: 'pierElevation', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '盖梁尺寸', field: 'capBeamSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '基底标高', field: 'pierBaseElevation', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '底板尺寸', field: 'pierBaseplateSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '基桩尺寸', field: 'pierPileSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '基桩根数', field: 'pierPileCount' },
  // 下部结构-桥台（11字段）
  { label: '形式', field: 'abutmentForm' },
  { label: '桥台数量', field: 'abutmentCount' },
  { label: '桥台标高', field: 'abutmentElevation', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '基底标高', field: 'abutmentBaseElevation', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '台帽尺寸', field: 'capSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '底板尺寸', field: 'abutmentBaseplateSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '基桩尺寸', field: 'abutmentPileSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '基桩根数', field: 'abutmentPileCount' },
  { label: '挡土板厚度', field: 'retainingPlateThickness', suffix: 'cm', props: { addonAfter: 'cm' } },
  { label: '翼墙形式', field: 'wingWallForm' },
  { label: '翼墙长度', field: 'wingWallLength', suffix: 'm', props: { addonAfter: 'm' } },
  // 附属工程（9字段）
  { label: '集水口尺寸', field: 'collectorSize', suffix: 'mm', props: { addonAfter: 'mm' } },
  { label: '集水口数量', field: 'collectorCount' },
  { label: '泄水管尺寸', field: 'drainPipeSize', suffix: 'mm', props: { addonAfter: 'mm' } },
  { label: '泄水管长度', field: 'drainPipeLength', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '栏杆总长', field: 'railingTotalLength', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '栏杆结构', field: 'railingStructure' },
  { label: '端柱尺寸', field: 'endColumnSize', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '护岸类型', field: 'bankProtectionType' },
  { label: '引坡挡墙类型', field: 'approachRetainingWallType' },
  // 附挂管线（4字段）
  { label: '给水管', field: 'waterPipe' },
  { label: '燃气管', field: 'gasPipe' },
  { label: '电力缆', field: 'powerCable' },
  { label: '通信电缆', field: 'telecomCable' },
]

// 桥梁资料卡编辑分组（对齐导则6分组 + 制表单位）
const bridgeCardEditGroups = [
  { title: '制表单位', start: 0, end: 1, single: true },
  { title: '一般资料', start: 1, end: 31 },
  { title: '上部结构', start: 31, end: 48 },
  { title: '下部结构-桥墩', start: 48, end: 56 },
  { title: '下部结构-桥台', start: 56, end: 67 },
  { title: '附属工程', start: 67, end: 76 },
  { title: '附挂管线', start: 76, end: 80 },
]

// 桥梁资料卡编辑字段 → 3列表格数据（每行3组 label-value-label-value-label-value）
function bridgeCardEditGridData(start: number, end: number) {
  const slice = bridgeCardEditFields.slice(start, end)
  const rows: Array<Record<string, any>> = []
  for (let i = 0; i < slice.length; i += 3) {
    const row: Record<string, any> = {}
    const cols = ['', '2', '3']
    cols.forEach((suffix, j) => {
      const f = slice[i + j]
      if (f) {
        row[`label${suffix}`] = f.label
        row[`field${suffix}`] = f.field
        row[`component${suffix}`] = f.component || AInput
        row[`disabled${suffix}`] = !!f.disabled
        row[`props${suffix}`] = f.props || {}
        row[`suffix${suffix}`] = f.suffix || ''
      }
    })
    rows.push(row)
  }
  return rows
}

// ==================== 通航资料卡（查看模式） ====================

// 通航资料卡数据（从 currentViewRecord.navigationCard 读取，对齐线上）
const navCardData = computed(() => {
  const nav = (currentViewRecord.value as any)?.navigationCard || {}
  // 长标签字段用 span=24，其余用 span=12（对齐线上）
  const longLabels = new Set([
    '所在四横四纵两网航道、沿海桥梁所在海域',
    '所在四横四纵两网航道航段、沿海桥梁所跨航道',
    '沿海桥梁所跨航道代表船型',
    '备注',
  ])
  // 超长标签字段：label 文字超过 10 个字，需要 label-col 加宽并允许换行
  const extraLongLabels = new Set([
    '是否制定防范船舶碰撞桥梁次生事故应急预案',
    '防范船舶碰撞桥梁次生事故应急预案是否纳入属地突发事件应急预案体系',
  ])
  // radio 字段
  const radioLabels = new Set([
    '是否为非限制性桥梁',
    '是否设置主动预警系统',
    '是否设置桥梁助航标志',
    '是否设置桥区水上专用航标',
    '是否制定防范船舶碰撞桥梁次生事故应急预案',
    '防范船舶碰撞桥梁次生事故应急预案是否纳入属地突发事件应急预案体系',
  ])
  // InputNumber 字段
  const numberLabels = new Set([
    '日均断面船舶流量',
    '主通航孔通航净空高度',
    '主通航孔通航净空宽度',
    '设计最高通航水位',
  ])
  const rawData = [
    { label: '桥梁名称', value: nav.bridgeName || '' },
    { label: '桥梁编号', value: nav.bridgeNo || '' },
    { label: '桥梁功能类型', value: nav.bridgeFunctionType || '' },
    { label: '是否为非限制性桥梁', value: nav.isNonRestrictedBridge || '' },
    { label: '省', value: nav.province || '' },
    { label: '市', value: nav.city || '' },
    { label: '县', value: nav.county || '' },
    { label: '所在四横四纵两网航道、沿海桥梁所在海域', value: nav.fourVerticalTwoHorizontalWaterway || '' },
    { label: '所在四横四纵两网航道航段、沿海桥梁所跨航道', value: nav.coastalCrossingWaterway || '' },
    { label: '沿海桥梁所跨航道代表船型', value: nav.representativeShipType || '' },
    { label: '所在内河航道现状等级', value: nav.inlandWaterwayCurrentGrade || '' },
    { label: '所在内河航道规划等级', value: nav.inlandWaterwayPlanGrade || '' },
    { label: '日均断面船舶流量', value: nav.dailyShipFlow || '' },
    { label: '桥梁通航孔孔径及布置', value: nav.navigationHoleSpanAndLayout || '' },
    { label: '桥区航道维护尺度', value: nav.bridgeWaterwayMaintenanceScale || '' },
    { label: '桥区水域范围', value: nav.bridgeWaterAreaScope || '' },
    { label: '主通航孔通航方式', value: nav.mainNavigationHoleMode || '' },
    { label: '主通航孔通航净空高度', value: nav.mainNavigationClearHeight || '' },
    { label: '主通航孔通航净空宽度', value: nav.mainNavigationClearWidth || '' },
    { label: '设计最高通航水位', value: nav.designHighestNavigationWaterLevel || '' },
    { label: '桥梁桥墩防撞能力', value: nav.pierAntiCollisionCapacity || '' },
    { label: '通航孔桥墩防撞设施设置情况', value: nav.navigationHolePierAntiCollisionFacility || '' },
    { label: '是否设置主动预警系统', value: nav.activeWarningSystem || '' },
    { label: '是否设置桥梁助航标志', value: nav.bridgeNavigationAidMark || '' },
    { label: '是否设置桥区水上专用航标', value: nav.bridgeAreaWaterwayBuoy || '' },
    { label: '桥梁建设单位', value: nav.buildUnit || '' },
    { label: '桥梁运营管理单位', value: nav.operationManageUnit || '' },
    { label: '桥梁运营管理单位联系方式', value: nav.operationManageContact || '' },
    { label: '海事管理机构', value: nav.maritimeAuthority || '' },
    { label: '航道养护单位', value: nav.waterwayMaintainUnit || '' },
    { label: '是否制定防范船舶碰撞桥梁次生事故应急预案', value: nav.antiCollisionPlan || '' },
    { label: '防范船舶碰撞桥梁次生事故应急预案是否纳入属地突发事件应急预案体系', value: nav.emergencyPlanInLocal || '' },
    { label: '四类桥梁功能类型', value: nav.fourTypeBridgeFunctionType || '' },
    { label: '沿海内河桥梁类型', value: nav.coastal || '' },
    { label: '备注', value: nav.remark || '' },
  ]
  return rawData.map((item) => ({
    ...item,
    span: longLabels.has(item.label) ? 24 : 12,
    type: radioLabels.has(item.label)
      ? 'radio'
      : numberLabels.has(item.label)
        ? 'number'
        : item.label === '备注'
          ? 'textarea'
          : 'text',
    extraLong: extraLongLabels.has(item.label),
  }))
})

// 通航资料卡编辑表单数据（对齐线上：每行1个字段）
const navCardEditForm = reactive<Record<string, any>>({})
const ANavRadioGroup = markRaw(RadioGroup)

// 通航资料卡编辑配置（字段列表，对齐线上）
const navCardEditFields = [
  { label: '桥梁名称', field: 'bridgeName', disabled: true },
  { label: '桥梁编号', field: 'bridgeNo' },
  { label: '桥梁功能类型', field: 'bridgeFunctionType' },
  { label: '是否为非限制性桥梁', field: 'isNonRestrictedBridge', component: ANavRadioGroup, options: ['否', '是'] },
  { label: '省', field: 'province' },
  { label: '市', field: 'city' },
  { label: '县', field: 'county' },
  { label: '所在四横四纵两网航道、沿海桥梁所在海域', field: 'fourVerticalTwoHorizontalWaterway' },
  { label: '所在四横四纵两网航道航段、沿海桥梁所跨航道', field: 'coastalCrossingWaterway' },
  { label: '沿海桥梁所跨航道代表船型', field: 'representativeShipType' },
  { label: '所在内河航道现状等级', field: 'inlandWaterwayCurrentGrade' },
  { label: '所在内河航道规划等级', field: 'inlandWaterwayPlanGrade' },
  { label: '日均断面船舶流量', field: 'dailyShipFlow' },
  { label: '桥梁通航孔孔径及布置', field: 'navigationHoleSpanAndLayout' },
  { label: '桥区航道维护尺度', field: 'bridgeWaterwayMaintenanceScale' },
  { label: '桥区水域范围', field: 'bridgeWaterAreaScope' },
  { label: '主通航孔通航方式', field: 'mainNavigationHoleMode' },
  { label: '主通航孔通航净空高度', field: 'mainNavigationClearHeight' },
  { label: '主通航孔通航净空宽度', field: 'mainNavigationClearWidth' },
  { label: '设计最高通航水位', field: 'designHighestNavigationWaterLevel' },
  { label: '桥梁桥墩防撞能力', field: 'pierAntiCollisionCapacity' },
  { label: '通航孔桥墩防撞设施设置情况', field: 'navigationHolePierAntiCollisionFacility' },
  { label: '是否设置主动预警系统', field: 'activeWarningSystem', type: 'radio', options: ['否', '是'] },
  { label: '是否设置桥梁助航标志', field: 'bridgeNavigationAidMark', type: 'radio', options: ['否', '是'] },
  { label: '是否设置桥区水上专用航标', field: 'bridgeAreaWaterwayBuoy', type: 'radio', options: ['否', '是'] },
  { label: '桥梁建设单位', field: 'buildUnit' },
  { label: '桥梁运营管理单位', field: 'operationManageUnit' },
  { label: '运营管理单位联系方式', field: 'operationManageContact' },
  { label: '海事管理机构', field: 'maritimeAuthority' },
  { label: '航道养护单位', field: 'waterwayMaintainUnit' },
  { label: '是否制定防范船舶碰撞桥梁次生事故应急预案', field: 'antiCollisionPlan', type: 'radio', options: ['否', '是'] },
  { label: '防范船舶碰撞桥梁次生事故应急预案是否纳入属地突发事件应急预案体系', field: 'emergencyPlanInLocal', type: 'radio', options: ['否', '是'] },
  { label: '四类桥梁功能类型', field: 'fourTypeBridgeFunctionType' },
  { label: '沿海内河桥梁类型', field: 'coastal' },
  { label: '备注', field: 'remark' },
]

// 重置通航资料卡编辑表单
function resetNavCardEditForm() {
  Object.keys(navCardEditForm).forEach((k) => { delete navCardEditForm[k] })
  navCardEditFields.forEach((f) => { navCardEditForm[f.field] = '' })
}

// 从记录填充通航编辑表单
function fillNavCardFromRecord(record: BridgeItem | null) {
  resetNavCardEditForm()
  const nav = (record as any)?.navigationCard || {}
  navCardEditFields.forEach((f) => {
    navCardEditForm[f.field] = (nav as any)[f.field] ?? ''
  })
}

// 合并回记录（保存时）
function collectNavCardEditForm(): Record<string, string> {
  const out: Record<string, string> = {}
  navCardEditFields.forEach((f) => { out[f.field] = navCardEditForm[f.field] ?? '' })
  return out
}
// 桥梁资料卡查看分组（从 currentViewRecord.bridgeCard 读取）
const cardViewGroups = computed(() => {
  const c = (currentViewRecord.value as any)?.bridgeCard || {}
  const row = (labels: Array<[string, string]>) => labels.map(([label, key]) => ({ label, value: (c as any)[key] ?? '' }))
  return [
    {
      title: '一般资料',
      rows: row([
        ['管养单位', 'manageUnit'],
        ['养护单位', 'maintainUnit'],
        ['建设单位', 'buildUnit'],
        ['设计单位', 'designUnit'],
        ['监理单位', 'supervisorUnit'],
        ['施工单位', 'constructionUnit'],
        ['建成年月', 'buildDate'],
        ['总造价(元)', 'totalCost'],
        ['养护类别', 'maintainGrade'],
        ['养护等级', 'maintainLevel'],
        ['道路等级', 'roadGrade'],
        ['结构类型', 'structureType'],
        ['设计荷载', 'designLoad'],
        ['限载标准(t)', 'limitLoad'],
        ['抗震烈度', 'seismicIntensity'],
        ['正斜交角(°)', 'skewAngle'],
        ['桥梁跨数', 'bridgeSpans'],
        ['跨径组合(m)', 'spanCombination'],
        ['桥面面积(m²)', 'deckArea'],
        ['桥梁总长(m)', 'bridgeTotalLength'],
        ['桥梁总宽(m)', 'bridgeTotalWidth'],
        ['车行道净宽(m)', 'carriagewayWidth'],
        ['人行道净宽(m)', 'sidewalkWidth'],
        ['河道等级', 'riverGrade'],
        ['最高水位(m)', 'highestWaterLevel'],
        ['常水位(m)', 'normalWaterLevel'],
      ]),
    },
    {
      title: '上部结构',
      rows: row([
        ['主梁形式', 'girderForm'],
        ['主梁尺寸（宽×高×长）(m)', 'girderSize'],
        ['主梁数量', 'girderCount'],
        ['横梁形式', 'crossBeamForm'],
        ['主跨桥下净空(m)', 'mainSpanClearance'],
        ['桥下限高(m)', 'bridgeClearHeight'],
        ['拱桥矢跨比', 'archRiseSpanRatio'],
        ['支座型式', 'bearingType'],
        ['支座数量', 'bearingCount'],
        ['桥面结构', 'deckStructure'],
        ['桥面铺装厚度(cm)', 'deckPavementThickness'],
        ['伸缩缝型式', 'expansionJointType'],
        ['伸缩缝数量(m)', 'expansionJointCount'],
        ['主桥纵坡(%)', 'mainBridgeLongitudinalSlope'],
        ['主桥横坡(%)', 'mainBridgeTransverseSlope'],
        ['引桥纵坡(%)', 'approachBridgeLongitudinalSlope'],
        ['引桥横坡(%)', 'approachBridgeTransverseSlope'],
      ]),
    },
    {
      title: '下部结构-桥墩',
      rows: row([
        ['形式', 'pierForm'],
        ['桥墩数量', 'pierCount'],
        ['桥墩标高(m)', 'pierElevation'],
        ['盖梁尺寸(m)', 'capBeamSize'],
        ['基底标高(m)', 'pierBaseElevation'],
        ['底板尺寸(m)', 'pierBaseplateSize'],
        ['基桩尺寸(m)', 'pierPileSize'],
        ['基桩根数', 'pierPileCount'],
      ]),
    },
    {
      title: '下部结构-桥台',
      rows: row([
        ['形式', 'abutmentForm'],
        ['桥台数量', 'abutmentCount'],
        ['桥台标高(m)', 'abutmentElevation'],
        ['基底标高(m)', 'abutmentBaseElevation'],
        ['台帽尺寸(m)', 'capSize'],
        ['底板尺寸(m)', 'abutmentBaseplateSize'],
        ['基桩尺寸(m)', 'abutmentPileSize'],
        ['基桩根数', 'abutmentPileCount'],
        ['挡土板厚度(cm)', 'retainingPlateThickness'],
        ['翼墙形式', 'wingWallForm'],
        ['翼墙长度(m)', 'wingWallLength'],
      ]),
    },
    {
      title: '附属工程',
      rows: row([
        ['集水口尺寸(mm)', 'collectorSize'],
        ['集水口数量', 'collectorCount'],
        ['泄水管尺寸(mm)', 'drainPipeSize'],
        ['泄水管长度(m)', 'drainPipeLength'],
        ['栏杆总长(m)', 'railingTotalLength'],
        ['栏杆结构', 'railingStructure'],
        ['端柱尺寸(m)', 'endColumnSize'],
        ['护岸类型', 'bankProtectionType'],
        ['引坡挡墙类型', 'approachRetainingWallType'],
      ]),
    },
    {
      title: '上部结构',
      rows: row([
        ['主梁形式', 'girderForm'],
        ['主梁尺寸（宽×高×长）', 'girderSize'],
        ['主梁数量', 'girderCount'],
        ['横梁形式', 'crossBeamForm'],
        ['主跨桥下净空', 'mainSpanClearance'],
        ['桥下限高', 'bridgeClearHeight'],
        ['拱桥矢跨比', 'archRiseSpanRatio'],
        ['支座型式', 'bearingType'],
        ['支座数量', 'bearingCount'],
        ['桥面结构', 'deckStructure'],
        ['桥面铺装厚度', 'deckPavementThickness'],
        ['伸缩缝型式', 'expansionJointType'],
        ['伸缩缝数量', 'expansionJointCount'],
        ['主桥纵坡', 'mainBridgeLongitudinalSlope'],
        ['主桥横坡', 'mainBridgeTransverseSlope'],
        ['引桥纵坡', 'approachBridgeLongitudinalSlope'],
        ['引桥横坡', 'approachBridgeTransverseSlope'],
      ]),
    },
    {
      title: '下部结构-桥墩',
      rows: row([
        ['形式', 'pierForm'],
        ['桥墩数量', 'pierCount'],
        ['桥墩标高', 'pierElevation'],
        ['盖梁尺寸', 'capBeamSize'],
        ['基底标高', 'pierBaseElevation'],
        ['底板尺寸', 'pierBaseplateSize'],
        ['基桩尺寸', 'pierPileSize'],
        ['基桩根数', 'pierPileCount'],
      ]),
    },
    {
      title: '下部结构-桥台',
      rows: row([
        ['形式', 'abutmentForm'],
        ['桥台数量', 'abutmentCount'],
        ['桥台标高', 'abutmentElevation'],
        ['基底标高', 'abutmentBaseElevation'],
        ['台帽尺寸', 'capSize'],
        ['底板尺寸', 'abutmentBaseplateSize'],
        ['基桩尺寸', 'abutmentPileSize'],
        ['基桩根数', 'abutmentPileCount'],
        ['挡土板厚度', 'retainingPlateThickness'],
        ['翼墙形式', 'wingWallForm'],
        ['翼墙长度', 'wingWallLength'],
      ]),
    },
    {
      title: '附属工程',
      rows: row([
        ['集水口尺寸', 'collectorSize'],
        ['集水口数量', 'collectorCount'],
        ['泄水管尺寸', 'drainPipeSize'],
        ['泄水管长度', 'drainPipeLength'],
        ['栏杆总长', 'railingTotalLength'],
        ['栏杆结构', 'railingStructure'],
        ['端柱尺寸', 'endColumnSize'],
        ['护岸类型', 'bankProtectionType'],
        ['引坡挡墙类型', 'approachRetainingWallType'],
      ]),
    },
    {
      title: '附挂管线',
      rows: [
        { label: '给水管', value: (c as any)?.attachedPipe?.waterPipe ?? '' },
        { label: '燃气管', value: (c as any)?.attachedPipe?.gasPipe ?? '' },
        { label: '电力缆', value: (c as any)?.attachedPipe?.powerCable ?? '' },
        { label: '通信电缆', value: (c as any)?.attachedPipe?.telecomCable ?? '' },
      ],
    },
  ]
})

// 桥梁资料卡：顶部基础信息区（对齐线上）
const cardBasicInfo = computed(() => {
  const c = (currentViewRecord.value as any)?.bridgeCard || {}
  return {
    name: (currentViewRecord.value as any)?.name || c.cardName || '',
    roadName: c.roadName || '',
    cross: c.crossLevel || '',
    grade: c.roadGrade || c.maintainLevel || '',
    location: c.cardLocation || '',
  }
})

// 桥梁资料卡：桥梁概况
const cardText = computed(() => {
  const c = (currentViewRecord.value as any)?.bridgeCard || {}
  return { overview: c.overview || '' }
})

// 桥梁资料卡：制表信息
const cardTextInfo = computed(() => {
  const c = (currentViewRecord.value as any)?.bridgeCard || {}
  return { audit: c.audit || '', review: c.review || '', draft: c.draft || '', cardDate: c.cardDate || '' }
})

// 子桥资料卡：顶部基础信息区（index: 0/1）
function subBasicInfo(index: number) {
  const subBridges = (currentViewRecord.value as any)?.subBridges || []
  const sub = subBridges[index]
  const c = sub?.card || {}
  return {
    name: c.cardName || sub?.name || '',
    roadName: c.roadName || '',
    cross: c.crossLevel || '',
    grade: c.roadGrade || c.maintainLevel || '',
    location: c.cardLocation || '',
  }
}

// ==================== 子桥资料卡（查看模式） ====================

// ==================== 子桥资料卡（编辑模式，对齐线上：每行3字段） ====================
// 子桥编辑表单列表：每个子桥一个 reactive 对象
const subCardEditForms = reactive<Record<string, Record<string, any>>>({})

// 子桥 tab 列表（编辑/新增模式动态渲染）
const subCardFormKeys = computed(() => {
  return Object.keys(subCardEditForms).map((key, idx) => ({ key, label: `子桥${idx + 1}资料卡` }))
})

// 监听子桥表单结构类型字段变化，联动基础信息结构类型（对齐线上行为）
function watchStructureTypeFromSubCards() {
  if (fillingSubCardForms) { return }
  const base = (addForm.structureType as string) || ''
  // 保留基础信息中不属于子桥的结构项（如"测试-复兴大桥梁式桥"）
  const kept = base.split(';').map((p) => p.trim()).filter((p) => p && !/^子桥\d+/.test(p))
  Object.keys(subCardEditForms).forEach((key) => {
    const idx = parseInt(key.replace('sub', ''), 10)
    if (Number.isNaN(idx)) { return }
    const name = `子桥${idx + 1}`
    const st = (subCardEditForms[key].structureType as string) || ''
    kept.push(st ? `${name}${st}` : name)
  })
  const next = kept.join(';')
  if (next !== addForm.structureType) { addForm.structureType = next }
}

// 监听子桥表单结构类型字段变化，联动基础信息结构类型
watch(
  () => subCardEditForms,
  () => { watchStructureTypeFromSubCards() },
  { deep: true },
)

// 子桥编辑字段配置（对齐线上子桥3示例：每行3字段）
const subCardEditFields: Array<{ label: string; field: string; component?: any; disabled?: boolean; span?: number; props?: Record<string, any>; suffix?: string }> = [
  { label: '制表单位', field: 'unitName', span: 1 },
  // 一般资料
  { label: '桥梁名称', field: 'cardName', disabled: true },
  { label: '所在道路', field: 'roadName' },
  { label: '跨越等级', field: 'crossLevel' },
  { label: '桥梁位置', field: 'cardLocation' },
  { label: '管养单位', field: 'manageUnit' },
  { label: '养护单位', field: 'maintainUnit' },
  { label: '建设单位', field: 'buildUnit' },
  { label: '设计单位', field: 'designUnit' },
  { label: '监理单位', field: 'supervisorUnit' },
  { label: '施工单位', field: 'constructionUnit' },
  { label: '建成年月', field: 'buildDate' },
  { label: '总造价', field: 'totalLength' },
  { label: '养护类别', field: 'maintainGrade' },
  { label: '养护等级', field: 'maintainLevel' },
  { label: '道路等级', field: 'roadGrade' },
  { label: '结构类型', field: 'structureType' },
  { label: '设计荷载', field: 'loadGrade' },
  { label: '限载标准', field: 'limitLoad' },
  { label: '抗震烈度', field: 'checkWidth' },
  { label: '正斜交角', field: 'skewAngle' },
  { label: '桥梁跨数', field: 'spanCount' },
  { label: '跨径组合', field: 'spanCombination' },
  { label: '桥面面积', field: 'deckLength' },
  { label: '桥梁总长', field: 'bridgeTotalLength' },
  { label: '桥梁总宽', field: 'bridgeTotalWidth' },
  { label: '车行道净宽', field: 'carriagewayWidth' },
  { label: '人行道净宽', field: 'sidewalkWidth' },
  { label: '河道等级', field: 'riverGrade' },
  { label: '最高水位', field: 'highestWaterLevel' },
  { label: '常水位', field: 'normalWaterLevel' },
  // 上部结构
  { label: '主梁形式', field: 'girderForm' },
  { label: '主梁尺寸', field: 'girderSize' },
  { label: '主梁数量', field: 'girderCount' },
  { label: '横梁形式', field: 'crossBeamForm' },
  { label: '主跨桥下净空', field: 'mainSpanClearance' },
  { label: '桥下限高', field: 'bridgeClearHeight' },
  { label: '拱桥矢跨比', field: 'archRiseSpanRatio' },
  { label: '支座型式', field: 'bearingType' },
  { label: '支座数量', field: 'bearingCount' },
  { label: '桥面结构', field: 'deckStructure' },
  { label: '桥面铺装厚度', field: 'deckPavementThickness' },
  { label: '伸缩缝型式', field: 'expansionJointType' },
  { label: '伸缩缝数量', field: 'expansionJointCount' },
  { label: '主桥纵坡', field: 'mainBridgeLongitudinalSlope' },
  { label: '主桥横坡', field: 'mainBridgeTransverseSlope' },
  { label: '引桥纵坡', field: 'approachBridgeLongitudinalSlope' },
  { label: '引桥横坡', field: 'approachBridgeTransverseSlope' },
  // 下部结构-桥墩
  { label: '桥墩形式', field: 'pierForm' },
  { label: '桥墩数量', field: 'pierCount' },
  { label: '桥墩标高', field: 'pierHeight' },
  { label: '盖梁尺寸', field: 'capBeamSize' },
  { label: '基底标高', field: 'pierBaseElevation' },
  { label: '底板尺寸', field: 'pierBaseplateSize' },
  { label: '基桩尺寸', field: 'pierPileSize' },
  { label: '基桩根数', field: 'pierPileCount' },
  // 下部结构-桥台
  { label: '桥台形式', field: 'abutmentForm' },
  { label: '桥台数量', field: 'abutmentCount' },
  { label: '桥台标高', field: 'abutmentElevation' },
  { label: '基底标高', field: 'abutmentBaseElevation' },
  { label: '台帽尺寸', field: 'capSize' },
  { label: '底板尺寸', field: 'abutmentBaseplateSize' },
  { label: '基桩尺寸', field: 'abutmentPileSize' },
  { label: '基桩根数', field: 'abutmentPileCount' },
  { label: '挡土板厚度', field: 'retainingPlateThickness' },
  { label: '翼墙形式', field: 'wingWallForm' },
  { label: '翼墙长度', field: 'wingWallLength' },
  // 附属工程
  { label: '集水口尺寸', field: 'collectorSize' },
  { label: '集水口数量', field: 'collectorCount' },
  { label: '泄水管尺寸', field: 'drainPipeSize' },
  { label: '泄水管长度', field: 'drainPipeLength' },
  { label: '栏杆总长', field: 'railingTotalLength' },
  { label: '栏杆结构', field: 'railingStructure' },
  { label: '端柱尺寸', field: 'endColumnSize' },
  { label: '护岸类型', field: 'bankProtectionType' },
  { label: '引坡挡墙类型', field: 'approachRetainingWallType' },
  // 附挂管线
  { label: '给水管', field: 'waterPipe' },
  { label: '燃气管', field: 'gasPipe' },
  { label: '电力缆', field: 'powerCable' },
  { label: '通信电缆', field: 'telecomCable' },
]

// 子桥分组配置（标题 + 字段范围索引，用于编辑表单分组渲染）
// 制表单位单独一行（index 0），其余分组3列
const subCardEditGroups = [
  { title: '制表单位', start: 0, end: 1, single: true },
  { title: '一般资料', start: 1, end: 30 },
  { title: '上部结构', start: 31, end: 47 },
  { title: '下部结构-桥墩', start: 48, end: 55 },
  { title: '下部结构-桥台', start: 56, end: 66 },
  { title: '附属工程', start: 67, end: 75 },
  { title: '附挂管线', start: 76, end: 79 },
]

// 是否正在批量填充子桥表单（避免 watch 误触发重建结构类型）
let fillingSubCardForms = false

// 从记录填充子桥编辑表单
function fillSubCardEditForms(record: BridgeItem | null) {
  fillingSubCardForms = true
  Object.keys(subCardEditForms).forEach((k) => { delete subCardEditForms[k] })
  const subBridges = (record as any)?.subBridges || []
  subBridges.forEach((sub: any, idx: number) => {
    const key = `sub${idx}`
    resetSubCardEditForm(key)
    const c = sub.card || {}
    subCardEditFields.forEach((f) => {
      // 附挂管线字段从 card.attachedPipe 嵌套对象读取
      if (['waterPipe', 'gasPipe', 'powerCable', 'telecomCable'].includes(f.field)) {
        subCardEditForms[key][f.field] = (c as any)?.attachedPipe?.[f.field] ?? ''
      } else {
        subCardEditForms[key][f.field] = (c as any)[f.field] ?? (sub as any)[f.field] ?? ''
      }
    })
  })
  fillingSubCardForms = false
}

// 新增子桥（点击"新增子桥资料卡"按钮）
function addSubCard() {
  const count = Object.keys(subCardEditForms).length
  const key = `sub${count}`
  resetSubCardEditForm(key)
  // 自动命名
  subCardEditForms[key].cardName = `子桥${count + 1}`
  subCardEditForms[key].unitName = '测试站桥'
  // 同步基础信息"结构类型"字段：追加 ;子桥N<子桥结构类型>（对齐线上行为）
  const subName = `子桥${count + 1}`
  const st = (subCardEditForms[key].structureType as string) || ''
  const stValue = st ? `${subName}${st}` : subName
  const base = (addForm.structureType as string) || ''
  const parts = base.split(';').map((p) => p.trim()).filter(Boolean)
  // 若已存在同名子桥结构项则移除旧值，避免重复追加
  const idx = parts.findIndex((p) => p.startsWith(`${subName}`))
  if (idx >= 0) { parts.splice(idx, 1) }
  parts.push(stValue)
  addForm.structureType = parts.join(';')
}

// 单个子桥编辑表单重置
function resetSubCardEditForm(key: string) {
  subCardEditForms[key] = {}
  subCardEditFields.forEach((f) => { subCardEditForms[key][f.field] = '' })
  subCardEditForms[key].unitName = ''
}

// 收集子桥编辑表单数据（提交时合并回记录）
function collectSubCardEditForms() {
  const out: Record<string, Record<string, any>> = {}
  Object.keys(subCardEditForms).forEach((key) => {
    const form = subCardEditForms[key]
    out[key] = {}
    subCardEditFields.forEach((f) => { out[key][f.field] = form[f.field] ?? '' })
  })
  return out
}

// 子桥编辑字段 → 3列表格数据（每行3组 label-value-label-value-label-value）
function subCardEditGridData(_key: string, start: number, end: number) {
  const slice = subCardEditFields.slice(start, end)
  const rows: Array<Record<string, any>> = []
  for (let i = 0; i < slice.length; i += 3) {
    const row: Record<string, any> = {}
    const cols = ['', '2', '3']
    cols.forEach((suffix, j) => {
      const f = slice[i + j]
      if (f) {
        row[`label${suffix}`] = f.label
        row[`field${suffix}`] = f.field
        row[`component${suffix}`] = f.component || AInput
        row[`disabled${suffix}`] = !!f.disabled
        row[`props${suffix}`] = f.props || {}
        row[`suffix${suffix}`] = f.suffix || ''
      }
    })
    rows.push(row)
  }
  return rows
}

// 子桥资料卡数据
function subCardData(record: BridgeItem | null, index: number) {
  const subBridges = (record as any)?.subBridges || []
  const sub = subBridges[index]
  if (!sub) return []
  // 若子桥有完整资料卡 card，展示完整资料卡
  if (sub.card) {
    const c = sub.card
    const row = (labels: Array<[string, string]>) => labels.map(([label, key]) => ({ label, value: (c as any)[key] ?? '' }))
    const groups = [
      { title: '一般资料', rows: row([
        ['管养单位', 'manageUnit'],
        ['养护单位', 'maintainUnit'],
        ['建设单位', 'buildUnit'],
        ['设计单位', 'designUnit'],
        ['监理单位', 'supervisorUnit'],
        ['施工单位', 'constructionUnit'],
        ['建成年月', 'buildDate'],
        ['总造价(元)', 'totalLength'],
        ['养护类别', 'maintainGrade'],
        ['养护等级', 'maintainLevel'],
        ['道路等级', 'roadGrade'],
        ['结构类型', 'structureType'],
        ['设计荷载', 'loadGrade'],
        ['限载标准(t)', 'limitLoad'],
        ['抗震烈度', 'checkWidth'],
        ['正斜交角(°)', 'skewAngle'],
        ['桥梁跨数', 'spanCount'],
        ['跨径组合(m)', 'spanCombination'],
        ['桥面面积(m²)', 'deckLength'],
        ['桥梁总长(m)', 'bridgeTotalLength'],
        ['桥梁总宽(m)', 'bridgeTotalWidth'],
        ['车行道净宽(m)', 'carriagewayWidth'],
        ['人行道净宽(m)', 'sidewalkWidth'],
        ['河道等级', 'riverGrade'],
        ['最高水位(m)', 'highestWaterLevel'],
        ['常水位(m)', 'normalWaterLevel'],
      ]) },
      { title: '上部结构', rows: row([
        ['主梁形式', 'girderForm'],
        ['主梁尺寸（宽×高×长）(m)', 'girderSize'],
        ['主梁数量', 'girderCount'],
        ['横梁形式', 'crossBeamForm'],
        ['主跨桥下净空(m)', 'mainSpanClearance'],
        ['桥下限高(m)', 'bridgeClearHeight'],
        ['拱桥矢跨比', 'archRiseSpanRatio'],
        ['支座型式', 'bearingType'],
        ['支座数量', 'bearingCount'],
        ['桥面结构', 'deckStructure'],
        ['桥面铺装厚度(cm)', 'deckPavementThickness'],
        ['伸缩缝型式', 'expansionJointType'],
        ['伸缩缝数量(m)', 'expansionJointCount'],
        ['主桥纵坡(%)', 'mainBridgeLongitudinalSlope'],
        ['主桥横坡(%)', 'mainBridgeTransverseSlope'],
        ['引桥纵坡(%)', 'approachBridgeLongitudinalSlope'],
        ['引桥横坡(%)', 'approachBridgeTransverseSlope'],
      ]) },
      { title: '下部结构-桥墩', rows: row([
        ['形式', 'pierForm'],
        ['桥墩数量', 'pierCount'],
        ['桥墩标高(m)', 'pierHeight'],
        ['盖梁尺寸(m)', 'capBeamSize'],
        ['基底标高(m)', 'pierBaseElevation'],
        ['底板尺寸(m)', 'pierBaseplateSize'],
        ['基桩尺寸(m)', 'pierPileSize'],
        ['基桩根数', 'pierPileCount'],
      ]) },
      { title: '下部结构-桥台', rows: row([
        ['形式', 'abutmentForm'],
        ['桥台数量', 'abutmentCount'],
        ['桥台标高(m)', 'abutmentElevation'],
        ['基底标高(m)', 'abutmentBaseElevation'],
        ['台帽尺寸(m)', 'capSize'],
        ['底板尺寸(m)', 'abutmentBaseplateSize'],
        ['基桩尺寸(m)', 'abutmentPileSize'],
        ['基桩根数', 'abutmentPileCount'],
        ['挡土板厚度(cm)', 'retainingPlateThickness'],
        ['翼墙形式', 'wingWallForm'],
        ['翼墙长度(m)', 'wingWallLength'],
      ]) },
      { title: '附属工程', rows: row([
        ['集水口尺寸(mm)', 'collectorSize'],
        ['集水口数量', 'collectorCount'],
        ['泄水管尺寸(mm)', 'drainPipeSize'],
        ['泄水管长度(m)', 'drainPipeLength'],
        ['栏杆总长(m)', 'railingTotalLength'],
        ['栏杆结构', 'railingStructure'],
        ['端柱尺寸(m)', 'endColumnSize'],
        ['护岸类型', 'bankProtectionType'],
        ['引坡挡墙类型', 'approachRetainingWallType'],
      ]) },
      {
        title: '附挂管线',
        rows: [
          { label: '给水管', value: (c as any)?.attachedPipe?.waterPipe ?? '' },
          { label: '燃气管', value: (c as any)?.attachedPipe?.gasPipe ?? '' },
          { label: '电力缆', value: (c as any)?.attachedPipe?.powerCable ?? '' },
          { label: '通信电缆', value: (c as any)?.attachedPipe?.telecomCable ?? '' },
        ],
      },
    ]
    return groups
  }
  // 无完整资料卡时，退回简单信息（单分组）
  return [
    {
      title: '子桥信息',
      rows: [
        { label: '子桥名称', value: sub.name || '' },
        { label: '结构类型', value: sub.structureType || '' },
        { label: '养护等级', value: sub.maintainGrade || '' },
        { label: '跨径', value: sub.span || '' },
        { label: '全长', value: sub.length || '' },
        { label: '桥宽', value: sub.width || '' },
        { label: '建成年月', value: sub.buildDate || '' },
      ],
    },
  ]
}

// ==================== 人行天桥资料卡（查看 + 编辑模式，导则表A.2） ====================

// 查看模式分组数据（从 currentViewRecord.overpassCard 读取）
const overpassViewGroups = computed(() => {
  const c = (currentViewRecord.value as any)?.overpassCard || {}
  const row = (labels: Array<[string, string]>) => labels.map(([label, key]) => ({ label, value: (c as any)[key] ?? '' }))
  return [
    {
      title: '一般资料',
      rows: row([
        ['人行天桥名称', 'name'],
        ['所在路名', 'roadName'],
        ['地区', 'district'],
        ['卡号', 'cardNo'],
        ['管理单位', 'manageUnit'],
        ['建设单位', 'buildUnit'],
        ['设计单位', 'designUnit'],
        ['监理单位', 'supervisorUnit'],
        ['施工单位', 'constructionUnit'],
        ['建造年月', 'buildDate'],
        ['结构类型', 'structureType'],
        ['设计荷载', 'designLoad'],
        ['抗震烈度', 'seismicIntensity'],
        ['桥长(m)', 'bridgeLength'],
        ['通道总宽(m)', 'passageWidth'],
        ['车行道宽', 'carriagewayWidth'],
        ['人行道宽(m)', 'sidewalkWidth'],
        ['设计净高(m)', 'designClearHeight'],
      ]),
    },
    {
      title: '天桥土建',
      rows: row([
        ['上部结构', 'superstructure'],
        ['下部结构', 'substructure'],
        ['桥面装修面积(m²)', 'deckDecorationArea'],
        ['人行道铺装', 'sidewalkPavement'],
        ['伸缩缝形式', 'expansionJointType'],
        ['沉降缝数量', 'settlementJointCount'],
        ['栏杆结构', 'railingStructure'],
        ['栏杆总长(m)', 'railingTotalLength'],
        ['支座数量(个)', 'bearingCount'],
        ['道路横坡', 'roadTransverseSlope'],
        ['排水设施', 'drainageFacility'],
      ]),
    },
    {
      title: '附属设施',
      rows: row([
        ['照明设施名称', 'lightingName'],
        ['照明设施数量', 'lightingCount'],
        ['供电设施名称', 'powerName'],
        ['供电设施数量', 'powerCount'],
        ['消防设施名称', 'fireFightingName'],
        ['消防设施数量', 'fireFightingCount'],
        ['自动扶梯厂家', 'escalatorBrand'],
        ['自动扶梯数量', 'escalatorCount'],
        ['垂直电梯厂家', 'elevatorBrand'],
        ['垂直电梯数量', 'elevatorCount'],
      ]),
    },
    {
      title: '制表信息',
      rows: row([
        ['审定', 'audit'],
        ['复核', 'review'],
        ['制表', 'draft'],
        ['日期', 'cardDate'],
      ]),
    },
  ]
})

// 编辑模式表单
const overpassCardForm = reactive<Record<string, any>>({})

function resetOverpassCardForm() {
  Object.keys(overpassCardForm).forEach((k) => { overpassCardForm[k] = '' })
  overpassEditFields.forEach((f) => { overpassCardForm[f.field] = '' })
}

function fillOverpassCardFromRecord(record: BridgeItem) {
  resetOverpassCardForm()
  const c = (record as any).overpassCard || {}
  overpassEditFields.forEach((f) => {
    overpassCardForm[f.field] = c[f.field] ?? ''
  })
  overpassCardForm.name = record.name || ''
}

// 编辑字段配置
const overpassEditFields: Array<{ label: string; field: string; component?: any; disabled?: boolean; props?: Record<string, any>; suffix?: string }> = [
  // 一般资料（18字段）
  { label: '人行天桥名称', field: 'name', disabled: true },
  { label: '所在路名', field: 'roadName' },
  { label: '地区', field: 'district' },
  { label: '卡号', field: 'cardNo' },
  { label: '管理单位', field: 'manageUnit' },
  { label: '建设单位', field: 'buildUnit' },
  { label: '设计单位', field: 'designUnit' },
  { label: '监理单位', field: 'supervisorUnit' },
  { label: '施工单位', field: 'constructionUnit' },
  { label: '建造年月', field: 'buildDate', component: ADatePicker, props: { valueFormat: 'YYYY-MM-DD' } },
  { label: '结构类型', field: 'structureType' },
  { label: '设计荷载', field: 'designLoad' },
  { label: '抗震烈度', field: 'seismicIntensity' },
  { label: '桥长(m)', field: 'bridgeLength', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '通道总宽', field: 'passageWidth', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '车行道宽', field: 'carriagewayWidth' },
  { label: '人行道宽', field: 'sidewalkWidth', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '设计净高(m)', field: 'designClearHeight', suffix: 'm', props: { addonAfter: 'm' } },
  // 天桥土建（11字段）
  { label: '上部结构', field: 'superstructure' },
  { label: '下部结构', field: 'substructure' },
  { label: '桥面装修面积', field: 'deckDecorationArea', suffix: 'm²', props: { addonAfter: 'm²' } },
  { label: '人行道铺装', field: 'sidewalkPavement' },
  { label: '伸缩缝形式', field: 'expansionJointType' },
  { label: '沉降缝数量', field: 'settlementJointCount' },
  { label: '栏杆结构', field: 'railingStructure' },
  { label: '栏杆总长', field: 'railingTotalLength', suffix: 'm', props: { addonAfter: 'm' } },
  { label: '支座数量', field: 'bearingCount', suffix: '个', props: { addonAfter: '个' } },
  { label: '道路横坡', field: 'roadTransverseSlope' },
  { label: '排水设施', field: 'drainageFacility' },
  // 附属设施（10字段）
  { label: '照明设施名称', field: 'lightingName' },
  { label: '照明设施数量', field: 'lightingCount' },
  { label: '供电设施名称', field: 'powerName' },
  { label: '供电设施数量', field: 'powerCount' },
  { label: '消防设施名称', field: 'fireFightingName' },
  { label: '消防设施数量', field: 'fireFightingCount' },
  { label: '自动扶梯厂家', field: 'escalatorBrand' },
  { label: '自动扶梯数量', field: 'escalatorCount' },
  { label: '垂直电梯厂家', field: 'elevatorBrand' },
  { label: '垂直电梯数量', field: 'elevatorCount' },
]

const overpassEditGroups = [
  { title: '一般资料', start: 0, end: 18 },
  { title: '天桥土建', start: 18, end: 29 },
  { title: '附属设施', start: 29, end: 39 },
]

function overpassEditGridData(start: number, end: number) {
  const slice = overpassEditFields.slice(start, end)
  const rows: Array<Record<string, any>> = []
  for (let i = 0; i < slice.length; i += 3) {
    const row: Record<string, any> = {}
    const cols = ['', '2', '3']
    cols.forEach((suffix, j) => {
      const f = slice[i + j]
      if (f) {
        row[`label${suffix}`] = f.label
        row[`field${suffix}`] = f.field
        row[`component${suffix}`] = f.component || AInput
        row[`disabled${suffix}`] = !!f.disabled
        row[`props${suffix}`] = f.props || {}
        row[`suffix${suffix}`] = f.suffix || ''
      }
    })
    rows.push(row)
  }
  return rows
}

// ==================== 检测整改记录（查看模式） ====================
const bridgeInspectCols: any[] = [
  { title: '检测名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '检测时间', dataIndex: 'checkTime', key: 'checkTime', width: 120 },
  { title: '检测类型', dataIndex: 'detectType', key: 'detectType', width: 120 },
  { title: '整改类型', dataIndex: 'rectType', key: 'rectType', width: 120 },
  { title: '评价等级', dataIndex: 'evalLevel', key: 'evalLevel', width: 110 },
  { title: '整改销号结果', dataIndex: 'rectifyResult', key: 'rectifyResult', width: 150 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const },
]

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

    .search-toggle-icon {
      transition: transform 0.3s;
      margin-left: 4px;

      &-up {
        transform: rotate(180deg);
      }
    }
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
      flex-wrap: wrap;
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

// 新增桥梁弹窗样式
.add-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .add-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }

  .add-sub-card-btn {
    background: #2A64FF;
    border-color: #2A64FF;
    border-radius: 6px;
    font-size: 13px;
  }
}

.add-bridge-content {
  :deep(.ant-tabs) {
    .ant-tabs-nav {
      padding: 0 24px;
      margin-bottom: 0;

      &::before {
        border-bottom: 1px solid #f0f0f0;
      }
    }

    .ant-tabs-tab {
      font-size: 14px;
      padding: 12px 0;
    }

    .ant-tabs-content {
      padding: 0 24px;
    }
  }
}

.add-bridge-form {
  max-height: 520px;
  overflow-y: auto;
  padding: 16px 0;

  .form-section {
    margin-bottom: 24px;

    .form-section-title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 16px;
      padding-left: 10px;
      border-left: 3px solid #2A64FF;
    }
  }

  // 选择点位位置按钮
  .location-btn-item {
    :deep(.ant-form-item-control) {
      display: flex;
      align-items: center;
    }
  }

  .location-btn {
    white-space: nowrap;
    height: 28px;
    font-size: 12px;
    padding: 0 12px;
    border-radius: 4px;
    background: #2A64FF;
    border-color: #2A64FF;
  }

  // 三级责任体系 - 纵向堆叠块
  .responsibility-block {
    margin-bottom: 16px;

    .responsibility-sub-title {
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 12px;
      padding-left: 8px;
      border-left: 2px solid #d9d9d9;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }

  :deep(.ant-form-item-label > label) {
    font-weight: 500;
  }
}

// 桥梁资料卡表单样式
.bridge-card-form {
  max-height: 520px;
  overflow-y: auto;
  padding: 16px 0;

  .card-section {
    margin-bottom: 24px;

    .card-section-title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 3px solid #2A64FF;
    }
  }

  .card-table {
    :deep(.ant-table) {
      .ant-table-cell {
        padding: 0;
        vertical-align: middle;
      }
    }

    .card-cell-label {
      padding: 8px 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background: #fafafa;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 13px;
    }

    :deep(.ant-input),
    :deep(.ant-input-number),
    :deep(.ant-picker) {
      border: none;
      box-shadow: none;

      &:focus {
        box-shadow: none;
      }
    }

    :deep(.ant-input-affix-wrapper) {
      border: none;
      box-shadow: none;
    }
  }
}

// 查看模式资料卡（复用卡片分组样式）
.bridge-view-card,
.bridge-sub-card-form {
  max-height: 520px;
  overflow-y: auto;
  padding: 16px 0;

  // 通航资料卡查看模式
  &.nav-card-view {
    :deep(.ant-form-item) {
      margin-bottom: 16px;
    }

    :deep(.ant-form-item-label > label) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }

    // 超长标签字段：允许换行、加宽 label-col
    :deep(.nav-extra-long-label) {
      .ant-form-item-label {
        width: 240px !important;
        white-space: normal !important;
        line-height: 1.5 !important;

        > label {
          white-space: normal !important;
          word-break: break-all;
          height: auto !important;
        }
      }
    }

    :deep(.ant-radio-wrapper) {
      pointer-events: none;

      .ant-radio-input {
        cursor: default;
      }
    }
  }

  .card-top-form {
    margin-bottom: 24px;
    padding: 16px;
    border: 1px solid #f0f0f0;
    border-radius: 4px;

    :deep(.ant-form-item) {
      margin-bottom: 16px;
    }

    :deep(.ant-form-item-label > label) {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .card-section {
    margin-bottom: 24px;

    .card-section-title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 3px solid #2A64FF;
    }

    :deep(.ant-descriptions-item-label) {
      font-weight: 500;
      background: #fafafa;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .card-empty-hint {
    padding: 12px 16px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
  }

  .card-table {
    :deep(.ant-table) {
      .ant-table-cell {
        padding: 0;
        vertical-align: middle;
      }
    }

    .card-cell-label {
      padding: 8px 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background: #fafafa;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }
}

// 子桥资料卡编辑表单
.bridge-sub-card-edit {
  max-height: 520px;
  overflow-y: auto;
  padding: 16px 0;

  .card-section {
    margin-bottom: 24px;

    .card-section-title {
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 3px solid #2A64FF;
    }
  }

  .card-table {
    :deep(.ant-table) {
      .ant-table-cell {
        padding: 0;
        vertical-align: middle;
      }
    }

    .card-cell-label {
      padding: 8px 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      background: #fafafa;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 13px;
    }
  }

  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
}

.add-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;

  .ant-btn-primary {
    background: #2A64FF;
    border-color: #2A64FF;
  }
}

// 桥梁地图弹窗
.bridge-map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  background: #fafafa;
  border-radius: 4px;
}
</style>

<!-- 批量填写弹窗样式（不受 scoped 限制，因 modal 传送到 body） -->
<style lang="scss">
.batch-fill-modal {
  .add-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .add-modal-title {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  .add-bridge-form {
    max-height: 520px;
    overflow-y: auto;
    padding: 16px 24px;

    .form-section {
      margin-bottom: 24px;

      .form-section-title {
        font-size: 16px;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
        padding-left: 10px;
        border-left: 3px solid #2A64FF;
      }
    }

    .ant-form-item {
      margin-bottom: 16px;
    }

    .ant-form-item-label > label {
      font-weight: 500;
    }
  }

  .add-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;

    .ant-btn-primary {
      background: #2A64FF;
      border-color: #2A64FF;
    }
  }
}
</style>
