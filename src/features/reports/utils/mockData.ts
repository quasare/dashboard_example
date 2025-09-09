import { Report, ReportTemplate, ReportStats, ReportType, ReportStatus, ReportFormat, ReportPriority, ReportFrequency } from '../types'

export const mockReportTemplates: ReportTemplate[] = [
  {
    id: 'template-001',
    name: 'Monthly Sales Summary',
    type: 'sales_summary',
    description: 'Comprehensive monthly sales report with trends and analytics',
    category: 'Sales',
    parameters: [
      {
        id: 'month',
        name: 'Month',
        type: 'date',
        required: true,
        description: 'Select the month for the report'
      },
      {
        id: 'includeCharts',
        name: 'Include Charts',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: 'Include visual charts in the report'
      }
    ],
    defaultFormat: 'pdf',
    supportedFormats: ['pdf', 'excel', 'csv'],
    estimatedTime: 5,
    dataSource: ['sales', 'orders', 'customers'],
    tags: ['monthly', 'sales', 'summary'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'admin',
    version: '1.0'
  },
  {
    id: 'template-002',
    name: 'Financial Overview',
    type: 'financial_overview',
    description: 'Complete financial performance report with revenue, expenses, and profit analysis',
    category: 'Finance',
    parameters: [
      {
        id: 'period',
        name: 'Period',
        type: 'select',
        required: true,
        options: [
          { value: 'month', label: 'Monthly' },
          { value: 'quarter', label: 'Quarterly' },
          { value: 'year', label: 'Yearly' }
        ],
        description: 'Select reporting period'
      },
      {
        id: 'includeComparisons',
        name: 'Include Period Comparisons',
        type: 'boolean',
        required: false,
        defaultValue: true
      }
    ],
    defaultFormat: 'pdf',
    supportedFormats: ['pdf', 'excel', 'html'],
    estimatedTime: 8,
    dataSource: ['transactions', 'revenue', 'expenses'],
    tags: ['financial', 'overview', 'performance'],
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'admin',
    version: '1.2'
  },
  {
    id: 'template-003',
    name: 'Customer Analysis Report',
    type: 'customer_analysis',
    description: 'Detailed customer behavior and segmentation analysis',
    category: 'Analytics',
    parameters: [
      {
        id: 'segments',
        name: 'Customer Segments',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'premium', label: 'Premium' },
          { value: 'regular', label: 'Regular' },
          { value: 'new', label: 'New' }
        ]
      },
      {
        id: 'includeChurn',
        name: 'Include Churn Analysis',
        type: 'boolean',
        required: false,
        defaultValue: false
      }
    ],
    defaultFormat: 'excel',
    supportedFormats: ['excel', 'pdf', 'csv'],
    estimatedTime: 12,
    dataSource: ['customers', 'orders', 'interactions'],
    tags: ['customer', 'analysis', 'segmentation'],
    isActive: true,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-25'),
    createdBy: 'analyst',
    version: '2.1'
  },
  {
    id: 'template-004',
    name: 'Transaction Report',
    type: 'transaction_report',
    description: 'Detailed transaction history with filtering and analysis',
    category: 'Operations',
    parameters: [
      {
        id: 'dateRange',
        name: 'Date Range',
        type: 'string',
        required: true,
        description: 'Specify date range for transactions'
      },
      {
        id: 'status',
        name: 'Transaction Status',
        type: 'multiselect',
        required: false,
        options: [
          { value: 'completed', label: 'Completed' },
          { value: 'pending', label: 'Pending' },
          { value: 'failed', label: 'Failed' }
        ]
      }
    ],
    defaultFormat: 'csv',
    supportedFormats: ['csv', 'excel', 'json'],
    estimatedTime: 3,
    dataSource: ['transactions'],
    tags: ['transactions', 'history', 'operations'],
    isActive: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'operator',
    version: '1.0'
  },
  {
    id: 'template-005',
    name: 'Inventory Report',
    type: 'inventory_report',
    description: 'Current inventory status with low stock alerts',
    category: 'Inventory',
    parameters: [
      {
        id: 'includeZeroStock',
        name: 'Include Zero Stock Items',
        type: 'boolean',
        required: false,
        defaultValue: true
      },
      {
        id: 'category',
        name: 'Product Category',
        type: 'select',
        required: false,
        options: [
          { value: 'all', label: 'All Categories' },
          { value: 'furniture', label: 'Furniture' },
          { value: 'electronics', label: 'Electronics' }
        ]
      }
    ],
    defaultFormat: 'excel',
    supportedFormats: ['excel', 'csv', 'pdf'],
    estimatedTime: 4,
    dataSource: ['products', 'inventory'],
    tags: ['inventory', 'stock', 'alerts'],
    isActive: true,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-28'),
    createdBy: 'inventory_manager',
    version: '1.1'
  }
]

export const mockReports: Report[] = [
  {
    id: 'report-001',
    name: 'January 2024 Sales Summary',
    description: 'Monthly sales report for January 2024',
    type: 'sales_summary',
    templateId: 'template-001',
    status: 'completed',
    priority: 'normal',
    config: {
      parameters: { month: '2024-01', includeCharts: true },
      format: 'pdf',
      includeCharts: true,
      includeRawData: false
    },
    recipients: [
      {
        id: 'recipient-001',
        name: 'Sales Manager',
        email: 'sales@company.com',
        type: 'user',
        notificationPreferences: {
          onSuccess: true,
          onFailure: true,
          onSchedule: false
        }
      }
    ],
    schedule: {
      id: 'schedule-001',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '09:00',
      timezone: 'UTC',
      startDate: new Date('2024-01-01'),
      isActive: true,
      nextRun: new Date('2024-03-01T09:00:00Z'),
      runCount: 2,
      failureCount: 0,
      maxRetries: 3
    },
    startedAt: new Date('2024-02-01T09:00:00Z'),
    completedAt: new Date('2024-02-01T09:05:30Z'),
    duration: 330,
    fileSize: 2457600,
    filePath: '/reports/january-2024-sales.pdf',
    downloadUrl: '/api/reports/download/report-001',
    tags: ['monthly', 'sales', 'automated'],
    metadata: {
      recordsProcessed: 15420,
      chartsGenerated: 8,
      pagesCount: 15
    },
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-02-01T09:05:30Z'),
    createdBy: 'admin',
    lastRunBy: 'system',
    isPublic: false,
    sharedWith: ['sales_team'],
    downloadCount: 12,
    viewCount: 28,
    lastAccessed: new Date('2024-02-05T14:30:00Z')
  },
  {
    id: 'report-002',
    name: 'Q4 2023 Financial Overview',
    description: 'Quarterly financial performance report',
    type: 'financial_overview',
    templateId: 'template-002',
    status: 'completed',
    priority: 'high',
    config: {
      parameters: { period: 'quarter', includeComparisons: true },
      format: 'excel',
      includeCharts: true,
      includeRawData: true
    },
    recipients: [
      {
        id: 'recipient-002',
        name: 'CFO',
        email: 'cfo@company.com',
        type: 'user',
        notificationPreferences: {
          onSuccess: true,
          onFailure: true,
          onSchedule: true
        }
      }
    ],
    startedAt: new Date('2024-01-10T08:00:00Z'),
    completedAt: new Date('2024-01-10T08:12:45Z'),
    duration: 765,
    fileSize: 5242880,
    filePath: '/reports/q4-2023-financial.xlsx',
    downloadUrl: '/api/reports/download/report-002',
    tags: ['quarterly', 'financial', 'executive'],
    metadata: {
      recordsProcessed: 45230,
      sheetsGenerated: 12,
      formulasUsed: 156
    },
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date('2024-01-05T15:00:00Z'),
    updatedAt: new Date('2024-01-10T08:12:45Z'),
    createdBy: 'finance_team',
    lastRunBy: 'finance_team',
    isPublic: false,
    sharedWith: ['executive_team', 'board_members'],
    downloadCount: 25,
    viewCount: 45,
    lastAccessed: new Date('2024-02-08T11:20:00Z')
  },
  {
    id: 'report-003',
    name: 'Customer Segmentation Analysis',
    type: 'customer_analysis',
    templateId: 'template-003',
    status: 'generating',
    priority: 'normal',
    config: {
      parameters: { segments: ['premium', 'regular'], includeChurn: true },
      format: 'pdf',
      includeCharts: true,
      includeRawData: false
    },
    recipients: [
      {
        id: 'recipient-003',
        name: 'Marketing Team',
        email: 'marketing@company.com',
        type: 'group',
        notificationPreferences: {
          onSuccess: true,
          onFailure: true,
          onSchedule: false
        }
      }
    ],
    startedAt: new Date('2024-02-10T14:00:00Z'),
    tags: ['customer', 'analysis', 'marketing'],
    metadata: {
      recordsProcessed: 28450
    },
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date('2024-02-10T13:45:00Z'),
    updatedAt: new Date('2024-02-10T14:00:00Z'),
    createdBy: 'marketing_manager',
    isPublic: false,
    sharedWith: ['marketing_team'],
    downloadCount: 0,
    viewCount: 0
  },
  {
    id: 'report-004',
    name: 'Weekly Transactions Export',
    type: 'transaction_report',
    templateId: 'template-004',
    status: 'failed',
    priority: 'low',
    config: {
      parameters: { dateRange: '2024-01-29_to_2024-02-04', status: ['completed'] },
      format: 'csv',
      includeCharts: false,
      includeRawData: true
    },
    recipients: [
      {
        id: 'recipient-004',
        name: 'Operations Team',
        email: 'operations@company.com',
        type: 'group',
        notificationPreferences: {
          onSuccess: false,
          onFailure: true,
          onSchedule: false
        }
      }
    ],
    schedule: {
      id: 'schedule-002',
      frequency: 'weekly',
      dayOfWeek: 1, // Monday
      time: '07:00',
      timezone: 'UTC',
      startDate: new Date('2024-01-01'),
      isActive: true,
      lastRun: new Date('2024-02-05T07:00:00Z'),
      nextRun: new Date('2024-02-12T07:00:00Z'),
      runCount: 6,
      failureCount: 2,
      maxRetries: 3
    },
    startedAt: new Date('2024-02-05T07:00:00Z'),
    duration: 45,
    errorMessage: 'Database connection timeout during data export',
    tags: ['weekly', 'transactions', 'automated', 'failed'],
    metadata: {
      errorCode: 'DB_TIMEOUT',
      lastSuccessfulRun: '2024-01-29T07:00:00Z'
    },
    retryCount: 2,
    maxRetries: 3,
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-02-05T07:01:30Z'),
    createdBy: 'operations_manager',
    lastRunBy: 'system',
    isPublic: false,
    sharedWith: ['operations_team'],
    downloadCount: 35,
    viewCount: 52
  },
  {
    id: 'report-005',
    name: 'Current Inventory Status',
    type: 'inventory_report',
    templateId: 'template-005',
    status: 'scheduled',
    priority: 'normal',
    config: {
      parameters: { includeZeroStock: true, category: 'all' },
      format: 'excel',
      includeCharts: true,
      includeRawData: true
    },
    recipients: [
      {
        id: 'recipient-005',
        name: 'Inventory Manager',
        email: 'inventory@company.com',
        type: 'user',
        notificationPreferences: {
          onSuccess: true,
          onFailure: true,
          onSchedule: true
        }
      }
    ],
    schedule: {
      id: 'schedule-003',
      frequency: 'daily',
      time: '06:00',
      timezone: 'UTC',
      startDate: new Date('2024-02-01'),
      isActive: true,
      lastRun: new Date('2024-02-09T06:00:00Z'),
      nextRun: new Date('2024-02-11T06:00:00Z'),
      runCount: 9,
      failureCount: 0,
      maxRetries: 3
    },
    tags: ['daily', 'inventory', 'automated'],
    metadata: {
      lastInventoryUpdate: '2024-02-09T23:45:00Z'
    },
    retryCount: 0,
    maxRetries: 3,
    createdAt: new Date('2024-01-30T16:00:00Z'),
    updatedAt: new Date('2024-02-09T06:00:00Z'),
    createdBy: 'inventory_manager',
    lastRunBy: 'system',
    isPublic: false,
    sharedWith: ['inventory_team', 'procurement_team'],
    downloadCount: 18,
    viewCount: 31,
    lastAccessed: new Date('2024-02-09T08:15:00Z')
  }
]

export const getTypeColor = (type: ReportType): { bg: string; text: string } => {
  const colors = {
    sales_summary: { bg: 'bg-green-100', text: 'text-green-800' },
    financial_overview: { bg: 'bg-blue-100', text: 'text-blue-800' },
    customer_analysis: { bg: 'bg-purple-100', text: 'text-purple-800' },
    transaction_report: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    inventory_report: { bg: 'bg-orange-100', text: 'text-orange-800' },
    performance_metrics: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    revenue_analysis: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    user_activity: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    audit_log: { bg: 'bg-red-100', text: 'text-red-800' },
    custom: { bg: 'bg-gray-100', text: 'text-gray-800' }
  }
  return colors[type] || colors.custom
}

export const getStatusColor = (status: ReportStatus): { bg: string; text: string } => {
  const colors = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-800' },
    generating: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    completed: { bg: 'bg-green-100', text: 'text-green-800' },
    failed: { bg: 'bg-red-100', text: 'text-red-800' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-800' }
  }
  return colors[status] || colors.draft
}

export const getFormatColor = (format: ReportFormat): { bg: string; text: string } => {
  const colors = {
    pdf: { bg: 'bg-red-100', text: 'text-red-800' },
    excel: { bg: 'bg-green-100', text: 'text-green-800' },
    csv: { bg: 'bg-blue-100', text: 'text-blue-800' },
    json: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    html: { bg: 'bg-purple-100', text: 'text-purple-800' }
  }
  return colors[format] || colors.pdf
}

export const getPriorityColor = (priority: ReportPriority): { bg: string; text: string } => {
  const colors = {
    low: { bg: 'bg-gray-100', text: 'text-gray-800' },
    normal: { bg: 'bg-blue-100', text: 'text-blue-800' },
    high: { bg: 'bg-orange-100', text: 'text-orange-800' },
    urgent: { bg: 'bg-red-100', text: 'text-red-800' }
  }
  return colors[priority] || colors.normal
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const calculateReportStats = (reports: Report[]): ReportStats => {
  const total = reports.length
  
  const byStatus = reports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1
    return acc
  }, {} as Record<ReportStatus, number>)
  
  const byType = reports.reduce((acc, report) => {
    acc[report.type] = (acc[report.type] || 0) + 1
    return acc
  }, {} as Record<ReportType, number>)
  
  const byFormat = reports.reduce((acc, report) => {
    acc[report.config.format] = (acc[report.config.format] || 0) + 1
    return acc
  }, {} as Record<ReportFormat, number>)
  
  const totalSize = reports.reduce((sum, report) => sum + (report.fileSize || 0), 0)
  
  const completedReports = reports.filter(r => r.status === 'completed' && r.duration)
  const avgGenerationTime = completedReports.length > 0 
    ? completedReports.reduce((sum, r) => sum + (r.duration || 0), 0) / completedReports.length
    : 0
  
  const totalRuns = reports.reduce((sum, r) => sum + (r.schedule?.runCount || 1), 0)
  const failedRuns = reports.reduce((sum, r) => sum + (r.schedule?.failureCount || (r.status === 'failed' ? 1 : 0)), 0)
  const successRate = totalRuns > 0 ? ((totalRuns - failedRuns) / totalRuns) * 100 : 0
  
  const scheduled = reports.filter(r => r.schedule && r.schedule.isActive).length
  const completed = byStatus.completed || 0
  const failed = byStatus.failed || 0
  
  const templateUsage = reports.reduce((acc, report) => {
    acc[report.templateId] = (acc[report.templateId] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const mostUsedTemplateId = Object.keys(templateUsage).reduce((a, b) => 
    templateUsage[a] > templateUsage[b] ? a : b, Object.keys(templateUsage)[0]
  )
  
  const mostPopularTemplate = mockReportTemplates.find(t => t.id === mostUsedTemplateId) || null
  
  const recentReports = reports
    .filter(r => r.status === 'completed')
    .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
    .slice(0, 5)
  
  const upcomingScheduled = reports
    .filter(r => r.schedule && r.schedule.isActive && r.schedule.nextRun)
    .sort((a, b) => (a.schedule!.nextRun!.getTime()) - (b.schedule!.nextRun!.getTime()))
    .slice(0, 5)
  
  return {
    total,
    byStatus,
    byType,
    byFormat,
    totalSize,
    avgGenerationTime,
    successRate,
    scheduled,
    completed,
    failed,
    mostPopularTemplate,
    recentReports,
    upcomingScheduled
  }
}

export const getTypeOptions = () => [
  { value: 'sales_summary', label: 'Sales Summary' },
  { value: 'financial_overview', label: 'Financial Overview' },
  { value: 'customer_analysis', label: 'Customer Analysis' },
  { value: 'transaction_report', label: 'Transaction Report' },
  { value: 'inventory_report', label: 'Inventory Report' },
  { value: 'performance_metrics', label: 'Performance Metrics' },
  { value: 'revenue_analysis', label: 'Revenue Analysis' },
  { value: 'user_activity', label: 'User Activity' },
  { value: 'audit_log', label: 'Audit Log' },
  { value: 'custom', label: 'Custom' }
]

export const getStatusOptions = () => [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'generating', label: 'Generating' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' }
]

export const getFormatOptions = () => [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' }
]

export const getPriorityOptions = () => [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
]

export const getFrequencyOptions = () => [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
]