import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { LocateFixed } from 'lucide-react'
import { KIND_META } from '../data/locations'

// Keyless OpenStreetMap tiles: fine for development, but production traffic needs a
// commercial tile provider (Mapbox, Google Maps, MapTiler…) per OSM's usage policy.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

// `route` is an optional list of [lat, lng] points; when given, the map draws it and frames it.
export default function LocationMap({ locations, selectedId, onSelect, user, route }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef(null)

  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: [user.lat, user.lng],
      zoom: 15,
      zoomControl: false,
    })
    map.attributionControl.setPrefix(false)
    L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map)
    L.marker([user.lat, user.lng], {
      icon: L.divIcon({ className: '', html: '<span class="me-dot"></span>', iconSize: [0, 0] }),
      interactive: false,
      keyboard: false,
    }).addTo(map)
    markersRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    // The map's box changes as the screen lays out; Leaflet needs to be told.
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(containerRef.current)
    return () => {
      observer.disconnect()
      map.remove()
      mapRef.current = null
    }
  }, [user.lat, user.lng])

  useEffect(() => {
    const group = markersRef.current
    group.clearLayers()
    locations.forEach((location) => {
      const selected = location.id === selectedId
      const { label, color } = KIND_META[location.kind]
      L.marker([location.lat, location.lng], {
        icon: L.divIcon({
          className: '',
          iconSize: [0, 0],
          html: `<span class="pin${selected ? ' is-selected' : ''}" style="--c:${color}"><i></i><b>${label}</b></span>`,
        }),
        title: location.name,
        zIndexOffset: selected ? 1000 : 0,
      })
        .on('click', () => onSelect?.(location.id))
        .addTo(group)
    })
  }, [locations, selectedId, onSelect])

  useEffect(() => {
    const target = locations.find((l) => l.id === selectedId)
    // With a route the map frames the whole trip instead of centring on the pin.
    if (!target || route) return
    mapRef.current.panTo([target.lat, target.lng], { animate: true, duration: 0.5 })
    // Deliberately keyed on the selection only: re-filtering the list must not move the map.
  }, [selectedId])

  useEffect(() => {
    if (!route) return
    const map = mapRef.current
    // A white casing under the blue line keeps the route readable over any tile colour.
    const casing = L.polyline(route, { color: '#ffffff', weight: 9, interactive: false })
    const line = L.polyline(route, {
      color: '#2f7bf6',
      weight: 5,
      interactive: false,
      className: 'route-line',
    })
    const layer = L.layerGroup([casing, line]).addTo(map)
    // Normalising the path length lets the CSS draw-in animation work at any zoom.
    line.getElement()?.setAttribute('pathLength', '1')
    // Extra room on top for the destination pin's label.
    map.fitBounds(L.latLngBounds(route), { paddingTopLeft: [32, 56], paddingBottomRight: [32, 28] })
    return () => layer.remove()
  }, [route])

  return (
    <div className="relative isolate h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {/* A route view already frames the user's position, so it needs no recentre button. */}
      {!route && (
        <button
          type="button"
          aria-label="Centre map on my location"
          onClick={() => mapRef.current?.flyTo([user.lat, user.lng], 15, { duration: 0.6 })}
          className="absolute bottom-6 right-3 z-[1000] grid size-11 place-items-center rounded-full bg-white text-[#0b2b31] shadow-float transition hover:bg-[#eef5f6] active:scale-95"
        >
          <LocateFixed className="size-5" />
        </button>
      )}
    </div>
  )
}
