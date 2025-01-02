import {
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import './styles/funds.css'
import { Button } from '../button'
import { createTokenPrice } from '@/app/lib/actions'
import {  DeletePrice } from '../transactions/buttons'
import { TokenPriceTable } from '@/app/lib/definitions'

export default async function TokenPrices({tokenPrices, tokenName}: {tokenPrices: TokenPriceTable[], tokenName: string}) {

  return (
    <div>
      <div className='fcaCointainer'>
        <h4>Fondo {tokenName}</h4>
     
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
              {tokenPrices.map((reg) =>
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