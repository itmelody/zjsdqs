// 道路信息接口
export interface RoadItem {
  key: string                    // 唯一标识
  region: string                 // 归属地区
  name: string                   // 道路名称
  level: string                  // 道路等级
  buildTime: string              // 建成时间
  hasMonitorDevice: boolean      // 是否设置监控设备
  hasMonitorFacility: boolean    // 是否设置监测设施
  evalLevel?: string             // 综合评价等级
  evalYear?: number              // 评价年份
  dataComplete: boolean          // 数据是否完善
  publishStatus?: string         // 发布状态
}

// 搜索参数接口
export interface RoadSearchParams {
  region?: string
  name?: string
  level?: string
  page?: number
  pageSize?: number
}
