import { ReactNode } from 'react'

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="w-full p-20 text-center">LOGO</h1>
      {children}
    </div>
  )
}
