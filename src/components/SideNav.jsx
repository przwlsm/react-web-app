import { NavLink } from 'react-router-dom'
import { Barcode, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cx, initialsOf } from '../utils/format'
import { NAV_LINKS } from './SideMenu'
import { IconButton } from './ui'

// Permanent navigation for wide screens, where it replaces the bottom bar and the drawer.
export default function SideNav() {
  const { user, askLogout } = useApp()
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-line bg-surface px-4 pb-5 pt-6 lg:flex">
      <div className="flex items-center gap-2.5 px-2 text-lg font-extrabold tracking-tight">
        <span className="grid size-10 place-items-center rounded-xl bg-brand-gradient text-white">
          <Barcode className="size-5" />
        </span>
        QuickDeposit
      </div>

      <nav aria-label="Primary" className="mt-8 flex-1 space-y-1">
        {NAV_LINKS.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cx(
                'flex h-12 items-center gap-3 rounded-2xl px-3 text-[15px] font-bold transition',
                isActive ? 'bg-link/10 text-link' : 'text-ink-2 hover:bg-ink/5 hover:text-ink',
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 rounded-2xl bg-bg p-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-sm font-extrabold text-accent-soft-ink">
          {initialsOf(user.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold">{user.name}</p>
          {user.phone && <p className="truncate text-xs text-ink-2">{user.phone}</p>}
        </div>
        <IconButton small tone="plain" label="Log out" onClick={askLogout}>
          <LogOut />
        </IconButton>
      </div>
    </aside>
  )
}
