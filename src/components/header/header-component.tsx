import Logo from '../logo'
import LogoutButton from '../logout-button'
import { SearchInput } from '../search-input'
import { UserDataHeader } from '../user-data-header'
import HeaderMobile from './header-mobile'

export default function Header() {
  return (
    <div className="flex items-center p-4 h-[72px] bg-zinc-800">
      <HeaderMobile />

      <div className="w-full hidden sm:flex items-center justify-between gap-5">
        <Logo />
        <SearchInput />
        <UserDataHeader />
        <LogoutButton />
      </div>
    </div>
  )
}
