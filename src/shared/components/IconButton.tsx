import type { ButtonHTMLAttributes, ReactNode } from 'react'

const tones = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-800',
  muted: 'bg-secondary text-secondary-foreground hover:bg-secondary-500',
  tertiary: 'bg-accent text-accent-foreground hover:bg-tertiary-600',
  danger: 'bg-danger text-danger-foreground hover:bg-danger/90',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
} as const

const shapes = {
  circle: 'rounded-full',
  square: 'rounded-sm',
} as const

export type IconButtonTone = keyof typeof tones
export type IconButtonShape = keyof typeof shapes

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  icon: ReactNode
  tone?: IconButtonTone
  shape?: IconButtonShape
  active?: boolean
}

export function IconButton({
  label,
  icon,
  tone = 'ghost',
  shape = 'circle',
  active = false,
  className,
  type = 'button',
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      aria-pressed={active}
      className={[
        'inline-flex size-10 items-center justify-center [&_svg]:size-4',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        shapes[shape],
        active ? 'bg-primary text-primary-foreground hover:bg-primary-800' : tones[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon}
    </button>
  )
}
