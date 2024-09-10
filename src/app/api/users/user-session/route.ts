import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSchema = z.object({
  id: z.string(),
  username: z.string().optional(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().nullable().optional(),
  is_admin: z.boolean(),
  isOAuthUser: z.boolean(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email!,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      avatar: true,
      is_admin: true,
    },
  })

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  const accounts = await prisma.account.findMany({
    where: {
      user_id: user.id,
    },
  })

  // Verificar se há alguma conta associada a um provedor OAuth (ex: Google, GitHub)
  const isOAuthUser = accounts.some(
    (account) => account.provider !== 'credentials'
  )

  const userWithAccount = {
    ...user,
    isOAuthUser,
  }

  const parsedUser = userSchema.safeParse(userWithAccount)

  if (!parsedUser.success) {
    console.error('User data validation error:', parsedUser.error)
    return NextResponse.json(
      { message: 'Invalid user data', error: parsedUser.error },
      { status: 400 }
    )
  }

  return NextResponse.json(parsedUser.data)
}
