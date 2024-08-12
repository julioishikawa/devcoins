'use client'

import { useSession } from 'next-auth/react'

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Carregando...</div>
  if (status === 'unauthenticated') return <div>Usuário não autenticado</div>

  const user = session?.user

  return (
    <div>
      <h1>Nome: {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.username}</p>
      <p>Avatar: {user?.avatar || 'null'}</p>
      <p>Admin: {user?.is_admin ? 'Sim' : 'Não'}</p>
    </div>
  )
}
