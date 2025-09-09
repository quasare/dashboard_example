'use client'

import { useState, useMemo } from 'react'
import { User, UserFilters, UserRole, UserStatus } from '../types'
import { mockUsers } from '../utils/mockData'

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: undefined,
    status: undefined,
    department: undefined
  })
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                          user.department?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesRole = !filters.role || user.role === filters.role
      const matchesStatus = !filters.status || user.status === filters.status
      const matchesDepartment = !filters.department || user.department === filters.department

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })
  }, [users, filters])

  const departments = useMemo(() => {
    return Array.from(new Set(users.map(user => user.department).filter((dept): dept is string => Boolean(dept))))
  }, [users])

  const resetPassword = (userId: string, newPassword: string, sendEmail: boolean) => {
    console.log(`Reset password for user ${userId}:`, { newPassword, sendEmail })
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        alert(`Password reset ${sendEmail ? 'sent via email' : 'updated'} for user ${userId}`)
        resolve()
      }, 1000)
    })
  }

  const changeRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ))
  }

  const changeStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
  }

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId))
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(filteredUsers.map(user => user.id))
  }

  const clearSelection = () => {
    setSelectedUsers([])
  }

  const bulkDeleteUsers = () => {
    if (selectedUsers.length === 0) return
    
    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)))
      clearSelection()
    }
  }

  return {
    users: filteredUsers,
    allUsers: users,
    filters,
    setFilters,
    selectedUsers,
    departments,
    actions: {
      resetPassword,
      changeRole,
      changeStatus,
      deleteUser,
      toggleUserSelection,
      selectAllUsers,
      clearSelection,
      bulkDeleteUsers
    }
  }
}