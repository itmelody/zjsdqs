<template>
  <div class="monitor-page">
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="市区县"><a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 220px" @change="onRegionChange" /></a-form-item>
        <a-form-item label="设施名称"><a-input v-model:value="filters.facilityName" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="设备名称"><a-input v-model:value="filters.deviceName" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="监测时间"><a-date-picker v-model:value="filters.monitorDate" placeholder="选择日期" style="width: 140px" /></a-form-item>
        <a-form-item><a-space><a-button @click="resetFilters">重置</a-button><a-button type="primary" @click="handleSearch">搜索</a-button></a-space></a-form-item>
      </a-form>
    </div>
    <div class="card table-card">
      <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="middle" bordered row-key="id" :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'"><a-button type="link" size="small" @click="viewRecordFn(record as DataRow)">查看</a-button></template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

interface DataRow { id: number; city: string; facilityName: string; deviceName: string; monitorItem: string; pointName: string; monitorTime: string; dailyMax: string; dailyMin: string; dailyAvg: string; latestTime: string; latestValue: string }

const cityDistrictMap: Record<string, string[]> = {
  '杭州市': ['上城区','拱墅区','西湖区','滨江区','萧山区','余杭区','临平区','钱塘区','富阳区','临安区','桐庐县','淳安县','建德市'],
  '宁波市': ['海曙区','江北区','镇海区','北仑区','鄞州区','奉化区','余姚市','慈溪市','象山县','宁海县'],
  '温州市': ['鹿城区','龙湾区','瓯海区','洞头区','瑞安市','乐清市','永嘉县','平阳县','苍南县','文成县','泰顺县','龙港市'],
  '绍兴市': ['越城区','柯桥区','上虞区','诸暨市','嵊州市','新昌县'], '湖州市': ['吴兴区','南浔区','德清县','长兴县','安吉县'],
  '嘉兴市': ['南湖区','秀洲区','海宁市','平湖市','桐乡市','嘉善县','海盐县'], '金华市': ['婺城区','金东区','义乌市','东阳市','永康市','兰溪市','浦江县','武义县','磐安县'],
  '衢州市': ['柯城区','衢江区','江山市','龙游县','常山县','开化县'], '台州市': ['椒江区','黄岩区','路桥区','临海市','温岭市','玉环市','天台县','仙居县','三门县'],
  '丽水市': ['莲都区','龙泉市','青田县','缙云县','遂昌县','松阳县','云和县','庆元县','景宁畲族自治县'], '舟山市': ['定海区','普陀区','岱山县','嵊泗县'],
}
const cascaderOptions = Object.keys(cityDistrictMap).map(city => ({ value: city, label: city, children: cityDistrictMap[city].map(d => ({ value: d, label: d })) }))
function onRegionChange(val: string[] | undefined) { filters.value.regionValue = val || undefined }

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

const today = dayjs().format('YYYY-MM-DD')
const todayShort = dayjs().format('YYYY-M-D')
const d3 = dayjs().subtract(3, 'day').format('YYYY-MM-DD')
const d3s = dayjs().subtract(3, 'day').format('YYYY-M-D')

const data = ref<DataRow[]>([
  { id: 1, city: '杭州市萧山区', facilityName: '杭金衢高速K12', deviceName: '杭金衢高速路面沉降设备', monitorItem: '路面沉降', pointName: 'K12+500路面沉降监测点', monitorTime: today, dailyMax: '0.15', dailyMin: '-0.92', dailyAvg: '-0.38', latestTime: `${todayShort} 10:30:00`, latestValue: '-0.85' },
  { id: 2, city: '宁波市鄞州区', facilityName: '甬台温高速K88', deviceName: '甬台温高速边坡监测设备', monitorItem: '边坡倾斜', pointName: 'K88+200边坡倾斜监测点', monitorTime: today, dailyMax: '0.05', dailyMin: '-0.01', dailyAvg: '0.02', latestTime: `${todayShort} 14:15:00`, latestValue: '0.02' },
  { id: 3, city: '绍兴市越城区', facilityName: '杭甬高速K45', deviceName: '杭甬高速路基振动设备', monitorItem: '路基振动', pointName: 'K45+800路基振动监测点', monitorTime: d3, dailyMax: '0.004', dailyMin: '-0.002', dailyAvg: '0.0015', latestTime: `${d3s} 09:20:00`, latestValue: '0.0015' },
])

const filters = ref({ regionValue: undefined as string[] | undefined, facilityName: '', deviceName: '', monitorDate: dayjs() as any })
function resetFilters() { filters.value = { regionValue: undefined, facilityName: '', deviceName: '', monitorDate: dayjs() } }
function handleSearch() {}

const filteredData = computed(() => {
  return data.value.filter(row => {
    const rv = filters.value.regionValue
    if (rv && rv[0] && !row.city.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.city.includes(rv[1])) return false
    if (filters.value.facilityName && !row.facilityName.includes(filters.value.facilityName)) return false
    if (filters.value.deviceName && !row.deviceName.includes(filters.value.deviceName)) return false
    if (filters.value.monitorDate) { const d = filters.value.monitorDate.format ? filters.value.monitorDate.format('YYYY-MM-DD') : filters.value.monitorDate; if (row.monitorTime !== d) return false }
    return true
  })
})

function viewRecordFn(_r: DataRow) {}
</script>

<style scoped lang="scss">.monitor-page { display: flex; flex-direction: column; gap: 16px; } .card { background: #fff; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); } .filter-form { :deep(.ant-form-item) { margin-bottom: 10px; } }</style>
