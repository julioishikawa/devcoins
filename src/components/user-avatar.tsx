import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserAvatar() {
  return (
    <Avatar className="cursor-pointer">
      <AvatarImage
        src="https://github.com/julioishikawa.png"
        alt="@julioishikawa photo"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
