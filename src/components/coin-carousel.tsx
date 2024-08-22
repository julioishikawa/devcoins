'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { toast } from 'sonner'

interface CoinData {
  name: string
  imageUrl: string
}

const coins = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA', 'DOT', 'BNB', 'SOL', 'DOGE']

async function fetchCoinImageUrls(): Promise<CoinData[]> {
  const cacheKey = 'cryptoImageUrls'
  const cacheTimeKey = 'cryptoImageUrlsTimestamp'
  const cacheDuration = 60 * 60 * 1000 // 1 hora em milissegundos

  const cachedData = localStorage.getItem(cacheKey)
  const cachedTimestamp = localStorage.getItem(cacheTimeKey)
  const now = Date.now()

  if (
    cachedData &&
    cachedTimestamp &&
    now - parseInt(cachedTimestamp) < cacheDuration
  ) {
    return JSON.parse(cachedData)
  }

  try {
    const response = await axios.get(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coins.join(
        ','
      )}&tsyms=USD`
    )

    const coinData = coins.map((coin) => ({
      name: coin,
      imageUrl: `https://www.cryptocompare.com${response.data.DISPLAY[coin].USD.IMAGEURL}`,
    }))

    localStorage.setItem(cacheKey, JSON.stringify(coinData))
    localStorage.setItem(cacheTimeKey, now.toString())

    return coinData
  } catch (error: any) {
    toast.error('Erro ao buscar URLs das imagens:', error)
    return []
  }
}

export function CoinCarousel() {
  const [coins, setCoins] = useState<CoinData[]>([])

  useEffect(() => {
    async function loadCoinImages() {
      const data = await fetchCoinImageUrls()
      setCoins(data)
    }

    loadCoinImages()
  }, [])

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full lg:w-[1000px]"
    >
      <CarouselContent>
        {coins.map((coin) => (
          <CarouselItem
            key={coin.name}
            className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
          >
            <Link href={`/details?coin=${coin.name}`}>
              <div className="p-2 border-none cursor-pointer">
                <Card className="border-none bg-zinc-800">
                  <CardContent className="flex aspect-square items-center justify-center p-6 bg-zinc-800 rounded">
                    <Image
                      src={coin.imageUrl}
                      alt={coin.name}
                      className="object-contain w-16 h-16"
                      width={64}
                      height={64}
                    />
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-zinc-800 border-none" />
      <CarouselNext className="bg-zinc-800 border-none" />
    </Carousel>
  )
}
