import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Assumindo que você configurou o Prisma

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        banned: true,
      },
    })
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar os usuários' },
      { status: 500 }
    )
  }
}
