'use client'

import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { TransactionFilters } from './TransactionFilters'
import { TransactionTable } from './TransactionTable'
import { TransactionDetailsModal } from './TransactionDetailsModal'
import { Transaction } from '../types'
import { formatCurrency } from '../utils/mockData'

export function TransactionManagement() {
  const {
    transactions,
    transactionStats,
    filters,
    setFilters,
    selectedTransactions,
    actions
  } = useTransactions()

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedTransaction(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transaction Management</h1>
        <p className="mt-1 text-gray-500">
          Monitor and manage transaction history, filtering, and detailed analytics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Transactions</dt>
                  <dd className="text-lg font-medium text-gray-900">{transactionStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Volume</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(transactionStats.totalAmount)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{transactionStats.successRate}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2H9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Net Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(transactionStats.netRevenue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Status Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{transactionStats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{transactionStats.processing}</div>
            <div className="text-sm text-gray-500">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{transactionStats.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{transactionStats.failed}</div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{transactionStats.cancelled}</div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{transactionStats.disputed}</div>
            <div className="text-sm text-gray-500">Disputed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{transactionStats.reversed}</div>
            <div className="text-sm text-gray-500">Reversed</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Average Amount:</span>
              <span className="font-medium text-gray-900">{formatCurrency(transactionStats.averageAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Fees:</span>
              <span className="font-medium text-gray-900">{formatCurrency(transactionStats.totalFees)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Success Rate:</span>
              <span className={`font-medium ${transactionStats.successRate >= 95 ? 'text-green-600' : transactionStats.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                {transactionStats.successRate}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Volume by Type</h3>
          <div className="space-y-3">
            {Object.entries(transactionStats.volumeByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Volume by Method</h3>
          <div className="space-y-3">
            {Object.entries(transactionStats.volumeByMethod)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([method, count]) => (
                <div key={method} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 capitalize">{method.replace('_', ' ')}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Volume by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(transactionStats.volumeByCategory).map(([category, count]) => (
            <div key={category} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(count * 10) / 10}</div>
              <div className="text-sm text-gray-500 capitalize">{category}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
          transactionCount={transactions.length}
          selectedCount={selectedTransactions.length}
          onSelectAll={actions.selectAllTransactions}
          onClearSelection={actions.clearSelection}
          onBulkUpdateStatus={actions.bulkUpdateStatus}
          onBulkUpdateCategory={actions.bulkUpdateCategory}
          onBulkFlag={actions.bulkFlag}
          onExportTransactions={actions.exportTransactions}
        />
      </div>

      {/* Transaction Table */}
      <TransactionTable
        transactions={transactions}
        selectedTransactions={selectedTransactions}
        onToggleSelection={actions.toggleTransactionSelection}
        onViewDetails={handleViewDetails}
        onRefund={actions.refundTransaction}
        onReverse={actions.reverseTransaction}
        onRetry={actions.retryTransaction}
        onApprove={actions.approveTransaction}
        onReject={actions.rejectTransaction}
      />

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </div>
  )
}