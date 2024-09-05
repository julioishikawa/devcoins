import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import HeaderSkeleton from '@/components/header-skeleton'
import FooterSkeleton from '@/components/footer-skeleton'

export default function PanelLoading() {
  return (
    <section className="flex flex-col justify-between h-screen">
      <main className="h-full">
        <HeaderSkeleton />

        <div className="w-full py-5 px-20">
          <div className="flex items-center gap-2 py-4">
            <Skeleton className="w-56 h-10" />
            <Skeleton className="w-[79px] h-10" />
          </div>

          <Skeleton className="w-full h-[500px]" />

          <div className="flex items-center justify-between py-4">
            <Skeleton className="w-[210px] h-5" />

            <div className="flex gap-2">
              <Skeleton className="w-[80px] h-9" />
              <Skeleton className="w-[80px] h-9" />
            </div>
          </div>
        </div>
      </main>

      <FooterSkeleton />
    </section>
  )
}
