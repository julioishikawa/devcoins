import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    // Cria a nova transação com status 'pending'
    const transaction = await prisma.transaction.create({
      data: {
        status: 'pending',
        user_id: userId,
      },
    })

    // Iniciar temporizador de 30 segundos no back-end
    setTimeout(async () => {
      // Verifica o status da transação
      const currentTransaction = await prisma.transaction.findUnique({
        where: { id: transaction.id },
      })

      if (currentTransaction && currentTransaction.status === 'pending') {
        // Se ainda estiver pendente após 30 segundos, marca como 'failed'
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { status: 'failed' },
        })
      }
    }, 30000) // 30 segundos

    return NextResponse.json({ transactionId: transaction.id }, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar a transação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar a transação' },
      { status: 500 }
    )
  }
}
