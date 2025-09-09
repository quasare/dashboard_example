'use client'

import { useState } from 'react'
import { TransactionFilters as Filters, TransactionType, TransactionStatus, TransactionMethod, TransactionCategory } from '../types'
import { getTypeOptions, getStatusOptions, getMethodOptions, getCategoryOptions } from '../utils/mockData'

interface TransactionFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  transactionCount: number
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkUpdateStatus: (status: TransactionStatus) => void
  onBulkUpdateCategory: (category: TransactionCategory) => void
  onBulkFlag: (flagged: boolean, reason?: string) => void
  onExportTransactions: () => void
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  transactionCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkUpdateStatus,
  onBulkUpdateCategory,
  onBulkFlag,
  onExportTransactions
}: TransactionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [flagReason, setFlagReason] = useState('')

  const updateFilters = (updates: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearAllFilters = () => {
    onFiltersChange({
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
    })
  }

  const typeOptions = getTypeOptions()
  const statusOptions = getStatusOptions()
  const methodOptions = getMethodOptions()
  const categoryOptions = getCategoryOptions()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction Filters ({transactionCount} results)
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onExportTransactions}
            className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Selection and Bulk Actions */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedCount} transaction{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-3 py-1 text-xs text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded transition-colors"
              >
                Bulk Actions
              </button>
              <button
                onClick={onClearSelection}
                className="px-3 py-1 text-xs text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {showBulkActions && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Update Status</label>
                  <select
                    onChange={(e) => onBulkUpdateStatus(e.target.value as TransactionStatus)}
                    className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select status...</option>
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Update Category</label>
                  <select
                    onChange={(e) => onBulkUpdateCategory(e.target.value as TransactionCategory)}
                    className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category...</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Flag Transactions</label>
                  <div className="flex space-x-1">
                    <input
                      type="text"
                      placeholder="Reason..."
                      value={flagReason}
                      onChange={(e) => setFlagReason(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => onBulkFlag(true, flagReason)}
                      className="px-2 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                      Flag
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-800 mb-1">Actions</label>
                  <button
                    onClick={() => onBulkFlag(false)}
                    className="w-full px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                  >
                    Unflag All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Transaction number, description, party..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value as TransactionType | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value as TransactionStatus | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
          <select
            value={filters.method}
            onChange={(e) => updateFilters({ method: e.target.value as TransactionMethod | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Methods</option>
            {methodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value as TransactionCategory | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilters({ dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.amountMin}
                  onChange={(e) => updateFilters({ amountMin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.amountMax}
                  onChange={(e) => updateFilters({ amountMax: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={filters.currency}
                onChange={(e) => updateFilters({ currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Currencies</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flagged</label>
              <select
                value={filters.flagged === null ? '' : filters.flagged.toString()}
                onChange={(e) => updateFilters({ flagged: e.target.value === '' ? null : e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Transactions</option>
                <option value="true">Flagged Only</option>
                <option value="false">Not Flagged</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as Filters['sortBy'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created">Date Created</option>
                <option value="amount">Amount</option>
                <option value="status">Status</option>
                <option value="type">Type</option>
                <option value="method">Method</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilters({ sortOrder: e.target.value as 'asc' | 'desc' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Selection Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Select All ({transactionCount})
          </button>
          {selectedCount > 0 && (
            <button
              onClick={onClearSelection}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </div>
      </div>
    </div>
  )
}