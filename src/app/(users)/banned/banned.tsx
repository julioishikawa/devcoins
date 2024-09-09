'use client'

import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

export default function BannedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-zinc-100">
      <h1 className="text-5xl font-bold mb-4">Conta Banida</h1>
      <p className="text-lg mb-6 text-center">
        Sua conta foi banida. Se você acredita que isso foi um erro, entre em
        contato com o suporte.
      </p>

      <Button
        className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg"
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        Voltar para o login
      </Button>
    </div>
  )
}
