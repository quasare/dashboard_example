'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { useWebSocket } from '@/hooks/use-websocket'
import { Wifi, WifiOff } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense' | 'transfer'
  method: string
  amount: number
  currency: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    avatarUrl?: string
  }
}

export function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  
  const { isConnected, on } = useWebSocket({
    namespace: 'transactions',
    onConnect: () => console.log('Connected to transactions WebSocket'),
    onDisconnect: () => console.log('Disconnected from transactions WebSocket')
  })

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions/latest?limit=10')
        setTransactions(response.data)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const handleNewTransaction = useCallback((newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev.slice(0, 9)])
  }, [])

  useEffect(() => {
    if (!on) return
    
    const unsubscribe = on('newTransaction', handleNewTransaction)
    return unsubscribe
  }, [on, handleNewTransaction])

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'bg-green-100 text-green-800'
      case 'expense':
        return 'bg-red-100 text-red-800'
      case 'transfer':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'paypal':
        return '💳'
      case 'wallet':
        return '💰'
      case 'transfer':
        return '🏦'
      case 'cash':
        return '💵'
      default:
        return '💳'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest transactions from all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest transactions from all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest transactions from all users</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-600">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Offline</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={transaction.user.avatarUrl} alt={transaction.user.name} />
                  <AvatarFallback>
                    {transaction.user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium leading-none">
                      {transaction.user.name}
                    </p>
                    <Badge variant="secondary" className={getTransactionTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs">{getMethodIcon(transaction.method)}</span>
                    <p className="text-xs text-muted-foreground">
                      {transaction.method} • {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 
                  transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline">
            View all transactions
          </button>
        </div>
      </CardContent>
    </Card>
  )
}