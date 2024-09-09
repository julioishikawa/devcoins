import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function BackButtonSkeleton() {
  return (
    <div className="absolute top-24 left-10 flex gap-2 items-center">
      <Skeleton about="circle" className="sm:hidden w-8 h-8 rounded-full" />

      <Skeleton about="arrow" className="sm:w-5 h-5" />

      <Skeleton about="back" className="sm:w-12 h-5" />
    </div>
  )
}
