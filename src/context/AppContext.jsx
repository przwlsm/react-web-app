import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { DEMO_USER, seedAccounts, seedDeposits, seedNotifications } from '../data/seed'
import { accountLabel, makeRef, money, uid } from '../utils/format'

const STORAGE_KEY = 'quickdeposit:v1'
const DEMO_AMOUNTS = [50, 100, 150]

function freshState() {
  const prefersDark =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return {
    authed: false,
    user: DEMO_USER,
    accounts: seedAccounts(),
    deposits: seedDeposits(),
    notifications: seedNotifications(),
    settings: { theme: prefersDark ? 'dark' : 'light', depositAlerts: true },
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Storage unavailable or corrupt: fall through to a fresh demo state.
  }
  return freshState()
}

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      // A QR login carries no phone number.
      return { ...state, authed: true, user: { ...state.user, phone: action.phone ?? '' } }
    case 'logout':
      return { ...state, authed: false }
    case 'addAccount':
      return { ...state, accounts: [...state.accounts, action.account] }
    case 'removeAccount':
      return { ...state, accounts: state.accounts.filter((a) => a.id !== action.id) }
    case 'addDeposit':
      return { ...state, deposits: [action.deposit, ...state.deposits] }
    case 'updateDeposit':
      return {
        ...state,
        deposits: state.deposits.map((d) => (d.id === action.id ? { ...d, ...action.patch } : d)),
      }
    case 'notify':
      if (!state.settings.depositAlerts) return state
      return { ...state, notifications: [action.notification, ...state.notifications] }
    case 'readAll':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) }
    case 'setSetting':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } }
    case 'reset':
      return { ...freshState(), authed: state.authed, user: state.user, settings: state.settings }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [detailId, setDetailId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Private mode or full storage: the app still works for this session.
    }
  }, [state])

  useEffect(() => {
    const { theme } = state.settings
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0B4B57' : '#0F6676')
  }, [state.settings])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const showToast = useCallback((message) => setToast({ id: Date.now(), message }), [])

  const notify = (title, body) =>
    dispatch({
      type: 'notify',
      notification: { id: uid('ntf'), title, body, at: Date.now(), read: false },
    })

  const value = {
    ...state,

    login: ({ phone } = {}) => dispatch({ type: 'login', phone }),
    logout: () => {
      setMenuOpen(false)
      setNotificationsOpen(false)
      setLogoutOpen(false)
      setDetailId(null)
      dispatch({ type: 'logout' })
    },

    addAccount: (fields) => {
      const account = { id: uid('acc'), ...fields }
      dispatch({ type: 'addAccount', account })
      return account
    },
    removeAccount: (id) => dispatch({ type: 'removeAccount', id }),

    // No amount up front: it is whatever the customer feeds into the kiosk.
    createDeposit: ({ account, type, location }) => {
      const now = Date.now()
      const deposit = {
        id: uid('dep'),
        ref: makeRef(),
        accountId: account.id,
        accountLabel: accountLabel(account),
        type,
        locationId: location.id,
        locationName: location.name,
        terminal: location.terminal,
        createdAt: now,
        status: 'pending',
      }
      dispatch({ type: 'addDeposit', deposit })
      notify(
        'Barcode ready',
        `Scan it at ${location.name} to make your deposit.`,
      )
      return deposit
    },
    completeDeposit: (deposit) => {
      // Stand-in for the amount a real kiosk would report: each simulated scan takes the next
      // sample amount in turn. Deposits made back when the amount was entered up front keep theirs.
      const scanned = state.deposits.filter((d) => d.completedAt).length
      const amount = deposit.amount ?? DEMO_AMOUNTS[scanned % DEMO_AMOUNTS.length]
      dispatch({
        type: 'updateDeposit',
        id: deposit.id,
        patch: { status: 'completed', completedAt: Date.now(), amount },
      })
      notify(
        'Deposit completed',
        `${money(amount)} was deposited to ${deposit.accountLabel} at ${deposit.locationName}.`,
      )
    },
    cancelDeposit: (id) => dispatch({ type: 'updateDeposit', id, patch: { status: 'cancelled' } }),

    markAllRead: () => dispatch({ type: 'readAll' }),
    setSetting: (key, value) => dispatch({ type: 'setSetting', key, value }),
    resetDemoData: () => dispatch({ type: 'reset' }),

    menuOpen,
    openMenu: () => setMenuOpen(true),
    closeMenu: () => setMenuOpen(false),
    notificationsOpen,
    openNotifications: () => setNotificationsOpen(true),
    closeNotifications: () => setNotificationsOpen(false),
    logoutOpen,
    askLogout: () => {
      setMenuOpen(false)
      setLogoutOpen(true)
    },
    cancelLogout: () => setLogoutOpen(false),
    detailId,
    openDetail: setDetailId,
    closeDetail: () => setDetailId(null),
    toast,
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
