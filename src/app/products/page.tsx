import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { ProductManagement } from "@/features/products"

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <ProductManagement />
      </div>
    </DashboardLayout>
  )
}