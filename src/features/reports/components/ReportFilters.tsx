'use client'

import { useState } from 'react'
import { ReportFilters as Filters, ReportType, ReportStatus, ReportFormat, ReportPriority } from '../types'
import { getTypeOptions, getStatusOptions, getFormatOptions, getPriorityOptions } from '../utils/mockData'

interface ReportFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  reportCount: number
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkDelete: () => void
  onBulkCancel: () => void
  onBulkRetry: () => void
  onExportReports: () => void
}

export function ReportFilters({
  filters,
  onFiltersChange,
  reportCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete,
  onBulkCancel,
  onBulkRetry,
  onExportReports
}: ReportFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

  const updateFilters = (updates: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      status: 'all',
      format: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: '',
      createdBy: '',
      tags: [],
      isScheduled: null,
      sortBy: 'created',
      sortOrder: 'desc'
    })
  }

  const typeOptions = getTypeOptions()
  const statusOptions = getStatusOptions()
  const formatOptions = getFormatOptions()
  const priorityOptions = getPriorityOptions()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Report Filters ({reportCount} results)
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </button>
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Clear All
          </button>
          <button
            onClick={onExportReports}
            className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Export
          </button>
        </div>
      </div>

      {/* Selection and Bulk Actions */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedCount} report{selectedCount !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="px-3 py-1 text-xs text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded transition-colors"
              >
                Bulk Actions
              </button>
              <button
                onClick={onClearSelection}
                className="px-3 py-1 text-xs text-blue-600 bg-white hover:bg-blue-50 border border-blue-300 rounded transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>

          {showBulkActions && (
            <div className="mt-3 pt-3 border-t border-blue-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onBulkCancel}
                  className="px-3 py-1 text-xs text-white bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
                >
                  Cancel Selected
                </button>
                <button
                  onClick={onBulkRetry}
                  className="px-3 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                >
                  Retry Failed
                </button>
                <button
                  onClick={onBulkDelete}
                  className="px-3 py-1 text-xs text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Report name, description, created by..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value as ReportType | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            {typeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilters({ status: e.target.value as ReportStatus | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <select
            value={filters.format}
            onChange={(e) => updateFilters({ format: e.target.value as ReportFormat | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Formats</option>
            {formatOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority}
            onChange={(e) => updateFilters({ priority: e.target.value as ReportPriority | 'all' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Priorities</option>
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilters({ dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilters({ dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
              <input
                type="text"
                placeholder="Username or email..."
                value={filters.createdBy}
                onChange={(e) => updateFilters({ createdBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled</label>
              <select
                value={filters.isScheduled === null ? '' : filters.isScheduled.toString()}
                onChange={(e) => updateFilters({ isScheduled: e.target.value === '' ? null : e.target.value === 'true' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Reports</option>
                <option value="true">Scheduled Only</option>
                <option value="false">One-time Reports</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as Filters['sortBy'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="created">Date Created</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
                <option value="type">Type</option>
                <option value="priority">Priority</option>
                <option value="lastRun">Last Run</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => updateFilters({ sortOrder: e.target.value as 'asc' | 'desc' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Selection Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={onSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Select All ({reportCount})
          </button>
          {selectedCount > 0 && (
            <button
              onClick={onClearSelection}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {reportCount} report{reportCount !== 1 ? 's' : ''}
          {selectedCount > 0 && ` (${selectedCount} selected)`}
        </div>
      </div>
    </div>
  )
}