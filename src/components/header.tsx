import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'

import LogoutButton from './logout-button'
import Logo from './logo'

export default function Header() {
  return (
    <header className="flex items-center gap-5 p-4 bg-zinc-800">
      <Logo />

      <SearchInput />

      <UserAvatar />

      <LogoutButton />
    </header>
  )
}
