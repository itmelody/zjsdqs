// 道路信息接口
export interface RoadItem {
  key: string
  region: string
  name: string
  level: string
  buildTime: string
  hasMonitorDevice: boolean
  hasMonitorFacility: boolean
  evalLevel?: string
  evalYear?: number
  dataComplete: boolean
  publishStatus?: string
  detectTime?: string
  isOverdue?: string
  status?: string
  // 三级责任体系
  industryUnit?: string
  industryPerson?: string
  industryContact?: string
  facilityManageUnit?: string
  facilityManagePerson?: string
  facilityManageContact?: string
  facilityMaintainUnit?: string
  facilityMaintainPerson?: string
  facilityMaintainContact?: string
  policeUnit?: string
  policeContact?: string
  policeContactPhone?: string
  roadLocation?: string
  // 检测整改记录
  detectRecords?: RoadDetectRecord[]
}

// 道路检测整改记录
export interface RoadDetectRecord {
  id: number
  name: string
  checkTime: string
  type: string
  evalGrade: string
  result: string
}

export interface RoadSearchParams {
  region?: string
  name?: string
  level?: string
  evalLevel?: string
  status?: string
  dataComplete?: string
  publishStatus?: string
  isOverdue?: string
  page?: number
  pageSize?: number
}
