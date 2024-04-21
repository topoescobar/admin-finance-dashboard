import { fetchTokenPrice } from '@/app/lib/data'
import FcaChart from '@/app/ui/funds/fca-chart'
import FcaTable from '@/app/ui/funds/fca-table'
import '@/app/ui/funds/styles/funds.css'
export default async function FundsPage() {

  const tokenPrices = await fetchTokenPrice()

  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <h1 className={`text-2xl`}>Precios Fondos</h1>
      </div>
      <div className='fca'>
        <FcaChart tokenPrices={tokenPrices} />
        <FcaTable tokenPrices={tokenPrices} />
      </div>
    </div>

  )
}