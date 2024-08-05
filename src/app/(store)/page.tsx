import { CoinCarousel } from '@/components/coin-carousel'
import { CoinChart } from '@/components/coin-graph'

export default function Home() {
  return (
    <div className="p-20">
      <div className="flex flex-col gap-3">
        <h1>Selecione</h1>

        <CoinChart />
      </div>

      <div className="flex justify-center">
        <CoinCarousel />
      </div>
    </div>
  )
}
