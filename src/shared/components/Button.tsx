import type { ButtonHTMLAttributes, ReactNode } from 'react'

const variants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-800 active:bg-primary-900',
  secondary:
    'border border-border bg-muted text-foreground hover:bg-neutral-200 active:bg-neutral-300',
  inverted: 'bg-neutral-950 text-primary-foreground hover:bg-neutral-900 active:bg-neutral-800',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted active:bg-neutral-200',
} as const

export type ButtonVariant = keyof typeof variants

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  icon,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 font-sans text-sm font-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon ? <span className="inline-flex shrink-0 [&_svg]:size-4">{icon}</span> : null}
      {children}
    </button>
  )
}
