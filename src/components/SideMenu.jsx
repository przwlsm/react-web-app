import { NavLink } from 'react-router-dom'
import { Barcode, ChevronRight, CirclePlus, History, Home, LogOut, Settings, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cx, initialsOf } from '../utils/format'

export const NAV_LINKS = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/accounts/new', label: 'Add New Account', Icon: CirclePlus },
  { to: '/deposit/new', label: 'New Deposit', Icon: Barcode },
  { to: '/history', label: 'Transaction History', Icon: History },
  { to: '/settings', label: 'Settings', Icon: Settings },
]

export default function SideMenu() {
  const { user, menuOpen, closeMenu, askLogout } = useApp()
  if (!menuOpen) return null

  return (
    <div className="absolute inset-0 z-40 animate-fade-in bg-black/45" onClick={closeMenu}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-[84%] max-w-[20.625rem] animate-drawer-in flex-col bg-bg px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] shadow-float"
      >
        <div className="flex items-center gap-3 rounded-3xl bg-brand-gradient p-4 text-white">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20 text-base font-extrabold">
            {initialsOf(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-extrabold">{user.name}</p>
            {user.phone && <p className="truncate text-xs text-white/85">{user.phone}</p>}
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-95"
          >
            <X className="size-[1.125rem]" />
          </button>
        </div>

        <nav aria-label="Menu" className="mt-4 flex-1 space-y-1">
          {NAV_LINKS.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) =>
                cx(
                  'flex h-14 items-center gap-3 rounded-2xl px-3 text-[0.9375rem] font-bold transition active:bg-surface-2',
                  isActive
                    ? 'bg-surface text-ink shadow-soft'
                    : 'text-ink-2 hover:bg-ink/5 hover:text-ink',
                )
              }
            >
              <span className="grid size-9 place-items-center rounded-xl bg-ink/5">
                <Icon className="size-[1.125rem]" />
              </span>
              <span className="flex-1">{label}</span>
              <ChevronRight className="size-4 text-ink-3" />
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={askLogout}
          className="flex h-14 items-center gap-3 rounded-2xl px-3 text-[0.9375rem] font-bold text-danger transition hover:bg-danger-bg active:bg-danger-bg"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-danger-bg">
            <LogOut className="size-[1.125rem]" />
          </span>
          Log out
        </button>
      </aside>
    </div>
  )
}
