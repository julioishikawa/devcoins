'use client'

import { useEffect, useState } from 'react'
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
import { fetchCoinDetails, topCoins } from '@/utils/fetch-coin-details'

export function CoinCarousel() {
  const [coinDetails, setCoinDetails] = useState<CoinCarouselDetails[]>([])

  useEffect(() => {
    async function loadCoinDetails() {
      const cacheKey = 'cryptoDetailsCache'
      const cacheTimeKey = 'cryptoDetailsCacheTimestamp'
      const cacheDuration = 60 * 60 * 1000 // 1 hora em milissegundos

      const cachedData = localStorage.getItem(cacheKey)
      const cachedTimestamp = localStorage.getItem(cacheTimeKey)
      const now = Date.now()

      if (
        cachedData &&
        cachedTimestamp &&
        now - parseInt(cachedTimestamp) < cacheDuration
      ) {
        setCoinDetails(JSON.parse(cachedData))
        return
      }

      try {
        const details = await Promise.all(
          topCoins.map(async (coin) => {
            const detail = await fetchCoinDetails(coin.code, 'USD')
            return {
              name: detail.name,
              code: detail.code,
              imageUrl: detail.imageUrl,
            }
          })
        )

        setCoinDetails(details)
        localStorage.setItem(cacheKey, JSON.stringify(details))
        localStorage.setItem(cacheTimeKey, now.toString())
      } catch (error) {
        toast.error('Erro ao carregar detalhes das criptomoedas.')
      }
    }

    loadCoinDetails()
  }, [])

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full md:max-w-[600px] lg:max-w-[1000px]"
    >
      <CarouselContent>
        {coinDetails.map((coin) => (
          <CarouselItem
            key={coin.code}
            className="basis-1/1 sm:basis-1/1 md:basis-1/4 lg:basis-1/6"
          >
            <Link href={`/cryptocoin/${coin.code}`}>
              <div className="p-2 border-none cursor-pointer">
                <Card className="border-none bg-zinc-800 min-w-[112px]">
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
      <CarouselPrevious className="hidden md:flex bg-zinc-800 border-none" />
      <CarouselNext className="hidden md:flex bg-zinc-800 border-none" />
    </Carousel>
  )
}
