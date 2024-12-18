import EditCustomerForm from '@/app/ui/customers/edit-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'
import { fetchCustomerById, fetchCustomers } from '@/app/lib/data'
import { notFound } from 'next/navigation'

export default async function EditCustomer({ params }: { params: { id: string } }) {
  const { id } = params
  const customer = await fetchCustomerById(id)
  const allCustomers = await fetchCustomers()
  
  return (
    <div> 
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          {
            label: 'Editar',
            href: `dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditCustomerForm customer={customer} customers={allCustomers} />
    </div>
  )
}