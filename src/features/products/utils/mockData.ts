import { Product, ProductStats, ProductStatus, ProductCategory, StockStatus } from '../types'

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Executive Leather Office Chair',
    description: 'Premium executive chair with genuine leather upholstery and ergonomic design. Features adjustable height, tilt mechanism, and 360-degree swivel. Perfect for executive offices and conference rooms.',
    shortDescription: 'Premium executive chair with genuine leather and ergonomic design',
    sku: 'CHAIR-EXEC-001',
    category: 'seating',
    status: 'active',
    price: 899.99,
    compareAtPrice: 1299.99,
    costPerItem: 450.00,
    profit: 449.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 25,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10
    },
    stockStatus: 'in_stock',
    images: [
      {
        id: 'img-001',
        url: '/images/products/chair-executive-001.jpg',
        alt: 'Executive Leather Office Chair - Main View',
        isPrimary: true
      },
      {
        id: 'img-002',
        url: '/images/products/chair-executive-001-side.jpg',
        alt: 'Executive Leather Office Chair - Side View',
        isPrimary: false
      }
    ],
    tags: ['executive', 'leather', 'ergonomic', 'office', 'premium'],
    weight: 65.5,
    dimensions: {
      length: 28.0,
      width: 30.0,
      height: 48.0
    },
    seo: {
      title: 'Executive Leather Office Chair - Premium Ergonomic Seating',
      description: 'Shop our premium executive leather office chair with ergonomic design, adjustable features, and genuine leather upholstery.',
      keywords: ['executive chair', 'leather office chair', 'ergonomic seating', 'office furniture']
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-16'),
    vendor: 'Premium Office Solutions',
    totalSold: 156,
    rating: 4.8,
    reviewCount: 47,
    isFeatured: true
  },
  {
    id: 'prod-002',
    name: 'Modern Standing Desk',
    description: 'Height-adjustable standing desk with electric motor for smooth transition between sitting and standing positions. Features spacious work surface, cable management, and memory settings.',
    shortDescription: 'Electric height-adjustable standing desk with memory settings',
    sku: 'DESK-STAND-002',
    category: 'tables',
    status: 'active',
    price: 1299.99,
    compareAtPrice: 1599.99,
    costPerItem: 650.00,
    profit: 649.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 8,
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 10
    },
    stockStatus: 'low_stock',
    images: [
      {
        id: 'img-003',
        url: '/images/products/desk-standing-002.jpg',
        alt: 'Modern Standing Desk - Sitting Position',
        isPrimary: true
      }
    ],
    tags: ['standing desk', 'adjustable', 'electric', 'ergonomic', 'modern'],
    weight: 120.0,
    dimensions: {
      length: 60.0,
      width: 30.0,
      height: 48.0
    },
    seo: {
      title: 'Modern Electric Standing Desk - Height Adjustable Workstation',
      description: 'Transform your workspace with our electric standing desk featuring smooth height adjustment and memory settings.',
      keywords: ['standing desk', 'adjustable desk', 'electric desk', 'ergonomic workspace']
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    publishedAt: new Date('2024-01-12'),
    vendor: 'ErgoTech Solutions',
    totalSold: 89,
    rating: 4.6,
    reviewCount: 23,
    isFeatured: true
  },
  {
    id: 'prod-003',
    name: 'Industrial Storage Cabinet',
    description: 'Heavy-duty steel storage cabinet with multiple compartments and adjustable shelves. Perfect for organizing office supplies, tools, and equipment. Features secure locking mechanism.',
    shortDescription: 'Heavy-duty steel storage cabinet with adjustable shelves',
    sku: 'CAB-STOR-003',
    category: 'storage',
    status: 'active',
    price: 599.99,
    costPerItem: 300.00,
    profit: 299.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 0,
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 5
    },
    stockStatus: 'out_of_stock',
    images: [
      {
        id: 'img-004',
        url: '/images/products/cabinet-storage-003.jpg',
        alt: 'Industrial Storage Cabinet',
        isPrimary: true
      }
    ],
    tags: ['storage', 'cabinet', 'industrial', 'steel', 'lockable'],
    weight: 85.0,
    dimensions: {
      length: 36.0,
      width: 18.0,
      height: 72.0
    },
    seo: {
      title: 'Industrial Steel Storage Cabinet - Heavy Duty Organization',
      description: 'Organize your workspace with our heavy-duty steel storage cabinet featuring adjustable shelves and secure locking.',
      keywords: ['storage cabinet', 'steel cabinet', 'industrial storage', 'office organization']
    },
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-18'),
    publishedAt: new Date('2024-01-10'),
    vendor: 'Industrial Furniture Co.',
    totalSold: 203,
    rating: 4.4,
    reviewCount: 67,
    isFeatured: false
  },
  {
    id: 'prod-004',
    name: 'LED Desk Lamp with Wireless Charging',
    description: 'Modern LED desk lamp with built-in wireless charging pad, touch controls, and adjustable brightness. Features multiple lighting modes and USB charging port.',
    shortDescription: 'Modern LED desk lamp with wireless charging and touch controls',
    sku: 'LAMP-LED-004',
    category: 'lighting',
    status: 'active',
    price: 149.99,
    compareAtPrice: 199.99,
    costPerItem: 75.00,
    profit: 74.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 45,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 20
    },
    stockStatus: 'in_stock',
    images: [
      {
        id: 'img-005',
        url: '/images/products/lamp-led-004.jpg',
        alt: 'LED Desk Lamp with Wireless Charging',
        isPrimary: true
      }
    ],
    tags: ['led', 'desk lamp', 'wireless charging', 'touch control', 'modern'],
    weight: 3.2,
    dimensions: {
      length: 8.0,
      width: 8.0,
      height: 20.0
    },
    seo: {
      title: 'LED Desk Lamp with Wireless Charging - Modern Office Lighting',
      description: 'Illuminate your workspace with our LED desk lamp featuring wireless charging, touch controls, and adjustable brightness.',
      keywords: ['led desk lamp', 'wireless charging lamp', 'office lighting', 'modern lamp']
    },
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-21'),
    publishedAt: new Date('2024-01-14'),
    vendor: 'Tech Lighting Solutions',
    totalSold: 324,
    rating: 4.7,
    reviewCount: 98,
    isFeatured: true
  },
  {
    id: 'prod-005',
    name: 'Conference Room Table',
    description: 'Large conference table designed for meeting rooms and boardrooms. Features premium wood finish, cable management system, and seats up to 12 people comfortably.',
    shortDescription: 'Large conference table with premium wood finish for 12 people',
    sku: 'TABLE-CONF-005',
    category: 'tables',
    status: 'active',
    price: 2499.99,
    compareAtPrice: 3299.99,
    costPerItem: 1250.00,
    profit: 1249.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 3,
      trackQuantity: true,
      allowBackorder: true,
      lowStockThreshold: 5
    },
    stockStatus: 'low_stock',
    images: [
      {
        id: 'img-006',
        url: '/images/products/table-conference-005.jpg',
        alt: 'Conference Room Table',
        isPrimary: true
      }
    ],
    tags: ['conference table', 'meeting room', 'boardroom', 'wood', 'large'],
    weight: 180.0,
    dimensions: {
      length: 144.0,
      width: 48.0,
      height: 30.0
    },
    seo: {
      title: 'Conference Room Table - Premium Boardroom Furniture',
      description: 'Create impressive meeting spaces with our premium conference table featuring wood finish and cable management.',
      keywords: ['conference table', 'meeting table', 'boardroom table', 'office furniture']
    },
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19'),
    publishedAt: new Date('2024-01-07'),
    vendor: 'Executive Furniture Ltd.',
    totalSold: 45,
    rating: 4.9,
    reviewCount: 12,
    isFeatured: true
  },
  {
    id: 'prod-006',
    name: 'Ergonomic Keyboard and Mouse Set',
    description: 'Wireless ergonomic keyboard and mouse combo designed to reduce strain and improve comfort during long work sessions. Features split keyboard design and vertical mouse.',
    shortDescription: 'Wireless ergonomic keyboard and mouse set for comfort',
    sku: 'ACC-ERGO-006',
    category: 'accessories',
    status: 'active',
    price: 199.99,
    costPerItem: 100.00,
    profit: 99.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 67,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 30
    },
    stockStatus: 'in_stock',
    images: [
      {
        id: 'img-007',
        url: '/images/products/keyboard-mouse-006.jpg',
        alt: 'Ergonomic Keyboard and Mouse Set',
        isPrimary: true
      }
    ],
    tags: ['ergonomic', 'keyboard', 'mouse', 'wireless', 'accessories'],
    weight: 2.8,
    dimensions: {
      length: 18.0,
      width: 12.0,
      height: 2.0
    },
    seo: {
      title: 'Ergonomic Keyboard Mouse Set - Wireless Comfort Accessories',
      description: 'Improve your typing comfort with our wireless ergonomic keyboard and mouse set designed to reduce strain.',
      keywords: ['ergonomic keyboard', 'wireless mouse', 'office accessories', 'computer peripherals']
    },
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-23'),
    publishedAt: new Date('2024-01-20'),
    vendor: 'ErgoTech Solutions',
    totalSold: 412,
    rating: 4.5,
    reviewCount: 156,
    isFeatured: false
  },
  {
    id: 'prod-007',
    name: 'Smart Whiteboard',
    description: 'Interactive smart whiteboard with touch capability, wireless connectivity, and collaboration features. Perfect for modern offices, conference rooms, and educational spaces.',
    shortDescription: 'Interactive smart whiteboard with touch and wireless connectivity',
    sku: 'BOARD-SMART-007',
    category: 'electronics',
    status: 'draft',
    price: 3999.99,
    compareAtPrice: 4999.99,
    costPerItem: 2000.00,
    profit: 1999.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 5,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 3
    },
    stockStatus: 'in_stock',
    images: [
      {
        id: 'img-008',
        url: '/images/products/whiteboard-smart-007.jpg',
        alt: 'Smart Interactive Whiteboard',
        isPrimary: true
      }
    ],
    tags: ['smart', 'whiteboard', 'interactive', 'touch', 'wireless'],
    weight: 45.0,
    dimensions: {
      length: 75.0,
      width: 4.0,
      height: 55.0
    },
    seo: {
      title: 'Smart Interactive Whiteboard - Touch & Wireless Collaboration',
      description: 'Transform your meetings with our smart interactive whiteboard featuring touch controls and wireless connectivity.',
      keywords: ['smart whiteboard', 'interactive board', 'collaboration tools', 'office technology']
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-24'),
    vendor: 'TechBoard Innovations',
    totalSold: 0,
    rating: 0,
    reviewCount: 0,
    isFeatured: false
  },
  {
    id: 'prod-008',
    name: 'Vintage Filing Cabinet',
    description: 'Classic 4-drawer filing cabinet with vintage design and modern functionality. Features full-extension drawers, anti-tip mechanism, and premium wood veneer finish.',
    shortDescription: 'Classic 4-drawer filing cabinet with vintage design',
    sku: 'CAB-FILE-008',
    category: 'storage',
    status: 'discontinued',
    price: 799.99,
    compareAtPrice: 999.99,
    costPerItem: 400.00,
    profit: 399.99,
    profitMargin: 50.0,
    inventory: {
      quantity: 2,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5
    },
    stockStatus: 'low_stock',
    images: [
      {
        id: 'img-009',
        url: '/images/products/cabinet-filing-008.jpg',
        alt: 'Vintage Filing Cabinet',
        isPrimary: true
      }
    ],
    tags: ['filing cabinet', 'vintage', 'classic', 'wood', 'storage'],
    weight: 95.0,
    dimensions: {
      length: 15.5,
      width: 20.0,
      height: 52.0
    },
    seo: {
      title: 'Vintage Filing Cabinet - Classic 4-Drawer Office Storage',
      description: 'Store your documents in style with our vintage filing cabinet featuring classic design and modern functionality.',
      keywords: ['filing cabinet', 'vintage furniture', 'office storage', 'document storage']
    },
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2023-12-05'),
    vendor: 'Classic Office Furniture',
    totalSold: 78,
    rating: 4.3,
    reviewCount: 34,
    isFeatured: false
  }
]

export const getStatusColor = (status: ProductStatus): string => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    discontinued: 'bg-red-100 text-red-800',
    draft: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-orange-100 text-orange-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getCategoryColor = (category: ProductCategory): string => {
  const colors = {
    furniture: 'bg-blue-100 text-blue-800',
    electronics: 'bg-purple-100 text-purple-800',
    lighting: 'bg-yellow-100 text-yellow-800',
    accessories: 'bg-indigo-100 text-indigo-800',
    storage: 'bg-green-100 text-green-800',
    seating: 'bg-pink-100 text-pink-800',
    tables: 'bg-orange-100 text-orange-800',
    office: 'bg-gray-100 text-gray-800'
  }
  return colors[category] || 'bg-gray-100 text-gray-800'
}

export const getStockStatusColor = (stockStatus: StockStatus): string => {
  const colors = {
    in_stock: 'bg-green-100 text-green-800',
    low_stock: 'bg-yellow-100 text-yellow-800',
    out_of_stock: 'bg-red-100 text-red-800',
    backorder: 'bg-blue-100 text-blue-800'
  }
  return colors[stockStatus] || 'bg-gray-100 text-gray-800'
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

export const calculateProductStats = (products: Product[]): ProductStats => {
  const total = products.length
  const statusCounts = products.reduce((acc, product) => {
    acc[product.status] = (acc[product.status] || 0) + 1
    return acc
  }, {} as Record<ProductStatus, number>)

  const stockCounts = products.reduce((acc, product) => {
    acc[product.stockStatus] = (acc[product.stockStatus] || 0) + 1
    return acc
  }, {} as Record<StockStatus, number>)

  const averagePrice = products.length > 0 
    ? products.reduce((sum, product) => sum + product.price, 0) / products.length 
    : 0

  const totalInventoryValue = products.reduce((sum, product) => 
    sum + (product.inventory.quantity * product.costPerItem), 0)

  const mostPopular = products.reduce((prev, current) => 
    (current.totalSold > (prev?.totalSold || 0)) ? current : prev, null as Product | null)

  const recentlyAdded = products
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)

  return {
    total,
    active: statusCounts.active || 0,
    inactive: statusCounts.inactive || 0,
    discontinued: statusCounts.discontinued || 0,
    draft: statusCounts.draft || 0,
    outOfStock: stockCounts.out_of_stock || 0,
    lowStock: stockCounts.low_stock || 0,
    averagePrice,
    totalInventoryValue,
    mostPopular,
    recentlyAdded
  }
}

export const getCategoryOptions = () => [
  { label: 'All Categories', value: 'all' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Lighting', value: 'lighting' },
  { label: 'Accessories', value: 'accessories' },
  { label: 'Storage', value: 'storage' },
  { label: 'Seating', value: 'seating' },
  { label: 'Tables', value: 'tables' },
  { label: 'Office', value: 'office' }
]

export const getStatusOptions = () => [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Discontinued', value: 'discontinued' },
  { label: 'Draft', value: 'draft' }
]

export const getStockStatusOptions = () => [
  { label: 'All Stock Status', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
  { label: 'Backorder', value: 'backorder' }
]

export const getSortOptions = () => [
  { label: 'Name A-Z', value: 'name-asc' },
  { label: 'Name Z-A', value: 'name-desc' },
  { label: 'Price Low-High', value: 'price-asc' },
  { label: 'Price High-Low', value: 'price-desc' },
  { label: 'Newest First', value: 'created-desc' },
  { label: 'Oldest First', value: 'created-asc' },
  { label: 'Most Sold', value: 'sold-desc' },
  { label: 'Highest Rated', value: 'rating-desc' }
]