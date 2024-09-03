import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    await prisma.user.update({
      where: { id: String(id) },
      data: { banned: false },
    })

    return NextResponse.json(
      { message: 'Usuário desbanido com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao desbanir o usuário' },
      { status: 500 }
    )
  }
}
