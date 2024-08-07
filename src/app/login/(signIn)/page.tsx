import React from 'react'

export default function SignIn() {
  return (
    <div className="mx-auto p-8 bg-black border-2 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
        Entrar
      </h2>
      <form className="w-[350px]">
        <div className="mb-4">
          <label className="block text-gray-100 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
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
            className="w-full px-3 py-2 border rounded-lg text-gray-900 focus:outline-none focus:ring focus:ring-gray-500"
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
