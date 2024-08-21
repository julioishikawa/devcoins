import NextAuth from 'next-auth'
import type { NextAuthOptions, User } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  debug: true,
  providers: [], // Provedores vazios, necessário para satisfazer o TypeScript
  callbacks: {
    async session({ session, user }) {
      session.user = {
        id: user.id as string,
        username: user.username as string,
        name: user.name as string,
        email: user.email as string,
        avatar: user.avatar as string,
        is_admin: user.is_admin as boolean,
      }

      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}
