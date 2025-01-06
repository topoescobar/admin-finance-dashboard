import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { lusitana, oswald } from '@/app/ui/fonts'
import Image from 'next/image'

export default function Logo() {
  return (
    <div className={`${oswald.className} sidebar_logo`} >
      <Image className='hidden md:block' src={'/logo_oscuro.png'} width={250} height={250} alt={'Logo'} />
      <Image className='block md:hidden' src={'/logo_oscuro.png'} width={150} height={150} alt={'Logo'} />
    </div>
  )
}
