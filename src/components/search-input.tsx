'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent } from 'react'

import { Input } from '@/components/ui/input'

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('q')

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData)

    const query = data.q as string

    if (!query) {
      return null
    }

    router.push(`/search?q=${query}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full items-center gap-3 rounded-md bg-zinc-900 pl-3 focus-within:ring-2 focus-within:ring-white"
    >
      <Search className="w-5 h-5 text-zinc-500" />

      <Input
        type="text"
        name="q"
        defaultValue={query ?? ''}
        placeholder="Buscar moeda por nome..."
        className="bg-zinc-900 text-zinc-50 placeholder:text-zinc-500 border-none p-0 focus-visible:ring-0 ring-offset-0 focus-visible:ring-offset-0 dark:ring-offset-0 dark:focus-visible:ring-offset-0"
      />
    </form>
  )
}
