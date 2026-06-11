<template>
  <div class="alert-page">
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="市区县"><a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 220px" @change="onRegionChange" /></a-form-item>
        <a-form-item label="设施名称"><a-input v-model:value="filters.facilityName" placeholder="请输入" allow-clear style="width: 130px" /></a-form-item>
        <a-form-item label="设备名称"><a-input v-model:value="filters.deviceName" placeholder="请输入" allow-clear style="width: 130px" /></a-form-item>
        <a-form-item label="预警等级"><a-select v-model:value="filters.alertLevel" placeholder="请选择" allow-clear style="width: 120px"><a-select-option value="一级预警">一级预警</a-select-option><a-select-option value="二级预警">二级预警</a-select-option><a-select-option value="三级预警">三级预警</a-select-option></a-select></a-form-item>
        <a-form-item label="处置状态"><a-select v-model:value="filters.handleStatus" placeholder="请选择" allow-clear style="width: 110px"><a-select-option value="已完成">已完成</a-select-option><a-select-option value="未完成">未完成</a-select-option></a-select></a-form-item>
        <a-form-item><a-space><a-button @click="resetFilters">重置</a-button><a-button type="primary" @click="handleSearch">搜索</a-button></a-space></a-form-item>
      </a-form>
    </div>
    <div class="card table-card">
      <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="middle" bordered row-key="id" :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }"><template v-if="column.key === 'action'"><a-button type="link" size="small" @click="viewRecordFn(record as DataRow)">查看</a-button></template></template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
interface DataRow { id: number; city: string; facilityName: string; deviceName: string; monitorItem: string; pointName: string; alertStartTime: string; alertEndTime: string; alertValue: string; alertLevel: string; handleTime: string; handler: string; handleStatus: string }

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
  { title: '市区县', dataIndex: 'city', key: 'city', width: 100 }, { title: '设施名称', dataIndex: 'facilityName', key: 'facilityName', width: 110 }, { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 100 }, { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 200 }, { title: '报警开始时间', dataIndex: 'alertStartTime', key: 'alertStartTime', width: 160 },
  { title: '报警结束时间', dataIndex: 'alertEndTime', key: 'alertEndTime', width: 160 }, { title: '预警值', dataIndex: 'alertValue', key: 'alertValue', width: 90 }, { title: '预警等级', dataIndex: 'alertLevel', key: 'alertLevel', width: 100 },
  { title: '处置状态', dataIndex: 'handleStatus', key: 'handleStatus', width: 100 }, { title: '处置完成时间', dataIndex: 'handleTime', key: 'handleTime', width: 160 }, { title: '处置人', dataIndex: 'handler', key: 'handler', width: 80 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const data = ref<DataRow[]>([
  { id: 1, city: '杭州市西湖区', facilityName: '紫之隧道', deviceName: '紫之隧道结构变形设备', monitorItem: '结构变形', pointName: 'K3+200拱顶沉降监测点', alertStartTime: '2026-06-08 07:15:00', alertEndTime: '', alertValue: '2.10', alertLevel: '一级预警', handleTime: '', handler: '', handleStatus: '未完成' },
  { id: 2, city: '宁波市鄞州区', facilityName: '常洪隧道', deviceName: '常洪隧道渗漏监测设备', monitorItem: '渗漏水压', pointName: 'K1+800渗漏监测点', alertStartTime: '2026-06-07 22:00:00', alertEndTime: '2026-06-08 06:30:00', alertValue: '0.18', alertLevel: '三级预警', handleTime: '2026-06-08 10:00:00', handler: '李明', handleStatus: '已完成' },
])

const filters = ref({ regionValue: undefined as string[] | undefined, facilityName: '', deviceName: '', alertLevel: undefined as string | undefined, handleStatus: undefined as string | undefined })
function resetFilters() { filters.value = { regionValue: undefined, facilityName: '', deviceName: '', alertLevel: undefined, handleStatus: undefined } }
function handleSearch() {}
const filteredData = computed(() => { return data.value.filter(row => { const rv = filters.value.regionValue; if (rv && rv[0] && !row.city.startsWith(rv[0])) return false; if (rv && rv[1] && !row.city.includes(rv[1])) return false; if (filters.value.facilityName && !row.facilityName.includes(filters.value.facilityName)) return false; if (filters.value.deviceName && !row.deviceName.includes(filters.value.deviceName)) return false; if (filters.value.alertLevel && row.alertLevel !== filters.value.alertLevel) return false; if (filters.value.handleStatus && row.handleStatus !== filters.value.handleStatus) return false; return true }) })
function viewRecordFn(_r: DataRow) {}
</script>

<style scoped lang="scss">.alert-page { display: flex; flex-direction: column; gap: 16px; } .card { background: #fff; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); } .filter-form { :deep(.ant-form-item) { margin-bottom: 10px; } }</style>
