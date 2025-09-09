'use client'

import { Transaction, TransactionStatus } from '../types'
import { getTypeColor, getStatusColor, getMethodColor, getCategoryColor, formatCurrency, formatDate } from '../utils/mockData'

interface TransactionTableProps {
  transactions: Transaction[]
  selectedTransactions: string[]
  onToggleSelection: (id: string) => void
  onViewDetails: (transaction: Transaction) => void
  onRefund: (id: string) => void
  onReverse: (id: string) => void
  onRetry: (id: string) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function TransactionTable({
  transactions,
  selectedTransactions,
  onToggleSelection,
  onViewDetails,
  onRefund,
  onReverse,
  onRetry,
  onApprove,
  onReject
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      </div>
    )
  }

  const getActionButtons = (transaction: Transaction) => {
    const buttons = []
    
    if (transaction.status === 'pending') {
      buttons.push(
        <button
          key="approve"
          onClick={(e) => {
            e.stopPropagation()
            onApprove(transaction.id)
          }}
          className="text-xs text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
          title="Approve transaction"
        >
          Approve
        </button>
      )
      buttons.push(
        <button
          key="reject"
          onClick={(e) => {
            e.stopPropagation()
            onReject(transaction.id)
          }}
          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
          title="Reject transaction"
        >
          Reject
        </button>
      )
    }
    
    if (transaction.status === 'failed' || transaction.status === 'cancelled') {
      buttons.push(
        <button
          key="retry"
          onClick={(e) => {
            e.stopPropagation()
            onRetry(transaction.id)
          }}
          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
          title="Retry transaction"
        >
          Retry
        </button>
      )
    }
    
    if (transaction.status === 'completed' && (transaction.type === 'payment' || transaction.type === 'deposit')) {
      buttons.push(
        <button
          key="refund"
          onClick={(e) => {
            e.stopPropagation()
            onRefund(transaction.id)
          }}
          className="text-xs text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded transition-colors"
          title="Refund transaction"
        >
          Refund
        </button>
      )
    }
    
    if (transaction.status === 'completed' || transaction.status === 'processing') {
      buttons.push(
        <button
          key="reverse"
          onClick={(e) => {
            e.stopPropagation()
            onReverse(transaction.id)
          }}
          className="text-xs text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
          title="Reverse transaction"
        >
          Reverse
        </button>
      )
    }
    
    return buttons
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                  onChange={() => {}}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => {
              const isSelected = selectedTransactions.includes(transaction.id)
              const typeColor = getTypeColor(transaction.type)
              const statusColor = getStatusColor(transaction.status)
              const methodColor = getMethodColor(transaction.method)
              const categoryColor = getCategoryColor(transaction.category)
              
              return (
                <tr
                  key={transaction.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  } ${transaction.flagged ? 'bg-red-50' : ''}`}
                  onClick={() => onViewDetails(transaction)}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        onToggleSelection(transaction.id)
                      }}
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {transaction.flagged && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" title={transaction.flagReason || 'Flagged transaction'} />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.transactionNumber}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {transaction.description}
                        </div>
                        {transaction.reference && (
                          <div className="text-xs text-gray-400">
                            Ref: {transaction.reference}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                        {transaction.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor}`}>
                        {transaction.category}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                      {transaction.status}
                    </span>
                    {transaction.riskScore && transaction.riskScore > 70 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          High Risk
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodColor}`}>
                      {transaction.method.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className={`font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatCurrency(transaction.amount)} {transaction.currency}
                      </div>
                      {transaction.amount !== transaction.netAmount && (
                        <div className="text-xs text-gray-500">
                          Net: {formatCurrency(transaction.netAmount)} {transaction.currency}
                        </div>
                      )}
                      {(transaction.fees.processing + transaction.fees.platform + transaction.fees.gateway + transaction.fees.currency + transaction.fees.other) > 0 && (
                        <div className="text-xs text-gray-400">
                          Fees: {formatCurrency(
                            transaction.fees.processing + 
                            transaction.fees.platform + 
                            transaction.fees.gateway + 
                            transaction.fees.currency + 
                            transaction.fees.other
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 truncate max-w-xs">
                        From: {transaction.from.name}
                      </div>
                      <div className="text-gray-500 truncate max-w-xs">
                        To: {transaction.to.name}
                      </div>
                      {transaction.from.email && (
                        <div className="text-xs text-gray-400 truncate max-w-xs">
                          {transaction.from.email}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </div>
                    {transaction.processedAt && (
                      <div className="text-xs text-gray-500">
                        Processed: {formatDate(transaction.processedAt)}
                      </div>
                    )}
                    {transaction.settledAt && (
                      <div className="text-xs text-gray-500">
                        Settled: {formatDate(transaction.settledAt)}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {getActionButtons(transaction)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}