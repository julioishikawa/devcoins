import { SearchInput } from './search-input'
import { Input } from './ui/input'
import { UserAvatar } from './user-avatar'
import { Search, LogOut } from 'lucide-react'

export default function Header() {
  return (
    <div className="flex items-center gap-5">
      <h1>logo</h1>

      <SearchInput />

      <UserAvatar />

      <LogOut className="cursor-pointer" />
    </div>
  )
}
