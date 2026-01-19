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


export default function NavLinks({ linksToRender }: { linksToRender: LinksToRender[] }) {
  const pathname = usePathname()
  const defaultStyle = 'flex flex-col md:flex-row min-h-[48px] grow items-center justify-center gap-1 md:gap-2 rounded-md p-2 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3'

  return (
    <>
      {linksToRender.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`${defaultStyle} ${pathname === link.href ? 'bg-sky-200 text-blue-600 dark:bg-indigo-900 border dark:text-white dark:font-bold' : 'bg-gray-50 hover:bg-sky-100 hover:text-blue-600 dark:bg-indigo-700 dark:text-white dark:hover:bg-indigo-900'}`}
          >
            <Icon linkIcon={link.icon} />
            <p className="text-xs md:text-sm text-center md:text-left break-words">{link.name}</p>
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