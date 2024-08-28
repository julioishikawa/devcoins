import { NextResponse } from 'next/server'
import { sellCoin } from '@/app/api/services/sell-coin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, quantity, coinCode, selectedCurrency } = body

    const { updatedBalance, totalPrice } = await sellCoin(
      userId,
      coinCode,
      quantity,
      selectedCurrency
    )

    return NextResponse.json({ updatedBalance, totalPrice }, { status: 200 })
  } catch (error) {
    console.error('Erro ao registrar a venda:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar a venda' },
      { status: 500 }
    )
  }
}
