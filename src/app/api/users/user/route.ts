import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
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
  const session = await getServerSession({
    req,
    ...authOptions,
  })

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const user = {
    username: session.user?.username,
    email: session.user?.email,
    name: session.user?.name,
    avatar: session.user?.avatar,
    is_admin: session.user?.is_admin,
  }

  const parsedUser = userSchema.parse(user)

  return NextResponse.json(parsedUser)
}
