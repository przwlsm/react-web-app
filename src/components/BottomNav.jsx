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
          'flex flex-col items-center gap-0.5 whitespace-nowrap text-[0.625rem] font-bold tracking-tight transition max-[359px]:text-[0.5625rem]',
          isActive ? 'text-link' : 'text-ink-3 hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <span className={cx('rounded-full px-3.5 py-1 transition', isActive && 'bg-link/10')}>
            <Icon className="size-[1.375rem]" strokeWidth={isActive ? 2.4 : 2} />
          </span>
          {label}
        </>
      )}
    </NavLink>
  )
}

export default function BottomNav() {
  return (
    <>
      {/* The page fades out before it reaches the bar, so list rows never show cut off behind or below it.
          Screens that show this bar leave matching space at the end of their scroll area. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[calc(9rem+env(safe-area-inset-bottom))] bg-linear-to-t from-bg from-60% to-transparent lg:hidden"
      />
      <nav
        aria-label="Primary"
        className="absolute inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] max-[359px]:inset-x-2 z-20 mx-auto grid h-[4.25rem] max-w-md grid-cols-5 items-center rounded-[1.625rem] border border-line bg-surface px-1 shadow-float lg:hidden"
      >
        <Tab to="/" end label="Home" Icon={Home} />
        <Tab to="/accounts/new" label="Add Account" Icon={CirclePlus} />
        <NavLink
          to="/deposit/new"
          className="group flex flex-col items-center gap-0.5 whitespace-nowrap text-[0.625rem] font-bold tracking-tight text-ink max-[359px]:text-[0.5625rem]"
        >
          <span className="-mt-8 grid size-[3.625rem] place-items-center rounded-full bg-linear-to-b from-[#3fd06f] to-accent text-accent-ink shadow-[0_12px_24px_-6px_rgba(30,169,76,0.8),inset_0_1px_0_rgba(255,255,255,0.35)] ring-[5px] ring-bg transition group-hover:brightness-110 group-active:scale-95">
            <Barcode className="size-6" strokeWidth={2.3} />
          </span>
          New Deposit
        </NavLink>
        <Tab to="/history" label="History" Icon={History} />
        <Tab to="/settings" label="Settings" Icon={Settings} />
      </nav>
    </>
  )
}
