import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  fetchConversionRate,
  supportedCurrencies,
} from '@/utils/currency-refactor'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  const selectedCurrency = searchParams.get('selectedCurrency') || 'BRL' // Definir BRL como padrão se não for passado

  if (!userId) {
    return NextResponse.json(
      { error: 'O id do usuário é obrigatório' },
      { status: 400 }
    )
  }

  if (!supportedCurrencies.includes(selectedCurrency)) {
    return NextResponse.json({ error: 'Moeda inválida' }, { status: 400 })
  }

  try {
    const balances = await prisma.balance.findMany({
      where: { user_id: userId },
    })

    const purchases = await prisma.purchase.findMany({
      where: { user_id: userId },
    })

    const balanceWithValues = await Promise.all(
      balances.map(async (balance) => {
        const totalValueInCurrencies: Record<string, number> = {}

        await Promise.all(
          purchases
            .filter((purchase) => purchase.coin_code === balance.coin_code)
            .map(async (purchase) => {
              const conversionRate = await fetchConversionRate(
                purchase.currency_symbol,
                selectedCurrency
              )
              const totalValue = purchase.total_price * conversionRate

              if (!totalValueInCurrencies[selectedCurrency]) {
                totalValueInCurrencies[selectedCurrency] = 0
              }

              totalValueInCurrencies[selectedCurrency] += totalValue
            })
        )

        return {
          ...balance,
          totalValueInCurrencies,
        }
      })
    )

    return NextResponse.json({ balances: balanceWithValues }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar saldos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar saldos' },
      { status: 500 }
    )
  }
}
