import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { MessageSquareText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, PageHeader } from '../components/ui'
import { cx, digitsOnly } from '../utils/format'

const OTP_LENGTH = 6

export default function LoginOtp() {
  const { login } = useApp()
  const navigate = useNavigate()
  const phone = useLocation().state?.phone
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  // Reached without a phone number (reload, typed URL): start over.
  if (!phone) return <Navigate to="/login" replace />

  const submit = (e) => {
    e.preventDefault()
    if (otp.length < OTP_LENGTH) return setError(`Enter the ${OTP_LENGTH}-digit code.`)
    login({ phone })
  }

  // The box the next digit lands in; once the code is full the last box stays highlighted.
  const cursor = Math.min(otp.length, OTP_LENGTH - 1)

  return (
    <div className="flex min-h-0 flex-1 animate-page-in flex-col">
      <PageHeader title="Enter OTP" onBack={() => navigate(-1)} />

      <form
        onSubmit={submit}
        noValidate
        className="no-scrollbar gutter min-h-0 flex-1 overflow-y-auto pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-8 [--page:24rem] md:pt-14"
      >
        <div className="flex flex-col items-center text-center">
          <span className="grid size-[4.5rem] animate-pop place-items-center rounded-[1.625rem] bg-accent-soft text-accent-soft-ink">
            <MessageSquareText className="size-8" />
          </span>
          <h2 className="mt-5 text-[1.375rem] font-extrabold tracking-tight">Verify your number</h2>
          <p className="mt-1.5 max-w-[30ch] text-sm text-ink-2">
            Enter the {OTP_LENGTH}-digit code sent to{' '}
            <b className="font-bold tabular-nums text-ink">{phone}</b>.
          </p>
        </div>

        {/* One real input sits invisibly over the boxes, so paste and SMS autofill work as usual. */}
        <label className="relative mt-7 block">
          <span className="sr-only">OTP</span>
          <span aria-hidden="true" className="grid grid-cols-6 gap-2">
            {Array.from({ length: OTP_LENGTH }, (_, index) => {
              const digit = otp[index]
              const active = focused && index === cursor
              return (
                <span
                  key={index}
                  className={cx(
                    'grid h-[3.75rem] place-items-center rounded-2xl border-2 bg-surface text-2xl font-extrabold tabular-nums shadow-soft transition',
                    error
                      ? 'border-danger'
                      : active
                        ? 'border-link ring-4 ring-link/15'
                        : digit
                          ? 'border-ink/15'
                          : 'border-transparent',
                  )}
                >
                  {digit ?? (active && <span className="h-6 w-0.5 animate-pulse rounded bg-link" />)}
                </span>
              )
            })}
          </span>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={otp}
            onChange={(e) => {
              setOtp(digitsOnly(e.target.value, OTP_LENGTH))
              setError('')
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="absolute inset-0 size-full cursor-text opacity-0"
          />
        </label>
        <p
          role={error ? 'alert' : undefined}
          className="mt-2.5 min-h-4 text-center text-xs font-semibold text-danger"
        >
          {error}
        </p>

        <Button type="submit" className="mt-4">
          Log in
        </Button>
      </form>
    </div>
  )
}
