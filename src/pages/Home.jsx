import { Link } from 'react-router-dom'
import { ArrowRight, Barcode, Bell, Inbox, LogOut, Menu, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import DepositRow from '../components/DepositRow'
import { EmptyState, IconButton, SectionTitle } from '../components/ui'
import { bankById, bankGradient } from '../data/banks'
import { MAX_DEPOSIT, money } from '../utils/format'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { user, accounts, deposits, notifications, openMenu, openNotifications, askLogout, openDetail } =
    useApp()

  const unread = notifications.filter((n) => !n.read).length
  const today = new Date()
  const thisMonth = deposits.filter((d) => {
    const date = new Date(d.createdAt)
    return (
      d.status === 'completed' &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  })
  const monthTotal = thisMonth.reduce((sum, d) => sum + (d.amount ?? 0), 0)

  return (
    <div className="flex min-h-0 flex-1 animate-page-in flex-col [--page:56rem] xl:[--page:96rem]">
      {/* Solid teal bar; the gradient panel below starts from the same colour so they read as one. */}
      <header className="gutter relative z-10 flex shrink-0 items-center gap-2 bg-brand pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white max-lg:[--gutter:1rem]">
        <IconButton tone="brand" label="Open menu" className="lg:hidden" onClick={openMenu}>
          <Menu />
        </IconButton>
        <div className="min-w-0 flex-1 pl-1 leading-tight">
          <p className="text-xs font-medium text-white/80">{greeting()},</p>
          <p className="truncate text-[1.0625rem] font-extrabold tracking-tight">{user.name}</p>
        </div>
        <IconButton
          tone="brand"
          label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
          onClick={openNotifications}
        >
          <Bell />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff6b5e] px-1 text-[0.6875rem] font-extrabold leading-none tabular-nums text-white ring-2 ring-brand"
            >
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </IconButton>
        <IconButton tone="brand" label="Log out" className="lg:hidden" onClick={askLogout}>
          <LogOut />
        </IconButton>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-[calc(10rem+env(safe-area-inset-bottom))] lg:pb-10">
        <section className="gutter relative overflow-hidden rounded-b-[2rem] bg-linear-to-b from-brand to-brand-hi pb-6 pt-3 text-white md:flex md:items-end md:justify-between md:gap-8 md:pb-8">
          <span className="pointer-events-none absolute -bottom-14 -right-12 size-40 rounded-full border-[12px] border-[#35d98a]/80" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              Deposited this month
            </p>
            <p className="mt-1.5 text-[2.75rem] font-extrabold leading-none tracking-tight tabular-nums">
              {money(monthTotal)}
            </p>
            <p className="mt-2.5 text-sm text-white/90">
              {thisMonth.length} {thisMonth.length === 1 ? 'deposit' : 'deposits'} · up to{' '}
              {money(MAX_DEPOSIT)} each
            </p>
          </div>
          <Link
            to="/deposit/new"
            className="relative mt-5 flex h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-white text-[0.9375rem] font-bold text-brand shadow-float transition hover:bg-white/90 active:scale-[0.98] md:mt-0 md:w-64 md:shrink-0"
          >
            <Barcode className="size-5" />
            New deposit
          </Link>
        </section>

        {/* Stacked up to laptop width; on large screens accounts and deposits sit side by side. */}
        <div className="xl:gutter mt-6 xl:grid xl:grid-cols-2 xl:items-start xl:gap-8">
          <section>
            <div className="gutter xl:px-0">
              <SectionTitle
                action={
                  <Link
                    to="/accounts/new"
                    className="flex items-center gap-1 text-[0.8125rem] font-bold text-link underline-offset-4 hover:underline"
                  >
                    <Plus className="size-4" />
                    Add
                  </Link>
                }
              >
                My accounts
              </SectionTitle>
            </div>
            {/* A compact list of slim cards in each bank's colours, so every account is on screen
                without swiping. Two columns on tablets; one again once deposits sit alongside. */}
            <ul className="gutter grid gap-2.5 md:grid-cols-2 xl:grid-cols-1 xl:px-0">
              {accounts.map((account) => {
                const bank = bankById(account.bankId)
                return (
                  <li key={account.id}>
                    <Link
                      to={`/deposit/new?account=${account.id}`}
                      aria-label={`Deposit to ${account.bankName} ${account.type} ending in ${account.last4}`}
                      style={bankGradient(bank)}
                      className="relative flex items-center gap-3 overflow-hidden rounded-[1.375rem] px-4 py-3.5 text-white shadow-soft transition hover:brightness-110 active:scale-[0.98]"
                    >
                      {/* The same sheen and soft circle as the full-size account card. */}
                      <span className="pointer-events-none absolute inset-0 rounded-[1.375rem] bg-linear-to-br from-white/20 via-transparent to-black/15 ring-1 ring-inset ring-white/20" />
                      <span className="pointer-events-none absolute -top-12 right-16 size-28 rounded-full bg-white/10" />

                      <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-white/20 text-[0.8125rem] font-extrabold ring-1 ring-inset ring-white/25">
                        {bank.mark}
                      </span>
                      <span className="relative min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] font-bold leading-snug">
                          {account.bankName}
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-medium text-white/80">
                          {account.type} ·{' '}
                          <span className="font-mono tracking-wider">•••• {account.last4}</span>
                        </span>
                      </span>
                      <span
                        style={{ color: bank.to }}
                        className="relative flex shrink-0 items-center gap-1 rounded-full bg-white py-1.5 pl-3 pr-2.5 text-xs font-extrabold shadow-soft"
                      >
                        Deposit
                        <ArrowRight className="size-3.5" strokeWidth={2.5} />
                      </span>
                    </Link>
                  </li>
                )
              })}
              {/* Adding lives in the section header; the row only fills in when the list is empty. */}
              {accounts.length === 0 && (
                <li>
                  <Link
                    to="/accounts/new"
                    className="flex min-h-[4.25rem] items-center justify-center gap-2 rounded-[1.375rem] border-2 border-dashed border-ink/15 text-sm font-bold text-ink-2 transition hover:border-ink/30 hover:text-ink active:scale-[0.98]"
                  >
                    <Plus className="size-4" />
                    Add new account
                  </Link>
                </li>
              )}
            </ul>
          </section>

          <section className="gutter mt-6 xl:mt-0 xl:px-0">
            <SectionTitle
              action={
                deposits.length > 0 && (
                  <Link
                    to="/history"
                    className="text-[0.8125rem] font-bold text-link underline-offset-4 hover:underline"
                  >
                    See all
                  </Link>
                )
              }
            >
              Recent deposits
            </SectionTitle>
            <div className="overflow-hidden rounded-3xl bg-surface shadow-soft">
              {deposits.length === 0 ? (
                <EmptyState Icon={Inbox} title="No deposits yet">
                  Your deposits will appear here once you make one.
                </EmptyState>
              ) : (
                <ul className="divide-y divide-line">
                  {deposits.slice(0, 5).map((deposit) => (
                    <li key={deposit.id}>
                      <DepositRow deposit={deposit} onClick={() => openDetail(deposit.id)} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
