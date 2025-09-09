"use client"

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

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
      month: number
      amount: number
    }>
  }
}

export function useKPIs() {
  const [data, setData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchKPIs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/kpis')
      setData(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch KPIs:', err)
      setError('Failed to load dashboard data')
      // Use mock data as fallback
      setData({
        orders: { total: 276000, completed: 245000, pending: 31000, totalAmount: 1250000 },
        payments: { total: 2468, completed: 2200, totalAmount: 45000 },
        transactions: { total: 1580, income: 950, expenses: 630, netAmount: 32000 },
        users: { total: 1250, admins: 5, managers: 15, users: 1230 },
        revenue: { total: 425000, monthly: [] }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKPIs()
  }, [])

  return { data, loading, error, refetch: fetchKPIs }
}
