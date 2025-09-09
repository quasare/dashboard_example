"use client"

import { Card, CardContent } from "@/components/ui/card"
import { X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotificationCard() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 mt-0.5 text-green-300" />
            <div>
              <h3 className="font-medium">Welcome to your Dashboard! 🎉</h3>
              <p className="text-sm text-blue-100 mt-1">
                Your backend is running with enhanced APIs, WebSocket connections, 
                and comprehensive data. Ready to explore your business insights?
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-blue-200">
                <span>✅ 5 Users</span>
                <span>✅ 50 Orders</span>
                <span>✅ $721K Revenue</span>
                <span>✅ 60.39% Growth</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
