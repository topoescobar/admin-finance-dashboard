import { CustomerField } from '@/app/lib/definitions'
import Link from 'next/link'
import {
  AtSymbolIcon,
  CheckIcon,
  ClockIcon,
  CurrencyBangladeshiIcon,
  CurrencyDollarIcon,
  LinkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/app/ui/button'
import {  createMovement, createUser } from '@/app/lib/actions'

export default function CreateCustomerForm() {
  return (

    <form action={createUser}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 dark:bg-gray-800 dark:text-gray-100">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nombre
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Names"
                className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
                  placeholder="Enter email"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          {/* Img URL */}
          <div className="mb-4">
            <label htmlFor="imageURL" className="mb-2 block text-sm font-medium">
              Imagen
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="imageURL"
                  name="imageURL"
                  type="text"
                  placeholder="Enter image URL"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          href="/dashboard/invoices" >
          Cancel
        </Link>
        <Button type="submit">Crear</Button>
      </div>
    </form>
  )
}
