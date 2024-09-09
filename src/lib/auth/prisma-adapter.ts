import { Adapter } from 'next-auth/adapters'
import { prisma } from '../prisma'
import bcrypt from 'bcrypt'

export function PrismaAdapter(): Adapter {
  return {
    async createUser(user) {
      const prismaUser = await prisma.user.create({
        data: {
          name: user.name!,
          email: user.email!,
          avatar: user.avatar,
          username: user.username!,
          password: await bcrypt.hash(user.password!, 10),
          is_admin: user.is_admin,
          banned: user.banned,
        },
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar: prismaUser.avatar!,
        is_admin: prismaUser.is_admin,
        banned: prismaUser.banned,
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: { id },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar: user.avatar!,
        is_admin: user.is_admin,
        banned: user.banned,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar: user.avatar!,
        is_admin: user.is_admin,
        banned: user.banned,
      }
    },

    async updateUser(user) {
      const updateData: any = {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }

      if (user.password) {
        updateData.password = await bcrypt.hash(user.password, 10)
      }

      const prismaUser = await prisma.user.update({
        where: { id: user.id! },
        data: updateData,
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar: prismaUser.avatar!,
        is_admin: prismaUser.is_admin,
        banned: prismaUser.banned,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: { user: true },
      })

      if (!account) return null

      const { user } = account

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar: user.avatar!,
        is_admin: user.is_admin,
        banned: user.banned,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          provider_type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      const existingSession = await prisma.session.findFirst({
        where: { user_id: userId },
      })

      if (existingSession) {
        return {
          sessionToken: existingSession.session_token,
          userId: existingSession.user_id,
          expires: existingSession.expires,
        }
      }

      const newSession = await prisma.session.create({
        data: {
          user_id: userId,
          session_token: sessionToken,
          expires,
        },
      })

      return {
        sessionToken: newSession.session_token,
        userId: newSession.user_id,
        expires: newSession.expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const prismaSession = await prisma.session.findUnique({
        where: { session_token: sessionToken },
        include: { user: true },
      })

      if (!prismaSession) {
        return null
      }

      const { user, ...session } = prismaSession

      return {
        session: {
          userId: session.user_id,
          expires: session.expires,
          sessionToken: session.session_token,
        },
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email!,
          emailVerified: null,
          avatar: user.avatar!,
          is_admin: user.is_admin,
          banned: user.banned,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: { session_token: sessionToken },
        data: {
          expires,
          user_id: userId,
        },
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: { session_token: sessionToken },
      })
    },
  }
}
