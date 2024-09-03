import { SearchInput } from './search-input'
import { HeaderAvatarUser } from './header-avatar-user'

import LogoutButton from './logout-button'
import Logo from './logo'

export default function Header() {
  return (
    <div className="flex items-center gap-5 p-4 bg-zinc-800">
      <Logo />

      <SearchInput />

      <HeaderAvatarUser />

      <LogoutButton />
    </div>
  )
}
