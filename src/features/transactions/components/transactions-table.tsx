"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Transaction {
  id: number
  type: string
  method: string
  amount: number
  user: {
    name: string
    email: string
  }
  createdAt: string
}

interface TransactionsTableProps {
  transactions?: Transaction[]
  isLoading?: boolean
}

const defaultTransactions: Transaction[] = [
  {
    id: 1,
    type: 'income',
    method: 'paypal',
    amount: 82.6,
    user: { name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'expense',
    method: 'wallet',
    amount: 270.69,
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    type: 'income',
    method: 'transfer',
    amount: 637.91,
    user: { name: 'Bob Johnson', email: 'bob@example.com' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

const methodIcons = {
  paypal: '💰',
  wallet: '💚',
  transfer: '💙',
  credit_card: '💳',
}

export function TransactionsTable({ 
  transactions = defaultTransactions, 
  isLoading = false 
}: TransactionsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg">
                    {methodIcons[transaction.method as keyof typeof methodIcons] || '💰'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-sm capitalize">
                    {transaction.method.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    Send money
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
                <div className="text-xs text-gray-500">USD</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
