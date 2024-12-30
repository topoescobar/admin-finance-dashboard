import CardWrapper from '@/app/ui/dashboard/cards'
import RevenueChart from '@/app/ui/dashboard/revenue-chart'
import LatestTransactions from '@/app/ui/dashboard/latest-transactions'
import { lusitana } from '@/app/ui/fonts'
import { Suspense } from 'react' //defer rendering parts until some condition is met (e.g. data is loaded)
import { CardsSkeleton, LatestTransactionsSkeleton, RevenueChartSkeleton } from '@/app/ui/skeletons'
import FcaChart from '@/app/ui/funds/fca-chart'
import FcaPriceChart from '@/app/ui/dashboard/fca-chart'

const DashboardPage = async () => {

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Resumen
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <FcaPriceChart />
        </Suspense>

        <Suspense fallback={<LatestTransactionsSkeleton />}>
          <LatestTransactions />
        </Suspense>

      </div>
    </main>
  )
}

export default DashboardPage