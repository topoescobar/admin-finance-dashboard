import '@/app/ui/global.css'
import { inter } from './ui/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased dark:bg-slate-900 dark:text-white`}>{children}</body>
    </html>
  )
}
