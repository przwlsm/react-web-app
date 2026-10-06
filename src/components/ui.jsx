import { ChevronLeft, Cross, Pill, Store } from 'lucide-react'
import { cx, STATUS_LABEL } from '../utils/format'

const BUTTON_VARIANTS = {
  primary: 'bg-btn-gradient text-btn-fg shadow-btn disabled:shadow-none',
  accent: 'bg-accent text-accent-ink',
  ghost: 'bg-surface text-ink shadow-soft',
  danger: 'bg-danger-bg text-danger',
}

export const buttonClass = (variant = 'primary') =>
  cx(
    'flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-[18px] text-base font-bold transition active:scale-[0.98] disabled:opacity-35 disabled:active:scale-100 [&_svg]:size-5',
    BUTTON_VARIANTS[variant],
  )

export function Button({ variant = 'primary', className, ...props }) {
  return <button type="button" className={cx(buttonClass(variant), className)} {...props} />
}

const ICON_TONES = {
  surface: 'bg-surface text-ink shadow-soft',
  plain: 'bg-ink/5 text-ink',
  brand: 'bg-white/15 text-white',
}

export function IconButton({ label, small, tone = 'surface', className, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        'relative grid shrink-0 place-items-center rounded-full transition active:scale-95',
        small ? 'size-9 [&_svg]:size-[18px]' : 'size-11 [&_svg]:size-5',
        ICON_TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Teal band across the top of a screen; children (search, progress) sit inside it.
export function PageHeader({ title, subtitle, onBack, right, children }) {
  return (
    <header className="gutter relative z-20 shrink-0 rounded-b-[28px] bg-brand-gradient pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white [--gutter:1rem]">
      <div className="flex min-h-11 items-center gap-3">
        {onBack && (
          <IconButton tone="brand" label="Back" onClick={onBack}>
            <ChevronLeft />
          </IconButton>
        )}
        <div className={cx('min-w-0 flex-1', !onBack && 'pl-1')}>
          <h1 className="truncate text-[22px] font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-xs font-medium text-white/80">{subtitle}</p>}
        </div>
        {right}
      </div>
      {children}
    </header>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[17px] font-extrabold tracking-tight">{children}</h2>
      {action}
    </div>
  )
}

const CHIP_STYLES = {
  completed: 'bg-success-bg text-success',
  pending: 'bg-warn-bg text-warn',
  cancelled: 'bg-danger-bg text-danger',
}

export function StatusChip({ status }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold',
        CHIP_STYLES[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}

const KIND_STYLES = {
  seven: { Icon: Store, className: 'bg-k-seven/15 text-k-seven' },
  cvs: { Icon: Pill, className: 'bg-k-cvs/15 text-k-cvs' },
  walgreens: { Icon: Cross, className: 'bg-k-walgreens/15 text-k-walgreens' },
}

export function KindTile({ kind }) {
  const { Icon, className } = KIND_STYLES[kind] ?? KIND_STYLES.seven
  return (
    <span className={cx('grid size-11 shrink-0 place-items-center rounded-2xl', className)}>
      <Icon className="size-5" />
    </span>
  )
}

export function FilterChip({ active, className, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'h-9 shrink-0 rounded-full px-4 text-[13px] font-bold transition active:scale-95',
        active ? 'bg-ink text-bg' : 'bg-surface text-ink-2 shadow-soft',
        className,
      )}
      {...props}
    />
  )
}

export function Segmented({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid shrink-0 auto-cols-fr grid-flow-col rounded-2xl bg-surface-2 p-1"
    >
      {options.map(({ value: optionValue, label: optionLabel, Icon }) => (
        <button
          key={optionValue}
          type="button"
          aria-pressed={value === optionValue}
          onClick={() => onChange(optionValue)}
          className={cx(
            'flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm font-bold transition',
            value === optionValue ? 'bg-surface text-ink shadow-soft' : 'text-ink-2',
          )}
        >
          {Icon && <Icon className="size-4" />}
          {optionLabel}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-8 w-[52px] shrink-0 rounded-full transition-colors',
        checked ? 'bg-accent' : 'bg-surface-2',
      )}
    >
      <span
        className={cx(
          'absolute left-1 top-1 size-6 rounded-full bg-white shadow transition-transform',
          checked && 'translate-x-5',
        )}
      />
    </button>
  )
}

export const inputClass =
  'h-14 w-full rounded-2xl border border-line bg-surface px-4 text-base font-semibold text-ink outline-none transition placeholder:font-medium placeholder:text-ink-3 focus:border-link focus:ring-4 focus:ring-link/15'

export function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-bold text-ink-2">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-danger">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block text-xs text-ink-3">{hint}</span>
      )}
    </label>
  )
}

export function EmptyState({ Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 text-center">
      <span className="grid size-16 place-items-center rounded-3xl bg-surface-2 text-ink-2">
        <Icon className="size-7" />
      </span>
      <p className="mt-4 text-[17px] font-extrabold tracking-tight">{title}</p>
      <p className="mt-1 max-w-[28ch] text-sm text-ink-2">{children}</p>
      {action && <div className="mt-5 w-full">{action}</div>}
    </div>
  )
}

// Sticky action area pinned to the bottom of a screen, fading the content behind it.
export function CtaBar({ children }) {
  return (
    <div className="gutter pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-bg from-65% to-transparent pb-[calc(1rem+env(safe-area-inset-bottom))] pt-8">
      <div className="pointer-events-auto mx-auto max-w-md space-y-2">{children}</div>
    </div>
  )
}
