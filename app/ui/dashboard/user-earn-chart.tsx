'use client'
import { LineChart, Line, Bar, BarChart, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, Legend, Rectangle, AreaChart, Area } from 'recharts'
import { lusitana } from '../fonts'

export default function UserEarningChart() {

   
   const fondo = 'Ahorro'

   const data = [
      {
         mes: 'Ene 24',
         ganancias: 10,
      },
      {
         mes: 'Feb 24',
         ganancias: 30,
      },
      {
         mes: 'Mar 24',
         ganancias: 40,
      },
      {
         mes: 'Apr 24',
         ganancias: 50,
      },
      {
         mes: 'May 24',
         ganancias: 60,
      },
      {
         mes: 'Jun 24',
         ganancias: 70,
      },
   ]

   return (
      <div className='flex w-full flex-col md:col-span-4'>
         <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Precio fondo {fondo}
         </h2>
         <div className='w-full h-80 md:col-span-4 bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded-xl shadow-md'>
            <ResponsiveContainer width="100%" height="95%">
               <AreaChart
                  width={500}
                  height={400}
                  data={data}
                  margin={{
                     top: 30,
                     right: 30,
                     left: 0,
                     bottom: 0,
                  }}
               >
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis dataKey="mes" tick={{ fill: "#666" }} />
                  <YAxis dataKey="ganancias" tick={{ fill: "#666" }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip />
                  <Area type="monotone" dataKey="ganancias" stroke="#8884d8" strokeWidth={2} fill="#8884d8" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
   )
}