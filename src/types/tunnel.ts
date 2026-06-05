// 隧道信息接口
export interface TunnelItem {
  key: string                    // 唯一标识
  region: string                 // 归属地区
  name: string                   // 隧道名称
  type?: string                  // 隧道类型
  cityClassification?: string    // 城市道路隧道分类
  buildTime?: string             // 建成时间
  isUnderground: boolean         // 是否地下隧道
  hasMonitorDevice: boolean      // 是否设置监控设施
  hasMonitorFacility: boolean    // 是否设置监测设施
  evalLevel?: string             // 综合评价等级
  evalYear?: number              // 评价年份
  dataComplete: boolean          // 数据是否完善
  publishStatus?: string         // 发布状态
}

// 搜索参数接口
export interface TunnelSearchParams {
  region?: string
  name?: string
  type?: string
  page?: number
  pageSize?: number
}
