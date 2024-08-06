import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'
import { LogOut } from 'lucide-react'

export default async function Header() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <div className="flex items-center gap-5">
      <h1>logo</h1>

      <SearchInput />

      <UserAvatar />

      <LogOut className="cursor-pointer" />
    </div>
  )
}
