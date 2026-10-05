import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, Info, LogOut, Moon, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Sheet from '../components/Sheet'
import { Button, PageHeader, Toggle } from '../components/ui'
import { bankById, bankGradient } from '../data/banks'
import { accountLabel, MAX_DEPOSIT, money } from '../utils/format'

function Group({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-[13px] font-bold uppercase tracking-wider text-ink-2">
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
        <Icon className="size-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold">{title}</p>
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

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <div className="flex min-h-0 flex-1 animate-page-in flex-col">
      <PageHeader title="Settings" />

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-5">
        <div className="flex items-center gap-4 rounded-3xl bg-surface p-4 shadow-soft">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-accent-soft text-lg font-extrabold text-accent-soft-ink">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-extrabold tracking-tight">{user.name}</p>
            {user.phone && <p className="truncate text-[13px] text-ink-2">{user.phone}</p>}
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
                <p className="truncate text-[15px] font-bold">{account.bankName}</p>
                <p className="text-xs text-ink-2">
                  {account.type} · •••• {account.last4}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${accountLabel(account)}`}
                onClick={() => setRemoving(account)}
                className="grid size-10 place-items-center rounded-full text-danger transition active:bg-danger-bg"
              >
                <Trash2 className="size-[18px]" />
              </button>
            </div>
          ))}
          <Link
            to="/accounts/new"
            className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-bold text-link transition active:bg-surface-2/60"
          >
            <span className="grid size-10 place-items-center rounded-xl border-2 border-dashed border-ink/15">
              <Plus className="size-[18px]" />
            </span>
            Add New Account
          </Link>
        </Group>

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
            className="w-full text-left transition active:bg-surface-2/60"
          >
            <Row
              Icon={RotateCcw}
              title="Reset demo data"
              subtitle="Restore the sample accounts and deposits"
            />
          </button>
        </Group>

        <Button variant="danger" className="mt-6" onClick={askLogout}>
          <LogOut />
          Log out
        </Button>
        <p className="mt-4 text-center text-xs text-ink-3">QuickDeposit · v0.1.0</p>
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
