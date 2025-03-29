'use client'

import { TransactionForm, UserField } from '@/app/lib/definitions'
import {
  CheckIcon,
  ClockIcon,
  CurrencyBangladeshiIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Button } from '@/app/ui/button'
import { updateTransaction } from '@/app/lib/actions'
import './styles/transactions.css'

interface EditTransactionFormProps {
  transaction: TransactionForm,
  customers: UserField[],
}

export default function EditTransactionForm(
  { transaction, customers }: EditTransactionFormProps) {

  //using bind to ensure that the values passed to the Server Action are encoded.
  const updateWithId = updateTransaction.bind(null, transaction.id)
  const formattedDate = transaction.date.toISOString().split('T')[0] //yyyy-mm-dd

  return (
    <form action={updateWithId}>
      <input type="hidden" name="id" value={transaction.id} />
      <div className="rounded-md bg-gray-50 p-4 md:p-6 dark:bg-gray-800 dark:text-gray-100">

        <div className='valuesContainer'>
          {/* Customer Name */}
          <div className="mb-4">
            <label htmlFor="user" className="mb-2 block text-sm font-medium">
              Elegir cliente
            </label>
            <div className="relative">
              <select className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                id="user"
                name="userId"
                defaultValue={transaction.userid}
              >
                <option value="" disabled>
                  Select
                </option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.email}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Vault */}
          <div className="mb-4">
            <label htmlFor="vault" className="mb-2 block text-sm font-medium">
              Fondo
            </label>
            <div className="relative">
              <select
                id="vault"
                name="vault"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                defaultValue={transaction.vault}
              >
                <option value="" disabled>
                  Seleccionar
                </option>
                <option value="FCA">FCA-Ahorro</option>
                <option value="FCD">FCD-Dinámico</option>
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* DATE */}
          <div className="mb-4">
            <label htmlFor="date" className="mb-2 block text-sm font-medium">
              Fecha
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="date"
                  name="date"
                  type="date"
                  defaultValue={formattedDate}
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                {/* <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
              </div>
            </div>
          </div>
        </div>

        <div className='valuesContainer'>
          {/* Value Amount */}
          <div className="mb-4">
            <label htmlFor="value" className="mb-2 block text-sm font-medium">
              Cant en USD
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="value"
                  name="value"
                  type="number"
                  step="0.01"
                  defaultValue={transaction.value}
                  placeholder="Enter USD amount"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          {/* Tokens Amount */}
          <div className="mb-4">
            <label htmlFor="tokens" className="mb-2 block text-sm font-medium">
              Cant Tokens
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="tokens"
                  name="tokens"
                  type="number"
                  step="0.001"
                  defaultValue={transaction.tokens}
                  placeholder="Enter tokens amount"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

      
          {/* Token PRICE */}
          <div className="mb-4">
            <label htmlFor="tokens" className="mb-2 block text-sm font-medium">
              Precio Token
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="tokenprice"
                  name="tokenprice"
                  type="number"
                  step="0.001"
                  defaultValue={transaction.tokenprice}
                  placeholder="Enter tokens price"
                  className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                />
                <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        </div>

      
        <div className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-medium">
            Notas
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="notes"
                name="notes"
                type="text"
                defaultValue={transaction.notes}
                placeholder="Sin notas"
                className=" w-full peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
              />
              <DocumentIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* transaction Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={transaction.status === 'pending'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Pendiente <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="executed"
                  name="status"
                  type="radio"
                  value="executed"
                  defaultChecked={transaction.status === 'executed'}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label htmlFor="executed"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white" >
                  Ejecutado <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link href="/dashboard/admin-transactions"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Cancelar
        </Link>
        <Button type="submit">Confirmar</Button>
      </div>
    </form>
  )
}
