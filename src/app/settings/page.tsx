'use client'

import { DashboardLayout } from "@/features/layout/components/dashboard-layout"
import { SettingsManagement } from "@/features/settings/components/SettingsManagement"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 pt-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and preferences</p>
        </div>
        
        <SettingsManagement />
      </div>
    </DashboardLayout>
  )
}