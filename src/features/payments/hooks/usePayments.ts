'use client'

import { useState, useMemo, useCallback } from 'react'
import { Payment, PaymentFilters, PaymentStats, PaymentStatus } from '../types'
import { mockPayments, calculatePaymentStats } from '../utils/mockData'

export const usePayments = () => {
  const [payments] = useState<Payment[]>(mockPayments)
  const [selectedPayments, setSelectedPayments] = useState<string[]>([])
  const [filters, setFilters] = useState<PaymentFilters>({
    search: '',
    status: 'all',
    method: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  })

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          payment.customer.name.toLowerCase().includes(searchLower) ||
          payment.customer.email.toLowerCase().includes(searchLower) ||
          payment.id.toLowerCase().includes(searchLower) ||
          payment.orderId?.toLowerCase().includes(searchLower) ||
          payment.transactionId?.toLowerCase().includes(searchLower) ||
          payment.description.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== 'all' && payment.status !== filters.status) {
        return false
      }

      // Method filter
      if (filters.method !== 'all' && payment.method !== filters.method) {
        return false
      }

      // Type filter
      if (filters.type !== 'all' && payment.type !== filters.type) {
        return false
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        if (payment.createdAt < fromDate) return false
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        if (payment.createdAt > toDate) return false
      }

      // Amount range filter
      if (filters.minAmount) {
        const minAmount = parseFloat(filters.minAmount)
        if (payment.amount < minAmount) return false
      }

      if (filters.maxAmount) {
        const maxAmount = parseFloat(filters.maxAmount)
        if (payment.amount > maxAmount) return false
      }

      return true
    })
  }, [payments, filters])

  const paymentStats = useMemo(() => {
    return calculatePaymentStats(filteredPayments)
  }, [filteredPayments])

  const togglePaymentSelection = useCallback((paymentId: string) => {
    setSelectedPayments(prev => 
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    )
  }, [])

  const selectAllPayments = useCallback(() => {
    setSelectedPayments(filteredPayments.map(payment => payment.id))
  }, [filteredPayments])

  const clearSelection = useCallback(() => {
    setSelectedPayments([])
  }, [])

  const bulkUpdateStatus = useCallback((status: PaymentStatus) => {
    console.log(`Bulk updating ${selectedPayments.length} payments to status: ${status}`)
    // In a real app, this would make an API call
    clearSelection()
  }, [selectedPayments, clearSelection])

  const exportPayments = useCallback(() => {
    const exportData = filteredPayments.map(payment => ({
      'Payment ID': payment.id,
      'Order ID': payment.orderId || '',
      'Customer': payment.customer.name,
      'Email': payment.customer.email,
      'Amount': payment.amount,
      'Currency': payment.currency,
      'Status': payment.status,
      'Method': payment.method,
      'Type': payment.type,
      'Description': payment.description,
      'Transaction ID': payment.transactionId || '',
      'Created At': payment.createdAt.toISOString(),
      'Processing Fee': payment.fees.processing,
      'Platform Fee': payment.fees.platform
    }))

    const csv = [
      Object.keys(exportData[0] || {}).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }, [filteredPayments])

  const retryPayment = useCallback((paymentId: string) => {
    console.log(`Retrying payment: ${paymentId}`)
    // In a real app, this would make an API call to retry the payment
  }, [])

  const refundPayment = useCallback((paymentId: string, reason: string) => {
    console.log(`Refunding payment ${paymentId} with reason: ${reason}`)
    // In a real app, this would make an API call to process the refund
  }, [])

  const cancelPayment = useCallback((paymentId: string, reason: string) => {
    console.log(`Cancelling payment ${paymentId} with reason: ${reason}`)
    // In a real app, this would make an API call to cancel the payment
  }, [])

  return {
    payments: filteredPayments,
    paymentStats,
    filters,
    setFilters,
    selectedPayments,
    actions: {
      togglePaymentSelection,
      selectAllPayments,
      clearSelection,
      bulkUpdateStatus,
      exportPayments,
      retryPayment,
      refundPayment,
      cancelPayment
    }
  }
}