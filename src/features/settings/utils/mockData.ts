import { 
  SettingsState, 
  UserProfile, 
  SecuritySettings, 
  NotificationSettings, 
  AppearanceSettings, 
  PreferencesSettings, 
  BillingSettings, 
  IntegrationSettings, 
  SystemSettings,
  SettingsTab,
  Setting
} from '../types'

export const mockUserProfile: UserProfile = {
  id: 'user-001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  avatar: '/avatars/john-doe.jpg',
  title: 'Senior Product Manager',
  company: 'Acme Corporation',
  department: 'Product',
  location: 'San Francisco, CA',
  timezone: 'America/Los_Angeles',
  language: 'en',
  bio: 'Passionate product manager with 8+ years of experience building user-centered products.',
  website: 'https://johndoe.com',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    github: 'https://github.com/johndoe'
  },
  createdAt: new Date('2023-01-15T10:00:00Z'),
  updatedAt: new Date('2024-02-10T14:30:00Z'),
  lastLoginAt: new Date('2024-02-10T09:15:00Z')
}

export const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: true,
  twoFactorMethod: '2fa_app',
  sessionTimeout: 480, // 8 hours
  loginNotifications: true,
  deviceTracking: true,
  ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    passwordHistory: 5,
    maxAge: 90
  },
  apiKeys: [
    {
      id: 'api-001',
      name: 'Production API',
      key: 'pk_live_51H3...',
      permissions: ['read:users', 'write:reports', 'read:analytics'],
      createdAt: new Date('2024-01-15T10:00:00Z'),
      lastUsed: new Date('2024-02-09T16:45:00Z'),
      expiresAt: new Date('2024-12-15T10:00:00Z')
    },
    {
      id: 'api-002',
      name: 'Development API',
      key: 'pk_test_51H3...',
      permissions: ['read:users', 'read:reports'],
      createdAt: new Date('2024-02-01T12:00:00Z'),
      lastUsed: new Date('2024-02-10T11:30:00Z')
    }
  ]
}

export const mockNotificationSettings: NotificationSettings = {
  email: {
    newOrders: true,
    paymentReceived: true,
    reportGenerated: true,
    systemMaintenance: true,
    securityAlerts: true,
    weeklyDigest: true,
    productUpdates: false,
    marketingEmails: false
  },
  push: {
    newOrders: true,
    paymentReceived: true,
    reportGenerated: false,
    systemMaintenance: true,
    securityAlerts: true
  },
  sms: {
    securityAlerts: true,
    paymentFailed: true,
    systemDown: true
  },
  inApp: {
    newOrders: true,
    paymentReceived: true,
    reportGenerated: true,
    userMentions: true,
    teamUpdates: true
  },
  preferences: {
    emailDigest: 'weekly',
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00',
      timezone: 'America/Los_Angeles'
    },
    weekendNotifications: false,
    vacationMode: {
      enabled: false
    }
  }
}

export const mockAppearanceSettings: AppearanceSettings = {
  theme: 'system',
  primaryColor: '#3B82F6',
  fontSize: 'medium',
  compactMode: false,
  sidebarCollapsed: false,
  animationsEnabled: true,
  highContrast: false,
  reducedMotion: false
}

export const mockPreferencesSettings: PreferencesSettings = {
  language: 'en',
  timezone: 'America/Los_Angeles',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12',
  currency: 'USD',
  numberFormat: 'US',
  startOfWeek: 'monday',
  autoSave: true,
  defaultPageSize: 25,
  showTutorials: true,
  analyticsOptIn: true
}

export const mockBillingSettings: BillingSettings = {
  plan: 'pro',
  billingCycle: 'monthly',
  paymentMethod: {
    type: 'card',
    last4: '4242',
    expiresAt: '12/2025',
    brand: 'Visa'
  },
  billingAddress: {
    name: 'John Doe',
    company: 'Acme Corporation',
    address1: '123 Business St',
    address2: 'Suite 100',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'US',
    vatNumber: 'US123456789'
  },
  invoiceEmails: ['billing@company.com', 'finance@company.com'],
  autoPayment: true,
  usage: {
    users: 15,
    storage: 45.2,
    apiCalls: 12450,
    reports: 89
  },
  limits: {
    users: 25,
    storage: 100,
    apiCalls: 50000,
    reports: 500
  }
}

export const mockIntegrationSettings: IntegrationSettings = {
  webhooks: [
    {
      id: 'webhook-001',
      name: 'Order Notifications',
      url: 'https://api.company.com/webhooks/orders',
      events: ['order.created', 'order.updated', 'order.cancelled'],
      isActive: true,
      secret: 'whsec_1234567890abcdef',
      createdAt: new Date('2024-01-20T14:00:00Z'),
      lastTriggered: new Date('2024-02-10T10:15:00Z')
    },
    {
      id: 'webhook-002',
      name: 'Payment Alerts',
      url: 'https://api.company.com/webhooks/payments',
      events: ['payment.succeeded', 'payment.failed'],
      isActive: true,
      secret: 'whsec_0987654321fedcba',
      createdAt: new Date('2024-01-25T16:30:00Z'),
      lastTriggered: new Date('2024-02-09T18:20:00Z')
    }
  ],
  apiIntegrations: [
    {
      id: 'integration-001',
      name: 'Slack',
      type: 'messaging',
      config: {
        webhookUrl: 'https://hooks.slack.com/services/...',
        channel: '#notifications',
        username: 'Dashboard Bot'
      },
      isActive: true,
      createdAt: new Date('2024-01-10T12:00:00Z')
    },
    {
      id: 'integration-002',
      name: 'Stripe',
      type: 'payment',
      config: {
        publishableKey: 'pk_live_...',
        webhookEndpoint: 'https://dashboard.company.com/webhooks/stripe'
      },
      isActive: true,
      createdAt: new Date('2024-01-05T09:00:00Z')
    }
  ],
  ssoProviders: [
    {
      id: 'sso-001',
      provider: 'google',
      isActive: true,
      config: {
        clientId: '123456789-abc123.apps.googleusercontent.com',
        domain: 'company.com'
      }
    },
    {
      id: 'sso-002',
      provider: 'microsoft',
      isActive: false,
      config: {
        clientId: 'abcd1234-5678-90ef-ghij-klmnopqrstuv',
        tenantId: 'wxyz9876-5432-10ab-cdef-ghijklmnopqr'
      }
    }
  ]
}

export const mockSystemSettings: SystemSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'We are performing scheduled maintenance. Please check back soon.',
  registrationEnabled: true,
  inviteOnly: false,
  emailVerificationRequired: true,
  approvalRequired: false,
  sessionSettings: {
    timeout: 480,
    maxConcurrentSessions: 5,
    rememberMeEnabled: true,
    rememberMeDuration: 30
  },
  backupSettings: {
    enabled: true,
    frequency: 'daily',
    retention: 30,
    includeFiles: true
  },
  logSettings: {
    level: 'info',
    retention: 90,
    includeUserActions: true
  }
}

export const mockSettings: Setting[] = [
  {
    id: 'setting-001',
    key: 'app.theme',
    name: 'Theme',
    description: 'Choose your preferred color scheme',
    category: 'preferences',
    type: 'select',
    value: 'system',
    defaultValue: 'system',
    options: [
      { value: 'light', label: 'Light', icon: '☀️' },
      { value: 'dark', label: 'Dark', icon: '🌙' },
      { value: 'system', label: 'System', icon: '⚙️' }
    ],
    isVisible: true,
    isEditable: true,
    order: 1,
    group: 'appearance'
  },
  {
    id: 'setting-002',
    key: 'app.language',
    name: 'Language',
    description: 'Select your preferred language',
    category: 'preferences',
    type: 'select',
    value: 'en',
    defaultValue: 'en',
    options: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Español' },
      { value: 'fr', label: 'Français' },
      { value: 'de', label: 'Deutsch' }
    ],
    isVisible: true,
    isEditable: true,
    requiresRestart: true,
    order: 2,
    group: 'localization'
  }
]

export const mockSettingsState: SettingsState = {
  profile: mockUserProfile,
  security: mockSecuritySettings,
  notifications: mockNotificationSettings,
  appearance: mockAppearanceSettings,
  preferences: mockPreferencesSettings,
  billing: mockBillingSettings,
  integrations: mockIntegrationSettings,
  system: mockSystemSettings,
  settings: mockSettings
}

export const settingsTabs: SettingsTab[] = [
  {
    id: 'profile',
    name: 'Profile',
    description: 'Manage your personal information and account details',
    icon: '👤',
    order: 1
  },
  {
    id: 'account',
    name: 'Account',
    description: 'Account settings and preferences',
    icon: '⚙️',
    order: 2
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Password, two-factor authentication, and security settings',
    icon: '🔒',
    order: 3
  },
  {
    id: 'notifications',
    name: 'Notifications',
    description: 'Configure how and when you receive notifications',
    icon: '🔔',
    order: 4
  },
  {
    id: 'preferences',
    name: 'Preferences',
    description: 'Customize your experience and interface preferences',
    icon: '🎨',
    order: 5
  },
  {
    id: 'billing',
    name: 'Billing',
    description: 'Manage your subscription, payment methods, and billing',
    icon: '💳',
    order: 6
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'Connect with third-party services and APIs',
    icon: '🔗',
    order: 7
  },
  {
    id: 'system',
    name: 'System',
    description: 'System-wide settings and configuration',
    icon: '🖥️',
    order: 8,
    requiresAdmin: true
  }
]

export const getLanguageOptions = () => [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' }
]

export const getTimezoneOptions = () => [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
]

export const getCurrencyOptions = () => [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'CHF', label: 'Swiss Franc (Fr)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' }
]

export const getDateFormatOptions = () => [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (Readable)' }
]

export const getTimeFormatOptions = () => [
  { value: '12', label: '12-hour (AM/PM)' },
  { value: '24', label: '24-hour' }
]

export const getThemeOptions = () => [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark', label: 'Dark', icon: '🌙' },
  { value: 'system', label: 'System', icon: '⚙️' }
]

export const getFontSizeOptions = () => [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]

export const getNotificationFrequencyOptions = () => [
  { value: 'immediate', label: 'Immediate' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'never', label: 'Never' }
]

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}