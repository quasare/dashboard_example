export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'disputed'

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'paypal'
  | 'stripe'
  | 'apple_pay'
  | 'google_pay'
  | 'cash'

export type PaymentType = 
  | 'order'
  | 'subscription'
  | 'refund'
  | 'fee'
  | 'commission'
  | 'deposit'

export interface PaymentAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentCustomer {
  id: string
  name: string
  email: string
  phone?: string
  address?: PaymentAddress
}

export interface PaymentCard {
  last4: string
  brand: string
  expMonth: number
  expYear: number
}

export interface Payment {
  id: string
  orderId?: string
  customerId: string
  customer: PaymentCustomer
  amount: number
  currency: string
  status: PaymentStatus
  method: PaymentMethod
  type: PaymentType
  description: string
  card?: PaymentCard
  transactionId?: string
  processorId?: string
  failureReason?: string
  refundReason?: string
  createdAt: Date
  updatedAt: Date
  processedAt?: Date
  refundedAt?: Date
  fees: {
    processing: number
    platform: number
  }
  metadata?: Record<string, any>
}

export interface PaymentStats {
  total: number
  totalAmount: number
  pending: number
  processing: number
  completed: number
  failed: number
  cancelled: number
  refunded: number
  disputed: number
  averageAmount: number
  totalFees: number
  successRate: number
}

export interface PaymentFilters {
  search: string
  status: PaymentStatus | 'all'
  method: PaymentMethod | 'all'
  type: PaymentType | 'all'
  dateFrom: string
  dateTo: string
  minAmount: string
  maxAmount: string
}