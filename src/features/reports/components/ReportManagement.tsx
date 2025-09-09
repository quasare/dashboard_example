'use client'

import { useState } from 'react'
import { useReports } from '../hooks/useReports'
import { ReportFilters } from './ReportFilters'
import { ReportTable } from './ReportTable'
import { ReportGeneratorModal } from './ReportGeneratorModal'
import { formatFileSize, formatDate } from '../utils/mockData'

export function ReportManagement() {
  const {
    reports,
    templates,
    reportStats,
    filters,
    setFilters,
    selectedReports,
    actions
  } = useReports()

  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Report Management</h1>
          <p className="mt-1 text-gray-500">
            Generate, schedule, and manage reports with export functionality
          </p>
        </div>
        <button
          onClick={() => setIsGeneratorOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          Generate New Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Reports</dt>
                  <dd className="text-lg font-medium text-gray-900">{reportStats.total}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-lg font-medium text-gray-900">{reportStats.completed}</dd>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Scheduled</dt>
                  <dd className="text-lg font-medium text-gray-900">{reportStats.scheduled}</dd>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd className="text-lg font-medium text-gray-900">{Math.round(reportStats.successRate)}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Status Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Report Status Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{reportStats.byStatus.draft || 0}</div>
            <div className="text-sm text-gray-500">Draft</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{reportStats.byStatus.scheduled || 0}</div>
            <div className="text-sm text-gray-500">Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{reportStats.byStatus.generating || 0}</div>
            <div className="text-sm text-gray-500">Generating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{reportStats.byStatus.completed || 0}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{reportStats.byStatus.failed || 0}</div>
            <div className="text-sm text-gray-500">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{reportStats.byStatus.cancelled || 0}</div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Storage:</span>
              <span className="font-medium text-gray-900">{formatFileSize(reportStats.totalSize)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Avg Generation Time:</span>
              <span className="font-medium text-gray-900">{Math.round(reportStats.avgGenerationTime)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Success Rate:</span>
              <span className={`font-medium ${reportStats.successRate >= 95 ? 'text-green-600' : reportStats.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                {Math.round(reportStats.successRate)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reports by Type</h3>
          <div className="space-y-3">
            {Object.entries(reportStats.byType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Reports by Format</h3>
          <div className="space-y-3">
            {Object.entries(reportStats.byFormat)
              .sort(([,a], [,b]) => b - a)
              .map(([format, count]) => (
                <div key={format} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 uppercase">{format}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Most Popular Template */}
      {reportStats.mostPopularTemplate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🏆 Most Popular Template</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900">{reportStats.mostPopularTemplate.name}</h4>
              <p className="text-sm text-gray-600">{reportStats.mostPopularTemplate.description}</p>
              <div className="flex items-center mt-2 space-x-4">
                <span className="text-sm text-gray-500">
                  <strong>{reportStats.mostPopularTemplate.category}</strong>
                </span>
                <span className="text-sm text-gray-500">
                  Est. <strong>{reportStats.mostPopularTemplate.estimatedTime}min</strong>
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  {reportStats.mostPopularTemplate.supportedFormats.join(', ').toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Use Template
            </button>
          </div>
        </div>
      )}

      {/* Recent Reports and Upcoming Scheduled */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportStats.recentReports.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">📋 Recent Reports</h3>
            <div className="space-y-3">
              {reportStats.recentReports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{report.name}</p>
                    <p className="text-xs text-gray-500">
                      {report.completedAt ? `Completed ${formatDate(report.completedAt)}` : 'In progress'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-green-100 text-green-800' :
                      report.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                    {report.status === 'completed' && report.downloadUrl && (
                      <button
                        onClick={() => actions.downloadReport(report.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reportStats.upcomingScheduled.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">⏰ Upcoming Scheduled</h3>
            <div className="space-y-3">
              {reportStats.upcomingScheduled.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{report.name}</p>
                    <p className="text-xs text-gray-500">
                      Next run: {report.schedule?.nextRun ? formatDate(report.schedule.nextRun) : 'Not scheduled'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.schedule?.frequency}
                    </span>
                    <button
                      onClick={() => actions.cancelReport(report.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Cancel schedule"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <ReportFilters
          filters={filters}
          onFiltersChange={setFilters}
          reportCount={reports.length}
          selectedCount={selectedReports.length}
          onSelectAll={actions.selectAllReports}
          onClearSelection={actions.clearSelection}
          onBulkDelete={actions.bulkDelete}
          onBulkCancel={actions.bulkCancel}
          onBulkRetry={actions.bulkRetry}
          onExportReports={actions.exportReportsList}
        />
      </div>

      {/* Report Table */}
      <ReportTable
        reports={reports}
        selectedReports={selectedReports}
        onToggleSelection={actions.toggleReportSelection}
        onDownload={actions.downloadReport}
        onCancel={actions.cancelReport}
        onRetry={actions.retryReport}
        onDelete={actions.deleteReport}
        onDuplicate={actions.duplicateReport}
        onShare={actions.shareReport}
      />

      {/* Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        templates={templates}
        onGenerate={actions.generateReport}
      />
    </div>
  )
}