import { SearchInput } from './search-input'
import { UserDataHeader } from './user-data-header'

import LogoutButton from './logout-button'
import Logo from './logo'

export default function Header() {
  return (
    <div className="flex items-center gap-5 p-4 bg-zinc-800">
      <Logo />

      <SearchInput />

      <UserDataHeader />

      <LogoutButton />
    </div>
  )
}
