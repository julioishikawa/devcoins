import { CoinCarousel } from '@/components/coin-carousel'
import { CoinChart } from '@/components/coin-chart'

export default function Home() {
  return (
    <main className="px-20 py-10">
      <CoinChart />

      <div className="flex justify-center">
        <CoinCarousel />
      </div>
    </main>
  )
}
