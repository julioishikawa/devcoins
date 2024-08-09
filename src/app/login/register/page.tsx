'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function SignUp() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    toast.dismiss()

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error creating user')
      }

      toast.success('User created successfully!')
      router.push('/login')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex flex-col items-center p-7 bg-zinc-900 border-2 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
        Sign Up
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
            placeholder="Your Username"
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
            placeholder="Your Name"
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
            placeholder="you@example.com"
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
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Registrar
        </button>
      </form>

      <button
        className="font-semibold text-gray-100 hover:text-gray-300 mt-6"
        onClick={() => {
          router.push('/login')
        }}
      >
        Já tem uma conta?
      </button>
    </div>
  )
}
