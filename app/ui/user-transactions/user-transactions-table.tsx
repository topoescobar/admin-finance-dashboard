import Image from 'next/image'
import { UpdateTransaction, DeleteTransaction } from '@/app/ui/transactions/buttons'
import TransactionStatus from '@/app/ui/transactions/status'
import { formatDateToLocal, formatCurrency, dateToLocal } from '@/app/lib/utils'
import { fetchFilteredTransactions, fetchUserTransactions } from '@/app/lib/data'
import { BriefcaseIcon, CalendarDaysIcon, CurrencyBangladeshiIcon, CurrencyDollarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default async function UserTransactionsTable({ query, currentPage, userid }:
   { query: string; currentPage: number, userid: string }) {

   const Transactions = await fetchUserTransactions(query, currentPage, userid)

   return (

      <div className="mt-6 flow-root">
         <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0 dark:bg-slate-800 dark:text-white">

               {/* MOBILE */}
               <div className="md:hidden">
                  {Transactions?.map((tx) => (
                     <div key={tx.id} className="mb-2 w-full rounded-md bg-white p-4 dark:bg-slate-900">
                        <div className="flex items-center justify-between border-b pb-4">
                           <div>
                              <div className="mb-2 flex items-center">
                                 <CalendarDaysIcon className='mr-2 h-6 w-6' />
                                 <p>{dateToLocal(tx.date)}</p>
                              </div>
                           </div>
                           <TransactionStatus status={tx.status} value={tx.value} />
                        </div>
                        <div className="flex w-full items-center justify-between pt-4">
                           <div>
                              <span className='flex'>
                                 <BriefcaseIcon className='h-6 w-6 mr-2' />
                                 <p>Boveda: {tx.vault} </p>
                              </span>
                              <span>
                                 <p className="text-xl font-medium flex">
                                    <CurrencyDollarIcon className='h-6 w-6 mr-2' />
                                    {tx.value}
                                 </p>
                                 <p className='text-l flex'>
                                    <CurrencyBangladeshiIcon className='h-6 w-6 mr-2' />
                                    Cant. tokens: {tx.tokens}
                                 </p>
                              </span>
                              <span>
                                 {tx.notes && <p className="text-sm text-gray-400">{tx.notes}</p>}
                              </span>
                           </div>
                           <div className="flex justify-end gap-2">

                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               {/* DESKTOP */}
               <table className="hidden min-w-full text-gray-900 md:table dark:text-white">
                  <thead className="rounded-lg text-left text-sm font-normal">
                     <tr>
                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6"> <CalendarDaysIcon className="h-5 w-5 inline" /> Fecha </th>
                        <th scope="col" className="px-3 py-5 font-medium"> <CurrencyDollarIcon className="h-5 w-5 inline" /> Valor </th>
                        <th scope="col" className="px-3 py-5 font-medium"> <CurrencyBangladeshiIcon className="h-5 w-5 inline" /> Tokens </th>
                        <th scope="col" className="px-3 py-5 font-medium"> <BriefcaseIcon className="h-5 w-5 inline" /> Fondo </th>
                        <th scope="col" className="px-3 py-5 font-medium"> <InformationCircleIcon className="h-5 w-5 inline" /> Status </th>
                     </tr>
                  </thead>

                  <tbody className="bg-white dark:bg-slate-700">
                     {Transactions?.map((tx) => (
                        <tr
                           key={tx.id}
                           className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                        >
                           <td className="whitespace-nowrap py-3 pl-6 pr-3">
                              <div className="flex items-center gap-3">
                                 <p>{(dateToLocal(tx.date))}</p>
                              </div>
                           </td>
                           <td className="whitespace-nowrap px-3 py-3">
                              $ {tx.value}
                           </td>
                           <td className="whitespace-nowrap px-3 py-3">
                              {tx.tokens}
                           </td>
                           <td className="whitespace-nowrap px-3 py-3">
                              {tx.vault}
                           </td>
                           <td className="whitespace-nowrap px-3 py-3">
                              <TransactionStatus status={tx.status} value={tx.value} />
                              <div>
                                 {tx.notes && <p className="text-sm text-gray-400">{tx.notes}</p>}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}
