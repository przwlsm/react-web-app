import { NavLink } from 'react-router-dom'
import { Barcode, CirclePlus, History, Home, Settings } from 'lucide-react'
import { cx } from '../utils/format'

function Tab({ to, label, Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cx(
          'flex flex-col items-center gap-0.5 whitespace-nowrap text-[10px] font-bold tracking-tight transition',
          isActive ? 'text-link' : 'text-ink-3',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cx('rounded-full px-3.5 py-1 transition', isActive && 'bg-link/10')}>
            <Icon className="size-[22px]" strokeWidth={isActive ? 2.4 : 2} />
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="absolute inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-20 grid h-[68px] grid-cols-5 items-center rounded-[26px] border border-line bg-surface/90 px-1 shadow-float backdrop-blur-xl"
    >
      <Tab to="/" end label="Home" Icon={Home} />
      <Tab to="/accounts/new" label="Add Account" Icon={CirclePlus} />
      <NavLink
        to="/deposit/new"
        className="group flex flex-col items-center gap-0.5 whitespace-nowrap text-[10px] font-bold tracking-tight text-ink"
      >
        <span className="-mt-8 grid size-[58px] place-items-center rounded-full bg-linear-to-b from-[#3fd06f] to-accent text-accent-ink shadow-[0_12px_24px_-6px_rgba(30,169,76,0.8),inset_0_1px_0_rgba(255,255,255,0.35)] ring-[5px] ring-bg transition group-active:scale-95">
          <Barcode className="size-6" strokeWidth={2.3} />
        </span>
        New Deposit
      </NavLink>
      <Tab to="/history" label="History" Icon={History} />
      <Tab to="/settings" label="Settings" Icon={Settings} />
    </nav>
  )
}
