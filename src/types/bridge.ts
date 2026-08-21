// 桥梁信息接口
export interface BridgeItem {
  key: string
  region: string
  name: string
  type: string
  cityClassification?: string
  structureType?: string
  buildTime: string
  span?: number
  isNavigationBridge: boolean
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
  // 公安交警联动单位（多条记录）
  policeRecords?: Array<{ unit: string; contact: string; phone: string }>
  bridgeLocation?: string
  isLargeTransportChannel?: string
  // 通航资料卡
  navigationCard?: BridgeNavigationCard
  // 子桥资料卡
  subBridges?: BridgeSubCard[]
  // 检测整改记录
  detectRecords?: BridgeDetectRecord[]
  // 桥梁资料卡
  bridgeCard?: BridgeCard
  // 人行天桥资料卡
  overpassCard?: OverpassCard
}

// 桥梁资料卡
export interface BridgeCard {
  // 制表单位
  unit?: string
  // 一般资料
  cardName?: string
  roadName?: string
  crossLevel?: string
  cardLocation?: string
  manageUnit?: string
  maintainUnit?: string
  buildUnit?: string
  designUnit?: string
  supervisorUnit?: string
  constructionUnit?: string
  buildDate?: string
  totalCost?: string
  maintainGrade?: string
  maintainLevel?: string
  roadGrade?: string
  structureType?: string
  designLoad?: string
  limitLoad?: string
  seismicIntensity?: string
  skewAngle?: string
  bridgeSpans?: string
  spanCombination?: string
  deckArea?: string
  bridgeTotalLength?: string
  bridgeTotalWidth?: string
  carriagewayWidth?: string
  sidewalkWidth?: string
  riverGrade?: string
  highestWaterLevel?: string
  normalWaterLevel?: string
  // 上部结构
  girderForm?: string
  girderSize?: string
  girderCount?: string
  crossBeamForm?: string
  mainSpanClearance?: string
  bridgeClearHeight?: string
  archRiseSpanRatio?: string
  bearingType?: string
  bearingCount?: string
  deckStructure?: string
  deckPavementThickness?: string
  expansionJointType?: string
  expansionJointCount?: string
  mainBridgeLongitudinalSlope?: string
  mainBridgeTransverseSlope?: string
  approachBridgeLongitudinalSlope?: string
  approachBridgeTransverseSlope?: string
  // 下部结构 - 桥墩
  pierForm?: string
  pierCount?: string
  pierElevation?: string
  capBeamSize?: string
  pierBaseElevation?: string
  pierBaseplateSize?: string
  pierPileSize?: string
  pierPileCount?: string
  // 下部结构 - 桥台
  abutmentForm?: string
  abutmentCount?: string
  abutmentElevation?: string
  abutmentBaseElevation?: string
  capSize?: string
  abutmentBaseplateSize?: string
  abutmentPileSize?: string
  abutmentPileCount?: string
  retainingPlateThickness?: string
  wingWallForm?: string
  wingWallLength?: string
  // 附属工程
  collectorSize?: string
  collectorCount?: string
  drainPipeSize?: string
  drainPipeLength?: string
  railingTotalLength?: string
  railingStructure?: string
  endColumnSize?: string
  bankProtectionType?: string
  approachRetainingWallType?: string
  attachedPipe?: BridgeAttachedPipe
  // 桥梁概况
  overview?: string
  // 附件上传
  structureDiagram?: string
  photos?: string
  // 制表信息
  audit?: string
  review?: string
  draft?: string
  cardDate?: string
  // 子桥独有兼容字段
  unitName?: string
  totalLength?: string
  loadGrade?: string
  checkWidth?: string
  deckLength?: string
  spanCount?: string
  pierHeight?: string
  manageType?: string
  beamForm?: string
  flangeWidth?: string
  deckSlope?: string
}

// 附挂管线
export interface BridgeAttachedPipe {
  waterPipe: string
  gasPipe: string
  powerCable: string
  telecomCable: string
}

// 通航资料卡
export interface BridgeNavigationCard {
  bridgeName: string
  bridgeNo: string
  bridgeFunctionType: string
  isNonRestrictedBridge: string
  province: string
  city: string
  county: string
  fourVerticalTwoHorizontalWaterway: string
  coastalSeaArea: string
  waterway: string
  coastalCrossingWaterway: string
  representativeShipType: string
  inlandWaterwayCurrentGrade: string
  inlandWaterwayPlanGrade: string
  dailyShipFlow: string
  navigationHoleSpanAndLayout: string
  bridgeWaterwayMaintenanceScale: string
  bridgeWaterAreaScope: string
  mainNavigationHoleMode: string
  mainNavigationClearHeight: string
  mainNavigationClearWidth: string
  designHighestNavigationWaterLevel: string
  pierAntiCollisionCapacity: string
  navigationHolePierAntiCollisionFacility: string
  activeWarningSystem: string
  bridgeNavigationAidMark: string
  bridgeAreaWaterwayBuoy: string
  buildUnit: string
  operationManageUnit: string
  operationManageContact: string
  maritimeAuthority: string
  waterwayMaintainUnit: string
  antiCollisionPlan: string
  emergencyPlanInLocal: string
  fourTypeBridgeFunctionType: string
  coastal: string
  inland: string
  bridgeType: string
  remark: string
  unit: string
}

// 人行天桥资料卡（导则表A.2）
export interface OverpassCard {
  // 一般资料
  name?: string
  roadName?: string
  district?: string
  cardNo?: string
  manageUnit?: string
  buildUnit?: string
  designUnit?: string
  supervisorUnit?: string
  constructionUnit?: string
  buildDate?: string
  structureType?: string
  designLoad?: string
  seismicIntensity?: string
  bridgeLength?: string
  passageWidth?: string
  carriagewayWidth?: string
  sidewalkWidth?: string
  designClearHeight?: string
  // 天桥土建
  superstructure?: string
  substructure?: string
  deckDecorationArea?: string
  sidewalkPavement?: string
  expansionJointType?: string
  settlementJointCount?: string
  railingStructure?: string
  railingTotalLength?: string
  bearingCount?: string
  roadTransverseSlope?: string
  drainageFacility?: string
  // 附属设施
  lightingName?: string
  lightingCount?: string
  powerName?: string
  powerCount?: string
  fireFightingName?: string
  fireFightingCount?: string
  escalatorBrand?: string
  escalatorCount?: string
  elevatorBrand?: string
  elevatorCount?: string
  // 制表信息
  audit?: string
  review?: string
  draft?: string
  cardDate?: string
}

// 子桥资料卡
export interface BridgeSubCard {
  name: string
  structureType: string
  maintainGrade: string
  span?: string
  length?: string
  width?: string
  buildDate?: string
  // 完整资料卡字段
  card?: BridgeCard
}

// 桥梁检测整改记录
export interface BridgeDetectRecord {
  id: number
  name: string
  checkTime: string
  result?: string
  type?: string
  // 对齐线上
  detectType?: string
  rectType?: string
  evalLevel?: string
  rectifyResult?: string
  rectifyDate?: string
}

// 桥梁详情接口
export interface BridgeDetail {
  key: string
  region: string
  name: string
  location: string
  buildTime: string
  type: string
  industryManager: string
  responsiblePerson: string
  contactPhone: string
  operationUnit: string
  siteSupervisor: string
  supervisorContact: string
  siteResponsiblePerson: string
  responsibleContact: string
  isNavigationBridge: boolean
  hasAntiCollision: boolean
  hasShipCollisionWarning: boolean
  hasMonitoring: boolean
  hasMonitorFacility: boolean
}

// 搜索参数接口
export interface BridgeSearchParams {
  region?: string
  name?: string
  type?: string
  cityClassification?: string
  evalLevel?: string
  isNavigationBridge?: string
  status?: string
  dataComplete?: string
  publishStatus?: string
  isOverdue?: string
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
