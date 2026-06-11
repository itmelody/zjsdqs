<template>
  <div class="alert-page">
    <!-- 筛选区 -->
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="市区县">
          <a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 220px" @change="onRegionChange" />
        </a-form-item>
        <a-form-item label="设施名称">
          <a-input v-model:value="filters.facilityName" placeholder="请输入" allow-clear style="width: 130px" />
        </a-form-item>
        <a-form-item label="设备名称">
          <a-input v-model:value="filters.deviceName" placeholder="请输入" allow-clear style="width: 130px" />
        </a-form-item>
        <a-form-item label="监测项">
          <a-select v-model:value="filters.monitorItem" placeholder="请选择" allow-clear style="width: 130px">
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
        <a-form-item label="预警等级">
          <a-select v-model:value="filters.alertLevel" placeholder="请选择" allow-clear style="width: 120px">
            <a-select-option value="一级预警">一级预警</a-select-option>
            <a-select-option value="二级预警">二级预警</a-select-option>
            <a-select-option value="三级预警">三级预警</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="处置状态">
          <a-select v-model:value="filters.handleStatus" placeholder="请选择" allow-clear style="width: 110px">
            <a-select-option value="已完成">已完成</a-select-option>
            <a-select-option value="未完成">未完成</a-select-option>
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
    <a-modal v-model:open="viewVisible" title="查看监测预警" width="600px" :footer="null">
      <a-descriptions :column="2" bordered size="small" style="margin-top: 12px">
        <a-descriptions-item label="市区县">{{ viewRecord.city }}</a-descriptions-item>
        <a-descriptions-item label="设施名称">{{ viewRecord.facilityName }}</a-descriptions-item>
        <a-descriptions-item label="设备名称">{{ viewRecord.deviceName }}</a-descriptions-item>
        <a-descriptions-item label="监测项">{{ viewRecord.monitorItem }}</a-descriptions-item>
        <a-descriptions-item label="点位名称" :span="2">{{ viewRecord.pointName }}</a-descriptions-item>
        <a-descriptions-item label="报警开始时间">{{ viewRecord.alertStartTime }}</a-descriptions-item>
        <a-descriptions-item label="报警结束时间">{{ viewRecord.alertEndTime }}</a-descriptions-item>
        <a-descriptions-item label="预警值">{{ viewRecord.alertValue }}</a-descriptions-item>
        <a-descriptions-item label="预警等级">{{ viewRecord.alertLevel }}</a-descriptions-item>
        <a-descriptions-item label="处置状态">{{ viewRecord.handleStatus }}</a-descriptions-item>
        <a-descriptions-item label="处置完成时间">{{ viewRecord.handleTime }}</a-descriptions-item>
        <a-descriptions-item label="处置人">{{ viewRecord.handler }}</a-descriptions-item>
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
  alertStartTime: string
  alertEndTime: string
  alertValue: string
  alertLevel: string
  handleTime: string
  handler: string
  handleStatus: string
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

const columns = [
  { title: '市区县', dataIndex: 'city', key: 'city', width: 100 },
  { title: '设施名称', dataIndex: 'facilityName', key: 'facilityName', width: 110 },
  { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 150 },
  { title: '监测项', dataIndex: 'monitorItem', key: 'monitorItem', width: 100 },
  { title: '点位名称', dataIndex: 'pointName', key: 'pointName', width: 200 },
  { title: '报警开始时间', dataIndex: 'alertStartTime', key: 'alertStartTime', width: 160 },
  { title: '报警结束时间', dataIndex: 'alertEndTime', key: 'alertEndTime', width: 160 },
  { title: '预警值', dataIndex: 'alertValue', key: 'alertValue', width: 90 },
  { title: '预警等级', dataIndex: 'alertLevel', key: 'alertLevel', width: 100 },
  { title: '处置状态', dataIndex: 'handleStatus', key: 'handleStatus', width: 100 },
  { title: '处置完成时间', dataIndex: 'handleTime', key: 'handleTime', width: 160 },
  { title: '处置人', dataIndex: 'handler', key: 'handler', width: 80 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const data = ref<DataRow[]>([
  { id: 1, city: '杭州市西湖区', facilityName: '钱塘江大桥', deviceName: '钱塘江大桥应变设备', monitorItem: '应变', pointName: '主跨1/4截面应变监测点', alertStartTime: '2026-05-12 08:30:00', alertEndTime: '2026-05-12 14:20:00', alertValue: '2.15', alertLevel: '一级预警', handleTime: '2026-05-13 10:00:00', handler: '张伟', handleStatus: '已完成' },
  { id: 2, city: '宁波市海曙区', facilityName: '甬江大桥', deviceName: '甬江大桥倾斜设备', monitorItem: '位移', pointName: '主塔顶部倾斜监测点', alertStartTime: '2026-05-20 16:45:00', alertEndTime: '2026-05-21 09:10:00', alertValue: '0.12', alertLevel: '二级预警', handleTime: '', handler: '', handleStatus: '未完成' },
  { id: 3, city: '湖州市吴兴区', facilityName: '苕溪桥', deviceName: '苕溪桥振动设备', monitorItem: '加速度', pointName: '跨中位置竖向加速度监测点', alertStartTime: '2026-06-01 11:05:00', alertEndTime: '2026-06-01 11:30:00', alertValue: '0.008', alertLevel: '三级预警', handleTime: '2026-06-02 15:30:00', handler: '李明', handleStatus: '已完成' },
  { id: 4, city: '温州市鹿城区', facilityName: '瓯江大桥', deviceName: '瓯江大桥索力设备', monitorItem: '吊杆索力振动', pointName: '第5号索索力监测点', alertStartTime: '2026-06-03 07:20:00', alertEndTime: '', alertValue: '3100', alertLevel: '一级预警', handleTime: '', handler: '', handleStatus: '未完成' },
  { id: 5, city: '衢州市柯城区', facilityName: '西安门大桥', deviceName: '西安门大桥位移设备', monitorItem: '挠度', pointName: '第2跨跨中挠度监测点', alertStartTime: '2026-05-28 22:10:00', alertEndTime: '2026-05-29 06:00:00', alertValue: '4.50', alertLevel: '二级预警', handleTime: '2026-05-30 09:00:00', handler: '王芳', handleStatus: '已完成' },
  { id: 6, city: '绍兴市越城区', facilityName: '沪漕立交桥', deviceName: '沪漕立交桥应变设备', monitorItem: '应变', pointName: '25-北副应变;第3号拱肋截面1/2等分点', alertStartTime: '2026-06-05 03:40:00', alertEndTime: '', alertValue: '-2.10', alertLevel: '三级预警', handleTime: '', handler: '', handleStatus: '未完成' },
])

const filters = ref({
  regionValue: undefined as string[] | undefined,
  facilityName: '',
  deviceName: '',
  monitorItem: undefined as string | undefined,
  pointName: '',
  alertLevel: undefined as string | undefined,
  handleStatus: undefined as string | undefined,
})

function resetFilters() {
  filters.value = { regionValue: undefined, facilityName: '', deviceName: '', monitorItem: undefined, pointName: '', alertLevel: undefined, handleStatus: undefined }
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
    if (filters.value.alertLevel && row.alertLevel !== filters.value.alertLevel) return false
    if (filters.value.handleStatus && row.handleStatus !== filters.value.handleStatus) return false
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
.alert-page {
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
