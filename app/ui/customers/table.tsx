import Image from 'next/image'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'
import { useState } from 'react'
import './styles/customers.css'
import {  fetchFilteredUsers } from '@/app/lib/data'
import { DeleteCustomer, UpdateCustomer } from './buttons'

export default async function CustomersTable({ query }:
  { query: string }) {

  // const customers = await fetchFilteredCustomers(query)
  const users = await fetchFilteredUsers(query)

  return (

    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0 dark:bg-gray-800">

            {/* MOBILE */}
            <div className="md:hidden">
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
                            alt={`${user.username}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{user.username}</p>
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

            {/* DESKTOP */}
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal dark:bg-gray-800 dark:text-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Nombre de usuario
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Total Movs
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Total Pendiente
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Total Tokens
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-gray-100 dark:bg-slate-400 dark:text-slate-800">
                {users?.map((user) => (
                  <tr key={user.id} className="group">
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.image_url === null || user.image_url.trim() === '' ? '/customers/noavatar.png' : user.image_url}
                          className="rounded-full"
                          alt={`${user.username}'s profile picture`}
                          width={28}
                          height={28}
                        />
                        <p>{user.username}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm emailContainerStyle">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm">
                      {user.total_transactions}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm">
                      {user.total_pending}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                      {user.total_tokens}
                    </td>
                    <td className="whitespace-nowrap px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
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
