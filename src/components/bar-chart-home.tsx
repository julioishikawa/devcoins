import React from 'react'
import { Bar, BarChart, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from './ui/chart'
import { topCoins } from '@/utils/fetch-coin-details'

export function BarChartComponent({
  data,
  config,
  selectedCoin,
}: BarChartComponentProps) {
  const coinCoe =
    topCoins.find((coin) => coin.name === selectedCoin)?.code || selectedCoin
  const color = config[coinCoe]?.color || '#8884d8'

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
          fill={color}
          name="Fechamento:&nbsp;"
          barSize={30}
          isAnimationActive={true}
        />
      </BarChart>
    </ChartContainer>
  )
}
