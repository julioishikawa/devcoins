'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

import { api } from '@/lib/axios'
import { LineChartComponent } from '@/components/line-chart-details'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { formatLargeNumber } from '@/utils/format-large-number'
import {
  currencySymbols,
  fetchConversionRate,
  supportedCurrencies,
} from '@/utils/currency-refactor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'

interface CoinDetails {
  name: string
  price: number
  marketCap: number
  volume24h: number
  change24h: number
  imageUrl: string
}

interface HourlyData {
  time: string
  value: number
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

export default function CoinDetailsPage() {
  const searchParams = useSearchParams()
  const coin = searchParams.get('coin')
  const [details, setDetails] = useState<CoinDetails | null>(null)
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL')

  const fetchCoinDetails = useCallback(async () => {
    if (coin) {
      try {
        const conversionRate = await fetchConversionRate(
          'USD',
          selectedCurrency
        )
        const response = await api(
          `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD`
        )

        const data = response.data.DISPLAY[coin as string].USD
        setDetails({
          name: coin as string,
          price:
            parseFloat(data.PRICE.replace(/[^\d.-]/g, '')) * conversionRate,
          marketCap:
            parseFloat(data.MKTCAP.replace(/[^\d.-]/g, '').replace('B', '')) *
            1e9 *
            conversionRate,
          volume24h:
            parseFloat(data.VOLUME24HOURTO.replace(/[^\d.-]/g, '')) *
            conversionRate,
          change24h: parseFloat(data.CHANGEPCT24HOUR),
          imageUrl: `https://www.cryptocompare.com${data.IMAGEURL}`,
        })
      } catch (error) {
        console.error('Erro ao buscar detalhes da criptomoeda:', error)
      }
    }
  }, [coin, selectedCurrency])

  const fetchHourlyData = useCallback(async () => {
    if (coin) {
      try {
        const conversionRate = await fetchConversionRate(
          'USD',
          selectedCurrency
        )
        const response = await api(
          `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coin}&tsym=USD&limit=24`
        )

        const prices = response.data.Data.Data.map((price: any) => ({
          time: new Date(price.time * 1000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          value: price.close * conversionRate,
        }))

        setHourlyData(prices)
      } catch (error) {
        console.error('Erro ao buscar dados horários da criptomoeda:', error)
      }
    }
  }, [coin, selectedCurrency])

  useEffect(() => {
    fetchCoinDetails()
    fetchHourlyData()
  }, [coin, selectedCurrency, fetchCoinDetails, fetchHourlyData])

  if (!details || hourlyData.length === 0) return <div>Carregando...</div>

  return (
    <section className="flex flex-col justify-between w-full h-screen">
      <Header />

      <div className="px-20 flex  flex-col gap-10">
        <div className="flexgap-4 h-10 rounded-md">
          <Select onValueChange={setSelectedCurrency} value={selectedCurrency}>
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
        </div>

        <div className="flex">
          <div className="flex flex-col gap-5 min-w-[200px]">
            <h1 className="text-3xl font-bold">{details.name}</h1>

            <Image
              src={details.imageUrl}
              alt={details.name}
              width={64}
              height={64}
              className="my-4"
            />

            <p>
              Preço: {currencySymbols[selectedCurrency]}
              {details.price.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p>
              Market Cap: {currencySymbols[selectedCurrency]}
              {formatLargeNumber(details.marketCap)}
            </p>
            <p>
              Volume 24h: {currencySymbols[selectedCurrency]}
              {formatLargeNumber(details.volume24h)}
            </p>
            <p>Variação 24h: {details.change24h}%</p>
          </div>

          <LineChartComponent
            data={hourlyData}
            config={config}
            selectedCoin={details.name}
          />
        </div>
      </div>
      <Footer />
    </section>
  )
}
