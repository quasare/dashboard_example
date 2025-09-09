import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { RevenueManagement } from "@/features/revenue"

export default function RevenuePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <RevenueManagement />
      </div>
    </DashboardLayout>
  )
}