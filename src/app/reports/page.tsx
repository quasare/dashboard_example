import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { ReportManagement } from "@/features/reports"

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <ReportManagement />
      </div>
    </DashboardLayout>
  )
}