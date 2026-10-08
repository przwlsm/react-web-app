import { useApp } from '../context/AppContext'
import { locationById } from '../data/locations'
import { dateTimeLabel, money } from '../utils/format'
import DepositBarcode from './DepositBarcode'
import Sheet from './Sheet'
import { Button, StatusChip } from './ui'

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="shrink-0 text-[0.8125rem] font-semibold text-ink-2">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-bold">{children}</dd>
    </div>
  )
}

export default function DepositDetailSheet() {
  const { deposits, detailId, closeDetail, cancelDeposit, completeDeposit, showToast } = useApp()
  const deposit = deposits.find((d) => d.id === detailId)

  if (!deposit) return null

  const { status } = deposit
  const location = locationById(deposit.locationId)

  return (
    <Sheet open onClose={closeDetail} title="Deposit details">
      <div className="flex flex-col items-center pb-2 pt-1 text-center">
        {deposit.amount != null && (
          <p className="mb-3 text-[2.75rem] font-extrabold leading-none tracking-tight tabular-nums">
            {money(deposit.amount)}
          </p>
        )}
        <StatusChip status={status} />
      </div>

      {status === 'pending' && (
        <div className="mt-4">
          <DepositBarcode deposit={deposit} />
        </div>
      )}

      <dl className="mt-5 divide-y divide-line rounded-3xl bg-surface px-4 shadow-soft">
        <Row label="To account">{deposit.accountLabel}</Row>
        <Row label="Location">
          {deposit.locationName}
          {location && (
            <span className="block text-xs font-medium text-ink-2">{location.address}</span>
          )}
        </Row>
        <Row label="Terminal">{deposit.terminal}</Row>
        <Row label="Deposit type">{deposit.type}</Row>
        <Row label="Date">{dateTimeLabel(deposit.createdAt)}</Row>
        <Row label="Reference">
          <span className="font-mono tracking-wider">{deposit.ref}</span>
        </Row>
      </dl>

      {status === 'pending' && (
        <div className="mt-5 space-y-2">
          <Button variant="ghost" onClick={() => completeDeposit(deposit)}>
            Simulate kiosk scan (demo)
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              cancelDeposit(deposit.id)
              showToast('Deposit cancelled')
              closeDetail()
            }}
          >
            Cancel deposit
          </Button>
        </div>
      )}
    </Sheet>
  )
}
