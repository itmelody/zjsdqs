<template>
  <div class="monitor-page">
    <!-- 筛选区 -->
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="市区县">
          <a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 220px" @change="onRegionChange" />
        </a-form-item>
        <a-form-item label="设施名称">
          <a-input v-model:value="filters.facilityName" placeholder="请输入" allow-clear style="width: 140px" />
        </a-form-item>
        <a-form-item label="设备名称">
          <a-input v-model:value="filters.deviceName" placeholder="请输入" allow-clear style="width: 140px" />
        </a-form-item>
        <a-form-item label="监测项">
          <a-select v-model:value="filters.monitorItem" placeholder="请选择" allow-clear style="width: 140px">
            <a-select-option value="吊杆索力振动">吊杆索力振动</a-select-option>
            <a-select-option value="位移">位移</a-select-option>
            <a-select-option value="挠度">挠度</a-select-option>
            <a-select-option value="应变">应变</a-select-option>
            <a-select-option value="加速度">加速度</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="点位名称">
          <a-input v-model:value="filters.pointName" placeholder="请输入" allow-clear style="width: 140px" />
        </a-form-item>
        <a-form-item label="监测时间">
          <a-date-picker v-model:value="filters.monitorDate" placeholder="选择日期" style="width: 140px" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="resetFilters">重置</a-button>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>

    <!-- 表格 -->
    <div class="card table-card">
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }"
        size="middle"
        bordered
        row-key="id"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="viewRecordFn(record as DataRow)">查看</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 查看弹窗 -->
    <a-modal v-model:open="viewVisible" title="查看监测数据" width="600px" :footer="null">
      <a-descriptions :column="2" bordered size="small" style="margin-top: 12px">
        <a-descriptions-item label="市区县">{{ viewRecord.city }}</a-descriptions-item>
        <a-descriptions-item label="设施名称">{{ viewRecord.facilityName }}</a-descriptions-item>
        <a-descriptions-item label="设备名称">{{ viewRecord.deviceName }}</a-descriptions-item>
        <a-descriptions-item label="监测项">{{ viewRecord.monitorItem }}</a-descriptions-item>
        <a-descriptions-item label="点位名称" :span="2">{{ viewRecord.pointName }}</a-descriptions-item>
        <a-descriptions-item label="监测时间">{{ viewRecord.monitorTime }}</a-descriptions-item>
        <a-descriptions-item label="点位值最新时间">{{ viewRecord.latestTime }}</a-descriptions-item>
        <a-descriptions-item label="当日最大值">{{ viewRecord.dailyMax }}</a-descriptions-item>
        <a-descriptions-item label="当日最小值">{{ viewRecord.dailyMin }}</a-descriptions-item>
        <a-descriptions-item label="当日平均值">{{ viewRecord.dailyAvg }}</a-descriptions-item>
        <a-descriptions-item label="点位最新值">{{ viewRecord.latestValue }}</a-descriptions-item>
      </a-descriptions>
      <div style="text-align: right; margin-top: 16px">
        <a-button @click="viewVisible = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DataRow {
  id: number
  city: string
  facilityName: string
  deviceName: string
  monitorItem: string
  pointName: string
  monitorTime: string
  dailyMax: string
  dailyMin: string
  dailyAvg: string
  latestTime: string
  latestValue: string
}

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

function onRegionChange(val: string[] | undefined) {
  filters.value.regionValue = val || undefined
}

const monitorItemOptions = ['吊杆索力振动', '位移', '挠度', '应变', '加速度']

const columns = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 100 },
  { title: '设施名称', dataIndex: 'facilityName', key: 'facilityName', width: 120 },
  { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 160 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 100 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 200 },
  { title: '监测时间', dataIndex: 'monitorTime', key: 'monitorTime', width: 120 },
  { title: '当日最大值', dataIndex: 'dailyMax', key: 'dailyMax', width: 100 },
  { title: '当日最小值', dataIndex: 'dailyMin', key: 'dailyMin', width: 100 },
  { title: '当日平均值', dataIndex: 'dailyAvg', key: 'dailyAvg', width: 100 },
  { title: '点位值最新时间', dataIndex: 'latestTime', key: 'latestTime', width: 160 },
  { title: '点位最新值', dataIndex: 'latestValue', key: 'latestValue', width: 100 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const data = ref<DataRow[]>([
  { id: 1, city: '绍兴市越城区', facilityName: '沪漕立交桥', deviceName: '沪漕立交桥应变设备', monitorItem: '应变', pointName: '25-北副应变;第3号拱肋截面1/2等分点', monitorTime: '2026-05-09', dailyMax: '0.52', dailyMin: '-1.35', dailyAvg: '-0.42', latestTime: '2026-5-9 10:40:00', latestValue: '-1.07' },
  { id: 2, city: '宁波市海曙区', facilityName: '甬江大桥', deviceName: '甬江大桥倾斜设备', monitorItem: '位移', pointName: '主塔顶部倾斜监测点', monitorTime: '2026-06-01', dailyMax: '0.08', dailyMin: '-0.02', dailyAvg: '0.03', latestTime: '2026-6-1 14:22:00', latestValue: '0.03' },
  { id: 3, city: '湖州市吴兴区', facilityName: '苕溪桥', deviceName: '苕溪桥振动设备', monitorItem: '加速度', pointName: '跨中位置竖向加速度监测点', monitorTime: '2026-05-28', dailyMax: '0.0035', dailyMin: '-0.0028', dailyAvg: '0.0012', latestTime: '2026-5-28 09:15:00', latestValue: '0.0012' },
  { id: 4, city: '衢州市柯城区', facilityName: '西安门大桥', deviceName: '西安门大桥位移设备', monitorItem: '挠度', pointName: '第2跨跨中挠度监测点', monitorTime: '2026-06-03', dailyMax: '3.20', dailyMin: '1.05', dailyAvg: '2.15', latestTime: '2026-6-3 16:50:00', latestValue: '2.15' },
  { id: 5, city: '杭州市西湖区', facilityName: '钱塘江大桥', deviceName: '钱塘江大桥应变设备', monitorItem: '应变', pointName: '主跨1/4截面应变监测点', monitorTime: '2026-06-05', dailyMax: '1.85', dailyMin: '-0.62', dailyAvg: '0.58', latestTime: '2026-6-5 11:30:00', latestValue: '0.73' },
  { id: 6, city: '温州市鹿城区', facilityName: '瓯江大桥', deviceName: '瓯江大桥索力设备', monitorItem: '吊杆索力振动', pointName: '第5号索索力监测点', monitorTime: '2026-06-02', dailyMax: '2850', dailyMin: '2680', dailyAvg: '2760', latestTime: '2026-6-2 15:45:00', latestValue: '2735' },
])

const filters = ref({
  regionValue: undefined as string[] | undefined,
  facilityName: '',
  deviceName: '',
  monitorItem: undefined as string | undefined,
  pointName: '',
  monitorDate: null as any,
})

function resetFilters() {
  filters.value = { regionValue: undefined, facilityName: '', deviceName: '', monitorItem: undefined, pointName: '', monitorDate: null }
}

function handleSearch() {}

const filteredData = computed(() => {
  return data.value.filter(row => {
    const rv = filters.value.regionValue
    if (rv && rv[0] && !row.city.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.city.includes(rv[1])) return false
    if (filters.value.facilityName && !row.facilityName.includes(filters.value.facilityName)) return false
    if (filters.value.deviceName && !row.deviceName.includes(filters.value.deviceName)) return false
    if (filters.value.monitorItem && row.monitorItem !== filters.value.monitorItem) return false
    if (filters.value.pointName && !row.pointName.includes(filters.value.pointName)) return false
    if (filters.value.monitorDate) {
      const d = filters.value.monitorDate.format ? filters.value.monitorDate.format('YYYY-MM-DD') : filters.value.monitorDate
      if (row.monitorTime !== d) return false
    }
    return true
  })
})

const viewVisible = ref(false)
const viewRecord = ref<DataRow>({} as DataRow)

function viewRecordFn(record: DataRow) {
  viewRecord.value = record
  viewVisible.value = true
}
</script>

<style scoped lang="scss">
.monitor-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.filter-form {
  :deep(.ant-form-item) {
    margin-bottom: 10px;
  }
}
</style>
