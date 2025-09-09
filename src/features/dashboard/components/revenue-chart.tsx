'use client'

import { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface RevenueData {
  month: string
  currentYear: number
  previousYear: number
}

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await api.get('/reports/dashboard-summary')
        const { revenueComparison } = response.data
        
        // Transform data for chart
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
        
        const chartData = months.map((month, index) => ({
          month,
          currentYear: revenueComparison?.currentYear?.[index] || 0,
          previousYear: revenueComparison?.previousYear?.[index] || 0,
        }))
        
        setRevenueData(chartData)
      } catch (error) {
        console.error('Failed to fetch revenue data:', error)
        // Fallback data for development
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
        const fallbackData = months.map(month => ({
          month,
          currentYear: Math.floor(Math.random() * 60000) + 30000,
          previousYear: Math.floor(Math.random() * 40000) + 20000,
        }))
        setRevenueData(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  const chartData = {
    labels: revenueData.map(data => data.month),
    datasets: [
      {
        label: '2024 Revenue',
        data: revenueData.map(data => data.currentYear),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2,
        fill: chartType === 'line',
      },
      {
        label: '2023 Revenue',
        data: revenueData.map(data => data.previousYear),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        borderWidth: 2,
        fill: chartType === 'line',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + (value / 1000).toFixed(0) + 'K'
          },
        },
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ChartComponent = chartType === 'line' ? Line : Bar

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue comparison</CardDescription>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'line'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1 text-sm rounded ${
              chartType === 'bar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bar
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ChartComponent data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}