import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().optional(),
  is_admin: z.boolean(),
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

  const parsedUser = userSchema.safeParse(user)

  if (!parsedUser.success) {
    return NextResponse.json({ message: 'Invalid user data' }, { status: 400 })
  }

  return NextResponse.json(parsedUser.data)
}
