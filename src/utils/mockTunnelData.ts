import type { TunnelItem, TunnelSearchParams } from '@/types/tunnel'

// Mock隧道数据
const mockTunnels: TunnelItem[] = [
  {
    key: '1',
    region: '杭州市市辖区',
    name: '苏嘉路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '2',
    region: '杭州市市辖区',
    name: '紫金港北路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '3',
    region: '杭州市市辖区',
    name: '德胜路2号下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '4',
    region: '杭州市市辖区',
    name: '凤起路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '5',
    region: '杭州市市辖区',
    name: '沪德立交雨水泵站',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '6',
    region: '杭州市市辖区',
    name: '天鹅路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '7',
    region: '杭州市市辖区',
    name: '石大路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '8',
    region: '杭州市市辖区',
    name: '彭埠下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '9',
    region: '杭州市市辖区',
    name: '望江路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '10',
    region: '杭州市市辖区',
    name: '丁路下穿道',
    type: '',
    cityClassification: '',
    isUnderground: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
]

// 模拟获取隧道列表
export function getTunnelList(
  params: TunnelSearchParams
): Promise<{ list: TunnelItem[]; total: number; page: number; pageSize: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockTunnels]

      // 筛选
      if (params.region) {
        filteredList = filteredList.filter((item) => item.region.includes(params.region!))
      }
      if (params.name) {
        filteredList = filteredList.filter((item) => item.name.includes(params.name!))
      }
      if (params.type) {
        filteredList = filteredList.filter((item) => item.type === params.type)
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
  { label: '杭州市市辖区', value: '杭州市市辖区' },
  { label: '宁波市市辖区', value: '宁波市市辖区' },
  { label: '温州市市辖区', value: '温州市市辖区' },
  { label: '嘉兴市市辖区', value: '嘉兴市市辖区' },
  { label: '湖州市市辖区', value: '湖州市市辖区' },
]

// 隧道类型选项
export const tunnelTypeOptions = [
  { label: '下穿道', value: '下穿道' },
  { label: '山体隧道', value: '山体隧道' },
  { label: '其他', value: '其他' },
]
