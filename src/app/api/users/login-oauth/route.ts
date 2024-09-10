import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { encode } from 'next-auth/jwt'
import { z } from 'zod'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Validação de dados com zod
const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  provider: z.string().min(1, 'Provedor é obrigatório'),
  provider_account_id: z
    .string()
    .min(1, 'ID da conta do provedor é obrigatório'),
})

// Função para criar username único
const generateUniqueUsername = async (email: string) => {
  const usernameBase = email.split('@')[0]
  const hash = crypto.randomBytes(3).toString('hex')
  let username = `${usernameBase}-${hash}`

  const existingUser = await prisma.user.findUnique({ where: { username } })

  while (existingUser) {
    const newHash = crypto.randomBytes(3).toString('hex')
    username = `${usernameBase}${newHash}`
  }

  return username
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = userSchema.safeParse(body)

    if (!result.success) {
      const { errors } = result.error
      return NextResponse.json(
        { error: errors.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { name, email, provider, provider_account_id } = result.data

    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      const username = await generateUniqueUsername(email)
      user = await prisma.user.create({
        data: {
          name,
          email,
          username,
          avatar: '',
          password: '',
          is_admin: false,
          banned: false,
        },
      })

      await prisma.account.create({
        data: {
          user_id: user.id,
          provider,
          provider_account_id,
          provider_type: 'oauth',
        },
      })
    }

    const account = await prisma.account.findUnique({
      where: {
        provider_provider_account_id: {
          provider,
          provider_account_id,
        },
      },
    })

    if (!account) {
      await prisma.account.create({
        data: {
          user_id: user.id,
          provider,
          provider_account_id,
          provider_type: 'oauth',
        },
      })
    }

    const sessionToken = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        is_admin: user.is_admin,
        banned: user.banned,
      },
      secret: process.env.NEXTAUTH_SECRET as string,
    })

    await prisma.session.create({
      data: {
        user_id: user.id,
        session_token: sessionToken,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 dia
      },
    })

    return NextResponse.json({ success: true, sessionToken })
  } catch (error) {
    console.error('Erro ao processar OAuth:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
