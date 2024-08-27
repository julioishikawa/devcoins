import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function CoinLoading() {
  return (
    <section className="h-screen flex flex-col">
      <header className="flex items-center gap-5 p-4">
        <Skeleton className="w-44 h-8 px-14" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-12 h-10 rounded-full" />
        <Skeleton className="w-8 h-8" />
      </header>

      <main className="flex flex-col justify-between h-screen">
        <div className="p-10 lg:px-20 flex flex-col gap-10">
          <Skeleton className="w-28 h-6" />

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="basis-1/1 sm:basis-1/1 md:basis-1/4 lg:basis-1/12 "
              >
                <div className="border-none min-w-[112px] md:min-w-[122px] w-full rounded aspect-square flex items-center justify-center">
                  <Skeleton className="w-full h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer>
        <Skeleton className="p-4">
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </Skeleton>
      </footer>
    </section>
  )
}
