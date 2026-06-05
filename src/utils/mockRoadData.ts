import type { RoadItem, RoadSearchParams } from '@/types/road'

// Mock道路数据
const mockRoads: RoadItem[] = [
  {
    key: '1',
    region: '杭州市上城区',
    name: '石贵子巷(岳王路——中山中路)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '2',
    region: '杭州市上城区',
    name: '永田里(纱路——西塞)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '3',
    region: '杭州市上城区',
    name: '五圣堂(六圣堂——抚宁巷)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '4',
    region: '杭州市上城区',
    name: '六圣堂(彩霞岭——中河南路)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '5',
    region: '杭州市上城区',
    name: '黄公厂弄(江城路——黄公厂弄19幢)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '6',
    region: '杭州市上城区',
    name: '严官巷上山道路(严官巷——紫阳山)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '7',
    region: '杭州市上城区',
    name: '建国南苑主干道(建国南路——建国南苑小区内)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '8',
    region: '杭州市上城区',
    name: '邮驿路(城站广场——清泰立交西侧便道)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '9',
    region: '杭州市上城区',
    name: '断河头(河坊街——断河头1幢)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
  {
    key: '10',
    region: '杭州市上城区',
    name: '老浙大横路一弄(老浙大横路——卫生厅幼儿园)',
    level: '支路',
    buildTime: '2010-01-01',
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
    publishStatus: '草稿',
  },
]

// 模拟获取道路列表
export function getRoadList(
  params: RoadSearchParams
): Promise<{ list: RoadItem[]; total: number; page: number; pageSize: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockRoads]

      // 筛选
      if (params.region) {
        filteredList = filteredList.filter((item) => item.region.includes(params.region!))
      }
      if (params.name) {
        filteredList = filteredList.filter((item) => item.name.includes(params.name!))
      }
      if (params.level) {
        filteredList = filteredList.filter((item) => item.level === params.level)
      }

      // 分页
      const total = filteredList.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = filteredList.slice(start, end)

      resolve({
        list,
        total,
        page,
        pageSize,
      })
    }, 500)
  })
}

// 归属地区选项
export const regionOptions = [
  { label: '杭州市上城区', value: '杭州市上城区' },
  { label: '杭州市拱墅区', value: '杭州市拱墅区' },
  { label: '杭州市西湖区', value: '杭州市西湖区' },
  { label: '杭州市滨江区', value: '杭州市滨江区' },
  { label: '宁波市市辖区', value: '宁波市市辖区' },
]

// 道路等级选项
export const roadLevelOptions = [
  { label: '快速路', value: '快速路' },
  { label: '主干道', value: '主干道' },
  { label: '次干道', value: '次干道' },
  { label: '支路', value: '支路' },
]
