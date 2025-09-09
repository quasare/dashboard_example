'use client'

import { RevenueFilters as IRevenueFilters, RevenueSource } from '../types'
import { getDateRangePresets, getGroupByOptions, getRevenueSourceOptions } from '../utils/mockData'

interface RevenueFiltersProps {
  filters: IRevenueFilters
  onUpdateFilters: (filters: Partial<IRevenueFilters>) => void
  onUpdateDateRange: (preset: string, from?: string, to?: string) => void
  onToggleSource: (source: RevenueSource) => void
  onExportData: (format: 'csv' | 'json') => void
  onRefreshData: () => void
}

export function RevenueFilters({
  filters,
  onUpdateFilters,
  onUpdateDateRange,
  onToggleSource,
  onExportData,
  onRefreshData
}: RevenueFiltersProps) {
  const datePresets = getDateRangePresets()
  const groupByOptions = getGroupByOptions()
  const sourceOptions = getRevenueSourceOptions()

  const handlePresetChange = (preset: string) => {
    onUpdateDateRange(preset)
  }

  const handleCustomDateChange = (type: 'from' | 'to', value: string) => {
    if (filters.dateRange.preset === 'custom') {
      const from = type === 'from' ? value : filters.dateRange.from
      const to = type === 'to' ? value : filters.dateRange.to
      onUpdateDateRange('custom', from, to)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Revenue Analytics</h3>
          <p className="text-sm text-gray-500">Configure your revenue analysis parameters</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onRefreshData}
            className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          
          <select
            onChange={(e) => onExportData(e.target.value as 'csv' | 'json')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="">Export Data</option>
            <option value="csv">Export as CSV</option>
            <option value="json">Export as JSON</option>
          </select>
        </div>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date Range Preset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time Period
          </label>
          <select
            value={filters.dateRange.preset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {datePresets.map(preset => (
              <option key={preset.value} value={preset.value}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* Group By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group By
          </label>
          <select
            value={filters.groupBy}
            onChange={(e) => onUpdateFilters({ groupBy: e.target.value as any })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {groupByOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={filters.currency}
            onChange={(e) => onUpdateFilters({ currency: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
          </select>
        </div>

        {/* Include Refunds Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Options
          </label>
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              id="includeRefunds"
              checked={filters.includeRefunds}
              onChange={(e) => onUpdateFilters({ includeRefunds: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includeRefunds" className="text-sm text-gray-700">
              Include Refunds
            </label>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {filters.dateRange.preset === 'custom' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => handleCustomDateChange('from', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => handleCustomDateChange('to', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Revenue Sources */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Revenue Sources
        </label>
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map(source => (
            <button
              key={source.value}
              onClick={() => onToggleSource(source.value as RevenueSource)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                filters.sources.includes(source.value as RevenueSource)
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {source.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applied Filters Summary */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
        <span className="font-medium">Active filters:</span>{' '}
        {filters.dateRange.preset !== 'custom' 
          ? datePresets.find(p => p.value === filters.dateRange.preset)?.label 
          : `${filters.dateRange.from} to ${filters.dateRange.to}`
        } • {groupByOptions.find(g => g.value === filters.groupBy)?.label} • {filters.sources.length} sources • {filters.currency}
        {!filters.includeRefunds && ' • Excluding refunds'}
      </div>
    </div>
  )
}