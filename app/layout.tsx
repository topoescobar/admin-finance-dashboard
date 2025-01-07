import '@/app/ui/global.css'
import { inter } from './ui/fonts'
import Head from 'next/head'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="es" className='dark'>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>Fractal Lab Dashboard</title>
      </Head>
      <body className={`${inter.className} antialiased dark:bg-slate-800 dark:text-white`}>{children}</body>
    </html>
  )
}
