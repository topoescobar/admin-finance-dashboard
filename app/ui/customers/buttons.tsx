import { deleteUser } from '@/app/lib/actions'
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function CreateCustomer() {
  return (
    <Link href="/dashboard/admin-customers/create"
      className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" >
      <span className="hidden md:block">Agregar</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function ViewCustomer({name}: {name: string}) {
  return (
    <Link href={`/dashboard/admin-transactions?page=1&search=${name}`}
      className="flex h-10 items-center border rounded-lg px-4 text-sm font-medium text-slate-100 hover:bg-gray-100 hover:text-indigo-600" >
      <span className="hidden md:block">Ver </span>
      <EyeIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function UpdateCustomer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/admin-customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100 hover:text-indigo-600"
    >
      <PencilIcon className="w-5" />
    </Link>
  )
}

export function DeleteCustomer({ id }: { id: string }) {
  const deleteWithId = deleteUser.bind(null, id)
  return (
    <>
      <form action={deleteWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100 hover:text-indigo-600">
          <span className="sr-only">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  )
}