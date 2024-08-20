import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { encode } from 'next-auth/jwt'
import { z } from 'zod'

const prisma = new PrismaClient()

const userUpdateSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  avatar: z.string().url('URL do avatar inválida').optional(),
})

export async function PUT(req: NextRequest) {
  const session = await getServerSession({ req, ...authOptions })

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const result = userUpdateSchema.safeParse(body)

    if (!result.success) {
      const { errors } = result.error
      return NextResponse.json(
        { error: errors.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { username, name, email, avatar } = result.data

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username, name, email, avatar },
    })

    const updatedTokenData = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      is_admin: session.user.is_admin,
    }

    const currentSessionToken = req.cookies.get(
      'next-auth.session-token'
    )?.value

    if (currentSessionToken) {
      try {
        await prisma.session.delete({
          where: {
            session_token: currentSessionToken,
          },
        })
      } catch (error) {
        console.error(
          'Nenhuma sessão existente encontrada para excluir, criando uma nova.',
          error
        )
      }
    }

    const sessionToken = await encode({
      token: updatedTokenData,
      secret: process.env.NEXTAUTH_SECRET as string,
    })

    await prisma.session.create({
      data: {
        session_token: sessionToken,
        user_id: updatedUser.id,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Exemplo de expiração de 1 dia
      },
    })

    const response = NextResponse.json({
      success: true,
      user: updatedUser,
    })

    response.headers.set(
      'Set-Cookie',
      `next-auth.session-token=${sessionToken}; Path=/; HttpOnly; Max-Age=${
        1 * 24 * 60 * 60
      }; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`
    )

    return response
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
