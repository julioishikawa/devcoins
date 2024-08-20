import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { encode } from 'next-auth/jwt'
import { z } from 'zod'

const prisma = new PrismaClient()

const loginSchema = z.object({
  username: z.string().min(1, 'Username é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const result = loginSchema.safeParse(body)

    if (!result.success) {
      const { errors } = result.error
      return NextResponse.json(
        { error: errors.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { username, password } = result.data

    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Username ou senha incorreta' },
        { status: 401 }
      )
    }

    const existingSession = await prisma.session.findFirst({
      where: {
        user_id: user.id,
        expires: {
          gt: new Date(),
        },
      },
    })

    let sessionToken

    if (existingSession) {
      sessionToken = existingSession.session_token
    } else {
      sessionToken = await encode({
        token: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          is_admin: user.is_admin,
        },
        secret: process.env.NEXTAUTH_SECRET as string,
      })

      await prisma.session.create({
        data: {
          session_token: sessionToken,
          user_id: user.id,
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia
        },
      })
    }

    const response = NextResponse.json({ success: true })

    response.headers.set(
      'Set-Cookie',
      `next-auth.session-token=${sessionToken}; Path=/; HttpOnly; Max-Age=${
        1 * 24 * 60 * 60
      }; SameSite=Lax; Secure=${process.env.NODE_ENV === 'production'}`
    )

    return response
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
