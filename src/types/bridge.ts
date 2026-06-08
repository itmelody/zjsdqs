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

// 桥梁详情接口
export interface BridgeDetail {
  key: string                    // 唯一标识
  region: string                 // 归属地区
  name: string                   // 桥梁名称
  location: string               // 桥梁位置
  buildTime: string              // 建成时间
  type: string                   // 桥梁类型
  industryManager: string        // 行业主管单位
  responsiblePerson: string      // 责任人
  contactPhone: string           // 联系方式
  operationUnit: string          // 现场运维单位
  siteSupervisor: string         // 现场监督管理人
  supervisorContact: string      // 管理人联系方式
  siteResponsiblePerson: string  // 现场责任人
  responsibleContact: string     // 责任人联系方式
  isNavigationBridge: boolean    // 是否涉航桥梁
  hasAntiCollision: boolean      // 是否设置防撞设施
  hasShipCollisionWarning: boolean // 是否安装防船撞预警系统
  hasMonitoring: boolean         // 是否设置监控设施
  hasMonitorFacility: boolean    // 是否设置监测设施
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
