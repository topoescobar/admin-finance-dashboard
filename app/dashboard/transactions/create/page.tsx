import Form from '@/app/ui/transactions/create-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'

export default async function CreateTransaction() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Movimientos', href: '/dashboard/transactions' },
          {
            label: 'Crear nuevo',
            href: '/dashboard/transactions/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  )
}