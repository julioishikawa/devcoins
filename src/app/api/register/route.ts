import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSchema = z
  .object({
    username: z.string().min(1, 'Username é obrigatório'),
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'A senha deve ter no mínimo 1 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'A confirmação de senha deve ter no mínimo 1 caracteres'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result = userSchema.safeParse(body)

    if (!result.success) {
      const { errors } = result.error
      return NextResponse.json(
        { error: errors.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }

    const { username, name, email, password } = result.data

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email já está em uso.' },
        { status: 400 }
      )
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username já está em uso.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        is_admin: false,
      },
    })

    return NextResponse.json(
      { message: 'Usuário criado com sucesso!', user },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
