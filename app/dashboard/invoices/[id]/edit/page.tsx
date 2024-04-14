import Form from '@/app/ui/movements/edit-form'
import Breadcrumbs from '@/app/ui/movements/breadcrumbs'
import { fetchCustomers, fetchInvoiceById, fetchMovementById } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditInvoice({ params }: { params: { id: string } }) {
  const { id } = params
  const [invoice, customers] = await Promise.all([
    fetchMovementById(id),
    fetchCustomers(),
  ])

  if (!invoice) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  )
}