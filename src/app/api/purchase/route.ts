import { NextResponse } from 'next/server'
import { purchaseCoin } from '@/app/api/services/purchase-coin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, quantity, coinCode, selectedCurrency } = body

    const { purchase, balance } = await purchaseCoin(
      userId,
      coinCode,
      quantity,
      selectedCurrency
    )

    return NextResponse.json({ purchase, balance }, { status: 201 })
  } catch (error) {
    console.error('Erro ao registrar a compra:', error)
    return NextResponse.json(
      { error: 'Erro ao registrar a compra' },
      { status: 500 }
    )
  }
}
