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
import { topCoins } from '@/utils/fetch-coin-details'

export function LineChartComponent({
  data,
  config,
  selectedCoin,
}: DailyLineChartComponentProps) {
  const coinCode =
    topCoins.find((coin) => coin.name === selectedCoin)?.code || selectedCoin
  const color = config[coinCode]?.color || '#8884d8'

  return (
    <ChartContainer config={config} className="w-full h-[500px]">
      <ResponsiveContainer width="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['auto', 'auto']} padding={{ top: 50, bottom: 50 }} />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend content={<ChartLegendContent />} />
          <Line
            type="linear"
            dataKey="value"
            name="Valor de Fechamento:&nbsp;"
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
