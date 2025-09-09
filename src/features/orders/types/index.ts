export interface Order {
  id: string
  orderNumber: string
  customer: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  status: OrderStatus
  priority: OrderPriority
  items: OrderItem[]
  total: number
  subtotal: number
  tax: number
  shipping: number
  discount?: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  orderDate: string
  estimatedDelivery?: string
  deliveredDate?: string
  notes?: string
}

export interface OrderItem {
  id: string
  productId: string
  name: string
  sku: string
  image?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  category: string
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash'
  last4?: string
  brand?: string
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export type OrderPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface OrderFilters {
  search: string
  status?: OrderStatus
  priority?: OrderPriority
  dateRange?: {
    start: string
    end: string
  }
  minAmount?: number
  maxAmount?: number
}

export interface OrderActions {
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
  onUpdatePriority: (orderId: string, priority: OrderPriority) => void
  onViewDetails: (order: Order) => void
  onRefundOrder: (orderId: string) => void
  onCancelOrder: (orderId: string) => void
}