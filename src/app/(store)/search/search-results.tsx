'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import LoadingSpinner from '../../../components/after-search-loading'
import { fetchCoinDetails } from '@/utils/fetch-coin-details'

interface Coin {
  code: string
  name: string
  imageUrl: string | null
}

interface SearchResultsProps {
  query: string
  filteredCoins: Coin[]
}

export default function SearchResults({
  query,
  filteredCoins,
}: SearchResultsProps) {
  const [coinsWithDetails, setCoinsWithDetails] = useState<Coin[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const results = await Promise.all(
          filteredCoins.map(async (coin) => {
            const details = await fetchCoinDetails(coin.code, 'USD')
            return { ...coin, imageUrl: details.imageUrl }
          })
        )
        setCoinsWithDetails(results)
      } catch (error) {
        console.error('Erro ao buscar detalhes das moedas:', error)
        setCoinsWithDetails([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [filteredCoins, query])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <main className="flex flex-col justify-between h-screen">
      <div className="flex flex-col gap-10 p-10 sm:px-20">
        <p className="text-base">
          Resultados para: <span className="font-semibold">{query}</span>
        </p>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {coinsWithDetails?.map((coin) => (
            <div key={coin.code} className="max-w-[112px]">
              <Card className="border-none bg-zinc-800 ">
                <Link href={`/cryptocoin/${coin.code}`}>
                  <CardContent className="flex aspect-square items-center justify-center p-6 ">
                    {coin.imageUrl ? (
                      <Image
                        src={coin.imageUrl}
                        alt={coin.name}
                        className="object-contain w-16 h-16"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <span>Imagem indisponível</span>
                    )}
                  </CardContent>
                </Link>
              </Card>

              <h2 className="mt-2 text-lg text-center text-zinc-50 font-semibold">
                {coin.name}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
