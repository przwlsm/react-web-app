import { useMemo, useState } from 'react'
import { ArrowUp, Car, CornerUpLeft, CornerUpRight, Footprints, MapPin } from 'lucide-react'
import { USER_POSITION } from '../data/locations'
import { milesBetween, timeLabel } from '../utils/format'
import LocationMap from './LocationMap'
import Sheet from './Sheet'
import { Button, Segmented } from './ui'

const HEADINGS = ['north', 'east', 'south', 'west']
const MODES = [
  { value: 'walk', label: 'Walk', Icon: Footprints, minutesPerMile: 20 },
  { value: 'drive', label: 'Drive', Icon: Car, minutesPerMile: 4 },
]

const distanceLabel = (miles) =>
  miles < 0.1 ? `${Math.round((miles * 5280) / 10) * 10} ft` : `${miles.toFixed(1)} mi`

// Demo data: a made-up three-leg path along the street grid, not real turn-by-turn directions.
// Replace with a routing API (Mapbox, Google, OSRM…) when the backend exists.
function buildRoute(from, to) {
  const midLng = from.lng + (to.lng - from.lng) * 0.6
  const points = [from, { lat: from.lat, lng: midLng }, { lat: to.lat, lng: midLng }, to]

  const legs = []
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const miles = milesBetween(a, b)
    if (miles < 0.01) continue
    const heading = a.lat !== b.lat ? (b.lat > a.lat ? 0 : 2) : b.lng > a.lng ? 1 : 3
    legs.push({ miles, heading })
  }

  const steps = legs.map((leg, index) => {
    const direction = HEADINGS[leg.heading]
    if (index === 0) return { Icon: ArrowUp, text: `Head ${direction}`, miles: leg.miles }
    const turn = (leg.heading - legs[index - 1].heading + 4) % 4
    if (turn === 1)
      return { Icon: CornerUpRight, text: `Turn right, continue ${direction}`, miles: leg.miles }
    if (turn === 3)
      return { Icon: CornerUpLeft, text: `Turn left, continue ${direction}`, miles: leg.miles }
    return { Icon: ArrowUp, text: `Continue ${direction}`, miles: leg.miles }
  })

  return {
    path: points.map((p) => [p.lat, p.lng]),
    miles: legs.reduce((sum, leg) => sum + leg.miles, 0),
    steps,
  }
}

export default function DirectionsSheet({ open, onClose, location }) {
  const [mode, setMode] = useState('walk')
  const route = useMemo(() => buildRoute(USER_POSITION, location), [location])
  // LocationMap redraws its pins whenever this array changes identity, so keep it stable.
  const pins = useMemo(() => [location], [location])

  const { minutesPerMile } = MODES.find((m) => m.value === mode)
  const minutes = Math.max(1, Math.round(route.miles * minutesPerMile))

  return (
    <Sheet open={open} onClose={onClose} title="Directions">
      <div className="h-56 overflow-hidden rounded-3xl shadow-soft md:h-64">
        <LocationMap locations={pins} selectedId={location.id} user={USER_POSITION} route={route.path} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[1.75rem] font-extrabold leading-none tracking-tight tabular-nums">
            {minutes} min
          </p>
          <p className="mt-1.5 truncate text-[0.8125rem] font-semibold text-ink-2">
            {distanceLabel(route.miles)} · Arrive by {timeLabel(Date.now() + minutes * 60000)}
          </p>
        </div>
        <div className="w-44 shrink-0">
          <Segmented label="Travel mode" options={MODES} value={mode} onChange={setMode} />
        </div>
      </div>

      {/* A timeline: your position, each turn, then the store. The rail joins the markers. */}
      <ol className="relative mt-4 space-y-4 rounded-3xl bg-surface p-4 shadow-soft before:absolute before:bottom-9 before:left-[2.0625rem] before:top-9 before:w-0.5 before:rounded-full before:bg-line">
        <li className="relative flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface">
            <span className="size-3.5 rounded-full border-[3px] border-white bg-[#2f7bf6] shadow-[0_0_0_4px_rgb(47_123_246/0.2)]" />
          </span>
          <span className="text-sm font-bold">Your location</span>
        </li>
        {route.steps.map(({ Icon, text, miles }, index) => (
          <li key={index} className="relative flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-2 text-ink">
              <Icon className="size-[1.125rem]" />
            </span>
            <span className="min-w-0 flex-1 text-sm font-semibold">{text}</span>
            <span className="shrink-0 text-xs font-bold tabular-nums text-ink-2">
              {distanceLabel(miles)}
            </span>
          </li>
        ))}
        <li className="relative flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
            <MapPin className="size-[1.125rem]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold leading-snug">{location.name}</span>
            <span className="block truncate text-xs text-ink-2">
              {location.address} · Terminal {location.terminal}
            </span>
          </span>
        </li>
      </ol>

      <p className="mt-3 text-center text-xs text-ink-3">
        Sample route for this demo, not live directions.
      </p>

      <Button variant="ghost" className="mt-4" onClick={onClose}>
        Close
      </Button>
    </Sheet>
  )
}
