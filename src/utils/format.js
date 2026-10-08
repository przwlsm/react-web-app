export const MIN_DEPOSIT = 5
export const MAX_DEPOSIT = 1000

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const money = (n) => usd.format(n)

export const cx = (...parts) => parts.filter(Boolean).join(' ')

export const digitsOnly = (value, max) => value.replace(/\D/g, '').slice(0, max)

// crypto.randomUUID needs a secure context, which a phone on the LAN dev URL is not.
export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`

// A 15-digit reference such as 262241000030637: a fixed 10-digit prefix, then 5 random digits.
const REF_PREFIX = '2622410000'

export function makeRef() {
  const tail = Math.floor(Math.random() * 100000)
  return REF_PREFIX + String(tail).padStart(5, '0')
}

export const initialsOf = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

export const accountLabel = (account) => `${account.bankName} •••• ${account.last4}`

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()

export function dayLabel(ts) {
  const date = new Date(ts)
  const today = new Date()
  const diff = Math.round((startOfDay(today) - startOfDay(date)) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== today.getFullYear() && { year: 'numeric' }),
  })
}

export const timeLabel = (ts) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export const dateTimeLabel = (ts) =>
  `${new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${timeLabel(ts)}`

export const monthLabel = (ts) =>
  new Date(ts).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

export function milesBetween(a, b) {
  const rad = (deg) => (deg * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 3958.8 * 2 * Math.asin(Math.sqrt(h))
}

export const STATUS_LABEL = {
  pending: 'Awaiting scan',
  completed: 'Completed',
  cancelled: 'Cancelled',
}
