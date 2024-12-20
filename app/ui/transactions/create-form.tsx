'use client'
import { TokenPriceTable, UserField } from '@/app/lib/definitions'
import Link from 'next/link'
import {
   CheckIcon,
   ClockIcon,
   CurrencyBangladeshiIcon,
   CurrencyDollarIcon,
   UserCircleIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/app/ui/button'
import { createTransaction, testCreateTransaction } from '@/app/lib/actions'
import './styles/transactions.css'
import { useEffect, useState } from 'react'
import { parse } from 'path'

export default function CreateTransactionForm({ users, tokenPrices }: { users: UserField[], tokenPrices: TokenPriceTable[] }) {
   const [selectedVault, setSelectedVault] = useState('')
   const [tokenPrice, setTokenPrice] = useState<number>(0)
   const [tokensAmount, setTokensAmount] = useState<number>(0)

   useEffect(() => {
      const lastToken = tokenPrices.find((token) => token.tokenname === selectedVault)
      if (lastToken) {
         const tokenPrice = Number(lastToken.price)
         if (!isNaN(tokenPrice)) {
            setTokenPrice(Number(lastToken.price))
         }
      }
   }, [selectedVault])

   const handleVaultChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedVault(event.target.value)
   }

   const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const tokenPrice = parseFloat(event.target.value)
      const valueInput = document.querySelector<HTMLInputElement>('#value')
      const value = parseFloat(valueInput?.value ?? '0')
      const tokens =( value / tokenPrice).toFixed(3)
      setTokenPrice(parseFloat(event.target.value))
      setTokensAmount(Number(tokens))
   }

   const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value)
      if (isNaN(value)) {
         console.log('value is NaN')
         return
      }
      const tokens = (value / tokenPrice).toFixed(3)
      setTokensAmount(Number(tokens))
   }

   return (
      <form action={createTransaction}>
         <div className="rounded-md bg-gray-50 p-4 md:p-6 dark:bg-gray-800 dark:text-gray-100">
            {/* Customer Name */}
            <div className="mb-4">
               <label htmlFor="user" className="mb-2 block text-sm font-medium">
                  Elegir usuario
               </label>
               <div className="relative">
                  <select className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                     id="user"
                     name="userId"
                     defaultValue="" >
                     <option value="" disabled>
                        Seleccionar
                     </option>
                     {users.map((user) => (
                        <option key={user.id} value={user.id}>
                           {user.username}
                        </option>
                     ))}
                  </select>
                  <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
               </div>
            </div>

            <div className='valuesContainer'>
               <div className="mb-4">
                  <label htmlFor="vault" className="mb-2 block text-sm font-medium">
                     Elegir bóveda
                  </label>
                  <div className="relative">
                     <select
                        id="vault"
                        name="vault"
                        defaultValue=''
                        onChange={handleVaultChange}
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                     >
                        <option value="" disabled>
                           Seleccionar
                        </option>
                        <option value="FCA">
                           FCA: Fractal Crypto ahorro
                        </option>
                        <option value="FCD">
                           FCD: Fractal Crypto dinamico
                        </option>
                     </select>
                     <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
               </div>

               <div className="mb-4">
                  <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                     Cant en USD
                  </label>
                  <div className="relative mt-2 rounded-md">
                     <div className="relative">
                        <input
                           id="value"
                           name="value"
                           type="number"
                           step="0.01"
                           placeholder="Valor en USD"
                           onChange={handleValueChange}
                           className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                        />
                        <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                     </div>
                  </div>
               </div>


            </div>

            <div className="valuesContainer">

               {/* Token price */}
               <div className="mb-4">
                  <label htmlFor="tokenprice" className="mb-2 block text-sm font-medium">
                     Precio del token
                  </label>
                  <div className="relative mt-2 rounded-md">
                     <div className="relative">
                        <input
                           id="tokenprice"
                           name="tokenprice"
                           type="number"
                           step="0.001"
                           placeholder="Precio del token"
                           value={tokenPrice}
                           onChange={handlePriceChange} 
                           className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                        />
                        <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                     </div>
                  </div>
               </div>

               {/* Tokens Amount */}
               <div className="mb-4">
                  <label htmlFor="tokens" className="mb-2 block text-sm font-medium">
                     Tokens
                  </label>
                  <div className="relative mt-2 rounded-md">
                     <div className="relative">
                        <input
                           id="tokens"
                           name="tokens"
                           type="number"
                           step="0.001"
                           value={tokensAmount}
                           className="peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                        />
                        <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="mb-4">
               <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                  Fecha
               </label>
               <div className="relative mt-2 rounded-md">
                  <div className="relative">
                     <input
                        id="date"
                        name="date"
                        type="date"
                        className="peer block min-w-2 rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                     />
                     {/* <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                  </div>
               </div>
            </div>

            {/* Status */}
            <fieldset>
               <legend className="mb-2 block text-sm font-medium">
                  Status
               </legend>
               <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                  <div className="flex gap-4">
                     <div className="flex items-center">
                        <input
                           id="pending"
                           name="status"
                           type="radio"
                           value="pending"
                           className="h-4 w-4 cursor-pointer border-gray-500 bg-gray-100 text-gray-600 focus:ring-2 border-gray-800 "
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
                           id="paid"
                           name="status"
                           type="radio"
                           value="paid"
                           className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 border-gray-800"
                        />
                        <label
                           htmlFor="paid"
                           className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                        >
                           Ejecutado <CheckIcon className="h-4 w-4" />
                        </label>
                     </div>
                  </div>
               </div>
            </fieldset>
         </div>

         <div className="mt-6 flex justify-end gap-4">
            <Link className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
               href="/dashboard/transactions" >
               Cancelar
            </Link>
            <Button type="submit">Crear</Button>
         </div>
      </form>
   )
}
