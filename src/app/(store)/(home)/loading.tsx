import FooterSkeleton from '@/components/footer-skeleton'
import HeaderSkeleton from '@/components/header/header-skeleton'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
  return (
    <section className="h-screen flex flex-col justify-between">
      <HeaderSkeleton />

      <main className="p-10 sm:px-20">
        <div about="wrapper" className="space-y-4">
          <Skeleton className="h-6 w-[300px] rounded-md" />

          <div className="inline-flex gap-4 h-10 rounded-md">
            <Skeleton className="w-[134px] h-10 rounded-md" />
            <Skeleton className="w-[93px] h-10 rounded-md" />
            <Skeleton className="w-[164px] h-10 rounded-md" />
          </div>

          <Skeleton
            about="coin-chart"
            className="h-[500px] w-full rounded-md"
          />

          <div about="coin-carousel" className="flex justify-center">
            <div className="relative w-full md:max-w-[600px] lg:max-w-[1000px]">
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="basis-1/1 sm:basis-1/1 md:basis-1/4 lg:basis-1/6 p-2"
                  >
                    <div className="border-none min-w-[112px] md:min-w-[122px] w-full rounded aspect-square flex items-center justify-center">
                      <Skeleton className="w-full h-full" />
                    </div>
                  </div>
                ))}
              </div>

              <Skeleton className="absolute hidden md:flex h-8 w-8 rounded-full -left-12 top-1/2 -translate-y-1/2" />
              <Skeleton className="absolute hidden md:flex h-8 w-8 rounded-full -right-12 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>
      </main>

      <FooterSkeleton />
    </section>
  )
}
