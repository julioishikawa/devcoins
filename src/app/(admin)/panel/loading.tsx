import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import HeaderSkeleton from '@/components/header/header-skeleton'
import FooterSkeleton from '@/components/footer-skeleton'
import BackButtonSkeleton from '@/components/back-button-skeleton'

export default function PanelLoading() {
  return (
    <section className="flex flex-col justify-between h-screen">
      <main className="">
        <HeaderSkeleton />

        <div className="w-full pt-16 pb-10 px-20">
          <BackButtonSkeleton />

          <div className="flex flex-col sm:flex-row gap-2 py-4">
            <Skeleton className="w-[208px] sm:w-56 h-10" />
            <Skeleton className="w-[208px] sm:w-[79px] h-10" />
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
