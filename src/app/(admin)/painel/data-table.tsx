'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

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
import LoadingSpinner from '@/components/after-search-loading'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

export type User = {
  id: string
  email: string
  username: string
  banned: boolean
  amount: number
}

export function AdminPanel() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: () => <div className="text-zinc-300">ID</div>,
      cell: ({ row }) => <div className="text-sm">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'username',
      header: () => <div className="text-zinc-300">Username</div>,
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('username')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent hover:text-slate-600"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <div className="text-zinc-300">Email</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-zinc-300">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'))

        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount)

        return <div className="font-medium">{formatted}</div> // Supondo que você queira o valor em BRL
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        const [isBanned, setIsBanned] = useState(user.banned) // Estado local para armazenar o status atualizado

        const handleBanUser = async () => {
          try {
            const response = await fetch(
              `/api/users/ban-type/ban-user/${user.id}`,
              {
                method: 'POST',
              }
            )

            const result = await response.json()

            if (!response.ok) {
              throw new Error(result.error || 'Erro ao banir o usuário')
            }

            toast.success(`Usuário ${user.username} banido com sucesso!`)
            updateUserStatus(user.id, true)
            setIsBanned(true)
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
              `/api/users/ban-type/unban-user/${user.id}`,
              {
                method: 'POST',
              }
            )

            if (!response.ok) {
              throw new Error('Erro ao desbanir o usuário')
            }

            toast.success(`Usuário ${user.username} desbanido com sucesso!`)
            updateUserStatus(user.id, false)
            setIsBanned(false)
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
      },
    },
  ]

  const updateUserStatus = (userId: string, banned: boolean) => {
    setData((prevData) =>
      prevData.map((user) => (user.id === userId ? { ...user, banned } : user))
    )
  }

  async function fetchUsersAndBalances() {
    try {
      const response = await fetch('/api/users/get-all-users')
      if (!response.ok) {
        throw new Error('Erro ao buscar os usuários')
      }

      const users = await response.json()

      const usersWithAmounts = await Promise.all(
        users.map(async (user: User) => {
          const balanceResponse = await fetch(`/api/balances?userId=${user.id}`)
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

      setData(usersWithAmounts)
      setLoading(false)
    } catch (error) {
      console.error('Erro ao buscar os usuários:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsersAndBalances()
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="w-full py-10 px-20">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-black placeholder:text-zinc-300 text-zinc-50"
        />
      </div>

      <div className="rounded-md border">
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-black"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-black"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
