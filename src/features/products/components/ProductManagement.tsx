'use client'

import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { ProductFilters } from './ProductFilters'
import { ProductGrid } from './ProductGrid'
import { ProductDetailsModal } from './ProductDetailsModal'
import { Product } from '../types'
import { formatCurrency, formatDate } from '../utils/mockData'

export function ProductManagement() {
  const {
    products,
    productStats,
    filters,
    setFilters,
    selectedProducts,
    actions
  } = useProducts()

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsDetailsModalOpen(true)
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedProduct(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Product Management</h1>
        <p className="mt-1 text-gray-500">
          Manage your product catalog, inventory, and performance analytics
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{productStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Products</dt>
                  <dd className="text-lg font-medium text-gray-900">{productStats.active}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                  <dd className="text-lg font-medium text-gray-900">{productStats.lowStock}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Inventory Value</dt>
                  <dd className="text-lg font-medium text-gray-900">{formatCurrency(productStats.totalInventoryValue)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Status Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Product Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{productStats.active}</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{productStats.inactive}</div>
            <div className="text-sm text-gray-500">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{productStats.draft}</div>
            <div className="text-sm text-gray-500">Draft</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{productStats.discontinued}</div>
            <div className="text-sm text-gray-500">Discontinued</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{productStats.outOfStock}</div>
            <div className="text-sm text-gray-500">Out of Stock</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{productStats.lowStock}</div>
            <div className="text-sm text-gray-500">Low Stock</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Average Price:</span>
              <span className="font-medium text-gray-900">{formatCurrency(productStats.averagePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Inventory Value:</span>
              <span className="font-medium text-gray-900">{formatCurrency(productStats.totalInventoryValue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Popular Product */}
      {productStats.mostPopular && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🏆 Best Seller</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {productStats.mostPopular.images.length > 0 ? (
                <img
                  src={productStats.mostPopular.images[0].url}
                  alt={productStats.mostPopular.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">{productStats.mostPopular.name}</h4>
              <p className="text-sm text-gray-600">{productStats.mostPopular.shortDescription}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm text-gray-500">
                  <strong>{productStats.mostPopular.totalSold}</strong> sold
                </span>
                <span className="text-sm text-gray-500">
                  <strong>{formatCurrency(productStats.mostPopular.price)}</strong> each
                </span>
                <span className="text-sm text-green-600 font-medium">
                  <strong>{formatCurrency(productStats.mostPopular.totalSold * productStats.mostPopular.price)}</strong> revenue
                </span>
              </div>
            </div>
            <button
              onClick={() => handleViewDetails(productStats.mostPopular!)}
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Recently Added Products */}
      {productStats.recentlyAdded.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">📦 Recently Added</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productStats.recentlyAdded.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  {product.images.length > 0 ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => handleViewDetails(product)}
                    className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors truncate block"
                  >
                    {product.name}
                  </button>
                  <p className="text-xs text-gray-500">{formatDate(product.createdAt)}</p>
                  <p className="text-sm text-gray-900 font-medium">{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          productCount={products.length}
          selectedCount={selectedProducts.length}
          onSelectAll={actions.selectAllProducts}
          onClearSelection={actions.clearSelection}
          onBulkUpdateStatus={actions.bulkUpdateStatus}
          onBulkUpdateCategory={actions.bulkUpdateCategory}
          onExportProducts={actions.exportProducts}
        />
      </div>

      {/* Product Grid */}
      <ProductGrid
        products={products}
        selectedProducts={selectedProducts}
        onToggleSelection={actions.toggleProductSelection}
        onViewDetails={handleViewDetails}
        onDuplicateProduct={actions.duplicateProduct}
        onDeleteProduct={actions.deleteProduct}
        onUpdateInventory={actions.updateInventory}
        onToggleFeatured={actions.toggleFeatured}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </div>
  )
}