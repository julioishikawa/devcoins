import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function PanelLoading() {
  return (
    <>
      <section className="flex flex-col justify-between h-screen">
        <main className="h-full">
          <header className="flex items-center gap-5 p-4">
            <Skeleton className="w-44 h-8 px-14" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="min-w-10 h-10 rounded-full" />
            <Skeleton className="w-6 h-6" />
          </header>

          <div className="w-full py-10 px-20">
            <div className="flex items-center gap-2 py-4">
              <Skeleton className="w-96 h-10" />
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

        <footer>
          <Skeleton className="p-4">
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </Skeleton>
        </footer>
      </section>
    </>
  )
}
