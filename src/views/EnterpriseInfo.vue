<template>
  <div class="enterprise-info">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <a @click="router.push('/dashboard')"><LeftOutlined style="margin-right: 4px" />返回</a>
      <a-divider type="vertical" />
      <span>机构人员管理</span>
      <span class="separator">&gt;</span>
      <span class="current">企业基本信息</span>
    </div>

    <!-- 企业基本信息 -->
    <div class="info-section">
      <div class="section-header">
        <span class="section-title">企业基本信息</span>
        <EditOutlined class="edit-icon" @click="handleEdit" />
      </div>
      <a-descriptions bordered :column="2" size="middle">
        <a-descriptions-item label="企业名称">{{ formData.name }}</a-descriptions-item>
        <a-descriptions-item label="统一社会信用代码">{{ formData.creditCode }}</a-descriptions-item>
        <a-descriptions-item label="单位详细地址">{{ formData.address }}</a-descriptions-item>
        <a-descriptions-item label="法定代表人">{{ formData.legalPerson }}</a-descriptions-item>
        <a-descriptions-item label="单位负责人">{{ formData.unitHead }}</a-descriptions-item>
        <a-descriptions-item label="单位负责人联系方式">{{ formData.unitHeadPhone }}</a-descriptions-item>
        <a-descriptions-item label="日常联系人联系方式">{{ formData.dailyContactPhone }}</a-descriptions-item>
        <a-descriptions-item label="日常联系人职务">{{ formData.dailyContactPosition }}</a-descriptions-item>
        <a-descriptions-item label="备注">{{ formData.remark }}</a-descriptions-item>
        <a-descriptions-item label="归属地区">{{ formData.region }}</a-descriptions-item>
      </a-descriptions>
    </div>

    <!-- 企业审批流程管理 -->
    <div class="approval-section">
      <div class="section-header">
        <span class="section-title">企业审批流程管理</span>
      </div>
      <div class="approval-content">
        <div class="approval-row">
          <span class="approval-label">审核员审批流程：</span>
          <a-switch v-model:checked="approvalEnabled" />
          <span class="approval-status">{{ approvalEnabled ? '开启' : '关闭' }}</span>
        </div>
        <a-alert
          type="warning"
          show-icon
          style="margin-top: 16px"
        >
          <template #message>
            提示：关闭审批流程后检查记录、检查问题处置、事件上报、事件处置信息四类数据登记保存后将直接审核通过提交至主管单位。
          </template>
        </a-alert>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined, EditOutlined } from '@ant-design/icons-vue'

const router = useRouter()

const approvalEnabled = ref(false)

const formData = ref({
  name: '建设厅',
  creditCode: '',
  address: '',
  legalPerson: '',
  unitHead: '',
  unitHeadPhone: '',
  dailyContactPhone: '',
  dailyContactPosition: '',
  remark: '',
  region: '浙江省',
})

function handleEdit() {
  console.log('编辑企业信息')
}
</script>

<style scoped lang="scss">
.enterprise-info {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);

  a {
    color: #1677ff;
  }

  .separator {
    margin: 0 8px;
    color: rgba(0, 0, 0, 0.35);
  }

  .current {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
}

.info-section,
.approval-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }

  .edit-icon {
    cursor: pointer;
    color: #1677ff;
    font-size: 14px;

    &:hover {
      color: #4096ff;
    }
  }
}

.approval-content {
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.approval-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .approval-label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }

  .approval-status {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
