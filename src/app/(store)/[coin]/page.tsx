'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import QRCode from 'qrcode.react'
import { LineChartComponent } from '@/components/line-chart-details'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { formatLargeNumber } from '@/utils/format-large-number'
import { currencySymbols, supportedCurrencies } from '@/utils/currency-refactor'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import CoinLoading from './loading'
import { toast } from 'sonner'
import { fetchCoinDetails } from '@/utils/coin-details'
import { fetchHourlyData } from '@/utils/fetch-coin-hour'

interface CoinDetails {
  name: string
  price: number
  marketCap: number
  volume24h: number
  change24h: number
  imageUrl: string
  description: string
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
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const paymentUrlWithId = `/api/payment/${transactionId}`

  async function fetchUserId() {
    try {
      const response = await fetch('/api/users/user')
      if (!response.ok) {
        throw new Error('Failed to fetch user ID')
      }
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error('Erro ao buscar ID do usuário:', error)
      return null
    }
  }

  const handleBuyClick = () => {
    setIsBuyModalOpen(true)
  }

  const handleConfirmPurchase = async () => {
    try {
      const userId = await fetchUserId()

      if (!userId) {
        throw new Error('User ID not found')
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create transaction')
      }

      const { transactionId } = await response.json()
      setTransactionId(transactionId)

      setIsBuyModalOpen(false)
      setIsQRCodeModalOpen(true)

      // Iniciar o temporizador de 30 segundos
      timerRef.current = setTimeout(async () => {
        toast.error('Tempo de pagamento esgotado.')
        await fetch(`/api/payment/${transactionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'failed' }),
        })
        setIsQRCodeModalOpen(false)
      }, 30000)
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      toast.error('Erro ao iniciar a transação. Tente novamente.')
    }
  }

  const checkPaymentStatus = async () => {
    if (transactionId) {
      const response = await fetch(`/api/payment/${transactionId}`)
      const data = await response.json()

      if (data.status === 'completed') {
        toast.success('Pagamento concluído!')
        clearTimeout(timerRef.current as NodeJS.Timeout)
        setIsQRCodeModalOpen(false)
        window.open('https://github.com/julioishikawa', '_blank')
      } else {
        toast.error('Pagamento não concluído. Tente novamente.')
      }
    }
  }

  useEffect(() => {
    if (coin) {
      fetchCoinDetails(coin, selectedCurrency)
        .then(setDetails)
        .catch(console.error)
      fetchHourlyData(coin, selectedCurrency)
        .then(setHourlyData)
        .catch(console.error)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [coin, selectedCurrency])

  if (!details || hourlyData.length === 0) {
    return <CoinLoading />
  }

  return (
    <section className="flex flex-col justify-between gap-10 h-screen">
      <Header />

      <main className="px-10 lg:px-20 flex flex-col gap-10">
        <div className="flex flex-col items-center lg:flex-row gap-10">
          <div className="flex flex-col gap-5 md:justify-center items-center lg:items-start min-w-[180px] lg:max-w-[400px]">
            <div>
              <Select
                onValueChange={setSelectedCurrency}
                value={selectedCurrency}
              >
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
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{details.name}</h1>

              <Image
                src={details.imageUrl}
                alt={details.name}
                width={64}
                height={64}
              />
            </div>

            <p className="text-sm text-zinc-400">{details.description}</p>

            <div className="flex flex-row lg:flex-col gap-8 lg:gap-5">
              <div className="flex flex-col gap-5">
                <p className="text-sm">
                  Preço: <br />
                  {currencySymbols[selectedCurrency]}
                  {details.price.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm">
                  Market Cap: <br />
                  {currencySymbols[selectedCurrency]}
                  {formatLargeNumber(details.marketCap)}
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-sm">
                  Volume 24h: <br />
                  {currencySymbols[selectedCurrency]}
                  {formatLargeNumber(details.volume24h)}
                </p>
                <p className="text-sm">
                  Variação 24h: <br />
                  {details.change24h}%
                </p>
              </div>
            </div>

            <button
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleBuyClick}
            >
              Comprar {details.name}
            </button>
          </div>

          <LineChartComponent
            data={hourlyData}
            config={config}
            selectedCoin={details.name}
          />
        </div>
      </main>
      <Footer />

      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="bg-zinc-950">
          <DialogTitle>Confirmar Compra</DialogTitle>
          <p>
            Você realmente deseja comprar {details.name} por{' '}
            {currencySymbols[selectedCurrency]}
            {details.price.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            ?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => setIsBuyModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={handleConfirmPurchase}
            >
              Confirmar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isQRCodeModalOpen} onOpenChange={setIsQRCodeModalOpen}>
        <DialogContent className="bg-zinc-950">
          <DialogTitle>Pagamento</DialogTitle>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-white p-2">
              <QRCode value={paymentUrlWithId} size={200} />
            </div>

            <p className="text-sm text-zinc-400 mt-4">
              Escaneie o código para completar o pagamento.
            </p>
            <button
              className="mt-5 px-4 py-2 bg-green-600 text-white rounded"
              onClick={checkPaymentStatus}
            >
              Verificar Status do Pagamento
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
