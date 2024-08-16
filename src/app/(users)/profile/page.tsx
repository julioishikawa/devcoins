'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { CldUploadButton } from 'next-cloudinary'
import { cloudinaryConfig } from '../../../../cloudinary.config'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProfile() {
    try {
      const response = await fetch('/api/users/user')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      console.log('Profile data:', data)

      setProfile(data)
      setUsername(data.username)
      setEmail(data.email)
      setName(data.name)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      const hasChanges =
        username !== profile.username ||
        email !== profile.email ||
        name !== profile.name

      setIsModified(hasChanges)
    }
  }, [username, email, name, profile])

  const handleAvatarUpload = (result: any) => {
    if (result?.info?.secure_url) {
      setProfile({ ...profile, avatar: result.info.secure_url })
    }
  }

  const handleSaveChanges = async () => {
    try {
      const updateResponse = await fetch('/api/users/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          name,
          avatar: profile?.avatar || null,
        }),
      })

      if (!updateResponse.ok) {
        throw new Error('Failed to save changes')
      }

      const result = await updateResponse.json()

      if (result.success) {
        console.log('faça o login novamente para mostrar as mudanças')
      } else {
        console.error('Error saving changes:', result.error)
      }
    } catch (error) {
      console.error('Error in handleSaveChanges:', error)
      setError('Failed to save changes')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-500">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Usuário não autenticado</div>
      </div>
    )
  }

  return (
    <section className="flex flex-col items-center pt-20">
      <main className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <Avatar className="min-w-20 min-h-20">
              <AvatarImage
                src={profile.avatar}
                alt={`Avatar de ${profile.name}`}
                className="object-cover"
              />
              <AvatarFallback className="text-3xl bg-zinc-700 text-zinc-400">
                {profile.name ? profile.name.charAt(0) : '?'}
              </AvatarFallback>
            </Avatar>

            <CldUploadButton
              signatureEndpoint="/api/cloudinary/generate-upload-signature"
              uploadPreset={cloudinaryConfig.upload_preset}
              onSuccess={handleAvatarUpload}
              className="absolute -bottom-3 -right-1 bg-zinc-600 hover:bg-zinc-500 rounded-full p-2"
            >
              <span className="text-zinc-400">📷</span>
            </CldUploadButton>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div>
              <p className="text-lg">Username</p>
              <Input
                className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <p className="text-lg">Email</p>
              <Input
                className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <p className="text-lg">Nome</p>
              <Input
                className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <p className="text-lg">Admin</p>
              <Input
                className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                value={profile.is_admin ? 'Sim' : 'Não'}
                disabled
              />
            </div>
          </div>
        </div>

        {isModified && (
          <div className="text-right mt-4">
            <Button
              className="bg-zinc-900 hover:bg-zinc-700"
              onClick={handleSaveChanges}
            >
              Salvar alterações
            </Button>
          </div>
        )}
      </main>
    </section>
  )
}
