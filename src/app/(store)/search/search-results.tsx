'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Card, CardContent } from '@/components/ui/card'
import LoadingSpinner from '@/components/loading-spinner'
import { fetchCoinDetails } from '@/utils/fetch-coin-details'
import BackButton from '@/components/back-button'
import Footer from '@/components/footer'
import Header from '@/components/header/header-component'

export default function SearchResults({
  query,
  filteredCoins,
}: SearchResultsProps) {
  const [coinsWithDetails, setCoinsWithDetails] = useState<SearchCoin[] | null>(
    null
  )
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

  return (
    <section className="relative h-screen justify-between flex flex-col">
      <div>
        <Header />
        <BackButton />

        <main className="py-20 px-20">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-50">
              <LoadingSpinner />
            </div>
          )}

          <div
            className={`flex flex-col gap-5 ${
              isLoading ? 'filter blur-sm' : ''
            }`}
          >
            <p className="text-base text-center sm:text-start">
              Resultados para: <span className="font-semibold">{query}</span>
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start items-start gap-5">
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
      </div>
      <Footer />
    </section>
  )
}
