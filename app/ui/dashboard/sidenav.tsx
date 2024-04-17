import Link from 'next/link'
import NavLinks from '@/app/ui/dashboard/nav-links'
import Logo from '@/app/ui/acme-logo'
import { PowerIcon } from '@heroicons/react/24/outline'
import { auth, signOut } from '@/auth'

export default async function SideNav() {
  const authData = await auth()
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 dark:bg-slate-800">
      <Link className="mb-2 flex h-20 items-end justify-center rounded-md bg-blue-600 p-4 md:h-40 dark:bg-indigo-900" href="/" >
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className='ml-2'>
          <span>{authData?.user?.name} </span> 
        </div>
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block dark:bg-gray-800"></div>
        <form action={async () => {
          'use server'
          await signOut()
        }}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 dark:bg-indigo-800 dark:text-white">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Salir</div>
          </button>
        </form>
      </div>
    </div>
  )
}
