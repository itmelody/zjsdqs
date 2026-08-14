<template>
  <div class="monitor-page">
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="市区县">
          <a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 220px" @change="onRegionChange" />
        </a-form-item>
        <a-form-item label="设施ID"><a-input v-model:value="filters.facilityId" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="设施名称"><a-input v-model:value="filters.facilityName" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="设备ID"><a-input v-model:value="filters.deviceId" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="设备名称"><a-input v-model:value="filters.deviceName" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="是否在线">
          <a-select v-model:value="filters.online" placeholder="请选择" allow-clear style="width: 110px">
            <a-select-option value="在线">在线</a-select-option>
            <a-select-option value="离线">离线</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="resetFilters">重置</a-button>
            <a-button type="primary" @click="handleSearch">搜索</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <div class="card table-card">
      <div class="toolbar"><a-button type="primary" @click="openAddModal"><template #icon><PlusOutlined /></template>新增监测设备</a-button></div>
      <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="middle" bordered row-key="id" :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'online'"><a-tag :color="(record as DeviceRow).online === '在线' ? 'success' : 'error'">{{ (record as DeviceRow).online }}</a-tag></template>
          <template v-else-if="column.key === 'action'">
            <a-button type="link" size="small" @click="viewDevice(record as DeviceRow)">查看</a-button>
            <a-button type="link" size="small" @click="editDevice(record as DeviceRow)">编辑</a-button>
            <a-popconfirm title="确认删除？" @confirm="deleteDevice(record as DeviceRow)"><a-button type="link" danger size="small">删除</a-button></a-popconfirm>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 新增/编辑/查看弹窗 -->
    <a-modal v-model:open="showAddModal" :title="isViewMode ? '查看监测设备' : editingId ? '编辑监测设备' : '新增监测设备'" width="700px" :footer="null">
      <a-form :model="form" layout="horizontal" :label-col="{ span: 7 }" :wrapper-col="{ span: 15 }" style="margin-top: 16px">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="设施ID"><a-input v-model:value="form.facilityId" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设施名称"><a-input v-model:value="form.facilityName" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备ID"><a-input v-model:value="form.deviceId" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备名称"><a-input v-model:value="form.deviceName" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备类型"><a-input v-model:value="form.deviceType" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="监测项"><a-input v-model:value="form.monitorItem" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点位名称"><a-input v-model:value="form.pointName" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="市区县">
              <a-select v-model:value="form.regionValue" placeholder="请选择" allow-clear show-search :filter-option="filterRegionOption" :disabled="isViewMode">
                <a-select-option v-for="opt in flatRegionOptions" :key="opt" :value="opt">{{ opt }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点位一级阈值"><a-input v-model:value="form.threshold1" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点位二级阈值"><a-input v-model:value="form.threshold2" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="点位三级阈值"><a-input v-model:value="form.threshold3" placeholder="请输入" :disabled="isViewMode" /></a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div v-if="isViewMode" class="chart-section">
        <div class="chart-title">近7天点位数据（每日最大值 / 最小值 / 平均值）</div>
        <div ref="chartRef" class="chart-container"></div>
      </div>
      <div class="modal-footer">
        <template v-if="isViewMode">
          <a-button @click="showAddModal = false">关闭</a-button>
        </template>
        <template v-else>
          <a-button type="primary" @click="saveDevice">提交</a-button>
          <a-button @click="resetFormFields">重置</a-button>
          <a-button @click="showAddModal = false">关闭</a-button>
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

interface DeviceRow { id: number; facilityId: string; facilityName: string; deviceId: string; deviceName: string; deviceType: string; monitorItem: string; pointName: string; region: string; online: string; latestTime: string; latestValue: string }

const cityDistrictMap: Record<string, string[]> = {
  '杭州市': ['上城区','拱墅区','西湖区','滨江区','萧山区','余杭区','临平区','钱塘区','富阳区','临安区','桐庐县','淳安县','建德市'],
  '宁波市': ['海曙区','江北区','镇海区','北仑区','鄞州区','奉化区','余姚市','慈溪市','象山县','宁海县'],
  '温州市': ['鹿城区','龙湾区','瓯海区','洞头区','瑞安市','乐清市','永嘉县','平阳县','苍南县','文成县','泰顺县','龙港市'],
  '绍兴市': ['越城区','柯桥区','上虞区','诸暨市','嵊州市','新昌县'],
  '湖州市': ['吴兴区','南浔区','德清县','长兴县','安吉县'],
  '嘉兴市': ['南湖区','秀洲区','海宁市','平湖市','桐乡市','嘉善县','海盐县'],
  '金华市': ['婺城区','金东区','义乌市','东阳市','永康市','兰溪市','浦江县','武义县','磐安县'],
  '衢州市': ['柯城区','衢江区','江山市','龙游县','常山县','开化县'],
  '台州市': ['椒江区','黄岩区','路桥区','临海市','温岭市','玉环市','天台县','仙居县','三门县'],
  '丽水市': ['莲都区','龙泉市','青田县','缙云县','遂昌县','松阳县','云和县','庆元县','景宁畲族自治县'],
  '舟山市': ['定海区','普陀区','岱山县','嵊泗县'],
}

const cascaderOptions = Object.keys(cityDistrictMap).map(city => ({ value: city, label: city, children: cityDistrictMap[city].map(d => ({ value: d, label: d })) }))
function onRegionChange(val: string[] | undefined) { filters.value.regionValue = val || undefined }

const flatRegionOptions = Object.entries(cityDistrictMap).flatMap(([city, districts]) => districts.map((d: string) => city + d))
function filterRegionOption(input: string, option: any) { return (option?.value ?? '').toLowerCase().includes(input.toLowerCase()) }

const columns = [
  { title: '市区县', dataIndex: 'region', key: 'region', width: 110 },
  { title: '设施ID', dataIndex: 'facilityId', key: 'facilityId', width: 80 },
  { title: '设施名称', dataIndex: 'facilityName', key: 'facilityName', width: 120 },
  { title: '设备ID', dataIndex: 'deviceId', key: 'deviceId', width: 90 },
  { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 160 },
  { title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', width: 80 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 100 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 200 },
  { title: '是否在线', dataIndex: 'online', key: 'online', width: 90 },
  { title: '点位值最新时间', dataIndex: 'latestTime', key: 'latestTime', width: 160 },
  { title: '操作', key: 'action', width: 160, fixed: 'right' as const },
]

const today = dayjs().format('YYYY-M-D')
const d5 = dayjs().subtract(5, 'day').format('YYYY-M-D')

const deviceData = ref<DeviceRow[]>([
  { id: 1, facilityId: 'T001', facilityName: '紫之隧道', deviceId: 'T00001', deviceName: '紫之隧道结构变形设备', deviceType: '变形计', monitorItem: '结构变形', pointName: 'K3+200拱顶沉降监测点', region: '杭州市西湖区', online: '在线', latestTime: `${today} 11:20:00`, latestValue: '1.25' },
  { id: 2, facilityId: 'T002', facilityName: '常洪隧道', deviceId: 'T00002', deviceName: '常洪隧道渗漏监测设备', deviceType: '水压计', monitorItem: '渗漏水压', pointName: 'K1+800渗漏监测点', region: '宁波市鄞州区', online: '在线', latestTime: `${today} 15:40:00`, latestValue: '0.08' },
  { id: 3, facilityId: 'T003', facilityName: '括苍山隧道', deviceId: 'T00003', deviceName: '括苍山隧道通风设备', deviceType: '风速仪', monitorItem: '通风监测', pointName: 'K5+100通风监测点', region: '台州市临海市', online: '离线', latestTime: `${d5} 08:30:00`, latestValue: '3.5' },
])

const filters = ref({ regionValue: undefined as string[] | undefined, facilityId: '', facilityName: '', deviceId: '', deviceName: '', online: undefined as string | undefined })
function resetFilters() { filters.value = { regionValue: undefined, facilityId: '', facilityName: '', deviceId: '', deviceName: '', online: undefined } }
function handleSearch() {}

const filteredData = computed(() => {
  return deviceData.value.filter(row => {
    const rv = filters.value.regionValue
    if (rv && rv[0] && !row.region.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.region.includes(rv[1])) return false
    if (filters.value.facilityId && !row.facilityId.includes(filters.value.facilityId)) return false
    if (filters.value.facilityName && !row.facilityName.includes(filters.value.facilityName)) return false
    if (filters.value.deviceId && !row.deviceId.includes(filters.value.deviceId)) return false
    if (filters.value.deviceName && !row.deviceName.includes(filters.value.deviceName)) return false
    if (filters.value.online && row.online !== filters.value.online) return false
    return true
  })
})

// 新增/编辑/查看弹窗
const showAddModal = ref(false)
const editingId = ref<number | null>(null)
const isViewMode = ref(false)
const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const form = ref({
  facilityId: '', facilityName: '', deviceId: '', deviceName: '', deviceType: '',
  monitorItem: '', pointName: '', regionValue: undefined as string | undefined,
  threshold1: '', threshold2: '', threshold3: '',
})

function genWeekData() {
  const today = new Date()
  const dates: string[] = []; const maxArr: number[] = []; const minArr: number[] = []; const avgArr: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0')
    dates.push(`${m}/${day}`)
    const base = 2 + Math.random() * 2
    maxArr.push(+(base + Math.random() * 1.5).toFixed(2))
    minArr.push(+(base - 1 - Math.random() * 1.5).toFixed(2))
    avgArr.push(+(base - 0.2 + Math.random() * 0.8).toFixed(2))
  }
  return { dates, maxArr, minArr, avgArr }
}

watch(showAddModal, (val) => {
  if (val && isViewMode.value) {
    nextTick(() => {
      if (!chartRef.value) return
      if (chartInstance) chartInstance.dispose()
      chartInstance = echarts.init(chartRef.value)
      const { dates, maxArr, minArr, avgArr } = genWeekData()
      chartInstance.setOption({
        tooltip: { trigger: 'axis', formatter: (params: any) => { const date = params[0]?.axisValue || ''; let tip = `${date}<br/>`; params.forEach((p: any) => { tip += `${p.marker} ${p.seriesName}：<b>${p.value}</b><br/>` }); return tip } },
        legend: { data: ['最大值', '最小值', '平均值'], top: 0 },
        grid: { left: 50, right: 20, top: 40, bottom: 30 },
        xAxis: { type: 'category', data: dates, boundaryGap: false },
        yAxis: { type: 'value' },
        series: [
          { name: '最大值', type: 'line', data: maxArr, smooth: true, lineStyle: { color: '#f5222d' }, itemStyle: { color: '#f5222d' } },
          { name: '最小值', type: 'line', data: minArr, smooth: true, lineStyle: { color: '#1890ff' }, itemStyle: { color: '#1890ff' } },
          { name: '平均值', type: 'line', data: avgArr, smooth: true, lineStyle: { color: '#52c41a' }, itemStyle: { color: '#52c41a' } },
        ],
      })
    })
  } else { if (chartInstance) { chartInstance.dispose(); chartInstance = null } }
})

function resetFormFields() {
  form.value = { facilityId: '', facilityName: '', deviceId: '', deviceName: '', deviceType: '', monitorItem: '', pointName: '', regionValue: undefined, threshold1: '', threshold2: '', threshold3: '' }
  editingId.value = null; isViewMode.value = false
}

function openAddModal() { resetFormFields(); showAddModal.value = true }

function viewDevice(record: DeviceRow) {
  editingId.value = record.id; isViewMode.value = true
  form.value = { facilityId: record.facilityId, facilityName: record.facilityName, deviceId: record.deviceId, deviceName: record.deviceName, deviceType: record.deviceType, monitorItem: record.monitorItem, pointName: record.pointName, regionValue: record.region || undefined, threshold1: (record as any).threshold1 || '', threshold2: (record as any).threshold2 || '', threshold3: (record as any).threshold3 || '' }
  showAddModal.value = true
}

function editDevice(record: DeviceRow) {
  editingId.value = record.id; isViewMode.value = false
  form.value = { facilityId: record.facilityId, facilityName: record.facilityName, deviceId: record.deviceId, deviceName: record.deviceName, deviceType: record.deviceType, monitorItem: record.monitorItem, pointName: record.pointName, regionValue: record.region || undefined, threshold1: (record as any).threshold1 || '', threshold2: (record as any).threshold2 || '', threshold3: (record as any).threshold3 || '' }
  showAddModal.value = true
}

function deleteDevice(r: DeviceRow) { deviceData.value = deviceData.value.filter(x => x.id !== r.id) }

function saveDevice() {
  if (editingId.value) {
    const row = deviceData.value.find(r => r.id === editingId.value)
    if (row) { Object.assign(row, form.value); (row as any).threshold1 = form.value.threshold1; (row as any).threshold2 = form.value.threshold2; (row as any).threshold3 = form.value.threshold3 }
  } else {
    const newId = Math.max(...deviceData.value.map(r => r.id), 0) + 1
    deviceData.value.push({ id: newId, ...form.value, region: form.value.regionValue || '', online: '离线', latestTime: '', latestValue: '' } as any as DeviceRow)
  }
  editingId.value = null; resetFormFields(); showAddModal.value = false
}
</script>

<style scoped lang="scss">
.monitor-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.filter-form { :deep(.ant-form-item) { margin-bottom: 10px; } }
.toolbar { display: flex; justify-content: flex-start; margin-bottom: 12px; }
.modal-footer { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; padding-top: 12px; border-top: 1px solid #f0f0f0; }
.chart-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0;
  .chart-title { font-size: 14px; font-weight: 500; color: rgba(0,0,0,0.85); margin-bottom: 12px; }
  .chart-container { width: 100%; height: 280px; }
}
</style>
