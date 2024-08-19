import { NextApiRequest } from 'next'

export function getAuthCookie(req: NextApiRequest): string | undefined {
  const cookies = req.headers.cookie
  if (!cookies) return undefined

  const cookieArray = cookies.split(';')
  for (const cookie of cookieArray) {
    const [name, value] = cookie.split('=').map((part) => part.trim())
    if (name === 'next-auth.session-token') {
      return value
    }
  }
  return undefined
}
