'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import CloudinaryUploadButton from '@/components/cloudinary-upload-button'
import ProfileAvatarUser from '@/components/profile-avatar-user'
import ProfileLoading from './loading'
import { cloudinaryConfig } from '../../../../../cloudinary.config'
import Footer from '@/components/footer'
import Header from '@/components/header/header-component'
import BackButton from '@/components/back-button'

export default function ClientUpdateProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [initialProfile, setInitialProfile] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleUser, setIsGoogleUser] = useState(false)

  async function fetchProfile() {
    try {
      const response = await fetch('/api/users/user-session')

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()

      console.log('User profile data:', data)

      setProfile(data)
      setInitialProfile(data)
      setUsername(data.username)
      setEmail(data.email)
      setName(data.name)

      setIsGoogleUser(data.isGoogleUser)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    if (initialProfile) {
      const hasChanges =
        username !== initialProfile.username ||
        email !== initialProfile.email ||
        name !== initialProfile.name ||
        profile?.avatar !== initialProfile.avatar ||
        password !== '' ||
        confirmPassword !== ''

      setIsModified(hasChanges)
    }
  }, [
    username,
    email,
    name,
    password,
    confirmPassword,
    profile,
    initialProfile,
  ])

  const handleAvatarUpload = (result: any) => {
    if (result?.secure_url) {
      setProfile({ ...profile, avatar: result.secure_url })
    }
  }

  async function handleSaveChanges(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsSaving(true)

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      setIsSaving(false)
      return
    }

    try {
      const updateResponse = await fetch('/api/users/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: profile?.avatar || null,
          username,
          email,
          name,
          password: password || undefined,
          confirmPassword: confirmPassword || undefined,
        }),
      })

      const result = await updateResponse.json()

      if (!updateResponse.ok) {
        throw new Error(result.error || 'Failed to save changes')
      }

      if (result.success) {
        setProfile(result.user)
        setInitialProfile(result.user)

        setPassword('')
        setConfirmPassword('')

        setIsModified(false)

        toast.success('Perfil atualizado com sucesso')
      } else {
        toast.error('Erro ao salvar as alterações: ' + result.error)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <ProfileLoading />
  }

  return (
    <div className="h-screen flex flex-col justify-between">
      <Header />

      <BackButton />
      <section className="p-10 mx-auto">
        <form
          onSubmit={handleSaveChanges}
          className="bg-zinc-800 p-6 rounded-lg shadow-lg max-w-sm w-full"
        >
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <ProfileAvatarUser
                name={profile.name}
                avatarUrl={profile.avatar}
              />

              <CloudinaryUploadButton
                onUploadSuccess={handleAvatarUpload}
                signatureEndpoint="/api/cloudinary/generate-upload-signature"
                uploadPreset={
                  cloudinaryConfig.upload_preset || 'default_preset'
                }
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div>
                <p className="text-lg">Usuário</p>
                <Input
                  className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <p className="text-lg">Email</p>
                <Input
                  className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isGoogleUser || isSaving}
                />
              </div>

              <div>
                <p className="text-lg">Nome</p>
                <Input
                  className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <p className="text-lg">Nova senha</p>
                <Input
                  type="password"
                  className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSaving}
                />
              </div>

              <div>
                <p className="text-lg">Confirmar senha</p>
                <Input
                  type="password"
                  className="text-lg bg-zinc-900 p-2 rounded-md text-zinc-400 border-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>

          {isModified && (
            <div className="text-right mt-4">
              <Button
                type="submit"
                className="bg-zinc-900 hover:bg-zinc-700"
                disabled={isSaving}
              >
                {isSaving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          )}
        </form>
      </section>

      <Footer />
    </div>
  )
}
