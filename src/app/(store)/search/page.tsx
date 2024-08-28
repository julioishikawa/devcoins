import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'

import { fetchCoinDetails, filterTopCoins } from '@/utils/fetch-coin-details'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface SearchProps {
  searchParams: {
    q: string
  }
}

export default async function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const filteredCoins = filterTopCoins(query)

  const coinsWithDetails = await Promise.all(
    filteredCoins.map(async (coin) => {
      try {
        const details = await fetchCoinDetails(coin.code, 'USD')
        return { ...coin, imageUrl: details.imageUrl }
      } catch (error) {
        console.error(`Erro ao buscar detalhes para ${coin.code}:`, error)
        return { ...coin, imageUrl: null }
      }
    })
  )

  return (
    <section className="h-screen flex flex-col">
      <Header />

      <main className="flex flex-col justify-between h-screen">
        <div className="flex flex-col gap-10 p-10 sm:px-20">
          <p className="text-base">
            Resultados para: <span className="font-semibold">{query}</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {coinsWithDetails.map((coin) => (
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
      <Footer />
    </section>
  )
}
