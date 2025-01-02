import CardWrapper from '@/app/ui/dashboard/cards'
import RevenueChart from '@/app/ui/dashboard/revenue-chart'
import LatestTransactions from '@/app/ui/dashboard/latest-transactions'
import { lusitana } from '@/app/ui/fonts'
import { Suspense } from 'react' //defer rendering parts until some condition is met (e.g. data is loaded)
import { CardsSkeleton, LatestTransactionsSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons'
import EarnChart from '@/app/ui/dashboard/user-earn-chart'
import { getUserData } from '@/app/lib/user'
import { fetchCardData, fetchLastTokensPrices, fetchTokenPrice } from '@/app/lib/data'
import PriceChart from '@/app/ui/funds/price-chart'

const DashboardPage = async () => {

  const userData = await getUserData()
  const inves = await fetchCardData(userData.id)
  const token = await fetchLastTokensPrices()
  const tokenHistory = await fetchTokenPrice()

  const formatTokenData = (tokenName: string) => {
    const formattedTokenHistory = tokenHistory
      .filter(item => item.tokenname === tokenName)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((item) => ({
        ...item,
        date: new Date(item.date)
          .toLocaleDateString('es-AR', { month: 'short', year: '2-digit' })
          .replace(' ', ' ´')
      }))
    return formattedTokenHistory
  }

  const fcaPrices = formatTokenData('FCA')
  const fcdPrices = formatTokenData('FCD')

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Resumen
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper investment={inves} token={token} />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <PriceChart priceHistory={fcaPrices} tokenName="Ahorro" />
        </Suspense>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <PriceChart priceHistory={fcdPrices} tokenName="Dinámico" />
        </Suspense>

      </div>
    </main>
  )
}

export default DashboardPage