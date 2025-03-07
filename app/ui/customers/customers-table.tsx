import Image from 'next/image'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'
import './styles/customers.css'
import { cachedLastPrices, fetchCustomersData, fetchLastTokensPrices } from '@/app/lib/data'
import { DeleteCustomer, UpdateCustomer } from './buttons'

export default async function CustomersTable({ query }:
  { query: string }) {

  const usersInvestments = await fetchCustomersData()
  console.log('users',usersInvestments)
  const {FCAprice, FCDprice} = await cachedLastPrices()

  return (

    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0 dark:bg-gray-800">

            {/* MOBILE */}
            {/*        <div className="md:hidden">
              {users?.map((user) => (
                <div
                  key={user.id}
                  className="mb-2 w-full rounded-md bg-white p-4 dark:bg-indigo-200 dark:text-indigo-800"
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
                  </div>
                  <div className="flex w-full items-center justify-between border-b py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Deposito pendiente</p>
                      <p className="font-medium">{user.total_pending}</p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Tokens</p>
                      <p className="font-medium">{user.total_tokens}</p>
                    </div>
                  </div>
                  <div className="pt-4 text-sm">
                    <p>{user.total_transactions} Transactions</p>
                  </div>
                </div>
              ))}
            </div>
 */}
            {/* DESKTOP */}
            <table className="hidden min-w-full text-gray-900 md:table dark:text-white">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6"> Email </th>
                  <th scope="col" className="px-3 py-5 font-medium"> FCA val actual</th>
                  <th scope="col" className="px-3 py-5 font-medium"> FCA pnl </th>
                  <th scope="col" className="px-4 py-5 font-medium"> FCD val actual</th>
                  <th scope="col" className="px-4 py-5 font-medium"> FCD pnl </th>
                  <th scope="col" className="px-4 py-5 font-medium"> Acciones </th>
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-slate-700">
                {usersInvestments?.map((user) => (
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
                        <p className='emailContainerStyle'>{user.email}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      <div>{user.fca_tokens} tokens </div>
                      <div>{(user.fca_tokens * FCAprice).toFixed(2)} USD</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      {(user.fca_tokens * FCAprice - user.fca_deposited_usd).toFixed(2)} USD
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      <div>{user.fcd_tokens} tokens </div>
                      <div>{(user.fcd_tokens * FCDprice).toFixed(2)} USD</div>
                    </td>
                    <td className='whitespace-nowrap px-3 py-3 text-sm'>
                      {(user.fcd_tokens * FCDprice - user.fcd_deposited_usd).toFixed(2)} USD
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm">
                      <div className="flex justify-end gap-3">
                        <UpdateCustomer id={user.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  )
}
