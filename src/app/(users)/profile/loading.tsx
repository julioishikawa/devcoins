import FooterSkeleton from '@/components/footer-skeleton'
import HeaderSkeleton from '@/components/header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <HeaderSkeleton />

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

      <FooterSkeleton />
    </div>
  )
}
