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

import { api } from '@/lib/axios'
import {
  fetchConversionRate,
  supportedCurrencies,
} from '@/utils/currency-refactor'

interface ChartData {
  date: string
  value: number
  minValue: number
}

interface ApiResponse {
  Data: {
    Data: {
      time: number
      close: number
      low: number
    }[]
  }
}

async function fetchDailyData(
  coin: string,
  currency: string
): Promise<ChartData[]> {
  try {
    const response = await api.get<ApiResponse>(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin.toUpperCase()}&tsym=USD&limit=7`
    )
    const prices = response.data.Data.Data

    const conversionRate = await fetchConversionRate('USD', currency)

    return prices.map((price) => ({
      date: new Date(price.time * 1000).toLocaleDateString(),
      value: price.close * conversionRate,
      minValue: price.low * conversionRate,
    }))
  } catch (error) {
    console.error('Erro ao buscar os dados da API', error)
    return []
  }
}

const config: Record<string, { color: string }> = {
  BTC: { color: '#f7931a' },
  ETH: { color: '#3c3c3d' },
  XRP: { color: '#00aae4' },
  LTC: { color: '#cfcfcf' },
  ADA: { color: '#0033ad' },
  DOT: { color: '#e6007a' },
  BNB: { color: '#f0b90b' },
  SOL: { color: '#3e3e3e' },
  DOGE: { color: '#c2a633' },
}

export function CoinChart() {
  const [dailyData, setDailyData] = useState<ChartData[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC')
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

  const handleCurrencyChange = useCallback(
    async (currency: string) => {
      setSelectedCurrency(currency)
      const daily = await fetchDailyData(selectedCoin, currency)
      setDailyData(daily)
    },
    [selectedCoin]
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
            <SelectItem value="BTC">Bitcoin</SelectItem>
            <SelectItem value="ETH">Ethereum</SelectItem>
            <SelectItem value="XRP">Ripple</SelectItem>
            <SelectItem value="LTC">Litecoin</SelectItem>
            <SelectItem value="ADA">Cardano</SelectItem>
            <SelectItem value="DOT">Polkadot</SelectItem>
            <SelectItem value="BNB">Binance Coin</SelectItem>
            <SelectItem value="SOL">Solana</SelectItem>
            <SelectItem value="DOGE">Dogecoin</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleCurrencyChange} value={selectedCurrency}>
          <SelectTrigger className="bg-zinc-800 border-none">
            <SelectValue placeholder="Selecione a moeda" />
          </SelectTrigger>
          <SelectContent>
            {supportedCurrencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
