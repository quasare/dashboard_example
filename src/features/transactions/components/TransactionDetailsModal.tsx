'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Transaction } from '../types'
import { getTypeColor, getStatusColor, getMethodColor, getCategoryColor, formatCurrency, formatDate } from '../utils/mockData'

interface TransactionDetailsModalProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose
}: TransactionDetailsModalProps) {
  if (!transaction) return null

  const typeColor = getTypeColor(transaction.type)
  const statusColor = getStatusColor(transaction.status)
  const methodColor = getMethodColor(transaction.method)
  const categoryColor = getCategoryColor(transaction.category)

  const totalFees = transaction.fees.processing + transaction.fees.platform + transaction.fees.gateway + transaction.fees.currency + transaction.fees.other

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Transaction Details
                    </Dialog.Title>
                    {transaction.flagged && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        🚨 Flagged
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={onClose}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Information */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-600">Transaction Number:</span>
                            <p className="font-mono">{transaction.transactionNumber}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Reference:</span>
                            <p className="font-mono">{transaction.reference || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Type:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor} mt-1`}>
                              {transaction.type}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Status:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor} mt-1`}>
                              {transaction.status}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Method:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodColor} mt-1`}>
                              {transaction.method.replace('_', ' ')}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-600">Category:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColor} mt-1`}>
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Financial Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Financial Details</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Amount:</span>
                            <span className={`font-mono ${transaction.amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                              {formatCurrency(transaction.amount)} {transaction.currency}
                            </span>
                          </div>
                          
                          {totalFees > 0 && (
                            <>
                              <div className="border-t pt-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Fee Breakdown:</span>
                                </div>
                                {transaction.fees.processing > 0 && (
                                  <div className="flex justify-between text-xs">
                                    <span className="ml-2">Processing Fee:</span>
                                    <span className="font-mono">{formatCurrency(transaction.fees.processing)}</span>
                                  </div>
                                )}
                                {transaction.fees.platform > 0 && (
                                  <div className="flex justify-between text-xs">
                                    <span className="ml-2">Platform Fee:</span>
                                    <span className="font-mono">{formatCurrency(transaction.fees.platform)}</span>
                                  </div>
                                )}
                                {transaction.fees.gateway > 0 && (
                                  <div className="flex justify-between text-xs">
                                    <span className="ml-2">Gateway Fee:</span>
                                    <span className="font-mono">{formatCurrency(transaction.fees.gateway)}</span>
                                  </div>
                                )}
                                {transaction.fees.currency > 0 && (
                                  <div className="flex justify-between text-xs">
                                    <span className="ml-2">Currency Fee:</span>
                                    <span className="font-mono">{formatCurrency(transaction.fees.currency)}</span>
                                  </div>
                                )}
                                {transaction.fees.other > 0 && (
                                  <div className="flex justify-between text-xs">
                                    <span className="ml-2">Other Fees:</span>
                                    <span className="font-mono">{formatCurrency(transaction.fees.other)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-xs font-medium mt-1 pt-1 border-t">
                                  <span className="ml-2">Total Fees:</span>
                                  <span className="font-mono">{formatCurrency(totalFees)}</span>
                                </div>
                              </div>
                            </>
                          )}
                          
                          <div className="flex justify-between pt-2 border-t font-medium">
                            <span>Net Amount:</span>
                            <span className={`font-mono ${transaction.netAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {formatCurrency(transaction.netAmount)} {transaction.currency}
                            </span>
                          </div>

                          {transaction.exchangeRate && (
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Exchange Rate:</span>
                              <span className="font-mono">{transaction.exchangeRate}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Parties */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Transaction Parties</h4>
                        <div className="space-y-4">
                          <div>
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">From</span>
                            <div className="mt-1">
                              <p className="font-medium">{transaction.from.name}</p>
                              {transaction.from.email && (
                                <p className="text-sm text-gray-500">{transaction.from.email}</p>
                              )}
                              <p className="text-xs text-gray-400 capitalize">{transaction.from.type}</p>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">To</span>
                            <div className="mt-1">
                              <p className="font-medium">{transaction.to.name}</p>
                              {transaction.to.email && (
                                <p className="text-sm text-gray-500">{transaction.to.email}</p>
                              )}
                              <p className="text-xs text-gray-400 capitalize">{transaction.to.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Timestamps */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Timeline</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Created:</span>
                            <span>{formatDate(transaction.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Updated:</span>
                            <span>{formatDate(transaction.updatedAt)}</span>
                          </div>
                          {transaction.processedAt && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Processed:</span>
                              <span>{formatDate(transaction.processedAt)}</span>
                            </div>
                          )}
                          {transaction.settledAt && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Settled:</span>
                              <span>{formatDate(transaction.settledAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Related Entities */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Related Information</h4>
                        <div className="space-y-3 text-sm">
                          {transaction.orderId && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Order ID:</span>
                              <span className="font-mono">{transaction.orderId}</span>
                            </div>
                          )}
                          {transaction.paymentId && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Payment ID:</span>
                              <span className="font-mono">{transaction.paymentId}</span>
                            </div>
                          )}
                          {transaction.invoiceId && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Invoice ID:</span>
                              <span className="font-mono">{transaction.invoiceId}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Created By:</span>
                            <span>{transaction.createdBy}</span>
                          </div>
                          {transaction.updatedBy && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Updated By:</span>
                              <span>{transaction.updatedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Risk & Compliance */}
                      {(transaction.riskScore || transaction.flagged) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Risk & Compliance</h4>
                          <div className="space-y-3 text-sm">
                            {transaction.riskScore && (
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-600">Risk Score:</span>
                                <span className={`font-medium ${
                                  transaction.riskScore > 70 ? 'text-red-600' :
                                  transaction.riskScore > 40 ? 'text-yellow-600' : 'text-green-600'
                                }`}>
                                  {transaction.riskScore}/100
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">Flagged:</span>
                              <span className={transaction.flagged ? 'text-red-600' : 'text-green-600'}>
                                {transaction.flagged ? 'Yes' : 'No'}
                              </span>
                            </div>
                            {transaction.flagReason && (
                              <div>
                                <span className="font-medium text-gray-600">Flag Reason:</span>
                                <p className="mt-1 text-gray-900">{transaction.flagReason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {transaction.tags.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {transaction.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Items */}
                      {transaction.items && transaction.items.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-4">Transaction Items</h4>
                          <div className="space-y-3">
                            {transaction.items.map((item) => (
                              <div key={item.id} className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                                    <p className="text-xs text-gray-500">
                                      {item.quantity} × {formatCurrency(item.unitPrice)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description & Notes */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                          {transaction.description}
                        </p>
                      </div>
                      {transaction.notes && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                          <p className="text-sm text-gray-600 bg-gray-50 rounded p-3">
                            {transaction.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  {Object.keys(transaction.metadata).length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-4">Metadata</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                          {JSON.stringify(transaction.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}