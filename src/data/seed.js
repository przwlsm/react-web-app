import { locationById } from './locations'
import { accountLabel, makeRef, CODE_TTL_MS, uid } from '../utils/format'

const HOUR = 3600000
const DAY = 24 * HOUR

export const DEMO_USER = { name: 'Alex Morgan', phone: '' }

export const seedAccounts = () => [
  {
    id: 'acc_chase',
    bankId: 'chase',
    bankName: 'Chase',
    type: 'Checking',
    last4: '4821',
    holder: DEMO_USER.name,
  },
  {
    id: 'acc_bofa',
    bankId: 'bofa',
    bankName: 'Bank of America',
    type: 'Savings',
    last4: '0937',
    holder: DEMO_USER.name,
  },
]

// Dates are relative to first launch so the demo history always looks recent.
export function seedDeposits() {
  const [chase, bofa] = seedAccounts()
  const now = Date.now()
  const make = (ago, locationId, amount, type, account, status = 'completed') => {
    const location = locationById(locationId)
    const createdAt = now - ago
    return {
      id: uid('dep'),
      ref: makeRef(),
      accountId: account.id,
      accountLabel: accountLabel(account),
      amount,
      type,
      locationId,
      locationName: location.name,
      terminal: location.terminal,
      createdAt,
      expiresAt: createdAt + CODE_TTL_MS,
      status,
    }
  }
  return [
    make(1 * DAY + 3 * HOUR, 'loc-711-42nd', 200, 'Cash', chase),
    make(3 * DAY + 6 * HOUR, 'loc-cvs-5th', 80, 'Cash', bofa),
    make(6 * DAY + 2 * HOUR, 'loc-kiosk-gct', 450, 'Check', chase),
    make(11 * DAY + 5 * HOUR, 'loc-711-34th', 1000, 'Cash', chase),
    make(19 * DAY + 1 * HOUR, 'loc-cvs-tsq', 60, 'Cash', bofa, 'pending'),
    make(27 * DAY + 4 * HOUR, 'loc-kiosk-herald', 320, 'Cash', chase),
    make(40 * DAY + 7 * HOUR, 'loc-711-3rd', 150, 'Cash', bofa),
  ]
}

export function seedNotifications() {
  const now = Date.now()
  return [
    {
      id: uid('ntf'),
      title: 'Deposit completed',
      body: '$200 was deposited to Chase •••• 4821 at 7-Eleven · W 42nd St.',
      at: now - (1 * DAY + 3 * HOUR),
      read: false,
    },
    {
      id: uid('ntf'),
      title: 'New location near you',
      body: 'Walgreens · Grand Central now accepts mobile deposits.',
      at: now - 4 * DAY,
      read: false,
    },
    {
      id: uid('ntf'),
      title: 'Welcome to QuickDeposit',
      body: 'Add a bank account, pick a location and scan your code at any kiosk.',
      at: now - 41 * DAY,
      read: true,
    },
  ]
}
