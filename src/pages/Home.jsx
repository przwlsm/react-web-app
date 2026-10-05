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
      <header className="relative z-10 flex shrink-0 items-center gap-2 bg-brand px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white">
        <IconButton tone="brand" label="Open menu" onClick={openMenu}>
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
            <span className="absolute right-2.5 top-2.5 size-2.5 rounded-full bg-[#ff6b5e] ring-2 ring-brand" />
          )}
        </IconButton>
        <IconButton tone="brand" label="Log out" onClick={askLogout}>
          <LogOut />
        </IconButton>
      </header>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
        <section className="relative overflow-hidden rounded-b-[32px] bg-linear-to-b from-brand to-brand-hi px-5 pb-6 pt-3 text-white">
          <span className="pointer-events-none absolute -bottom-14 -right-12 size-40 rounded-full border-[12px] border-[#35d98a]/80" />
          <p className="relative text-xs font-bold uppercase tracking-wider text-white/80">
            Deposited this month
          </p>
          <p className="relative mt-1.5 text-[44px] font-extrabold leading-none tracking-tight tabular-nums">
            {money(monthTotal)}
          </p>
          <p className="relative mt-2.5 text-sm text-white/90">
            {thisMonth.length} {thisMonth.length === 1 ? 'deposit' : 'deposits'} · up to{' '}
            {money(MAX_DEPOSIT)} each
          </p>
          <Link
            to="/deposit/new"
            className="relative mt-5 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-white text-[15px] font-bold text-brand shadow-float transition active:scale-[0.98]"
          >
            <Barcode className="size-5" />
            New deposit
          </Link>
        </section>

        <section className="mt-6">
          <div className="px-5">
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
          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-5">
            {accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                className="w-[80%] shrink-0 snap-center"
                onClick={() => navigate(`/deposit/new?account=${account.id}`)}
              />
            ))}
            <Link
              to="/accounts/new"
              className="flex min-h-[172px] w-[46%] shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-[26px] border-2 border-dashed border-ink/15 text-center text-[13px] font-bold text-ink-2 transition active:scale-[0.98]"
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

        <section className="mt-2 px-5">
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
