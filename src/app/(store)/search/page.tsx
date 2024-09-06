import { redirect } from 'next/navigation'

import { filterTopCoins } from '@/utils/fetch-coin-details'
import SearchResults from './search-results'

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
    <>
      <SearchResults query={query} filteredCoins={filteredCoins} />
    </>
  )
}
