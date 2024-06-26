import CreateCustomerForm from '@/app/ui/customers/create-form'
import Breadcrumbs from '@/app/ui/movements/breadcrumbs'

export default function CreateCustomer() {
  return (
    <div> 
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Clientes', href: '/dashboard/customers' },
          {
            label: 'Crear nuevo',
            href: '/dashboard/customers/create',
            active: true,
          },
        ]}
      />
      <CreateCustomerForm />
    </div>
  )
}