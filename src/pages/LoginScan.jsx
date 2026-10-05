import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BinaryBitmap,
  DecodeHintType,
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
  MultiFormatReader,
} from '@zxing/library'
import { CameraOff, ChevronLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, IconButton } from '../components/ui'

const SCAN_INTERVAL_MS = 150
// Frames are downscaled before decoding; codes held up to a camera stay readable at this size.
const MAX_FRAME_WIDTH = 800

const CAMERA_ERRORS = {
  unsupported: 'The camera is only available over HTTPS or on localhost.',
  NotAllowedError: 'Camera access is blocked. Allow it in your browser settings, then try again.',
  NotFoundError: 'No camera was found on this device.',
}

export default function LoginScan() {
  const { login } = useApp()
  const navigate = useNavigate()
  // Opened directly, there is no Login screen behind this one to go back to.
  const direct = useLocation().key === 'default'
  const videoRef = useRef(null)
  const [attempt, setAttempt] = useState(0)
  const [error, setError] = useState('')

  // The context hands out a new login function each render; the camera must not restart for that.
  const loginRef = useRef(login)
  useEffect(() => {
    loginRef.current = login
  })

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(CAMERA_ERRORS.unsupported)
      return
    }

    let stopped = false
    let stream = null
    let timer = null
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { willReadFrequently: true })
    // No format list, so every symbology the library knows (QR and 1D barcodes alike) is tried.
    const reader = new MultiFormatReader()
    reader.setHints(new Map([[DecodeHintType.TRY_HARDER, true]]))

    const scan = () => {
      if (stopped) return
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const scale = Math.min(1, MAX_FRAME_WIDTH / video.videoWidth)
        canvas.width = Math.round(video.videoWidth * scale)
        canvas.height = Math.round(video.videoHeight * scale)
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        try {
          reader.decodeWithState(
            new BinaryBitmap(new HybridBinarizer(new HTMLCanvasElementLuminanceSource(canvas))),
          )
          // Any code that decodes is accepted; what it says is not checked.
          loginRef.current()
          return
        } catch {
          // No code in this frame: keep looking.
        }
      }
      timer = setTimeout(scan, SCAN_INTERVAL_MS)
    }

    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' } } })
      .then((media) => {
        // Left the screen while the permission prompt was open.
        if (stopped) return media.getTracks().forEach((track) => track.stop())
        stream = media
        video.srcObject = media
        video.play().catch(() => {})
        scan()
      })
      .catch((err) => {
        if (!stopped) setError(CAMERA_ERRORS[err.name] ?? "Couldn't start the camera.")
      })

    return () => {
      stopped = true
      clearTimeout(timer)
      stream?.getTracks().forEach((track) => track.stop())
      video.srcObject = null
    }
  }, [attempt])

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black text-white">
      <video
        ref={videoRef}
        muted
        playsInline
        aria-label="Camera view"
        className="absolute inset-0 size-full object-cover"
      />

      <header className="relative z-10 flex shrink-0 items-center gap-3 px-4 pb-4 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        <IconButton tone="brand" label="Back" onClick={() => (direct ? navigate('/login', { replace: true }) : navigate(-1))}>
          <ChevronLeft />
        </IconButton>
        <h1 className="text-[22px] font-extrabold tracking-tight">Scan QR code</h1>
      </header>

      {error ? (
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="grid size-16 place-items-center rounded-3xl bg-white/10">
            <CameraOff className="size-7" />
          </span>
          <p role="alert" className="mt-4 max-w-[28ch] text-[15px] font-semibold">
            {error}
          </p>
          <Button
            variant="ghost"
            className="mt-6"
            onClick={() => {
              setError('')
              setAttempt((n) => n + 1)
            }}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="relative flex flex-1 flex-col items-center justify-center px-8 pb-16">
          {/* The oversized shadow dims everything outside the viewfinder. */}
          <span className="size-60 rounded-[32px] border-[3px] border-white shadow-[0_0_0_100vmax_rgb(0_0_0/0.5)]" />
          <p className="relative mt-6 text-center text-sm font-semibold">
            Point your camera at a QR code or barcode.
          </p>
        </div>
      )}
    </div>
  )
}
