import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import { randomBytes } from 'crypto'

const prisma = new PrismaClient()

const authOptions = NextAuth({
  adapter: PrismaAdapter(),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { username, password } = credentials

        const user = await prisma.user.findUnique({
          where: { username },
        })

        if (user && (await bcrypt.compare(password, user.password))) {
          const { id, username, name, email, is_admin } = user
          return { id, username, name, email, is_admin } as User
        }
        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.username = user.username
        token.is_admin = user.is_admin
      }
      return token
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        username: token.username as string,
        password: token.password as string,
        is_admin: token.is_admin as boolean,
      }
      return session
    },

    async signIn({ user }) {
      const sessionToken = randomBytes(32).toString('hex')
      const sessionExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      await prisma.session.create({
        data: {
          user_id: user.id,
          session_token: sessionToken,
          expires: sessionExpires,
        },
      })

      return true
    },
  },
  cookies: {
    sessionToken: {
      name: `@devcoins:userId`,
      options: {
        httpOnly: false,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      },
    },
  },
})

export { authOptions as GET, authOptions as POST }
