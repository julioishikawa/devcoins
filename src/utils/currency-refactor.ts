import axios from 'axios'
import { toast } from 'sonner'

export const supportedCurrencies = [
  'BRL',
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'SEK',
  'NZD',
]

// Mapeamento dos símbolos das moedas
export const currencySymbols: Record<string, string> = {
  USD: '$ ',
  BRL: 'R$ ',
  EUR: '€ ',
  GBP: '£ ',
  JPY: '¥ ',
  AUD: 'A$ ',
  CAD: 'C$ ',
  CHF: 'CHF ',
  CNY: '¥ ',
  SEK: 'kr ',
  NZD: 'NZ$ ',
}

export async function fetchConversionRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  try {
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
    )
    return response.data.rates[targetCurrency]
  } catch (error: any) {
    toast.error('Erro ao buscar a taxa de conversão')
    return 1
  }
}

export function formatCurrency(
  value: number | undefined | null,
  currencySymbol: string = ''
): string {
  if (value === undefined || value === null) {
    return 'Fazendo a conversão...'
  }

  const formattedValue = value.toFixed(2)

  const [integerPart, decimalPart] = formattedValue.split('.')

  const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${currencySymbol}${integerWithCommas},${decimalPart}`
}
