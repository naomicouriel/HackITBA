"use client"

import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts"

interface DataPoint {
  name: string
  value: number
  color?: string
}

interface PieChartProps {
  data: DataPoint[]
}

const defaultColors = [
  "hsl(221, 83%, 53%)",  // Vibrant blue
  "hsl(250, 83%, 53%)",  // Vibrant violet
  "hsl(280, 83%, 53%)",  // Bright purple
  "hsl(310, 83%, 53%)",  // Bright magenta
  "hsl(340, 83%, 53%)"   // Bright pink
]

export function PieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || defaultColors[index % defaultColors.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            borderRadius: '6px'
          }}
        />
        <Legend 
          formatter={(value, entry: any) => (
            <span style={{ color: 'currentColor' }}>{value}</span>
          )}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

