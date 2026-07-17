<template>
  <div class="online-projects-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <HomeOutlined />
          <span>首页</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>在线项目</a-breadcrumb-item>
        <a-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- 搜索筛选区域 -->
    <div class="search-section">
      <a-form :model="searchForm" layout="inline">
        <a-form-item v-if="pageConfig.showFilter('region')" label="归属地区">
          <a-select v-model:value="searchForm.region" placeholder="请选择归属地区" style="width: 200px" allow-clear>
            <a-select-option v-for="item in regionOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('name')" :label="pageConfig.nameLabel">
          <a-input v-model:value="searchForm.name" :placeholder="`请输入${pageConfig.nameLabel}`" style="width: 200px" allow-clear />
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('projectName')" label="项目名称">
          <a-input v-model:value="searchForm.projectName" placeholder="请输入项目名称" style="width: 200px" allow-clear />
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('year')" label="项目年份">
          <a-select v-model:value="searchForm.year" placeholder="请选择项目年份" style="width: 200px" allow-clear>
            <a-select-option value="2022">2022</a-select-option>
            <a-select-option value="2023">2023</a-select-option>
            <a-select-option value="2024">2024</a-select-option>
            <a-select-option value="2025">2025</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('grade')" :label="pageConfig.gradeLabel">
          <a-select v-model:value="searchForm.grade" :placeholder="`请选择${pageConfig.gradeLabel}`" style="width: 200px" allow-clear>
            <a-select-option v-for="item in pageConfig.gradeOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('evalLevel')" :label="pageConfig.evalLabel">
          <a-select v-model:value="searchForm.evalLevel" :placeholder="`请选择${pageConfig.evalLabel}`" style="width: 200px" allow-clear>
            <a-select-option v-for="item in pageConfig.evalOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('tunnelClassify')" label="城市道路隧道分类">
          <a-select v-model:value="searchForm.tunnelClassify" placeholder="请选择城市道路隧道分类" style="width: 200px" allow-clear>
            <a-select-option v-for="item in tunnelClassifyOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('rectified')" label="是否已整改">
          <a-select v-model:value="searchForm.rectified" placeholder="请选择是否已整改" style="width: 200px" allow-clear>
            <a-select-option value="是">是</a-select-option>
            <a-select-option value="否">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showFilter('keyFocus')" label="是否重点关注">
          <a-select v-model:value="searchForm.keyFocus" placeholder="请选择是否重点关注" style="width: 200px" allow-clear>
            <a-select-option value="是">是</a-select-option>
            <a-select-option value="否">否</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="resetSearch">重置</a-button>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 操作栏 -->
    <div class="table-toolbar">
      <div class="toolbar-left">
        <a-button v-if="pageConfig.showAdd" type="primary" @click="handleAdd">+ 新增项目</a-button>
        <a-button @click="handleExport">导出</a-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-card">
      <a-table
        :columns="pageConfig.columns"
        :data-source="filteredData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }"
        size="small"
        row-key="id"
        bordered
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'isKeyFocus'">
            <a-button 
              type="text" 
              size="small" 
              @click="handleToggleKeyFocus(record)"
              :style="{ color: record.isKeyFocus ? '#faad14' : '#d9d9d9', fontSize: '18px' }"
            >
              <StarOutlined />
            </a-button>
          </template>
          <template v-else-if="column.key === 'rectified'">
            <a-tag :color="record.rectified === '是' ? 'green' : 'red'">{{ record.rectified }}</a-tag>
          </template>
          <template v-else-if="column.key === 'relatedRiskRoad' || column.key === 'relatedNewRoad'">
            <!-- 道路页面：显示数量 -->
            <a v-if="record.relatedRoadDetailList && record.relatedRoadDetailList.length > 0" @click="handleViewRelatedRoads(record)" style="color: #1890ff; cursor: pointer;">{{ record.relatedRoadDetailList.length }}</a>
            <span v-else>0</span>
          </template>
          <template v-else-if="column.key === 'relatedNewBridge' || column.key === 'relatedNewTunnel'">
            <!-- 桥梁/隧道页面：显示名称列表 -->
            <div v-if="record.relatedRoadDetailList && record.relatedRoadDetailList.length > 0">
              <a-tag 
                v-for="(item, idx) in record.relatedRoadDetailList" 
                :key="idx" 
                style="margin-bottom: 4px; cursor: pointer;"
                @click="handleViewRelatedRoads(record)"
              >
                {{ item.name }}
              </a-tag>
            </div>
            <span v-else>-</span>
          </template>
          <template v-else-if="column.key === 'projectStatus'">
            <a-tag :color="record.projectStatus === '完工' ? 'blue' : record.projectStatus === '已开工' ? 'green' : 'orange'">{{ record.projectStatus }}</a-tag>
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

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="600px"
      @ok="handleModalOk"
      @cancel="modalVisible = false"
    >
      <a-form :model="formData" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="归属地区">
          <a-select v-model:value="formData.region" placeholder="请选择归属地区">
            <a-select-option v-for="item in regionOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="pageConfig.nameLabel">
          <a-input v-model:value="formData.name" :placeholder="`请输入${pageConfig.nameLabel}`" />
        </a-form-item>
        <a-form-item v-if="pageConfig.showAdd" label="项目类型">
          <a-select v-model:value="formData.type" placeholder="请选择项目类型">
            <a-select-option v-for="item in typeOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showAdd" label="项目年份">
          <a-select v-model:value="formData.year" placeholder="请选择项目年份">
            <a-select-option value="2022">2022</a-select-option>
            <a-select-option value="2023">2023</a-select-option>
            <a-select-option value="2024">2024</a-select-option>
            <a-select-option value="2025">2025</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="pageConfig.showAdd" label="总投资(万元)">
          <a-input-number v-model:value="formData.investment" placeholder="请输入总投资" style="width: 100%" :min="0" />
        </a-form-item>
        <a-form-item v-if="pageConfig.showAdd" label="项目状态">
          <a-select v-model:value="formData.status" placeholder="请选择项目状态">
            <a-select-option value="前期">前期</a-select-option>
            <a-select-option value="已开工">已开工</a-select-option>
            <a-select-option value="完工">完工</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 风险设施编辑弹窗 -->
    <a-modal
      v-model:open="riskEditVisible"
      title="编辑"
      width="750px"
      @ok="handleRiskEditOk"
      @cancel="riskEditVisible = false"
    >
      <a-descriptions :column="2" bordered size="small">
        <template v-for="field in riskEditFields" :key="field.key">
          <a-descriptions-item :label="field.label" :span="field.span || 1">
            <a-input
              v-if="field.editable"
              v-model:value="riskEditForm[field.key]"
              :placeholder="`请输入${field.label}`"
              size="small"
            />
            <span v-else class="edit-disabled-text">{{ riskEditForm[field.key] || '-' }}</span>
          </a-descriptions-item>
        </template>
      </a-descriptions>
    </a-modal>

    <!-- 改造项目新增/编辑/查看弹窗 -->
    <a-modal
      v-model:open="renovationModalVisible"
      :title="renovationModalTitle"
      width="900px"
      @ok="handleRenovationModalOk"
      @cancel="renovationModalVisible = false"
      :footer="renovationModalMode === 'view' ? null : undefined"
    >
      <a-form :model="renovationForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="项目名称">
              <a-input v-model:value="renovationForm.projectName" placeholder="请输入项目名称" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="归属地区">
              <a-select v-model:value="renovationForm.region" placeholder="请选择归属地区" :disabled="renovationModalMode === 'view'">
                <a-select-option v-for="item in regionOptions" :key="item" :value="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目年份">
              <a-select v-model:value="renovationForm.year" placeholder="请选择项目年份" :disabled="renovationModalMode === 'view'">
                <a-select-option value="2022">2022</a-select-option>
                <a-select-option value="2023">2023</a-select-option>
                <a-select-option value="2024">2024</a-select-option>
                <a-select-option value="2025">2025</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建设单位">
              <a-input v-model:value="renovationForm.constructionUnit" placeholder="请输入建设单位" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="建设单位责任人">
              <a-input v-model:value="renovationForm.constructionContact" placeholder="请输入建设单位责任人" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="责任人联系方式">
              <a-input v-model:value="renovationForm.constructionPhone" placeholder="请输入联系方式" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="施工单位">
              <a-input v-model:value="renovationForm.contractor" placeholder="请输入施工单位" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="施工单位责任人">
              <a-input v-model:value="renovationForm.contractorContact" placeholder="请输入施工单位责任人" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="责任人联系方式">
              <a-input v-model:value="renovationForm.contractorPhone" placeholder="请输入联系方式" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="项目状态">
              <a-select v-model:value="renovationForm.projectStatus" placeholder="请选择项目状态" :disabled="renovationModalMode === 'view'">
                <a-select-option value="前期">前期</a-select-option>
                <a-select-option value="已开工">已开工</a-select-option>
                <a-select-option value="已完工">已完工</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划开工时间">
              <a-date-picker v-model:value="renovationForm.planStartDate" value-format="YYYY-MM-DD" placeholder="请选择开工日期" style="width: 100%" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="计划完工时间">
              <a-date-picker v-model:value="renovationForm.planEndDate" value-format="YYYY-MM-DD" placeholder="请选择完工日期" style="width: 100%" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="关联设施">
              <a-button v-if="renovationModalMode !== 'view'" type="primary" size="small" @click="handleSelectRiskRoad">{{ selectFacilityBtnText }}</a-button>
              <span v-if="renovationForm.relatedRiskRoad || renovationForm.relatedNewRoad || renovationForm.relatedNewBridge || renovationForm.relatedNewTunnel" style="margin-left: 8px; color: #1890ff;">{{ renovationForm.relatedRiskRoad || renovationForm.relatedNewRoad || renovationForm.relatedNewBridge || renovationForm.relatedNewTunnel }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

      <!-- 进度列表 -->
      <div style="margin: 12px 0 8px; font-weight: bold; font-size: 14px;">进度信息</div>
      <a-table
        :columns="progressColumns"
        :data-source="renovationForm.progressList"
        :pagination="false"
        size="small"
        bordered
        :row-key="(r: any) => r.key"
        :expandedRowKeys="expandedRowKeys"
        @expand="onExpandRow"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'totalRenovationLength'">
            <a-input-number v-model:value="record.totalRenovationLength" size="small" :min="0" style="width: 100%" @change="validateYearRenovationLength(record)" :disabled="renovationModalMode === 'view'" />
          </template>
          <template v-else-if="column.key === 'totalCompletedLength'">
            {{ computeTotalCompletedLength(record) }}
          </template>
          <template v-else-if="column.key === 'computedProgress'">
            <a-input v-model:value="record.computedProgress" size="small" placeholder="如：66.7%" :disabled="renovationModalMode === 'view'" />
          </template>
          <template v-else-if="column.key === 'statusDesc'">
            <a-input v-model:value="record.statusDesc" size="small" placeholder="请输入状态描述" :disabled="renovationModalMode === 'view'" />
          </template>
          <template v-else-if="column.key === 'computedPlannedInvestment'">
            <a-input-number v-model:value="record.computedPlannedInvestment" size="small" :min="0" style="width: 100%" @change="validateYearPlannedInvestment(record)" :disabled="renovationModalMode === 'view'" />
          </template>
          <template v-else-if="column.key === 'computedCompletedInvestment'">
            {{ computeCompletedInvestment(record) }}
          </template>
        </template>
        <template #expandedRowRender="{ record: facilityRecord }">
          <a-table
            :columns="yearDataColumns"
            :data-source="facilityRecord.yearData"
            :pagination="false"
            size="small"
            bordered
            :row-key="(_r: any, idx: number) => idx"
          >
            <template #bodyCell="{ column, record: yearRecord }">
              <template v-if="column.key === 'renovationLength'">
                <a-input-number v-model:value="yearRecord.renovationLength" size="small" :min="0" style="width: 100%" @change="validateYearRenovationLength(facilityRecord)" :disabled="renovationModalMode === 'view'" />
              </template>
              <template v-else-if="column.key === 'completedLength'">
                <a-input-number v-model:value="yearRecord.completedLength" size="small" :min="0" style="width: 100%" :disabled="renovationModalMode === 'view'" />
              </template>
              <template v-else-if="column.key === 'progress'">
                <a-input v-model:value="yearRecord.progress" size="small" placeholder="如：66.7%" :disabled="renovationModalMode === 'view'" />
              </template>
              <template v-else-if="column.key === 'statusDesc'">
                <a-input v-model:value="yearRecord.statusDesc" size="small" placeholder="请输入状态描述" :disabled="renovationModalMode === 'view'" />
              </template>
              <template v-else-if="column.key === 'plannedInvestment'">
                <a-input-number v-model:value="yearRecord.plannedInvestment" size="small" :min="0" style="width: 100%" @change="validateYearPlannedInvestment(facilityRecord)" :disabled="renovationModalMode === 'view'" />
              </template>
              <template v-else-if="column.key === 'completedInvestment'">
                <a-input-number v-model:value="yearRecord.completedInvestment" size="small" :min="0" style="width: 100%" :disabled="renovationModalMode === 'view'" />
              </template>
            </template>
          </a-table>
        </template>
      </a-table>

      <!-- 底部字段 -->
      <div style="margin: 16px 0 8px; font-weight: bold; font-size: 14px;">实际开完工信息</div>
      <a-form :model="renovationForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="实际开工时间">
              <a-date-picker v-model:value="renovationForm.actualStartDate" value-format="YYYY-MM-DD" placeholder="请选择实际开工日期" style="width: 100%" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="实际完工时间">
              <a-date-picker v-model:value="renovationForm.actualEndDate" value-format="YYYY-MM-DD" placeholder="选填" style="width: 100%" :disabled="renovationModalMode === 'view'" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="开工相关附件">
              <a-upload
                v-if="renovationModalMode !== 'view'"
                :file-list="startAttachmentFileList"
                :before-upload="() => false"
                @change="handleStartAttachmentChange"
              >
                <a-button><PlusOutlined />上传附件</a-button>
              </a-upload>
              <div v-else>
                <a-tag v-for="(file, idx) in startAttachmentFileList" :key="idx">{{ file.name }}</a-tag>
                <span v-if="startAttachmentFileList.length === 0" style="color: #999;">无附件</span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="完工相关附件">
              <a-upload
                v-if="renovationModalMode !== 'view'"
                :file-list="endAttachmentFileList"
                :before-upload="() => false"
                @change="handleEndAttachmentChange"
              >
                <a-button><PlusOutlined />上传附件</a-button>
              </a-upload>
              <div v-else>
                <a-tag v-for="(file, idx) in endAttachmentFileList" :key="idx">{{ file.name }}</a-tag>
                <span v-if="endAttachmentFileList.length === 0" style="color: #999;">无附件</span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!-- 查看关联设施弹窗 -->
    <a-modal
      v-model:open="viewRelatedRoadsVisible"
      title="查看关联设施"
      width="600px"
      :footer="null"
    >
      <a-table
        :columns="viewRelatedRoadsColumns"
        :data-source="viewRelatedRoadsList"
        :pagination="false"
        size="small"
        bordered
        :row-key="(_r: any, idx: number) => idx"
      />
    </a-modal>

    <!-- 关联问题设施选择弹窗 -->
    <a-modal
      v-model:open="riskSelectVisible"
      :title="`选择关联${renovationFacilityLabel}`"
      width="700px"
      @ok="handleRiskSelectOk"
      @cancel="riskSelectVisible = false"
    >
      <a-form layout="inline" style="margin-bottom: 12px;">
        <a-form-item label="归属地区">
          <a-select v-model:value="riskSelectFilter.region" placeholder="请选择归属地区" style="width: 150px" allow-clear>
            <a-select-option v-for="item in regionOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="renovationFacilityLabel + '名称'">
          <a-input v-model:value="riskSelectFilter.name" :placeholder="`请输入${renovationFacilityLabel}名称`" style="width: 150px" allow-clear />
        </a-form-item>
        <a-form-item v-if="pagePath.includes('/renovation-road') || pagePath.includes('/new-road')" label="道路等级">
          <a-select v-model:value="riskSelectFilter.grade" placeholder="请选择道路等级" style="width: 120px" allow-clear>
            <a-select-option value="快速路">快速路</a-select-option>
            <a-select-option value="主干路">主干路</a-select-option>
            <a-select-option value="次干路">次干路</a-select-option>
            <a-select-option value="支路">支路</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else-if="pagePath.includes('/new-bridge')" label="桥梁类型">
          <a-select v-model:value="riskSelectFilter.bridgeType" placeholder="请选择桥梁类型" style="width: 120px" allow-clear>
            <a-select-option value="特大桥">特大桥</a-select-option>
            <a-select-option value="大桥">大桥</a-select-option>
            <a-select-option value="中桥">中桥</a-select-option>
            <a-select-option value="小桥">小桥</a-select-option>
            <a-select-option value="高架桥">高架桥</a-select-option>
            <a-select-option value="立交桥">立交桥</a-select-option>
            <a-select-option value="其他">其他</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else-if="pagePath.includes('/new-tunnel')" label="隧道类型">
          <a-select v-model:value="riskSelectFilter.tunnelType" placeholder="请选择隧道类型" style="width: 120px" allow-clear>
            <a-select-option value="城市道路隧道">城市道路隧道</a-select-option>
            <a-select-option value="人行地道">人行地道</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else label="评价等级">
          <a-select v-model:value="riskSelectFilter.evalLevel" placeholder="请选择评价等级" style="width: 120px" allow-clear>
            <a-select-option value="A">A</a-select-option>
            <a-select-option value="B">B</a-select-option>
            <a-select-option value="C">C</a-select-option>
            <a-select-option value="D">D</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button @click="riskSelectFilter.region = undefined; riskSelectFilter.name = ''; riskSelectFilter.evalLevel = undefined; riskSelectFilter.grade = undefined; riskSelectFilter.bridgeType = undefined; riskSelectFilter.tunnelType = undefined">重置</a-button>
        </a-form-item>
      </a-form>
      <a-table
        :columns="riskSelectColumns"
        :data-source="filteredRiskSelectList"
        :pagination="false"
        size="small"
        :row-selection="riskSelectRowSelection"
        :row-key="(r: any) => r.id"
      />
    </a-modal>

    <!-- 查看详情弹窗 -->
    <a-modal
      v-model:open="detailVisible"
      title="查看详情"
      width="700px"
      :footer="null"
    >
      <a-descriptions :column="2" bordered size="small">
        <a-descriptions-item v-for="field in detailFields" :key="field.key" :label="field.label" :span="field.span || 1">
          {{ detailRecord[field.key] || '-' }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { HomeOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'

const route = useRoute()
const currentTitle = computed(() => (route.meta?.title as string) || '')
const currentType = computed(() => (route.meta?.type as string) || '')
const currentCategory = computed(() => (route.meta?.category as string) || '')

// 页面路径标识
const pagePath = computed(() => route.path)
const isRiskPage = computed(() => {
  const path = pagePath.value
  return path.includes('/risk-road') || path.includes('/risk-bridge') || path.includes('/risk-tunnel')
})

const isRenovationPage = computed(() => {
  const path = pagePath.value
  return path.includes('/renovation-road') || path.includes('/renovation-bridge') || path.includes('/renovation-tunnel') ||
         path.includes('/new-road') || path.includes('/new-bridge') || path.includes('/new-tunnel')
})

// ===================== 通用配置 =====================
const regionOptions = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']
const evalLevelOptions = ['A', 'B', 'C', 'D']
const tunnelClassifyOptions = ['特长隧道(L>3000m)', '长隧道(1000m<L≤3000m)', '中隧道(500m<L≤1000m)', '短隧道(L≤500m)']
const typeOptions = ['新建道路', '新建桥梁', '新建隧道', '问题道路改造', '问题桥梁改造', '问题隧道改造']

// ===================== 操作栏列（共用） =====================
const actionColumn = { title: '操作', key: 'action', width: 180, fixed: 'right' as const }

// ===================== 各页面列配置 =====================
const riskRoadColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '道路名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '道路等级', dataIndex: 'grade', key: 'grade', width: 120 },
  { title: '道路评价等级', dataIndex: 'evalLevel', key: 'evalLevel', width: 120 },
  { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem', width: 200 },
  { title: '检查单位', dataIndex: 'inspectUnit', key: 'inspectUnit', width: 150 },
  { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime', width: 120 },
  { title: '检查人', dataIndex: 'inspector', key: 'inspector', width: 100 },
  { title: '是否已整改', dataIndex: 'rectified', key: 'rectified', width: 100, align: 'center' as const },
  actionColumn,
]

const riskBridgeColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '桥梁名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '桥梁类型', dataIndex: 'bridgeType', key: 'bridgeType', width: 120 },
  { title: '桥梁评价等级', dataIndex: 'evalLevel', key: 'evalLevel', width: 120 },
  { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem', width: 200 },
  { title: '检查单位', dataIndex: 'inspectUnit', key: 'inspectUnit', width: 150 },
  { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime', width: 120 },
  { title: '检查人', dataIndex: 'inspector', key: 'inspector', width: 100 },
  { title: '是否已整改', dataIndex: 'rectified', key: 'rectified', width: 100, align: 'center' as const },
  actionColumn,
]

const riskTunnelColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 130 },
  { title: '隧道名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '隧道类型', dataIndex: 'tunnelType', key: 'tunnelType', width: 120 },
  { title: '城市道路隧道分类', dataIndex: 'tunnelClassify', key: 'tunnelClassify', width: 150 },
  { title: '隧道评价等级', dataIndex: 'evalLevel', key: 'evalLevel', width: 120 },
  { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem', width: 200 },
  { title: '检查单位', dataIndex: 'inspectUnit', key: 'inspectUnit', width: 150 },
  { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime', width: 120 },
  { title: '检查人', dataIndex: 'inspector', key: 'inspector', width: 100 },
  { title: '是否已整改', dataIndex: 'rectified', key: 'rectified', width: 100, align: 'center' as const },
  actionColumn,
]

const defaultColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '项目类型', dataIndex: 'type', key: 'type', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '总投资(万元)', dataIndex: 'investment', key: 'investment', width: 130, align: 'right' as const },
  { title: '项目状态', dataIndex: 'status', key: 'status', width: 100, align: 'center' as const },
  actionColumn,
]

// ===================== 改造项目列配置 =====================
const renovationRoadColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '重点关注', dataIndex: 'isKeyFocus', key: 'isKeyFocus', width: 80, align: 'center' as const },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '建设单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 180 },
  { title: '施工单位', dataIndex: 'contractor', key: 'contractor', width: 180 },
  { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
  { title: '计划完工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
  { title: '关联设施', dataIndex: 'relatedRiskRoad', key: 'relatedRiskRoad', width: 150 },
  { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', width: 100, align: 'center' as const },
  actionColumn,
]

const renovationBridgeColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '重点关注', dataIndex: 'isKeyFocus', key: 'isKeyFocus', width: 80, align: 'center' as const },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '建设单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 180 },
  { title: '施工单位', dataIndex: 'contractor', key: 'contractor', width: 180 },
  { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
  { title: '计划完工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
  { title: '关联设施', dataIndex: 'relatedNewBridge', key: 'relatedNewBridge', width: 150 },
  { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', width: 100, align: 'center' as const },
  actionColumn,
]

const renovationTunnelColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '重点关注', dataIndex: 'isKeyFocus', key: 'isKeyFocus', width: 80, align: 'center' as const },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '建设单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 180 },
  { title: '施工单位', dataIndex: 'contractor', key: 'contractor', width: 180 },
  { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
  { title: '计划完工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
  { title: '关联设施', dataIndex: 'relatedNewTunnel', key: 'relatedNewTunnel', width: 150 },
  { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', width: 100, align: 'center' as const },
  actionColumn,
]

// ===================== 新建项目列配置（同改造项目）=====================
const newRoadColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '重点关注', dataIndex: 'isKeyFocus', key: 'isKeyFocus', width: 80, align: 'center' as const },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '建设单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 180 },
  { title: '施工单位', dataIndex: 'contractor', key: 'contractor', width: 180 },
  { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
  { title: '计划完工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
  { title: '关联设施', dataIndex: 'relatedNewRoad', key: 'relatedNewRoad', width: 150 },
  { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', width: 100, align: 'center' as const },
  actionColumn,
]

const newBridgeColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '重点关注', dataIndex: 'isKeyFocus', key: 'isKeyFocus', width: 80, align: 'center' as const },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '建设单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 180 },
  { title: '施工单位', dataIndex: 'contractor', key: 'contractor', width: 180 },
  { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
  { title: '计划完工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
  { title: '关联设施', dataIndex: 'relatedNewBridge', key: 'relatedNewBridge', width: 150 },
  { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', width: 100, align: 'center' as const },
  actionColumn,
]

const newTunnelColumns = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 70, align: 'center' as const },
  { title: '重点关注', dataIndex: 'isKeyFocus', key: 'isKeyFocus', width: 80, align: 'center' as const },
  { title: '项目名称', dataIndex: 'projectName', key: 'projectName', width: 200 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 150 },
  { title: '项目年份', dataIndex: 'year', key: 'year', width: 100, align: 'center' as const },
  { title: '建设单位', dataIndex: 'constructionUnit', key: 'constructionUnit', width: 180 },
  { title: '施工单位', dataIndex: 'contractor', key: 'contractor', width: 180 },
  { title: '计划开工时间', dataIndex: 'planStartDate', key: 'planStartDate', width: 120 },
  { title: '计划完工时间', dataIndex: 'planEndDate', key: 'planEndDate', width: 120 },
  { title: '关联设施', dataIndex: 'relatedNewTunnel', key: 'relatedNewTunnel', width: 150 },
  { title: '项目状态', dataIndex: 'projectStatus', key: 'projectStatus', width: 100, align: 'center' as const },
  actionColumn,
]

// ===================== 页面配置 =====================
interface PageConfig {
  columns: any[]
  filters: string[]
  nameLabel: string
  gradeLabel: string
  evalLabel: string
  gradeOptions: string[]
  evalOptions: string[]
  showAdd: boolean
  showFilter: (key: string) => boolean
}

const riskRoadConfig: PageConfig = {
  columns: riskRoadColumns,
  filters: ['region', 'name', 'grade', 'evalLevel', 'rectified'],
  nameLabel: '道路名称',
  gradeLabel: '道路等级',
  evalLabel: '道路评价等级',
  gradeOptions: ['快速路', '主干路', '次干路', '支路'],
  evalOptions: ['D'],
  showAdd: false,
  showFilter: (key: string) => ['region', 'name', 'grade', 'evalLevel', 'rectified'].includes(key),
}

const riskBridgeConfig: PageConfig = {
  columns: riskBridgeColumns,
  filters: ['region', 'name', 'grade', 'evalLevel', 'rectified'],
  nameLabel: '桥梁名称',
  gradeLabel: '桥梁类型',
  evalLabel: '桥梁评价等级',
  gradeOptions: ['特大桥', '大桥', '中桥', '小桥'],
  evalOptions: ['D', 'E', '不合格'],
  showAdd: false,
  showFilter: (key: string) => ['region', 'name', 'grade', 'evalLevel', 'rectified'].includes(key),
}

const riskTunnelConfig: PageConfig = {
  columns: riskTunnelColumns,
  filters: ['region', 'name', 'grade', 'tunnelClassify', 'evalLevel', 'rectified'],
  nameLabel: '隧道名称',
  gradeLabel: '隧道类型',
  evalLabel: '隧道评价等级',
  gradeOptions: ['人行地道', '城市道路隧道'],
  evalOptions: ['D', 'E'],
  showAdd: false,
  showFilter: (key: string) => ['region', 'name', 'grade', 'tunnelClassify', 'evalLevel', 'rectified'].includes(key),
}

const defaultConfig: PageConfig = {
  columns: defaultColumns,
  filters: ['region', 'name', 'type', 'status'],
  nameLabel: '项目名称',
  gradeLabel: '项目类型',
  evalLabel: '项目状态',
  gradeOptions: typeOptions,
  evalOptions: ['A', 'B', 'C', 'D'],
  showAdd: true,
  showFilter: (key: string) => ['region', 'name', 'type', 'status'].includes(key),
}

// ===================== 改造项目页面配置 =====================
const renovationRoadConfig: PageConfig = {
  columns: renovationRoadColumns,
  filters: ['region', 'projectName', 'year', 'keyFocus'],
  nameLabel: '项目名称',
  gradeLabel: '',
  evalLabel: '',
  gradeOptions: [],
  evalOptions: [],
  showAdd: true,
  showFilter: (key: string) => ['region', 'projectName', 'year', 'keyFocus'].includes(key),
}

const renovationBridgeConfig: PageConfig = {
  columns: renovationBridgeColumns,
  filters: ['region', 'projectName', 'year', 'keyFocus'],
  nameLabel: '项目名称',
  gradeLabel: '',
  evalLabel: '',
  gradeOptions: [],
  evalOptions: [],
  showAdd: true,
  showFilter: (key: string) => ['region', 'projectName', 'year', 'keyFocus'].includes(key),
}

const renovationTunnelConfig: PageConfig = {
  columns: renovationTunnelColumns,
  filters: ['region', 'projectName', 'year', 'keyFocus'],
  nameLabel: '项目名称',
  gradeLabel: '',
  evalLabel: '',
  gradeOptions: [],
  evalOptions: [],
  showAdd: true,
  showFilter: (key: string) => ['region', 'projectName', 'year', 'keyFocus'].includes(key),
}

// ===================== 新建项目页面配置（同改造项目）=====================
const newRoadConfig: PageConfig = {
  columns: newRoadColumns,
  filters: ['region', 'projectName', 'year', 'keyFocus'],
  nameLabel: '项目名称',
  gradeLabel: '',
  evalLabel: '',
  gradeOptions: [],
  evalOptions: [],
  showAdd: true,
  showFilter: (key: string) => ['region', 'projectName', 'year', 'keyFocus'].includes(key),
}

const newBridgeConfig: PageConfig = {
  columns: newBridgeColumns,
  filters: ['region', 'projectName', 'year', 'keyFocus'],
  nameLabel: '项目名称',
  gradeLabel: '',
  evalLabel: '',
  gradeOptions: [],
  evalOptions: [],
  showAdd: true,
  showFilter: (key: string) => ['region', 'projectName', 'year', 'keyFocus'].includes(key),
}

const newTunnelConfig: PageConfig = {
  columns: newTunnelColumns,
  filters: ['region', 'projectName', 'year', 'keyFocus'],
  nameLabel: '项目名称',
  gradeLabel: '',
  evalLabel: '',
  gradeOptions: [],
  evalOptions: [],
  showAdd: true,
  showFilter: (key: string) => ['region', 'projectName', 'year', 'keyFocus'].includes(key),
}

const pageConfig = computed<PageConfig>(() => {
  const path = pagePath.value
  if (path.includes('/risk-road')) return riskRoadConfig
  if (path.includes('/risk-bridge')) return riskBridgeConfig
  if (path.includes('/risk-tunnel')) return riskTunnelConfig
  if (path.includes('/renovation-road')) return renovationRoadConfig
  if (path.includes('/renovation-bridge')) return renovationBridgeConfig
  if (path.includes('/renovation-tunnel')) return renovationTunnelConfig
  if (path.includes('/new-road')) return newRoadConfig
  if (path.includes('/new-bridge')) return newBridgeConfig
  if (path.includes('/new-tunnel')) return newTunnelConfig
  return defaultConfig
})

// ===================== 数据 =====================
interface RiskRow {
  id: number
  region: string
  name: string
  grade?: string
  bridgeType?: string
  tunnelType?: string
  tunnelClassify?: string
  evalLevel: string
  buildDate: string
  competentUnit: string
  manageUnit: string
  maintainUnit: string
  policeUnit: string
  roadLength?: string
  renovationLength?: string
  reportFile: string
  mainProblem: string
  inspectUnit: string
  inspectTime: string
  inspector: string
  rectified: string
  rectifyMaterial: string
}

interface ProjectRow {
  id: number
  region: string
  name: string
  type: string
  year: string
  investment: number
  status: string
}

// ===================== 改造项目数据接口 =====================
interface RelatedRoadItem {
  name: string
  region: string
  grade?: string
  roadLength?: string
  bridgeType?: string
  tunnelType?: string
  tunnelClassify?: string
}

interface RenovationProject {
  id: number
  projectName: string
  region: string
  year: string
  projectStatus: string
  constructionUnit: string
  constructionContact: string
  constructionPhone: string
  contractor: string
  contractorContact: string
  contractorPhone: string
  planStartDate: string
  planEndDate: string
  relatedRiskRoad?: string
  relatedNewRoad?: string
  relatedNewBridge?: string
  relatedNewTunnel?: string
  relatedRoadDetailList?: RelatedRoadItem[]
  actualStartDate: string
  actualEndDate?: string
  startAttachment?: string
  endAttachment?: string
  progressList?: FacilityProgressGroup[]
  isKeyFocus?: boolean // 是否重点关注
}

interface ProgressItem {
  year: string
  roadLength?: number
  renovationLength: number
  completedLength: number
  progress: string
  statusDesc: string
  plannedInvestment: number
  completedInvestment: number
}

interface FacilityProgressGroup {
  key: string
  facilityName: string
  roadLength?: number
  totalRenovationLength: number
  totalCompletedLength: number
  computedProgress: string
  statusDesc: string
  computedPlannedInvestment: number
  yearData: ProgressItem[]
}

const riskRoadList = ref<RiskRow[]>([
  { id: 1, region: '杭州市西湖区', name: '文一路', grade: '主干路', evalLevel: 'D', buildDate: '2005-06', competentUnit: '杭州市建委', manageUnit: '杭州市西湖区城管局', maintainUnit: '杭州市西湖区市政养护所', policeUnit: '杭州市交警支队西湖大队', roadLength: '5200', renovationLength: '1800', reportFile: '文一路定期检测报告.pdf', mainProblem: '路面裂缝', inspectUnit: '杭州市道路检测中心', inspectTime: '2024-03-15', inspector: '张三', rectified: '是', rectifyMaterial: '文一路整改报告.pdf' },
  { id: 2, region: '杭州市上城区', name: '秋石高架', grade: '快速路', evalLevel: 'D', buildDate: '2010-09', competentUnit: '杭州市建委', manageUnit: '杭州市上城区城管局', maintainUnit: '杭州市上城区市政养护所', policeUnit: '杭州市交警支队上城大队', roadLength: '12600', renovationLength: '3500', reportFile: '秋石高架定期检测报告.pdf', mainProblem: '桥面铺装破损', inspectUnit: '杭州市道路检测中心', inspectTime: '2024-04-20', inspector: '李四', rectified: '否', rectifyMaterial: '' },
  { id: 3, region: '宁波市鄞州区', name: '鄞州大道', grade: '主干路', evalLevel: 'D', buildDate: '2008-03', competentUnit: '宁波市住建局', manageUnit: '宁波市鄞州区城管局', maintainUnit: '宁波市鄞州区市政养护所', policeUnit: '宁波市交警支队州大队', roadLength: '8300', renovationLength: '2100', reportFile: '鄞州大道定期检测报告.pdf', mainProblem: '路基沉降', inspectUnit: '宁波市道路养护所', inspectTime: '2024-05-10', inspector: '王五', rectified: '否', rectifyMaterial: '' },
  { id: 4, region: '温州市鹿城区', name: '人民路', grade: '次干路', evalLevel: 'D', buildDate: '2002-11', competentUnit: '温州市住建局', manageUnit: '温州市鹿城区城管局', maintainUnit: '温州市鹿城区市政养护所', policeUnit: '温州市交警支队鹿城大队', roadLength: '3600', renovationLength: '1200', reportFile: '人民路定期检测报告.pdf', mainProblem: '人行道砖破损', inspectUnit: '温州市市政管理中心', inspectTime: '2024-03-25', inspector: '赵六', rectified: '是', rectifyMaterial: '人民路整改报告.pdf' },
  { id: 5, region: '杭州市萧山区', name: '市心路', grade: '次干路', evalLevel: 'D', buildDate: '2006-08', competentUnit: '杭州市建委', manageUnit: '杭州市萧山区城管局', maintainUnit: '杭州市萧山区市政养护所', policeUnit: '杭州市交警支队萧山大队', roadLength: '4100', renovationLength: '2500', reportFile: '市心路定期检测报告.pdf', mainProblem: '严重塌陷', inspectUnit: '杭州市道路检测中心', inspectTime: '2024-06-01', inspector: '孙七', rectified: '否', rectifyMaterial: '' },
])

const riskBridgeList = ref<RiskRow[]>([
  { id: 1, region: '杭州市上城区', name: '秋石高架桥', bridgeType: '特大桥', evalLevel: 'D', buildDate: '2010-09', competentUnit: '杭州市建委', manageUnit: '杭州市上城区城管局', maintainUnit: '杭州市上城区市政养护所', policeUnit: '杭州市交警支队上城大队', reportFile: '秋石高架桥定期检测报告.pdf', mainProblem: '支座老化', inspectUnit: '杭州市桥梁检测中心', inspectTime: '2024-03-18', inspector: '张三', rectified: '是', rectifyMaterial: '秋石高架桥整改报告.pdf' },
  { id: 2, region: '杭州市西湖区', name: '之江大桥', bridgeType: '大桥', evalLevel: 'E', buildDate: '2007-05', competentUnit: '杭州市建委', manageUnit: '杭州市西湖区城管局', maintainUnit: '杭州市西湖区市政养护所', policeUnit: '杭州市交警支队西湖大队', reportFile: '之江大桥定期检测报告.pdf', mainProblem: '混凝土剥落', inspectUnit: '杭州市桥梁检测中心', inspectTime: '2024-04-22', inspector: '李四', rectified: '否', rectifyMaterial: '' },
  { id: 3, region: '宁波市海曙区', name: '海曙大桥', bridgeType: '中桥', evalLevel: '不合格', buildDate: '2003-12', competentUnit: '宁波市住建局', manageUnit: '宁波市海曙区城管局', maintainUnit: '宁波市海曙区市政养护所', policeUnit: '宁波市交警支队海曙大队', reportFile: '海曙大桥定期检测报告.pdf', mainProblem: '伸缩缝损坏', inspectUnit: '宁波市桥梁养护所', inspectTime: '2024-05-15', inspector: '王五', rectified: '是', rectifyMaterial: '海曙大桥整改报告.pdf' },
  { id: 4, region: '温州市鹿城区', name: '瓯江大桥', bridgeType: '特大桥', evalLevel: 'D', buildDate: '2011-06', competentUnit: '温州市住建局', manageUnit: '温州市鹿城区城管局', maintainUnit: '温州市鹿城区市政养护所', policeUnit: '温州市交警支队鹿城大队', reportFile: '瓯江大桥定期检测报告.pdf', mainProblem: '主拱圈开裂', inspectUnit: '温州市市政管理中心', inspectTime: '2024-03-28', inspector: '赵六', rectified: '否', rectifyMaterial: '' },
  { id: 5, region: '杭州市拱墅区', name: '运河大桥', bridgeType: '中桥', evalLevel: 'E', buildDate: '2001-04', competentUnit: '杭州市建委', manageUnit: '杭州市拱墅区城管局', maintainUnit: '杭州市拱墅区市政养护所', policeUnit: '杭州市交警支队拱墅大队', reportFile: '运河大桥定期检测报告.pdf', mainProblem: '结构安全隐患', inspectUnit: '杭州市桥梁检测中心', inspectTime: '2024-06-05', inspector: '孙七', rectified: '否', rectifyMaterial: '' },
])

const riskTunnelList = ref<RiskRow[]>([
  { id: 1, region: '杭州市萧山区', name: '萧山机场隧道', tunnelType: '城市道路隧道', tunnelClassify: '特长隧道(L>3000m)', evalLevel: 'D', buildDate: '2012-08', competentUnit: '杭州市建委', manageUnit: '杭州市萧山区城管局', maintainUnit: '杭州市萧山区市政养护所', policeUnit: '杭州市交警支队萧山大队', reportFile: '萧山机场隧道定期检测报告.pdf', mainProblem: '渗漏水', inspectUnit: '杭州市隧道检测中心', inspectTime: '2024-03-20', inspector: '张三', rectified: '是', rectifyMaterial: '萧山机场隧道整改报告.pdf' },
  { id: 2, region: '杭州市富阳区', name: '富阳江滨隧道', tunnelType: '城市道路隧道', tunnelClassify: '长隧道(1000m<L≤3000m)', evalLevel: 'E', buildDate: '2015-03', competentUnit: '杭州市建委', manageUnit: '杭州市富阳区城管局', maintainUnit: '杭州市富阳区市政养护所', policeUnit: '杭州市交警支队富阳大队', reportFile: '富阳江滨隧道定期检测报告.pdf', mainProblem: '衬砌裂缝', inspectUnit: '杭州市隧道检测中心', inspectTime: '2024-04-25', inspector: '李四', rectified: '否', rectifyMaterial: '' },
  { id: 3, region: '温州市鹿城区', name: '景山隧道', tunnelType: '人行地道', tunnelClassify: '中隧道(500m<L≤1000m)', evalLevel: 'D', buildDate: '2009-11', competentUnit: '温州市住建局', manageUnit: '温州市鹿城区城管局', maintainUnit: '温州市鹿城区市政养护所', policeUnit: '温州市交警支队鹿城大队', reportFile: '景山隧道定期检测报告.pdf', mainProblem: '接缝变形', inspectUnit: '温州市市政管理中心', inspectTime: '2024-05-18', inspector: '王五', rectified: '否', rectifyMaterial: '' },
  { id: 4, region: '宁波市鄞州区', name: '东部新城隧道', tunnelType: '城市道路隧道', tunnelClassify: '短隧道(L≤500m)', evalLevel: 'E', buildDate: '2016-07', competentUnit: '宁波市住建局', manageUnit: '宁波市鄞州区城管局', maintainUnit: '宁波市鄞州区市政养护所', policeUnit: '宁波市交警支队鄞州大队', reportFile: '东部新城隧道定期检测报告.pdf', mainProblem: '路面破损', inspectUnit: '宁波市隧道养护所', inspectTime: '2024-03-30', inspector: '赵六', rectified: '是', rectifyMaterial: '东部新城隧道整改报告.pdf' },
  { id: 5, region: '杭州市余杭区', name: '良渚隧道', tunnelType: '人行地道', tunnelClassify: '长隧道(1000m<L≤3000m)', evalLevel: 'D', buildDate: '2013-01', competentUnit: '杭州市建委', manageUnit: '杭州市余杭区城管局', maintainUnit: '杭州市余杭区市政养护所', policeUnit: '杭州市交警支队余杭大队', reportFile: '良渚隧道定期检测报告.pdf', mainProblem: '严重结构病害', inspectUnit: '杭州市隧道检测中心', inspectTime: '2024-06-08', inspector: '孙七', rectified: '否', rectifyMaterial: '' },
])

// ===================== 新建项目选择设施数据 =====================
const newRoadRiskList = ref<RiskRow[]>([
  { id: 1, region: '杭州市西湖区', name: '文一路延伸段', grade: '主干路', evalLevel: 'D', buildDate: '2024-06', competentUnit: '杭州市建委', manageUnit: '杭州市西湖区城管局', maintainUnit: '杭州市西湖区市政养护所', policeUnit: '杭州市交警支队西湖大队', roadLength: '6500', renovationLength: '6500', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 2, region: '杭州市上城区', name: '钱江新城道路', grade: '快速路', evalLevel: 'D', buildDate: '2024-03', competentUnit: '杭州市建委', manageUnit: '杭州市上城区城管局', maintainUnit: '杭州市上城区市政养护所', policeUnit: '杭州市交警支队上城大队', roadLength: '8200', renovationLength: '8200', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 3, region: '宁波市鄞州区', name: '东部新城主干道', grade: '主干路', evalLevel: 'D', buildDate: '2024-05', competentUnit: '宁波市住建局', manageUnit: '宁波市鄞州区城管局', maintainUnit: '宁波市鄞州区市政养护所', policeUnit: '宁波市交警支队鄞州大队', roadLength: '7800', renovationLength: '7800', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 4, region: '温州市鹿城区', name: '滨江大道', grade: '次干路', evalLevel: 'D', buildDate: '2024-04', competentUnit: '温州市住建局', manageUnit: '温州市鹿城区城管局', maintainUnit: '温州市鹿城区市政养护所', policeUnit: '温州市交警支队鹿城大队', roadLength: '4500', renovationLength: '4500', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 5, region: '杭州市萧山区', name: '亚运村道路', grade: '支路', evalLevel: 'D', buildDate: '2024-02', competentUnit: '杭州市建委', manageUnit: '杭州市萧山区城管局', maintainUnit: '杭州市萧山区市政养护所', policeUnit: '杭州市交警支队萧山大队', roadLength: '3200', renovationLength: '3200', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
])

const newBridgeRiskList = ref<RiskRow[]>([
  { id: 1, region: '杭州市上城区', name: '钱江新城大桥', bridgeType: '特大桥', evalLevel: 'D', buildDate: '2024-06', competentUnit: '杭州市建委', manageUnit: '杭州市上城区城管局', maintainUnit: '杭州市上城区市政养护所', policeUnit: '杭州市交警支队上城大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 2, region: '杭州市西湖区', name: '之江新建大桥', bridgeType: '大桥', evalLevel: 'D', buildDate: '2024-03', competentUnit: '杭州市建委', manageUnit: '杭州市西湖区城管局', maintainUnit: '杭州市西湖区市政养护所', policeUnit: '杭州市交警支队西湖大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 3, region: '宁波市海曙区', name: '海曙新建大桥', bridgeType: '中桥', evalLevel: 'D', buildDate: '2024-05', competentUnit: '宁波市住建局', manageUnit: '宁波市海曙区城管局', maintainUnit: '宁波市海曙区市政养护所', policeUnit: '宁波市交警支队海曙大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 4, region: '温州市鹿城区', name: '瓯江新建大桥', bridgeType: '特大桥', evalLevel: 'D', buildDate: '2024-04', competentUnit: '温州市住建局', manageUnit: '温州市鹿城区城管局', maintainUnit: '温州市鹿城区市政养护所', policeUnit: '温州市交警支队鹿城大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 5, region: '杭州市拱墅区', name: '运河新建大桥', bridgeType: '小桥', evalLevel: 'D', buildDate: '2024-02', competentUnit: '杭州市建委', manageUnit: '杭州市拱墅区城管局', maintainUnit: '杭州市拱墅区市政养护所', policeUnit: '杭州市交警支队拱墅大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
])

const newTunnelRiskList = ref<RiskRow[]>([
  { id: 1, region: '杭州市萧山区', name: '萧山新建隧道', tunnelType: '城市道路隧道', tunnelClassify: '特长隧道(L>3000m)', evalLevel: 'D', buildDate: '2024-06', competentUnit: '杭州市建委', manageUnit: '杭州市萧山区城管局', maintainUnit: '杭州市萧山区市政养护所', policeUnit: '杭州市交警支队萧山大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 2, region: '杭州市富阳区', name: '富阳新建隧道', tunnelType: '城市道路隧道', tunnelClassify: '长隧道(1000m<L≤3000m)', evalLevel: 'D', buildDate: '2024-03', competentUnit: '杭州市建委', manageUnit: '杭州市富阳区城管局', maintainUnit: '杭州市富阳区市政养护所', policeUnit: '杭州市交警支队富阳大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 3, region: '温州市鹿城区', name: '景山新建地道', tunnelType: '人行地道', tunnelClassify: '中隧道(500m<L≤1000m)', evalLevel: 'D', buildDate: '2024-05', competentUnit: '温州市住建局', manageUnit: '温州市鹿城区城管局', maintainUnit: '温州市鹿城区市政养护所', policeUnit: '温州市交警支队鹿城大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 4, region: '宁波市鄞州区', name: '东部新建隧道', tunnelType: '城市道路隧道', tunnelClassify: '短隧道(L≤500m)', evalLevel: 'D', buildDate: '2024-04', competentUnit: '宁波市住建局', manageUnit: '宁波市鄞州区城管局', maintainUnit: '宁波市鄞州区市政养护所', policeUnit: '宁波市交警支队鄞州大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
  { id: 5, region: '杭州市余杭区', name: '良渚新建地道', tunnelType: '人行地道', tunnelClassify: '长隧道(1000m<L≤3000m)', evalLevel: 'D', buildDate: '2024-02', competentUnit: '杭州市建委', manageUnit: '杭州市余杭区城管局', maintainUnit: '杭州市余杭区市政养护所', policeUnit: '杭州市交警支队余杭大队', reportFile: '', mainProblem: '', inspectUnit: '', inspectTime: '', inspector: '', rectified: '否', rectifyMaterial: '' },
])

const projectList = ref<ProjectRow[]>([
  { id: 1, region: '杭州市西湖区', name: '文一路延伸工程', type: '新建道路', year: '2024', investment: 12500, status: '已开工' },
  { id: 2, region: '杭州市上城区', name: '秋石高架桥新建', type: '新建桥梁', year: '2023', investment: 28000, status: '完工' },
  { id: 3, region: '杭州市萧山区', name: '萧山机场隧道工程', type: '新建隧道', year: '2024', investment: 45000, status: '前期' },
  { id: 4, region: '杭州市拱墅区', name: '运河大桥新建', type: '新建桥梁', year: '2023', investment: 18500, status: '已开工' },
  { id: 5, region: '杭州市西湖区', name: '之江大桥新建', type: '新建桥梁', year: '2024', investment: 32000, status: '前期' },
  { id: 6, region: '杭州市富阳区', name: '富阳江滨隧道', type: '新建隧道', year: '2023', investment: 38000, status: '完工' },
  { id: 7, region: '杭州市余杭区', name: '余杭塘栖大道', type: '新建道路', year: '2024', investment: 9800, status: '已开工' },
  { id: 8, region: '杭州市钱塘区', name: '钱塘路新建工程', type: '新建道路', year: '2023', investment: 15600, status: '完工' },
  { id: 9, region: '宁波市鄞州区', name: '鄞州大道新建工程', type: '新建道路', year: '2024', investment: 22000, status: '已开工' },
  { id: 10, region: '宁波市海曙区', name: '海曙大桥新建', type: '新建桥梁', year: '2023', investment: 35000, status: '前期' },
  { id: 11, region: '温州市鹿城区', name: '鹿城隧道工程', type: '新建隧道', year: '2024', investment: 41000, status: '已开工' },
  { id: 12, region: '嘉兴市南湖区', name: '南湖路新建', type: '新建道路', year: '2023', investment: 8600, status: '完工' },
])

// ===================== 改造项目数据 =====================
const renovationRoadList = ref<RenovationProject[]>([
  {
    id: 1,
    projectName: '文一路改造工程',
    region: '杭州市西湖区',
    year: '2024',
    projectStatus: '已开工',
    constructionUnit: '杭州市西湖区城管局',
    constructionContact: '张三',
    constructionPhone: '13800138001',
    contractor: '杭州市政工程有限公司',
    contractorContact: '李四',
    contractorPhone: '13800138002',
    planStartDate: '2024-03-01',
    planEndDate: '2024-12-31',
    relatedRiskRoad: '文一路',
    relatedRoadDetailList: [
      { name: '文一路', region: '杭州市西湖区', grade: '主干路', roadLength: '5200' },
    ],
    isKeyFocus: true,
    actualStartDate: '2024-03-15',
    startAttachment: '开工报告.pdf',
    progressList: [
      { key: '1', facilityName: '文一路', totalRenovationLength: 1800, totalCompletedLength: 1200, computedProgress: '66.7%', statusDesc: '施工中', computedPlannedInvestment: 5000, yearData: [
        { year: '2024', renovationLength: 1800, completedLength: 1200, progress: '66.7%', statusDesc: '施工中', plannedInvestment: 5000, completedInvestment: 3500 },
      ]},
    ],
  },
  {
    id: 2,
    projectName: '秋石高架维修工程',
    region: '杭州市上城区',
    year: '2024',
    projectStatus: '已开工',
    constructionUnit: '杭州市上城区城管局',
    constructionContact: '王五',
    constructionPhone: '13800138003',
    contractor: '浙江路桥建设有限公司',
    contractorContact: '赵六',
    contractorPhone: '13800138004',
    planStartDate: '2024-04-01',
    planEndDate: '2025-03-31',
    relatedRiskRoad: '秋石高架',
    relatedRoadDetailList: [
      { name: '秋石高架', region: '杭州市上城区', grade: '快速路', roadLength: '12600' },
    ],
    actualStartDate: '2024-04-10',
    startAttachment: '开工许可证.pdf',
    progressList: [
      { key: '1', facilityName: '秋石高架', totalRenovationLength: 3500, totalCompletedLength: 800, computedProgress: '22.9%', statusDesc: '基础施工', computedPlannedInvestment: 8000, yearData: [
        { year: '2024', renovationLength: 3500, completedLength: 800, progress: '22.9%', statusDesc: '基础施工', plannedInvestment: 8000, completedInvestment: 2000 },
      ]},
    ],
  },
])

const renovationBridgeList = ref<RenovationProject[]>([
  {
    id: 1,
    projectName: '秋石高架桥加固工程',
    region: '杭州市上城区',
    year: '2024',
    projectStatus: '前期',
    constructionUnit: '杭州市上城区城管局',
    constructionContact: '孙七',
    constructionPhone: '13800138005',
    contractor: '杭州桥梁工程有限公司',
    contractorContact: '周八',
    contractorPhone: '13800138006',
    planStartDate: '2024-05-01',
    planEndDate: '2025-04-30',
    relatedNewBridge: '秋石高架桥',
    relatedRoadDetailList: [
      { name: '秋石高架桥', region: '杭州市上城区', bridgeType: '特大桥' },
    ],
    isKeyFocus: true,
    actualStartDate: '2024-05-15',
    startAttachment: '施工方案.pdf',
    progressList: [
      { key: '1', facilityName: '秋石高架桥', totalRenovationLength: 0, totalCompletedLength: 0, computedProgress: '15%', statusDesc: '设计阶段', computedPlannedInvestment: 12000, yearData: [
        { year: '2024', renovationLength: 0, completedLength: 0, progress: '15%', statusDesc: '设计阶段', plannedInvestment: 12000, completedInvestment: 1800 },
      ]},
    ],
  },
])

const renovationTunnelList = ref<RenovationProject[]>([
  {
    id: 1,
    projectName: '萧山机场隧道修缮工程',
    region: '杭州市萧山区',
    year: '2024',
    projectStatus: '前期',
    constructionUnit: '杭州市萧山区城管局',
    constructionContact: '吴九',
    constructionPhone: '13800138007',
    contractor: '浙江隧道工程有限公司',
    contractorContact: '郑十',
    contractorPhone: '13800138008',
    planStartDate: '2024-06-01',
    planEndDate: '2025-05-31',
    relatedNewTunnel: '萧山机场隧道',
    relatedRoadDetailList: [
      { name: '萧山机场隧道', region: '杭州市萧山区', tunnelType: '城市道路隧道', tunnelClassify: '一类隧道' },
    ],
    isKeyFocus: true,
    actualStartDate: '2024-06-10',
    startAttachment: '安全评估报告.pdf',
    progressList: [
      { key: '1', facilityName: '萧山机场隧道', totalRenovationLength: 0, totalCompletedLength: 0, computedProgress: '10%', statusDesc: '前期准备', computedPlannedInvestment: 15000, yearData: [
        { year: '2024', renovationLength: 0, completedLength: 0, progress: '10%', statusDesc: '前期准备', plannedInvestment: 15000, completedInvestment: 1500 },
      ]},
    ],
  },
])

// ===================== 新建项目数据（同改造项目）=====================
const newRoadList = ref<RenovationProject[]>([
  {
    id: 1,
    projectName: '文一路延伸工程',
    region: '杭州市西湖区',
    year: '2024',
    projectStatus: '已开工',
    constructionUnit: '杭州市西湖区城管局',
    constructionContact: '张三',
    constructionPhone: '13800138001',
    contractor: '杭州道路建设有限公司',
    contractorContact: '李四',
    contractorPhone: '13800138002',
    planStartDate: '2024-03-01',
    planEndDate: '2025-02-28',
    relatedNewRoad: '文一路',
    relatedRoadDetailList: [
      { name: '文一路延伸段', region: '杭州市西湖区', grade: '主干路', roadLength: '6500' },
    ],
    isKeyFocus: true,
    actualStartDate: '2024-03-10',
    startAttachment: '施工许可证.pdf',
    progressList: [
      { key: '1', facilityName: '文一路', totalRenovationLength: 0, totalCompletedLength: 0, computedProgress: '30%', statusDesc: '施工中', computedPlannedInvestment: 12500, yearData: [
        { year: '2024', renovationLength: 0, completedLength: 0, progress: '30%', statusDesc: '施工中', plannedInvestment: 12500, completedInvestment: 3750 },
      ]},
    ],
  },
])

const newBridgeList = ref<RenovationProject[]>([
  {
    id: 1,
    projectName: '秋石高架桥新建工程',
    region: '杭州市上城区',
    year: '2023',
    projectStatus: '完工',
    constructionUnit: '杭州市上城区城管局',
    constructionContact: '王五',
    constructionPhone: '13800138003',
    contractor: '浙江桥梁工程有限公司',
    contractorContact: '赵六',
    contractorPhone: '13800138004',
    planStartDate: '2023-01-01',
    planEndDate: '2024-12-31',
    relatedNewBridge: '秋石高架桥',
    relatedRoadDetailList: [
      { name: '秋石高架桥', region: '杭州市上城区', bridgeType: '特大桥' },
    ],
    isKeyFocus: true,
    actualStartDate: '2023-01-15',
    actualEndDate: '2024-11-30',
    startAttachment: '开工报告.pdf',
    endAttachment: '竣工验收报告.pdf',
    progressList: [
      { key: '1', facilityName: '秋石高架桥', totalRenovationLength: 0, totalCompletedLength: 0, computedProgress: '100%', statusDesc: '已完工', computedPlannedInvestment: 28000, yearData: [
        { year: '2023', renovationLength: 0, completedLength: 0, progress: '50%', statusDesc: '主体结构完成', plannedInvestment: 14000, completedInvestment: 14000 },
        { year: '2024', renovationLength: 0, completedLength: 0, progress: '100%', statusDesc: '已完工', plannedInvestment: 14000, completedInvestment: 14000 },
      ]},
    ],
  },
])

const newTunnelList = ref<RenovationProject[]>([
  {
    id: 1,
    projectName: '萧山机场隧道新建工程',
    region: '杭州市萧山区',
    year: '2024',
    projectStatus: '前期',
    constructionUnit: '杭州市萧山区城管局',
    constructionContact: '孙七',
    constructionPhone: '13800138005',
    contractor: '浙江隧道工程有限公司',
    contractorContact: '周八',
    contractorPhone: '13800138006',
    planStartDate: '2024-06-01',
    planEndDate: '2026-05-31',
    relatedNewTunnel: '萧山机场隧道',
    relatedRoadDetailList: [
      { name: '萧山机场隧道', region: '杭州市萧山区', tunnelType: '城市道路隧道', tunnelClassify: '一类隧道' },
    ],
    isKeyFocus: true,
    actualStartDate: '',
    startAttachment: '可行性研究.pdf',
    progressList: [
      { key: '1', facilityName: '萧山机场隧道', totalRenovationLength: 0, totalCompletedLength: 0, computedProgress: '5%', statusDesc: '前期准备', computedPlannedInvestment: 45000, yearData: [
        { year: '2024', renovationLength: 0, completedLength: 0, progress: '5%', statusDesc: '前期准备', plannedInvestment: 45000, completedInvestment: 2250 },
      ]},
    ],
  },
])

// ===================== 搜索表单 =====================
const searchForm = reactive({
  region: undefined as string | undefined,
  name: '',
  projectName: '',
  year: undefined as string | undefined,
  grade: undefined as string | undefined,
  evalLevel: undefined as string | undefined,
  tunnelClassify: undefined as string | undefined,
  rectified: undefined as string | undefined,
  type: undefined as string | undefined,
  status: undefined as string | undefined,
  keyFocus: undefined as string | undefined,
})

// 当前数据源
const currentDataList = computed(() => {
  const path = pagePath.value
  if (path.includes('/risk-road')) return riskRoadList.value
  if (path.includes('/risk-bridge')) return riskBridgeList.value
  if (path.includes('/risk-tunnel')) return riskTunnelList.value
  if (path.includes('/renovation-road')) return renovationRoadList.value
  if (path.includes('/renovation-bridge')) return renovationBridgeList.value
  if (path.includes('/renovation-tunnel')) return renovationTunnelList.value
  if (path.includes('/new-road')) return newRoadList.value
  if (path.includes('/new-bridge')) return newBridgeList.value
  if (path.includes('/new-tunnel')) return newTunnelList.value
  return projectList.value
})

const filteredData = computed(() => {
  let list: any[] = currentDataList.value as any[]
  
  return list.filter((item: any) => {
    if (searchForm.region && item.region !== searchForm.region) return false
    if (searchForm.name && !item.name?.includes(searchForm.name)) return false
    if (searchForm.projectName && !item.projectName?.includes(searchForm.projectName)) return false
    if (searchForm.year && item.year !== searchForm.year) return false
    if (searchForm.grade && item.grade !== searchForm.grade && item.bridgeType !== searchForm.grade && item.tunnelType !== searchForm.grade) return false
    if (searchForm.evalLevel && item.evalLevel !== searchForm.evalLevel) return false
    if (searchForm.tunnelClassify && item.tunnelClassify !== searchForm.tunnelClassify) return false
    if (searchForm.rectified && item.rectified !== searchForm.rectified) return false
    if (searchForm.type && item.type !== searchForm.type) return false
    if (searchForm.status && item.status !== searchForm.status) return false
    if (searchForm.keyFocus) {
      if (searchForm.keyFocus === '是' && !item.isKeyFocus) return false
      if (searchForm.keyFocus === '否' && item.isKeyFocus) return false
    }
    return true
  })
})

function handleSearch() {
  message.success('搜索完成')
}

function resetSearch() {
  searchForm.region = undefined
  searchForm.name = ''
  searchForm.projectName = ''
  searchForm.year = undefined
  searchForm.grade = undefined
  searchForm.evalLevel = undefined
  searchForm.tunnelClassify = undefined
  searchForm.rectified = undefined
  searchForm.type = undefined
  searchForm.status = undefined
  searchForm.keyFocus = undefined
}

// ===================== 弹窗 =====================
const modalVisible = ref(false)
const modalTitle = ref('新增项目')
const formData = reactive({
  id: 0,
  region: undefined as string | undefined,
  name: '',
  type: undefined as string | undefined,
  year: undefined as string | undefined,
  investment: undefined as number | undefined,
  status: undefined as string | undefined,
})

function handleAdd() {
  if (isRenovationPage.value) {
    // 改造项目页面使用专用新增弹窗
    renovationModalTitle.value = '新增项目'
    renovationModalMode.value = 'add'
    renovationForm.id = 0
    renovationForm.projectName = ''
    renovationForm.region = undefined
    renovationForm.year = undefined
    renovationForm.constructionUnit = ''
    renovationForm.constructionContact = ''
    renovationForm.constructionPhone = ''
    renovationForm.contractor = ''
    renovationForm.contractorContact = ''
    renovationForm.contractorPhone = ''
    renovationForm.projectStatus = undefined
    renovationForm.planStartDate = ''
    renovationForm.planEndDate = ''
    renovationForm.relatedRiskRoad = ''
    renovationForm.relatedRoadDetailList = []
    renovationForm.actualStartDate = ''
    renovationForm.actualEndDate = ''
    renovationForm.startAttachment = ''
    renovationForm.endAttachment = ''
    // 清空附件文件列表
    startAttachmentFileList.value = []
    endAttachmentFileList.value = []
    renovationForm.progressList = []
    renovationModalVisible.value = true
    return
  }
  modalTitle.value = '新增项目'
  formData.id = 0
  formData.region = undefined
  formData.name = ''
  formData.type = undefined
  formData.year = undefined
  formData.investment = undefined
  formData.status = undefined
  modalVisible.value = true
}

function handleEdit(record: any) {
  if (isRenovationPage.value) {
    // 改造项目编辑弹窗
    renovationModalTitle.value = '编辑项目'
    renovationModalMode.value = 'edit'
    renovationForm.id = record.id
    renovationForm.projectName = record.projectName
    renovationForm.region = record.region
    renovationForm.year = record.year
    renovationForm.projectStatus = record.projectStatus || undefined
    renovationForm.constructionUnit = record.constructionUnit || ''
    renovationForm.constructionContact = record.constructionContact || ''
    renovationForm.constructionPhone = record.constructionPhone || ''
    renovationForm.contractor = record.contractor || ''
    renovationForm.contractorContact = record.contractorContact || ''
    renovationForm.contractorPhone = record.contractorPhone || ''
    renovationForm.planStartDate = record.planStartDate || ''
    renovationForm.planEndDate = record.planEndDate || ''
    renovationForm.relatedRiskRoad = record.relatedRiskRoad || ''
    renovationForm.relatedRoadDetailList = record.relatedRoadDetailList ? JSON.parse(JSON.stringify(record.relatedRoadDetailList)) : []
    renovationForm.actualStartDate = record.actualStartDate || ''
    renovationForm.actualEndDate = record.actualEndDate || ''
    renovationForm.startAttachment = record.startAttachment || ''
    renovationForm.endAttachment = record.endAttachment || ''
    // 恢复附件文件列表
    startAttachmentFileList.value = record.startAttachment ? [{ uid: '-1', name: record.startAttachment, status: 'done' }] : []
    endAttachmentFileList.value = record.endAttachment ? [{ uid: '-2', name: record.endAttachment, status: 'done' }] : []
    renovationForm.progressList = record.progressList ? JSON.parse(JSON.stringify(record.progressList)) : []
    expandedRowKeys.value = renovationForm.progressList.map((g: any) => g.key)
    renovationModalVisible.value = true
    return
  }
  // 问题道路/桥梁/隧道编辑
  riskEditForm.id = record.id
  riskEditForm.region = record.region
  riskEditForm.name = record.name
  if (pagePath.value.includes('/risk-road')) {
    riskEditForm.grade = record.grade
    riskEditForm.evalLevel = record.evalLevel
    riskEditForm.buildDate = record.buildDate
    riskEditForm.competentUnit = record.competentUnit
    riskEditForm.manageUnit = record.manageUnit
    riskEditForm.maintainUnit = record.maintainUnit
    riskEditForm.policeUnit = record.policeUnit
    riskEditForm.roadLength = record.roadLength
    riskEditForm.renovationLength = record.renovationLength
    riskEditForm.reportFile = record.reportFile
    riskEditForm.mainProblem = record.mainProblem
    riskEditForm.inspectUnit = record.inspectUnit
    riskEditForm.inspectTime = record.inspectTime
    riskEditForm.inspector = record.inspector
    riskEditForm.rectified = record.rectified
    riskEditForm.rectifyMaterial = record.rectifyMaterial
  } else if (pagePath.value.includes('/risk-bridge')) {
    riskEditForm.bridgeType = record.bridgeType
    riskEditForm.evalLevel = record.evalLevel
    riskEditForm.buildDate = record.buildDate
    riskEditForm.competentUnit = record.competentUnit
    riskEditForm.manageUnit = record.manageUnit
    riskEditForm.maintainUnit = record.maintainUnit
    riskEditForm.policeUnit = record.policeUnit
    riskEditForm.reportFile = record.reportFile
    riskEditForm.mainProblem = record.mainProblem
    riskEditForm.inspectUnit = record.inspectUnit
    riskEditForm.inspectTime = record.inspectTime
    riskEditForm.inspector = record.inspector
    riskEditForm.rectified = record.rectified
    riskEditForm.rectifyMaterial = record.rectifyMaterial
  } else if (pagePath.value.includes('/risk-tunnel')) {
    riskEditForm.tunnelType = record.tunnelType
    riskEditForm.tunnelClassify = record.tunnelClassify
    riskEditForm.evalLevel = record.evalLevel
    riskEditForm.buildDate = record.buildDate
    riskEditForm.competentUnit = record.competentUnit
    riskEditForm.manageUnit = record.manageUnit
    riskEditForm.maintainUnit = record.maintainUnit
    riskEditForm.policeUnit = record.policeUnit
    riskEditForm.reportFile = record.reportFile
    riskEditForm.mainProblem = record.mainProblem
    riskEditForm.inspectUnit = record.inspectUnit
    riskEditForm.inspectTime = record.inspectTime
    riskEditForm.inspector = record.inspector
    riskEditForm.rectified = record.rectified
    riskEditForm.rectifyMaterial = record.rectifyMaterial
  }
  riskEditVisible.value = true
}

function handleView(record: any) {
  if (isRenovationPage.value) {
    // 改造项目查看弹窗
    renovationModalTitle.value = '查看详情'
    renovationModalMode.value = 'view'
    renovationForm.id = record.id
    renovationForm.projectName = record.projectName
    renovationForm.region = record.region
    renovationForm.year = record.year
    renovationForm.projectStatus = record.projectStatus || undefined
    renovationForm.constructionUnit = record.constructionUnit || ''
    renovationForm.constructionContact = record.constructionContact || ''
    renovationForm.constructionPhone = record.constructionPhone || ''
    renovationForm.contractor = record.contractor || ''
    renovationForm.contractorContact = record.contractorContact || ''
    renovationForm.contractorPhone = record.contractorPhone || ''
    renovationForm.planStartDate = record.planStartDate || ''
    renovationForm.planEndDate = record.planEndDate || ''
    renovationForm.relatedRiskRoad = record.relatedRiskRoad || ''
    renovationForm.relatedRoadDetailList = record.relatedRoadDetailList ? JSON.parse(JSON.stringify(record.relatedRoadDetailList)) : []
    renovationForm.actualStartDate = record.actualStartDate || ''
    renovationForm.actualEndDate = record.actualEndDate || ''
    renovationForm.startAttachment = record.startAttachment || ''
    renovationForm.endAttachment = record.endAttachment || ''
    // 恢复附件文件列表
    startAttachmentFileList.value = record.startAttachment ? [{ uid: '-1', name: record.startAttachment, status: 'done' }] : []
    endAttachmentFileList.value = record.endAttachment ? [{ uid: '-2', name: record.endAttachment, status: 'done' }] : []
    renovationForm.progressList = record.progressList ? JSON.parse(JSON.stringify(record.progressList)) : []
    expandedRowKeys.value = renovationForm.progressList.map((g: any) => g.key)
    renovationModalVisible.value = true
    return
  }
  detailRecord.value = record
  detailVisible.value = true
}

// ===================== 查看详情弹窗 =====================
const detailVisible = ref(false)
const detailRecord = ref<any>(null)

interface DetailField {
  key: string
  label: string
  span?: number
}

const riskRoadDetailFields: DetailField[] = [
  { key: 'region', label: '归属地区' },
  { key: 'name', label: '道路名称' },
  { key: 'grade', label: '道路等级' },
  { key: 'evalLevel', label: '道路评价等级' },
  { key: 'buildDate', label: '建成年月' },
  { key: 'competentUnit', label: '行业主管单位' },
  { key: 'manageUnit', label: '设施管理单位' },
  { key: 'maintainUnit', label: '设施养护单位' },
  { key: 'policeUnit', label: '公安交警联动单位' },
  { key: 'roadLength', label: '道路长度(m)' },
  { key: 'renovationLength', label: '需改造问题道路长度(m)' },
  { key: 'reportFile', label: '定期检测报告', span: 2 },
  { key: 'mainProblem', label: '问题描述', span: 2 },
  { key: 'inspectUnit', label: '检查单位' },
  { key: 'inspectTime', label: '检查时间' },
  { key: 'inspector', label: '检查人' },
  { key: 'rectified', label: '是否已整改' },
  { key: 'rectifyMaterial', label: '整改相关材料', span: 2 },
]

const riskBridgeDetailFields: DetailField[] = [
  { key: 'region', label: '归属地区' },
  { key: 'name', label: '桥梁名称' },
  { key: 'bridgeType', label: '桥梁类型' },
  { key: 'evalLevel', label: '桥梁评价等级' },
  { key: 'buildDate', label: '建成年月' },
  { key: 'competentUnit', label: '行业主管单位' },
  { key: 'manageUnit', label: '设施管理单位' },
  { key: 'maintainUnit', label: '设施养护单位' },
  { key: 'policeUnit', label: '公安交警联动单位' },
  { key: 'reportFile', label: '定期检测报告', span: 2 },
  { key: 'mainProblem', label: '问题描述', span: 2 },
  { key: 'inspectUnit', label: '检查单位' },
  { key: 'inspectTime', label: '检查时间' },
  { key: 'inspector', label: '检查人' },
  { key: 'rectified', label: '是否已整改' },
  { key: 'rectifyMaterial', label: '整改相关材料', span: 2 },
]

const riskTunnelDetailFields: DetailField[] = [
  { key: 'region', label: '归属地区' },
  { key: 'name', label: '隧道名称' },
  { key: 'tunnelType', label: '隧道类型' },
  { key: 'tunnelClassify', label: '城市道路隧道分类' },
  { key: 'evalLevel', label: '隧道评价等级' },
  { key: 'buildDate', label: '建成年月' },
  { key: 'competentUnit', label: '行业主管单位' },
  { key: 'manageUnit', label: '设施管理单位' },
  { key: 'maintainUnit', label: '设施养护单位' },
  { key: 'policeUnit', label: '公安交警联动单位' },
  { key: 'reportFile', label: '定期检测报告', span: 2 },
  { key: 'mainProblem', label: '问题描述', span: 2 },
  { key: 'inspectUnit', label: '检查单位' },
  { key: 'inspectTime', label: '检查时间' },
  { key: 'inspector', label: '检查人' },
  { key: 'rectified', label: '是否已整改' },
  { key: 'rectifyMaterial', label: '整改相关材料', span: 2 },
]

const detailFields = computed<DetailField[]>(() => {
  const path = pagePath.value
  if (path.includes('/risk-road')) return riskRoadDetailFields
  if (path.includes('/risk-bridge')) return riskBridgeDetailFields
  if (path.includes('/risk-tunnel')) return riskTunnelDetailFields
  return []
})

// ===================== 风险设施编辑弹窗 =====================
const riskEditVisible = ref(false)
const riskEditForm = reactive<Record<string, string>>({})

interface EditField {
  key: string
  label: string
  editable: boolean
  span?: number
}

const riskEditFields = computed<EditField[]>(() => {
  const path = pagePath.value
  if (path.includes('/risk-road')) {
    return [
      { key: 'region', label: '归属地区', editable: false },
      { key: 'name', label: '道路名称', editable: false },
      { key: 'grade', label: '道路等级', editable: false },
      { key: 'evalLevel', label: '道路评价等级', editable: false },
      { key: 'buildDate', label: '建成年月', editable: false },
      { key: 'competentUnit', label: '行业主管单位', editable: false },
      { key: 'manageUnit', label: '设施管理单位', editable: false },
      { key: 'maintainUnit', label: '设施养护单位', editable: false },
      { key: 'policeUnit', label: '公安交警联动单位', editable: false },
      { key: 'roadLength', label: '道路长度(m)', editable: false },
      { key: 'renovationLength', label: '需改造问题道路长度(m)', editable: true },
      { key: 'reportFile', label: '定期检测报告', editable: false, span: 2 },
      { key: 'mainProblem', label: '问题描述', editable: true, span: 2 },
      { key: 'inspectUnit', label: '检查单位', editable: false },
      { key: 'inspectTime', label: '检查时间', editable: false },
      { key: 'inspector', label: '检查人', editable: false },
      { key: 'rectified', label: '是否已整改', editable: false },
      { key: 'rectifyMaterial', label: '整改相关材料', editable: false, span: 2 },
    ]
  }
  if (path.includes('/risk-bridge')) {
    return [
      { key: 'region', label: '归属地区', editable: false },
      { key: 'name', label: '桥梁名称', editable: false },
      { key: 'bridgeType', label: '桥梁类型', editable: false },
      { key: 'evalLevel', label: '桥梁评价等级', editable: false },
      { key: 'buildDate', label: '建成年月', editable: false },
      { key: 'competentUnit', label: '行业主管单位', editable: false },
      { key: 'manageUnit', label: '设施管理单位', editable: false },
      { key: 'maintainUnit', label: '设施养护单位', editable: false },
      { key: 'policeUnit', label: '公安交警联动单位', editable: false },
      { key: 'reportFile', label: '定期检测报告', editable: false, span: 2 },
      { key: 'mainProblem', label: '问题描述', editable: true, span: 2 },
      { key: 'inspectUnit', label: '检查单位', editable: false },
      { key: 'inspectTime', label: '检查时间', editable: false },
      { key: 'inspector', label: '检查人', editable: false },
      { key: 'rectified', label: '是否已整改', editable: false },
      { key: 'rectifyMaterial', label: '整改相关材料', editable: false, span: 2 },
    ]
  }
  if (path.includes('/risk-tunnel')) {
    return [
      { key: 'region', label: '归属地区', editable: false },
      { key: 'name', label: '隧道名称', editable: false },
      { key: 'tunnelType', label: '隧道类型', editable: false },
      { key: 'tunnelClassify', label: '城市道路隧道分类', editable: false },
      { key: 'evalLevel', label: '隧道评价等级', editable: false },
      { key: 'buildDate', label: '建成年月', editable: false },
      { key: 'competentUnit', label: '行业主管单位', editable: false },
      { key: 'manageUnit', label: '设施管理单位', editable: false },
      { key: 'maintainUnit', label: '设施养护单位', editable: false },
      { key: 'policeUnit', label: '公安交警联动单位', editable: false },
      { key: 'reportFile', label: '定期检测报告', editable: false, span: 2 },
      { key: 'mainProblem', label: '问题描述', editable: true, span: 2 },
      { key: 'inspectUnit', label: '检查单位', editable: false },
      { key: 'inspectTime', label: '检查时间', editable: false },
      { key: 'inspector', label: '检查人', editable: false },
      { key: 'rectified', label: '是否已整改', editable: false },
      { key: 'rectifyMaterial', label: '整改相关材料', editable: false, span: 2 },
    ]
  }
  return []
})

function handleRiskEditOk() {
  const path = pagePath.value
  let list: RiskRow[] | undefined
  if (path.includes('/risk-road')) list = riskRoadList.value
  else if (path.includes('/risk-bridge')) list = riskBridgeList.value
  else if (path.includes('/risk-tunnel')) list = riskTunnelList.value
  if (!list) return
  const record = list.find(r => r.id === Number(riskEditForm.id))
  if (record) {
    Object.assign(record, { mainProblem: riskEditForm.mainProblem })
    if (path.includes('/risk-road')) {
      record.renovationLength = riskEditForm.renovationLength
    }
    message.success('编辑成功')
  }
  riskEditVisible.value = false
}

function handleDelete(record: any) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除“${record.name || record.projectName}”吗？`,
    onOk() {
      const list = currentDataList.value as any[]
      const idx = list.findIndex((p: any) => p.id === record.id)
      if (idx >= 0) {
        list.splice(idx, 1)
        message.success('删除成功')
      }
    },
  })
}

// 切换重点关注状态
function handleToggleKeyFocus(record: any) {
  record.isKeyFocus = !record.isKeyFocus
  message.success(record.isKeyFocus ? '已设为重点关注' : '已取消重点关注')
}

// ===================== 改造项目新增/编辑/查看弹窗 =====================
const renovationModalVisible = ref(false)
const renovationModalTitle = ref('新增项目')
const renovationModalMode = ref<'add' | 'edit' | 'view'>('add')

// 查看关联道路弹窗
const viewRelatedRoadsVisible = ref(false)
const viewRelatedRoadsList = ref<RelatedRoadItem[]>([])

function handleViewRelatedRoads(record: any) {
  const list = record.relatedRoadDetailList
  if (list && list.length > 0) {
    viewRelatedRoadsList.value = list
    viewRelatedRoadsVisible.value = true
  }
}

const viewRelatedRoadsColumns = computed(() => {
  const path = pagePath.value
  // 问题道路改造项目：显示完整列
  if (path.includes('/renovation-road')) {
    return [
      { title: '归属地区', dataIndex: 'region', key: 'region' },
      { title: '道路名称', dataIndex: 'name', key: 'name' },
      { title: '道路等级', dataIndex: 'grade', key: 'grade' },
      { title: '道路长度(m)', dataIndex: 'roadLength', key: 'roadLength' },
      { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem' },
      { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime' },
      { title: '是否已整改', dataIndex: 'rectified', key: 'rectified' },
    ]
  }
  const cols: any[] = [
    { title: '归属地区', dataIndex: 'region', key: 'region' },
    { title: '名称', dataIndex: 'name', key: 'name' },
  ]
  if (path.includes('/new-road')) {
    cols.push(
      { title: '道路等级', dataIndex: 'grade', key: 'grade' },
      { title: '道路长度(m)', dataIndex: 'roadLength', key: 'roadLength' },
    )
  } else if (path.includes('/renovation-bridge') || path.includes('/new-bridge')) {
    cols.push(
      { title: '桥梁类型', dataIndex: 'bridgeType', key: 'bridgeType' },
    )
  } else if (path.includes('/renovation-tunnel') || path.includes('/new-tunnel')) {
    cols.push(
      { title: '隧道类型', dataIndex: 'tunnelType', key: 'tunnelType' },
      { title: '城市道路隧道分类', dataIndex: 'tunnelClassify', key: 'tunnelClassify' },
    )
  }
  return cols
})

const renovationForm = reactive({
  id: 0,
  projectName: '',
  region: undefined as string | undefined,
  year: undefined as string | undefined,
  constructionUnit: '',
  constructionContact: '',
  constructionPhone: '',
  contractor: '',
  contractorContact: '',
  contractorPhone: '',
  projectStatus: undefined as string | undefined,
  planStartDate: '',
  planEndDate: '',
  relatedRiskRoad: '',
  relatedNewRoad: '',
  relatedNewBridge: '',
  relatedNewTunnel: '',
  relatedRoadDetailList: [] as RelatedRoadItem[],
  actualStartDate: '',
  actualEndDate: '',
  startAttachment: '',
  endAttachment: '',
  progressList: [] as FacilityProgressGroup[],
})

// 附件上传文件列表
const startAttachmentFileList = ref<any[]>([])
const endAttachmentFileList = ref<any[]>([])

const isRenovationRoadPage = computed(() => pagePath.value.includes('/renovation-road') || pagePath.value.includes('/new-road'))

const riskSelectRowSelection = computed(() => ({
  type: isRenovationRoadPage.value ? 'checkbox' : 'radio',
  selectedRowKeys: riskSelectedKeys.value,
  onChange: (keys: any[]) => { riskSelectedKeys.value = keys },
}))

const progressColumns = computed(() => {
  const path = pagePath.value
  const isRoad = path.includes('/renovation-road') || path.includes('/new-road')
  const isNewProject = path.includes('/new-road') || path.includes('/new-bridge') || path.includes('/new-tunnel')
  let facilityLabel = '道路名称'
  if (path.includes('/renovation-bridge') || path.includes('/new-bridge')) facilityLabel = '桥梁名称'
  else if (path.includes('/renovation-tunnel') || path.includes('/new-tunnel')) facilityLabel = '隧道名称'
  const cols: any[] = [
    { title: facilityLabel, dataIndex: 'facilityName', key: 'facilityName', width: 120 },
  ]
  if (isRoad) {
    if (isNewProject) {
      cols.push(
        { title: '道路长度(m)', dataIndex: 'roadLength', key: 'roadLength', width: 120 },
      )
    }
    cols.push(
      { title: isNewProject ? '目标建设长度(m)' : '需改造长度(m)', dataIndex: 'totalRenovationLength', key: 'totalRenovationLength', width: 120 },
      { title: isNewProject ? '已建设长度(m)' : '已改造长度(m)', dataIndex: 'totalCompletedLength', key: 'totalCompletedLength', width: 120 },
    )
  }
  cols.push(
    { title: '形象进度', dataIndex: 'computedProgress', key: 'computedProgress', width: 100 },
    { title: '状态描述', dataIndex: 'statusDesc', key: 'statusDesc', width: 120 },
    { title: '计划投资额(万元)', dataIndex: 'computedPlannedInvestment', key: 'computedPlannedInvestment', width: 130 },
    { title: '累计完成投资(万元)', dataIndex: 'computedCompletedInvestment', key: 'computedCompletedInvestment', width: 140 },
  )
  return cols
})

const yearDataColumns = computed(() => {
  const isRoad = pagePath.value.includes('/renovation-road') || pagePath.value.includes('/new-road')
  const isNewProject = pagePath.value.includes('/new-road') || pagePath.value.includes('/new-bridge') || pagePath.value.includes('/new-tunnel')
  const cols: any[] = [
    { title: '年份', dataIndex: 'year', key: 'year', width: 80 },
  ]
  if (isRoad && !isNewProject) {
    cols.push(
      { title: '需改造长度(m)', dataIndex: 'renovationLength', key: 'renovationLength', width: 130 },
      { title: '已改造长度(m)', dataIndex: 'completedLength', key: 'completedLength', width: 130 },
    )
  }
  cols.push(
    { title: '形象进度', dataIndex: 'progress', key: 'progress', width: 100 },
    { title: '状态描述', dataIndex: 'statusDesc', key: 'statusDesc', width: 120 },
    { title: '计划投资额(万元)', dataIndex: 'plannedInvestment', key: 'plannedInvestment', width: 130 },
    { title: '累计完成投资(万元)', dataIndex: 'completedInvestment', key: 'completedInvestment', width: 140 },
  )
  return cols
})

// 设施行计算函数
function computeTotalCompletedLength(record: FacilityProgressGroup): number {
  return record.yearData.reduce((sum, y) => sum + (y.completedLength || 0), 0)
}
function computePlannedInvestment(record: FacilityProgressGroup): number {
  return record.yearData.reduce((sum, y) => sum + (y.plannedInvestment || 0), 0)
}
function computeCompletedInvestment(record: FacilityProgressGroup): number {
  return record.yearData.reduce((sum, y) => sum + (y.completedInvestment || 0), 0)
}

// 校验年份需改造长度不超过总改造长度
function validateYearRenovationLength(facilityRecord: FacilityProgressGroup) {
  const path = pagePath.value
  const isNewProject = path.includes('/new-road') || path.includes('/new-bridge') || path.includes('/new-tunnel')
  const totalYearRenovation = facilityRecord.yearData.reduce((sum, y) => sum + (y.renovationLength || 0), 0)
  if (totalYearRenovation > facilityRecord.totalRenovationLength) {
    const label = isNewProject ? '目标建设长度' : '需改造长度'
    message.warning(`各年度${label}之和(${totalYearRenovation}m)不可大于总${label}(${facilityRecord.totalRenovationLength}m)`)
  }
}

// 校验年份计划投资额不超过设施计划投资额
function validateYearPlannedInvestment(facilityRecord: FacilityProgressGroup) {
  const totalYearPlanned = facilityRecord.yearData.reduce((sum, y) => sum + (y.plannedInvestment || 0), 0)
  if (totalYearPlanned > facilityRecord.computedPlannedInvestment) {
    message.warning(`各年度计划投资额之和(${totalYearPlanned}万元)不可大于总体计划投资额(${facilityRecord.computedPlannedInvestment}万元)`)
  }
}

const renovationFacilityLabel = computed(() => {
  const path = pagePath.value
  if (path.includes('/renovation-road')) return '道路'
  if (path.includes('/renovation-bridge')) return '桥梁'
  if (path.includes('/renovation-tunnel')) return '隧道'
  if (path.includes('/new-road')) return '道路'
  if (path.includes('/new-bridge')) return '桥梁'
  if (path.includes('/new-tunnel')) return '隧道'
  return '设施'
})

// 按钮文本：三个改造页面显示"选择问题X"，其他页面显示"选择新建X"
const selectFacilityBtnText = computed(() => {
  const path = pagePath.value
  if (path.includes('/renovation-road')) return '选择问题道路'
  if (path.includes('/renovation-bridge')) return '选择问题桥梁'
  if (path.includes('/renovation-tunnel')) return '选择问题隧道'
  return `选择新建${renovationFacilityLabel.value}`
})

// addProgressRow 已删除，进度信息通过关联设施自动生成

// 展开行控制
const expandedRowKeys = ref<string[]>([])
function onExpandRow(expanded: boolean, record: any) {
  if (expanded) {
    expandedRowKeys.value = [...expandedRowKeys.value, record.key]
  } else {
    expandedRowKeys.value = expandedRowKeys.value.filter(k => k !== record.key)
  }
}

// 根据计划开完工时间生成年份列表
function generateYears(): string[] {
  const startDate = renovationForm.planStartDate
  const endDate = renovationForm.planEndDate
  if (!startDate || !endDate) {
    // 如果没有填写时间，默认返回项目年份
    return [renovationForm.year || new Date().getFullYear().toString()]
  }
  const startYear = parseInt(startDate.substring(0, 4))
  const endYear = parseInt(endDate.substring(0, 4))
  if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
    return [renovationForm.year || new Date().getFullYear().toString()]
  }
  const years: string[] = []
  for (let y = startYear; y <= endYear; y++) {
    years.push(y.toString())
  }
  return years
}

// 监听计划时间变化，重新生成年份数据
watch(
  () => [renovationForm.planStartDate, renovationForm.planEndDate],
  () => {
    if (renovationForm.progressList.length > 0) {
      const years = generateYears()
      renovationForm.progressList.forEach(group => {
        const existingData = new Map(group.yearData.map(yd => [yd.year, yd]))
        group.yearData = years.map(year => {
          const existing = existingData.get(year)
          if (existing) return existing
          return {
            year,
            renovationLength: 0,
            completedLength: 0,
            progress: '',
            statusDesc: '',
            plannedInvestment: 0,
            completedInvestment: 0,
          }
        })
      })
    }
  }
)



function handleRenovationModalOk() {
  if (!renovationForm.projectName || !renovationForm.region) {
    message.warning('请填写完整信息')
    return
  }
  const path = pagePath.value
  let list: RenovationProject[] | undefined
  if (path.includes('/renovation-road')) list = renovationRoadList.value
  else if (path.includes('/renovation-bridge')) list = renovationBridgeList.value
  else if (path.includes('/renovation-tunnel')) list = renovationTunnelList.value
  else if (path.includes('/new-road')) list = newRoadList.value
  else if (path.includes('/new-bridge')) list = newBridgeList.value
  else if (path.includes('/new-tunnel')) list = newTunnelList.value
  if (!list) return

  const formData = {
    projectName: renovationForm.projectName,
    region: renovationForm.region!,
    year: renovationForm.year || '',
    projectStatus: renovationForm.projectStatus || '',
    constructionUnit: renovationForm.constructionUnit,
    constructionContact: renovationForm.constructionContact,
    constructionPhone: renovationForm.constructionPhone,
    contractor: renovationForm.contractor,
    contractorContact: renovationForm.contractorContact,
    contractorPhone: renovationForm.contractorPhone,
    planStartDate: renovationForm.planStartDate,
    planEndDate: renovationForm.planEndDate,
    relatedRiskRoad: renovationForm.relatedRiskRoad,
    relatedRoadDetailList: JSON.parse(JSON.stringify(renovationForm.relatedRoadDetailList)),
    actualStartDate: renovationForm.actualStartDate,
    actualEndDate: renovationForm.actualEndDate || undefined,
    startAttachment: renovationForm.startAttachment || undefined,
    endAttachment: renovationForm.endAttachment || undefined,
    progressList: JSON.parse(JSON.stringify(renovationForm.progressList)),
  }

  if (renovationForm.id === 0) {
    // 新增
    const newId = Math.max(...list.map(p => p.id), 0) + 1
    list.push({ id: newId, ...formData })
    message.success('新增成功')
  } else {
    // 编辑
    const idx = list.findIndex(p => p.id === renovationForm.id)
    if (idx >= 0) {
      Object.assign(list[idx], formData)
      message.success('编辑成功')
    }
  }
  renovationModalVisible.value = false
}

// ===================== 关联问题设施选择 =====================
const riskSelectVisible = ref(false)
const riskSelectedKeys = ref<any[]>([])
const riskSelectItem = ref<any>(null)

const riskSelectColumns = computed(() => {
  const path = pagePath.value
  if (path.includes('/new-road')) {
    return [
      { title: '归属地区', dataIndex: 'region', key: 'region' },
      { title: '道路名称', dataIndex: 'name', key: 'name' },
      { title: '道路等级', dataIndex: 'grade', key: 'grade' },
      { title: '道路长度(m)', dataIndex: 'roadLength', key: 'roadLength' },
    ]
  }
  if (path.includes('/renovation-road')) {
    return [
      { title: '归属地区', dataIndex: 'region', key: 'region' },
      { title: '道路名称', dataIndex: 'name', key: 'name' },
      { title: '道路等级', dataIndex: 'grade', key: 'grade' },
      { title: '道路长度(m)', dataIndex: 'roadLength', key: 'roadLength' },
      { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem' },
      { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime' },
      { title: '是否已整改', dataIndex: 'rectified', key: 'rectified' },
    ]
  }
  if (path.includes('/new-bridge')) {
    return [
      { title: '归属地区', dataIndex: 'region', key: 'region' },
      { title: '桥梁名称', dataIndex: 'name', key: 'name' },
      { title: '桥梁类型', dataIndex: 'bridgeType', key: 'bridgeType' },
    ]
  }
  if (path.includes('/renovation-bridge')) {
    return [
      { title: '归属地区', dataIndex: 'region', key: 'region' },
      { title: '桥梁名称', dataIndex: 'name', key: 'name' },
      { title: '桥梁类型', dataIndex: 'bridgeType', key: 'bridgeType' },
      { title: '桥梁评价等级', dataIndex: 'evalLevel', key: 'evalLevel' },
      { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem' },
      { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime' },
      { title: '是否已整改', dataIndex: 'rectified', key: 'rectified' },
    ]
  }
  if (path.includes('/new-tunnel')) {
    return [
      { title: '归属地区', dataIndex: 'region', key: 'region' },
      { title: '隧道名称', dataIndex: 'name', key: 'name' },
      { title: '隧道类型', dataIndex: 'tunnelType', key: 'tunnelType' },
      { title: '城市道路隧道分类', dataIndex: 'tunnelClassify', key: 'tunnelClassify' },
    ]
  }
  return [
    { title: '归属地区', dataIndex: 'region', key: 'region' },
    { title: '隧道名称', dataIndex: 'name', key: 'name' },
    { title: '隧道类型', dataIndex: 'tunnelType', key: 'tunnelType' },
    { title: '城市道路隧道分类', dataIndex: 'tunnelClassify', key: 'tunnelClassify' },
    { title: '隧道评价等级', dataIndex: 'evalLevel', key: 'evalLevel' },
    { title: '问题描述', dataIndex: 'mainProblem', key: 'mainProblem' },
    { title: '检查时间', dataIndex: 'inspectTime', key: 'inspectTime' },
    { title: '是否已整改', dataIndex: 'rectified', key: 'rectified' },
  ]
})

const riskSelectList = computed(() => {
  const path = pagePath.value
  if (path.includes('/renovation-road')) return riskRoadList.value
  if (path.includes('/renovation-bridge')) return riskBridgeList.value
  if (path.includes('/renovation-tunnel')) return riskTunnelList.value
  if (path.includes('/new-road')) return newRoadRiskList.value
  if (path.includes('/new-bridge')) return newBridgeRiskList.value
  if (path.includes('/new-tunnel')) return newTunnelRiskList.value
  return []
})

// 筛选项
const riskSelectFilter = reactive({
  region: undefined as string | undefined,
  name: '',
  evalLevel: undefined as string | undefined,
  grade: undefined as string | undefined,
  bridgeType: undefined as string | undefined,
  tunnelType: undefined as string | undefined,
})

const filteredRiskSelectList = computed(() => {
  const path = pagePath.value
  const isRoadPage = path.includes('/renovation-road') || path.includes('/new-road')
  const isNewBridgePage = path.includes('/new-bridge')
  const isNewTunnelPage = path.includes('/new-tunnel')
  let list = riskSelectList.value
  if (riskSelectFilter.region) {
    list = list.filter(item => item.region === riskSelectFilter.region)
  }
  if (riskSelectFilter.name) {
    list = list.filter(item => item.name.includes(riskSelectFilter.name))
  }
  if (isRoadPage && riskSelectFilter.grade) {
    list = list.filter(item => item.grade === riskSelectFilter.grade)
  }
  if (isNewBridgePage && riskSelectFilter.bridgeType) {
    list = list.filter(item => item.bridgeType === riskSelectFilter.bridgeType)
  }
  if (isNewTunnelPage && riskSelectFilter.tunnelType) {
    list = list.filter(item => item.tunnelType === riskSelectFilter.tunnelType)
  }
  if (!isRoadPage && !isNewBridgePage && !isNewTunnelPage && riskSelectFilter.evalLevel) {
    list = list.filter(item => item.evalLevel === riskSelectFilter.evalLevel)
  }
  return list
})

function handleSelectRiskRoad() {
  riskSelectedKeys.value = []
  riskSelectVisible.value = true
}

// 开工附件上传处理
function handleStartAttachmentChange(info: any) {
  startAttachmentFileList.value = info.fileList
  // 更新 renovationForm.startAttachment 为文件名列表
  renovationForm.startAttachment = info.fileList.map((f: any) => f.name).join('、')
}

// 完工附件上传处理
function handleEndAttachmentChange(info: any) {
  endAttachmentFileList.value = info.fileList
  // 更新 renovationForm.endAttachment 为文件名列表
  renovationForm.endAttachment = info.fileList.map((f: any) => f.name).join('、')
}

function handleRiskSelectOk() {
  if (riskSelectedKeys.value.length > 0) {
    const list = riskSelectList.value
    const selectedItems = list.filter(r => riskSelectedKeys.value.includes(r.id))
    const path = pagePath.value
    const years = generateYears()
    // 更新关联设施名称
    renovationForm.relatedRiskRoad = selectedItems.map(s => s.name).join('、')
    // 存储关联设施详情
    renovationForm.relatedRoadDetailList = selectedItems.map(item => ({
      name: item.name,
      region: item.region,
      grade: item.grade,
      roadLength: item.roadLength,
      bridgeType: item.bridgeType,
      tunnelType: item.tunnelType,
      tunnelClassify: item.tunnelClassify,
    }))
    // 自动填充进度信息列表
    renovationForm.progressList = selectedItems.map((item, idx) => {
      let renovationLength = 0
      let roadLength: number | undefined
      if (path.includes('/renovation-road') || path.includes('/new-road')) {
        renovationLength = Number(item.renovationLength) || 0
        roadLength = Number(item.roadLength) || 0
      }
      return {
        key: `facility-${idx + 1}`,
        facilityName: item.name,
        roadLength,
        totalRenovationLength: renovationLength,
        totalCompletedLength: 0,
        computedProgress: '',
        statusDesc: '',
        computedPlannedInvestment: 0,
        yearData: years.map(year => ({
          year,
          roadLength,
          renovationLength: 0,
          completedLength: 0,
          progress: '',
          statusDesc: '',
          plannedInvestment: 0,
          completedInvestment: 0,
        })),
      }
    })
    // 默认展开所有行
    expandedRowKeys.value = renovationForm.progressList.map(g => g.key)
  }
  riskSelectVisible.value = false
}

function handleModalOk() {
  if (!formData.name || !formData.region) {
    message.warning('请填写完整信息')
    return
  }
  if (formData.id === 0) {
    const list = currentDataList.value as any[]
    const newId = Math.max(...list.map(p => p.id), 0) + 1
    list.push({
      id: newId,
      region: formData.region,
      name: formData.name,
      type: formData.type,
      year: formData.year,
      investment: formData.investment || 0,
      status: formData.status,
    })
    message.success('新增成功')
  }
  modalVisible.value = false
}

function handleExport() {
  message.success('导出成功')
}
</script>

<style scoped>
.online-projects-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breadcrumb-wrapper {
  margin-bottom: 4px;
}

.search-section {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.table-card {
  background: #fff;
  padding: 16px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.action-btns {
  display: flex;
  gap: 4px;
}

.edit-disabled-text {
  color: #999;
  font-size: 14px;
  line-height: 32px;
}
</style>
