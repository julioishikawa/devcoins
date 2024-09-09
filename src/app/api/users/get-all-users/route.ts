import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          username: true,
          banned: true,
        },
        orderBy: {
          username: 'asc',
        },
        skip: offset,
        take: limit,
      }),
      prisma.user.count(),
    ])

    return NextResponse.json({ users, totalUsers }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar os usuários' },
      { status: 500 }
    )
  }
}
