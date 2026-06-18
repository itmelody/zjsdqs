<template>
  <div class="monitor-page">
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="归属地区">
          <a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 200px" @change="onRegionChange" />
        </a-form-item>
        <a-form-item label="监控点编号"><a-input v-model:value="filters.pointNo" placeholder="请输入" allow-clear style="width: 160px" /></a-form-item>
        <a-form-item label="监控点名称"><a-input v-model:value="filters.pointName" placeholder="请输入" allow-clear style="width: 160px" /></a-form-item>
        <a-form-item label="设备来源"><a-input v-model:value="filters.source" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="管理单位"><a-input v-model:value="filters.manageUnit" placeholder="请输入" allow-clear style="width: 140px" /></a-form-item>
        <a-form-item label="联系人"><a-input v-model:value="filters.contact" placeholder="请输入" allow-clear style="width: 120px" /></a-form-item>
        <a-form-item label="联系电话"><a-input v-model:value="filters.phone" placeholder="请输入" allow-clear style="width: 130px" /></a-form-item>
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
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="handlePlay(record as CameraRow)">播放</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface CameraRow {
  id: number; region: string; pointNo: string; pointName: string; source: string
  manageUnit: string; contact: string; phone: string
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
  { title: '监控点编号', dataIndex: 'pointNo', key: 'pointNo', width: 180 },
  { title: '监控点名称', dataIndex: 'pointName', key: 'pointName', width: 280 },
  { title: '设备来源', dataIndex: 'source', key: 'source', width: 120 },
  { title: '管理单位', dataIndex: 'manageUnit', key: 'manageUnit', width: 160 },
  { title: '联系人', dataIndex: 'contact', key: 'contact', width: 80 },
  { title: '联系电话', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
]

const cameraData = ref<CameraRow[]>([
  { id: 1, region: '杭州市滨江区', pointNo: '33010852011321001267', pointName: '长江路南环路口铁路涵洞口朝南-全', source: '地市直连数据', manageUnit: '滨江区城管局', contact: '张伟', phone: '15867234567' },
  { id: 2, region: '杭州市上城区', pointNo: '33010252011321001301', pointName: '解放路中山路口下穿道北侧-全', source: '地市直连数据', manageUnit: '上城区城管局', contact: '李明', phone: '13958123456' },
  { id: 3, region: '杭州市拱墅区', pointNo: '33010552011321001345', pointName: '环城北路莫干山路口涵洞口-全', source: '地市直连数据', manageUnit: '拱墅区城管局', contact: '王芳', phone: '13756789012' },
  { id: 4, region: '宁波市鄞州区', pointNo: '33021252011321001401', pointName: '百丈东路中兴路口下穿道东-全', source: '地市直连数据', manageUnit: '宁波市市政中心', contact: '陈强', phone: '13856781234' },
  { id: 5, region: '温州市鹿城区', pointNo: '33030252011321001456', pointName: '车站大道锦绣路口下穿道南-全', source: '地市直连数据', manageUnit: '温州市城管局', contact: '刘洋', phone: '15956789012' },
  { id: 6, region: '绍兴市越城区', pointNo: '33060252011321001501', pointName: '解放路人民路口下穿道西-全', source: '地市直连数据', manageUnit: '绍兴市市政中心', contact: '赵敏', phone: '13656789012' },
  { id: 7, region: '台州市路桥区', pointNo: '33100452011321001556', pointName: '路桥大道腾达路口下穿道-全', source: '地市直连数据', manageUnit: '路桥区城管局', contact: '孙磊', phone: '13756123456' },
  { id: 8, region: '金华市婺城区', pointNo: '33070252011321001601', pointName: '环城西路人民路口下穿道北-全', source: '地市直连数据', manageUnit: '金华市市政中心', contact: '周婷', phone: '15856123456' },
  { id: 9, region: '湖州市吴兴区', pointNo: '33050252011321001656', pointName: '苕溪路红旗路口下穿道东-全', source: '地市直连数据', manageUnit: '湖州市城管局', contact: '郑航辉', phone: '18968526897' },
  { id: 10, region: '嘉兴市南湖区', pointNo: '33040252011321001701', pointName: '勤俭路建国路口下穿道南-全', source: '地市直连数据', manageUnit: '嘉兴市市政中心', contact: '朱余', phone: '13587170720' },
])

const filters = ref({ regionValue: undefined as string[] | undefined, pointNo: '', pointName: '', source: '', manageUnit: '', contact: '', phone: '' })
function resetFilters() { filters.value = { regionValue: undefined, pointNo: '', pointName: '', source: '', manageUnit: '', contact: '', phone: '' } }
function handleSearch() {}

const filteredData = computed(() => {
  return cameraData.value.filter(row => {
    const rv = filters.value.regionValue
    if (rv && rv[0] && !row.region.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.region.includes(rv[1])) return false
    if (filters.value.pointNo && !row.pointNo.includes(filters.value.pointNo)) return false
    if (filters.value.pointName && !row.pointName.includes(filters.value.pointName)) return false
    if (filters.value.source && !row.source.includes(filters.value.source)) return false
    if (filters.value.manageUnit && !row.manageUnit.includes(filters.value.manageUnit)) return false
    if (filters.value.contact && !row.contact.includes(filters.value.contact)) return false
    if (filters.value.phone && !row.phone.includes(filters.value.phone)) return false
    return true
  })
})

function handlePlay(_record: CameraRow) {
  // TODO: 播放功能
}
</script>

<style scoped lang="scss">
.monitor-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 16px 20px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.filter-form { :deep(.ant-form-item) { margin-bottom: 10px; } }
</style>
