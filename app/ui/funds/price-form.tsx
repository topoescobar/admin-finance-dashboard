import { createTokenPrice } from '@/app/lib/actions'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Button } from '../button'

export default function PriceForm({ tokenName}: { tokenName: string }) {
   return (
      <form action={createTokenPrice}>
         <input className='hidden' type="text" name='tokenname' defaultValue={tokenName} />
         <div className='valuesContainer'>
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
                        className="fundInput peer block min-w-2 rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                     />
                     {/* <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
                  </div>
               </div>
            </div>
            <div className="mb-4">
               <label htmlFor="price" className="mb-2 block text-sm font-medium">
                  Precio
               </label>
               <div className="relative mt-2 rounded-md">
                  <div className="relative">
                     <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.001"
                        placeholder="Enter price"
                        className="fundInput peer block min-w-2 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                     />
                     <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                  </div>
               </div>
            </div>
            <Button className='my-2' type="submit">Crear</Button>
         </div>
      </form>
   )
}