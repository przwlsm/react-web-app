import { locationById } from '../data/locations'
import { cx, dayLabel, money } from '../utils/format'
import { KindTile, StatusChip } from './ui'

export default function DepositRow({ deposit, onClick }) {
  const { status } = deposit
  const completed = status === 'completed'
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-surface-2/60"
    >
      <KindTile kind={locationById(deposit.locationId)?.kind} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-bold leading-snug">{deposit.locationName}</span>
        <span className="mt-0.5 block truncate text-xs text-ink-2">
          Terminal {deposit.terminal} · {deposit.type}
        </span>
        {!completed && (
          <span className="mt-1.5 block">
            <StatusChip status={status} />
          </span>
        )}
      </span>
      <span className="shrink-0 text-right">
        {deposit.amount != null && (
          <span
            className={cx(
              'mb-0.5 block text-[15px] font-extrabold tabular-nums',
              completed ? 'text-success' : 'text-ink-2',
            )}
          >
            {completed && '+'}
            {money(deposit.amount)}
          </span>
        )}
        <span className="block text-xs text-ink-2">{dayLabel(deposit.createdAt)}</span>
      </span>
    </button>
  )
}
