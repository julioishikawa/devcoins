import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <header className="flex items-center gap-5 p-6">
        <Skeleton className="w-11 h-8 px-14" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-12 h-10 rounded-full" />
        <Skeleton className="w-8 h-8" />
      </header>

      <main className="flex flex-col items-center">
        <Skeleton className="p-6 rounded-lg shadow-lg max-w-sm w-full h-[445px]">
          <div className="flex flex-col items-center gap-10">
            <Skeleton className="rounded-full w-20 h-20 shadow-lg" />

            <div className="flex flex-col gap-10 w-full">
              <div>
                <Skeleton className="w-full h-10 rounded-md shadow-lg" />
              </div>

              <div>
                <Skeleton className="w-full h-10 rounded-md shadow-lg" />
              </div>

              <div>
                <Skeleton className="w-full h-10 rounded-md shadow-lg" />
              </div>

              <div>
                <Skeleton className="w-full h-10 rounded-md shadow-lg" />
              </div>
            </div>
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
