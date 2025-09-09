'use client'

import { useState } from 'react'
import { Payment, PaymentStatus } from '../types'
import { getStatusColor, getMethodColor, getTypeColor, formatPaymentDate, formatCurrency, getPaymentStatusIcon } from '../utils/mockData'

interface PaymentTableProps {
  payments: Payment[]
  selectedPayments: string[]
  onToggleSelection: (paymentId: string) => void
  onViewDetails: (payment: Payment) => void
  onRetryPayment: (paymentId: string) => void
  onRefundPayment: (paymentId: string, reason: string) => void
  onCancelPayment: (paymentId: string, reason: string) => void
}

type SortField = 'createdAt' | 'amount' | 'status' | 'customer' | 'method'
type SortDirection = 'asc' | 'desc'

export function PaymentTable({
  payments,
  selectedPayments,
  onToggleSelection,
  onViewDetails,
  onRetryPayment,
  onRefundPayment,
  onCancelPayment
}: PaymentTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [refundingPayment, setRefundingPayment] = useState<string | null>(null)
  const [cancellingPayment, setCancellingPayment] = useState<string | null>(null)
  const [refundReason, setRefundReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedPayments = [...payments].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'customer') {
      aValue = a.customer.name
      bValue = b.customer.name
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const handleRefundSubmit = (paymentId: string) => {
    if (refundReason.trim()) {
      onRefundPayment(paymentId, refundReason)
      setRefundingPayment(null)
      setRefundReason('')
    }
  }

  const handleCancelSubmit = (paymentId: string) => {
    if (cancelReason.trim()) {
      onCancelPayment(paymentId, cancelReason)
      setCancellingPayment(null)
      setCancelReason('')
    }
  }

  const canRetry = (payment: Payment) => payment.status === 'failed'
  const canRefund = (payment: Payment) => payment.status === 'completed'
  const canCancel = (payment: Payment) => ['pending', 'processing'].includes(payment.status)

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={payments.length > 0 && selectedPayments.length === payments.length}
                  onChange={() => {
                    if (selectedPayments.length === payments.length) {
                      payments.forEach(payment => {
                        if (selectedPayments.includes(payment.id)) {
                          onToggleSelection(payment.id)
                        }
                      })
                    } else {
                      payments.forEach(payment => {
                        if (!selectedPayments.includes(payment.id)) {
                          onToggleSelection(payment.id)
                        }
                      })
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customer')}
              >
                <div className="flex items-center gap-1">
                  Customer {getSortIcon('customer')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1">
                  Amount {getSortIcon('amount')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('method')}
              >
                <div className="flex items-center gap-1">
                  Method {getSortIcon('method')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fees
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={() => onToggleSelection(payment.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatPaymentDate(payment.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <button
                    onClick={() => onViewDetails(payment)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {payment.id}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.customer.name}</div>
                  <div className="text-sm text-gray-500">{payment.customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(payment.amount, payment.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    <span className="mr-1">{getPaymentStatusIcon(payment.status)}</span>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(payment.method)}`}>
                    {payment.method.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                    {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(payment.fees.processing + payment.fees.platform)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onViewDetails(payment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                    
                    {canRetry(payment) && (
                      <button
                        onClick={() => onRetryPayment(payment.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        Retry
                      </button>
                    )}
                    
                    {canRefund(payment) && (
                      <button
                        onClick={() => setRefundingPayment(payment.id)}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        Refund
                      </button>
                    )}
                    
                    {canCancel(payment) && (
                      <button
                        onClick={() => setCancellingPayment(payment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No payments found</div>
          <div className="text-gray-400">Try adjusting your search or filter criteria</div>
        </div>
      )}

      {/* Refund Modal */}
      {refundingPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Refund Payment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Reason
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter reason for refund..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRefundingPayment(null)
                  setRefundReason('')
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRefundSubmit(refundingPayment)}
                disabled={!refundReason.trim()}
                className="px-4 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 rounded-md"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancellingPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Payment</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setCancellingPayment(null)
                  setCancelReason('')
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCancelSubmit(cancellingPayment)}
                disabled={!cancelReason.trim()}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 rounded-md"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}