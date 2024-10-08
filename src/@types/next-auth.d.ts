import 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    password?: string
    avatar: string
    is_admin: boolean
    banned: boolean
  }

  interface Session {
    user: User
    accessToken?: string
  }
}
