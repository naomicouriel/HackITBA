"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DataPoint {
  name: string
  value: number
}

interface LineChartProps {
  data: DataPoint[]
  yAxisLabel?: string
  xAxisLabel?: string
  color?: string
}

export function LineChart({ data, yAxisLabel, xAxisLabel, color = "hsl(221, 83%, 53%)" }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          fontSize={12} 
          tickMargin={10}
          label={{ value: xAxisLabel, position: 'bottom', offset: 0 }}
          stroke="currentColor"
        />
        <YAxis 
          fontSize={12} 
          domain={[0, 100]}
          label={{ value: yAxisLabel, angle: -90, position: 'left', offset: 0 }}
          stroke="currentColor"
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '6px'
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={{ r: 4, fill: color }}
          activeDot={{ r: 6, fill: color }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

