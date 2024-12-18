import Form from '@/app/ui/transactions/create-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchUsers } from '@/app/lib/data'

export default async function CreateTransaction() {

  const users = await fetchUsers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transacciones', href: '/dashboard/transactions' },
          {
            label: 'Nueva',
            href: '/dashboard/transactions/create',
            active: true,
          },
        ]}
      />
      <Form users={users} />
    </main>
  )
}