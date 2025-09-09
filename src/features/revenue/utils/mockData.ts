import { RevenueData, RevenueSource, TimeSeriesData, RevenueForecast, RevenueBreakdown, RevenueStats, RevenueMetric } from '../types'

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100)
}

export const getSourceColor = (source: RevenueSource): string => {
  const colors = {
    orders: 'bg-blue-100 text-blue-800',
    subscriptions: 'bg-purple-100 text-purple-800',
    services: 'bg-green-100 text-green-800',
    commissions: 'bg-yellow-100 text-yellow-800',
    affiliates: 'bg-indigo-100 text-indigo-800',
    partnerships: 'bg-pink-100 text-pink-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return colors[source] || 'bg-gray-100 text-gray-800'
}

export const getTrendIcon = (trend: 'up' | 'down' | 'flat'): string => {
  const icons = {
    up: '📈',
    down: '📉',
    flat: '➡️'
  }
  return icons[trend]
}

// Generate time series data for the last 12 months
const generateTimeSeriesData = (): TimeSeriesData[] => {
  const data: TimeSeriesData[] = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const baseRevenue = 150000 + Math.random() * 50000
    const seasonality = Math.sin((date.getMonth() / 12) * 2 * Math.PI) * 20000
    const growth = (11 - i) * 2000 // Growth trend
    const value = Math.max(0, baseRevenue + seasonality + growth + (Math.random() - 0.5) * 30000)
    
    data.push({
      date,
      value,
      label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    })
  }
  
  return data
}

// Generate forecast data for next 6 months
const generateForecastData = (historicalData: TimeSeriesData[]): RevenueForecast[] => {
  const forecast: RevenueForecast[] = []
  const lastValue = historicalData[historicalData.length - 1].value
  const trend = (historicalData[historicalData.length - 1].value - historicalData[0].value) / historicalData.length
  
  for (let i = 1; i <= 6; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() + i)
    
    const predicted = lastValue + (trend * i) + (Math.random() - 0.5) * 10000
    const confidence = predicted * 0.15 // 15% confidence interval
    
    forecast.push({
      date,
      predicted: Math.max(0, predicted),
      confidence: {
        low: Math.max(0, predicted - confidence),
        high: predicted + confidence
      }
    })
  }
  
  return forecast
}

const createRevenueMetric = (current: number, previous: number): RevenueMetric => {
  const change = current - previous
  const changePercent = previous > 0 ? (change / previous) * 100 : 0
  const trend = changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'flat'
  
  return {
    current,
    previous,
    change,
    changePercent,
    trend
  }
}

export const mockRevenueData: RevenueData = (() => {
  const timeSeries = generateTimeSeriesData()
  const forecast = generateForecastData(timeSeries)
  
  const currentMonthRevenue = timeSeries[timeSeries.length - 1].value
  const previousMonthRevenue = timeSeries[timeSeries.length - 2].value
  const currentQuarterRevenue = timeSeries.slice(-3).reduce((sum, item) => sum + item.value, 0)
  const previousQuarterRevenue = timeSeries.slice(-6, -3).reduce((sum, item) => sum + item.value, 0)
  
  const breakdown: RevenueBreakdown[] = [
    {
      source: 'orders',
      amount: currentMonthRevenue * 0.65,
      percentage: 65,
      change: 12500,
      changePercent: 8.3,
      transactions: 1247
    },
    {
      source: 'subscriptions',
      amount: currentMonthRevenue * 0.25,
      percentage: 25,
      change: 8200,
      changePercent: 15.2,
      transactions: 342
    },
    {
      source: 'services',
      amount: currentMonthRevenue * 0.06,
      percentage: 6,
      change: -1200,
      changePercent: -3.8,
      transactions: 89
    },
    {
      source: 'commissions',
      amount: currentMonthRevenue * 0.03,
      percentage: 3,
      change: 450,
      changePercent: 2.1,
      transactions: 156
    },
    {
      source: 'affiliates',
      amount: currentMonthRevenue * 0.01,
      percentage: 1,
      change: 180,
      changePercent: 12.5,
      transactions: 23
    }
  ]
  
  const stats: RevenueStats = {
    total: createRevenueMetric(currentMonthRevenue, previousMonthRevenue),
    recurring: createRevenueMetric(currentMonthRevenue * 0.25, previousMonthRevenue * 0.23),
    oneTime: createRevenueMetric(currentMonthRevenue * 0.75, previousMonthRevenue * 0.77),
    avgOrderValue: createRevenueMetric(156.78, 142.34),
    avgRevenuePerUser: createRevenueMetric(89.45, 82.67),
    conversionRate: createRevenueMetric(3.2, 2.9),
    churnRate: createRevenueMetric(2.1, 2.4),
    growthRate: createRevenueMetric(12.5, 8.7)
  }
  
  const topProducts = [
    {
      id: 'prod-001',
      name: 'Premium Office Chair',
      revenue: 45230,
      units: 156,
      growth: 23.5
    },
    {
      id: 'prod-002',
      name: 'Executive Desk Set',
      revenue: 38920,
      units: 89,
      growth: 18.2
    },
    {
      id: 'prod-003',
      name: 'Conference Table',
      revenue: 32150,
      units: 45,
      growth: -5.3
    },
    {
      id: 'prod-004',
      name: 'Storage Cabinet',
      revenue: 28670,
      units: 203,
      growth: 31.8
    },
    {
      id: 'prod-005',
      name: 'Ergonomic Keyboard',
      revenue: 19450,
      units: 324,
      growth: 12.1
    }
  ]
  
  const topCustomers = [
    {
      id: 'cust-001',
      name: 'TechCorp Solutions',
      revenue: 125430,
      orders: 23,
      lastOrder: new Date('2024-01-20')
    },
    {
      id: 'cust-002',
      name: 'Global Enterprises',
      revenue: 98750,
      orders: 18,
      lastOrder: new Date('2024-01-18')
    },
    {
      id: 'cust-003',
      name: 'StartupHub Inc',
      revenue: 76920,
      orders: 34,
      lastOrder: new Date('2024-01-21')
    },
    {
      id: 'cust-004',
      name: 'Modern Offices LLC',
      revenue: 65480,
      orders: 15,
      lastOrder: new Date('2024-01-19')
    },
    {
      id: 'cust-005',
      name: 'Creative Spaces Co',
      revenue: 52340,
      orders: 28,
      lastOrder: new Date('2024-01-22')
    }
  ]
  
  return {
    timeSeries,
    breakdown,
    stats,
    forecast,
    topProducts,
    topCustomers
  }
})()

export const getDateRangePresets = () => [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 90 days', value: '90days' },
  { label: 'Last year', value: '1year' },
  { label: 'Custom', value: 'custom' }
]

export const getGroupByOptions = () => [
  { label: 'Daily', value: 'day' },
  { label: 'Weekly', value: 'week' },
  { label: 'Monthly', value: 'month' },
  { label: 'Quarterly', value: 'quarter' },
  { label: 'Yearly', value: 'year' }
]

export const getRevenueSourceOptions = () => [
  { label: 'Orders', value: 'orders' },
  { label: 'Subscriptions', value: 'subscriptions' },
  { label: 'Services', value: 'services' },
  { label: 'Commissions', value: 'commissions' },
  { label: 'Affiliates', value: 'affiliates' },
  { label: 'Partnerships', value: 'partnerships' },
  { label: 'Other', value: 'other' }
]

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}