import { createContext } from 'react'

export const DEFAULT_TOAST_DURATION = 5000
export const MAX_TOASTS = 4

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  description?: string
  duration?: number
  persistent?: boolean
  action?: ToastAction
}

export type ToastPromiseMessages<T> = {
  loading: string
  success: string | ((value: T) => string)
  error: string | ((reason: unknown) => string)
}

export type ToastRecord = {
  id: string
  variant: ToastVariant | 'loading'
  message: string
  description?: string
  persistent: boolean
  duration: number
  action?: ToastAction
}

export type ToastApi = {
  success: (message: string, options?: ToastOptions) => string
  error: (message: string, options?: ToastOptions) => string
  warning: (message: string, options?: ToastOptions) => string
  info: (message: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
  promise: <T>(
    operation: Promise<T>,
    messages: ToastPromiseMessages<T>,
    options?: ToastOptions,
  ) => Promise<T>
}

export const ToastContext = createContext<ToastApi | null>(null)
