'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchDailyData } from '@/utils/fetch-daily-data'
import { topCoins, config } from '@/utils/fetch-coin-details'
import Header from '@/components/header/header-component'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import CurrencySelect from '@/components/currency-select'
import { BarChartComponent } from '@/components/bar-chart-home'
import { CoinCarousel } from '@/components/coin-carousel'
import { LineChartComponent } from '@/components/line-chart-home'
import Footer from '@/components/footer'
import HomeLoading from './loading'

export function ClientHomePage() {
  const [dailyData, setDailyData] = useState<ChartData[]>([])
  const [selectedCoin, setSelectedCoin] = useState<string>(topCoins[0].code) // Usando o símbolo da primeira moeda como padrão
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL')
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar')
  const [isLoading, setIsLoading] = useState<boolean>(true) // Estado de carregamento

  const handleCoinChange = useCallback(
    async (coin: string) => {
      setIsLoading(false)
      setSelectedCoin(coin)
      const daily = await fetchDailyData(coin, selectedCurrency)
      setDailyData(daily)
    },
    [selectedCurrency]
  )

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(false)
      const daily = await fetchDailyData(selectedCoin, selectedCurrency)
      setDailyData(daily)
    }

    loadInitialData()
  }, [selectedCoin, selectedCurrency])

  if (isLoading) {
    return <HomeLoading />
  }

  return (
    <section className="h-screen flex flex-col justify-between">
      <Header />

      <main className="p-10 sm:px-20 flex flex-col gap-5">
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

          <div className="flex justify-center">
            <CoinCarousel />
          </div>
        </div>
      </main>

      <Footer />
    </section>
  )
}
