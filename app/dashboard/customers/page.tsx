import { fetchCustomers, fetchFilteredCustomers } from '@/app/lib/data'
import { CreateCustomer } from '@/app/ui/customers/buttons'
import CustomersTable from '@/app/ui/customers/table'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'

const CustomersPage = async ({ searchParams }:
   { searchParams?: { search?: string }}) => {

  const query = searchParams?.search || ''

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}> Clientes </h1>     
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar..." />
        <CreateCustomer />
      </div>

      <CustomersTable query={query} />
    </div>
  )
}

export default CustomersPage