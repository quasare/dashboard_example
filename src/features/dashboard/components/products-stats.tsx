'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { Package, TrendingUp, AlertTriangle } from 'lucide-react'

interface ProductCategory {
  category: string
  totalProducts: number
  totalStock: number
  totalValue: number
  avgPrice: number
}

interface ProductStats {
  categories: ProductCategory[]
  totalProducts: number
  totalValue: number
  lowStockProducts: number
}

export function ProductsStats() {
  const [productStats, setProductStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProductStats = async () => {
      try {
        const response = await api.get('/products/stats')
        setProductStats(response.data)
      } catch (error) {
        console.error('Failed to fetch product stats:', error)
        // Fallback data for development
        const fallbackData: ProductStats = {
          categories: [
            { category: 'Electronics', totalProducts: 3, totalStock: 255, totalValue: 4449.97, avgPrice: 1483.32 },
            { category: 'Office', totalProducts: 2, totalStock: 65, totalValue: 799.98, avgPrice: 399.99 },
            { category: 'Accessories', totalProducts: 2, totalStock: 275, totalValue: 229.98, avgPrice: 114.99 }
          ],
          totalProducts: 7,
          totalValue: 5479.93,
          lowStockProducts: 1
        }
        setProductStats(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchProductStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!productStats) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">Failed to load product statistics</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Categories
          </CardTitle>
          <CardDescription>Breakdown by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productStats.categories.map((category) => (
              <div key={category.category} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{category.category}</div>
                  <div className="text-sm text-muted-foreground">
                    {category.totalProducts} products • {category.totalStock} in stock
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(category.totalValue)}</div>
                  <div className="text-sm text-muted-foreground">
                    Avg: {formatCurrency(category.avgPrice)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
          <CardDescription>Stock levels and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Total Products</div>
                <div className="text-2xl font-bold">{productStats.totalProducts}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium">Total Value</div>
                <div className="text-2xl font-bold">{formatCurrency(productStats.totalValue)}</div>
              </div>
            </div>

            {productStats.lowStockProducts > 0 && (
              <div className="flex items-center space-x-4 p-3 border rounded-lg border-yellow-200 bg-yellow-50">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-yellow-800">Low Stock Alert</div>
                  <div className="text-lg font-bold text-yellow-800">
                    {productStats.lowStockProducts} product{productStats.lowStockProducts !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <button className="w-full text-sm text-blue-600 hover:text-blue-800 hover:underline">
                View inventory details
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}