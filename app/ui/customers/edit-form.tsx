'use client'

import { User, UserField } from '@/app/lib/definitions'
import {
  AtSymbolIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
import { updateTransaction, updateUser } from '@/app/lib/actions'

export default function EditCustomerForm({ user, allUsers, }:
  { user: User, allUsers: UserField[] }) {

  const updateWithId = updateUser.bind(null, user.id) //using bind to ensure that the values passed to the Server Action are encoded.

  return (
    <form action={updateWithId}>
      <input type="hidden" name="id" value={user.id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6 dark:bg-gray-800 dark:text-gray-100">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={user.username}
                placeholder="Enter username"
                className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className='valuesContainer'>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  placeholder="Enter email"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          {/* Image Amount */}
          <div className="mb-4">
            <label htmlFor="image_url" className="mb-2 block text-sm font-medium">
              Imagen
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="image_url"
                  name="image_url"
                  type="text"
                  defaultValue={user.image_url}
                  placeholder="Ruta de imagen"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancelar
        </Link>
        <Button type="submit">Confirmar</Button>
      </div>
    </form>
  )
}
