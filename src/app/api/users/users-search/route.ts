// src/pages/api/users/get-user-in-search.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: search,
          mode: 'insensitive', // Faz a busca ser case-insensitive
        },
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        email: true,
        username: true,
        banned: true,
      },
    })

    const totalUsers = await prisma.user.count({
      where: {
        username: {
          contains: search,
          mode: 'insensitive',
        },
      },
    })

    return NextResponse.json({ users, totalUsers }, { status: 200 })
  } catch (error) {
    console.error('Erro ao buscar os usuários:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar os usuários' },
      { status: 500 }
    )
  }
}
