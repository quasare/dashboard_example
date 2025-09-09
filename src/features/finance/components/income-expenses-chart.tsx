"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useState } from "react"

interface FinanceChartProps {
  data?: Array<{
    month: string
    income: number
    expenses: number
    profit: number
  }>
}

const defaultData = [
  { month: 'Jan', income: 45000, expenses: 25000, profit: 20000 },
  { month: 'Feb', income: 52000, expenses: 30000, profit: 22000 },
  { month: 'Mar', income: 48000, expenses: 28000, profit: 20000 },
  { month: 'Apr', income: 61000, expenses: 35000, profit: 26000 },
  { month: 'May', income: 55000, expenses: 32000, profit: 23000 },
  { month: 'Jun', income: 67000, expenses: 38000, profit: 29000 },
]

const tabs = [
  { key: 'income', label: 'Income', color: '#3b82f6' },
  { key: 'expenses', label: 'Expenses', color: '#ef4444' },
  { key: 'profit', label: 'Profit', color: '#10b981' },
]

export function IncomeExpensesChart({ data = defaultData }: FinanceChartProps) {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses' | 'profit'>('income')
  
  const currentData = data[data.length - 1] || data[0]
  const total = currentData[activeTab]
  const growth = activeTab === 'income' ? 42.9 : activeTab === 'expenses' ? -12.4 : 68.2

  return (
    <Card>
      <CardHeader>
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "flex-1 text-xs",
                activeTab === tab.key && "bg-white shadow-sm"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">Total {tabs.find(t => t.key === activeTab)?.label}</div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">${total?.toLocaleString() || '0'}</span>
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded",
              growth > 0 ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            )}>
              {growth > 0 ? '↗' : '↘'} {Math.abs(growth)}%
            </span>
          </div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey={activeTab}
                stroke={tabs.find(t => t.key === activeTab)?.color}
                fill={tabs.find(t => t.key === activeTab)?.color}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
