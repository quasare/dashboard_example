export type TransactionType = 
  | 'payment'
  | 'refund'
  | 'transfer'
  | 'withdrawal'
  | 'deposit'
  | 'fee'
  | 'adjustment'
  | 'chargeback'

export type TransactionStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'disputed'
  | 'reversed'

export type TransactionMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'wire_transfer'
  | 'ach'
  | 'paypal'
  | 'stripe'
  | 'apple_pay'
  | 'google_pay'
  | 'cash'
  | 'check'
  | 'crypto'

export type TransactionCategory = 
  | 'sales'
  | 'refunds'
  | 'fees'
  | 'subscriptions'
  | 'commissions'
  | 'taxes'
  | 'utilities'
  | 'payroll'
  | 'marketing'
  | 'operations'
  | 'other'

export interface TransactionParty {
  id: string
  name: string
  email?: string
  type: 'customer' | 'vendor' | 'employee' | 'system' | 'bank' | 'other'
}

export interface TransactionItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface TransactionFees {
  processing: number
  platform: number
  gateway: number
  currency: number
  other: number
}

export interface Transaction {
  id: string
  transactionNumber: string
  type: TransactionType
  status: TransactionStatus
  method: TransactionMethod
  category: TransactionCategory
  amount: number
  netAmount: number
  currency: string
  description: string
  reference?: string
  
  // Parties involved
  from: TransactionParty
  to: TransactionParty
  
  // Related entities
  orderId?: string
  paymentId?: string
  invoiceId?: string
  
  // Items (for detailed transactions)
  items?: TransactionItem[]
  
  // Financial details
  fees: TransactionFees
  exchangeRate?: number
  
  // Metadata
  tags: string[]
  notes?: string
  metadata: Record<string, any>
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  processedAt?: Date
  settledAt?: Date
  
  // Audit trail
  createdBy: string
  updatedBy?: string
  
  // Risk and compliance
  riskScore?: number
  flagged: boolean
  flagReason?: string
}

export interface TransactionStats {
  total: number
  totalAmount: number
  pending: number
  processing: number
  completed: number
  failed: number
  cancelled: number
  disputed: number
  reversed: number
  averageAmount: number
  totalFees: number
  netRevenue: number
  successRate: number
  volumeByType: Record<TransactionType, number>
  volumeByMethod: Record<TransactionMethod, number>
  volumeByCategory: Record<TransactionCategory, number>
}

export interface TransactionFilters {
  search: string
  type: TransactionType | 'all'
  status: TransactionStatus | 'all'
  method: TransactionMethod | 'all'
  category: TransactionCategory | 'all'
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
  currency: string
  tags: string[]
  flagged: boolean | null
  sortBy: 'created' | 'amount' | 'status' | 'type' | 'method'
  sortOrder: 'asc' | 'desc'
}