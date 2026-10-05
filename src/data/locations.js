// Demo data: a fixed "you are here" point and sample deposit locations around Midtown Manhattan.
// Replace with the device's geolocation and a locations API when the backend exists.
export const USER_POSITION = { lat: 40.7536, lng: -73.9832 }

export const KIND_META = {
  seven: { label: '7-Eleven', color: '#E8591A' },
  cvs: { label: 'CVS', color: '#CC2229' },
  walgreens: { label: 'Walgreens', color: '#0E8A9B' },
}

// The two loc-kiosk-* ids predate these becoming Walgreens stores; saved deposits reference them.
export const LOCATIONS = [
  {
    id: 'loc-711-42nd',
    kind: 'seven',
    name: '7-Eleven · W 42nd St',
    address: '107 W 42nd St, New York, NY',
    hours: 'Open 24 hours',
    terminal: 'T-1042',
    lat: 40.7551,
    lng: -73.9853,
  },
  {
    id: 'loc-cvs-5th',
    kind: 'cvs',
    name: 'CVS Pharmacy · 5th Ave',
    address: '500 5th Ave, New York, NY',
    hours: '7 AM – 10 PM',
    terminal: 'T-2210',
    lat: 40.754,
    lng: -73.9812,
  },
  {
    id: 'loc-kiosk-gct',
    kind: 'walgreens',
    name: 'Walgreens · Grand Central',
    address: '89 E 42nd St, New York, NY',
    hours: '5:30 AM – 2 AM',
    terminal: 'T-3031',
    lat: 40.7527,
    lng: -73.9772,
  },
  {
    id: 'loc-cvs-tsq',
    kind: 'cvs',
    name: 'CVS Pharmacy · Times Square',
    address: '1500 Broadway, New York, NY',
    hours: 'Open 24 hours',
    terminal: 'T-2264',
    lat: 40.7571,
    lng: -73.9858,
  },
  {
    id: 'loc-711-34th',
    kind: 'seven',
    name: '7-Eleven · W 34th St',
    address: '224 W 34th St, New York, NY',
    hours: 'Open 24 hours',
    terminal: 'T-1088',
    lat: 40.7506,
    lng: -73.9903,
  },
  {
    id: 'loc-kiosk-herald',
    kind: 'walgreens',
    name: 'Walgreens · Herald Square',
    address: '1293 Broadway, New York, NY',
    hours: '6 AM – 11 PM',
    terminal: 'T-3047',
    lat: 40.7494,
    lng: -73.9879,
  },
  {
    id: 'loc-711-3rd',
    kind: 'seven',
    name: '7-Eleven · 3rd Ave',
    address: '745 3rd Ave, New York, NY',
    hours: 'Open 24 hours',
    terminal: 'T-1131',
    lat: 40.7537,
    lng: -73.9717,
  },
  {
    id: 'loc-cvs-lex',
    kind: 'cvs',
    name: 'CVS Pharmacy · Lexington Ave',
    address: '630 Lexington Ave, New York, NY',
    hours: '7 AM – 11 PM',
    terminal: 'T-2305',
    lat: 40.759,
    lng: -73.9706,
  },
]

export const locationById = (id) => LOCATIONS.find((l) => l.id === id)
