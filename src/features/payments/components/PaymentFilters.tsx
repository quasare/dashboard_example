'use client'

import { PaymentFilters as IPaymentFilters, PaymentStatus, PaymentMethod, PaymentType } from '../types'

interface PaymentFiltersProps {
  filters: IPaymentFilters
  onFiltersChange: (filters: IPaymentFilters) => void
  paymentCount: number
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkUpdateStatus: (status: PaymentStatus) => void
  onExportPayments: () => void
}

export function PaymentFilters({
  filters,
  onFiltersChange,
  paymentCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkUpdateStatus,
  onExportPayments
}: PaymentFiltersProps) {
  const handleFilterChange = (key: keyof IPaymentFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      method: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: ''
    })
  }

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search payments..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedCount > 0 && (
            <>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkUpdateStatus(e.target.value as PaymentStatus)
                    e.target.value = ''
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">Bulk Status Update</option>
                <option value="processing">Mark as Processing</option>
                <option value="completed">Mark as Completed</option>
                <option value="failed">Mark as Failed</option>
                <option value="cancelled">Mark as Cancelled</option>
              </select>
              <button
                onClick={onClearSelection}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Clear Selection
              </button>
            </>
          )}
          
          <button
            onClick={selectedCount === paymentCount ? onClearSelection : onSelectAll}
            className="px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            {selectedCount === paymentCount ? 'Deselect All' : 'Select All'}
          </button>
          
          <button
            onClick={onExportPayments}
            className="px-3 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        {/* Method Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Method
          </label>
          <select
            value={filters.method}
            onChange={(e) => handleFilterChange('method', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Methods</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="paypal">PayPal</option>
            <option value="stripe">Stripe</option>
            <option value="apple_pay">Apple Pay</option>
            <option value="google_pay">Google Pay</option>
            <option value="cash">Cash</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="order">Order</option>
            <option value="subscription">Subscription</option>
            <option value="refund">Refund</option>
            <option value="fee">Fee</option>
            <option value="commission">Commission</option>
            <option value="deposit">Deposit</option>
          </select>
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Amount Range */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span>
            Showing <span className="font-medium text-gray-900">{paymentCount}</span> payments
          </span>
          {selectedCount > 0 && (
            <span>
              <span className="font-medium text-blue-600">{selectedCount}</span> selected
            </span>
          )}
        </div>
        
        {(filters.search || filters.status !== 'all' || filters.method !== 'all' || 
          filters.type !== 'all' || filters.dateFrom || filters.dateTo || 
          filters.minAmount || filters.maxAmount) && (
          <button
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}