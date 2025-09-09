'use client'

import { TimeSeriesData, RevenueForecast } from '../types'
import { formatCurrency } from '../utils/mockData'

interface RevenueChartProps {
  data: TimeSeriesData[]
  forecast?: RevenueForecast[]
  title: string
  showForecast?: boolean
  height?: number
}

export function RevenueChart({ 
  data, 
  forecast = [], 
  title, 
  showForecast = false, 
  height = 300 
}: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available
        </div>
      </div>
    )
  }

  const maxValue = Math.max(
    ...data.map(d => d.value),
    ...(showForecast ? forecast.map(f => f.confidence.high) : [])
  )
  const minValue = Math.min(
    ...data.map(d => d.value),
    ...(showForecast ? forecast.map(f => f.confidence.low) : [])
  )

  const chartHeight = height - 80 // Account for padding and labels
  const chartWidth = 600 // Fixed width for simplicity

  const getX = (index: number, total: number) => {
    return (index / (total - 1)) * (chartWidth - 60) + 30
  }

  const getY = (value: number) => {
    return chartHeight - ((value - minValue) / (maxValue - minValue)) * (chartHeight - 40) + 20
  }

  // Create SVG path for the main revenue line
  const createPath = (points: { x: number, y: number }[]) => {
    if (points.length === 0) return ''
    
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }
    return path
  }

  const historicalPoints = data.map((item, index) => ({
    x: getX(index, data.length + (showForecast ? forecast.length : 0)),
    y: getY(item.value)
  }))

  const forecastPoints = showForecast ? forecast.map((item, index) => ({
    x: getX(data.length + index, data.length + forecast.length),
    y: getY(item.predicted)
  })) : []

  const allLabels = [
    ...data.map(d => d.label),
    ...(showForecast ? forecast.map(f => f.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })) : [])
  ]

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {showForecast && (
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Historical</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-dashed border-green-500 rounded-full"></div>
              <span className="text-gray-600">Forecast</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <g key={ratio}>
              <line
                x1={30}
                y1={20 + ratio * (chartHeight - 40)}
                x2={chartWidth - 30}
                y2={20 + ratio * (chartHeight - 40)}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={20}
                y={25 + ratio * (chartHeight - 40)}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
              >
                {formatCurrency(minValue + (1 - ratio) * (maxValue - minValue)).replace('.00', '')}
              </text>
            </g>
          ))}

          {/* Historical data line */}
          {historicalPoints.length > 0 && (
            <>
              <path
                d={createPath(historicalPoints)}
                fill="none"
                stroke="#3b82f6"
                strokeWidth={2}
                className="drop-shadow-sm"
              />
              {historicalPoints.map((point, index) => (
                <circle
                  key={`historical-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill="#3b82f6"
                  className="hover:r-6 cursor-pointer transition-all"
                >
                  <title>{`${data[index].label}: ${formatCurrency(data[index].value)}`}</title>
                </circle>
              ))}
            </>
          )}

          {/* Forecast data line */}
          {showForecast && forecastPoints.length > 0 && (
            <>
              {/* Confidence interval */}
              <path
                d={`M ${historicalPoints[historicalPoints.length - 1]?.x || 0} ${historicalPoints[historicalPoints.length - 1]?.y || 0} ${createPath(forecastPoints).substring(1)}`}
                fill="none"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="5,5"
                className="drop-shadow-sm"
              />
              
              {forecastPoints.map((point, index) => (
                <g key={`forecast-${index}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth={2}
                    className="hover:r-6 cursor-pointer transition-all"
                  >
                    <title>
                      {`${forecast[index].date.toLocaleDateString()}: ${formatCurrency(forecast[index].predicted)} (${formatCurrency(forecast[index].confidence.low)} - ${formatCurrency(forecast[index].confidence.high)})`}
                    </title>
                  </circle>
                  
                  {/* Confidence interval bars */}
                  <line
                    x1={point.x}
                    y1={getY(forecast[index].confidence.low)}
                    x2={point.x}
                    y2={getY(forecast[index].confidence.high)}
                    stroke="#10b981"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                </g>
              ))}
            </>
          )}

          {/* X-axis labels */}
          {allLabels.map((label, index) => {
            const x = getX(index, allLabels.length)
            const shouldShow = index % Math.ceil(allLabels.length / 8) === 0 || index === allLabels.length - 1
            
            if (!shouldShow) return null
            
            return (
              <text
                key={`label-${index}`}
                x={x}
                y={height - 10}
                fontSize="12"
                fill="#6b7280"
                textAnchor="middle"
                transform={`rotate(-45 ${x} ${height - 10})`}
              >
                {label}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Current</div>
            <div className="font-medium text-gray-900">
              {formatCurrency(data[data.length - 1]?.value || 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Previous</div>
            <div className="font-medium text-gray-900">
              {formatCurrency(data[data.length - 2]?.value || 0)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Peak</div>
            <div className="font-medium text-gray-900">
              {formatCurrency(maxValue)}
            </div>
          </div>
          <div>
            <div className="text-gray-500">Growth</div>
            <div className={`font-medium ${
              (data[data.length - 1]?.value || 0) > (data[data.length - 2]?.value || 0)
                ? 'text-green-600'
                : 'text-red-600'
            }`}>
              {data.length > 1 && (
                ((data[data.length - 1].value - data[data.length - 2].value) / data[data.length - 2].value * 100).toFixed(1)
              )}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}