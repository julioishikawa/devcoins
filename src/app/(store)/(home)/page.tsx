import CarouselSkeleton from '@/components/carousel-skeleton'
import { CoinCarousel } from '@/components/coin-carousel'
import { CoinChart } from '@/components/coin-chart'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className="p-10 sm:px-20">
      <CoinChart />

      <div className="flex justify-center">
        <Suspense fallback={<CarouselSkeleton />}>
          <CoinCarousel />
        </Suspense>
      </div>
    </main>
  )
}
