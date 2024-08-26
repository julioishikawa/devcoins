import { CoinCarousel } from '@/components/coin-carousel'
import { CoinChart } from '@/components/coin-chart'
import Footer from '@/components/footer'
import Header from '@/components/header'

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <section className="h-screen flex flex-col justify-between">
      <Header />

      <div className="p-10 flex flex-col gap-5">
        <CoinChart />

        <div className="flex justify-center">
          <CoinCarousel />
        </div>
      </div>

      <Footer />
    </section>
  )
}
