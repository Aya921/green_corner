const tones = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  tertiary: 'bg-accent',
} as const

export type ProgressTone = keyof typeof tones

type ProgressProps = {
  value: number
  tone?: ProgressTone
  label?: string
}

export function Progress({ value, tone = 'primary', label = 'Progress' }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className={['h-full rounded-full', tones[tone]].join(' ')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
