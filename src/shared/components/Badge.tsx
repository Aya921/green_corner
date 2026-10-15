import type { HTMLAttributes, ReactNode } from 'react'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  icon?: ReactNode
}

export function Badge({ icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-sm bg-primary px-3 py-1.5 font-sans text-sm font-medium text-primary-foreground',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {icon ? <span className="inline-flex shrink-0 [&_svg]:size-4">{icon}</span> : null}
      {children}
    </span>
  )
}
