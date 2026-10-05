import { Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-0 top-[calc(1rem+env(safe-area-inset-top))] z-[60] flex justify-center px-5"
    >
      <div
        key={toast.id}
        className="flex animate-page-in items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-bg shadow-float"
      >
        <Check className="size-4" />
        {toast.message}
      </div>
    </div>
  )
}
