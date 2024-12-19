import { ArrowPathIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Image from 'next/image'
import { lusitana } from '@/app/ui/fonts'
import { fetchLatestTransactions } from '@/app/lib/data'
import { LatestTransaction } from '@/app/lib/definitions'

export default async function LatestTransactions() {
  // {LatestTransactions, }: {LatestTransactions: LatestTransaction[]})
  // const LatestTransactions = await fetchLatestTransactions()
  const LatestTransactions = [{
    value: 2000,
    id: '123',
    username: 'Lee Robinson',
    image_url: '/customers/lee-robinson.png',
    email: 'johndoe@me.com',
  }]

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Transactions
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800 dark:text-gray-100">
        <div className="bg-white px-6 dark:bg-gray-900">
          {LatestTransactions.map((tx, i) => {
            return (
              <div
                key={tx.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={tx.image_url}
                    alt={`${tx.username}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {tx.username}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {tx.email}
                    </p>
                  </div>
                </div>
                <p
                  className={`${lusitana.className} truncate text-sm font-medium md:text-base`}
                >
                  {tx.value}
                </p>
              </div>
            )
          })}
        </div>
        <div className="flex items-center pb-2 p */}t-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Recien actualizado</h3>
        </div>
      </div>
    </div>
  )
}
