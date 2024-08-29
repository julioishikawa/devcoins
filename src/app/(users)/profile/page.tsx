'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { currencySymbols, formatCurrency } from '@/utils/currency-refactor'
import CurrencySelect from '@/components/currency-select'
import ProfileAvatarUser from '@/components/profile-avatar-user'
import { fetchCoinDetails } from '@/utils/fetch-coin-details'
import ProfileLoading from './loading'

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

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [balances, setBalances] = useState<UserBalance[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL')
  const [loadingBalances, setLoadingBalances] = useState<boolean>(false)
  const [balancesLoaded, setBalancesLoaded] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/users/user')
        if (!response.ok) {
          throw new Error('Erro ao buscar o perfil do usuário')
        }

        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error('Erro ao buscar o perfil do usuário:', error)
      }
    }

    fetchUserProfile()
  }, [])

  const fetchUserBalances = useCallback(async () => {
    if (!user) return

    setLoadingBalances(true)

    try {
      const response = await fetch(
        `/api/balances?userId=${user.id}&selectedCurrency=${selectedCurrency}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch user balances')
      }

      const data = await response.json()
      const balancesWithImages = await Promise.all(
        data.balances.map(async (balance: UserBalance) => {
          const coinDetails = await fetchCoinDetails(
            balance.coin_code,
            selectedCurrency
          )
          return {
            ...balance,
            imageUrl: coinDetails.imageUrl,
          }
        })
      )
      setBalances(balancesWithImages)
      setBalancesLoaded(true)
    } catch (error) {
      console.error('Erro ao buscar os saldos do usuário:', error)
    } finally {
      setLoadingBalances(false)
    }
  }, [user, selectedCurrency])

  useEffect(() => {
    if (balancesLoaded) {
      fetchUserBalances()
    }
  }, [balancesLoaded, selectedCurrency, fetchUserBalances])

  const handleUpdateProfile = () => {
    router.push('/profile/update')
  }

  const totalBalanceValue = balances.reduce((acc, balance) => {
    return acc + (balance.totalValueInCurrencies[selectedCurrency] || 0)
  }, 0)

  if (!user) {
    return <ProfileLoading />
  }

  return (
    <section className="flex flex-col justify-between h-screen">
      <Header />

      <main className="p-10 lg:px-20 flex flex-col items-center gap-10">
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-center gap-5">
            <ProfileAvatarUser name={user.name} avatarUrl={user.avatar} />

            <div>
              <p>
                <strong>Nome:</strong> {user.name}
              </p>

              <p>
                <strong>Usuário:</strong> {user.username}
              </p>

              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          {!balancesLoaded && (
            <Button
              className="bg-zinc-700 hover:bg-zinc-800 text-white mt-5 mr-5"
              onClick={() => setBalancesLoaded(true)}
            >
              Exibir Saldos
            </Button>
          )}

          <Button
            className="bg-zinc-700 hover:bg-zinc-800 text-white mt-5"
            onClick={handleUpdateProfile}
          >
            Atualizar Perfil
          </Button>

          {balancesLoaded && (
            <div className="mt-5">
              <h2 className="mb-5 text-xl font-bold">Detalhes dos saldos:</h2>

              <CurrencySelect
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
              />

              {loadingBalances ? (
                <div className="mt-5">Carregando...</div>
              ) : (
                <>
                  <ul className="flex flex-col gap-8 mt-5">
                    {balances.length > 0 ? (
                      balances.map((balance, index) => (
                        <li
                          key={index}
                          className="text-white flex flex-col gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src={balance.imageUrl}
                              alt={balance.coin_code}
                              width={30}
                              height={30}
                              className="inline-block"
                            />

                            <p>{`${balance.coin_code}`}</p>
                          </div>

                          <p>{`Quantidade: ${balance.quantity}`}</p>

                          <p>
                            {`Valor: ${formatCurrency(
                              balance.totalValueInCurrencies[selectedCurrency],
                              currencySymbols[selectedCurrency]
                            )}`}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="text-white">Nenhum saldo disponível</li>
                    )}
                  </ul>
                  <div className="text-white mt-5">
                    <p>
                      {`Soma total: `}
                      <strong>{`${formatCurrency(
                        totalBalanceValue,
                        currencySymbols[selectedCurrency]
                      )}`}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </section>
  )
}
