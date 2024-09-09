import BackButtonSkeleton from '@/components/back-button-skeleton'
import FooterSkeleton from '@/components/footer-skeleton'
import HeaderSkeleton from '@/components/header/header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <HeaderSkeleton />

      <BackButtonSkeleton />

      <main className="p-10 lg:px-20 flex flex-col items-center gap-10">
        <Skeleton className="p-6 rounded-lg shadow-lg max-w-80 w-full h-[332px] sm:h-[188px]">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Skeleton className="rounded-full min-w-20 h-20 shadow-lg" />

            <div className="flex flex-col gap-2 w-full">
              <Skeleton className="w-full h-6 rounded-md shadow-lg" />
              <Skeleton className="w-full h-6 rounded-md shadow-lg" />
              <Skeleton className="w-full h-6 rounded-md shadow-lg" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-5">
            <Skeleton className="w-[130px] sm:w-full h-10 rounded-md shadow-lg" />

            <Skeleton className="w-[120px] sm:w-full h-10 rounded-md shadow-lg" />
          </div>
        </Skeleton>
      </main>

      <FooterSkeleton />
    </div>
  )
}
