export type ServiceType = '정기' | '비정기'

export type ServiceCategory = '클리닝' | '비품소모품 관리' | '비상주' | '컨시어지'

export interface ServiceItem {
  id: string
  serviceType: ServiceType
  category: ServiceCategory
  spaceCategory: string
  spaceSubcategory: string
  taskName: string
  frequency: string
  notes: string
}

export interface CustomerInfo {
  companyName: string
  contactName: string
  address: string
  officeSizePyeong: number
  serviceFrequency: string
  obManager: string
}

export interface QuoteCalculation {
  dailyHours: number
  hourlyRate: number
  daysPerWeek: number
  weeksPerMonth: number
  monthlyAmount: number
  vatAmount: number
  totalAmount: number
}

export interface AddonService {
  id: string
  name: string
  description: string
  monthlyPrice: number
  notes: string
}

export interface Quote {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  customer: CustomerInfo
  serviceItems: ServiceItem[]
  calculation: QuoteCalculation
  addonServices: AddonService[]
  notes: string
  validUntil: string
}
