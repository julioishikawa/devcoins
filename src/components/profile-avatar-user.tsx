import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function ProfileAvatarUser({
  name,
  avatarUrl,
}: AvatarUserProps) {
  return (
    <Avatar className="min-w-20 min-h-20">
      <AvatarImage
        src={avatarUrl}
        alt={`Avatar de ${name}`}
        className="object-cover"
      />
      <AvatarFallback className="text-3xl bg-zinc-700">
        {name ? name.charAt(0) : '?'}
      </AvatarFallback>
    </Avatar>
  )
}
