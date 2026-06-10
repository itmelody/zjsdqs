<template>
  <div class="monitor-page">
    <!-- 筛选区 -->
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="车牌号">
          <a-input v-model:value="filters.plateNo" placeholder="请输入" allow-clear style="width: 140px" />
        </a-form-item>
        <a-form-item label="线路站点">
          <a-input v-model:value="filters.station" placeholder="请输入" allow-clear style="width: 140px" />
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="filters.status" placeholder="请选择" allow-clear style="width: 100px">
            <a-select-option value="正常">正常</a-select-option>
            <a-select-option value="超重">超重</a-select-option>
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
          <template v-if="column.key === 'status'">
            <a-tag :color="(record as DataRow).status === '超重' ? 'red' : 'green'">{{ (record as DataRow).status }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="viewDetail(record as DataRow)">查看详情</a-button>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 查看详情弹窗 -->
    <a-modal v-model:open="viewVisible" title="查看超限监测详情" width="700px" :footer="null">
      <a-descriptions :column="2" bordered size="small" style="margin-top: 12px">
        <a-descriptions-item label="车牌号">{{ viewRecord.plateNo }}</a-descriptions-item>
        <a-descriptions-item label="车辆颜色">{{ viewRecord.vehicleColor }}</a-descriptions-item>
        <a-descriptions-item label="车辆所有人">{{ viewRecord.owner }}</a-descriptions-item>
        <a-descriptions-item label="联系人">{{ viewRecord.contact }}</a-descriptions-item>
        <a-descriptions-item label="车型">{{ viewRecord.vehicleType }}</a-descriptions-item>
        <a-descriptions-item label="车轴数">{{ viewRecord.axleCount }}</a-descriptions-item>
        <a-descriptions-item label="线路站点">{{ viewRecord.station }}</a-descriptions-item>
        <a-descriptions-item label="过车时间">{{ viewRecord.passTime }}</a-descriptions-item>
        <a-descriptions-item label="总重（吨）">{{ viewRecord.totalWeight }}</a-descriptions-item>
        <a-descriptions-item label="超限量（吨）">{{ viewRecord.overWeight }}</a-descriptions-item>
        <a-descriptions-item label="超限率">{{ viewRecord.overRate }}</a-descriptions-item>
        <a-descriptions-item label="速度（km/h）">{{ viewRecord.speed }}</a-descriptions-item>
        <a-descriptions-item label="长（MM）">{{ viewRecord.length }}</a-descriptions-item>
        <a-descriptions-item label="宽（MM）">{{ viewRecord.width }}</a-descriptions-item>
        <a-descriptions-item label="高（MM）">{{ viewRecord.height }}</a-descriptions-item>
        <a-descriptions-item label="联系地址">{{ viewRecord.address }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag :color="viewRecord.status === '超重' ? 'red' : 'green'">{{ viewRecord.status }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="抓拍照片">
          <span v-if="viewRecord.photo">{{ viewRecord.photo }}</span>
          <span v-else style="color: #999">暂无照片</span>
        </a-descriptions-item>
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
  plateNo: string
  station: string
  passTime: string
  totalWeight: string
  overWeight: string
  overRate: string
  speed: string
  status: string
  vehicleColor: string
  owner: string
  contact: string
  vehicleType: string
  axleCount: string
  length: string
  width: string
  height: string
  address: string
  photo: string
}

const columns = [
  { title: '车牌号', dataIndex: 'plateNo', key: 'plateNo', width: 110 },
  { title: '线路站点', dataIndex: 'station', key: 'station', width: 160 },
  { title: '过车时间', dataIndex: 'passTime', key: 'passTime', width: 160 },
  { title: '总重（吨）', dataIndex: 'totalWeight', key: 'totalWeight', width: 100 },
  { title: '超限量（吨）', dataIndex: 'overWeight', key: 'overWeight', width: 110 },
  { title: '超重率（%）', dataIndex: 'overRate', key: 'overRate', width: 110 },
  { title: '速度（km/h）', dataIndex: 'speed', key: 'speed', width: 110 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '操作', key: 'action', width: 110, fixed: 'right' as const },
]

const data = ref<DataRow[]>([
  { id: 1, plateNo: '浙A·12345', station: '景御桥', passTime: '2026-06-06 08:32:15', totalWeight: '52.5', overWeight: '2.5', overRate: '5.0', speed: '65', status: '超重', vehicleColor: '蓝色', owner: '张建国', contact: '138****5521', vehicleType: '货车', axleCount: '6', length: '12000', width: '2500', height: '3800', address: '浙江省杭州市萧山区市心南路88号', photo: 'photo_20260606_083215.jpg' },
  { id: 2, plateNo: '浙B·67890', station: '钱江二桥北向南', passTime: '2026-06-06 09:15:40', totalWeight: '38.2', overWeight: '0', overRate: '0', speed: '72', status: '正常', vehicleColor: '白色', owner: '李明辉', contact: '139****8832', vehicleType: '货车', axleCount: '4', length: '8500', width: '2400', height: '3200', address: '浙江省宁波市鄞州区中山东路120号', photo: 'photo_20260606_091540.jpg' },
  { id: 3, plateNo: '浙G·33211', station: '临丁桥东向西', passTime: '2026-06-06 10:05:22', totalWeight: '61.8', overWeight: '11.8', overRate: '23.6', speed: '58', status: '超重', vehicleColor: '红色', owner: '王建军', contact: '137****4456', vehicleType: '货车', axleCount: '8', length: '16000', width: '2600', height: '4000', address: '浙江省金华市婺城区八一北街56号', photo: 'photo_20260606_100522.jpg' },
  { id: 4, plateNo: '浙E·55678', station: '秋石高架北向南', passTime: '2026-06-06 11:42:08', totalWeight: '28.5', overWeight: '0', overRate: '0', speed: '80', status: '正常', vehicleColor: '银色', owner: '赵国强', contact: '136****7712', vehicleType: '货车', axleCount: '3', length: '6800', width: '2300', height: '2900', address: '浙江省湖州市吴兴区红旗路200号', photo: '' },
  { id: 5, plateNo: '浙D·88901', station: '复兴大桥南向北', passTime: '2026-06-06 13:28:55', totalWeight: '48.0', overWeight: '0', overRate: '0', speed: '68', status: '正常', vehicleColor: '黄色', owner: '陈志远', contact: '135****2290', vehicleType: '货车', axleCount: '5', length: '10500', width: '2500', height: '3600', address: '浙江省绍兴市越城区解放南路188号', photo: 'photo_20260606_132855.jpg' },
  { id: 6, plateNo: '浙F·22345', station: '石祥路西向东', passTime: '2026-06-06 14:50:33', totalWeight: '58.2', overWeight: '8.2', overRate: '16.4', speed: '55', status: '超重', vehicleColor: '黑色', owner: '刘德华', contact: '133****6678', vehicleType: '货车', axleCount: '6', length: '13000', width: '2550', height: '3900', address: '浙江省嘉兴市南湖区勤俭路100号', photo: 'photo_20260606_145033.jpg' },
])

const filters = ref({
  plateNo: '',
  station: '',
  status: undefined as string | undefined,
})

function resetFilters() {
  filters.value = { plateNo: '', station: '', status: undefined }
}

function handleSearch() {}

const filteredData = computed(() => {
  return data.value.filter(row => {
    if (filters.value.plateNo && !row.plateNo.includes(filters.value.plateNo)) return false
    if (filters.value.station && !row.station.includes(filters.value.station)) return false
    if (filters.value.status && row.status !== filters.value.status) return false
    return true
  })
})

const viewVisible = ref(false)
const viewRecord = ref<DataRow>({} as DataRow)

function viewDetail(record: DataRow) {
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
