export type ProductStatus = 
  | 'active'
  | 'inactive'
  | 'discontinued'
  | 'draft'
  | 'out_of_stock'

export type ProductCategory = 
  | 'furniture'
  | 'electronics'
  | 'lighting'
  | 'accessories'
  | 'storage'
  | 'seating'
  | 'tables'
  | 'office'

export type StockStatus = 
  | 'in_stock'
  | 'low_stock'
  | 'out_of_stock'
  | 'backorder'

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  compareAtPrice?: number
  inventory: {
    quantity: number
    trackQuantity: boolean
  }
  attributes: {
    color?: string
    size?: string
    material?: string
    [key: string]: string | undefined
  }
}

export interface ProductSEO {
  title: string
  description: string
  keywords: string[]
}

export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  sku: string
  category: ProductCategory
  status: ProductStatus
  price: number
  compareAtPrice?: number
  costPerItem: number
  profit: number
  profitMargin: number
  inventory: {
    quantity: number
    trackQuantity: boolean
    allowBackorder: boolean
    lowStockThreshold: number
  }
  stockStatus: StockStatus
  images: ProductImage[]
  variants?: ProductVariant[]
  tags: string[]
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  seo: ProductSEO
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  vendor?: string
  totalSold: number
  rating: number
  reviewCount: number
  isFeatured: boolean
}

export interface ProductStats {
  total: number
  active: number
  inactive: number
  discontinued: number
  draft: number
  outOfStock: number
  lowStock: number
  averagePrice: number
  totalInventoryValue: number
  mostPopular: Product | null
  recentlyAdded: Product[]
}

export interface ProductFilters {
  search: string
  category: ProductCategory | 'all'
  status: ProductStatus | 'all'
  stockStatus: StockStatus | 'all'
  priceMin: string
  priceMax: string
  tags: string[]
  vendor: string
  featured: boolean | null
  sortBy: 'name' | 'price' | 'created' | 'sold' | 'rating'
  sortOrder: 'asc' | 'desc'
}