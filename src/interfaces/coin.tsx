interface SearchCoin {
  code: string
  name: string
  imageUrl: string | null
}

interface CoinsProps {
  params: {
    slug: string
  }
}

interface CoinCarouselDetails {
  name: string
  code: string
  imageUrl: string
}

interface CoinDetails {
  name: string
  code: string
  price: number
  marketCap: number
  volume24h: number
  change24h: number
  imageUrl: string
  description: string
}
