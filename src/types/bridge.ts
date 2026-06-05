// 桥梁信息接口
export interface BridgeItem {
  key: string                    // 唯一标识
  region: string                 // 归属地区
  name: string                   // 桥梁名称
  type: string                   // 桥梁类型
  structureType?: string         // 结构类型
  buildTime: string              // 建成时间
  span: number                   // 跨度(米)
  isNavigationBridge: boolean    // 是否涉航桥梁
  hasMonitorDevice: boolean      // 是否设置监控设备
  hasMonitorFacility: boolean    // 是否设置监测设施
  evalLevel?: string             // 综合评价等级
  evalYear?: number              // 评价年份
  dataComplete: boolean          // 数据是否完善
  publishStatus?: string         // 发布状态
}

// 搜索参数接口
export interface BridgeSearchParams {
  region?: string
  name?: string
  type?: string
  page?: number
  pageSize?: number
}

// 分页响应接口
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 地区选项
export interface RegionOption {
  label: string
  value: string
}

// 桥梁类型选项
export interface BridgeTypeOption {
  label: string
  value: string
}
