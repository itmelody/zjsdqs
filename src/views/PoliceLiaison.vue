<template>
  <div class="police-liaison">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <a @click="router.push('/dashboard')"><LeftOutlined style="margin-right: 4px" />返回</a>
      <a-divider type="vertical" />
      <span>机构人员管理</span>
      <span class="separator">&gt;</span>
      <span>主管部门授权配置</span>
      <span class="separator">&gt;</span>
      <span class="current">公安交警联动</span>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <a-row :gutter="16" align="middle">
        <a-col>
          <span class="search-label">真实姓名：</span>
          <a-input v-model:value="searchForm.name" placeholder="请输入真实姓名" style="width: 160px" />
        </a-col>
        <a-col>
          <span class="search-label">归属地区：</span>
          <a-select v-model:value="searchForm.region" placeholder="请选择归属地区" style="width: 180px" allowClear>
            <a-select-option v-for="opt in regionOptions" :key="opt" :value="opt">{{ opt }}</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <span class="search-label">手机号码：</span>
          <a-input v-model:value="searchForm.phone" placeholder="请输入手机号码" style="width: 180px" />
        </a-col>
        <a-col>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-col>
      </a-row>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <a-button type="primary"><PlusOutlined />同步浙政钉组织用户</a-button>
    </div>

    <!-- 数据表格 -->
    <a-table
      :data-source="filteredData"
      :columns="columns"
      :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条`, showSizeChanger: true }"
      size="middle"
      bordered
      row-key="id"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a style="margin-right: 8px" @click="handleAuthorize(record as LiaisonRow)">授权</a>
          <a style="margin-right: 8px" @click="handleEdit(record as LiaisonRow)">编辑</a>
          <a style="color: #ff4d4f" @click="handleDelete(record as LiaisonRow)">删除</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { LeftOutlined, PlusOutlined } from '@ant-design/icons-vue'

const router = useRouter()

interface LiaisonRow {
  id: number
  realName: string
  orgStructure: string
  region: string
  phone: string
  activateTime: string
  authDept: string
}

const searchForm = ref({ name: '', region: undefined as string | undefined, phone: '' })

const regionOptions = ['浙江省', '杭州市', '宁波市', '温州市', '绍兴市', '湖州市', '嘉兴市', '金华市', '衢州市', '台州市', '丽水市', '舟山市']

const columns = [
  { title: '真实姓名', dataIndex: 'realName', key: 'realName', width: 100 },
  { title: '组织架构', dataIndex: 'orgStructure', key: 'orgStructure', width: 320 },
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 140 },
  { title: '手机号码', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '激活时间', dataIndex: 'activateTime', key: 'activateTime', width: 180 },
  { title: '授权管理部门', dataIndex: 'authDept', key: 'authDept', width: 200 },
  { title: '操作', key: 'action', width: 150, fixed: 'right' as const },
]

const liaisonData = ref<LiaisonRow[]>([
  { id: 1, realName: '张伟', orgStructure: '浙江省-衢州市-公安局-交通警察支队', region: '衢州市', phone: '13800138001', activateTime: '2025-03-15 09:30:00', authDept: '衢州市公安局' },
  { id: 2, realName: '李明', orgStructure: '浙江省-杭州市-公安局-交通警察局', region: '杭州市', phone: '13900139002', activateTime: '2025-04-20 14:00:00', authDept: '杭州市公安局' },
  { id: 3, realName: '王强', orgStructure: '浙江省-宁波市-公安局-交通警察局', region: '宁波市', phone: '13700137003', activateTime: '', authDept: '' },
  { id: 4, realName: '赵磊', orgStructure: '浙江省-温州市-公安局-交通警察支队', region: '温州市', phone: '13600136004', activateTime: '2025-05-10 10:00:00', authDept: '温州市公安局' },
  { id: 5, realName: '孙涛', orgStructure: '浙江省-绍兴市-公安局-交通警察局', region: '绍兴市', phone: '13500135005', activateTime: '', authDept: '' },
  { id: 6, realName: '周军', orgStructure: '浙江省-湖州市-公安局-交通警察支队', region: '湖州市', phone: '13400134006', activateTime: '2025-06-01 08:30:00', authDept: '湖州市公安局' },
])

const filteredData = computed(() => {
  return liaisonData.value.filter(row => {
    if (searchForm.value.name && !row.realName.includes(searchForm.value.name)) return false
    if (searchForm.value.region && !row.region.startsWith(searchForm.value.region)) return false
    if (searchForm.value.phone && !row.phone.includes(searchForm.value.phone)) return false
    return true
  })
})

function handleSearch() { /* 搜索由 computed 自动响应 */ }

function handleReset() {
  searchForm.value = { name: '', region: undefined, phone: '' }
}

function handleAuthorize(record: LiaisonRow) {
  console.log('授权', record)
}

function handleEdit(record: LiaisonRow) {
  console.log('编辑', record)
}

function handleDelete(record: LiaisonRow) {
  console.log('删除', record)
}
</script>

<style scoped lang="scss">
.police-liaison {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.breadcrumb {
  margin-bottom: 16px;
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

.search-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;

  .search-label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
  }
}

.action-bar {
  margin-bottom: 16px;
}
</style>
