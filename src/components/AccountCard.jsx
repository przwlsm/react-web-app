import { ArrowRight } from 'lucide-react'
import { bankById, bankGradient } from '../data/banks'
import { cx } from '../utils/format'

export default function AccountCard({ account, onClick, className }) {
  const bank = bankById(account.bankId)
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-label={
        onClick
          ? `Deposit to ${account.bankName} ${account.type} ending in ${account.last4}`
          : undefined
      }
      style={bankGradient(bank)}
      className={cx(
        '@container relative block w-full overflow-hidden rounded-[1.625rem] p-5 text-left text-white shadow-float',
        onClick && 'transition hover:brightness-110 active:scale-[0.98]',
        className,
      )}
    >
      {/* A diagonal sheen and a hairline inner edge make the card read as a physical object. */}
      <span className="pointer-events-none absolute inset-0 rounded-[1.625rem] bg-linear-to-br from-white/20 via-transparent to-black/15 ring-1 ring-inset ring-white/20" />
      <span className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-14 -left-6 size-32 rounded-full bg-black/10" />

      <span className="relative flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-white/20 text-[0.8125rem] font-extrabold">
          {bank.mark}
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wide">
          {account.type}
        </span>
      </span>

      <span className="relative mt-5 block text-[0.6875rem] font-bold uppercase tracking-wide text-white/70">
        Account number
      </span>
      <span className="relative mt-0.5 block font-mono text-[1.1875rem] font-semibold tracking-[0.14em]">
        •••• {account.last4 || '••••'}
      </span>

      <span className="relative mt-3 flex items-end justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate text-[0.9375rem] font-bold">
            {account.bankName || 'Your bank'}
          </span>
          <span className="block truncate text-xs text-white/70">{account.holder}</span>
        </span>
        {onClick && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-bold">
            {/* On a narrow card the word gives way so the bank name is not cut short. */}
            <span className="@max-[12.5rem]:hidden">Deposit</span>
            <ArrowRight className="size-3.5" />
          </span>
        )}
      </span>
    </Tag>
  )
}
