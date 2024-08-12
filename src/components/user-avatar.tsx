'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'

export function UserAvatar() {
  const { data: session } = useSession()

  const router = useRouter()

  const avatarUrl = session?.user.avatar

  const handleClick = () => {
    if (session?.user.id) {
      router.push('/profile')
    }
  }

  return (
    <Avatar className="cursor-pointer" onClick={handleClick}>
      <AvatarImage src={avatarUrl} alt={session?.user.name || 'User Avatar'} />
      <AvatarFallback className="bg-zinc-700">
        {session?.user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
