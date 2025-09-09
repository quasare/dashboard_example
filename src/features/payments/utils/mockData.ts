import { Payment, PaymentStats, PaymentStatus, PaymentMethod, PaymentType } from '../types'

export const mockPayments: Payment[] = [
  {
    id: 'payment-001',
    orderId: 'order-001',
    customerId: 'customer-001',
    customer: {
      id: 'customer-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+1-555-0123',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
        country: 'USA'
      }
    },
    amount: 1299.99,
    currency: 'USD',
    status: 'completed',
    method: 'credit_card',
    type: 'order',
    description: 'Order payment for premium furniture set',
    card: {
      last4: '4242',
      brand: 'Visa',
      expMonth: 12,
      expYear: 2025
    },
    transactionId: 'txn_1234567890',
    processorId: 'stripe_pi_1234567890',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:32:00Z'),
    processedAt: new Date('2024-01-15T10:32:00Z'),
    fees: {
      processing: 37.70,
      platform: 12.99
    },
    metadata: {
      source: 'website',
      campaignId: 'winter-sale-2024'
    }
  },
  {
    id: 'payment-002',
    orderId: 'order-002',
    customerId: 'customer-002',
    customer: {
      id: 'customer-002',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      phone: '+1-555-0124'
    },
    amount: 599.50,
    currency: 'USD',
    status: 'processing',
    method: 'paypal',
    type: 'order',
    description: 'Order payment for office chair',
    transactionId: 'txn_0987654321',
    processorId: 'paypal_123456789',
    createdAt: new Date('2024-01-16T14:15:00Z'),
    updatedAt: new Date('2024-01-16T14:16:00Z'),
    fees: {
      processing: 17.39,
      platform: 5.99
    }
  },
  {
    id: 'payment-003',
    customerId: 'customer-003',
    customer: {
      id: 'customer-003',
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      phone: '+1-555-0125'
    },
    amount: 2499.00,
    currency: 'USD',
    status: 'failed',
    method: 'credit_card',
    type: 'order',
    description: 'Order payment for dining room set',
    card: {
      last4: '1234',
      brand: 'MasterCard',
      expMonth: 8,
      expYear: 2024
    },
    transactionId: 'txn_1122334455',
    processorId: 'stripe_pi_failed_123',
    failureReason: 'Insufficient funds',
    createdAt: new Date('2024-01-17T09:45:00Z'),
    updatedAt: new Date('2024-01-17T09:46:00Z'),
    fees: {
      processing: 0,
      platform: 0
    }
  },
  {
    id: 'payment-004',
    orderId: 'order-004',
    customerId: 'customer-004',
    customer: {
      id: 'customer-004',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1-555-0126'
    },
    amount: 899.99,
    currency: 'USD',
    status: 'refunded',
    method: 'apple_pay',
    type: 'order',
    description: 'Order payment for coffee table',
    transactionId: 'txn_9988776655',
    processorId: 'stripe_pi_refunded_456',
    refundReason: 'Customer requested return',
    createdAt: new Date('2024-01-18T16:20:00Z'),
    updatedAt: new Date('2024-01-20T11:30:00Z'),
    processedAt: new Date('2024-01-18T16:22:00Z'),
    refundedAt: new Date('2024-01-20T11:30:00Z'),
    fees: {
      processing: 26.10,
      platform: 8.99
    }
  },
  {
    id: 'payment-005',
    customerId: 'customer-005',
    customer: {
      id: 'customer-005',
      name: 'Emma Brown',
      email: 'emma.brown@example.com',
      phone: '+1-555-0127'
    },
    amount: 49.99,
    currency: 'USD',
    status: 'pending',
    method: 'bank_transfer',
    type: 'subscription',
    description: 'Monthly premium subscription',
    transactionId: 'txn_5544332211',
    createdAt: new Date('2024-01-19T08:00:00Z'),
    updatedAt: new Date('2024-01-19T08:00:00Z'),
    fees: {
      processing: 0.50,
      platform: 4.99
    }
  },
  {
    id: 'payment-006',
    orderId: 'order-006',
    customerId: 'customer-006',
    customer: {
      id: 'customer-006',
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      phone: '+1-555-0128'
    },
    amount: 3299.99,
    currency: 'USD',
    status: 'disputed',
    method: 'credit_card',
    type: 'order',
    description: 'Order payment for bedroom furniture set',
    card: {
      last4: '5678',
      brand: 'Visa',
      expMonth: 3,
      expYear: 2026
    },
    transactionId: 'txn_6677889900',
    processorId: 'stripe_pi_disputed_789',
    createdAt: new Date('2024-01-20T13:45:00Z'),
    updatedAt: new Date('2024-01-22T10:15:00Z'),
    processedAt: new Date('2024-01-20T13:47:00Z'),
    fees: {
      processing: 95.70,
      platform: 32.99
    }
  },
  {
    id: 'payment-007',
    customerId: 'customer-007',
    customer: {
      id: 'customer-007',
      name: 'Grace Taylor',
      email: 'grace.taylor@example.com',
      phone: '+1-555-0129'
    },
    amount: 199.99,
    currency: 'USD',
    status: 'completed',
    method: 'google_pay',
    type: 'order',
    description: 'Order payment for desk lamp',
    transactionId: 'txn_1357924680',
    processorId: 'stripe_pi_completed_321',
    createdAt: new Date('2024-01-21T11:30:00Z'),
    updatedAt: new Date('2024-01-21T11:32:00Z'),
    processedAt: new Date('2024-01-21T11:32:00Z'),
    fees: {
      processing: 5.80,
      platform: 1.99
    }
  },
  {
    id: 'payment-008',
    orderId: 'order-008',
    customerId: 'customer-008',
    customer: {
      id: 'customer-008',
      name: 'Henry Davis',
      email: 'henry.davis@example.com',
      phone: '+1-555-0130'
    },
    amount: 1599.99,
    currency: 'USD',
    status: 'cancelled',
    method: 'debit_card',
    type: 'order',
    description: 'Order payment for bookshelf',
    card: {
      last4: '9012',
      brand: 'Visa',
      expMonth: 7,
      expYear: 2025
    },
    transactionId: 'txn_2468135790',
    createdAt: new Date('2024-01-22T15:00:00Z'),
    updatedAt: new Date('2024-01-22T15:05:00Z'),
    fees: {
      processing: 0,
      platform: 0
    }
  }
]

export const getStatusColor = (status: PaymentStatus): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    refunded: 'bg-purple-100 text-purple-800',
    disputed: 'bg-orange-100 text-orange-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getMethodColor = (method: PaymentMethod): string => {
  const colors = {
    credit_card: 'bg-blue-100 text-blue-800',
    debit_card: 'bg-indigo-100 text-indigo-800',
    bank_transfer: 'bg-green-100 text-green-800',
    paypal: 'bg-yellow-100 text-yellow-800',
    stripe: 'bg-purple-100 text-purple-800',
    apple_pay: 'bg-gray-100 text-gray-800',
    google_pay: 'bg-red-100 text-red-800',
    cash: 'bg-green-100 text-green-800'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}

export const getTypeColor = (type: PaymentType): string => {
  const colors = {
    order: 'bg-blue-100 text-blue-800',
    subscription: 'bg-purple-100 text-purple-800',
    refund: 'bg-red-100 text-red-800',
    fee: 'bg-yellow-100 text-yellow-800',
    commission: 'bg-green-100 text-green-800',
    deposit: 'bg-indigo-100 text-indigo-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const formatPaymentDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const getPaymentStatusIcon = (status: PaymentStatus): string => {
  const icons = {
    pending: '⏳',
    processing: '🔄',
    completed: '✅',
    failed: '❌',
    cancelled: '⚫',
    refunded: '↩️',
    disputed: '⚠️'
  }
  return icons[status] || '❓'
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const calculatePaymentStats = (payments: Payment[]): PaymentStats => {
  const total = payments.length
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  
  const statusCounts = payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1
    return acc
  }, {} as Record<PaymentStatus, number>)

  const totalFees = payments.reduce((sum, payment) => 
    sum + payment.fees.processing + payment.fees.platform, 0)

  const completedPayments = payments.filter(p => p.status === 'completed')
  const successRate = total > 0 ? (completedPayments.length / total) * 100 : 0

  return {
    total,
    totalAmount,
    pending: statusCounts.pending || 0,
    processing: statusCounts.processing || 0,
    completed: statusCounts.completed || 0,
    failed: statusCounts.failed || 0,
    cancelled: statusCounts.cancelled || 0,
    refunded: statusCounts.refunded || 0,
    disputed: statusCounts.disputed || 0,
    averageAmount: total > 0 ? totalAmount / total : 0,
    totalFees,
    successRate
  }
}