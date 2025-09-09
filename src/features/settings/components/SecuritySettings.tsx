'use client'

import { useState } from 'react'
import { SecuritySettings as SecuritySettingsType, SettingsValidationError } from '../types'
import { formatDate } from '../utils/mockData'

interface SecuritySettingsProps {
  security: SecuritySettingsType
  onUpdate: (updates: Partial<SecuritySettingsType>) => Promise<boolean>
  loading: boolean
  errors: SettingsValidationError[]
}

export function SecuritySettings({ security, onUpdate, loading, errors }: SecuritySettingsProps) {
  const [formData, setFormData] = useState(security)
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const [newApiKey, setNewApiKey] = useState({ name: '', permissions: [] as string[] })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate(formData)
  }

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message
  }

  const handleAddApiKey = () => {
    if (newApiKey.name.trim()) {
      const apiKey = {
        id: `api-${Date.now()}`,
        name: newApiKey.name,
        key: `pk_${Math.random().toString(36).substr(2, 20)}...`,
        permissions: newApiKey.permissions,
        createdAt: new Date()
      }
      setFormData(prev => ({
        ...prev,
        apiKeys: [...prev.apiKeys, apiKey]
      }))
      setNewApiKey({ name: '', permissions: [] })
      setShowApiKeyForm(false)
    }
  }

  const handleRemoveApiKey = (id: string) => {
    setFormData(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key.id !== id)
    }))
  }

  const toggleApiKeyPermission = (permission: string) => {
    setNewApiKey(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const availablePermissions = [
    'read:users', 'write:users', 'read:reports', 'write:reports', 
    'read:analytics', 'write:analytics', 'read:settings', 'write:settings'
  ]

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Enable 2FA</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={formData.twoFactorEnabled}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    twoFactorEnabled: e.target.checked 
                  }))}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {formData.twoFactorEnabled && (
              <div className="ml-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    2FA Method
                  </label>
                  <select
                    value={formData.twoFactorMethod}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      twoFactorMethod: e.target.value as any 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="2fa_app">Authenticator App</option>
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Session Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="15"
                max="1440"
                value={formData.sessionTimeout}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  sessionTimeout: parseInt(e.target.value) || 480 
                }))}
                className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  getFieldError('sessionTimeout') ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {getFieldError('sessionTimeout') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('sessionTimeout')}</p>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.loginNotifications}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    loginNotifications: e.target.checked 
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Login notifications</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.deviceTracking}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    deviceTracking: e.target.checked 
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Device tracking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Password Policy */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Length
                </label>
                <input
                  type="number"
                  min="8"
                  max="128"
                  value={formData.passwordPolicy.minLength}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      minLength: parseInt(e.target.value) || 8
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password History
                </label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.passwordPolicy.passwordHistory}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      passwordHistory: parseInt(e.target.value) || 0
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Age (days)
                </label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={formData.passwordPolicy.maxAge}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      maxAge: parseInt(e.target.value) || 90
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.passwordPolicy.requireUppercase}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      requireUppercase: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require uppercase letters</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.passwordPolicy.requireLowercase}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      requireLowercase: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require lowercase letters</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.passwordPolicy.requireNumbers}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      requireNumbers: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require numbers</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.passwordPolicy.requireSymbols}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    passwordPolicy: {
                      ...prev.passwordPolicy,
                      requireSymbols: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Require symbols</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Security Settings'}
          </button>
        </div>
      </form>

      {/* API Keys */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
          <button
            onClick={() => setShowApiKeyForm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Create API Key
          </button>
        </div>

        {/* Create API Key Form */}
        {showApiKeyForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Create New API Key</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newApiKey.name}
                  onChange={(e) => setNewApiKey(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="My API Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center text-xs">
                      <input
                        type="checkbox"
                        checked={newApiKey.permissions.includes(permission)}
                        onChange={() => toggleApiKeyPermission(permission)}
                        className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-1">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleAddApiKey}
                  className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowApiKeyForm(false)}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="space-y-3">
          {formData.apiKeys.map(apiKey => (
            <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{apiKey.name}</h4>
                <p className="text-xs text-gray-500 font-mono">{apiKey.key}</p>
                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: {formatDate(apiKey.createdAt)}</span>
                  {apiKey.lastUsed && <span>Last used: {formatDate(apiKey.lastUsed)}</span>}
                  {apiKey.expiresAt && <span>Expires: {formatDate(apiKey.expiresAt)}</span>}
                </div>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-1">
                    {apiKey.permissions.map(permission => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveApiKey(apiKey.id)}
                className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                title="Delete API key"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}

          {formData.apiKeys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <p className="mt-2">No API keys created yet</p>
            </div>
          )}
        </div>
      </div>

      {errors.length > 0 && errors.some(e => e.field === 'general') && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">
            {errors.find(e => e.field === 'general')?.message}
          </p>
        </div>
      )}
    </div>
  )
}