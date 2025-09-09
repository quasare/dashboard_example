export type ReportType = 
  | 'sales_summary'
  | 'financial_overview'
  | 'customer_analysis'
  | 'transaction_report'
  | 'inventory_report'
  | 'performance_metrics'
  | 'revenue_analysis'
  | 'user_activity'
  | 'audit_log'
  | 'custom'

export type ReportStatus = 
  | 'draft'
  | 'scheduled'
  | 'generating'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type ReportFormat = 
  | 'pdf'
  | 'excel'
  | 'csv'
  | 'json'
  | 'html'

export type ReportFrequency = 
  | 'once'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'

export type ReportPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent'

export interface ReportParameter {
  id: string
  name: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect'
  required: boolean
  defaultValue?: any
  options?: Array<{ value: string; label: string }>
  description?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface ReportTemplate {
  id: string
  name: string
  type: ReportType
  description: string
  category: string
  thumbnail?: string
  parameters: ReportParameter[]
  defaultFormat: ReportFormat
  supportedFormats: ReportFormat[]
  estimatedTime: number // in minutes
  dataSource: string[]
  tags: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: string
  version: string
}

export interface ReportSchedule {
  id: string
  frequency: ReportFrequency
  dayOfWeek?: number // 0-6, Sunday = 0
  dayOfMonth?: number // 1-31
  time: string // HH:MM format
  timezone: string
  startDate: Date
  endDate?: Date
  isActive: boolean
  lastRun?: Date
  nextRun?: Date
  runCount: number
  failureCount: number
  maxRetries: number
}

export interface ReportRecipient {
  id: string
  name: string
  email: string
  type: 'user' | 'group' | 'external'
  notificationPreferences: {
    onSuccess: boolean
    onFailure: boolean
    onSchedule: boolean
  }
}

export interface ReportConfig {
  parameters: Record<string, any>
  format: ReportFormat
  includeCharts: boolean
  includeRawData: boolean
  compressionLevel?: 'none' | 'low' | 'medium' | 'high'
  watermark?: string
  customStyling?: Record<string, any>
}

export interface Report {
  id: string
  name: string
  description?: string
  type: ReportType
  templateId: string
  status: ReportStatus
  priority: ReportPriority
  
  // Configuration
  config: ReportConfig
  
  // Scheduling
  schedule?: ReportSchedule
  recipients: ReportRecipient[]
  
  // Execution details
  startedAt?: Date
  completedAt?: Date
  duration?: number // in seconds
  fileSize?: number // in bytes
  filePath?: string
  downloadUrl?: string
  
  // Metadata
  tags: string[]
  notes?: string
  metadata: Record<string, any>
  
  // Error handling
  errorMessage?: string
  retryCount: number
  maxRetries: number
  
  // Audit trail
  createdAt: Date
  updatedAt: Date
  createdBy: string
  lastRunBy?: string
  
  // Access control
  isPublic: boolean
  sharedWith: string[]
  
  // Analytics
  downloadCount: number
  viewCount: number
  lastAccessed?: Date
}

export interface ReportStats {
  total: number
  byStatus: Record<ReportStatus, number>
  byType: Record<ReportType, number>
  byFormat: Record<ReportFormat, number>
  totalSize: number
  avgGenerationTime: number
  successRate: number
  scheduled: number
  completed: number
  failed: number
  mostPopularTemplate: ReportTemplate | null
  recentReports: Report[]
  upcomingScheduled: Report[]
}

export interface ReportFilters {
  search: string
  type: ReportType | 'all'
  status: ReportStatus | 'all'
  format: ReportFormat | 'all'
  priority: ReportPriority | 'all'
  dateFrom: string
  dateTo: string
  createdBy: string
  tags: string[]
  isScheduled: boolean | null
  sortBy: 'created' | 'name' | 'status' | 'type' | 'priority' | 'lastRun'
  sortOrder: 'asc' | 'desc'
}

export interface ReportGeneration {
  templateId: string
  name: string
  description?: string
  parameters: Record<string, any>
  format: ReportFormat
  recipients: string[]
  schedule?: Omit<ReportSchedule, 'id' | 'lastRun' | 'nextRun' | 'runCount' | 'failureCount'>
  priority: ReportPriority
  tags: string[]
  config: Partial<ReportConfig>
}