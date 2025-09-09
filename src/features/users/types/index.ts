export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  lastActive: string
  joinedAt: string
  avatarUrl?: string
  department?: string
  phone?: string
}

export type UserRole = 'admin' | 'manager' | 'user' | 'guest'

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface UserFilters {
  search: string
  role?: UserRole
  status?: UserStatus
  department?: string
}

export interface UserActions {
  onResetPassword: (userId: string) => void
  onChangeRole: (userId: string, role: UserRole) => void
  onChangeStatus: (userId: string, status: UserStatus) => void
  onDeleteUser: (userId: string) => void
}

export interface ResetPasswordData {
  userId: string
  newPassword: string
  sendEmail: boolean
}