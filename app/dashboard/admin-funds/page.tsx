import { fetchTokenPrice } from '@/app/lib/data'
import FcaChart from '@/app/ui/funds/fca-chart'
import PricesTable from '@/app/ui/funds/prices-table'
import PriceForm from '@/app/ui/funds/price-form'
import '@/app/ui/funds/styles/funds.css'

export default async function FundsPage() {
  
  const tokenHistory = await fetchTokenPrice()
  const fcaPrices = tokenHistory.filter((e) => e.tokenname === "FCA")
  const fcdPrices = tokenHistory.filter((e) => e.tokenname === "FCD")

  return (
    <div>
      <div className="flex w-full items-center justify-center">
        <h1 className={`text-2xl`}>Precios Fondos</h1>
      </div>
      <div className='fundsContainer'>
        <div className=''>
          {/* <FcaChart tokenPrices={tokenPrices} /> */}
          <PriceForm tokenName='FCA'/>
          <PricesTable tokenPrices={fcaPrices} tokenName='Ahorro' />
        </div>
        <div>
          <PriceForm tokenName='FCD' />
          <PricesTable tokenPrices={fcdPrices} tokenName='Dinámico' />
        </div>

      </div>
    </div>

  )
}