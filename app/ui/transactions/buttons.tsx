import { deleteTransaction, deletePriceWithId } from '@/app/lib/actions'
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function CreateTransaction() {
  return (
    <Link href="/dashboard/admin-transactions/create"
      className="flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" > 
      <span className="hidden md:block">Agregar</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  )
}

export function UpdateTransaction({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/admin-transactions/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  )
}

export function DeleteTransaction({ id }: { id: string }) {
  const deleteWithId = deleteTransaction.bind(null, id)
  return (
    <>
      <form action={deleteWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  )
}

export function DeletePrice({ id }: { id: string }) {
  const deleteWithId = deletePriceWithId.bind(null, id)
  return (
    <>
      <form action={deleteWithId}>
        <button className="rounded-md border p-2 hover:bg-gray-100">
          <span className="sr-only">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  )
}