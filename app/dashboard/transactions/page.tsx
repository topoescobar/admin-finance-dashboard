import Pagination from '@/app/ui/transactions/pagination'
import Search from '@/app/ui/search'
import TransactionsTable from '@/app/ui/transactions/transactions-table'
import { lusitana } from '@/app/ui/fonts'
import { TransactionsTableSkeleton } from '@/app/ui/skeletons'
import { Suspense } from 'react'
import { fetchTransactionsPages, fetchUserTxPages } from '@/app/lib/data'
import UserTransactionsTable from '@/app/ui/user-transactions/user-transactions-table'
import { getUserData } from '@/app/lib/user'

export default async function TransactionsPage({ searchParams, }:
   {
      searchParams?: Promise<{ search?: string, page?: string }>
   }) {
      
   const query = (await searchParams)?.search || ''
   const currentPage = Number((await searchParams)?.page) || 1
   const userData = await getUserData()
   const totalPages = await fetchUserTxPages(query, userData.id)


   return (
      <div className="w-full">
         <div className="flex w-full items-center justify-between">
            <h1 className={`${lusitana.className} text-2xl`}>Transacciones</h1>
         </div>

         <Suspense key={query + currentPage} fallback={<TransactionsTableSkeleton />}>
            <UserTransactionsTable query={query} currentPage={currentPage} userid={userData.id} />
         </Suspense>

         <div className="mt-5 flex w-full justify-center">
            {/* <Pagination totalPages={totalPages} /> */}
         </div>
      </div>
   )
}