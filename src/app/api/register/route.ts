import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { username, name, email, password } = await request.json()

    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { error: 'Preencha todos os campos!' },
        { status: 400 }
      )
    }

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
