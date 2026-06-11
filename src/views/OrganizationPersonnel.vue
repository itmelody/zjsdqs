<template>
  <div class="org-personnel">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <a @click="router.push('/dashboard')"><LeftOutlined style="margin-right: 4px" />返回</a>
      <a-divider type="vertical" />
      <span>机构人员管理</span>
      <span class="separator">&gt;</span>
      <span>主管部门授权配置</span>
      <span class="separator">&gt;</span>
      <span class="current">人员权限配置</span>
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
          <a style="margin-right: 8px" @click="handleAuthorize(record as PersonnelRow)">授权</a>
          <a style="margin-right: 8px" @click="handleEdit(record as PersonnelRow)">编辑</a>
          <a style="color: #ff4d4f" @click="handleDelete(record as PersonnelRow)">删除</a>
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

interface PersonnelRow {
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

const personnelData = ref<PersonnelRow[]>([
  { id: 1, realName: '张三', orgStructure: '浙江省-省政府机构-省建设厅-城市建设处', region: '浙江省', phone: '17360312375', activateTime: '2026-06-10 16:53:58', authDept: '省建设厅' },
  { id: 2, realName: '李四', orgStructure: '浙江省-杭州市-余杭区住建局-市政管理中心', region: '杭州市余杭区', phone: '18458597359', activateTime: '2026-05-22 09:15:30', authDept: '余杭区住建局' },
  { id: 3, realName: '王五', orgStructure: '浙江省-绍兴市-越城区住建局-市政公用管理服务中心', region: '绍兴市越城区', phone: '15168223333', activateTime: '2026-04-18 14:30:20', authDept: '越城区市政公用管理服务中心' },
  { id: 4, realName: '赵六', orgStructure: '浙江省-省建设厅-城乡规划处', region: '浙江省', phone: '13588761234', activateTime: '2026-03-15 10:45:00', authDept: '省建设厅' },
  { id: 5, realName: '钱七', orgStructure: '浙江省-宁波市-鄞州区住建局-设施管理科', region: '宁波市鄞州区', phone: '15967891234', activateTime: '2026-02-28 08:30:15', authDept: '鄞州区住建局' },
  { id: 6, realName: '孙八', orgStructure: '浙江省-温州市-鹿城区住建局-城市管理中心', region: '温州市鹿城区', phone: '18657123456', activateTime: '2026-01-20 11:20:00', authDept: '鹿城区住建局' },
])

const filteredData = computed(() => {
  return personnelData.value.filter(row => {
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

function handleAuthorize(record: PersonnelRow) {
  console.log('授权', record)
}

function handleEdit(record: PersonnelRow) {
  console.log('编辑', record)
}

function handleDelete(record: PersonnelRow) {
  console.log('删除', record)
}
</script>

<style scoped lang="scss">
.org-personnel {
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
