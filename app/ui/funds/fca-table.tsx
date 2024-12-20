import { fetchTokenPrice } from '@/app/lib/data'
import { formatDateToLocal } from '@/app/lib/utils'
import {
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import './styles/funds.css'
import { Button } from '../button'
import { createTokenPrice } from '@/app/lib/actions'
import { DeleteTransaction, DeletePrice } from '../transactions/buttons'
import { TokenPriceTable } from '@/app/lib/definitions'

export default async function FcaTable({tokenPrices}: {tokenPrices: TokenPriceTable[]}) {

  return (
    <div>
      <div className='fcaCointainer'>
        <h4>FCA: Fractal Crypto Ahorro</h4>
        <form action={createTokenPrice}>
          <input className='hidden' type="text" name='tokenname' defaultValue='FCA' />
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

        <div className="bg-gray-50 md:pt-0 dark:bg-slate-800 dark:text-white tableContainer">
          <table className="hidden text-gray-900 md:table dark:text-white">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6"> Fecha </th>
                <th scope="col" className="px-3 py-5 font-medium"> Precio </th>
                {/* <th scope="col" className="relative py-3 pl-6 pr-3"> <span className="sr-only">Actions</span> </th> */}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-700">
              {tokenPrices.filter((e) => e.tokenname === "FCA")
                .map((reg) =>
                (
                  <tr key={reg.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg tableRow" >
                    <td className="whitespace-nowrap px-3 py-3">
                      {reg.date.toLocaleDateString('es-AR', 
                        { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {reg.price}
                    </td>
                    <td className="py-3 pl-6 pr-3">
                      <div className="deletePrice">
                        <DeletePrice id={reg.id} />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}