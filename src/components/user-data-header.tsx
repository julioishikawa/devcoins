'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function UserDataHeader() {
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

  const avatarUrl = user?.avatar

  const handleClick = () => {
    router.push('/profile')
  }

  const handleAdminClick = () => {
    router.push('/panel')
  }

  return (
    <div className="flex gap-5">
      <Avatar className="cursor-pointer" onClick={handleClick}>
        <AvatarImage
          src={avatarUrl}
          alt={user?.name || 'User Avatar'}
          className="object-cover"
        />
        <AvatarFallback className="bg-zinc-700">
          {user?.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {user?.is_admin && (
        <Button
          className="bg-zinc-700 hover:bg-zinc-600"
          onClick={handleAdminClick}
        >
          Painel
        </Button>
      )}
    </div>
  )
}
