import FcaTable from '@/app/ui/funds/fca-table'
export default function FundsPage() {

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Precios Fondos</h1>
      </div>

      <FcaTable />
    </div>

  )
}