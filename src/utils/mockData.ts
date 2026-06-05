import type { BridgeItem, BridgeSearchParams, PaginationResponse } from '@/types/bridge'

// Mock桥梁数据
const mockBridges: BridgeItem[] = [
  {
    key: '1',
    region: '杭州市市辖区',
    name: '古墩路跨线桥',
    type: '立交桥',
    structureType: '',
    buildTime: '2009-01-01',
    span: 1.1,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '2',
    region: '杭州市市辖区',
    name: '留石快速路(储鑫路至丰庆路)',
    type: '高架桥',
    structureType: '',
    buildTime: '2016-07-06',
    span: 6.43,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '3',
    region: '杭州市市辖区',
    name: '石祥路人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2016-05-03',
    span: 53.4,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '4',
    region: '杭州市市辖区',
    name: '欧尚人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2009-08-12',
    span: 57,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '5',
    region: '杭州市市辖区',
    name: '钱江人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2009-05-23',
    span: 53,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '6',
    region: '杭州市市辖区',
    name: '工商人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2011-05-27',
    span: 46.4,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '7',
    region: '杭州市市辖区',
    name: '财经大学人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2018-07-08',
    span: 75,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '8',
    region: '杭州市市辖区',
    name: '电子科大人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2018-07-08',
    span: 75,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '9',
    region: '杭州市市辖区',
    name: '欣然街人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2012-12-03',
    span: 75.975,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
  {
    key: '10',
    region: '杭州市市辖区',
    name: '万塘路人行天桥',
    type: '其他',
    structureType: '',
    buildTime: '2007-04-23',
    span: 168.68,
    isNavigationBridge: false,
    hasMonitorDevice: false,
    hasMonitorFacility: false,
    dataComplete: false,
  },
]

// 模拟获取桥梁列表
export function getBridgeList(
  params: BridgeSearchParams
): Promise<PaginationResponse<BridgeItem>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredList = [...mockBridges]

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
    }, 500) // 模拟网络延迟
  })
}

// 模拟删除桥梁
export function deleteBridge(key: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 300)
  })
}

// 模拟批量删除
export function batchDeleteBridge(keys: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

// 地区选项
export const regionOptions = [
  { label: '杭州市市辖区', value: '杭州市市辖区' },
  { label: '宁波市市辖区', value: '宁波市市辖区' },
  { label: '温州市市辖区', value: '温州市市辖区' },
]

// 桥梁类型选项
export const bridgeTypeOptions = [
  { label: '立交桥', value: '立交桥' },
  { label: '高架桥', value: '高架桥' },
  { label: '其他', value: '其他' },
]
