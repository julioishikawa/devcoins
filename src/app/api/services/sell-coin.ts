import { prisma } from '@/lib/prisma'
import { fetchCoinDetails } from '@/utils/fetch-coin-details'

export async function sellCoin(
  userId: string,
  coinCode: string,
  quantity: number,
  selectedCurrency: string
) {
  const coinDetails = await fetchCoinDetails(coinCode, selectedCurrency)

  const totalPrice = coinDetails.price * quantity

  // Verificar se o usuário tem saldo suficiente
  const balance = await prisma.balance.findUnique({
    where: {
      user_id_coin_code: {
        user_id: userId,
        coin_code: coinDetails.code,
      },
    },
  })

  if (!balance || balance.quantity < quantity) {
    throw new Error('Saldo insuficiente para realizar a venda.')
  }

  // Registrar a venda e atualizar o saldo
  const updatedBalance = await prisma.balance.update({
    where: {
      user_id_coin_code: {
        user_id: userId,
        coin_code: coinDetails.code,
      },
    },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  })

  return { updatedBalance, totalPrice }
}
