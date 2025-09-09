'use client'

import { useState, useCallback } from 'react'
import { SettingsState, SettingCategory, SettingsUpdate, SettingsValidationError } from '../types'
import { mockSettingsState } from '../utils/mockData'

interface UseSettingsReturn {
  settings: SettingsState
  loading: boolean
  errors: SettingsValidationError[]
  actions: {
    updateSettings: (update: SettingsUpdate) => Promise<boolean>
    updateProfile: (updates: Partial<SettingsState['profile']>) => Promise<boolean>
    updateSecurity: (updates: Partial<SettingsState['security']>) => Promise<boolean>
    updateNotifications: (updates: Partial<SettingsState['notifications']>) => Promise<boolean>
    updateAppearance: (updates: Partial<SettingsState['appearance']>) => Promise<boolean>
    updatePreferences: (updates: Partial<SettingsState['preferences']>) => Promise<boolean>
    updateBilling: (updates: Partial<SettingsState['billing']>) => Promise<boolean>
    updateIntegrations: (updates: Partial<SettingsState['integrations']>) => Promise<boolean>
    updateSystem: (updates: Partial<SettingsState['system']>) => Promise<boolean>
    resetToDefaults: (category: SettingCategory) => Promise<boolean>
    exportSettings: () => void
    importSettings: (settingsData: Partial<SettingsState>) => Promise<boolean>
    validateSettings: (category: SettingCategory, data: any) => SettingsValidationError[]
  }
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<SettingsState>(mockSettingsState)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<SettingsValidationError[]>([])

  const validateSettings = useCallback((category: SettingCategory, data: any): SettingsValidationError[] => {
    const validationErrors: SettingsValidationError[] = []

    switch (category) {
      case 'profile':
        if (!data.firstName?.trim()) {
          validationErrors.push({ field: 'firstName', message: 'First name is required' })
        }
        if (!data.lastName?.trim()) {
          validationErrors.push({ field: 'lastName', message: 'Last name is required' })
        }
        if (!data.email?.trim()) {
          validationErrors.push({ field: 'email', message: 'Email is required' })
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
          validationErrors.push({ field: 'email', message: 'Invalid email format' })
        }
        if (data.phone && !/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
          validationErrors.push({ field: 'phone', message: 'Invalid phone number format' })
        }
        break

      case 'security':
        if (data.passwordPolicy) {
          if (data.passwordPolicy.minLength < 8) {
            validationErrors.push({ field: 'passwordPolicy.minLength', message: 'Minimum length must be at least 8' })
          }
          if (data.passwordPolicy.maxAge < 30) {
            validationErrors.push({ field: 'passwordPolicy.maxAge', message: 'Maximum age must be at least 30 days' })
          }
        }
        if (data.sessionTimeout && data.sessionTimeout < 15) {
          validationErrors.push({ field: 'sessionTimeout', message: 'Session timeout must be at least 15 minutes' })
        }
        break

      case 'billing':
        if (data.billingAddress) {
          if (!data.billingAddress.name?.trim()) {
            validationErrors.push({ field: 'billingAddress.name', message: 'Name is required' })
          }
          if (!data.billingAddress.address1?.trim()) {
            validationErrors.push({ field: 'billingAddress.address1', message: 'Address is required' })
          }
          if (!data.billingAddress.city?.trim()) {
            validationErrors.push({ field: 'billingAddress.city', message: 'City is required' })
          }
          if (!data.billingAddress.postalCode?.trim()) {
            validationErrors.push({ field: 'billingAddress.postalCode', message: 'Postal code is required' })
          }
        }
        break

      case 'integrations':
        if (data.webhooks) {
          data.webhooks.forEach((webhook: any, index: number) => {
            if (!webhook.name?.trim()) {
              validationErrors.push({ field: `webhooks.${index}.name`, message: 'Webhook name is required' })
            }
            if (!webhook.url?.trim()) {
              validationErrors.push({ field: `webhooks.${index}.url`, message: 'Webhook URL is required' })
            } else if (!/^https?:\/\/.+/.test(webhook.url)) {
              validationErrors.push({ field: `webhooks.${index}.url`, message: 'Invalid URL format' })
            }
          })
        }
        break
    }

    return validationErrors
  }, [])

  const updateSettings = useCallback(async (update: SettingsUpdate): Promise<boolean> => {
    setLoading(true)
    setErrors([])

    try {
      // Validate the updates
      const validationErrors = validateSettings(update.category, update.updates)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        return false
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update settings
      setSettings(prev => ({
        ...prev,
        [update.category]: {
          ...prev[update.category as keyof SettingsState],
          ...update.updates
        }
      }))

      setLoading(false)
      return true
    } catch (error) {
      setErrors([{ field: 'general', message: 'Failed to update settings' }])
      setLoading(false)
      return false
    }
  }, [validateSettings])

  const updateProfile = useCallback(async (updates: Partial<SettingsState['profile']>): Promise<boolean> => {
    return updateSettings({ category: 'profile', updates })
  }, [updateSettings])

  const updateSecurity = useCallback(async (updates: Partial<SettingsState['security']>): Promise<boolean> => {
    return updateSettings({ category: 'security', updates })
  }, [updateSettings])

  const updateNotifications = useCallback(async (updates: Partial<SettingsState['notifications']>): Promise<boolean> => {
    return updateSettings({ category: 'notifications', updates })
  }, [updateSettings])

  const updateAppearance = useCallback(async (updates: Partial<SettingsState['appearance']>): Promise<boolean> => {
    return updateSettings({ category: 'preferences', updates })
  }, [updateSettings])

  const updatePreferences = useCallback(async (updates: Partial<SettingsState['preferences']>): Promise<boolean> => {
    return updateSettings({ category: 'preferences', updates })
  }, [updateSettings])

  const updateBilling = useCallback(async (updates: Partial<SettingsState['billing']>): Promise<boolean> => {
    return updateSettings({ category: 'billing', updates })
  }, [updateSettings])

  const updateIntegrations = useCallback(async (updates: Partial<SettingsState['integrations']>): Promise<boolean> => {
    return updateSettings({ category: 'integrations', updates })
  }, [updateSettings])

  const updateSystem = useCallback(async (updates: Partial<SettingsState['system']>): Promise<boolean> => {
    return updateSettings({ category: 'system', updates })
  }, [updateSettings])

  const resetToDefaults = useCallback(async (category: SettingCategory): Promise<boolean> => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Reset to defaults
      const defaults = mockSettingsState[category as keyof SettingsState]
      setSettings(prev => ({
        ...prev,
        [category]: defaults
      }))

      setLoading(false)
      return true
    } catch (error) {
      setErrors([{ field: 'general', message: 'Failed to reset settings' }])
      setLoading(false)
      return false
    }
  }, [])

  const exportSettings = useCallback(() => {
    const settingsData = JSON.stringify(settings, null, 2)
    const blob = new Blob([settingsData], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `settings_export_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }, [settings])

  const importSettings = useCallback(async (settingsData: Partial<SettingsState>): Promise<boolean> => {
    setLoading(true)
    setErrors([])

    try {
      // Validate imported settings
      const allErrors: SettingsValidationError[] = []
      Object.keys(settingsData).forEach(category => {
        if (settingsData[category as keyof SettingsState]) {
          const categoryErrors = validateSettings(
            category as SettingCategory, 
            settingsData[category as keyof SettingsState]
          )
          allErrors.push(...categoryErrors)
        }
      })

      if (allErrors.length > 0) {
        setErrors(allErrors)
        setLoading(false)
        return false
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Import settings
      setSettings(prev => ({
        ...prev,
        ...settingsData
      }))

      setLoading(false)
      return true
    } catch (error) {
      setErrors([{ field: 'general', message: 'Failed to import settings' }])
      setLoading(false)
      return false
    }
  }, [validateSettings])

  return {
    settings,
    loading,
    errors,
    actions: {
      updateSettings,
      updateProfile,
      updateSecurity,
      updateNotifications,
      updateAppearance,
      updatePreferences,
      updateBilling,
      updateIntegrations,
      updateSystem,
      resetToDefaults,
      exportSettings,
      importSettings,
      validateSettings
    }
  }
}