// src/app/api/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { username, password } = await request.json()

  // Enviar uma solicitação POST para o endpoint do NextAuth
  const authResponse = await fetch(
    `${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }
  )

  // Obter a resposta do NextAuth
  const responseJson = await authResponse.json()

  if (authResponse.ok) {
    return NextResponse.json(
      { message: 'Login successful', user: responseJson.user },
      { status: 200 }
    )
  } else {
    return NextResponse.json(
      { error: responseJson.error || 'Invalid credentials' },
      { status: 401 }
    )
  }
}
