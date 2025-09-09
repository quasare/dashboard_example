'use client'

import { useState, useMemo } from 'react'
import { Order, OrderFilters, OrderStatus, OrderPriority } from '../types'
import { mockOrders } from '../utils/mockData'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: undefined,
    priority: undefined,
    dateRange: undefined,
    minAmount: undefined,
    maxAmount: undefined
  })
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(filters.search.toLowerCase()))
      
      const matchesStatus = !filters.status || order.status === filters.status
      const matchesPriority = !filters.priority || order.priority === filters.priority
      const matchesAmount = 
        (!filters.minAmount || order.total >= filters.minAmount) &&
        (!filters.maxAmount || order.total <= filters.maxAmount)

      let matchesDateRange = true
      if (filters.dateRange?.start && filters.dateRange?.end) {
        const orderDate = new Date(order.orderDate)
        const startDate = new Date(filters.dateRange.start)
        const endDate = new Date(filters.dateRange.end)
        matchesDateRange = orderDate >= startDate && orderDate <= endDate
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesAmount && matchesDateRange
    })
  }, [orders, filters])

  const orderStats = useMemo(() => {
    const stats = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      refunded: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    }

    orders.forEach(order => {
      stats[order.status] = (stats[order.status] || 0) + 1
      if (order.status !== 'cancelled' && order.status !== 'refunded') {
        stats.totalRevenue += order.total
      }
    })

    stats.averageOrderValue = stats.totalRevenue / Math.max(stats.total - stats.cancelled, 1)
    return stats
  }, [orders])

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: newStatus,
            ...(newStatus === 'delivered' && !order.deliveredDate 
              ? { deliveredDate: new Date().toISOString() } 
              : {})
          }
        : order
    ))
  }

  const updateOrderPriority = (orderId: string, newPriority: OrderPriority) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, priority: newPriority } : order
    ))
  }

  const cancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(orderId, 'cancelled')
    }
  }

  const refundOrder = (orderId: string) => {
    if (confirm('Are you sure you want to process a refund for this order?')) {
      updateOrderStatus(orderId, 'refunded')
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const selectAllOrders = () => {
    setSelectedOrders(filteredOrders.map(order => order.id))
  }

  const clearSelection = () => {
    setSelectedOrders([])
  }

  const bulkUpdateStatus = (status: OrderStatus) => {
    if (selectedOrders.length === 0) return
    
    if (confirm(`Update ${selectedOrders.length} orders to ${status}?`)) {
      setOrders(prev => prev.map(order => 
        selectedOrders.includes(order.id) 
          ? { ...order, status }
          : order
      ))
      clearSelection()
    }
  }

  const exportOrders = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `orders-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return {
    orders: filteredOrders,
    allOrders: orders,
    filters,
    setFilters,
    selectedOrders,
    orderStats,
    actions: {
      updateOrderStatus,
      updateOrderPriority,
      cancelOrder,
      refundOrder,
      toggleOrderSelection,
      selectAllOrders,
      clearSelection,
      bulkUpdateStatus,
      exportOrders
    }
  }
}