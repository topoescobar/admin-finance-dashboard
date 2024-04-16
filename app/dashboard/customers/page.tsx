import { fetchCustomers, fetchFilteredCustomers } from '@/app/lib/data'
import CustomersTable from '@/app/ui/customers/table'
import { lusitana } from '@/app/ui/fonts'
import Search from '@/app/ui/search'

const CustomersPage = async ({ searchParams }: { searchParams?: { search?: string }}) => {

  const query = searchParams?.search || ''
  const customers = await fetchFilteredCustomers(query)

  return (
    <div>
      <CustomersTable customers={customers} />
    </div>
  )
}

export default CustomersPage