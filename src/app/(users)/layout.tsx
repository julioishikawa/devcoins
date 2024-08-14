import Header from '@/components/header'
import HeaderSkeleton from '@/components/header-skeleton'
import { ReactNode, Suspense } from 'react'

export default function UsersLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>

      {children}
    </div>
  )
}
