import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AccountCard from '../components/AccountCard'
import { Button, Field, inputClass, PageHeader, Segmented } from '../components/ui'
import { bankById, bankGradient, BANKS } from '../data/banks'
import { accountLabel, cx, digitsOnly } from '../utils/format'

const ACCOUNT_TYPES = [
  { value: 'Checking', label: 'Checking' },
  { value: 'Savings', label: 'Savings' },
]

export default function AddAccount() {
  const { user, addAccount, showToast } = useApp()
  const navigate = useNavigate()
  const [bankId, setBankId] = useState('chase')
  const [otherName, setOtherName] = useState('')
  const [type, setType] = useState('Checking')
  const [holder, setHolder] = useState(user.name)
  const [routing, setRouting] = useState('')
  const [number, setNumber] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})

  const bankName = bankId === 'other' ? otherName.trim() : bankById(bankId).name

  // Editing a field clears its error so a stale message never sits under a corrected value.
  const edit = (setter, ...keys) => (value) => {
    setter(value)
    setErrors((prev) => keys.reduce((next, key) => ({ ...next, [key]: undefined }), prev))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!bankName) next.bank = "Enter your bank's name."
    if (!holder.trim()) next.holder = "Enter the account holder's name."
    if (routing.length !== 9) next.routing = 'Routing numbers are 9 digits.'
    if (number.length < 6) next.number = 'Enter 6 to 17 digits.'
    else if (confirm !== number) next.confirm = "Account numbers don't match."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Only the last four digits are kept; the full number never touches storage.
    const account = addAccount({
      bankId,
      bankName,
      type,
      last4: number.slice(-4),
      holder: holder.trim(),
    })
    showToast(`${accountLabel(account)} added`)
    navigate('/')
  }

  return (
    <div className="flex min-h-0 flex-1 animate-page-in flex-col">
      <PageHeader title="Add New Account" onBack={() => navigate(-1)} />

      <form
        onSubmit={submit}
        noValidate
        className="no-scrollbar gutter min-h-0 flex-1 space-y-5 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5"
      >
        <AccountCard
          className="md:max-w-sm"
          account={{ bankId, bankName, type, last4: number.slice(-4), holder: holder || ' ' }}
        />

        <div>
          <p className="mb-2 text-[13px] font-bold text-ink-2">Bank</p>
          <div className="grid grid-cols-3 gap-2 md:grid-cols-5">
            {BANKS.map((bank) => {
              const selected = bank.id === bankId
              return (
                <button
                  key={bank.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setBankId(bank.id)}
                  className={cx(
                    'relative flex flex-col items-center gap-2 rounded-2xl border-2 bg-surface px-2 py-3 text-center transition active:scale-[0.97]',
                    selected ? 'border-accent' : 'border-transparent shadow-soft',
                  )}
                >
                  <span
                    style={bankGradient(bank)}
                    className="grid size-10 place-items-center rounded-xl text-xs font-extrabold text-white"
                  >
                    {bank.mark}
                  </span>
                  <span className="text-[11.5px] font-bold leading-tight">{bank.name}</span>
                  {selected && (
                    <span className="absolute right-1.5 top-1.5 grid size-[18px] place-items-center rounded-full bg-accent text-accent-ink">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {bankId === 'other' && (
          <Field label="Bank name" error={errors.bank}>
            <input
              value={otherName}
              onChange={(e) => edit(setOtherName, 'bank')(e.target.value)}
              placeholder="e.g. Ally Bank"
              className={inputClass}
            />
          </Field>
        )}

        <div>
          <p className="mb-2 text-[13px] font-bold text-ink-2">Account type</p>
          <Segmented label="Account type" options={ACCOUNT_TYPES} value={type} onChange={setType} />
        </div>

        {/* One column on phones; two from tablet width up. */}
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Account holder" error={errors.holder}>
            <input
              value={holder}
              onChange={(e) => edit(setHolder, 'holder')(e.target.value)}
              autoComplete="name"
              placeholder="Full name"
              className={inputClass}
            />
          </Field>
          <Field label="Routing number" error={errors.routing} hint="The 9-digit number on your checks.">
            <input
              value={routing}
              onChange={(e) => edit(setRouting, 'routing')(digitsOnly(e.target.value, 9))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="000000000"
              className={cx(inputClass, 'font-mono tracking-widest')}
            />
          </Field>
          <Field label="Account number" error={errors.number}>
            <input
              value={number}
              onChange={(e) => edit(setNumber, 'number', 'confirm')(digitsOnly(e.target.value, 17))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="Account number"
              className={cx(inputClass, 'font-mono tracking-widest')}
            />
          </Field>
          <Field label="Confirm account number" error={errors.confirm}>
            <input
              value={confirm}
              onChange={(e) => edit(setConfirm, 'confirm')(digitsOnly(e.target.value, 17))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="Re-enter account number"
              className={cx(inputClass, 'font-mono tracking-widest')}
            />
          </Field>
        </div>

        <p className="flex items-start gap-2 text-xs text-ink-2">
          <ShieldCheck className="mt-px size-4 shrink-0 text-success" />
          Only the last 4 digits are shown in the app. The rest stays masked.
        </p>

        <Button type="submit" className="md:w-64">
          Add account
        </Button>
      </form>
    </div>
  )
}
