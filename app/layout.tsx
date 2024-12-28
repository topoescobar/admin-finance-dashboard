import '@/app/ui/global.css'
import { inter } from './ui/fonts'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es" className='dark'>
      <body className={`${inter.className} antialiased dark:bg-slate-800 dark:text-white`}>{children}</body>
    </html>
  )
}
