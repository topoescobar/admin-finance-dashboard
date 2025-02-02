'use client'
import { LastTokenPrice, UserField } from '@/app/lib/definitions'
import CardWrapper from './card-wrapper'
import { fetchCardData, fetchLastTokensPrices } from '@/app/lib/data'
import { use, useEffect, useState } from 'react'
import { getUserInvestment } from './user-summary.server'

export default function UserSummary({ users, lastPrice }: { users: UserField[], lastPrice: LastTokenPrice }) {

   const [selectedUserId, setSelectedUserId] = useState<string>('')
   const [inves, setInves] = useState<any>(null)

   useEffect(() => {
      if (selectedUserId) {
         const investment = use(getUserInvestment(selectedUserId))
         setInves(investment)
      }
   }, [selectedUserId, inves])

   const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const userId = event.target.value
      setSelectedUserId(userId)
   }

   return (
      <div>
         <h2>Resumen usuario</h2>
         <form>
            <div className=''>
               <label htmlFor="customer">Elegir cliente</label>
               <select id="customer" name="customer" value={selectedUserId} onChange={handleUserChange} className='dark:text-gray-100 dark:bg-gray-800'>
                  <option value="" disabled>
                     Seleccionar
                  </option>
                  {users.map((user) => (
                     <option key={user.id} value={user.id}>
                        {user.email.split('@')[0]}
                     </option>
                  ))}
               </select>
            </div>
         </form>
        { inves && <CardWrapper investment={inves} token={lastPrice} />}
      </div>
   )
}