import EditTransactionForm from '@/app/ui/transactions/edit-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchTransactionById, fetchUsers } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditTransaction(props: { params: Promise<{ id: string }>}) {
  const params = await props.params
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
      <EditTransactionForm transaction={transaction} customers={customers} />
    </main>
  )
}