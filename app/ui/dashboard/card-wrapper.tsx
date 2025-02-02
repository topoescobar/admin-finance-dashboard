import { Investment, LastTokenPrice } from '@/app/lib/definitions'
import { Card, CardDetails } from './card'

export default async function CardWrapper({ investment, token }: { investment: Investment, token: LastTokenPrice }) {

  const currentValueFCA = investment.totalTokensFCA * token.FCAprice
  const currentValueFCD = investment.totalTokensFCD * token.FCDprice
  const totalValueFCA = investment.executedValueFCA + investment.pendingValueFCA
  const variationFCA = currentValueFCA - totalValueFCA
  const totalValueFCD = investment.executedValueFCD + investment.pendingValueFCD
  const variationFCD = currentValueFCD - totalValueFCD
  const totalValue = currentValueFCA + currentValueFCD
  const totalEarned = variationFCA + variationFCD
  const showFCA = currentValueFCA > 1 && currentValueFCD > 1 || currentValueFCA > 1 && variationFCD != 0
  const showFCD = currentValueFCD > 1 && currentValueFCA > 1 || currentValueFCD > 1 && variationFCA != 0

  return (
    <>
      <div className='grid col-span-2'>
        <Card title="Total invertido" value={totalValue.toFixed(2)} type="collected" />
      </div>
      <div className='grid col-span-2'>
        <Card title="Ganancias totales" value={totalEarned.toFixed(2)} type="chartBar" />
      </div>

      <CardDetails
        title="Fondo Ahorro"
        value={currentValueFCA.toFixed(2)}
        earnings={variationFCA.toFixed(2)}
        pendingValue={investment.pendingValueFCA.toFixed(2)}
        show={showFCA} //se muestra si tiene valor depositado
        type="saving" />

      <CardDetails
        title="Fondo dinámico"
        value={currentValueFCD.toFixed(2)}
        earnings={variationFCD.toFixed(2)}
        pendingValue={investment.pendingValueFCD.toFixed(2)}
        show={showFCD}
        type="dynamic" />
    </>
  )
}
