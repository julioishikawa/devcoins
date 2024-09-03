import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(id) },
      select: { is_admin: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (user.is_admin) {
      return NextResponse.json(
        { error: 'Não é possível banir um administrador.' },
        { status: 403 }
      )
    }

    await prisma.user.update({
      where: { id: String(id) },
      data: { banned: true },
    })

    return NextResponse.json(
      { message: 'Usuário banido com sucesso' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erro ao banir o usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao banir o usuário' },
      { status: 500 }
    )
  }
}
