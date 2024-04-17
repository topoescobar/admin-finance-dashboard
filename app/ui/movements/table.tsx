import Image from 'next/image'
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/movements/buttons'
import InvoiceStatus from '@/app/ui/movements/status'
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils'
import { fetchFilteredMovements } from '@/app/lib/data'
import './styles/movements.css'
export default async function MovementsTable({ query, currentPage, }:{ query: string; currentPage: number }) {

  // const inoices = await fetchFilteredInvoices(query, currentPage)
  const movements = await fetchFilteredMovements(query, currentPage)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0 dark:bg-slate-800 dark:text-white">
          {/* MOBILE */}
          <div className="md:hidden">
            {movements?.map((tx) => (
              <div key={tx.id} className="mb-2 w-full rounded-md bg-white p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={tx.image_url == "" ? "/customers/noavatar.png" : tx.image_url}
                        className="mr-2 rounded-full"
                        width={28} height={28}
                        alt={`${tx.name}'s profile picture`}
                      />
                      <p>{tx.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{tx.email}</p>
                  </div>
                  <InvoiceStatus status={tx.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      $ {tx.value} / tokens: {tx.tokens}
                    </p>
                    <p>{formatDateToLocal(tx.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={tx.id} />
                    <DeleteInvoice id={tx.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP */}
          <table className="hidden min-w-full text-gray-900 md:table dark:text-white">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6"> Cliente </th>
                <th scope="col" className="px-3 py-5 font-medium"> Valor </th>
                <th scope="col" className="px-3 py-5 font-medium"> Tokens </th>
                <th scope="col" className="px-3 py-5 font-medium"> Fondo </th>
                <th scope="col" className="px-3 py-5 font-medium"> Fecha </th>
                <th scope="col" className="px-3 py-5 font-medium"> Status </th>
                <th scope="col" className="relative py-3 pl-6 pr-3"> <span className="sr-only">Actions</span> </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-700">
              {movements?.map((tx) => (
                <tr
                  key={tx.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image className="mr-2 rounded-full profileImage"
                        src={tx.image_url == "" ? "/customers/noavatar.png" : tx.image_url}
                        width={28} height={28}
                        alt={`${tx.name}'s profile picture`}
                      />
                      <p>{tx.name}</p>
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
                    {formatDateToLocal(tx.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={tx.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={tx.id} />
                      <DeleteInvoice id={tx.id} />
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
