import { fetchCardData, fetchLastTokensPrices } from '@/app/lib/data'
import { getUserData } from '@/app/lib/user'
import Card, { CardDetails } from './card'


export default async function CardWrapper() {

  const userData = await getUserData()
  const investment = await fetchCardData(userData.id)
  const { FCAprice, FCDprice } = await fetchLastTokensPrices()

  const currentValueFCA = investment.totalTokensFCA * FCAprice
  const currentValueFCD = investment.totalTokensFCD * FCDprice
  const totalValue = currentValueFCA + currentValueFCD
  const totalEarned = totalValue - investment.totalDepositsFCA - investment.totalDepositsFCD
  const variationFCA = currentValueFCA - investment.totalDepositsFCA
  const variationFCD = currentValueFCD - investment.totalDepositsFCD

  return (
    <>
      <div className='grid col-span-2'>
        <Card title="Total invertido" value={totalValue.toFixed(2)} type="collected" />
      </div>
      <div className='grid col-span-2'>
        <Card title="Ganancias totales" value={totalEarned.toFixed(2)} type="chartBar" />
      </div>
  
      <CardDetails title="Fondo Ahorro" value={currentValueFCA.toFixed(2)} earnings={variationFCA.toFixed(2)} type="saving" />
      <CardDetails title="Fondo dinámico" value={currentValueFCD.toFixed(2)} earnings={variationFCD.toFixed(2)} type="dynamic" />
    </>
  )
}
