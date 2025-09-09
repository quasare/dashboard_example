'use client'

import { useRevenue } from '../hooks/useRevenue'
import { RevenueFilters } from './RevenueFilters'
import { RevenueChart } from './RevenueChart'
import { formatCurrency, formatPercent, getSourceColor, getTrendIcon } from '../utils/mockData'

export function RevenueManagement() {
  const {
    data,
    filters,
    actions
  } = useRevenue()

  const stats = data.stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Revenue Analytics</h1>
        <p className="mt-1 text-gray-500">
          Track revenue charts, forecasting, and detailed analytics
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-center">
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.total.current)}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm ${
                      stats.total.trend === 'up' ? 'text-green-600' : 
                      stats.total.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getTrendIcon(stats.total.trend)}
                      <span className="ml-1">
                        {stats.total.changePercent > 0 ? '+' : ''}{stats.total.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </dd>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Recurring Revenue</dt>
                  <dd className="flex items-center">
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.recurring.current)}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm ${
                      stats.recurring.trend === 'up' ? 'text-green-600' : 
                      stats.recurring.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getTrendIcon(stats.recurring.trend)}
                      <span className="ml-1">
                        {stats.recurring.changePercent > 0 ? '+' : ''}{stats.recurring.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </dd>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                  <dd className="flex items-center">
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(stats.avgOrderValue.current)}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm ${
                      stats.avgOrderValue.trend === 'up' ? 'text-green-600' : 
                      stats.avgOrderValue.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getTrendIcon(stats.avgOrderValue.trend)}
                      <span className="ml-1">
                        {stats.avgOrderValue.changePercent > 0 ? '+' : ''}{stats.avgOrderValue.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Growth Rate</dt>
                  <dd className="flex items-center">
                    <div className="text-lg font-medium text-gray-900">
                      {formatPercent(stats.growthRate.current)}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm ${
                      stats.growthRate.trend === 'up' ? 'text-green-600' : 
                      stats.growthRate.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {getTrendIcon(stats.growthRate.trend)}
                      <span className="ml-1">
                        {stats.growthRate.changePercent > 0 ? '+' : ''}{stats.growthRate.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.avgRevenuePerUser.current)}
            </div>
            <div className="text-sm text-gray-500">Avg Revenue per User</div>
            <div className={`text-xs mt-1 ${
              stats.avgRevenuePerUser.changePercent > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.avgRevenuePerUser.changePercent > 0 ? '+' : ''}
              {stats.avgRevenuePerUser.changePercent.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatPercent(stats.conversionRate.current)}
            </div>
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className={`text-xs mt-1 ${
              stats.conversionRate.changePercent > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.conversionRate.changePercent > 0 ? '+' : ''}
              {stats.conversionRate.changePercent.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatPercent(stats.churnRate.current)}
            </div>
            <div className="text-sm text-gray-500">Churn Rate</div>
            <div className={`text-xs mt-1 ${
              stats.churnRate.changePercent < 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.churnRate.changePercent > 0 ? '+' : ''}
              {stats.churnRate.changePercent.toFixed(1)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.oneTime.current)}
            </div>
            <div className="text-sm text-gray-500">One-time Revenue</div>
            <div className={`text-xs mt-1 ${
              stats.oneTime.changePercent > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.oneTime.changePercent > 0 ? '+' : ''}
              {stats.oneTime.changePercent.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <RevenueFilters
          filters={filters}
          onUpdateFilters={actions.updateFilters}
          onUpdateDateRange={actions.updateDateRange}
          onToggleSource={actions.toggleSource}
          onExportData={actions.exportData}
          onRefreshData={actions.refreshData}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Revenue Chart with Forecast */}
        <div className="lg:col-span-2">
          <RevenueChart
            data={data.timeSeries}
            forecast={data.forecast}
            title="Revenue Trend & Forecast"
            showForecast={true}
            height={400}
          />
        </div>
      </div>

      {/* Revenue Breakdown and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Source</h3>
          <div className="space-y-4">
            {data.breakdown.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceColor(source.source)}`}>
                    {source.source.charAt(0).toUpperCase() + source.source.slice(1)}
                  </span>
                  <span className="ml-3 text-sm text-gray-600">
                    {source.transactions} transactions
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(source.amount)}
                  </div>
                  <div className={`text-xs ${
                    source.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {source.changePercent > 0 ? '+' : ''}{source.changePercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    #{index + 1} {product.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {product.units} units sold
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(product.revenue)}
                  </div>
                  <div className={`text-xs ${
                    product.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Customers by Revenue</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topCustomers.map((customer, index) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(customer.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.lastOrder.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(customer.revenue / customer.orders)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}