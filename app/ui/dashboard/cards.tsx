import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline'
import { lusitana } from '@/app/ui/fonts'
import {  fetchCardData, fetchLastTokensPrices } from '@/app/lib/data'
import { getUserData } from '@/app/lib/user'

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  transactions: InboxIcon,
}

export default async function CardWrapper() {
  
  const userData = await getUserData()
  const investment = await fetchCardData(userData.id)
  console.log('dashboardData', investment)
  const { FCAprice, FCDprice } = await fetchLastTokensPrices()

  const currentValueFCA = investment.totalTokensFCA * FCAprice
  const currentValueFCD = investment.totalTokensFCD * FCDprice
  const variationFCA = currentValueFCA - investment.totalDepositsFCA
  const variationFCD = currentValueFCD - investment.totalDepositsFCD

  return (
    <>
      <Card title="Valor total invertido" value={currentValueFCA + currentValueFCD} type="collected" />
      <Card title="Fondo Ahorro" value={currentValueFCA} type="collected" />
      <Card title="Ganancias Ahorro" value={variationFCA} type="transactions" />
      <Card title="Fondo dinámico" value={currentValueFCD} type="collected" />
      <Card title="Ganancias dinámico" value={variationFCD} type="transactions" />
    </>
  )
}

export function Card({ title, value, type, }:
  { title: string; value: number | string; type: 'transactions' | 'customers' | 'pending' | 'collected' }) {
  const Icon = iconMap[type]

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm dark:bg-gray-800 dark:text-gray-100">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl dark:text-gray-100 dark:bg-gray-900`}
      >
        {value}
      </p>
    </div>
  )
}
