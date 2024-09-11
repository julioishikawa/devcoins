'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'
import LogoutButton from '../logout-button'
import Logo from '../logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function HeaderMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserHeader | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch('/api/users/user-session')
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        } else {
          console.error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push('/sign-in')
  }

  const handleProfileClick = () => {
    setIsMenuOpen(false)
    router.push('/profile')
  }

  const handleAdminClick = () => {
    setIsMenuOpen(false)
    router.push('/panel')
  }

  return (
    <div className="sm:hidden flex items-center gap-5 justify-between w-full">
      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DialogTrigger asChild>
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="min-h-5 min-w-5 cursor-pointer text-zinc-500 hover:text-zinc-300" />
          </button>
        </DialogTrigger>
        <DialogContent
          className="fixed inset-0 z-50 transition-transform transform border-none w-2/5 bg-zinc-900"
          style={{
            transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          <div className="w-full bg-zinc-900">
            <nav className="flex flex-col items-center pt-5">
              <Link href="/profile" onClick={handleProfileClick}>
                <Button className="text-lg text-zinc-400 hover:text-zinc-300 bg-transparent hover:bg-transparent">
                  Perfil
                </Button>
              </Link>

              {user?.is_admin && (
                <Button
                  className="text-lg text-zinc-400 hover:text-zinc-300 bg-transparent hover:bg-transparent"
                  onClick={handleAdminClick}
                >
                  Painel
                </Button>
              )}

              <Button
                className="text-lg text-zinc-400 hover:text-zinc-300 bg-transparent hover:bg-transparent"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </nav>
          </div>
        </DialogContent>
      </Dialog>

      <Logo />

      <LogoutButton />
    </div>
  )
}
