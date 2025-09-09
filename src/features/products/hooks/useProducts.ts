'use client'

import { useState, useMemo, useCallback } from 'react'
import { Product, ProductFilters, ProductStats, ProductStatus, ProductCategory, StockStatus } from '../types'
import { mockProducts, calculateProductStats } from '../utils/mockData'

export const useProducts = () => {
  const [products] = useState<Product[]>(mockProducts)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    status: 'all',
    stockStatus: 'all',
    priceMin: '',
    priceMax: '',
    tags: [],
    vendor: '',
    featured: null,
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
          product.vendor?.toLowerCase().includes(searchLower)
        
        if (!matchesSearch) return false
      }

      // Category filter
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false
      }

      // Status filter
      if (filters.status !== 'all' && product.status !== filters.status) {
        return false
      }

      // Stock status filter
      if (filters.stockStatus !== 'all' && product.stockStatus !== filters.stockStatus) {
        return false
      }

      // Price range filter
      if (filters.priceMin) {
        const minPrice = parseFloat(filters.priceMin)
        if (product.price < minPrice) return false
      }

      if (filters.priceMax) {
        const maxPrice = parseFloat(filters.priceMax)
        if (product.price > maxPrice) return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(filterTag => 
          product.tags.some(productTag => 
            productTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
        if (!hasMatchingTag) return false
      }

      // Vendor filter
      if (filters.vendor) {
        if (!product.vendor?.toLowerCase().includes(filters.vendor.toLowerCase())) {
          return false
        }
      }

      // Featured filter
      if (filters.featured !== null && product.isFeatured !== filters.featured) {
        return false
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      if (filters.sortBy === 'created') {
        aValue = a.createdAt
        bValue = b.createdAt
      } else if (filters.sortBy === 'sold') {
        aValue = a.totalSold
        bValue = b.totalSold
      } else {
        aValue = (a as any)[filters.sortBy]
        bValue = (b as any)[filters.sortBy]
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [products, filters])

  const productStats = useMemo(() => {
    return calculateProductStats(filteredProducts)
  }, [filteredProducts])

  const toggleProductSelection = useCallback((productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const selectAllProducts = useCallback(() => {
    setSelectedProducts(filteredProducts.map(product => product.id))
  }, [filteredProducts])

  const clearSelection = useCallback(() => {
    setSelectedProducts([])
  }, [])

  const bulkUpdateStatus = useCallback((status: ProductStatus) => {
    console.log(`Bulk updating ${selectedProducts.length} products to status: ${status}`)
    // In a real app, this would make an API call
    clearSelection()
  }, [selectedProducts, clearSelection])

  const bulkUpdateCategory = useCallback((category: ProductCategory) => {
    console.log(`Bulk updating ${selectedProducts.length} products to category: ${category}`)
    // In a real app, this would make an API call
    clearSelection()
  }, [selectedProducts, clearSelection])

  const exportProducts = useCallback(() => {
    const exportData = filteredProducts.map(product => ({
      'Product ID': product.id,
      'Name': product.name,
      'SKU': product.sku,
      'Category': product.category,
      'Status': product.status,
      'Price': product.price,
      'Cost': product.costPerItem,
      'Profit': product.profit,
      'Profit Margin': `${product.profitMargin}%`,
      'Stock Quantity': product.inventory.quantity,
      'Stock Status': product.stockStatus,
      'Total Sold': product.totalSold,
      'Rating': product.rating,
      'Review Count': product.reviewCount,
      'Vendor': product.vendor || '',
      'Created At': product.createdAt.toISOString(),
      'Featured': product.isFeatured ? 'Yes' : 'No'
    }))

    const csv = [
      Object.keys(exportData[0] || {}).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
  }, [filteredProducts])

  const duplicateProduct = useCallback((productId: string) => {
    console.log(`Duplicating product: ${productId}`)
    // In a real app, this would make an API call to duplicate the product
  }, [])

  const deleteProduct = useCallback((productId: string) => {
    console.log(`Deleting product: ${productId}`)
    // In a real app, this would make an API call to delete the product
  }, [])

  const updateInventory = useCallback((productId: string, quantity: number) => {
    console.log(`Updating inventory for product ${productId} to ${quantity}`)
    // In a real app, this would make an API call to update inventory
  }, [])

  const toggleFeatured = useCallback((productId: string) => {
    console.log(`Toggling featured status for product: ${productId}`)
    // In a real app, this would make an API call to toggle featured status
  }, [])

  return {
    products: filteredProducts,
    productStats,
    filters,
    setFilters,
    selectedProducts,
    actions: {
      toggleProductSelection,
      selectAllProducts,
      clearSelection,
      bulkUpdateStatus,
      bulkUpdateCategory,
      exportProducts,
      duplicateProduct,
      deleteProduct,
      updateInventory,
      toggleFeatured
    }
  }
}