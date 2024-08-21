import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'

import LogoutButton from './logout-button'
import Logo from './logo'

export default async function Header() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <header className="flex items-center gap-5 p-6">
      <Logo />

      <SearchInput />

      <UserAvatar />

      <LogoutButton />
    </header>
  )
}
