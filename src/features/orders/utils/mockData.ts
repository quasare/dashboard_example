import { Order, OrderStatus, OrderPriority } from '../types'

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    customer: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    status: 'processing',
    priority: 'high',
    items: [
      {
        id: '1',
        productId: 'prod-001',
        name: 'Wireless Headphones',
        sku: 'WH-001',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop',
        quantity: 2,
        unitPrice: 199.99,
        totalPrice: 399.98,
        category: 'Electronics'
      },
      {
        id: '2',
        productId: 'prod-002',
        name: 'Phone Case',
        sku: 'PC-001',
        quantity: 1,
        unitPrice: 29.99,
        totalPrice: 29.99,
        category: 'Accessories'
      }
    ],
    subtotal: 429.97,
    tax: 34.40,
    shipping: 9.99,
    total: 474.36,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa'
    },
    orderDate: '2025-09-03T10:30:00Z',
    estimatedDelivery: '2025-09-08T17:00:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    customer: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=40&h=40&fit=crop&crop=face'
    },
    status: 'shipped',
    priority: 'medium',
    items: [
      {
        id: '3',
        productId: 'prod-003',
        name: 'Smart Watch',
        sku: 'SW-001',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop',
        quantity: 1,
        unitPrice: 299.99,
        totalPrice: 299.99,
        category: 'Wearables'
      }
    ],
    subtotal: 299.99,
    tax: 24.00,
    shipping: 0.00,
    total: 323.99,
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    billingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentMethod: {
      type: 'paypal'
    },
    orderDate: '2025-09-02T14:15:00Z',
    estimatedDelivery: '2025-09-07T12:00:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-003',
    customer: {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@email.com'
    },
    status: 'delivered',
    priority: 'low',
    items: [
      {
        id: '4',
        productId: 'prod-004',
        name: 'Laptop Stand',
        sku: 'LS-001',
        quantity: 1,
        unitPrice: 79.99,
        totalPrice: 79.99,
        category: 'Accessories'
      },
      {
        id: '5',
        productId: 'prod-005',
        name: 'Wireless Mouse',
        sku: 'WM-001',
        quantity: 1,
        unitPrice: 49.99,
        totalPrice: 49.99,
        category: 'Electronics'
      }
    ],
    subtotal: 129.98,
    tax: 10.40,
    shipping: 7.99,
    total: 148.37,
    shippingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    billingAddress: {
      street: '789 Pine St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '1234',
      brand: 'MasterCard'
    },
    orderDate: '2025-08-30T09:00:00Z',
    estimatedDelivery: '2025-09-03T15:00:00Z',
    deliveredDate: '2025-09-02T14:30:00Z'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-004',
    customer: {
      id: '4',
      name: 'Lisa Brown',
      email: 'lisa.brown@email.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    status: 'pending',
    priority: 'urgent',
    items: [
      {
        id: '6',
        productId: 'prod-006',
        name: 'Gaming Keyboard',
        sku: 'GK-001',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=60&h=60&fit=crop',
        quantity: 1,
        unitPrice: 149.99,
        totalPrice: 149.99,
        category: 'Gaming'
      }
    ],
    subtotal: 149.99,
    tax: 12.00,
    shipping: 9.99,
    discount: 15.00,
    total: 156.98,
    shippingAddress: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    billingAddress: {
      street: '321 Elm St',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    paymentMethod: {
      type: 'debit_card',
      last4: '5678',
      brand: 'Visa'
    },
    orderDate: '2025-09-04T08:20:00Z',
    estimatedDelivery: '2025-09-09T16:00:00Z',
    notes: 'Rush delivery requested'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-005',
    customer: {
      id: '5',
      name: 'David Wilson',
      email: 'david.wilson@email.com'
    },
    status: 'cancelled',
    priority: 'low',
    items: [
      {
        id: '7',
        productId: 'prod-007',
        name: 'USB Cable',
        sku: 'UC-001',
        quantity: 3,
        unitPrice: 14.99,
        totalPrice: 44.97,
        category: 'Cables'
      }
    ],
    subtotal: 44.97,
    tax: 3.60,
    shipping: 4.99,
    total: 53.56,
    shippingAddress: {
      street: '654 Maple Dr',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    billingAddress: {
      street: '654 Maple Dr',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '9999',
      brand: 'American Express'
    },
    orderDate: '2025-08-28T16:45:00Z',
    notes: 'Cancelled by customer'
  }
]

export const getStatusColor = (status: OrderStatus): string => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return colors[status]
}

export const getPriorityColor = (priority: OrderPriority): string => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return colors[priority]
}

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getOrderStatusIcon = (status: OrderStatus): string => {
  const icons = {
    pending: '⏳',
    confirmed: '✅',
    processing: '⚙️',
    shipped: '🚚',
    delivered: '📦',
    cancelled: '❌',
    refunded: '💰'
  }
  return icons[status]
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}