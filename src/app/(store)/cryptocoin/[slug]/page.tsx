'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import QRCode from 'qrcode.react'
import { useRouter } from 'next/navigation'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { LineChartComponent } from '@/components/line-chart-details'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { formatLargeNumber } from '@/utils/format-large-number'
import { currencySymbols } from '@/utils/currency-refactor'
import { config, fetchCoinDetails } from '@/utils/fetch-coin-details'
import { fetchHourlyData } from '@/utils/fetch-coin-hour'
import CoinLoading from './loading'
import { MinusIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CurrencySymbols } from '@prisma/client'
import CurrencySelect from '@/components/currency-select'

interface CoinsProps {
  params: {
    slug: string
  }
}

interface CoinDetails {
  name: string
  code: string
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

export default function CoinDetailsPage({ params }: CoinsProps) {
  const { slug } = params
  const router = useRouter()

  const [coin, setCoin] = useState<CoinDetails | null>(null)
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL')
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [coinQuantity, setCoinQuantity] = useState<number>(1)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const paymentUrlWithId = `/api/users/payment/${transactionId}`

  const incrementQuantity = () => {
    setCoinQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    setCoinQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  async function fetchUserId() {
    try {
      const response = await fetch('/api/users/user-session')
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

  async function handleBuyClick() {
    setIsBuyModalOpen(true)
  }

  async function handleConfirmPurchase() {
    try {
      const userId = await fetchUserId()

      if (!userId) {
        throw new Error('User ID not found')
      }

      // Validação para garantir que selectedCurrency é um valor válido do enum
      if (!(selectedCurrency in CurrencySymbols)) {
        throw new Error('Invalid currency selected')
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
        await fetch(`/api/users/payment/${transactionId}`, {
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

  async function checkPaymentStatus() {
    if (transactionId) {
      try {
        const response = await fetch(`/api/users/payment/${transactionId}`, {
          method: 'GET',
        })
        const data = await response.json()

        if (data.status === 'completed') {
          if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }

          const enumCurrencySymbols = selectedCurrency as CurrencySymbols

          const purchaseResponse = await fetch('/api/purchase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: await fetchUserId(),
              quantity: coinQuantity,
              coinCode: coin?.code,
              selectedCurrency: enumCurrencySymbols,
            }),
          })

          if (purchaseResponse.ok) {
            toast.success('Compra registrada com sucesso!')
            setIsQRCodeModalOpen(false)
            window.open('https://github.com/julioishikawa', '_blank')
            router.push('/profile')
          } else {
            const errorData = await purchaseResponse.json()
            console.error('Erro ao registrar a compra:', errorData)
            toast.error('Erro ao registrar a compra. Tente novamente.')
          }
        } else {
          toast.error('Pagamento não concluído. Tente novamente.')
        }
      } catch (error) {
        console.error('Erro ao verificar o status do pagamento:', error)
        toast.error('Erro ao verificar o status do pagamento. Tente novamente.')
      }
    }
  }

  async function handleClosePaymentModal() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (transactionId) {
      try {
        await fetch(`/api/users/payment/${transactionId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'failed' }),
        })
        toast.error('Pagamento cancelado.')
      } catch (error) {
        console.error(
          'Erro ao atualizar o status da transação para failed:',
          error
        )
      }
    }

    setIsQRCodeModalOpen(false)
  }

  useEffect(() => {
    if (slug) {
      fetchCoinDetails(slug, selectedCurrency)
        .then(setCoin)
        .catch(console.error)
      fetchHourlyData(slug, selectedCurrency)
        .then(setHourlyData)
        .catch(console.error)
    }
  }, [slug, selectedCurrency])

  if (!coin || hourlyData.length === 0) {
    return <CoinLoading />
  }

  return (
    <section className="flex flex-col justify-between gap-10 h-screen">
      <Header />

      <main className="px-10 lg:px-20 flex flex-col gap-10">
        <div className="flex flex-col items-center lg:flex-row gap-10">
          <div className="flex flex-col gap-5 md:justify-center items-center lg:items-start min-w-[180px] lg:max-w-[400px]">
            <CurrencySelect
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
            />

            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">{coin.name}</h1>

              <Image
                src={coin.imageUrl}
                alt={coin.name}
                width={64}
                height={64}
              />
            </div>

            <p className="text-sm text-zinc-400">{coin.description}</p>

            <div className="flex flex-row lg:flex-col gap-8 lg:gap-5">
              <div className="flex flex-col gap-5">
                <p className="text-sm">
                  Preço: <br />
                  {currencySymbols[selectedCurrency]}
                  {coin.price.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm">
                  Market Cap: <br />
                  {currencySymbols[selectedCurrency]}
                  {formatLargeNumber(coin.marketCap)}
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-sm">
                  Volume 24h: <br />
                  {currencySymbols[selectedCurrency]}
                  {formatLargeNumber(coin.volume24h)}
                </p>
                <p className="text-sm">
                  Variação 24h: <br />
                  {coin.change24h}%
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="flex items-center gap-4">
                <Button
                  className="p-0 h-auto bg-zinc-600 hover:bg-zinc-700 text-white"
                  onClick={decrementQuantity}
                >
                  <MinusIcon />
                </Button>
                <span className="text-xl">{coinQuantity}</span>
                <Button
                  className="p-0 h-auto bg-zinc-600 hover:bg-zinc-700 text-white"
                  onClick={incrementQuantity}
                >
                  <Plus />
                </Button>
              </div>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleBuyClick}
              >
                Comprar {coin.name}
              </Button>
            </div>
          </div>

          <LineChartComponent
            data={hourlyData}
            config={config}
            selectedCoin={coin.name}
          />
        </div>
      </main>
      <Footer />

      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="bg-zinc-950">
          <DialogTitle>Confirmar Compra</DialogTitle>
          <p>
            Você realmente deseja comprar {coinQuantity} {coin.name}
            {coinQuantity > 1 ? "'s" : ''} por{' '}
            {currencySymbols[selectedCurrency]}
            {(coin.price * coinQuantity).toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            ?
          </p>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setIsBuyModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmPurchase}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isQRCodeModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClosePaymentModal() // Função que será chamada ao fechar o modal
          }
          setIsQRCodeModalOpen(open)
        }}
      >
        <DialogContent
          className="bg-zinc-950"
          aria-describedby="dialog-description"
        >
          <DialogTitle>Pagamento</DialogTitle>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-white p-2">
              <QRCode value={paymentUrlWithId} size={200} />
            </div>

            <p id="dialog-description" className="text-sm text-zinc-400 mt-4">
              Escaneie o código para completar o pagamento.
            </p>
            <p className="text-sm text-red-500 mt-2">
              O pagamento será cancelado se não for concluído em 30 segundos.
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
