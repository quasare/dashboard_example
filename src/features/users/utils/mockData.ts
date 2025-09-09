import { User, UserRole, UserStatus } from '../types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Administrator',
    email: 'john.admin@company.com',
    role: 'admin',
    status: 'active',
    lastActive: '2025-09-04T10:30:00Z',
    joinedAt: '2024-01-15T09:00:00Z',
    department: 'IT',
    phone: '+1 (555) 123-4567',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah.manager@company.com',
    role: 'manager',
    status: 'active',
    lastActive: '2025-09-04T09:15:00Z',
    joinedAt: '2024-02-20T10:30:00Z',
    department: 'Sales',
    phone: '+1 (555) 234-5678',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Mike Developer',
    email: 'mike.dev@company.com',
    role: 'user',
    status: 'active',
    lastActive: '2025-09-04T08:45:00Z',
    joinedAt: '2024-03-10T11:15:00Z',
    department: 'Development',
    phone: '+1 (555) 345-6789'
  },
  {
    id: '4',
    name: 'Lisa Designer',
    email: 'lisa.design@company.com',
    role: 'user',
    status: 'active',
    lastActive: '2025-09-03T16:20:00Z',
    joinedAt: '2024-04-05T14:00:00Z',
    department: 'Design',
    phone: '+1 (555) 456-7890',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '5',
    name: 'Tom Support',
    email: 'tom.support@company.com',
    role: 'user',
    status: 'inactive',
    lastActive: '2025-09-02T17:30:00Z',
    joinedAt: '2024-05-12T13:45:00Z',
    department: 'Support',
    phone: '+1 (555) 567-8901'
  },
  {
    id: '6',
    name: 'Emma Guest',
    email: 'emma.guest@external.com',
    role: 'guest',
    status: 'active',
    lastActive: '2025-09-04T07:10:00Z',
    joinedAt: '2025-08-20T12:00:00Z',
    department: 'External',
    phone: '+1 (555) 678-9012',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '7',
    name: 'David Suspended',
    email: 'david.old@company.com',
    role: 'user',
    status: 'suspended',
    lastActive: '2025-08-28T14:20:00Z',
    joinedAt: '2024-01-05T08:30:00Z',
    department: 'Marketing',
    phone: '+1 (555) 789-0123'
  },
  {
    id: '8',
    name: 'Anna Pending',
    email: 'anna.new@company.com',
    role: 'user',
    status: 'pending',
    lastActive: '2025-09-04T06:00:00Z',
    joinedAt: '2025-09-01T09:15:00Z',
    department: 'HR',
    phone: '+1 (555) 890-1234'
  }
]

export const getRoleColor = (role: UserRole): string => {
  const colors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    guest: 'bg-gray-100 text-gray-800'
  }
  return colors[role]
}

export const getStatusColor = (status: UserStatus): string => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    pending: 'bg-blue-100 text-blue-800'
  }
  return colors[status]
}

export const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString()
}