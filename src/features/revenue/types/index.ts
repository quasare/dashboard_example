export type RevenueSource = 
  | 'orders'
  | 'subscriptions'
  | 'services'
  | 'commissions'
  | 'affiliates'
  | 'partnerships'
  | 'other'

export type TimeSeriesData = {
  date: Date
  value: number
  label: string
}

export type RevenueMetric = {
  current: number
  previous: number
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'flat'
}

export interface RevenueForecast {
  date: Date
  predicted: number
  confidence: {
    low: number
    high: number
  }
  actual?: number
}

export interface RevenueBreakdown {
  source: RevenueSource
  amount: number
  percentage: number
  change: number
  changePercent: number
  transactions: number
}

export interface RevenueStats {
  total: RevenueMetric
  recurring: RevenueMetric
  oneTime: RevenueMetric
  avgOrderValue: RevenueMetric
  avgRevenuePerUser: RevenueMetric
  conversionRate: RevenueMetric
  churnRate: RevenueMetric
  growthRate: RevenueMetric
}

export interface RevenueFilters {
  dateRange: {
    from: string
    to: string
    preset: 'today' | '7days' | '30days' | '90days' | '1year' | 'custom'
  }
  sources: RevenueSource[]
  groupBy: 'day' | 'week' | 'month' | 'quarter' | 'year'
  currency: string
  includeRefunds: boolean
}

export interface RevenueData {
  timeSeries: TimeSeriesData[]
  breakdown: RevenueBreakdown[]
  stats: RevenueStats
  forecast: RevenueForecast[]
  topProducts: {
    id: string
    name: string
    revenue: number
    units: number
    growth: number
  }[]
  topCustomers: {
    id: string
    name: string
    revenue: number
    orders: number
    lastOrder: Date
  }[]
}