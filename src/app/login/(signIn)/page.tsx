'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      })

      if (result?.error) {
        toast.error(result.error)
      } else if (result?.ok) {
        router.push('/')
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center p-7 bg-zinc-900 border-2 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
        Sign In
      </h2>

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
        className="font-semibold text-gray-100 hover:text-gray-300 mt-6"
        onClick={() => router.push('/login/register')}
      >
        Registrar-se
      </button>
    </div>
  )
}
