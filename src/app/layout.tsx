import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    template: '%s | devcoins',
    default: 'devcoins',
  },
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={cn(
          'bg-zinc-950 text-zinc-50 font-sans antialiased',
          fontSans.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  )
}
