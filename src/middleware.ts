import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Se o usuário está acessando as páginas de login ou registro
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      // Verifica se o usuário está banido
      if (token.banned) {
        return NextResponse.redirect(new URL('/banned', request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Se o usuário não está autenticado, redireciona para login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verifica se o usuário está banido em qualquer rota protegida
  if (token.banned) {
    return NextResponse.redirect(new URL('/banned', request.url))
  }

  // Proteção para rotas do painel de admin
  if (pathname.startsWith('/panel')) {
    const isAdmin = token.is_admin

    if (!isAdmin) {
      return NextResponse.rewrite(new URL('/404', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/',
    '/profile',
    '/profile/update',
    '/cryptocoin/:slug*',
    '/panel',
  ],
}
