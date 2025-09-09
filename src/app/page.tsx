import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { Suspense } from 'react'
import { KPICards } from '@/features/dashboard/components/kpi-cards'
import { RevenueChart } from '@/features/dashboard/components/revenue-chart'
import { TransactionsTable } from '@/features/dashboard/components/transactions-table'
import { ProductsStats } from '@/features/dashboard/components/products-stats'

// Loading components
function KPICardsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      ))}
    </div>
  )
}

function ChartLoading() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        {/* KPI Overview with Suspense */}
        <Suspense fallback={<KPICardsLoading />}>
          <KPICards />
        </Suspense>
        
        {/* Main dashboard content with Suspense */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Suspense fallback={<ChartLoading />}>
            <RevenueChart />
          </Suspense>
          <Suspense fallback={<ChartLoading />}>
            <TransactionsTable />
          </Suspense>
        </div>
        
        {/* Product statistics with Suspense */}
        <Suspense fallback={<ChartLoading />}>
          <ProductsStats />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}
