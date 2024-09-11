'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push('/sign-in')
  }

  return (
    <LogOut
      className="min-h-5 min-w-5 cursor-pointer text-zinc-500 hover:text-zinc-300"
      onClick={handleLogout}
    />
  )
}
