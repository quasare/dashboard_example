import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { UserManagement } from "@/features/users"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <UserManagement />
      </div>
    </DashboardLayout>
  )
}
