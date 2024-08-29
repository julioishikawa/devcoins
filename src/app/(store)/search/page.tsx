import { redirect } from 'next/navigation'

import { filterTopCoins } from '@/utils/fetch-coin-details'
import Header from '@/components/header'
import Footer from '@/components/footer'
import SearchResults from './search-results'

interface SearchProps {
  searchParams: {
    q: string
  }
}

export default function Search({ searchParams }: SearchProps) {
  const { q: query } = searchParams

  if (!query) {
    redirect('/')
  }

  const filteredCoins = filterTopCoins(query).map((coin) => ({
    ...coin,
    imageUrl: null,
  }))

  return (
    <section className="h-screen flex flex-col">
      <Header />
      <SearchResults query={query} filteredCoins={filteredCoins} />
      <Footer />
    </section>
  )
}
