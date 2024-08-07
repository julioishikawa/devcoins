import { Skeleton } from './ui/skeleton'

export default function CarouselSkeleton() {
  return (
    <div className="relative w-full lg:w-[1000px]">
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 p-2"
          >
            <div className="border-none min-w-[70px] w-full bg-zinc-800 rounded aspect-square flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="absolute h-8 w-8 rounded-full -left-12 top-1/2 -translate-y-1/2" />
      <Skeleton className="absolute h-8 w-8 rounded-full -right-12 top-1/2 -translate-y-1/2" />
    </div>
  )
}
