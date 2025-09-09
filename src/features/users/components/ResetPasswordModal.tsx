'use client'

import { useState } from 'react'
import { User, ResetPasswordData } from '../types'

interface ResetPasswordModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onResetPassword: (userId: string, newPassword: string, sendEmail: boolean) => Promise<void>
}

export function ResetPasswordModal({ user, isOpen, onClose, onResetPassword }: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [generateRandom, setGenerateRandom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  if (!isOpen || !user) return null

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const password = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setNewPassword(password)
    setConfirmPassword(password)
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []
    
    if (!generateRandom) {
      if (newPassword.length < 8) {
        newErrors.push('Password must be at least 8 characters long')
      }
      if (newPassword !== confirmPassword) {
        newErrors.push('Passwords do not match')
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        newErrors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      }
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let finalPassword = newPassword
    if (generateRandom) {
      generateRandomPassword()
      finalPassword = newPassword
    }
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      await onResetPassword(user.id, finalPassword, sendEmail)
      onClose()
      resetForm()
    } catch (error) {
      setErrors(['Failed to reset password. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNewPassword('')
    setConfirmPassword('')
    setSendEmail(true)
    setGenerateRandom(false)
    setErrors([])
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="generateRandom"
              checked={generateRandom}
              onChange={(e) => {
                setGenerateRandom(e.target.checked)
                if (e.target.checked) {
                  generateRandomPassword()
                } else {
                  setNewPassword('')
                  setConfirmPassword('')
                }
              }}
              className="rounded border-gray-300"
            />
            <label htmlFor="generateRandom" className="text-sm text-gray-700">
              Generate random password
            </label>
          </div>

          {!generateRandom && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </>
          )}

          {generateRandom && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generated Password
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newPassword}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={generateRandomPassword}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sendEmail"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="sendEmail" className="text-sm text-gray-700">
              Send password reset email to user
            </label>
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}