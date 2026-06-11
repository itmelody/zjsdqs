<template>
  <div class="monitor-page">
    <!-- 筛选区 -->
    <div class="card filter-card">
      <a-form layout="inline" :model="filters" class="filter-form">
        <a-form-item label="市区县">
          <a-cascader v-model:value="filters.regionValue" :options="cascaderOptions" placeholder="请选择" allow-clear style="width: 220px" @change="onRegionChange" />
        </a-form-item>
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
        <a-form-item label="时间">
          <a-date-picker v-model:value="filters.passDate" placeholder="选择日期" style="width: 140px" />
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
      </a-descriptions>
      <!-- 抓拍照片区域 -->
      <div class="photo-section">
        <div class="photo-title">抓拍照片</div>
        <div class="photo-grid">
          <div class="photo-item" v-for="p in photoList" :key="p.label">
            <div class="photo-wrapper">
              <img v-if="p.url" :src="p.url" :alt="p.label" class="photo-img" @click="previewPhoto(p.url)" />
              <div v-else class="photo-empty">暂无照片</div>
            </div>
            <div class="photo-label">{{ p.label }}</div>
          </div>
        </div>
      </div>
      <!-- 图片预览 -->
      <a-modal v-model:open="previewVisible" :footer="null" width="720px" :title="previewTitle">
        <img :src="previewUrl" style="width: 100%" />
      </a-modal>
      <div style="text-align: right; margin-top: 16px">
        <a-button @click="viewVisible = false">关闭</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import dayjs from 'dayjs'

// 抓拍示例图片（公网可访问的真实监控/车辆图片）
const IMG = {
  plate: 'https://picsum.photos/seed/plate1/500/300',
  front: 'https://picsum.photos/seed/front1/500/300',
  side: 'https://picsum.photos/seed/side1/500/300',
  rear: 'https://picsum.photos/seed/rear1/500/300',
}

interface DataRow {
  id: number
  city: string
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
  platePhoto: string
  frontPhoto: string
  sidePhoto: string
  rearPhoto: string
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
  { title: '市区县', dataIndex: 'city', key: 'city', width: 110 },
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

const today = dayjs().format('YYYY-MM-DD')

const data = ref<DataRow[]>([
  { id: 1, city: '杭州市萧山区', plateNo: '浙A·12345', station: '景御桥', passTime: `${today} 08:32:15`, totalWeight: '52.5', overWeight: '2.5', overRate: '5.0', speed: '65', status: '超重', vehicleColor: '蓝色', owner: '张建国', contact: '138****5521', vehicleType: '货车', axleCount: '6', length: '12000', width: '2500', height: '3800', address: '浙江省杭州市萧山区市心南路88号', platePhoto: IMG.plate, frontPhoto: IMG.front, sidePhoto: IMG.side, rearPhoto: IMG.rear },
  { id: 2, city: '宁波市鄞州区', plateNo: '浙B·67890', station: '钱江二桥北向南', passTime: `${today} 09:15:40`, totalWeight: '38.2', overWeight: '0', overRate: '0', speed: '72', status: '正常', vehicleColor: '白色', owner: '李明辉', contact: '139****8832', vehicleType: '货车', axleCount: '4', length: '8500', width: '2400', height: '3200', address: '浙江省宁波市鄞州区中山东路120号', platePhoto: IMG.plate, frontPhoto: IMG.front, sidePhoto: IMG.side, rearPhoto: IMG.rear },
  { id: 3, city: '金华市婺城区', plateNo: '浙G·33211', station: '临丁桥东向西', passTime: `${today} 10:05:22`, totalWeight: '61.8', overWeight: '11.8', overRate: '23.6', speed: '58', status: '超重', vehicleColor: '红色', owner: '王建军', contact: '137****4456', vehicleType: '货车', axleCount: '8', length: '16000', width: '2600', height: '4000', address: '浙江省金华市婺城区八一北街56号', platePhoto: IMG.plate, frontPhoto: IMG.front, sidePhoto: IMG.side, rearPhoto: '' },
  { id: 4, city: '湖州市吴兴区', plateNo: '浙E·55678', station: '秋石高架北向南', passTime: `${today} 11:42:08`, totalWeight: '28.5', overWeight: '0', overRate: '0', speed: '80', status: '正常', vehicleColor: '银色', owner: '赵国强', contact: '136****7712', vehicleType: '货车', axleCount: '3', length: '6800', width: '2300', height: '2900', address: '浙江省湖州市吴兴区红旗路200号', platePhoto: '', frontPhoto: '', sidePhoto: '', rearPhoto: '' },
  { id: 5, city: '绍兴市越城区', plateNo: '浙D·88901', station: '复兴大桥南向北', passTime: `${today} 13:28:55`, totalWeight: '48.0', overWeight: '0', overRate: '0', speed: '68', status: '正常', vehicleColor: '黄色', owner: '陈志远', contact: '135****2290', vehicleType: '货车', axleCount: '5', length: '10500', width: '2500', height: '3600', address: '浙江省绍兴市越城区解放南路188号', platePhoto: IMG.plate, frontPhoto: IMG.front, sidePhoto: IMG.side, rearPhoto: IMG.rear },
  { id: 6, city: '嘉兴市南湖区', plateNo: '浙F·22345', station: '石祥路西向东', passTime: `${today} 14:50:33`, totalWeight: '58.2', overWeight: '8.2', overRate: '16.4', speed: '55', status: '超重', vehicleColor: '黑色', owner: '刘德华', contact: '133****6678', vehicleType: '货车', axleCount: '6', length: '13000', width: '2550', height: '3900', address: '浙江省嘉兴市南湖区勤俭路100号', platePhoto: IMG.plate, frontPhoto: IMG.front, sidePhoto: '', rearPhoto: IMG.rear },
])

const filters = ref({
  regionValue: undefined as string[] | undefined,
  plateNo: '',
  station: '',
  status: undefined as string | undefined,
  passDate: dayjs() as any,
})

function resetFilters() {
  filters.value = { regionValue: undefined, plateNo: '', station: '', status: undefined, passDate: dayjs() }
}

function handleSearch() {}

const filteredData = computed(() => {
  return data.value.filter(row => {
    const rv = filters.value.regionValue
    if (rv && rv[0] && !row.city.startsWith(rv[0])) return false
    if (rv && rv[1] && !row.city.includes(rv[1])) return false
    if (filters.value.plateNo && !row.plateNo.includes(filters.value.plateNo)) return false
    if (filters.value.station && !row.station.includes(filters.value.station)) return false
    if (filters.value.status && row.status !== filters.value.status) return false
    if (filters.value.passDate) {
      const d = filters.value.passDate.format ? filters.value.passDate.format('YYYY-MM-DD') : filters.value.passDate
      if (!row.passTime.startsWith(d)) return false
    }
    return true
  })
})

const viewVisible = ref(false)
const viewRecord = ref<DataRow>({} as DataRow)
const previewVisible = ref(false)
const previewUrl = ref('')
const previewTitle = ref('')

const photoList = computed(() => [
  { label: '车牌', url: viewRecord.value.platePhoto },
  { label: '前抓拍', url: viewRecord.value.frontPhoto },
  { label: '侧抓拍', url: viewRecord.value.sidePhoto },
  { label: '尾抓拍', url: viewRecord.value.rearPhoto },
])

function previewPhoto(url: string) {
  previewUrl.value = url
  previewTitle.value = '照片预览'
  previewVisible.value = true
}

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

.photo-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  .photo-title {
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 14px;
  }
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  .photo-item {
    text-align: center;
  }
  .photo-wrapper {
    width: 100%;
    height: 120px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e8e8e8;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .photo-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    transition: opacity 0.2s;
    &:hover { opacity: 0.8; }
  }
  .photo-empty {
    color: #bbb;
    font-size: 13px;
  }
  .photo-label {
    margin-top: 6px;
    font-size: 13px;
    color: #1a3a6d;
    font-weight: 500;
    background: #e8f0fe;
    border-radius: 4px;
    padding: 2px 0;
  }
}
</style>
