import { useApp } from '../context/AppContext'
import Sheet from './Sheet'
import { Button } from './ui'

export default function LogoutSheet() {
  const { logoutOpen, cancelLogout, logout } = useApp()
  return (
    <Sheet open={logoutOpen} onClose={cancelLogout} title="Log out?">
      <p className="text-sm text-ink-2">
        You'll need to log in again to make a deposit. Your accounts and history stay on this
        device.
      </p>
      <div className="mt-5 space-y-2">
        <Button variant="danger" onClick={logout}>
          Log out
        </Button>
        <Button variant="ghost" onClick={cancelLogout}>
          Stay logged in
        </Button>
      </div>
    </Sheet>
  )
}
