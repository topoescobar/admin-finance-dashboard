import Logo from '@/app/ui/acme-logo'
import LoginForm from '@/app/ui/login-form'
import { Button } from '../ui/button'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36 mx-auto">
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </div>
        <LoginForm />
        <RegisterButton />
      </div>
    </main>
  )
}

function RegisterButton() {
  return (
    <Link href="/register">
      <Button className="mt-4 w-full" >
        Register <ArrowRightOnRectangleIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
    </Link>
  )
}