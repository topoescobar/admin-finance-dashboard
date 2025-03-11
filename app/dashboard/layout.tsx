import SideNav from '@/app/ui/dashboard/sidenav'
import Navbar from '../ui/dashboard/navbar'
import '../ui/dashboard/styles/layout.css'
import { fetchLastNews } from '../lib/data'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const lastNews = await fetchLastNews()

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className='flex-grow md:overflow-y-auto h-screen'>
        <Navbar lastNews={lastNews}/>
        <div className="flex-grow p-6 md:p-12 dark:bg-slate-900 rounded-lg">
          {children}
        </div>
      </div>
    </div>
  )
} 