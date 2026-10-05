import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'

export default function DepositBarcode({ deposit }) {
  const svgRef = useRef(null)

  // A 1D barcode only has room for the reference; the kiosk looks the deposit up by it.
  useEffect(() => {
    JsBarcode(svgRef.current, deposit.ref, {
      format: 'CODE128',
      displayValue: false,
      margin: 0,
      width: 2,
      height: 96,
      background: '#ffffff',
      lineColor: '#0b2b31',
    })
  }, [deposit.ref])

  return (
    <div className="flex flex-col items-center">
      {/* Always black on white, in both themes, so kiosk scanners can read it. */}
      <div
        role="img"
        aria-label={`Deposit barcode ${deposit.ref}`}
        className="max-w-full rounded-3xl bg-white p-4 shadow-soft"
      >
        <svg ref={svgRef} className="block h-auto max-w-full" />
      </div>
      <p className="mt-4 font-mono text-sm font-semibold tracking-[0.18em] text-ink-2">
        {deposit.ref}
      </p>
    </div>
  )
}
