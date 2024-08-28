import { prisma } from '@/lib/prisma'
import { fetchCoinDetails } from '@/utils/fetch-coin-details'
import { CurrencySymbols } from '@prisma/client' // Importe o enum de CurrencySymbols

export async function purchaseCoin(
  userId: string,
  coinCode: string,
  quantity: number,
  selectedCurrency: string
) {
  if (!(selectedCurrency in CurrencySymbols)) {
    throw new Error('Invalid currency selected')
  }

  // Obtém detalhes da moeda na moeda selecionada
  const coinDetails = await fetchCoinDetails(coinCode, selectedCurrency)

  // Converte a string `selectedCurrency` para o tipo `CurrencySymbols`
  const currencySymbol = selectedCurrency as CurrencySymbols

  // Calcula o preço total na moeda selecionada
  const totalPrice = coinDetails.price * quantity

  // Cria uma nova entrada de compra no banco de dados
  const purchase = await prisma.purchase.create({
    data: {
      user_id: userId,
      quantity,
      total_price: totalPrice,
      coin_name: coinDetails.name,
      coin_code: coinDetails.code,
      currency_symbol: currencySymbol, // Usa o valor convertido para `currency_symbol`
    },
  })

  // Atualiza o saldo do usuário
  const balance = await prisma.balance.upsert({
    where: {
      user_id_coin_code: {
        user_id: userId,
        coin_code: coinDetails.code,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      user_id: userId,
      coin_code: coinDetails.code,
      quantity,
    },
  })

  return { purchase, balance }
}
