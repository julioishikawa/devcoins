import NextAuth from 'next-auth'
import { PrismaClient } from '@prisma/client'
import type { NextAuthOptions, User } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  debug: true,
  providers: [], // Provedores vazios, necessário para satisfazer o TypeScript
  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id
    //     token.username = user.username
    //     token.name = user.name
    //     token.email = user.email
    //     token.avatar = user.avatar
    //     token.is_admin = user.is_admin
    //   }
    //   return token
    // },

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
    strategy: 'database', // Utilizando banco de dados para sessões
  },
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}
