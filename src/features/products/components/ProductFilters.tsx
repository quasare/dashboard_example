'use client'

import { ProductFilters as IProductFilters, ProductStatus, ProductCategory, StockStatus } from '../types'
import { getCategoryOptions, getStatusOptions, getStockStatusOptions, getSortOptions } from '../utils/mockData'

interface ProductFiltersProps {
  filters: IProductFilters
  onFiltersChange: (filters: IProductFilters) => void
  productCount: number
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkUpdateStatus: (status: ProductStatus) => void
  onBulkUpdateCategory: (category: ProductCategory) => void
  onExportProducts: () => void
}

export function ProductFilters({
  filters,
  onFiltersChange,
  productCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkUpdateStatus,
  onBulkUpdateCategory,
  onExportProducts
}: ProductFiltersProps) {
  const categoryOptions = getCategoryOptions()
  const statusOptions = getStatusOptions()
  const stockStatusOptions = getStockStatusOptions()
  const sortOptions = getSortOptions()

  const handleFilterChange = (key: keyof IProductFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-')
    onFiltersChange({
      ...filters,
      sortBy: sortBy as any,
      sortOrder: sortOrder as 'asc' | 'desc'
    })
  }

  const clearFilters = () => {
    onFiltersChange({
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
  }

  return (
    <div className="space-y-4">
      {/* Search and Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {selectedCount > 0 && (
            <>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkUpdateStatus(e.target.value as ProductStatus)
                    e.target.value = ''
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">Bulk Status Update</option>
                <option value="active">Mark as Active</option>
                <option value="inactive">Mark as Inactive</option>
                <option value="discontinued">Mark as Discontinued</option>
                <option value="draft">Mark as Draft</option>
              </select>
              
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkUpdateCategory(e.target.value as ProductCategory)
                    e.target.value = ''
                  }
                }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                defaultValue=""
              >
                <option value="">Bulk Category Update</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="lighting">Lighting</option>
                <option value="accessories">Accessories</option>
                <option value="storage">Storage</option>
                <option value="seating">Seating</option>
                <option value="tables">Tables</option>
                <option value="office">Office</option>
              </select>
              
              <button
                onClick={onClearSelection}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Clear Selection
              </button>
            </>
          )}
          
          <button
            onClick={selectedCount === productCount ? onClearSelection : onSelectAll}
            className="px-3 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
          >
            {selectedCount === productCount ? 'Deselect All' : 'Select All'}
          </button>
          
          <button
            onClick={onExportProducts}
            className="px-3 py-2 text-sm text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <select
            value={filters.stockStatus}
            onChange={(e) => handleFilterChange('stockStatus', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {stockStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price Range
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Vendor Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vendor
          </label>
          <input
            type="text"
            placeholder="Filter by vendor..."
            value={filters.vendor}
            onChange={(e) => handleFilterChange('vendor', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Tags Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            placeholder="e.g., premium, leather"
            value={filters.tags.join(', ')}
            onChange={(e) => handleFilterChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Featured Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Featured Products
          </label>
          <select
            value={filters.featured === null ? 'all' : filters.featured.toString()}
            onChange={(e) => {
              const value = e.target.value
              handleFilterChange('featured', value === 'all' ? null : value === 'true')
            }}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Products</option>
            <option value="true">Featured Only</option>
            <option value="false">Non-Featured Only</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm text-gray-600">
        <div className="flex flex-wrap gap-4">
          <span>
            Showing <span className="font-medium text-gray-900">{productCount}</span> products
          </span>
          {selectedCount > 0 && (
            <span>
              <span className="font-medium text-blue-600">{selectedCount}</span> selected
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {(filters.search || filters.category !== 'all' || filters.status !== 'all' || 
            filters.stockStatus !== 'all' || filters.priceMin || filters.priceMax || 
            filters.tags.length > 0 || filters.vendor || filters.featured !== null) && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}