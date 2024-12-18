import { AlertTriangle } from 'lucide-react'

interface ErrorProps {
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function Error({
  title = 'An error occurred',
  message,
  action,
}: ErrorProps) {
  return (
    <div className='card bg-error text-error-content'>
      <div className='card-body items-center text-center'>
        <AlertTriangle className='w-12 h-12 mb-2' />
        <h2 className='card-title'>{title}</h2>
        <p>{message}</p>
        {action && (
          <div className='card-actions justify-center mt-4'>
            <button
              className='btn btn-outline border-error-content text-error-content hover:bg-error-content hover:text-error'
              onClick={action.onClick}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
