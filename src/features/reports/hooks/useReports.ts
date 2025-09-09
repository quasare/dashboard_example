'use client'

import { useState, useMemo, useCallback } from 'react'
import { Report, ReportTemplate, ReportFilters, ReportStats, ReportType, ReportStatus, ReportFormat, ReportPriority, ReportGeneration } from '../types'
import { mockReports, mockReportTemplates, calculateReportStats } from '../utils/mockData'

interface UseReportsReturn {
  reports: Report[]
  templates: ReportTemplate[]
  reportStats: ReportStats
  filters: ReportFilters
  setFilters: (filters: ReportFilters) => void
  selectedReports: string[]
  actions: {
    toggleReportSelection: (id: string) => void
    selectAllReports: () => void
    clearSelection: () => void
    generateReport: (config: ReportGeneration) => void
    scheduleReport: (reportId: string, schedule: any) => void
    cancelReport: (id: string) => void
    retryReport: (id: string) => void
    deleteReport: (id: string) => void
    duplicateReport: (id: string) => void
    downloadReport: (id: string) => void
    shareReport: (id: string, emails: string[]) => void
    bulkDelete: () => void
    bulkCancel: () => void
    bulkRetry: () => void
    exportReportsList: () => void
  }
}

const defaultFilters: ReportFilters = {
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
}

export function useReports(): UseReportsReturn {
  const [allReports, setAllReports] = useState<Report[]>(mockReports)
  const [templates] = useState<ReportTemplate[]>(mockReportTemplates)
  const [filters, setFilters] = useState<ReportFilters>(defaultFilters)
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const filteredAndSortedReports = useMemo(() => {
    let filtered = allReports.filter((report) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const searchFields = [
          report.name,
          report.description || '',
          report.createdBy,
          ...report.tags
        ]
        
        if (!searchFields.some(field => field.toLowerCase().includes(searchLower))) {
          return false
        }
      }

      // Type filter
      if (filters.type !== 'all' && report.type !== filters.type) {
        return false
      }

      // Status filter
      if (filters.status !== 'all' && report.status !== filters.status) {
        return false
      }

      // Format filter
      if (filters.format !== 'all' && report.config.format !== filters.format) {
        return false
      }

      // Priority filter
      if (filters.priority !== 'all' && report.priority !== filters.priority) {
        return false
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom)
        if (report.createdAt < fromDate) {
          return false
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // End of day
        if (report.createdAt > toDate) {
          return false
        }
      }

      // Created by filter
      if (filters.createdBy && !report.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some(tag => 
          report.tags.some(reportTag => 
            reportTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
        if (!hasTag) {
          return false
        }
      }

      // Scheduled filter
      if (filters.isScheduled !== null) {
        const isScheduled = report.schedule && report.schedule.isActive
        if (filters.isScheduled !== !!isScheduled) {
          return false
        }
      }

      return true
    })

    // Sort reports
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortBy) {
        case 'created':
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
          break
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        case 'priority':
          const priorityOrder = { low: 0, normal: 1, high: 2, urgent: 3 }
          aValue = priorityOrder[a.priority]
          bValue = priorityOrder[b.priority]
          break
        case 'lastRun':
          aValue = a.completedAt?.getTime() || a.startedAt?.getTime() || 0
          bValue = b.completedAt?.getTime() || b.startedAt?.getTime() || 0
          break
        default:
          aValue = a.createdAt.getTime()
          bValue = b.createdAt.getTime()
      }

      if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [allReports, filters])

  const reportStats = useMemo(() => {
    return calculateReportStats(filteredAndSortedReports)
  }, [filteredAndSortedReports])

  const toggleReportSelection = useCallback((id: string) => {
    setSelectedReports(prev => 
      prev.includes(id) 
        ? prev.filter(reportId => reportId !== id)
        : [...prev, id]
    )
  }, [])

  const selectAllReports = useCallback(() => {
    setSelectedReports(filteredAndSortedReports.map(r => r.id))
  }, [filteredAndSortedReports])

  const clearSelection = useCallback(() => {
    setSelectedReports([])
  }, [])

  const generateReport = useCallback((config: ReportGeneration) => {
    const template = templates.find(t => t.id === config.templateId)
    if (!template) return

    const newReport: Report = {
      id: `report-${Date.now()}`,
      name: config.name,
      description: config.description,
      type: template.type,
      templateId: config.templateId,
      status: 'generating',
      priority: config.priority,
      config: {
        parameters: config.parameters,
        format: config.format,
        includeCharts: config.config.includeCharts ?? true,
        includeRawData: config.config.includeRawData ?? false,
        ...config.config
      },
      recipients: config.recipients.map((email, index) => ({
        id: `recipient-${index}`,
        name: email.split('@')[0],
        email,
        type: 'external' as const,
        notificationPreferences: {
          onSuccess: true,
          onFailure: true,
          onSchedule: false
        }
      })),
      schedule: config.schedule ? {
        id: `schedule-${Date.now()}`,
        ...config.schedule,
        lastRun: undefined,
        nextRun: new Date(Date.now() + 60000), // Next minute for demo
        runCount: 0,
        failureCount: 0
      } : undefined,
      startedAt: new Date(),
      tags: config.tags,
      metadata: {
        estimatedTime: template.estimatedTime,
        templateVersion: template.version
      },
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
      isPublic: false,
      sharedWith: [],
      downloadCount: 0,
      viewCount: 0
    }

    setAllReports(prev => [newReport, ...prev])

    // Simulate report generation
    setTimeout(() => {
      setAllReports(prev => prev.map(report => 
        report.id === newReport.id
          ? {
              ...report,
              status: 'completed' as ReportStatus,
              completedAt: new Date(),
              duration: Math.floor(Math.random() * 300) + 30, // 30-330 seconds
              fileSize: Math.floor(Math.random() * 5000000) + 1000000, // 1-6MB
              filePath: `/reports/${newReport.id}.${config.format}`,
              downloadUrl: `/api/reports/download/${newReport.id}`
            }
          : report
      ))
    }, 5000) // 5 seconds simulation
  }, [templates])

  const scheduleReport = useCallback((reportId: string, schedule: any) => {
    setAllReports(prev => prev.map(report =>
      report.id === reportId
        ? {
            ...report,
            schedule: {
              ...schedule,
              id: `schedule-${Date.now()}`,
              runCount: 0,
              failureCount: 0
            },
            status: 'scheduled' as ReportStatus,
            updatedAt: new Date()
          }
        : report
    ))
  }, [])

  const cancelReport = useCallback((id: string) => {
    setAllReports(prev => prev.map(report =>
      report.id === id
        ? {
            ...report,
            status: 'cancelled' as ReportStatus,
            updatedAt: new Date()
          }
        : report
    ))
  }, [])

  const retryReport = useCallback((id: string) => {
    setAllReports(prev => prev.map(report =>
      report.id === id
        ? {
            ...report,
            status: 'generating' as ReportStatus,
            startedAt: new Date(),
            updatedAt: new Date(),
            retryCount: report.retryCount + 1,
            errorMessage: undefined
          }
        : report
    ))

    // Simulate retry
    setTimeout(() => {
      setAllReports(prev => prev.map(report => 
        report.id === id
          ? {
              ...report,
              status: 'completed' as ReportStatus,
              completedAt: new Date(),
              duration: Math.floor(Math.random() * 300) + 30,
              fileSize: Math.floor(Math.random() * 5000000) + 1000000,
              filePath: `/reports/${id}.${report.config.format}`,
              downloadUrl: `/api/reports/download/${id}`
            }
          : report
      ))
    }, 3000)
  }, [])

  const deleteReport = useCallback((id: string) => {
    setAllReports(prev => prev.filter(report => report.id !== id))
    setSelectedReports(prev => prev.filter(reportId => reportId !== id))
  }, [])

  const duplicateReport = useCallback((id: string) => {
    const originalReport = allReports.find(r => r.id === id)
    if (!originalReport) return

    const duplicatedReport: Report = {
      ...originalReport,
      id: `report-${Date.now()}`,
      name: `${originalReport.name} (Copy)`,
      status: 'draft',
      startedAt: undefined,
      completedAt: undefined,
      duration: undefined,
      fileSize: undefined,
      filePath: undefined,
      downloadUrl: undefined,
      retryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
      downloadCount: 0,
      viewCount: 0,
      lastAccessed: undefined
    }

    setAllReports(prev => [duplicatedReport, ...prev])
  }, [allReports])

  const downloadReport = useCallback((id: string) => {
    const report = allReports.find(r => r.id === id)
    if (!report || !report.downloadUrl) return

    // Simulate download
    const link = document.createElement('a')
    link.href = report.downloadUrl
    link.download = `${report.name}.${report.config.format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Update download count
    setAllReports(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            downloadCount: r.downloadCount + 1,
            lastAccessed: new Date()
          }
        : r
    ))
  }, [allReports])

  const shareReport = useCallback((id: string, emails: string[]) => {
    setAllReports(prev => prev.map(report =>
      report.id === id
        ? {
            ...report,
            sharedWith: Array.from(new Set([...report.sharedWith, ...emails])),
            updatedAt: new Date()
          }
        : report
    ))
  }, [])

  const bulkDelete = useCallback(() => {
    setAllReports(prev => prev.filter(report => !selectedReports.includes(report.id)))
    setSelectedReports([])
  }, [selectedReports])

  const bulkCancel = useCallback(() => {
    setAllReports(prev => prev.map(report =>
      selectedReports.includes(report.id) && (report.status === 'generating' || report.status === 'scheduled')
        ? {
            ...report,
            status: 'cancelled' as ReportStatus,
            updatedAt: new Date()
          }
        : report
    ))
    setSelectedReports([])
  }, [selectedReports])

  const bulkRetry = useCallback(() => {
    setAllReports(prev => prev.map(report =>
      selectedReports.includes(report.id) && report.status === 'failed'
        ? {
            ...report,
            status: 'generating' as ReportStatus,
            startedAt: new Date(),
            updatedAt: new Date(),
            retryCount: report.retryCount + 1,
            errorMessage: undefined
          }
        : report
    ))
    setSelectedReports([])
  }, [selectedReports])

  const exportReportsList = useCallback(() => {
    const dataToExport = selectedReports.length > 0 
      ? filteredAndSortedReports.filter(r => selectedReports.includes(r.id))
      : filteredAndSortedReports

    const headers = [
      'Name',
      'Type',
      'Status',
      'Format',
      'Priority',
      'Created By',
      'Created At',
      'File Size',
      'Download Count'
    ]

    const csvData = [
      headers.join(','),
      ...dataToExport.map(report => [
        `"${report.name.replace(/"/g, '""')}"`,
        report.type,
        report.status,
        report.config.format,
        report.priority,
        report.createdBy,
        report.createdAt.toISOString(),
        report.fileSize?.toString() || '0',
        report.downloadCount.toString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reports_list_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, [filteredAndSortedReports, selectedReports])

  return {
    reports: filteredAndSortedReports,
    templates,
    reportStats,
    filters,
    setFilters,
    selectedReports,
    actions: {
      toggleReportSelection,
      selectAllReports,
      clearSelection,
      generateReport,
      scheduleReport,
      cancelReport,
      retryReport,
      deleteReport,
      duplicateReport,
      downloadReport,
      shareReport,
      bulkDelete,
      bulkCancel,
      bulkRetry,
      exportReportsList
    }
  }
}