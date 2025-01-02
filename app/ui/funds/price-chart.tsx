'use client'
import { LineChart, Line, Bar, BarChart, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis, Legend, Rectangle, AreaChart, Area } from 'recharts'
import { lusitana } from '../fonts'
import { TokenPriceHistory, TokenPriceTable } from '@/app/lib/definitions'

export default function PriceChart({ priceHistory, tokenName }: { priceHistory: TokenPriceHistory[], tokenName: string }) {

   const gradientOffset = () => {
      const dataMax = Math.max(...priceHistory.map((i) => i.price))
      const dataMin = Math.min(...priceHistory.map((i) => i.price))

      if (dataMax <= 0) {
         return 0
      }
      if (dataMin >= 0) {
         return 1
      }

      return dataMax / (dataMax - dataMin)
   }

   const off = gradientOffset()
   
   return (
      <div className='flex w-full flex-col md:col-span-4'>
         <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            Precio fondo {tokenName}
         </h2>
         <div className='w-full h-80 md:col-span-4 bg-white dark:bg-gray-800 dark:text-gray-100 p-4 rounded-xl shadow-md'>
            <ResponsiveContainer width="100%" height="95%">
               <AreaChart
                  width={500}
                  height={400}
                  data={priceHistory}
                  margin={{
                     top: 30,
                     right: 30,
                     left: 0,
                     bottom: 0,
                  }}
               >
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fill: "#999" }} />
                  <YAxis dataKey="price" domain={["dataMin", "dataMax"]} tick={{ fill: "#999" }} tickFormatter={(value) => `$${value}`} />
                  <Tooltip labelStyle={{color: "#1e293b"}}  />
                  <Area type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} fill="#8884d8" />
               </AreaChart>

            </ResponsiveContainer>
         </div>
      </div>
   )
}