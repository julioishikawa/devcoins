import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import type { NextAuthOptions, User } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Authorize callback triggered')
        if (!credentials) return null

        const { username, password } = credentials

        const user = await prisma.user.findUnique({
          where: { username },
        })

        if (user && (await bcrypt.compare(password, user.password))) {
          console.log('User authenticated:', user)
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? '',
            is_admin: user.is_admin,
          } as User
        } else {
          throw new Error('Username ou Senha incorreta')
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user,
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, authOptions)
}
