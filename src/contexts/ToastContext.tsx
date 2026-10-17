import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_TOAST_DURATION, MAX_TOASTS, ToastContext } from './toast.ts'
import { ToastViewport } from '../shared/components/ToastViewport.tsx'
import type {
  ToastApi,
  ToastOptions,
  ToastPromiseMessages,
  ToastRecord,
  ToastVariant,
} from './toast.ts'

type TimerEntry = {
  timeoutId: number
  remaining: number
  startedAt: number
}

let nextToastId = 0

function createToastId() {
  nextToastId += 1
  return `toast-${nextToastId}`
}

type ToastProviderProps = Readonly<{
  children: ReactNode
}>

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const toastsRef = useRef<ToastRecord[]>([])
  const timers = useRef(new Map<string, TimerEntry>())

  const clearTimer = useCallback((id: string) => {
    const entry = timers.current.get(id)
    if (!entry) return
    window.clearTimeout(entry.timeoutId)
    timers.current.delete(id)
  }, [])// so when the user click to close the toast, we clear the timer

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id)
      const next = toastsRef.current.filter((toast) => toast.id !== id)
      toastsRef.current = next
      setToasts(next)
    },
    [clearTimer],
  ) // if the user click to close the toast, we remove the toast from the list

  const startTimer = useCallback(
    (id: string, remaining: number) => {
      clearTimer(id)
      const timeoutId = window.setTimeout(() => dismiss(id), remaining) // call dismiss fn after the remaining time
      timers.current.set(id, { timeoutId, remaining, startedAt: Date.now() })
    },
    [clearTimer, dismiss],
  ) // disappear the toast after the remaining time

  const pause = useCallback((id: string) => {
    const entry = timers.current.get(id)
    if (!entry || entry.timeoutId === 0) return
    const elapsed = Date.now() - entry.startedAt
    window.clearTimeout(entry.timeoutId)
    timers.current.set(id, {
      timeoutId: 0,
      remaining: Math.max(0, entry.remaining - elapsed),
      startedAt: Date.now(),
    })
  }, [])

  const resume = useCallback(
    (id: string) => {
      const entry = timers.current.get(id)
      if (entry?.timeoutId !== 0) return
      if (entry.remaining <= 0) {
        dismiss(id)
        return
      }
      startTimer(id, entry.remaining)
    },
    [dismiss, startTimer],
  )

  const publish = useCallback(
    (next: ToastRecord[]) => {
      const overflow = Math.max(0, next.length - MAX_TOASTS)
      next.slice(0, overflow).forEach((toast) => clearTimer(toast.id))
      const visible = next.slice(overflow)
      toastsRef.current = visible
      setToasts(visible)
    },
    [clearTimer],
  )

  const push = useCallback(
    (record: ToastRecord) => {
      publish([...toastsRef.current, record])
      if (!record.persistent && record.variant !== 'loading') {
        startTimer(record.id, record.duration)
      }
    },
    [publish, startTimer],
  )

  const show = useCallback(
    (variant: ToastVariant, message: string, options?: ToastOptions) => {
      const id = createToastId()
      push({
        id,
        variant,
        message,
        description: options?.description,
        persistent: options?.persistent ?? false,
        duration: options?.duration ?? DEFAULT_TOAST_DURATION,
        action: options?.action,
      })
      return id
    },
    [push],
  )

  const promise = useCallback(
    <T,>(operation: Promise<T>, messages: ToastPromiseMessages<T>, options?: ToastOptions) => {
      const id = createToastId()
      push({
        id,
        variant: 'loading',
        message: messages.loading,
        description: options?.description,
        persistent: true,
        duration: options?.duration ?? DEFAULT_TOAST_DURATION,
        action: options?.action,
      })

      return operation.then(
        (value) => {
          const message =
            typeof messages.success === 'function' ? messages.success(value) : messages.success
          const next = toastsRef.current.map((toast) =>
            toast.id === id
              ? { ...toast, variant: 'success' as const, message, persistent: false }
              : toast,
          )
          publish(next)
          if (toastsRef.current.some((toast) => toast.id === id)) {
            startTimer(id, options?.duration ?? DEFAULT_TOAST_DURATION)
          }
          return value
        },
        (reason: unknown) => {
          const message =
            typeof messages.error === 'function' ? messages.error(reason) : messages.error
          const next = toastsRef.current.map((toast) =>
            toast.id === id
              ? { ...toast, variant: 'error' as const, message, persistent: false }
              : toast,
          )
          publish(next)
          if (toastsRef.current.some((toast) => toast.id === id)) {
            startTimer(id, options?.duration ?? DEFAULT_TOAST_DURATION)
          }
          throw reason
        },
      )
    },
    [publish, push, startTimer],
  )

  const api = useMemo<ToastApi>(
    () => ({
      success: (message, options) => show('success', message, options),
      error: (message, options) => show('error', message, options),
      warning: (message, options) => show('warning', message, options),
      info: (message, options) => show('info', message, options),
      dismiss,
      promise,
    }),
    [dismiss, promise, show],
  )

  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      activeTimers.forEach((entry) => window.clearTimeout(entry.timeoutId))
      activeTimers.clear()
    }
  }, [])

  return (
    <ToastContext value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} onPause={pause} onResume={resume} />
    </ToastContext>
  )
}

// ToastProvider
// │
// │
// ┌──────▼──────┐
// │     API     │
// └──────┬──────┘
// │
// ┌─────────────┼─────────────┐
// ↓             ↓             ↓
// success()      error()       promise()
// │             │             │
// └─────────────┼─────────────┘
// ↓
// show()
// ↓
// push()
// ↓
// publish()
// ↓
// ┌──────┴──────┐
// ↓             ↓
// toasts state    timer
//        │
// ┌─────────┴─────────┐
// ↓                   ↓
// pause()            resume()
//                  │
//                  ↓
//            startTimer()
//                  │
//                  ↓
//              dismiss()