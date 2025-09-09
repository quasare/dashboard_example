'use client'

import { Report } from '../types'
import { getTypeColor, getStatusColor, getFormatColor, getPriorityColor, formatFileSize, formatDuration, formatDate } from '../utils/mockData'

interface ReportTableProps {
  reports: Report[]
  selectedReports: string[]
  onToggleSelection: (id: string) => void
  onDownload: (id: string) => void
  onCancel: (id: string) => void
  onRetry: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onShare: (id: string, emails: string[]) => void
}

export function ReportTable({
  reports,
  selectedReports,
  onToggleSelection,
  onDownload,
  onCancel,
  onRetry,
  onDelete,
  onDuplicate,
  onShare
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      </div>
    )
  }

  const getActionButtons = (report: Report) => {
    const buttons = []
    
    if (report.status === 'completed' && report.downloadUrl) {
      buttons.push(
        <button
          key="download"
          onClick={(e) => {
            e.stopPropagation()
            onDownload(report.id)
          }}
          className="text-xs text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded transition-colors"
          title="Download report"
        >
          Download
        </button>
      )
    }
    
    if (report.status === 'generating' || report.status === 'scheduled') {
      buttons.push(
        <button
          key="cancel"
          onClick={(e) => {
            e.stopPropagation()
            onCancel(report.id)
          }}
          className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
          title="Cancel report"
        >
          Cancel
        </button>
      )
    }
    
    if (report.status === 'failed') {
      buttons.push(
        <button
          key="retry"
          onClick={(e) => {
            e.stopPropagation()
            onRetry(report.id)
          }}
          className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
          title="Retry report generation"
        >
          Retry
        </button>
      )
    }
    
    buttons.push(
      <button
        key="duplicate"
        onClick={(e) => {
          e.stopPropagation()
          onDuplicate(report.id)
        }}
        className="text-xs text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded transition-colors"
        title="Duplicate report"
      >
        Duplicate
      </button>
    )

    if (report.status === 'completed') {
      buttons.push(
        <button
          key="share"
          onClick={(e) => {
            e.stopPropagation()
            const emails = prompt('Enter email addresses (comma separated):')
            if (emails) {
              onShare(report.id, emails.split(',').map(email => email.trim()))
            }
          }}
          className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
          title="Share report"
        >
          Share
        </button>
      )
    }
    
    buttons.push(
      <button
        key="delete"
        onClick={(e) => {
          e.stopPropagation()
          if (confirm('Are you sure you want to delete this report?')) {
            onDelete(report.id)
          }
        }}
        className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
        title="Delete report"
      >
        Delete
      </button>
    )
    
    return buttons
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={selectedReports.length === reports.length && reports.length > 0}
                  onChange={() => {}}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Format
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => {
              const isSelected = selectedReports.includes(report.id)
              const typeColor = getTypeColor(report.type)
              const statusColor = getStatusColor(report.status)
              const formatColor = getFormatColor(report.config.format)
              const priorityColor = getPriorityColor(report.priority)
              
              return (
                <tr
                  key={report.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-4 border-blue-400' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        onToggleSelection(report.id)
                      }}
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {report.name}
                        </div>
                        {report.description && (
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {report.description}
                          </div>
                        )}
                        {report.schedule && report.schedule.isActive && (
                          <div className="flex items-center mt-1">
                            <svg className="w-3 h-3 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-blue-600">Scheduled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor.bg} ${typeColor.text}`}>
                      {report.type.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                        {report.status}
                      </span>
                      {report.status === 'generating' && (
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div className="bg-blue-600 h-1 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                        </div>
                      )}
                      {report.errorMessage && (
                        <div className="text-xs text-red-600 max-w-xs truncate" title={report.errorMessage}>
                          Error: {report.errorMessage}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatColor.bg} ${formatColor.text}`}>
                      {report.config.format.toUpperCase()}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor.bg} ${priorityColor.text}`}>
                      {report.priority}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {report.fileSize && (
                        <div className="text-gray-900">
                          {formatFileSize(report.fileSize)}
                        </div>
                      )}
                      {report.duration && (
                        <div className="text-gray-500 text-xs">
                          Generated in {formatDuration(report.duration)}
                        </div>
                      )}
                      {report.downloadCount > 0 && (
                        <div className="text-gray-400 text-xs">
                          {report.downloadCount} download{report.downloadCount !== 1 ? 's' : ''}
                        </div>
                      )}
                      {report.schedule && report.schedule.nextRun && (
                        <div className="text-blue-600 text-xs">
                          Next: {formatDate(report.schedule.nextRun)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-gray-900">
                        {formatDate(report.createdAt)}
                      </div>
                      <div className="text-gray-500 text-xs">
                        by {report.createdBy}
                      </div>
                      {report.completedAt && (
                        <div className="text-gray-400 text-xs">
                          Completed: {formatDate(report.completedAt)}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {getActionButtons(report)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}