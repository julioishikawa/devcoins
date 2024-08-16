import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import type { NextAuthOptions, User } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { username, password } = credentials

        const user = await prisma.user.findUnique({
          where: { username },
        })

        if (user && (await bcrypt.compare(password, user.password))) {
          const { id, username, name, email, is_admin, avatar } = user
          return {
            id,
            username,
            name,
            email,
            is_admin,
            avatar: avatar ?? undefined,
          } as User
        } else {
          throw new Error('Username ou Senha incorreta')
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user,
      }
    },
  },
}

// Exporta métodos nomeados para compatibilidade com a nova estrutura
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}
