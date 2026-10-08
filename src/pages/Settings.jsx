import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, Info, LogOut, Moon, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Sheet from '../components/Sheet'
import { Button, PageHeader, Toggle } from '../components/ui'
import { bankById, bankGradient } from '../data/banks'
import { accountLabel, initialsOf, MAX_DEPOSIT, money } from '../utils/format'

function Group({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-[0.8125rem] font-bold uppercase tracking-wider text-ink-2">
        {title}
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-3xl bg-surface shadow-soft">
        {children}
      </div>
    </section>
  )
}

function Row({ Icon, title, subtitle, children }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink/5">
        <Icon className="size-[1.125rem]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.9375rem] font-bold">{title}</p>
        {subtitle && <p className="text-xs text-ink-2">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { user, accounts, settings, setSetting, removeAccount, resetDemoData, askLogout, showToast } =
    useApp()
  const [removing, setRemoving] = useState(null)

  return (
    <div className="flex min-h-0 flex-1 animate-page-in flex-col xl:[--page:72rem]">
      <PageHeader title="Settings" />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto gutter pb-[calc(10rem+env(safe-area-inset-bottom))] pt-5 lg:pb-10">
        {/* One column up to laptop width; two on large screens. */}
        <div className="xl:grid xl:grid-cols-2 xl:items-start xl:gap-x-8">
          <div>
            <div className="flex items-center gap-4 rounded-3xl bg-surface p-4 shadow-soft">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-lg font-extrabold text-accent-soft-ink">
                {initialsOf(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold tracking-tight">{user.name}</p>
                {user.phone && <p className="truncate text-[0.8125rem] text-ink-2">{user.phone}</p>}
              </div>
            </div>

            <Group title="Bank accounts">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center gap-3 px-4 py-3.5">
                  <span
                    style={bankGradient(bankById(account.bankId))}
                    className="grid size-10 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white"
                  >
                    {bankById(account.bankId).mark}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.9375rem] font-bold">{account.bankName}</p>
                    <p className="text-xs text-ink-2">
                      {account.type} · •••• {account.last4}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${accountLabel(account)}`}
                    onClick={() => setRemoving(account)}
                    className="grid size-10 place-items-center rounded-full text-danger transition hover:bg-danger-bg active:bg-danger-bg"
                  >
                    <Trash2 className="size-[1.125rem]" />
                  </button>
                </div>
              ))}
              <Link
                to="/accounts/new"
                className="flex items-center gap-3 px-4 py-3.5 text-[0.9375rem] font-bold text-link transition hover:bg-surface-2/40 active:bg-surface-2/60"
              >
                <span className="grid size-10 place-items-center rounded-xl border-2 border-dashed border-ink/15">
                  <Plus className="size-[1.125rem]" />
                </span>
                Add New Account
              </Link>
            </Group>
          </div>

          <div className="xl:[&>section:first-child]:mt-0">
            <Group title="Preferences">
              <Row Icon={BellRing} title="Deposit alerts" subtitle="Notify me about deposit updates">
                <Toggle
                  label="Deposit alerts"
                  checked={settings.depositAlerts}
                  onChange={(value) => setSetting('depositAlerts', value)}
                />
              </Row>
              <Row Icon={Moon} title="Dark mode" subtitle="Easier on the eyes at night">
                <Toggle
                  label="Dark mode"
                  checked={settings.theme === 'dark'}
                  onChange={(value) => setSetting('theme', value ? 'dark' : 'light')}
                />
              </Row>
            </Group>

            <Group title="Deposit limits">
              <Row
                Icon={Info}
                title={`Up to ${money(MAX_DEPOSIT)} per deposit`}
                subtitle="Whole dollar amounts only"
              />
            </Group>

            <Group title="Demo">
              <button
                type="button"
                onClick={() => {
                  resetDemoData()
                  showToast('Demo data restored')
                }}
                className="w-full text-left transition hover:bg-surface-2/40 active:bg-surface-2/60"
              >
                <Row
                  Icon={RotateCcw}
                  title="Reset demo data"
                  subtitle="Restore the sample accounts and deposits"
                />
              </button>
            </Group>
          </div>
        </div>

        <Button variant="danger" className="mt-6 xl:mx-auto xl:max-w-sm" onClick={askLogout}>
          <LogOut />
          Log out
        </Button>
        <p className="mt-4 text-center text-xs text-ink-3">BankDeposit · v0.1.0</p>
      </div>

      <Sheet open={Boolean(removing)} onClose={() => setRemoving(null)} title="Remove account?">
        {removing && (
          <>
            <p className="text-sm text-ink-2">
              {accountLabel(removing)} will be removed from this app. Past deposits stay in your
              history.
            </p>
            <div className="mt-5 space-y-2">
              <Button
                variant="danger"
                onClick={() => {
                  removeAccount(removing.id)
                  showToast('Account removed')
                  setRemoving(null)
                }}
              >
                Remove account
              </Button>
              <Button variant="ghost" onClick={() => setRemoving(null)}>
                Keep account
              </Button>
            </div>
          </>
        )}
      </Sheet>
    </div>
  )
}
