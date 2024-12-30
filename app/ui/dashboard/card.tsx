import {
   BanknotesIcon,
   ClockIcon,
   UserGroupIcon,
   InboxIcon,
   ChartBarIcon,
   BoltIcon,
   BriefcaseIcon,
} from '@heroicons/react/24/outline'
import { lusitana } from '@/app/ui/fonts'

const iconMap = {
   collected: BanknotesIcon,
   customers: UserGroupIcon,
   pending: ClockIcon,
   transactions: InboxIcon,
   chartBar: ChartBarIcon,
   dynamic: BoltIcon,
   saving: BriefcaseIcon
}

export default function Card({ title, value, type }:
   {
      title: string
      value: number | string
      type: 'chartBar' | 'transactions' | 'customers' | 'pending' | 'collected' | 'dynamic' | 'saving'
   }) {

   const Icon = iconMap[type]

   return (
      <div className={`totalCard rounded-xl bg-gray-50 p-2 shadow-sm dark:bg-gray-800 dark:text-gray-100`}>
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

export function CardDetails({ title, value, earnings, type }:
   {
      title: string
      value: number | string
      earnings: number | string
      type:  'transactions' | 'customers' | 'pending' | 'collected' | 'dynamic' | 'saving'
   }) {

   const Icon = iconMap[type]

   return (
      <div className={`${type} rounded-xl bg-gray-50 p-2 shadow-sm dark:bg-gray-800 dark:text-gray-100 col-span-2`}>
         <div className="flex p-4">
            {Icon ? <Icon className="h-5 w-5 text-gray-700 dark:text-gray-200" /> : null}
            <h3 className="ml-2 text-sm font-medium">{title}</h3>
         </div>
         <div className='flex flex-col gap-2'>
            <div className={`${lusitana.className} truncate rounded-xl bg-white px-3 py-6 text-center  dark:text-gray-100 dark:bg-gray-900`} >
               <p className='text-base'>Valor actual </p>
               <p className='text-2xl'>$ {value} </p>
            </div>
            <div className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl dark:text-gray-100 dark:bg-gray-900`}>
               <p className='text-base'>Ganancias</p>
               <p className='text-2xl'> $ {earnings} </p>
            </div>
         </div>
      </div>
   )
}
