import { Transaction, TransactionStats, TransactionType, TransactionStatus, TransactionMethod, TransactionCategory } from '../types'

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    transactionNumber: 'TXN-2024-001',
    type: 'payment',
    status: 'completed',
    method: 'credit_card',
    category: 'sales',
    amount: 1299.99,
    netAmount: 1250.69,
    currency: 'USD',
    description: 'Payment for Executive Leather Office Chair',
    reference: 'ORDER-001',
    from: {
      id: 'customer-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      type: 'customer'
    },
    to: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    orderId: 'order-001',
    paymentId: 'payment-001',
    items: [
      {
        id: 'item-001',
        name: 'Executive Leather Office Chair',
        description: 'Premium executive chair with genuine leather',
        quantity: 1,
        unitPrice: 1299.99,
        totalPrice: 1299.99
      }
    ],
    fees: {
      processing: 37.70,
      platform: 11.60,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['furniture', 'office', 'premium'],
    notes: 'High-value customer transaction',
    metadata: {
      customerType: 'premium',
      salesRep: 'John Smith',
      source: 'website'
    },
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:35:00Z'),
    processedAt: new Date('2024-01-15T10:32:00Z'),
    settledAt: new Date('2024-01-16T09:00:00Z'),
    createdBy: 'system',
    updatedBy: 'system',
    riskScore: 15,
    flagged: false
  },
  {
    id: 'txn-002',
    transactionNumber: 'TXN-2024-002',
    type: 'payment',
    status: 'processing',
    method: 'paypal',
    category: 'sales',
    amount: 599.50,
    netAmount: 576.12,
    currency: 'USD',
    description: 'Payment for Modern Standing Desk',
    reference: 'ORDER-002',
    from: {
      id: 'customer-002',
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      type: 'customer'
    },
    to: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    orderId: 'order-002',
    paymentId: 'payment-002',
    items: [
      {
        id: 'item-002',
        name: 'Modern Standing Desk',
        description: 'Height-adjustable standing desk with electric motor',
        quantity: 1,
        unitPrice: 599.50,
        totalPrice: 599.50
      }
    ],
    fees: {
      processing: 17.39,
      platform: 5.99,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['furniture', 'desk', 'ergonomic'],
    metadata: {
      customerType: 'regular',
      source: 'mobile_app'
    },
    createdAt: new Date('2024-01-16T14:15:00Z'),
    updatedAt: new Date('2024-01-16T14:16:00Z'),
    processedAt: new Date('2024-01-16T14:16:00Z'),
    createdBy: 'system',
    riskScore: 8,
    flagged: false
  },
  {
    id: 'txn-003',
    transactionNumber: 'TXN-2024-003',
    type: 'refund',
    status: 'completed',
    method: 'apple_pay',
    category: 'refunds',
    amount: -899.99,
    netAmount: -864.89,
    currency: 'USD',
    description: 'Refund for Coffee Table - Customer Return',
    reference: 'ORDER-004',
    from: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    to: {
      id: 'customer-004',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      type: 'customer'
    },
    orderId: 'order-004',
    paymentId: 'payment-004',
    fees: {
      processing: 26.10,
      platform: 8.99,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['refund', 'return', 'furniture'],
    notes: 'Customer requested return within policy period',
    metadata: {
      returnReason: 'damaged',
      returnDate: '2024-01-20'
    },
    createdAt: new Date('2024-01-20T11:30:00Z'),
    updatedAt: new Date('2024-01-20T11:35:00Z'),
    processedAt: new Date('2024-01-20T11:32:00Z'),
    settledAt: new Date('2024-01-21T09:00:00Z'),
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
    riskScore: 0,
    flagged: false
  },
  {
    id: 'txn-004',
    transactionNumber: 'TXN-2024-004',
    type: 'payment',
    status: 'failed',
    method: 'credit_card',
    category: 'sales',
    amount: 2499.99,
    netAmount: 0,
    currency: 'USD',
    description: 'Failed payment for Dining Room Set',
    reference: 'ORDER-003',
    from: {
      id: 'customer-003',
      name: 'Carol Davis',
      email: 'carol.davis@example.com',
      type: 'customer'
    },
    to: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    orderId: 'order-003',
    fees: {
      processing: 0,
      platform: 0,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['furniture', 'dining', 'failed'],
    notes: 'Payment failed due to insufficient funds',
    metadata: {
      failureCode: 'insufficient_funds',
      retryAttempts: 3
    },
    createdAt: new Date('2024-01-17T09:45:00Z'),
    updatedAt: new Date('2024-01-17T09:46:00Z'),
    createdBy: 'system',
    riskScore: 45,
    flagged: true,
    flagReason: 'Multiple failed attempts'
  },
  {
    id: 'txn-005',
    transactionNumber: 'TXN-2024-005',
    type: 'fee',
    status: 'completed',
    method: 'bank_transfer',
    category: 'fees',
    amount: -29.99,
    netAmount: -29.99,
    currency: 'USD',
    description: 'Monthly processing fee',
    from: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    to: {
      id: 'processor-001',
      name: 'Payment Processor Inc.',
      type: 'vendor'
    },
    fees: {
      processing: 0,
      platform: 0,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['fee', 'monthly', 'processing'],
    metadata: {
      period: '2024-01',
      feeType: 'monthly_subscription'
    },
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:05:00Z'),
    processedAt: new Date('2024-01-01T00:05:00Z'),
    settledAt: new Date('2024-01-02T09:00:00Z'),
    createdBy: 'system',
    riskScore: 0,
    flagged: false
  },
  {
    id: 'txn-006',
    transactionNumber: 'TXN-2024-006',
    type: 'deposit',
    status: 'completed',
    method: 'wire_transfer',
    category: 'operations',
    amount: 50000.00,
    netAmount: 49975.00,
    currency: 'USD',
    description: 'Capital injection from investors',
    from: {
      id: 'investor-001',
      name: 'Investment Partners LLC',
      type: 'other'
    },
    to: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    fees: {
      processing: 0,
      platform: 0,
      gateway: 0,
      currency: 25.00,
      other: 0
    },
    tags: ['investment', 'capital', 'funding'],
    notes: 'Series A funding round - first tranche',
    metadata: {
      investmentRound: 'Series A',
      tranche: 1,
      totalRound: 500000
    },
    createdAt: new Date('2024-01-05T08:00:00Z'),
    updatedAt: new Date('2024-01-05T16:30:00Z'),
    processedAt: new Date('2024-01-05T16:30:00Z'),
    settledAt: new Date('2024-01-08T09:00:00Z'),
    createdBy: 'admin-002',
    updatedBy: 'admin-002',
    riskScore: 0,
    flagged: false
  },
  {
    id: 'txn-007',
    transactionNumber: 'TXN-2024-007',
    type: 'payment',
    status: 'disputed',
    method: 'credit_card',
    category: 'sales',
    amount: 3299.99,
    netAmount: 0,
    currency: 'USD',
    description: 'Disputed payment for Bedroom Furniture Set',
    reference: 'ORDER-006',
    from: {
      id: 'customer-006',
      name: 'Frank Miller',
      email: 'frank.miller@example.com',
      type: 'customer'
    },
    to: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    orderId: 'order-006',
    paymentId: 'payment-006',
    fees: {
      processing: 95.70,
      platform: 32.99,
      gateway: 15.00,
      currency: 0,
      other: 0
    },
    tags: ['furniture', 'bedroom', 'disputed'],
    notes: 'Customer initiated chargeback - quality dispute',
    metadata: {
      disputeReason: 'product_quality',
      disputeDate: '2024-01-22',
      chargebackCode: '4855'
    },
    createdAt: new Date('2024-01-20T13:45:00Z'),
    updatedAt: new Date('2024-01-22T10:15:00Z'),
    processedAt: new Date('2024-01-20T13:47:00Z'),
    createdBy: 'system',
    updatedBy: 'admin-001',
    riskScore: 85,
    flagged: true,
    flagReason: 'Chargeback initiated'
  },
  {
    id: 'txn-008',
    transactionNumber: 'TXN-2024-008',
    type: 'payment',
    status: 'completed',
    method: 'bank_transfer',
    category: 'subscriptions',
    amount: 49.99,
    netAmount: 49.49,
    currency: 'USD',
    description: 'Monthly premium subscription payment',
    from: {
      id: 'customer-005',
      name: 'Emma Brown',
      email: 'emma.brown@example.com',
      type: 'customer'
    },
    to: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    fees: {
      processing: 0.50,
      platform: 0,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['subscription', 'monthly', 'premium'],
    metadata: {
      subscriptionId: 'sub-005',
      billingPeriod: '2024-01',
      planType: 'premium'
    },
    createdAt: new Date('2024-01-01T08:00:00Z'),
    updatedAt: new Date('2024-01-01T08:05:00Z'),
    processedAt: new Date('2024-01-01T08:05:00Z'),
    settledAt: new Date('2024-01-02T09:00:00Z'),
    createdBy: 'system',
    riskScore: 5,
    flagged: false
  },
  {
    id: 'txn-009',
    transactionNumber: 'TXN-2024-009',
    type: 'withdrawal',
    status: 'pending',
    method: 'ach',
    category: 'payroll',
    amount: -15000.00,
    netAmount: -15000.00,
    currency: 'USD',
    description: 'Payroll withdrawal for January 2024',
    from: {
      id: 'company',
      name: 'Your Company',
      type: 'system'
    },
    to: {
      id: 'payroll-bank',
      name: 'Payroll Bank Account',
      type: 'bank'
    },
    fees: {
      processing: 0,
      platform: 0,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['payroll', 'withdrawal', 'monthly'],
    notes: 'January 2024 payroll processing',
    metadata: {
      payrollPeriod: '2024-01',
      employeeCount: 12,
      payDate: '2024-01-31'
    },
    createdAt: new Date('2024-01-30T10:00:00Z'),
    updatedAt: new Date('2024-01-30T10:00:00Z'),
    createdBy: 'admin-002',
    riskScore: 0,
    flagged: false
  },
  {
    id: 'txn-010',
    transactionNumber: 'TXN-2024-010',
    type: 'transfer',
    status: 'completed',
    method: 'wire_transfer',
    category: 'operations',
    amount: 25000.00,
    netAmount: 24975.00,
    currency: 'USD',
    description: 'Transfer to savings account',
    from: {
      id: 'company-checking',
      name: 'Company Checking Account',
      type: 'bank'
    },
    to: {
      id: 'company-savings',
      name: 'Company Savings Account',
      type: 'bank'
    },
    fees: {
      processing: 25.00,
      platform: 0,
      gateway: 0,
      currency: 0,
      other: 0
    },
    tags: ['transfer', 'savings', 'internal'],
    notes: 'Monthly surplus transfer to savings',
    metadata: {
      transferType: 'surplus_allocation',
      month: '2024-01'
    },
    createdAt: new Date('2024-01-31T15:00:00Z'),
    updatedAt: new Date('2024-01-31T15:30:00Z'),
    processedAt: new Date('2024-01-31T15:30:00Z'),
    settledAt: new Date('2024-02-01T09:00:00Z'),
    createdBy: 'admin-002',
    riskScore: 0,
    flagged: false
  }
]

export const getTypeColor = (type: TransactionType): string => {
  const colors = {
    payment: 'bg-green-100 text-green-800',
    refund: 'bg-red-100 text-red-800',
    transfer: 'bg-blue-100 text-blue-800',
    withdrawal: 'bg-purple-100 text-purple-800',
    deposit: 'bg-indigo-100 text-indigo-800',
    fee: 'bg-yellow-100 text-yellow-800',
    adjustment: 'bg-orange-100 text-orange-800',
    chargeback: 'bg-red-100 text-red-800'
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

export const getStatusColor = (status: TransactionStatus): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
    disputed: 'bg-orange-100 text-orange-800',
    reversed: 'bg-purple-100 text-purple-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getMethodColor = (method: TransactionMethod): string => {
  const colors = {
    credit_card: 'bg-blue-100 text-blue-800',
    debit_card: 'bg-indigo-100 text-indigo-800',
    bank_transfer: 'bg-green-100 text-green-800',
    wire_transfer: 'bg-teal-100 text-teal-800',
    ach: 'bg-cyan-100 text-cyan-800',
    paypal: 'bg-yellow-100 text-yellow-800',
    stripe: 'bg-purple-100 text-purple-800',
    apple_pay: 'bg-gray-100 text-gray-800',
    google_pay: 'bg-red-100 text-red-800',
    cash: 'bg-green-100 text-green-800',
    check: 'bg-blue-100 text-blue-800',
    crypto: 'bg-orange-100 text-orange-800'
  }
  return colors[method] || 'bg-gray-100 text-gray-800'
}

export const getCategoryColor = (category: TransactionCategory): string => {
  const colors = {
    sales: 'bg-green-100 text-green-800',
    refunds: 'bg-red-100 text-red-800',
    fees: 'bg-yellow-100 text-yellow-800',
    subscriptions: 'bg-purple-100 text-purple-800',
    commissions: 'bg-blue-100 text-blue-800',
    taxes: 'bg-orange-100 text-orange-800',
    utilities: 'bg-cyan-100 text-cyan-800',
    payroll: 'bg-indigo-100 text-indigo-800',
    marketing: 'bg-pink-100 text-pink-800',
    operations: 'bg-gray-100 text-gray-800',
    other: 'bg-slate-100 text-slate-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const getTypeOptions = () => [
  { label: 'All Types', value: 'all' },
  { label: 'Payment', value: 'payment' },
  { label: 'Refund', value: 'refund' },
  { label: 'Transfer', value: 'transfer' },
  { label: 'Withdrawal', value: 'withdrawal' },
  { label: 'Deposit', value: 'deposit' },
  { label: 'Fee', value: 'fee' },
  { label: 'Adjustment', value: 'adjustment' },
  { label: 'Chargeback', value: 'chargeback' }
]

export const getStatusOptions = () => [
  { label: 'All Statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Disputed', value: 'disputed' },
  { label: 'Reversed', value: 'reversed' }
]

export const getMethodOptions = () => [
  { label: 'All Methods', value: 'all' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Debit Card', value: 'debit_card' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Wire Transfer', value: 'wire_transfer' },
  { label: 'ACH', value: 'ach' },
  { label: 'PayPal', value: 'paypal' },
  { label: 'Stripe', value: 'stripe' },
  { label: 'Apple Pay', value: 'apple_pay' },
  { label: 'Google Pay', value: 'google_pay' },
  { label: 'Cash', value: 'cash' },
  { label: 'Check', value: 'check' },
  { label: 'Crypto', value: 'crypto' }
]

export const getCategoryOptions = () => [
  { label: 'All Categories', value: 'all' },
  { label: 'Sales', value: 'sales' },
  { label: 'Refunds', value: 'refunds' },
  { label: 'Fees', value: 'fees' },
  { label: 'Subscriptions', value: 'subscriptions' },
  { label: 'Commissions', value: 'commissions' },
  { label: 'Taxes', value: 'taxes' },
  { label: 'Utilities', value: 'utilities' },
  { label: 'Payroll', value: 'payroll' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Operations', value: 'operations' },
  { label: 'Other', value: 'other' }
]

export const calculateTransactionStats = (transactions: Transaction[]): TransactionStats => {
  const total = transactions.length
  const totalAmount = transactions.reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
  
  const statusCounts = transactions.reduce((acc, txn) => {
    acc[txn.status] = (acc[txn.status] || 0) + 1
    return acc
  }, {} as Record<TransactionStatus, number>)

  const volumeByType = transactions.reduce((acc, txn) => {
    acc[txn.type] = (acc[txn.type] || 0) + Math.abs(txn.amount)
    return acc
  }, {} as Record<TransactionType, number>)

  const volumeByMethod = transactions.reduce((acc, txn) => {
    acc[txn.method] = (acc[txn.method] || 0) + Math.abs(txn.amount)
    return acc
  }, {} as Record<TransactionMethod, number>)

  const volumeByCategory = transactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + Math.abs(txn.amount)
    return acc
  }, {} as Record<TransactionCategory, number>)

  const totalFees = transactions.reduce((sum, txn) => 
    sum + txn.fees.processing + txn.fees.platform + txn.fees.gateway + txn.fees.currency + txn.fees.other, 0)

  const revenue = transactions
    .filter(txn => txn.type === 'payment' && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0)
    
  const refunds = transactions
    .filter(txn => txn.type === 'refund' && txn.status === 'completed')
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)

  const netRevenue = revenue - refunds - totalFees

  const completedTransactions = statusCounts.completed || 0
  const successRate = total > 0 ? (completedTransactions / total) * 100 : 0

  return {
    total,
    totalAmount,
    pending: statusCounts.pending || 0,
    processing: statusCounts.processing || 0,
    completed: statusCounts.completed || 0,
    failed: statusCounts.failed || 0,
    cancelled: statusCounts.cancelled || 0,
    disputed: statusCounts.disputed || 0,
    reversed: statusCounts.reversed || 0,
    averageAmount: total > 0 ? totalAmount / total : 0,
    totalFees,
    netRevenue,
    successRate,
    volumeByType,
    volumeByMethod,
    volumeByCategory
  }
}