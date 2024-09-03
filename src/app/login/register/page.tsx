'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SignUp() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    toast.dismiss()

    if (!username || !name || !email || !password || !confirmPassword) {
      toast.error('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          name,
          email,
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário')
      }

      toast.success('Usuário criado com sucesso!')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
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
            placeholder="Escolha seu username"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-100 mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="Seu nome"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-100 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="lorem@email.com"
            required
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
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-100 mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrar'}
        </button>
      </form>

      <button
        className="font-semibold text-gray-100 hover:text-gray-300 mt-6"
        onClick={() => {
          router.push('/login')
        }}
        disabled={loading}
      >
        Já tem uma conta?
      </button>
    </div>
  )
}
