import Pagination from '@/app/ui/movements/pagination'
import Search from '@/app/ui/search'
import Table from '@/app/ui/movements/table'
import { CreateInvoice } from '@/app/ui/movements/buttons'
import { lusitana } from '@/app/ui/fonts'
import { InvoicesTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { string } from 'zod'
import { fetchInvoicesPages, fetchMovementsPages } from '@/app/lib/data'

export default async function movementsPage({ searchParams, }:
  { searchParams?: { search?: string, page?: string } }) {

  const query = searchParams?.search || ''
  const currentPage = Number(searchParams?.page) || 1
  const totalPages = await fetchMovementsPages(query)

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Movimientos</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        <CreateInvoice />
      </div>
      {/* suspense solo se ejecuta una vez por defecto, se le agrega el key para forzar la renderización del fallback cada vez que hace el fetching */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}> 
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  )
}