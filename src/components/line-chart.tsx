import React from 'react'
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from './ui/chart'

interface HourlyData {
  time: string
  value: number
}

interface LineChartComponentProps {
  data: HourlyData[]
  config: Record<string, { color: string }>
  selectedCoin: string
}

export function LineChartComponent({
  data,
  config,
  selectedCoin,
}: LineChartComponentProps) {
  const color = config[selectedCoin]?.color || '#8884d8'

  return (
    <ChartContainer config={config} className="w-full h-[500px] mt-8">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          <Line
            type="linear"
            dataKey="value"
            name="Valor:&nbsp;"
            stroke={color}
            strokeWidth={3}
            dot={{ stroke: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
