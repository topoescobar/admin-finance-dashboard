import {
   BanknotesIcon,
   ClockIcon,
   UserGroupIcon,
   InboxIcon,
} from '@heroicons/react/24/outline'
import { lusitana } from '@/app/ui/fonts'

const iconMap = {
  totalCard: BanknotesIcon,
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  transactions: InboxIcon,
}

export default function Card({ title, value, type }:
   {
      title: string
      value: number | string
      type: 'totalCard' | 'transactions' | 'customers' | 'pending' | 'collected'
   }) {

   const Icon = iconMap[type]

   return (
      <div className={`${type} rounded-xl bg-gray-50 p-2 shadow-sm dark:bg-gray-800 dark:text-gray-100`}>
         <div className="flex p-4">
            {Icon ? <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" /> : null}
            <h3 className="ml-2 text-sm font-medium">{title}</h3>
         </div>
         <p
            className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl dark:text-gray-100 dark:bg-gray-900`}
         >
            $ {value}
         </p>
      </div>
   )
}
