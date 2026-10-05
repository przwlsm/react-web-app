import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Barcode, ScanLine, Smartphone } from 'lucide-react'
import { Button, buttonClass, Field, inputClass } from '../components/ui'
import { digitsOnly } from '../utils/format'

const COUNTRY_CODE = '+1'
const PHONE_LENGTH = 10

// The country code is fixed, so a pasted or autofilled "+1 555…" must not count it twice.
function nationalNumber(value) {
  const digits = digitsOnly(value, PHONE_LENGTH + 1)
  return digits.length > PHONE_LENGTH && digits[0] === '1'
    ? digits.slice(1)
    : digits.slice(0, PHONE_LENGTH)
}

export default function Login() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (phone.length < PHONE_LENGTH) return setError('Enter a 10-digit phone number.')
    navigate('/login/otp', { state: { phone: `${COUNTRY_CODE} ${phone}` } })
  }

  return (
    <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto bg-brand-gradient text-white">
      {/* min-h-fit: on short phones the hero keeps its full height and the screen scrolls, instead of the logo being clipped. */}
      <div className="relative flex min-h-fit flex-1 flex-col justify-end overflow-hidden px-6 pb-8 pt-[calc(2rem+env(safe-area-inset-top))]">
        <span className="pointer-events-none absolute -right-14 -top-14 size-52 rounded-full border-[14px] border-[#35d98a]/80" />
        <span className="pointer-events-none absolute -left-20 top-24 size-52 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
          <span className="grid size-10 place-items-center rounded-xl bg-white text-accent">
            <Barcode className="size-5" />
          </span>
          QuickDeposit
        </div>
        <h1 className="relative mt-6 text-[34px] font-extrabold leading-[1.1] tracking-tight">
          Deposit cash at a store{' '}
          <span className="rounded-lg bg-accent px-2 text-accent-ink">near you.</span>
        </h1>
        <p className="relative mt-3 max-w-[30ch] text-[15px] text-white/90">
          Pick an account, choose a location, and scan your code at the kiosk.
        </p>
      </div>

      <form
        onSubmit={submit}
        noValidate
        className="animate-sheet-up space-y-4 rounded-t-[32px] bg-bg px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-7 text-ink"
      >
        <h2 className="text-2xl font-extrabold tracking-tight">Log in</h2>
        <Field label="Phone number" error={error}>
          <span className="relative block">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center gap-2 pl-4 text-base font-bold">
              <Smartphone className="size-5 text-ink-3" />
              {COUNTRY_CODE}
              <span className="h-6 w-px bg-line" />
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Mobile number"
              value={phone}
              onChange={(e) => {
                setPhone(nationalNumber(e.target.value))
                setError('')
              }}
              className={`${inputClass} pl-[5.5rem] tabular-nums`}
            />
          </span>
        </Field>
        <Button type="submit">Send OTP</Button>

        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-ink-3">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>

        <Link to="/login/scan" className={buttonClass('ghost')}>
          <ScanLine />
          Scan QR code
        </Link>
      </form>
    </div>
  )
}
