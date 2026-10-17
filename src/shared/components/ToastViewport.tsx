import type { ToastRecord } from '../../contexts/toast.ts'
import { Button } from './Button.tsx'
import { IconButton } from './IconButton.tsx'

const variantClassName = {
  success: 'bg-primary text-primary-foreground',
  error: 'bg-danger text-danger-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'border border-border border-s-4 border-s-primary bg-surface text-foreground',
  loading: 'border border-border bg-surface text-foreground',
} as const

type ToastViewportProps = Readonly<{
  toasts: ToastRecord[]
  onDismiss: (id: string) => void
  onPause: (id: string) => void
  onResume: (id: string) => void
}>

export function ToastViewport({ toasts, onDismiss, onPause, onResume }: ToastViewportProps) {
  if (toasts.length === 0) return null

  return (
    <section
      aria-label="Notifications"
      className="pointer-events-none fixed start-4 end-4 bottom-4 z-50 flex flex-col gap-2 sm:start-auto sm:w-96"
    >
      {toasts.map((toast) => {
        const assertive = toast.variant === 'error' || toast.variant === 'warning'

        return (
          <article
            key={toast.id}
            role={assertive ? 'alert' : 'status'}
            aria-live={assertive ? 'assertive' : 'polite'}
            aria-busy={toast.variant === 'loading' || undefined}
            className={[
              'pointer-events-auto flex animate-toast-in items-start gap-3 rounded-md p-4 shadow-soft motion-reduce:animate-none',
              variantClassName[toast.variant],
            ].join(' ')}
            onMouseEnter={() => onPause(toast.id)}
            onMouseLeave={() => onResume(toast.id)}
            onFocus={() => onPause(toast.id)}
            onBlur={() => onResume(toast.id)}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium break-words">{toast.message}</p>
              {toast.description ? (
                <p className="mt-1 text-sm break-words opacity-90">{toast.description}</p>
              ) : null}
              {toast.action ? (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 !h-8 !border-current !bg-transparent !px-3 !text-current hover:!bg-black/10"
                  onClick={toast.action.onClick}
                >
                  {toast.action.label}
                </Button>
              ) : null}
            </div>
            <IconButton
              label="Dismiss notification"
              tone="ghost"
              shape="circle"
              className="!size-8 !bg-transparent !text-current hover:!bg-black/10"
              icon={<CloseIcon />}
              onClick={() => onDismiss(toast.id)}
            />
          </article>
        )
      })}
    </section>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}
