'use client'
import { LinksToRender } from '@/app/lib/definitions'
import {
  UserGroupIcon,
  HomeIcon,
  BanknotesIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


export default function NavLinks({ linksToRender }: { linksToRender : LinksToRender[]}  ) {
  const pathname = usePathname()
  const defaultStyle = 'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-700'

  return (
    <>
      {linksToRender.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`${defaultStyle} ${pathname === link.href ? 'bg-sky-200 text-blue-600 dark:bg-indigo-500 border' : ''}`}
          >
            <Icon linkIcon={link.icon} />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}

export function Icon({ linkIcon }: { linkIcon: string }) {
const LinkIcon = 
  linkIcon === 'HomeIcon' ? HomeIcon :
  linkIcon === 'UserGroupIcon' ? UserGroupIcon :
  linkIcon === 'DocumentTextIcon' ? DocumentTextIcon :
  linkIcon === 'BanknotesIcon' ? BanknotesIcon : QuestionMarkCircleIcon

  return (
    <div>
      <LinkIcon className="w-6" />
    </div>
  )
}