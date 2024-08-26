import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TransactionStatus } from '@prisma/client'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    console.log(`Recebendo requisição GET para ID: ${id}`)

    // Tenta encontrar a transação pelo ID
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    })

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      )
    }

    if (transaction.status === 'completed') {
      return NextResponse.json(
        { message: 'Transação já foi completada' },
        { status: 200 }
      )
    } else if (transaction.status === 'failed') {
      return NextResponse.json(
        { error: 'Transação falhou. Tente novamente.' },
        { status: 400 }
      )
    }

    // Atualiza o status para "completed" quando o pagamento for confirmado
    await prisma.transaction.update({
      where: { id },
      data: { status: 'completed' },
    })

    return NextResponse.redirect('https://github.com/julioishikawa', 302)
  } catch (error) {
    console.error('Erro ao processar a transação:', error)
    return NextResponse.json(
      { error: 'Erro ao processar a transação' },
      { status: 500 }
    )
  }
}
