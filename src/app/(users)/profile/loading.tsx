import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <header className="flex items-center gap-5 p-4">
        <Skeleton className="w-44 h-8 px-14" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-12 h-10 rounded-full" />
        <Skeleton className="w-8 h-8" />
      </header>

      <main className="flex flex-col gap-10 items-center">
        <Skeleton className="p-6 rounded-lg shadow-lg max-w-80 w-full h-[188px]">
          <div className="flex items-center justify-center gap-5">
            <Skeleton className="rounded-full min-w-20 h-20 shadow-lg" />

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="w-full h-6 rounded-md shadow-lg" />
              <Skeleton className="w-full h-6 rounded-md shadow-lg" />
              <Skeleton className="w-full h-6 rounded-md shadow-lg" />
            </div>
          </div>

          <div className="flex gap-5 mt-5">
            <Skeleton className="w-full h-10 rounded-md shadow-lg" />

            <Skeleton className="w-full h-10 rounded-md shadow-lg" />
          </div>
        </Skeleton>
      </main>

      <footer>
        <Skeleton className="p-4">
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </Skeleton>
      </footer>
    </div>
  )
}
