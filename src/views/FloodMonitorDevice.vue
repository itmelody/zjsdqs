<template>
  <div class="monitor-page">
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="归属地区">
          <a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 200px" @change="onRegionChange" />
        </a-form-item>
        <a-form-item label="设备编号"><a-input v-model:value="filters.deviceNo" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="设备名称"><a-input v-model:value="filters.deviceName" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="管理单位"><a-input v-model:value="filters.manageUnit" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="具体地址"><a-input v-model:value="filters.address" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="联系人"><a-input v-model:value="filters.contact" placeholder="请输入" allow-clear style="width: 120px" /></a-form-item>
        <a-form-item label="在线状态">
          <a-select v-model:value="filters.online" placeholder="请选择" allow-clear style="width: 110px">
            <a-select-option value="在线">在线</a-select-option>
            <a-select-option value="离线">离线</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="是否绑定风险点">
          <a-select v-model:value="filters.bound" placeholder="请选择" allow-clear style="width: 110px">
            <a-select-option value="是">是</a-select-option>
            <a-select-option value="否">否</a-select-option>
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
      <a-table :columns="columns" :data-source="filteredData" :pagination="{ pageSize: 10, showTotal: (t: number) => `共${t}条` }" size="middle" bordered row-key="id" :scroll="{ x: 'max-content' }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'online'"><a-tag :color="(record as DeviceRow).online === '在线' ? 'success' : 'error'">{{ (record as DeviceRow).online }}</a-tag></template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DeviceRow {
  id: number; region: string; deviceNo: string; deviceName: string; deviceType: string
  manageUnit: string; address: string; contact: string; phone: string; online: string; boundRisk: string
}

const cityDistrictMap: Record<string, string[]> = {
  '杭州市': ['上城区','拱墅区','西湖区','滨江区','萧山区','余杭区','临平区','钱塘区','富阳区','临安区'],
  '宁波市': ['海曙区','江北区','镇海区','北仑区','鄞州区','奉化区'],
  '温州市': ['鹿城区','龙湾区','瓯海区','洞头区','瑞安市','乐清市'],
  '绍兴市': ['越城区','柯桥区','上虞区','诸暨市','嵊州市','新昌县'],
  '湖州市': ['吴兴区','南浔区','德清县','长兴县','安吉县'],
  '嘉兴市': ['南湖区','秀洲区','海宁市','平湖市','桐乡市'],
  '金华市': ['婺城区','金东区','义乌市','东阳市','永康市','兰溪市'],
  '衢州市': ['柯城区','衢江区','江山市','龙游县','常山县','开化县'],
  '台州市': ['椒江区','黄岩区','路桥区','临海市','温岭市','玉环市'],
  '丽水市': ['莲都区','龙泉市','青田县','缙云县','遂昌县','松阳县'],
  '舟山市': ['定海区','普陀区','岱山县','嵊泗县'],
}

const cascaderOptions = Object.keys(cityDistrictMap).map(city => ({ value: city, label: city, children: cityDistrictMap[city].map(d => ({ value: d, label: d })) }))
function onRegionChange(val: string[] | undefined) { filters.value.regionValue = val || undefined }

const columns = [
  { title: '归属地区', dataIndex: 'region', key: 'region', width: 120 },
  { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 150 },
  { title: '设备名称', dataIndex: 'deviceName', key: 'deviceName', width: 180 },
  { title: '设备类型', dataIndex: 'deviceType', key: 'deviceType', width: 130 },
  { title: '管理单位', dataIndex: 'manageUnit', key: 'manageUnit', width: 180 },
  { title: '具体地址', dataIndex: 'address', key: 'address', width: 220 },
  { title: '联系人', dataIndex: 'contact', key: 'contact', width: 80 },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '在线状态', dataIndex: 'online', key: 'online', width: 90 },
  { title: '绑定风险点', dataIndex: 'boundRisk', key: 'boundRisk', width: 100 },
]

const deviceData = ref<DeviceRow[]>([
  { id: 1, region: '丽水市莲都区', deviceNo: '01302305080005', deviceName: '水东大桥东边下穿立交', deviceType: '液位仪（超声波）', manageUnit: '丽水市市政中心', address: '石浜隧道', contact: '朱余', phone: '13587170720', online: '离线', boundRisk: '是' },
  { id: 2, region: '台州市路桥区', deviceNo: '01302305080012', deviceName: '路桥大道下穿立交', deviceType: '液位仪（雷达）', manageUnit: '中国电信股份有限公司绍兴分公司', address: '浙江省金华市婺城区乾西乡环城西路辅路', contact: '郑航辉', phone: '18968526897', online: '在线', boundRisk: '否' },
  { id: 3, region: '杭州市上城区', deviceNo: '01302305080018', deviceName: '秋石高架下穿道', deviceType: '液位仪（超声波）', manageUnit: '杭州市市政设施管理中心', address: '秋石高架下方通道', contact: '李明', phone: '13958123456', online: '在线', boundRisk: '是' },
  { id: 4, region: '杭州市滨江区', deviceNo: '01302305080025', deviceName: '江南大道下穿立交', deviceType: '液位仪（雷达）', manageUnit: '滨江区城管局', address: '江南大道与火炬大道交叉口', contact: '张伟', phone: '15867234567', online: '离线', boundRisk: '否' },
  { id: 5, region: '宁波市鄞州区', deviceNo: '01302305080031', deviceName: '百丈东路下穿道', deviceType: '液位仪（超声波）', manageUnit: '宁波市市政中心', address: '百丈东路与中兴路交叉口', contact: '王芳', phone: '13756789012', online: '在线', boundRisk: '是' },
  { id: 6, region: '绍兴市越城区', deviceNo: '01302305080038', deviceName: '解放路下穿立交', deviceType: '液位仪（雷达）', manageUnit: '绍兴市市政中心', address: '解放路与人民路交叉口', contact: '陈强', phone: '13856781234', online: '在线', boundRisk: '否' },
  { id: 7, region: '温州市鹿城区', deviceNo: '01302305080044', deviceName: '车站大道下穿道', deviceType: '液位仪（超声波）', manageUnit: '温州市城管局', address: '车站大道与锦绣路交叉口', contact: '刘洋', phone: '15956789012', online: '离线', boundRisk: '是' },
  { id: 8, region: '金华市婺城区', deviceNo: '01302305080051', deviceName: '环城西路下穿立交', deviceType: '液位仪（雷达）', manageUnit: '金华市市政中心', address: '环城西路与人民路交叉口', contact: '赵敏', phone: '13656789012', online: '在线', boundRisk: '否' },
  { id: 9, region: '湖州市吴兴区', deviceNo: '01302305080058', deviceName: '苕溪路下穿道', deviceType: '液位仪（超声波）', manageUnit: '湖州市城管局', address: '苕溪路与红旗路交叉口', contact: '孙磊', phone: '13756123456', online: '离线', boundRisk: '否' },
  { id: 10, region: '嘉兴市南湖区', deviceNo: '01302305080065', deviceName: '勤俭路下穿立交', deviceType: '液位仪（雷达）', manageUnit: '嘉兴市市政中心', address: '勤俭路与建国路交叉口', contact: '周婷', phone: '15856123456', online: '在线', boundRisk: '是' },
])

const filters = ref({ regionValue: undefined as string[] | undefined, deviceNo: '', deviceName: '', manageUnit: '', address: '', contact: '', online: undefined as string | undefined, bound: undefined as string | undefined })
function resetFilters() { filters.value = { regionValue: undefined, deviceNo: '', deviceName: '', manageUnit: '', address: '', contact: '', online: undefined, bound: undefined } }
function handleSearch() {}

const filteredData = computed(() => {
  return deviceData.value.filter(row => {
    const rv = filters.value.regionValue
    if (rv && rv[0] && !row.region.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.region.includes(rv[1])) return false
    if (filters.value.deviceNo && !row.deviceNo.includes(filters.value.deviceNo)) return false
    if (filters.value.deviceName && !row.deviceName.includes(filters.value.deviceName)) return false
    if (filters.value.manageUnit && !row.manageUnit.includes(filters.value.manageUnit)) return false
    if (filters.value.address && !row.address.includes(filters.value.address)) return false
    if (filters.value.contact && !row.contact.includes(filters.value.contact)) return false
    if (filters.value.online && row.online !== filters.value.online) return false
    if (filters.value.bound && row.boundRisk !== filters.value.bound) return false
    return true
  })
})
</script>

<style scoped lang="scss">
.monitor-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.filter-form { :deep(.ant-form-item) { margin-bottom: 10px; } }
</style>
