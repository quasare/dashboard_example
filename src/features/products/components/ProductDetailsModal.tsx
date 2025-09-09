'use client'

import { Product } from '../types'
import { getStatusColor, getCategoryColor, getStockStatusColor, formatCurrency, formatDate } from '../utils/mockData'

interface ProductDetailsModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailsModal({ product, isOpen, onClose }: ProductDetailsModalProps) {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images and Basic Info */}
          <div className="space-y-6">
            {/* Product Images */}
            <div className="space-y-4">
              {product.images.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {product.images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-64 object-cover rounded-lg border"
                      />
                      {image.isPrimary && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Primary
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Basic Product Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Basic Information</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Product ID:</dt>
                  <dd className="text-sm text-gray-900">{product.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">SKU:</dt>
                  <dd className="text-sm text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-gray-500">Status:</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-gray-500">Category:</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-sm font-medium text-gray-500">Stock Status:</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(product.stockStatus)}`}>
                      {product.stockStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </dd>
                </div>
                {product.vendor && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Vendor:</dt>
                    <dd className="text-sm text-gray-900">{product.vendor}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Right Column - Pricing, Inventory, and Details */}
          <div className="space-y-6">
            {/* Pricing Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Pricing & Profitability</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Current Price:</dt>
                  <dd className="text-sm font-bold text-gray-900">{formatCurrency(product.price)}</dd>
                </div>
                {product.compareAtPrice && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Compare At Price:</dt>
                    <dd className="text-sm text-gray-900 line-through">{formatCurrency(product.compareAtPrice)}</dd>
                  </div>
                )}\n                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Cost Per Item:</dt>
                  <dd className="text-sm text-gray-900">{formatCurrency(product.costPerItem)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Profit:</dt>
                  <dd className="text-sm font-bold text-green-600">{formatCurrency(product.profit)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Profit Margin:</dt>
                  <dd className="text-sm font-bold text-green-600">{product.profitMargin.toFixed(1)}%</dd>
                </div>
              </dl>
            </div>

            {/* Inventory Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Inventory</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Current Stock:</dt>
                  <dd className="text-sm font-bold text-gray-900">{product.inventory.quantity} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Track Quantity:</dt>
                  <dd className="text-sm text-gray-900">{product.inventory.trackQuantity ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Allow Backorder:</dt>
                  <dd className="text-sm text-gray-900">{product.inventory.allowBackorder ? 'Yes' : 'No'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Low Stock Threshold:</dt>
                  <dd className="text-sm text-gray-900">{product.inventory.lowStockThreshold} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Inventory Value:</dt>
                  <dd className="text-sm font-bold text-blue-600">
                    {formatCurrency(product.inventory.quantity * product.costPerItem)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Performance</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Total Sold:</dt>
                  <dd className="text-sm font-bold text-gray-900">{product.totalSold} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Revenue Generated:</dt>
                  <dd className="text-sm font-bold text-green-600">
                    {formatCurrency(product.totalSold * product.price)}
                  </dd>
                </div>
                {product.rating > 0 && (
                  <>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Rating:</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <span className="mr-1">{product.rating.toFixed(1)}</span>
                        <div className="flex">
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
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Reviews:</dt>
                      <dd className="text-sm text-gray-900">{product.reviewCount} reviews</dd>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Featured:</dt>
                  <dd className="text-sm text-gray-900">{product.isFeatured ? '⭐ Yes' : 'No'}</dd>
                </div>
              </dl>
            </div>

            {/* Physical Properties */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Physical Properties</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Weight:</dt>
                  <dd className="text-sm text-gray-900">{product.weight} lbs</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Dimensions (L×W×H):</dt>
                  <dd className="text-sm text-gray-900">
                    {product.dimensions.length}" × {product.dimensions.width}" × {product.dimensions.height}"
                  </dd>
                </div>
              </dl>
            </div>

            {/* SEO Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">SEO</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">SEO Title:</dt>
                  <dd className="text-sm text-gray-900">{product.seo.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">SEO Description:</dt>
                  <dd className="text-sm text-gray-900">{product.seo.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 mb-1">Keywords:</dt>
                  <dd className="flex flex-wrap gap-1">
                    {product.seo.keywords.map((keyword, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {keyword}
                      </span>
                    ))}\n                  </dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Timeline</h4>
              <dl className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Created:</dt>
                  <dd className="text-sm text-gray-900">{formatDate(product.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Last Updated:</dt>
                  <dd className="text-sm text-gray-900">{formatDate(product.updatedAt)}</dd>
                </div>
                {product.publishedAt && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Published:</dt>
                    <dd className="text-sm text-gray-900">{formatDate(product.publishedAt)}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}