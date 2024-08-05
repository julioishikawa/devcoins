import React from 'react'
import { Skeleton } from './ui/skeleton'

export function SkeletonChart() {
  return (
    <div className="flex flex-col space-y-4">
      {/* Área principal do gráfico */}
      <div className="w-full">
        <Skeleton className="h-72 w-full" />
      </div>
    </div>
  )
}
