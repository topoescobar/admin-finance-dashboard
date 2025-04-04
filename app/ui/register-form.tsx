'use client'

import { lusitana } from '@/app/ui/fonts'
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import { Button } from '@/app/ui/button'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate, register } from '@/app/lib/actions'
import { useActionState, useState } from 'react'

export default function RegisterForm() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined)
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [notification, setNotification] = useState('') // Nuevo estado para la notificación


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden')
    }
    else {
      try {
        await register(new FormData(event.currentTarget))
        setNotification('Registro exitoso')
      } catch (error) {
        console.log('register handleSubmit failed', error)
        if (error instanceof Error) {
          setNotification(error.message)
        } else {
          setNotification('Ocurrió un error desconocido')
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl text-gray-900`}>
          Registro
        </h1>
        {notification && (
          <div className="flex items-center space-x-2 bg-orange-200 text-orange-700 p-2 rounded-md">
            <ExclamationCircleIcon className="h-5 w-5" />
            <p>{notification}</p>
          </div>
        )}
        <div className="w-full">
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="email" >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                id="email"
                type="email"
                name="email"
                placeholder="Ingresar email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                id="password"
                type="password"
                name="password"
                placeholder="Igresar contraseña"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900" htmlFor="repeatPassword">
              Repetir Contraseña
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 dark:text-gray-900"
                id="repeatPassword"
                type="password"
                name="repeatPassword"
                placeholder="Repetir contraseña"
                required
                minLength={6}
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
          </div>


        </div>
        <RegisterButton />
        <div className='mt-4'>
          <p className="text-sm text-gray-500">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="font-medium text-blue-500">
              Iniciar sesión
            </a>
          </p>
        </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
        </div>
      </div>
    </form>
  )
}

function RegisterButton() {

  return (
    <Button className="mt-4 w-full" >
      Registrarme <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  )
}