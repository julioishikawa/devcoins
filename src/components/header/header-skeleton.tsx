import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function HeaderSkeleton() {
  return (
    <header className="flex items-center gap-5 p-4 justify-between">
      <Skeleton about="menu-mobile" className="sm:hidden min-h-6 min-w-6" />

      <Skeleton about="logo" className="w-40 h-8 px-14" />

      <Skeleton about="search" className="hidden sm:flex w-full h-10 " />

      <Skeleton
        about="avatar"
        className="hidden sm:flex min-w-10 h-10 rounded-full"
      />

      <Skeleton about="logout" className="min-h-6 min-w-5" />
    </header>
  )
}
