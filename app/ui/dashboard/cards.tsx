import Card, { CardDetails } from './card'

export default async function CardWrapper( { investment, token } : { investment: any, token: any }) {

  const currentValueFCA = investment.totalTokensFCA * token.FCAprice
  const currentValueFCD = investment.totalTokensFCD * token.FCDprice
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
