import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { TransactionManagement } from "@/features/transactions"

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <TransactionManagement />
      </div>
    </DashboardLayout>
  )
}