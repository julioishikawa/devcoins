'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  avatar: string
  name: string
}

export function UserAvatar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/users/user')
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

  return (
    <Avatar className="cursor-pointer" onClick={handleClick}>
      <AvatarImage src={avatarUrl} alt={user?.name || 'User Avatar'} />
      <AvatarFallback className="bg-zinc-700">
        {user?.name?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
