'use client'

import { useEffect } from 'react'
import { useToast } from './use-toast'
import { cn } from '@/lib/utils'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto',
            'animate-fade-in',
            toast.variant === 'destructive'
              ? 'bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
          )}
        >
          {toast.variant === 'destructive' ? (
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            {toast.title && (
              <p className="text-sm font-semibold leading-tight">{toast.title}</p>
            )}
            {toast.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
