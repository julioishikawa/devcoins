import Footer from '@/components/footer'
import { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex flex-col h-screen justify-between">
      <h1 className="p-4 bg-zinc-800 text-white text-center">LOGO</h1>

      <div className="flex flex-col items-center px-10">{children}</div>

      <Footer />
    </section>
  )
}
