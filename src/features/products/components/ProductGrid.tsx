'use client'

import { useState } from 'react'
import { Product } from '../types'
import { getStatusColor, getCategoryColor, getStockStatusColor, formatCurrency, formatDate } from '../utils/mockData'

interface ProductGridProps {
  products: Product[]
  selectedProducts: string[]
  onToggleSelection: (productId: string) => void
  onViewDetails: (product: Product) => void
  onDuplicateProduct: (productId: string) => void
  onDeleteProduct: (productId: string) => void
  onUpdateInventory: (productId: string, quantity: number) => void
  onToggleFeatured: (productId: string) => void
}

export function ProductGrid({
  products,
  selectedProducts,
  onToggleSelection,
  onViewDetails,
  onDuplicateProduct,
  onDeleteProduct,
  onUpdateInventory,
  onToggleFeatured
}: ProductGridProps) {
  const [inventoryUpdates, setInventoryUpdates] = useState<Record<string, string>>({})

  const handleInventorySubmit = (productId: string, currentQuantity: number) => {
    const newQuantity = inventoryUpdates[productId]
    if (newQuantity && !isNaN(parseInt(newQuantity))) {
      onUpdateInventory(productId, parseInt(newQuantity))
      setInventoryUpdates(prev => ({ ...prev, [productId]: '' }))
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-500 text-lg mb-2">No products found</div>
        <div className="text-gray-400">Try adjusting your search or filter criteria</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
              {product.images.length > 0 ? (
                <img
                  src={product.images.find(img => img.isPrimary)?.url || product.images[0].url}
                  alt={product.images.find(img => img.isPrimary)?.alt || product.name}
                  className="h-48 w-full object-cover object-center"
                />
              ) : (
                <div className="h-48 w-full bg-gray-300 flex items-center justify-center">
                  <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Selection Checkbox */}
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={() => onToggleSelection(product.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  ⭐ Featured
                </span>
              </div>
            )}
            
            {/* Stock Status Badge */}
            <div className="absolute bottom-2 right-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
                {product.stockStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                <button
                  onClick={() => onViewDetails(product)}
                  className="text-left hover:text-blue-600 transition-colors"
                >
                  {product.name}
                </button>
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.shortDescription}
            </p>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </div>
                {product.compareAtPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Stock: {product.inventory.quantity}</div>
                <div className="text-xs text-gray-500">SKU: {product.sku}</div>
              </div>
            </div>
            
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">({product.reviewCount})</span>
              </div>
            )}
            
            {/* Quick Inventory Update */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={product.inventory.quantity.toString()}
                  value={inventoryUpdates[product.id] || ''}
                  onChange={(e) => setInventoryUpdates(prev => ({ ...prev, [product.id]: e.target.value }))}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleInventorySubmit(product.id, product.inventory.quantity)}
                  disabled={!inventoryUpdates[product.id]}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onViewDetails(product)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="View Details"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onDuplicateProduct(product.id)}
                  className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                  title="Duplicate"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <button
                  onClick={() => onToggleFeatured(product.id)}
                  className={`p-2 transition-colors ${
                    product.isFeatured 
                      ? 'text-yellow-600 hover:text-yellow-700' 
                      : 'text-gray-400 hover:text-yellow-600'
                  }`}
                  title={product.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              </div>
              
              <button
                onClick={() => onDeleteProduct(product.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete Product"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            {/* Product Meta */}
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Added: {formatDate(product.createdAt)}</span>
                <span>Sold: {product.totalSold}</span>
              </div>
              {product.vendor && (
                <div className="mt-1 truncate">Vendor: {product.vendor}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}