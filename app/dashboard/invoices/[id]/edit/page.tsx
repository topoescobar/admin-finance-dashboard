import Form from '@/app/ui/movements/edit-form'
import Breadcrumbs from '@/app/ui/movements/breadcrumbs'
import { fetchCustomers, fetchMovementById } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditMovement({ params }: { params: { id: string }} ) {
  const { id } = params
  const [movement, customers] = await Promise.all([
    fetchMovementById(id),
    fetchCustomers(),
  ])

  if (!movement) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Movements', href: '/dashboard/invoices' },
          {
            label: 'Edit movement',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={movement} customers={customers} />
    </main>
  )
}