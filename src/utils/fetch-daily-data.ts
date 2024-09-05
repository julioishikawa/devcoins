import { api } from '@/lib/axios'
import { fetchConversionRate } from '@/utils/currency-refactor'

interface ApiResponse {
  Data: {
    Data: {
      time: number
      close: number
      low: number
    }[]
  }
}

export async function fetchDailyData(
  coin: string,
  currency: string
): Promise<ChartData[]> {
  try {
    const response = await api.get<ApiResponse>(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coin.toUpperCase()}&tsym=USD&limit=7`
    )
    const prices = response.data.Data.Data

    const conversionRate = await fetchConversionRate('USD', currency)

    return prices.map((price) => ({
      date: new Date(price.time * 1000).toLocaleDateString(),
      value: price.close * conversionRate,
      minValue: price.low * conversionRate,
    }))
  } catch (error) {
    console.error('Erro ao buscar os dados da API', error)
    return []
  }
}
