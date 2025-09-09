'use client'

import { UserFilters as UserFiltersType, UserRole, UserStatus } from '../types'

interface UserFiltersProps {
  filters: UserFiltersType
  onFiltersChange: (filters: UserFiltersType) => void
  departments: string[]
  userCount: number
  selectedCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkDelete: () => void
}

export function UserFilters({
  filters,
  onFiltersChange,
  departments,
  userCount,
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkDelete
}: UserFiltersProps) {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search })
  }

  const handleRoleChange = (role: UserRole | undefined) => {
    onFiltersChange({ ...filters, role })
  }

  const handleStatusChange = (status: UserStatus | undefined) => {
    onFiltersChange({ ...filters, status })
  }

  const handleDepartmentChange = (department: string | undefined) => {
    onFiltersChange({ ...filters, department })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      role: undefined,
      status: undefined,
      department: undefined
    })
  }

  const hasActiveFilters = filters.search || filters.role || filters.status || filters.department

  return (
    <div className="space-y-4">
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedCount > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedCount} selected
              </span>
              <button
                onClick={onClearSelection}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={onBulkDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete Selected
              </button>
            </>
          )}
          {selectedCount === 0 && (
            <button
              onClick={onSelectAll}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              Select All ({userCount})
            </button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Role Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Role:</label>
          <select
            value={filters.role || ''}
            onChange={(e) => handleRoleChange(e.target.value as UserRole || undefined)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleStatusChange(e.target.value as UserStatus || undefined)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Department Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Department:</label>
          <select
            value={filters.department || ''}
            onChange={(e) => handleDepartmentChange(e.target.value || undefined)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {userCount} user{userCount !== 1 ? 's' : ''}
        {hasActiveFilters && ' (filtered)'}
      </div>
    </div>
  )
}