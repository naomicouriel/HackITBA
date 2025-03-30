"use client"

import { ComponentType } from "react"

interface ChartWrapperProps {
  content: ComponentType<any>
  props?: any
}

export function ChartWrapper({ content: Chart, props }: ChartWrapperProps) {
  return <Chart {...props} />
}

