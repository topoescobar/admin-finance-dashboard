import RegisterForm from '@/app/ui/register-form'
import Breadcrumbs from '@/app/ui/transactions/breadcrumbs'

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
        <RegisterForm />
    </div>
  )
}