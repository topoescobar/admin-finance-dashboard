import Image from 'next/image'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'
import './styles/customers.css'
import { cachedLastPrices, fetchUsersInvestment } from '@/app/lib/data'
import { DeleteCustomer, UpdateCustomer, ViewCustomer } from './buttons'
import CustomersEmail from './customers-email'
import { CopyText } from './client-componets'

export default async function CustomersTable({ query }:
  { query: string }) {

  const usersInvestments = await fetchUsersInvestment(query)
  const { FCAprice, FCDprice } = await cachedLastPrices()

  return (

    <div className="mt-6 flow-root">
      <div className='mb-2'>FCA price: {FCAprice},  FCD price: {FCDprice}</div>
      <div className="sm:overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-lg bg-gray-50 p-2 sm:p-2 dark:bg-gray-700">

            {/* MOBILE */}
            <div className="md:hidden">
              {usersInvestments?.map((user) => {
                const fcaValue = user.fca_tokens * FCAprice;
                const fcdValue = user.fcd_tokens * FCDprice;
                const fcaPnl = fcaValue - user.fca_deposited_usd;
                const fcdPnl = fcdValue - user.fcd_deposited_usd;

                return (
                  <div
                    key={user.id}
                    className="mb-2 w-full rounded-md bg-white p-4 bg-gradient-to-br dark:from-indigo-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100"
                  >
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <div className="mb-2 flex items-center">
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.image_url === null || user.image_url.trim() === '' ? '/customers/noavatar.png' : user.image_url}
                              className="rounded-full "
                              alt={`${user.email}'s profile picture`}
                              width={28}
                              height={28}
                            />
                            <p>{user.email.split('@')[0]}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 emailContainerStyle" >
                          {user.email}
                        </p>
                      </div>
                      <div className='flex gap-2'>
                        <ViewCustomer name={user.email} />
                        <UpdateCustomer id={user.id} />
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between py-5 border-b">
                      <div className="flex w-1/2 flex-col">
                        <p className="text-lg font-medium">FCA: Ahorro</p>
                        <p className="text-sm font-normal">{fcaValue.toFixed(2)} USD</p>
                        <p className="text-sm font-normal">
                          PNL: {fcaPnl.toFixed(2)} USD
                        </p>
                        <p className="text-xs font-light">{(user.fca_tokens * 1).toFixed(2)} tokens </p>
                      </div>
                      <div className="flex w-1/2 flex-col">
                        <p className="text-lg font-medium">FCD: Dinámico</p>
                        <p className="text-sm font-normal">{fcdValue.toFixed(2)} USD</p>
                        <p className="text-sm font-normal">
                          PNL: {fcdPnl.toFixed(2)} USD
                        </p>
                        <p className="text-xs font-light">{(user.fcd_tokens * 1).toFixed(2)} tokens</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">

                    </div>
                  </div>
                )
              })}
            </div>

            {/* DESKTOP */}
            <table className="hidden min-w-full rounded-md text-gray-900 md:table dark:bg-slate-950 dark:text-slate-100">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6"> Email </th>
                  <th scope="col" className="px-3 py-5 font-medium"> FCA val actual</th>
                  <th scope="col" className="px-3 py-5 font-medium"> FCA pnl </th>
                  <th scope="col" className="px-4 py-5 font-medium"> FCD val actual</th>
                  <th scope="col" className="px-4 py-5 font-medium"> FCD pnl </th>
                  <th scope="col" className="px-4 py-5 font-medium"> Nivel riesgo </th>
                  <th scope="col" className="px-4 py-5 font-medium"> Acciones </th>
                </tr>
              </thead>

              <tbody className="bg-white bg-gradient-to-br dark:from-slate-900 dark:to-slate-800">
                {usersInvestments?.map((user) => {
                  const fcaValue = user.fca_tokens * FCAprice;
                  const fcdValue = user.fcd_tokens * FCDprice;
                  const totalValue = fcaValue + fcdValue;
                  const fcaPnl = fcaValue - user.fca_deposited_usd;
                  const fcdPnl = fcdValue - user.fcd_deposited_usd;

                  return (
                    <tr key={user.id} className="group w-full border-b py-2 text-sm">
                      <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={user.image_url === null || user.image_url.trim() === '' ? '/customers/noavatar.png' : user.image_url}
                            className="rounded-full"
                            alt={`${user.email.split('@')[0]}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <CopyText text={user.email} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        <div>{user.fca_tokens} tokens </div>
                        <div>{fcaValue.toFixed(2)} USD</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        {fcaPnl.toFixed(2)} USD
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        <div>{user.fcd_tokens} tokens </div>
                        <div>{fcdValue.toFixed(2)} USD</div>
                      </td>
                      <td className='whitespace-nowrap px-3 py-3 text-sm'>
                        {fcdPnl.toFixed(2)} USD
                      </td>
                      <td className='whitespace-nowrap px-3 py-3 text-sm'>
                        {(fcdValue / totalValue * 100).toFixed(2)} %
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-sm">
                        <div className="flex justify-end gap-3">
                          <ViewCustomer name={user.email} />
                          <UpdateCustomer id={user.id} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >

  )
}
