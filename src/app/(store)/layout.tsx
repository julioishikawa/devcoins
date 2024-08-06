import Header from '@/components/header'
import HeaderSkeleton from '@/components/header-skeleton'

import { ReactNode, Suspense } from 'react'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-8">
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      {children}
    </div>
  )
}
