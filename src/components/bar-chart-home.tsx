import React from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from './ui/chart'

interface BarChartData {
  date: string
  value: number
  minValue: number
}

interface BarChartComponentProps {
  data: BarChartData[]
  config: Record<string, { color: string }>
  selectedCoin: string
}

export function BarChartComponent({
  data,
  config,
  selectedCoin,
}: BarChartComponentProps) {
  const fillColor = config[selectedCoin]?.color || '#8884d8'

  return (
    <ChartContainer config={config} className="w-full h-[500px]">
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} padding={{ top: 50, bottom: 0 }} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend content={<ChartLegendContent />} />
        <Bar
          dataKey="minValue"
          fill="#e42f5a"
          name="Menor valor:"
          barSize={20}
          isAnimationActive={true}
        />
        <Bar
          dataKey="value"
          fill={fillColor}
          name="Fechamento:&nbsp;"
          barSize={30}
          isAnimationActive={true}
        />
      </BarChart>
    </ChartContainer>
  )
}
