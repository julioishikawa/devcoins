import { api } from '@/lib/axios'
import { fetchConversionRate } from '@/utils/currency-refactor'

export async function fetchHourlyData(coin: string, selectedCurrency: string) {
  const conversionRate = await fetchConversionRate('USD', selectedCurrency)
  const response = await api(
    `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${coin}&tsym=USD&limit=24`
  )

  return response.data.Data.Data.map((price: any) => ({
    time: new Date(price.time * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: price.close * conversionRate,
  }))
}
