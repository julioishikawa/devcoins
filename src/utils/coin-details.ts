import { api } from '@/lib/axios'
import { fetchConversionRate } from '@/utils/currency-refactor'

export async function fetchCoinDetails(coin: string, selectedCurrency: string) {
  const conversionRate = await fetchConversionRate('USD', selectedCurrency)
  const [priceResponse, descriptionResponse] = await Promise.all([
    api(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD`
    ),
    api(`https://min-api.cryptocompare.com/data/all/coinlist`),
  ])

  const data = priceResponse.data.DISPLAY[coin as string].USD
  const description =
    descriptionResponse.data.Data[coin as string]?.Description ||
    'Descrição não disponível.'

  return {
    name: coin,
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
  }
}
