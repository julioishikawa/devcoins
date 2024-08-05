'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Bar, BarChart, Legend, XAxis, YAxis, Tooltip } from 'recharts'
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
} from './ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { SkeletonChart } from './skeleton-chart'

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

export async function fetchData(coin: string): Promise<ChartData[]> {
  try {
    const conversionRate = await fetchConversionRate()

    const response = await axios.get<ApiResponse>(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin.toUpperCase()}&tsym=USD&limit=7`
    )

    const prices = response.data.Data.Data

    return prices
      .map((price) => ({
        date: new Date(price.time * 1000).toLocaleDateString(),
        value: price.close * conversionRate,
        minValue: price.low * conversionRate,
      }))
      .filter(
        (data, index, self) =>
          index === self.findIndex((d) => d.date === data.date)
      )
  } catch (error) {
    console.error('Erro ao buscar os dados da API', error)
    return []
  }
}

export function CoinChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>('BTC')
  const [loading, setLoading] = useState<boolean>(true)

  const handleSelectChange = useCallback(async (coin: string) => {
    setSelectedCoin(coin)
    setLoading(true)
    const newData = await fetchData(coin)
    setData(newData)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Carregar dados do Bitcoin ao montar o componente
    const loadInitialData = async () => {
      const initialData = await fetchData(selectedCoin)
      setData(initialData)
      setLoading(false)
    }
    loadInitialData()
  }, [selectedCoin])

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

  return (
    <div className="space-y-4">
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

      {loading ? (
        <SkeletonChart />
      ) : (
        <ChartContainer config={config}>
          <BarChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar
              dataKey="minValue"
              fill="#e42f5a"
              name={`Menor valor: `}
              barSize={20}
              isAnimationActive={false}
            />
            <Bar
              dataKey="value"
              fill={config[selectedCoin]?.color || '#8884d8'}
              name={`Fechamento: `}
              barSize={30}
              isAnimationActive={false}
            />
          </BarChart>
        </ChartContainer>
      )}
    </div>
  )
}
