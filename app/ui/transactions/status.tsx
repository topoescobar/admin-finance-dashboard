import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function TransactionStatus({ status, value }: { status: string; value: number }) {
  const isDeposit = value > 0

  return (
    <>
      <span
        className={clsx(
          'inline-flex items-center rounded-full px-2 py-1 text-xs',
          {
            'bg-teal-100 text-gray-500': status === 'pending' && isDeposit,
            'bg-teal-600 text-white': status === 'executed' && isDeposit,
            'bg-red-500 text-white': status === 'executed' && !isDeposit,
            'bg-red-100 text-gray-500': status === 'pending' && !isDeposit,
          },
        )}
      >
        {status === 'pending' ? (
          <>
            {isDeposit ? 'Depósito' : 'Retiro'} Pendiente
            <ClockIcon className="ml-1 w-4 text-gray-500" />
          </>
        ) : null}
        {status === 'executed' ? (
          <>
            {isDeposit ? 'Depósito' : 'Retiro'} Ejecutado
            <CheckIcon className="ml-1 w-4 text-white" />
          </>
        ) : null}
      </span>
    </>
  )
}
