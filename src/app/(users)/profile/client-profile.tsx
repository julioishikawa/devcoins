'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import Header from '@/components/header/header-component'
import Footer from '@/components/footer'
import { currencySymbols, formatCurrency } from '@/utils/currency-refactor'
import CurrencySelect from '@/components/currency-select'
import ProfileAvatarUser from '@/components/profile-avatar-user'
import { fetchCoinDetails } from '@/utils/fetch-coin-details'
import ProfileLoading from './loading'
import LoadingSpinner from '@/components/loading-spinner'
import BackButton from '@/components/back-button'

export default function ClientProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [balances, setBalances] = useState<UserBalance[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL')
  const [loadingInitialBalances, setLoadingInitialBalances] =
    useState<boolean>(false)
  const [loadingBalances, setLoadingBalances] = useState<boolean>(false)
  const [balancesLoaded, setBalancesLoaded] = useState<boolean>(false)
  const router = useRouter()

  const totalBalanceValue = balances.reduce((acc, balance) => {
    return acc + (balance.totalValueInCurrencies[selectedCurrency] || 0)
  }, 0)

  const handleUpdateProfile = () => {
    router.push('/profile/update')
  }

  const fetchUserBalances = useCallback(async () => {
    if (!user) return

    setLoadingInitialBalances(true)

    try {
      const response = await fetch(
        `/api/users/user-balance?userId=${user.id}&selectedCurrency=${selectedCurrency}`
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
      setLoadingInitialBalances(false)
    }
  }, [user, selectedCurrency])

  const fetchCurrencyChanged = useCallback(async () => {
    if (!user) return

    setLoadingBalances(true)

    try {
      const response = await fetch(
        `/api/users/user-balance?userId=${user.id}&selectedCurrency=${selectedCurrency}`
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
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/users/user-session')
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

  useEffect(() => {
    if (balancesLoaded) {
      fetchCurrencyChanged()
    }
  }, [balancesLoaded, selectedCurrency, fetchCurrencyChanged])

  if (!user) {
    return <ProfileLoading />
  }

  return (
    <section className="flex flex-col justify-between h-screen">
      <Header />

      <BackButton />

      <main className="p-10 lg:px-20 flex flex-col items-center gap-10">
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
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

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-5">
            <Button
              className="bg-zinc-700 hover:bg-zinc-800 text-white"
              onClick={handleUpdateProfile}
            >
              Atualizar Perfil
            </Button>

            {!balancesLoaded && !loadingInitialBalances && (
              <Button
                className="bg-zinc-700 hover:bg-zinc-800 text-white"
                onClick={fetchUserBalances}
              >
                Exibir Saldos
              </Button>
            )}
          </div>

          {loadingInitialBalances && (
            <div className="mt-5">
              <p className="text-white mt-3">
                Carregando saldos
                <span className="animate-dots"></span>
              </p>
            </div>
          )}

          {balancesLoaded && !loadingInitialBalances && (
            <div className="mt-5">
              <h2 className="mb-5 text-xl font-bold">Detalhes dos saldos:</h2>

              <CurrencySelect
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
              />

              <div className="relative flex flex-col justify-center">
                {loadingBalances && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <LoadingSpinner />
                  </div>
                )}

                <ul
                  className={`flex flex-col gap-5 mt-5 p-3 bg-zinc-800 rounded-lg shadow-lg ${
                    loadingBalances ? 'filter blur-sm' : ''
                  } overflow-auto scrollbar max-h-80 w-full border border-zinc-700`}
                >
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
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </section>
  )
}
