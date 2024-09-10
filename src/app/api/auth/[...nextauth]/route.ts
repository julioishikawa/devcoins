import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaAdapter } from '@/lib/auth/prisma-adapter'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import LinkedInProvider from 'next-auth/providers/linkedin'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        },
      },
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: '',
          email: profile.email,
          avatar: profile.picture,
          is_admin: false,
          banned: false,
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
      profile(profile) {
        return {
          id: profile.id?.toString() ?? '',
          name: profile.name || '',
          username: profile.login || '',
          email: profile.email || '',
          avatar: profile.avatar_url || '',
          is_admin: false,
          banned: false,
        }
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID ?? '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET ?? '',
      issuer: 'https://www.linkedin.com',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
      wellKnown:
        'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          username: '',
          email: profile.email,
          avatar: profile.picture,
          is_admin: false,
          banned: false,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (
        account?.provider === 'google' ||
        account?.provider === 'github' ||
        account?.provider === 'linkedin'
      ) {
        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/users/login-oauth`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: profile?.name,
                email: profile?.email,
                provider: account.provider,
                provider_account_id: account.providerAccountId,
              }),
            }
          )

          if (response.ok) {
            const data = await response.json()

            if (data.success) {
              return true
            } else {
              console.error('Erro ao registrar usuário via OAuth:', data.error)
              return false
            }
          } else {
            console.error(
              'Erro ao registrar usuário via OAuth:',
              await response.json()
            )
            return false
          }
        } catch (error) {
          console.error('Erro ao chamar:', error)
          return false
        }
      }

      return true
    },

    async session({ session, user }) {
      session.user = {
        id: user.id as string,
        username: user.username as string,
        name: user.name as string,
        email: user.email as string,
        avatar: user.avatar as string,
        is_admin: user.is_admin as boolean,
        banned: user.banned as boolean,
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
