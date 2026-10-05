import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Barcode,
  Check,
  ChevronLeft,
  Landmark,
  Plus,
  X,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import DepositBarcode from '../components/DepositBarcode'
import LocationMap from '../components/LocationMap'
import {
  Button,
  buttonClass,
  CtaBar,
  EmptyState,
  FilterChip,
  IconButton,
  KindTile,
  StatusChip,
} from '../components/ui'
import { bankById, bankGradient } from '../data/banks'
import { LOCATIONS, USER_POSITION } from '../data/locations'
import { cx, milesBetween, money } from '../utils/format'

const STEPS = ['Account', 'Location']
const KIND_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'seven', label: '7-Eleven' },
  { value: 'cvs', label: 'CVS' },
  { value: 'walgreens', label: 'Walgreens' },
]

const NEARBY = LOCATIONS.map((location) => ({
  ...location,
  miles: milesBetween(USER_POSITION, location),
})).sort((a, b) => a.miles - b.miles)

function StepTitle({ title, children }) {
  return (
    <div className="mb-5 mt-5">
      <h2 className="text-[26px] font-extrabold leading-tight tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-ink-2">{children}</p>
    </div>
  )
}

function StepAccount({ accounts, accountId, onSelect, onNext }) {
  if (accounts.length === 0) {
    return (
      <div className="min-h-0 flex-1 px-5 pt-4">
        <EmptyState
          Icon={Landmark}
          title="Add a bank account first"
          action={
            <Link to="/accounts/new" className={buttonClass()}>
              <Plus />
              Add New Account
            </Link>
          }
        >
          You need a linked account to deposit into.
        </EmptyState>
      </div>
    )
  }

  return (
    <>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-32">
        <StepTitle title="Where should it go?">Choose the bank account to deposit into.</StepTitle>
        <div role="radiogroup" aria-label="Bank account" className="space-y-3">
          {accounts.map((account) => {
            const selected = account.id === accountId
            const bank = bankById(account.bankId)
            return (
              <button
                key={account.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelect(account.id)}
                className={cx(
                  'flex w-full items-center gap-3 rounded-3xl border-2 bg-surface p-4 text-left transition active:scale-[0.99]',
                  selected ? 'border-accent' : 'border-transparent shadow-soft',
                )}
              >
                <span
                  style={bankGradient(bank)}
                  className="grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold text-white"
                >
                  {bank.mark}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-bold">{account.bankName}</span>
                  <span className="block text-[13px] text-ink-2">
                    {account.type} · •••• {account.last4}
                  </span>
                </span>
                <span
                  className={cx(
                    'grid size-6 shrink-0 place-items-center rounded-full border-2 transition',
                    selected ? 'border-accent bg-accent text-accent-ink' : 'border-ink/20',
                  )}
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
          <Link
            to="/accounts/new"
            className="flex h-14 items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-ink/15 text-sm font-bold text-ink-2"
          >
            <Plus className="size-4" />
            Add another account
          </Link>
        </div>
      </div>
      <CtaBar>
        <Button disabled={!accountId} onClick={onNext}>
          Continue
        </Button>
      </CtaBar>
    </>
  )
}

function StepLocation({ locationId, onSelect, onGenerate }) {
  const [kind, setKind] = useState('all')
  const visible = useMemo(() => NEARBY.filter((l) => kind === 'all' || l.kind === kind), [kind])
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-checked="true"]')
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [locationId])

  return (
    <>
      <div className="relative -mt-6 h-[45%] min-h-[240px] shrink-0">
        <LocationMap
          locations={visible}
          selectedId={locationId}
          onSelect={onSelect}
          user={USER_POSITION}
        />
        <div className="no-scrollbar absolute inset-x-0 top-9 z-10 flex gap-2 overflow-x-auto px-4">
          {KIND_FILTERS.map((f) => (
            <FilterChip key={f.value} active={kind === f.value} onClick={() => setKind(f.value)}>
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div
        ref={listRef}
        className="no-scrollbar relative z-10 -mt-5 min-h-0 flex-1 overflow-y-auto rounded-t-[28px] bg-bg px-5 pb-32 pt-5"
      >
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[19px] font-extrabold tracking-tight">Nearby deposit locations</h2>
          <p className="text-[13px] font-semibold text-ink-2">{visible.length} found</p>
        </div>
        <div role="radiogroup" aria-label="Deposit location" className="space-y-2.5">
          {visible.map((location) => {
            const selected = location.id === locationId
            return (
              <button
                key={location.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelect(location.id)}
                className={cx(
                  'flex w-full scroll-mt-2 items-center gap-3 rounded-3xl border-2 bg-surface p-3.5 text-left transition active:scale-[0.99]',
                  selected ? 'border-accent' : 'border-transparent shadow-soft',
                )}
              >
                <KindTile kind={location.kind} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold">{location.name}</span>
                  <span className="block truncate text-xs text-ink-2">{location.address}</span>
                  <span className="mt-1 block truncate text-[11px] font-semibold text-ink-3">
                    {location.hours} · Terminal {location.terminal}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-bold tabular-nums">
                  {location.miles.toFixed(1)} mi
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <CtaBar>
        <Button disabled={!locationId} onClick={onGenerate}>
          {locationId && <Barcode />}
          {locationId ? 'Generate barcode' : 'Select a location'}
        </Button>
      </CtaBar>
    </>
  )
}

function StepScan({ deposit, account, onDone, onSimulate }) {
  const bank = bankById(account.bankId)
  const steps = [
    `Go to ${deposit.locationName} (terminal ${deposit.terminal}).`,
    'Choose mobile deposit on the kiosk and hold this code up to the scanner.',
    `Insert your ${deposit.type.toLowerCase()} to finish the deposit.`,
  ]
  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
      {/* Laid out like a ticket: who and where on the stub, the code below the tear line. */}
      <div className="animate-rise rounded-[28px] bg-surface shadow-float">
        <div className="flex items-center gap-3 p-4">
          <span
            style={bankGradient(bank)}
            className="grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold text-white"
          >
            {bank.mark}
          </span>
          {/* The status sits beside the caption, not the account, so narrow phones keep the full account label. */}
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-2">
                Deposit to
              </span>
              <StatusChip status="pending" />
            </span>
            <span className="mt-0.5 block text-[17px] font-extrabold leading-snug tracking-tight">
              {deposit.accountLabel}
            </span>
          </span>
        </div>
        <div className="relative mx-5 border-t-2 border-dashed border-line">
          <span className="absolute -left-8 -top-3 size-6 rounded-full bg-bg" />
          <span className="absolute -right-8 -top-3 size-6 rounded-full bg-bg" />
        </div>
        <div className="px-2 pb-5 pt-4">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-ink-2">
            Scan at the kiosk
          </p>
          <DepositBarcode deposit={deposit} />
        </div>
      </div>

      <ol className="mt-4 space-y-3 rounded-3xl bg-surface p-4 shadow-soft">
        {steps.map((text, index) => (
          <li key={text} className="flex items-start gap-3 text-sm">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-extrabold text-accent-soft-ink">
              {index + 1}
            </span>
            <span className="pt-0.5 text-ink-2">{text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-5 space-y-2">
        <Button onClick={onDone}>Done</Button>
        <button
          type="button"
          onClick={onSimulate}
          className="h-11 w-full text-[13px] font-bold text-link underline-offset-4 active:underline"
        >
          Simulate kiosk scan (demo)
        </button>
      </div>
    </div>
  )
}

function StepSuccess({ deposit, onDone }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="relative grid place-items-center">
          <span className="absolute size-24 animate-halo rounded-full bg-accent motion-reduce:hidden" />
          <span className="absolute size-24 animate-halo rounded-full bg-accent [animation-delay:1s] motion-reduce:hidden" />
          <span className="relative grid size-24 animate-pop place-items-center rounded-full bg-accent text-accent-ink shadow-[0_18px_40px_-12px_rgba(30,169,76,0.7)]">
            <Check className="size-11" strokeWidth={3} />
          </span>
        </span>
        <h2 className="mt-7 text-[28px] font-extrabold tracking-tight">Deposit complete</h2>
        <p className="mt-1.5 text-[15px] text-ink-2">
          <b className="font-bold tabular-nums text-ink">{money(deposit.amount)}</b> was deposited.
        </p>

        <dl className="mt-6 w-full animate-rise divide-y divide-line rounded-3xl bg-surface px-4 text-left shadow-soft [animation-delay:0.15s]">
          {[
            ['Amount', money(deposit.amount)],
            ['To account', deposit.accountLabel],
            ['Location', deposit.locationName],
            ['Reference', deposit.ref],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3">
              <dt className="shrink-0 text-[13px] font-semibold text-ink-2">{label}</dt>
              <dd
                className={cx(
                  'min-w-0 truncate text-sm font-bold',
                  label === 'Reference' && 'font-mono tracking-wider',
                )}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <Button onClick={onDone}>Back to home</Button>
    </div>
  )
}

export default function NewDeposit() {
  const { accounts, deposits, createDeposit, completeDeposit } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  // Tapping an account card on Home arrives with ?account=…, which skips the picker.
  const preset = accounts.find((a) => a.id === params.get('account'))
  const [step, setStep] = useState(preset ? 1 : 0)
  const [accountId, setAccountId] = useState(
    preset?.id ?? (accounts.length === 1 ? accounts[0].id : null),
  )
  const [locationId, setLocationId] = useState(null)
  const [createdId, setCreatedId] = useState(null)

  const account = accounts.find((a) => a.id === accountId)
  const location = NEARBY.find((l) => l.id === locationId)
  const created = deposits.find((d) => d.id === createdId)
  const done = created?.status === 'completed'

  const generate = () => {
    const deposit = createDeposit({ account, type: 'Cash', location })
    setCreatedId(deposit.id)
  }

  return (
    <div className="relative flex min-h-0 flex-1 animate-page-in flex-col">
      <header className="relative z-20 shrink-0 rounded-b-[28px] bg-brand-gradient px-4 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))] text-white">
        <div className="flex items-center gap-3">
          {created ? (
            <span className="size-11" />
          ) : (
            <IconButton
              tone="brand"
              label="Back"
              onClick={() => (step === 0 ? navigate('/') : setStep(step - 1))}
            >
              <ChevronLeft />
            </IconButton>
          )}
          <div className="min-w-0 flex-1 text-center">
            <h1 className="text-[17px] font-extrabold tracking-tight">New Deposit</h1>
            <p className="text-xs font-medium text-white/85">
              {created
                ? done
                  ? 'Complete'
                  : 'Ready to scan'
                : `Step ${step + 1} of ${STEPS.length} · ${STEPS[step]}`}
            </p>
          </div>
          <IconButton tone="brand" label="Close" onClick={() => navigate('/')}>
            <X />
          </IconButton>
        </div>
        {!created && (
          <div className="mt-3 flex gap-1.5 px-1" aria-hidden="true">
            {STEPS.map((name, index) => (
              <span
                key={name}
                className={cx(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  index <= step ? 'bg-white' : 'bg-white/25',
                )}
              />
            ))}
          </div>
        )}
      </header>

      {created ? (
        done ? (
          <StepSuccess deposit={created} onDone={() => navigate('/')} />
        ) : (
          <StepScan
            deposit={created}
            account={account}
            onDone={() => navigate('/')}
            onSimulate={() => completeDeposit(created)}
          />
        )
      ) : (
        <>
          {step === 0 && (
            <StepAccount
              accounts={accounts}
              accountId={accountId}
              onSelect={setAccountId}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && account && (
            <StepLocation locationId={locationId} onSelect={setLocationId} onGenerate={generate} />
          )}
        </>
      )}
    </div>
  )
}
