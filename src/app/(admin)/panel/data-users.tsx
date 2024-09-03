'use client'

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import LoadingSpinner from '@/components/loading-spinner'

export type User = {
  id: string
  email: string
  username: string
  amount: number
  banned: boolean
}

export function DataUsers() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [bannedUsers, setBannedUsers] = useState<{ [key: string]: boolean }>({})
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [page, setPage] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')

  function ActionCell({
    user,
    isBanned,
    onBanToggle,
  }: {
    user: User
    isBanned: boolean
    onBanToggle: (userId: string, isBanned: boolean) => void
  }) {
    const handleBanUser = async () => {
      try {
        const response = await fetch(
          `/api/users/status-type/ban-user/${user.id}`,
          {
            method: 'POST',
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Erro ao banir o usuário')
        }

        toast.success(`Usuário ${user.username} banido com sucesso!`)
        onBanToggle(user.id, true)
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Erro desconhecido')
        }
        console.error('Erro ao banir o usuário:', error)
      }
    }

    const handleUnbanUser = async () => {
      try {
        const response = await fetch(
          `/api/users/status-type/unban-user/${user.id}`,
          {
            method: 'POST',
          }
        )

        if (!response.ok) {
          throw new Error('Erro ao desbanir o usuário')
        }

        toast.success(`Usuário ${user.username} desbanido com sucesso!`)
        onBanToggle(user.id, false)
      } catch (error) {
        console.error('Erro ao desbanir o usuário:', error)
      }
    }

    return (
      <div className="flex justify-end">
        {isBanned ? (
          <Button variant="secondary" onClick={handleUnbanUser}>
            Desbanir
          </Button>
        ) : (
          <Button variant="destructive" onClick={handleBanUser}>
            Banir
          </Button>
        )}
      </div>
    )
  }

  async function fetchUsersAndBalances() {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/users/get-all-users?limit=10&offset=${page * 10}`
      )
      if (!response.ok) {
        throw new Error('Erro ao buscar os usuários')
      }

      const { users, totalUsers } = await response.json()

      const usersWithAmounts = await Promise.all(
        users.map(async (user: User) => {
          const balanceResponse = await fetch(
            `/api/users/user-balance?userId=${user.id}`
          )
          if (!balanceResponse.ok) {
            throw new Error('Erro ao buscar os saldos do usuário')
          }

          const { balances } = await balanceResponse.json()

          const totalAmount = balances.reduce((acc: number, balance: any) => {
            return acc + (balance.totalValueInCurrencies['BRL'] || 0)
          }, 0)

          return {
            ...user,
            amount: totalAmount,
          }
        })
      )

      const initialBannedState = usersWithAmounts.reduce((acc, user) => {
        acc[user.id] = user.banned
        return acc
      }, {} as { [key: string]: boolean })

      setBannedUsers(initialBannedState)
      setData(usersWithAmounts)
      setTotalUsers(totalUsers)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error)
      setLoading(false)
    }
  }

  async function searchUsers(query: string) {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/users/users-search?limit=10&offset=${page * 10}&search=${query}`
      )
      if (!response.ok) {
        throw new Error('Erro ao buscar os usuários')
      }

      const { users, totalUsers } = await response.json()

      const usersWithAmounts = await Promise.all(
        users.map(async (user: User) => {
          const balanceResponse = await fetch(
            `/api/users/user-balance?userId=${user.id}`
          )
          if (!balanceResponse.ok) {
            throw new Error('Erro ao buscar os saldos do usuário')
          }

          const { balances } = await balanceResponse.json()

          const totalAmount = balances.reduce((acc: number, balance: any) => {
            return acc + (balance.totalValueInCurrencies['BRL'] || 0)
          }, 0)

          return {
            ...user,
            amount: totalAmount,
          }
        })
      )

      const initialBannedState = usersWithAmounts.reduce((acc, user) => {
        acc[user.id] = user.banned
        return acc
      }, {} as { [key: string]: boolean })

      setBannedUsers(initialBannedState)
      setData(usersWithAmounts)
      setTotalUsers(totalUsers)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersAndBalances()
  }, [page])

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      fetchUsersAndBalances() // Se o campo de busca estiver vazio, carrega todos os usuários
      return
    }
    searchUsers(searchQuery)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleBanToggle = (userId: string, isBanned: boolean) => {
    setBannedUsers((prevState) => ({
      ...prevState,
      [userId]: isBanned,
    }))
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: () => <div className="text-zinc-300">ID</div>,
      cell: ({ row }) => <div className="text-sm">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'username',
      header: () => <div className="text-zinc-300">Usuário</div>,
      cell: ({ row }) => <div>{row.getValue('username')}</div>,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <div className="flex items-center text-zinc-300 hover:text-zinc-500">
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </div>
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-zinc-300">Saldo</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))

        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <ActionCell
          user={row.original}
          isBanned={bannedUsers[row.original.id]}
          onBanToggle={handleBanToggle}
        />
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return <LoadingSpinner />
  }

  const currentDisplayCount = page * 10 + data.length

  return (
    <div className="w-full py-5 px-20">
      <div className="flex items-center py-4 space-x-2">
        <Input
          placeholder="Procure pelo usuário"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-sm bg-black placeholder:text-zinc-300 text-zinc-50"
        />
        <Button
          onClick={handleSearch}
          className="bg-zinc-700 hover:bg-zinc-600"
        >
          Buscar
        </Button>
      </div>

      <div className="rounded-md border overflow-auto max-h-[600px]">
        <div className="overflow-y-auto">
          <Table>
            <TableHeader className="hover:bg-transparent">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-zinc-300">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {currentDisplayCount} of {totalUsers} usuário(s) exibido(s).
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-black"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || loading}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={data.length < 10 || loading}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
