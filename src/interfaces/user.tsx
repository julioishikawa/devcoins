interface UserHeader {
  id: string
  avatar: string
  name: string
  is_admin: boolean
}

interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string
}

interface UserBalance {
  coin_code: string
  quantity: number
  totalValueInCurrencies: Record<string, number>
  imageUrl: string
}

interface AvatarUserProps {
  name: string
  avatarUrl: string
}
