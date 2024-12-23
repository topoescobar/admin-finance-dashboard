'use client'
import { SunIcon } from '@heroicons/react/20/solid'
import { MoonIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'


export default function Navbar() {
   
   const [theme, setTheme] = useState( () => {
      const localTheme = localStorage.getItem('theme')
      return localTheme ? localTheme : 'dark'
   }
)

   useEffect(() => {
      const localTheme = localStorage.getItem('theme')
      if (localTheme) {
         setTheme(localTheme)
      }
   }, [])

   useEffect(() => {
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
   }, [theme])

   return (
      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-slate-800 sticky top-0 z-40 navbar">
         <h1 className="text-lg font-semibold">Seccion navbar</h1>
         <div className="flex items-center space-x-2">
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg>
            </button>
            <button
               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
               {theme === 'light' ? (
                  <MoonIcon className="w-6 h-6" />
               ) : (
                  <SunIcon className="w-6 h-6" />
               )}
            </button>
         </div>
      </div>
   )
}