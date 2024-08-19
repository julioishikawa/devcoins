import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { z } from 'zod'

const userSchema = z.object({
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

  const user = {
    username: session.user.username ?? '',
    email: session.user.email ?? '',
    name: session.user.name ?? '',
    avatar: session.user.avatar ?? undefined,
    is_admin: session.user.is_admin ?? false,
  }

  const parsedUser = userSchema.safeParse(user)

  if (!parsedUser.success) {
    return NextResponse.json({ message: 'Invalid user data' }, { status: 400 })
  }

  return NextResponse.json(parsedUser.data)
}
