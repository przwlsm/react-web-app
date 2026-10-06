import { useEffect } from 'react'
import { X } from 'lucide-react'
import { IconButton } from './ui'

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="absolute inset-0 z-50 flex animate-fade-in items-end bg-black/45 md:items-center md:justify-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90%] w-full animate-sheet-up flex-col rounded-t-[32px] bg-bg pb-[env(safe-area-inset-bottom)] shadow-float md:max-h-full md:max-w-lg md:animate-rise md:rounded-[32px] md:pt-2"
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-ink/15 md:hidden" />
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-2 pt-3">
          <h2 className="truncate text-xl font-extrabold tracking-tight">{title}</h2>
          <IconButton label="Close" small tone="plain" onClick={onClose}>
            <X />
          </IconButton>
        </div>
        <div className="no-scrollbar min-h-0 overflow-y-auto px-5 pb-6 pt-1">{children}</div>
      </div>
    </div>
  )
}
