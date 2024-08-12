import { SearchInput } from './search-input'
import { UserAvatar } from './user-avatar'

import LogoutButton from './logout-button'
import SessionProviderWrapper from '@/utils/session-provider'

export default async function Header() {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <div className="flex items-center gap-5">
      <h1 className="px-10">logo</h1>

      <SearchInput />

      <SessionProviderWrapper>
        <UserAvatar />
      </SessionProviderWrapper>

      <LogoutButton />
    </div>
  )
}
