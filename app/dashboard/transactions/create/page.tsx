import Form from '@/app/ui/movements/create-form'
import Breadcrumbs from '@/app/ui/movements/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'

export default async function CreateInvoice() {
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