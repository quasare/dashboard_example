'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, CreditCard } from 'lucide-react'

interface KPIData {
  orders: {
    total: number
    completed: number
    pending: number
    totalAmount: number
  }
  payments: {
    total: number
    completed: number
    totalAmount: number
  }
  transactions: {
    total: number
    income: number
    expenses: number
    netAmount: number
  }
  users: {
    total: number
    admins: number
    managers: number
    users: number
  }
  revenue: {
    total: number
    monthly: Array<{
      id: number
      date: string
      year: number
      month: number
      amount: number
    }>
  }
}

export function KPICards() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const response = await api.get('/kpis/today')
        console.log('KPI API Response:', response.data)
        setKpiData(response.data)
      } catch (error: any) {
        console.error('Failed to fetch KPI data:', error)
        console.error('Error details:', error.response?.data || error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchKPIData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!kpiData) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">Failed to load KPI data</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const kpis = [
    {
      title: 'Total Revenue',
      value: formatCurrency(kpiData.revenue.total),
      growth: 12.5, // Static for now
      icon: DollarSign,
      description: 'Revenue this year',
    },
    {
      title: 'Total Users',
      value: kpiData.users.total.toLocaleString(),
      growth: 8.3, // Static for now
      icon: Users,
      description: 'Active users',
    },
    {
      title: 'Total Orders',
      value: kpiData.orders.total.toLocaleString(),
      growth: 15.2, // Static for now
      icon: ShoppingCart,
      description: 'Orders placed',
    },
    {
      title: 'Transactions',
      value: kpiData.transactions.total.toLocaleString(),
      growth: 6.7, // Static for now
      icon: CreditCard,
      description: 'Total transactions',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        const isPositive = kpi.growth >= 0
        const TrendIcon = isPositive ? TrendingUp : TrendingDown
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendIcon className={`h-3 w-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(kpi.growth)}%
                </span>
                <span>{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}