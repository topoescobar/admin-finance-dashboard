import EditCustomerForm from '@/app/ui/customers/edit-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchUserById, fetchUsers } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditCustomer(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const { id } = params
  const user = await fetchUserById(id)
  const allUsers = await fetchUsers()

  return (
    <div> 
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/admin-customers' },
          {
            label: 'Editar',
            href: `dashboard/admin-customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm user={user} allUsers={allUsers} />
    </div>
  )
}