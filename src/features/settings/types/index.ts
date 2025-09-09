export type SettingCategory = 
  | 'profile'
  | 'account'
  | 'preferences'
  | 'security'
  | 'notifications'
  | 'privacy'
  | 'billing'
  | 'integrations'
  | 'system'
  | 'advanced'

export type SettingType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'time'
  | 'timezone'
  | 'color'
  | 'file'
  | 'range'

export type NotificationType = 
  | 'email'
  | 'push'
  | 'sms'
  | 'in_app'
  | 'webhook'

export type NotificationFrequency = 
  | 'immediate'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'never'

export type ThemeMode = 
  | 'light'
  | 'dark'
  | 'system'

export type Language = 
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'ja'
  | 'zh'

export type Currency = 
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'CHF'
  | 'CNY'

export type DateFormat = 
  | 'MM/DD/YYYY'
  | 'DD/MM/YYYY'
  | 'YYYY-MM-DD'
  | 'DD MMM YYYY'

export type TimeFormat = 
  | '12'
  | '24'

export interface SettingOption {
  value: string
  label: string
  description?: string
  icon?: string
}

export interface SettingValidation {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  custom?: (value: any) => string | null
}

export interface Setting {
  id: string
  key: string
  name: string
  description: string
  category: SettingCategory
  type: SettingType
  value: any
  defaultValue: any
  options?: SettingOption[]
  validation?: SettingValidation
  isVisible: boolean
  isEditable: boolean
  requiresRestart?: boolean
  requiresConfirmation?: boolean
  dependsOn?: string[]
  order: number
  group?: string
  icon?: string
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  title?: string
  company?: string
  department?: string
  location?: string
  timezone: string
  language: Language
  bio?: string
  website?: string
  socialLinks: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  twoFactorMethod: '2fa_app' | 'sms' | 'email'
  sessionTimeout: number // in minutes
  loginNotifications: boolean
  deviceTracking: boolean
  ipWhitelist: string[]
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
    passwordHistory: number
    maxAge: number // in days
  }
  apiKeys: Array<{
    id: string
    name: string
    key: string
    permissions: string[]
    createdAt: Date
    lastUsed?: Date
    expiresAt?: Date
  }>
}

export interface NotificationSettings {
  email: Record<string, boolean>
  push: Record<string, boolean>
  sms: Record<string, boolean>
  inApp: Record<string, boolean>
  preferences: {
    emailDigest: NotificationFrequency
    quietHours: {
      enabled: boolean
      startTime: string
      endTime: string
      timezone: string
    }
    weekendNotifications: boolean
    vacationMode: {
      enabled: boolean
      startDate?: Date
      endDate?: Date
    }
  }
}

export interface AppearanceSettings {
  theme: ThemeMode
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
  sidebarCollapsed: boolean
  animationsEnabled: boolean
  highContrast: boolean
  reducedMotion: boolean
}

export interface PreferencesSettings {
  language: Language
  timezone: string
  dateFormat: DateFormat
  timeFormat: TimeFormat
  currency: Currency
  numberFormat: 'US' | 'EU' | 'UK'
  startOfWeek: 'sunday' | 'monday'
  autoSave: boolean
  defaultPageSize: number
  showTutorials: boolean
  analyticsOptIn: boolean
}

export interface BillingSettings {
  plan: 'free' | 'pro' | 'enterprise'
  billingCycle: 'monthly' | 'yearly'
  paymentMethod: {
    type: 'card' | 'bank' | 'paypal'
    last4?: string
    expiresAt?: string
    brand?: string
  }
  billingAddress: {
    name: string
    company?: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
    vatNumber?: string
  }
  invoiceEmails: string[]
  autoPayment: boolean
  usage: {
    users: number
    storage: number // in GB
    apiCalls: number
    reports: number
  }
  limits: {
    users: number
    storage: number
    apiCalls: number
    reports: number
  }
}

export interface IntegrationSettings {
  webhooks: Array<{
    id: string
    name: string
    url: string
    events: string[]
    isActive: boolean
    secret: string
    createdAt: Date
    lastTriggered?: Date
  }>
  apiIntegrations: Array<{
    id: string
    name: string
    type: string
    config: Record<string, any>
    isActive: boolean
    createdAt: Date
  }>
  ssoProviders: Array<{
    id: string
    provider: 'google' | 'microsoft' | 'saml'
    isActive: boolean
    config: Record<string, any>
  }>
}

export interface SystemSettings {
  maintenanceMode: boolean
  maintenanceMessage: string
  registrationEnabled: boolean
  inviteOnly: boolean
  emailVerificationRequired: boolean
  approvalRequired: boolean
  sessionSettings: {
    timeout: number
    maxConcurrentSessions: number
    rememberMeEnabled: boolean
    rememberMeDuration: number // in days
  }
  backupSettings: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    retention: number // in days
    includeFiles: boolean
  }
  logSettings: {
    level: 'debug' | 'info' | 'warn' | 'error'
    retention: number // in days
    includeUserActions: boolean
  }
}

export interface SettingsState {
  profile: UserProfile
  security: SecuritySettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
  preferences: PreferencesSettings
  billing: BillingSettings
  integrations: IntegrationSettings
  system: SystemSettings
  settings: Setting[]
}

export interface SettingsUpdate {
  category: SettingCategory
  updates: Record<string, any>
}

export interface SettingsValidationError {
  field: string
  message: string
}

export interface SettingsTab {
  id: SettingCategory
  name: string
  description: string
  icon: string
  order: number
  requiresAdmin?: boolean
}