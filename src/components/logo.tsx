'use client'

import { useRouter } from 'next/navigation'

export default function Logo() {
  const router = useRouter()

  return (
    <h1 className="px-10 cursor-pointer" onClick={() => router.push('/')}>
      logo
    </h1>
  )
}
