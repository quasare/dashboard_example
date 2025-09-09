'use client'

import { useState, useMemo, useCallback } from 'react'
import { Transaction, TransactionFilters, TransactionStats, TransactionType, TransactionStatus, TransactionMethod, TransactionCategory } from '../types'
import { mockTransactions, calculateTransactionStats } from '../utils/mockData'

interface UseTransactionsReturn {
  transactions: Transaction[]
  transactionStats: TransactionStats
  filters: TransactionFilters
  setFilters: (filters: TransactionFilters) => void
  selectedTransactions: string[]
  actions: {
    toggleTransactionSelection: (id: string) => void
    selectAllTransactions: () => void
    clearSelection: () => void
    bulkUpdateStatus: (status: TransactionStatus) => void
    bulkUpdateCategory: (category: TransactionCategory) => void
    bulkFlag: (flagged: boolean, reason?: string) => void
    exportTransactions: () => void
    refundTransaction: (id: string) => void
    reverseTransaction: (id: string) => void
    retryTransaction: (id: string) => void
    approveTransaction: (id: string) => void
    rejectTransaction: (id: string) => void
  }
}

const defaultFilters: TransactionFilters = {
  search: '',
  type: 'all',
  status: 'all',
  method: 'all',
  category: 'all',
  dateFrom: '',
  dateTo: '',
  amountMin: '',
  amountMax: '',
  currency: 'USD',
  tags: [],
  flagged: null,
  sortBy: 'created',
  sortOrder: 'desc'
}

export function useTransactions(): UseTransactionsReturn {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(mockTransactions)
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters)
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([])

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = allTransactions.filter((transaction) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchFields = [
          transaction.transactionNumber,
          transaction.description,
          transaction.reference || '',
          transaction.from.name,
          transaction.to.name,
          transaction.from.email || '',
          transaction.to.email || '',
          ...transaction.tags
        ]
        
        if (!searchFields.some(field => field.toLowerCase().includes(searchLower))) {
          return false
        }
      }

      // Type filter
      if (filters.type !== 'all' && transaction.type !== filters.type) {
        return false
      }

      // Status filter
      if (filters.status !== 'all' && transaction.status !== filters.status) {
        return false
      }

      // Method filter
      if (filters.method !== 'all' && transaction.method !== filters.method) {
        return false
      }

      // Category filter
      if (filters.category !== 'all' && transaction.category !== filters.category) {
        return false
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        if (transaction.createdAt < fromDate) {
          return false
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        if (transaction.createdAt > toDate) {
          return false
        }
      }

      // Amount range filter
      if (filters.amountMin && transaction.amount < parseFloat(filters.amountMin)) {
        return false
      }

      if (filters.amountMax && transaction.amount > parseFloat(filters.amountMax)) {
        return false
      }

      // Currency filter
      if (filters.currency && transaction.currency !== filters.currency) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => 
          transaction.tags.some(transactionTag => 
            transactionTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
        if (!hasTag) {
          return false
        }
      }

      // Flagged filter
      if (filters.flagged !== null && transaction.flagged !== filters.flagged) {
        return false
      }

      return true
    })

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case 'created':
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
          break
        case 'amount':
          aValue = a.amount
          bValue = b.amount
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'method':
          aValue = a.method
          bValue = b.method
          break
        default:
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [allTransactions, filters])

  const transactionStats = useMemo(() => {
    return calculateTransactionStats(filteredAndSortedTransactions)
  }, [filteredAndSortedTransactions])

  const toggleTransactionSelection = useCallback((id: string) => {
    setSelectedTransactions(prev => 
      prev.includes(id) 
        ? prev.filter(transactionId => transactionId !== id)
        : [...prev, id]
    )
  }, [])

  const selectAllTransactions = useCallback(() => {
    setSelectedTransactions(filteredAndSortedTransactions.map(t => t.id))
  }, [filteredAndSortedTransactions])

  const clearSelection = useCallback(() => {
    setSelectedTransactions([])
  }, [])

  const bulkUpdateStatus = useCallback((status: TransactionStatus) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        selectedTransactions.includes(transaction.id)
          ? { ...transaction, status, updatedAt: new Date(), updatedBy: 'admin' }
          : transaction
      )
    )
    setSelectedTransactions([])
  }, [selectedTransactions])

  const bulkUpdateCategory = useCallback((category: TransactionCategory) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        selectedTransactions.includes(transaction.id)
          ? { ...transaction, category, updatedAt: new Date(), updatedBy: 'admin' }
          : transaction
      )
    )
    setSelectedTransactions([])
  }, [selectedTransactions])

  const bulkFlag = useCallback((flagged: boolean, reason?: string) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        selectedTransactions.includes(transaction.id)
          ? { 
              ...transaction, 
              flagged, 
              flagReason: flagged ? reason : undefined,
              updatedAt: new Date(), 
              updatedBy: 'admin' 
            }
          : transaction
      )
    )
    setSelectedTransactions([])
  }, [selectedTransactions])

  const exportTransactions = useCallback(() => {
    const dataToExport = selectedTransactions.length > 0 
      ? filteredAndSortedTransactions.filter(t => selectedTransactions.includes(t.id))
      : filteredAndSortedTransactions

    const headers = [
      'Transaction Number',
      'Type',
      'Status',
      'Method',
      'Category',
      'Amount',
      'Net Amount',
      'Currency',
      'From',
      'To',
      'Description',
      'Created At',
      'Flagged'
    ]

    const csvData = [
      headers.join(','),
      ...dataToExport.map(transaction => [
        transaction.transactionNumber,
        transaction.type,
        transaction.status,
        transaction.method,
        transaction.category,
        transaction.amount.toString(),
        transaction.netAmount.toString(),
        transaction.currency,
        transaction.from.name,
        transaction.to.name,
        `"${transaction.description.replace(/"/g, '""')}"`,
        transaction.createdAt.toISOString(),
        transaction.flagged.toString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, [filteredAndSortedTransactions, selectedTransactions])

  const refundTransaction = useCallback((id: string) => {
    setAllTransactions(prev =>
      prev.map(transaction => {
        if (transaction.id === id) {
          // Create a refund transaction
          const refundTransaction: Transaction = {
            ...transaction,
            id: `refund-${transaction.id}`,
            transactionNumber: `REF-${transaction.transactionNumber}`,
            type: 'refund',
            status: 'processing',
            amount: -Math.abs(transaction.amount),
            netAmount: -Math.abs(transaction.netAmount),
            description: `Refund for ${transaction.description}`,
            reference: transaction.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'admin',
            from: transaction.to, // Reverse parties
            to: transaction.from,
            tags: [...transaction.tags, 'refund']
          }
          
          // Add the refund transaction
          setTimeout(() => {
            setAllTransactions(current => [...current, refundTransaction])
          }, 0)
          
          // Update original transaction
          return {
            ...transaction,
            status: 'reversed' as TransactionStatus,
            updatedAt: new Date(),
            updatedBy: 'admin',
            tags: [...transaction.tags, 'refunded']
          }
        }
        return transaction
      })
    )
  }, [])

  const reverseTransaction = useCallback((id: string) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? {
              ...transaction,
              status: 'reversed' as TransactionStatus,
              updatedAt: new Date(),
              updatedBy: 'admin',
              tags: [...transaction.tags, 'reversed']
            }
          : transaction
      )
    )
  }, [])

  const retryTransaction = useCallback((id: string) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? {
              ...transaction,
              status: 'processing' as TransactionStatus,
              updatedAt: new Date(),
              updatedBy: 'admin',
              tags: [...transaction.tags, 'retried']
            }
          : transaction
      )
    )
  }, [])

  const approveTransaction = useCallback((id: string) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? {
              ...transaction,
              status: 'completed' as TransactionStatus,
              processedAt: new Date(),
              settledAt: new Date(),
              updatedAt: new Date(),
              updatedBy: 'admin',
              tags: [...transaction.tags, 'approved']
            }
          : transaction
      )
    )
  }, [])

  const rejectTransaction = useCallback((id: string) => {
    setAllTransactions(prev =>
      prev.map(transaction =>
        transaction.id === id
          ? {
              ...transaction,
              status: 'failed' as TransactionStatus,
              updatedAt: new Date(),
              updatedBy: 'admin',
              tags: [...transaction.tags, 'rejected']
            }
          : transaction
      )
    )
  }, [])

  return {
    transactions: filteredAndSortedTransactions,
    transactionStats,
    filters,
    setFilters,
    selectedTransactions,
    actions: {
      toggleTransactionSelection,
      selectAllTransactions,
      clearSelection,
      bulkUpdateStatus,
      bulkUpdateCategory,
      bulkFlag,
      exportTransactions,
      refundTransaction,
      reverseTransaction,
      retryTransaction,
      approveTransaction,
      rejectTransaction
    }
  }
}