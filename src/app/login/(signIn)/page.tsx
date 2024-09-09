'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    toast.dismiss()

    try {
      const response = await fetch('/api/users/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Login realizado com sucesso!')
        router.push('/')
      } else {
        toast.error(result.error || 'Ocorreu um erro ao fazer login.')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    signIn('google')
  }

  return (
    <div className="flex flex-col items-center p-7 bg-zinc-900 border-2 shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="w-[350px]">
        <div className="mb-4">
          <label className="block text-gray-100 mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="Username"
            required
            aria-invalid={false}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-100 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="********"
            required
            aria-invalid={false}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <button
        onClick={handleGoogleSignIn}
        className="w-full bg-red-800 text-white py-2 mt-4 rounded-lg hover:bg-red-900 transition duration-300 flex items-center justify-center"
      >
        <FcGoogle className="mr-2" />
        Entrar com Google
      </button>

      <button
        className="font-semibold text-gray-100 hover:text-gray-300 mt-6"
        onClick={() => router.push('/login/register')}
      >
        Registrar-se
      </button>
    </div>
  )
}
