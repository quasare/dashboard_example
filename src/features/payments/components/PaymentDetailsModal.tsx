'use client'

import { Payment } from '../types'
import { getStatusColor, getMethodColor, getTypeColor, formatPaymentDate, formatCurrency, getPaymentStatusIcon } from '../utils/mockData'

interface PaymentDetailsModalProps {
  payment: Payment | null
  isOpen: boolean
  onClose: () => void
}

export function PaymentDetailsModal({ payment, isOpen, onClose }: PaymentDetailsModalProps) {
  if (!isOpen || !payment) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-medium text-gray-900">Payment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Payment Information */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Payment Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Payment ID:</dt>
                  <dd className="text-sm text-gray-900">{payment.id}</dd>
                </div>
                {payment.orderId && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Order ID:</dt>
                    <dd className="text-sm text-gray-900">{payment.orderId}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Transaction ID:</dt>
                  <dd className="text-sm text-gray-900">{payment.transactionId || 'N/A'}</dd>
                </div>
                {payment.processorId && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Processor ID:</dt>
                    <dd className="text-sm text-gray-900">{payment.processorId}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Amount & Fees */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Amount & Fees</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Amount:</dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {formatCurrency(payment.amount, payment.currency)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Processing Fee:</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(payment.fees.processing)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Platform Fee:</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(payment.fees.platform)}</dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <dt className="text-sm font-medium text-gray-500">Total Fees:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatCurrency(payment.fees.processing + payment.fees.platform)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Net Amount:</dt>
                  <dd className="text-sm font-semibold text-green-600">
                    {formatCurrency(payment.amount - payment.fees.processing - payment.fees.platform)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status & Method */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Status & Method</h4>
              <dl className="space-y-3">
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-gray-500">Status:</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      <span className="mr-1">{getPaymentStatusIcon(payment.status)}</span>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-gray-500">Method:</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(payment.method)}`}>
                      {payment.method.replace('_', ' ').toUpperCase()}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-gray-500">Type:</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                      {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Card Information */}
            {payment.card && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Card Information</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Brand:</dt>
                    <dd className="text-sm text-gray-900">{payment.card.brand}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Last 4 Digits:</dt>
                    <dd className="text-sm text-gray-900">•••• {payment.card.last4}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Expiry:</dt>
                    <dd className="text-sm text-gray-900">
                      {payment.card.expMonth.toString().padStart(2, '0')}/{payment.card.expYear}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* Right Column - Customer & Timeline */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Name:</dt>
                  <dd className="text-sm text-gray-900">{payment.customer.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Email:</dt>
                  <dd className="text-sm text-gray-900">{payment.customer.email}</dd>
                </div>
                {payment.customer.phone && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Phone:</dt>
                    <dd className="text-sm text-gray-900">{payment.customer.phone}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Customer ID:</dt>
                  <dd className="text-sm text-gray-900">{payment.customer.id}</dd>
                </div>
              </dl>
            </div>

            {/* Billing Address */}
            {payment.customer.address && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Billing Address</h4>
                <address className="text-sm text-gray-900 not-italic">
                  {payment.customer.address.street}<br />
                  {payment.customer.address.city}, {payment.customer.address.state} {payment.customer.address.zipCode}<br />
                  {payment.customer.address.country}
                </address>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Timeline</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Created:</dt>
                  <dd className="text-sm text-gray-900">{formatPaymentDate(payment.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Last Updated:</dt>
                  <dd className="text-sm text-gray-900">{formatPaymentDate(payment.updatedAt)}</dd>
                </div>
                {payment.processedAt && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Processed:</dt>
                    <dd className="text-sm text-gray-900">{formatPaymentDate(payment.processedAt)}</dd>
                  </div>
                )}
                {payment.refundedAt && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Refunded:</dt>
                    <dd className="text-sm text-gray-900">{formatPaymentDate(payment.refundedAt)}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-sm text-gray-700">{payment.description}</p>
            </div>

            {/* Failure/Refund Reason */}
            {(payment.failureReason || payment.refundReason) && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-red-900 mb-3">
                  {payment.failureReason ? 'Failure Reason' : 'Refund Reason'}
                </h4>
                <p className="text-sm text-red-700">
                  {payment.failureReason || payment.refundReason}
                </p>
              </div>
            )}

            {/* Metadata */}
            {payment.metadata && Object.keys(payment.metadata).length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Metadata</h4>
                <dl className="space-y-2">
                  {Object.entries(payment.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                      </dt>
                      <dd className="text-sm text-gray-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}