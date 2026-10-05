import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext'
import BottomNav from './components/BottomNav'
import DepositDetailSheet from './components/DepositDetailSheet'
import LogoutSheet from './components/LogoutSheet'
import NotificationsSheet from './components/NotificationsSheet'
import SideMenu from './components/SideMenu'
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
      <Outlet />
      {TAB_ROUTES.includes(pathname) && <BottomNav />}
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
    <div className="grid min-h-dvh place-items-center min-[520px]:p-6">
      {/* Full-bleed on phones; a phone-sized frame on larger screens. */}
      <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-bg text-ink min-[520px]:h-[min(880px,calc(100dvh-48px))] min-[520px]:w-[410px] min-[520px]:rounded-[44px] min-[520px]:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.45)] min-[520px]:ring-[10px] min-[520px]:ring-[#06262c] dark:min-[520px]:ring-[#16343a]">
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
    </div>
  )
}
