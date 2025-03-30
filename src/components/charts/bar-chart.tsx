"use client"

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface DataPoint {
  name: string
  value: number
}

interface BarChartProps {
  data: DataPoint[]
  yAxisLabel?: string
  xAxisLabel?: string
  color?: string
}

export function BarChart({ data, yAxisLabel, xAxisLabel, color = "hsl(221, 83%, 53%)" }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

