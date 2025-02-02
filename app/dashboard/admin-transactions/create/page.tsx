import CreateTransactionForm from '@/app/ui/transactions/create-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchTokenPrice, fetchUsers } from '@/app/lib/data'

export default async function CreateTransaction() {

  const users = await fetchUsers()
  const tokenPrices = await fetchTokenPrice()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transacciones', href: '/dashboard/admin-transactions' },
          {
            label: 'Nueva',
            href: '/dashboard/admin-transactions/create',
            active: true,
          },
        ]}
      />
      <CreateTransactionForm users={users} tokenPrices={tokenPrices}/>
    </main>
  )
}