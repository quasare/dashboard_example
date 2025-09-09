'use client'

import { useState, useMemo, useCallback } from 'react'
import { RevenueData, RevenueFilters, RevenueSource } from '../types'
import { mockRevenueData } from '../utils/mockData'

export const useRevenue = () => {
  const [revenueData] = useState<RevenueData>(mockRevenueData)
  const [filters, setFilters] = useState<RevenueFilters>({
    dateRange: {
      from: '',
      to: '',
      preset: '30days'
    },
    sources: ['orders', 'subscriptions', 'services', 'commissions', 'affiliates'],
    groupBy: 'month',
    currency: 'USD',
    includeRefunds: true
  })

  const filteredData = useMemo(() => {
    // In a real app, this would filter the data based on the current filters
    // For now, we'll return the mock data as-is since it's already realistic
    return revenueData
  }, [revenueData, filters])

  const updateFilters = useCallback((newFilters: Partial<RevenueFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  const updateDateRange = useCallback((preset: string, from?: string, to?: string) => {
    const now = new Date()
    let fromDate = ''
    let toDate = now.toISOString().split('T')[0]

    switch (preset) {
      case 'today':
        fromDate = toDate
        break
      case '7days':
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case '30days':
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case '90days':
        fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        break
      case '1year':
        fromDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().split('T')[0]
        break
      case 'custom':
        fromDate = from || ''
        toDate = to || toDate
        break
    }

    updateFilters({
      dateRange: {
        preset: preset as any,
        from: fromDate,
        to: toDate
      }
    })
  }, [updateFilters])

  const toggleSource = useCallback((source: RevenueSource) => {
    setFilters(prev => ({
      ...prev,
      sources: prev.sources.includes(source)
        ? prev.sources.filter(s => s !== source)
        : [...prev.sources, source]
    }))
  }, [])

  const exportData = useCallback((format: 'csv' | 'json' = 'csv') => {
    if (format === 'csv') {
      // Export time series data as CSV
      const csvData = [
        ['Date', 'Revenue', 'Label'],
        ...filteredData.timeSeries.map(item => [
          item.date.toISOString().split('T')[0],
          item.value.toString(),
          item.label
        ])
      ]

      const csv = csvData.map(row => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `revenue-export-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } else {
      // Export as JSON
      const jsonData = JSON.stringify(filteredData, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `revenue-export-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      window.URL.revokeObjectURL(url)
    }
  }, [filteredData])

  const refreshData = useCallback(() => {
    // In a real app, this would refetch data from the API
    console.log('Refreshing revenue data...')
  }, [])

  return {
    data: filteredData,
    filters,
    actions: {
      updateFilters,
      updateDateRange,
      toggleSource,
      exportData,
      refreshData
    }
  }
}