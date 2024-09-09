interface SearchProps {
  searchParams: {
    q: string
  }
}

interface SearchResultsProps {
  query: string
  filteredCoins: SearchCoin[]
}
