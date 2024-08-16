import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { sign, verify } from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
  console.log('PUT request received')

  const session = await getServerSession({ req, ...authOptions })
  console.log('Session:', session)

  if (!session) {
    console.log('Unauthorized: No session found')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { username, name, email, avatar } = await req.json()
  console.log('Request data:', { username, name, email, avatar })

  try {
    // Atualiza as informações do usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username, name, email, avatar },
    })
    console.log('Updated user:', updatedUser)

    // Extrair informações do token atual
    const currentTokenCookie = req.cookies.get('next-auth.session-token')
    const currentToken = currentTokenCookie ? currentTokenCookie.value : ''
    console.log('Current token:', currentToken)

    let decodedToken
    try {
      if (currentToken) {
        decodedToken = verify(
          currentToken,
          process.env.NEXTAUTH_SECRET as string
        )
        console.log('Decoded token:', decodedToken)
      } else {
        console.log('No token found')
      }
    } catch (error) {
      console.log('Error decoding token:', error)
    }

    // Gerar um novo token com as credenciais extraídas
    const newToken = sign(
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        avatar: updatedUser.avatar ?? undefined,
        is_admin: updatedUser.is_admin,
      },
      process.env.NEXTAUTH_SECRET as string,
      { expiresIn: '1d' }
    )
    console.log('New token:', newToken)

    // Retorna a resposta com o novo token
    const response = NextResponse.json({
      success: true,
      user: updatedUser,
      token: newToken, // Inclua o novo token na resposta, se necessário
    })
    console.log('Response JSON:', response)

    // Atualiza o cookie da sessão com o novo token
    response.cookies.set('next-auth.session-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1 * 24 * 60 * 60, // Cookie expira em 1 dia
    })
    console.log('Cookie set with new token')

    return response
  } catch (error) {
    console.error('Erro ao atualizar o usuário:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}
