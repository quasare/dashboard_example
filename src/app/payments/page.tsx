import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { PaymentManagement } from "@/features/payments"

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <PaymentManagement />
      </div>
    </DashboardLayout>
  )
}