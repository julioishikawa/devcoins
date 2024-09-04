import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function HeaderSkeleton() {
  return (
    <header className="flex items-center gap-5 p-4">
      <Skeleton className="w-44 h-8 px-14" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="min-w-10 h-10 rounded-full" />
      <Skeleton className="w-6 h-6" />
    </header>
  )
}
