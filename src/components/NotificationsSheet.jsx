import { Bell, BellOff } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cx, dayLabel, timeLabel } from '../utils/format'
import Sheet from './Sheet'
import { EmptyState } from './ui'

export default function NotificationsSheet() {
  const { notifications, notificationsOpen, closeNotifications, markAllRead } = useApp()
  const unread = notifications.filter((n) => !n.read).length

  return (
    <Sheet open={notificationsOpen} onClose={closeNotifications} title="Notifications">
      {notifications.length === 0 ? (
        <EmptyState Icon={BellOff} title="You're all caught up">
          Deposit updates will show up here.
        </EmptyState>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[0.8125rem] font-semibold text-ink-2">
              {unread > 0 ? `${unread} unread` : 'No unread notifications'}
            </p>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-[0.8125rem] font-bold text-link underline-offset-4 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <ul className="space-y-2">
            {notifications.map((n) => (
              <li key={n.id} className="flex gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <span
                  className={cx(
                    'grid size-10 shrink-0 place-items-center rounded-xl',
                    n.read ? 'bg-surface-2 text-ink-2' : 'bg-accent-soft text-accent-soft-ink',
                  )}
                >
                  <Bell className="size-[1.125rem]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold">
                    <span className="truncate">{n.title}</span>
                    {!n.read && <span className="size-2 shrink-0 rounded-full bg-danger" />}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-2">{n.body}</p>
                  <p className="mt-1.5 text-[0.6875rem] font-semibold text-ink-3">
                    {dayLabel(n.at)} · {timeLabel(n.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Sheet>
  )
}
