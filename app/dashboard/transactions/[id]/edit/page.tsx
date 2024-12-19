import Form from '@/app/ui/transactions/edit-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchTransactionById, fetchUsers } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditTransaction({ params }: { params: { id: string }} ) {
  const { id } = params
  const [transaction, customers] = await Promise.all([
    fetchTransactionById(id),
    fetchUsers(),
  ])
  
  if (!transaction) {
    notFound()
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Transactions', href: '/dashboard/transactions' },
          {
            label: 'Edit Transaction',
            href: `/dashboard/transactions/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form transaction={transaction} customers={customers} />
    </main>
  )
}