'use client'

import { useState, useEffect, useCallback } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { BarChartComponent } from './bar-chart-home'
import { LineChartComponent } from './line-chart-home'
import { fetchDailyData } from '@/utils/fetch-daily-data'
import { topCoins, config } from '@/utils/fetch-coin-details'
import CurrencySelect from './currency-select'

export function CoinChart() {
  const [dailyData, setDailyData] = useState<ChartData[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>(topCoins[0].code) // Usando o símbolo da primeira moeda como padrão
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL')
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

  const handleCoinChange = useCallback(
    async (coin: string) => {
      setSelectedCoin(coin)
      const daily = await fetchDailyData(coin, selectedCurrency)
      setDailyData(daily)
    },
    [selectedCurrency]
  )

  useEffect(() => {
    async function loadInitialData() {
      const daily = await fetchDailyData(selectedCoin, selectedCurrency)
      setDailyData(daily)
    }

    loadInitialData()
  }, [selectedCoin, selectedCurrency])

  return (
    <div className="space-y-4">
      <h1>Cryptomoedas nos últimos 7 dias</h1>

      <div className="inline-flex gap-4 h-10 rounded-md">
        <Select onValueChange={handleCoinChange} value={selectedCoin}>
          <SelectTrigger className="bg-zinc-800 border-none">
            <SelectValue placeholder="Selecione uma moeda" />
          </SelectTrigger>
          <SelectContent>
            {topCoins.map((coin) => (
              <SelectItem key={coin.code} value={coin.code}>
                {coin.name} ({coin.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <CurrencySelect
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />

        <Select
          onValueChange={(value) => setChartType(value as 'bar' | 'line')}
          value={chartType}
        >
          <SelectTrigger className="bg-zinc-800 border-none">
            <SelectValue placeholder="Selecione o gráfico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bar">Gráfico de barras</SelectItem>
            <SelectItem value="line">Gráfico de linhas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {chartType === 'bar' ? (
        <BarChartComponent
          data={dailyData}
          config={config}
          selectedCoin={selectedCoin}
        />
      ) : (
        <LineChartComponent
          data={dailyData}
          config={config}
          selectedCoin={selectedCoin}
        />
      )}
    </div>
  )
}
