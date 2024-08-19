import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions })
  console.log('Session:', session)

  if (!session) {
    console.log('Unauthorized: No session found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { username, name, email, avatar } = await req.json()
  console.log('Request data:', { username, name, email, avatar })

  try {
    // Atualiza as informações do usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username, name, email, avatar },
    })
    console.log('Updated user:', updatedUser)

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
