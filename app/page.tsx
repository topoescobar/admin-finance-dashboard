import AcmeLogo from '@/app/ui/acme-logo'
import { ArrowRightIcon, ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { lusitana } from './ui/fonts'
import Image from 'next/image'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-center mt-3 p-4 md:h-52">
        <AcmeLogo />
      </div>
      <div className="mt-4 flex flex-col justify-center gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-slate-900 px-6 py-10 md:w-2/5 md:px-20">
          <h2 className={`text-xl text-gray-200 md:text-3xl md:leading-normal ${lusitana.className}`}>
            Tablero de control
          </h2>
          <div className='flex flex-col gap-4'>
            <Link href="/login" className="flex items-center gap-5 self-start rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:text-base">
              <span>Ingresar</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-5 self-start rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:text-base">
              <span>Dashboard</span> <ChartBarIcon className="w-5 md:w-6" />
            </Link>
            <Link href="https://fractalcrypto.tech/" target="_blank" className="flex items-center gap-5 self-start rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 md:text-base">
              <span>Sitio web</span> <GlobeAltIcon className="w-5 md:w-6" />
            </Link>
          </div>

        </div>

      </div>
    </main>
  )
}
