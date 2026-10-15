import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode
}

export function Input({ icon, className, disabled, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon ? (
        <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
      ) : null}
      <input
        disabled={disabled}
        className={[
          'h-10 w-full rounded-md border border-border bg-input font-sans text-sm text-foreground',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          icon ? 'ps-10 pe-3' : 'px-3',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </div>
  )
}
