import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import BottomNav from './components/BottomNav'
import DepositDetailSheet from './components/DepositDetailSheet'
import LogoutSheet from './components/LogoutSheet'
import NotificationsSheet from './components/NotificationsSheet'
import SideMenu from './components/SideMenu'
import SideNav from './components/SideNav'
import Toast from './components/Toast'
import AddAccount from './pages/AddAccount'
import History from './pages/History'
import Home from './pages/Home'
import Login from './pages/Login'
import LoginOtp from './pages/LoginOtp'
import NewDeposit from './pages/NewDeposit'
import Settings from './pages/Settings'

// The scanner pulls in a barcode-decoding library, so it only loads when the camera is opened.
const LoginScan = lazy(() => import('./pages/LoginScan'))

// Focused flows (add account, new deposit) hide the tab bar.
const TAB_ROUTES = ['/', '/history', '/settings']

function AppLayout() {
  const { authed } = useApp()
  const { pathname } = useLocation()
  if (!authed) return <Navigate to="/login" replace />
  return (
    <>
      <div className="flex min-h-0 flex-1">
        <SideNav />
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          <Outlet />
          {TAB_ROUTES.includes(pathname) && <BottomNav />}
        </div>
      </div>
      <SideMenu />
      <NotificationsSheet />
      <DepositDetailSheet />
      <LogoutSheet />
    </>
  )
}

export default function App() {
  const { authed } = useApp()
  return (
    // Fills the window at every size. Overlays (sheets, drawer, toast) position against this box.
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-bg text-ink">
      <Routes>
        <Route path="/login" element={authed ? <Navigate to="/" replace /> : <Outlet />}>
          <Route index element={<Login />} />
          <Route path="otp" element={<LoginOtp />} />
          <Route
            path="scan"
            element={
              <Suspense fallback={<div className="flex-1 bg-black" />}>
                <LoginScan />
              </Suspense>
            }
          />
        </Route>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="accounts/new" element={<AddAccount />} />
          <Route path="deposit/new" element={<NewDeposit />} />
          <Route path="history" element={<History />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </div>
  )
}
