import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { OrderManagement } from "@/features/orders"

export default function OrdersPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <OrderManagement />
      </div>
    </DashboardLayout>
  )
}
