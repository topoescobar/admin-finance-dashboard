import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { lusitana } from '@/app/ui/fonts'
import Image from 'next/image'

export default function AcmeLogo() {
  return (
    <div className={`${lusitana.className} sidebar_logo`} >
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      {/* <Image src={'/logo_oscuro.png'} width={250} height={250} alt={'Logo'} /> */}
      <p className="text-[34px]">Fractal Crypto Lab</p>
    </div>
  )
}
