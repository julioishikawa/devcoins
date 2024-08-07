'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { BarChartComponent } from './bar-chart'
import { LineChartComponent } from './line-chart'
import { Skeleton } from './ui/skeleton'

interface ChartData {
  date: string
  value: number
  minValue: number
}

interface HourlyData {
  time: string
  value: number
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

async function fetchConversionRate(): Promise<number> {
  try {
    const response = await axios.get(
      'https://api.exchangerate-api.com/v4/latest/USD'
    )

    return response.data.rates.BRL
  } catch (error) {
    console.error('Erro ao buscar a taxa de conversão', error)
    return 1
  }
}

async function fetchHourlyData(coin: string): Promise<HourlyData[]> {
  try {
    const conversionRate = await fetchConversionRate()
    const response = await axios.get<ApiResponse>(
      `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coin.toUpperCase()}&tsym=USD&limit=24`
    )
    const prices = response.data.Data.Data

    return prices.map((price) => ({
      time: new Date(price.time * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: price.close * conversionRate,
    }))
  } catch (error) {
    console.error('Erro ao buscar os dados da API', error)
    return []
  }
}

async function fetchDailyData(coin: string): Promise<ChartData[]> {
  try {
    const conversionRate = await fetchConversionRate()
    const response = await axios.get<ApiResponse>(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin.toUpperCase()}&tsym=USD&limit=7`
    )
    const prices = response.data.Data.Data

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
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC')
  const [loading, setLoading] = useState<boolean>(true)
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')

  const handleSelectChange = useCallback(async (coin: string) => {
    setSelectedCoin(coin)

    const daily = await fetchDailyData(coin)
    const hourly = await fetchHourlyData(coin)

    setDailyData(daily)
    setHourlyData(hourly)
  }, [])

  useEffect(() => {
    // Carregar dados do Bitcoin ao montar o componente
    async function loadInitialData() {
      const daily = await fetchDailyData(selectedCoin)
      const hourly = await fetchHourlyData(selectedCoin)

      setDailyData(daily)
      setHourlyData(hourly)
      setLoading(false)
    }

    loadInitialData()
  }, [])

  return (
    <div className="space-y-4">
      {loading ? (
        <Skeleton className="w-full h-6 rounded-md" />
      ) : (
        <h1>Cryptomoedas nos últimos 7 dias</h1>
      )}

      <div className="inline-flex gap-4 h-10 rounded-md">
        {loading ? (
          <Skeleton className="w-[93px] h-10 rounded-md" />
        ) : (
          <Select onValueChange={handleSelectChange} value={selectedCoin}>
            <SelectTrigger className="bg-black border-none">
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
        )}

        {loading ? (
          <Skeleton className="w-[164px] h-10 rounded-md" />
        ) : (
          <Select
            onValueChange={(value) => setChartType(value as 'bar' | 'line')}
            value={chartType}
          >
            <SelectTrigger className="bg-black border-none ">
              <SelectValue placeholder="Selecione o gráfico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Gráfico de barras</SelectItem>
              <SelectItem value="line">Gráfico de linhas</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-[494px]" />
      ) : (
        <>
          {chartType === 'bar' ? (
            <BarChartComponent
              data={dailyData}
              config={config}
              selectedCoin={selectedCoin}
            />
          ) : (
            <LineChartComponent
              data={hourlyData}
              config={config}
              selectedCoin={selectedCoin}
            />
          )}
        </>
      )}
    </div>
  )
}
