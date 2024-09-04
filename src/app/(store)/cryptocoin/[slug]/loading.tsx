import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import HeaderSkeleton from '@/components/header-skeleton'
import FooterSkeleton from '@/components/footer-skeleton'

export default function CoinLoading() {
  return (
    <section className="flex flex-col justify-between gap-10 h-screen">
      <HeaderSkeleton />

      <main className="px-10 lg:px-20 flex flex-col gap-10">
        <div className="flex flex-col items-center lg:flex-row gap-10">
          <div className="flex flex-col gap-5 md:justify-center items-center lg:items-start min-w-[180px] md:min-w-full lg:min-w-[400px]">
            <Skeleton className="h-10 rounded-md w-20" />

            <div className="flex items-center gap-4">
              <Skeleton className="h-9 rounded w-20" />

              <Skeleton className="w-16 h-16 rounded-full" />
            </div>

            <Skeleton className="w-full md:h-[150px] lg:w-[400px] lg:h-[300px] rounded" />

            <div className="flex flex-row lg:flex-col gap-8 lg:gap-5">
              <div className="flex flex-col gap-5">
                <Skeleton className="h-12 rounded w-28" />

                <Skeleton className="h-12 rounded w-28" />
              </div>

              <div className="flex flex-col gap-5">
                <Skeleton className="h-12 rounded w-28" />

                <Skeleton className="h-12 rounded w-28" />
              </div>
            </div>
          </div>

          <Skeleton className="w-full h-[200px] sm:h-[300px] md:h-[500px] lg:h-[700px] rounded" />
        </div>
      </main>

      <FooterSkeleton />
    </section>
  )
}
