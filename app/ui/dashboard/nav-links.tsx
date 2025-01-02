'use client'
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


// Map of links to display in the side navigation.
const adminLinks = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Dashboard (Admin)', href: '/dashboard/admin-dashboard', icon: HomeIcon },
  { name: 'Transacciones (Admin)', href: '/dashboard/admin-transactions', icon: DocumentDuplicateIcon,},
  { name: 'Clientes (Admin)', href: '/dashboard/admin-customers', icon: UserGroupIcon },
  { name: 'Fondos (Admin)', href: '/dashboard/admin-funds', icon: BanknotesIcon },
]

const userLinks = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
]

export default function NavLinks({ role }: { role: string }) {
  const pathname = usePathname()
  const defaultStyle = 'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 dark:bg-indigo-800 dark:text-white'

  const linksToRender = role === 'admin' ? adminLinks : userLinks
  return (
    <>
      {linksToRender.map((link) => {
        const LinkIcon = link.icon
        return (
          <Link
            key={link.name}
            href={link.href}
            // className={clsx(defaultStyle,{'bg-sky-200 text-blue-600': pathname === link.href},)} 
            className={`${defaultStyle} ${pathname === link.href ? 'bg-sky-200 text-blue-600' : ''}`}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}
