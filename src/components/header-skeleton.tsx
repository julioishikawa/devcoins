import { Skeleton } from './ui/skeleton'

export default function HeaderSkeleton() {
  return (
    <div className="flex items-center gap-5">
      <Skeleton className="w-11 h-8 px-14" />
      <Skeleton className="w-full h-10" />
      <Skeleton className="w-12 h-10 rounded-full" />
      <Skeleton className="w-8 h-8" />
    </div>
  )
}
