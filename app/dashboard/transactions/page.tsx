import Pagination from '@/app/ui/transactions/pagination'
import Search from '@/app/ui/search'
import Table from '@/app/ui/transactions/table'
import { CreateTransaction } from '@/app/ui/transactions/buttons'
import { lusitana } from '@/app/ui/fonts'
import { TransactionsTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { string } from 'zod'
import {  fetchTransactionsPages } from '@/app/lib/data'

export default async function TransactionsPage({ searchParams, }:
  { searchParams?: { search?: string, page?: string } }) {

  const query = searchParams?.search || ''
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchTransactionsPages(query)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Movimientos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        <CreateTransaction />
      </div>
      {/* suspense solo se ejecuta una vez por defecto, se le agrega el key para forzar la renderización del fallback cada vez que hace el fetching */}
      <Suspense key={query + currentPage} fallback={<TransactionsTableSkeleton />}> 
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}