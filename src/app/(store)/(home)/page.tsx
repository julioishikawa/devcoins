import CarouselSkeleton from '@/components/carousel-skeleton'
import { CoinCarousel } from '@/components/coin-carousel'
import { CoinChart } from '@/components/coin-chart'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className="px-10 sm:px-20 py-10">
      <CoinChart />

      <div className="flex justify-center">
        <Suspense fallback={<CarouselSkeleton />}>
          <CoinCarousel />
        </Suspense>
      </div>
    </main>
  )
}
