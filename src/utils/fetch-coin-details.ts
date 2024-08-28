import { api } from '@/lib/axios'
import { fetchConversionRate } from '@/utils/currency-refactor'

export const topCoins = [
  { name: 'Bitcoin', code: 'BTC' },
  { name: 'Ethereum', code: 'ETH' },
  { name: 'Tether', code: 'USDT' },
  { name: 'Binance Coin', code: 'BNB' },
  { name: 'XRP', code: 'XRP' },
  { name: 'USD Coin', code: 'USDC' },
  { name: 'Cardano', code: 'ADA' },
  { name: 'Solana', code: 'SOL' },
  { name: 'Dogecoin', code: 'DOGE' },
  { name: 'Polygon', code: 'MATIC' },
]

export const config: Record<string, { color: string }> = {
  BTC: { color: '#f7931a' }, // Bitcoin
  ETH: { color: '#3c3c3d' }, // Ethereum
  USDT: { color: '#26a17b' }, // Tether (USDT)
  BNB: { color: '#f0b90b' }, // Binance Coin
  XRP: { color: '#00aae4' }, // XRP
  USDC: { color: '#2775ca' }, // USD Coin
  ADA: { color: '#0033ad' }, // Cardano
  SOL: { color: '#3e3e3e' }, // Solana
  DOGE: { color: '#c2a633' }, // Dogecoin
  MATIC: { color: '#8247e5' }, // Polygon
}

export function filterTopCoins(query: string) {
  return topCoins.filter((coin) =>
    coin.name.toLowerCase().includes(query.toLowerCase())
  )
}

export async function fetchCoinDetails(
  coinCode: string,
  selectedCurrency: string
) {
  const upperCoin = coinCode.toUpperCase()

  const coinData = topCoins.find((c) => c.code === upperCoin)
  if (!coinData) {
    throw new Error(
      `Moeda ${upperCoin} não está entre as 10 principais criptomoedas.`
    )
  }

  const conversionRate = await fetchConversionRate('USD', selectedCurrency)
  const [priceResponse, descriptionResponse] = await Promise.all([
    api(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${upperCoin}&tsyms=USD`
    ),
    api(`https://min-api.cryptocompare.com/data/all/coinlist`),
  ])

  const data = priceResponse.data.DISPLAY?.[upperCoin]?.USD
  if (!data) {
    throw new Error(`Dados de preço não disponíveis para ${upperCoin}.`)
  }

  const description =
    descriptionResponse.data.Data?.[upperCoin]?.Description ||
    'Descrição não disponível.'

  const color = config[upperCoin]?.color || '#ffffff'

  return {
    name: coinData.name,
    code: upperCoin,
    price: parseFloat(data.PRICE.replace(/[^\d.-]/g, '')) * conversionRate,
    marketCap:
      parseFloat(data.MKTCAP.replace(/[^\d.-]/g, '').replace('B', '')) *
      1e9 *
      conversionRate,
    volume24h:
      parseFloat(data.VOLUME24HOURTO.replace(/[^\d.-]/g, '')) * conversionRate,
    change24h: parseFloat(data.CHANGEPCT24HOUR),
    imageUrl: `https://www.cryptocompare.com${data.IMAGEURL}`,
    description: description,
    color: color,
  }
}
