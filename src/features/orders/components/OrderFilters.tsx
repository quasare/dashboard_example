'use client'

import { OrderFilters as OrderFiltersType, OrderStatus, OrderPriority } from '../types'

interface OrderFiltersProps {
  filters: OrderFiltersType
  onFiltersChange: (filters: OrderFiltersType) => void
  orderCount: number
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkUpdateStatus: (status: OrderStatus) => void
  onExportOrders: () => void
}

export function OrderFilters({
  filters,
  onFiltersChange,
  orderCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkUpdateStatus,
  onExportOrders
}: OrderFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleStatusChange = (status: OrderStatus | undefined) => {
    onFiltersChange({ ...filters, status })
  }

  const handlePriorityChange = (priority: OrderPriority | undefined) => {
    onFiltersChange({ ...filters, priority })
  }

  const handleAmountRangeChange = (field: 'minAmount' | 'maxAmount', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value)
    onFiltersChange({ ...filters, [field]: numValue })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: undefined,
      priority: undefined,
      dateRange: undefined,
      minAmount: undefined,
      maxAmount: undefined
    })
  }

  const hasActiveFilters = 
    filters.search || 
    filters.status || 
    filters.priority || 
    filters.minAmount !== undefined || 
    filters.maxAmount !== undefined ||
    filters.dateRange

  return (
    <div className="space-y-4">
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders, customers, or products..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedCount > 0 ? (
            <>
              <span className="text-sm text-gray-600">
                {selectedCount} selected
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkUpdateStatus(e.target.value as OrderStatus)
                    e.target.value = ''
                  }
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                defaultValue=""
              >
                <option value="">Bulk Update Status</option>
                <option value="pending">Set to Pending</option>
                <option value="confirmed">Set to Confirmed</option>
                <option value="processing">Set to Processing</option>
                <option value="shipped">Set to Shipped</option>
                <option value="delivered">Set to Delivered</option>
                <option value="cancelled">Set to Cancelled</option>
              </select>
              <button
                onClick={onClearSelection}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Clear
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onSelectAll}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Select All ({orderCount})
              </button>
              <button
                onClick={onExportOrders}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Export
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus || undefined)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => handlePriorityChange(e.target.value as OrderPriority || undefined)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Amount Range */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Amount:</label>
          <input
            type="number"
            placeholder="Min"
            value={filters.minAmount ?? ''}
            onChange={(e) => handleAmountRangeChange('minAmount', e.target.value)}
            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxAmount ?? ''}
            onChange={(e) => handleAmountRangeChange('maxAmount', e.target.value)}
            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {orderCount} order{orderCount !== 1 ? 's' : ''}
        {hasActiveFilters && ' (filtered)'}
      </div>
    </div>
  )
}