import { useState } from 'react'
import { Search, SearchX } from 'lucide-react'
import { useApp } from '../context/AppContext'
import DepositRow from '../components/DepositRow'
import { EmptyState, FilterChip, PageHeader } from '../components/ui'
import { money, monthLabel } from '../utils/format'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Awaiting scan' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function History() {
  const { deposits, openDetail } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const needle = query.trim().toLowerCase()
  const visible = deposits.filter((d) => {
    if (filter !== 'all' && d.status !== filter) return false
    if (!needle) return true
    return [d.locationName, d.terminal, d.accountLabel, d.type, d.ref, d.amount ?? '']
      .join(' ')
      .toLowerCase()
      .includes(needle)
  })

  // Deposits are stored newest-first, so consecutive runs share a month.
  const groups = []
  for (const deposit of visible) {
    const label = monthLabel(deposit.createdAt)
    let group = groups[groups.length - 1]
    if (!group || group.label !== label) {
      group = { label, items: [], total: 0 }
      groups.push(group)
    }
    group.items.push(deposit)
    if (deposit.status === 'completed') group.total += deposit.amount ?? 0
  }

  return (
    <div className="flex min-h-0 flex-1 animate-page-in flex-col">
      <PageHeader
        title="Transaction History"
        subtitle={`${deposits.length} ${deposits.length === 1 ? 'deposit' : 'deposits'}`}
      >
        <label className="relative mt-3 block">
          <span className="sr-only">Search deposits</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#6f8589]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location, account or amount"
            className="h-12 w-full rounded-2xl bg-white pl-12 pr-4 text-base font-medium text-[#0b2b31] outline-none placeholder:text-[#6f8589] focus:ring-4 focus:ring-white/35"
          />
        </label>
      </PageHeader>

      <div className="no-scrollbar gutter flex shrink-0 gap-2 overflow-x-auto pb-3 pt-4">
        {FILTERS.map((f) => (
          <FilterChip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </FilterChip>
        ))}
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto gutter pb-[calc(10rem+env(safe-area-inset-bottom))] lg:pb-10">
        {groups.length === 0 ? (
          <EmptyState Icon={SearchX} title="No deposits found">
            Try a different search or filter.
          </EmptyState>
        ) : (
          groups.map((group) => (
            <section key={group.label} className="mb-5">
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="text-[13px] font-bold uppercase tracking-wider text-ink-2">
                  {group.label}
                </h2>
                <p className="text-[13px] font-bold tabular-nums text-ink-2">
                  {money(group.total)} deposited
                </p>
              </div>
              <ul className="divide-y divide-line overflow-hidden rounded-3xl bg-surface shadow-soft">
                {group.items.map((deposit) => (
                  <li key={deposit.id}>
                    <DepositRow deposit={deposit} onClick={() => openDetail(deposit.id)} />
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
