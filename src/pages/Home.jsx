import { Link, useNavigate } from 'react-router-dom'
import { Barcode, Bell, Inbox, LogOut, Menu, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AccountCard from '../components/AccountCard'
import DepositRow from '../components/DepositRow'
import { EmptyState, IconButton, SectionTitle } from '../components/ui'
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
  const navigate = useNavigate()

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
    <div className="flex min-h-0 flex-1 animate-page-in flex-col">
      {/* Solid teal bar; the gradient panel below starts from the same colour so they read as one. */}
      <header className="gutter relative z-10 flex shrink-0 items-center gap-2 bg-brand pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white [--gutter:1rem] [--page:56rem]">
        <IconButton tone="brand" label="Open menu" className="lg:hidden" onClick={openMenu}>
          <Menu />
        </IconButton>
        <div className="min-w-0 flex-1 pl-1 leading-tight">
          <p className="text-xs font-medium text-white/80">{greeting()},</p>
          <p className="truncate text-[17px] font-extrabold tracking-tight">{user.name}</p>
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
              className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff6b5e] px-1 text-[11px] font-extrabold leading-none tabular-nums text-white ring-2 ring-brand"
            >
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </IconButton>
        <IconButton tone="brand" label="Log out" className="lg:hidden" onClick={askLogout}>
          <LogOut />
        </IconButton>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-[calc(10rem+env(safe-area-inset-bottom))] [--page:56rem] lg:pb-10">
        <section className="gutter relative overflow-hidden rounded-b-[32px] bg-linear-to-b from-brand to-brand-hi pb-6 pt-3 text-white md:flex md:items-end md:justify-between md:gap-8 md:pb-8">
          <span className="pointer-events-none absolute -bottom-14 -right-12 size-40 rounded-full border-[12px] border-[#35d98a]/80" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-wider text-white/80">
              Deposited this month
            </p>
            <p className="mt-1.5 text-[44px] font-extrabold leading-none tracking-tight tabular-nums">
              {money(monthTotal)}
            </p>
            <p className="mt-2.5 text-sm text-white/90">
              {thisMonth.length} {thisMonth.length === 1 ? 'deposit' : 'deposits'} · up to{' '}
              {money(MAX_DEPOSIT)} each
            </p>
          </div>
          <Link
            to="/deposit/new"
            className="relative mt-5 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-bold text-brand shadow-float transition active:scale-[0.98] md:mt-0 md:w-64 md:shrink-0"
          >
            <Barcode className="size-5" />
            New deposit
          </Link>
        </section>

        <section className="mt-6">
          <div className="gutter">
            <SectionTitle
              action={
                <Link
                  to="/accounts/new"
                  className="flex items-center gap-1 text-[13px] font-bold text-link"
                >
                  <Plus className="size-4" />
                  Add
                </Link>
              }
            >
              My accounts
            </SectionTitle>
          </div>
          <div className="no-scrollbar gutter flex snap-x snap-mandatory gap-3 overflow-x-auto pb-5">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                className="w-[80%] shrink-0 snap-center md:w-[340px]"
                onClick={() => navigate(`/deposit/new?account=${account.id}`)}
              />
            ))}
            <Link
              to="/accounts/new"
              className="flex min-h-[172px] w-[46%] shrink-0 snap-center flex-col md:w-48 items-center justify-center gap-2 rounded-[26px] border-2 border-dashed border-ink/15 text-center text-[13px] font-bold text-ink-2 transition active:scale-[0.98]"
            >
              <span className="grid size-11 place-items-center rounded-full bg-surface shadow-soft">
                <Plus className="size-5" />
              </span>
              Add new
              <br />
              account
            </Link>
          </div>
        </section>

        <section className="gutter mt-2">
          <SectionTitle
            action={
              deposits.length > 0 && (
                <Link to="/history" className="text-[13px] font-bold text-link">
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
  )
}
