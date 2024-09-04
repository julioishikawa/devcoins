import HeaderSkeleton from '@/components/header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function UpdateProfileLoading() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <HeaderSkeleton />

      <main className="flex flex-col items-center">
        <Skeleton className="p-6 rounded-lg shadow-lg max-w-sm w-full">
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
