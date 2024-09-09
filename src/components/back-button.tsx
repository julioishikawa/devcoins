'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <Button
      onClick={handleBack}
      className="flex items-center justify-center gap-2 p-2 w-8 h-8 bg-zinc-800 hover:bg-zinc-600 rounded-full sm:bg-transparent sm:hover:bg-transparent text-zinc-200 sm:hover:text-zinc-300 absolute top-24 left-10 sm:left-14"
    >
      <ArrowLeft className="min-w-4 min-h-4" />
      <span className="hidden sm:flex">Voltar</span>
    </Button>
  )
}

export default BackButton
