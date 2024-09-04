import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function FooterSkeleton() {
  return (
    <footer>
      <Skeleton className="p-4">
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </Skeleton>
    </footer>
  )
}
