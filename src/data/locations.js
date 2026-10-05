// Demo data: a fixed "you are here" point and sample deposit locations around the Las Vegas Strip.
// Replace with the device's geolocation and a locations API when the backend exists.
export const USER_POSITION = { lat: 36.111, lng: -115.1728 }

export const KIND_META = {
  seven: { label: '7-Eleven', color: '#E8591A' },
  cvs: { label: 'CVS', color: '#CC2229' },
  walgreens: { label: 'Walgreens', color: '#0E8A9B' },
}

export const LOCATIONS = [
  {
    id: 'loc-711-flamingo',
    kind: 'seven',
    name: '7-Eleven · E Flamingo Rd',
    address: '265 E Flamingo Rd, Las Vegas, NV',
    hours: 'Open 24 hours',
    terminal: 'T-1042',
    lat: 36.1146,
    lng: -115.1652,
  },
  {
    id: 'loc-cvs-harmon',
    kind: 'cvs',
    name: 'CVS Pharmacy · E Harmon Ave',
    address: '80 E Harmon Ave, Las Vegas, NV',
    hours: '7 AM – 10 PM',
    terminal: 'T-2210',
    lat: 36.1077,
    lng: -115.17,
  },
  {
    id: 'loc-wag-strip',
    kind: 'walgreens',
    name: 'Walgreens · Las Vegas Blvd',
    address: '3765 S Las Vegas Blvd, Las Vegas, NV',
    hours: 'Open 24 hours',
    terminal: 'T-3031',
    lat: 36.1068,
    lng: -115.1722,
  },
  {
    id: 'loc-cvs-park',
    kind: 'cvs',
    name: 'CVS Pharmacy · Park Ave',
    address: '3758 S Las Vegas Blvd, Las Vegas, NV',
    hours: 'Open 24 hours',
    terminal: 'T-2264',
    lat: 36.1043,
    lng: -115.1737,
  },
  {
    id: 'loc-711-koval',
    kind: 'seven',
    name: '7-Eleven · Koval Ln',
    address: '3735 Koval Ln, Las Vegas, NV',
    hours: 'Open 24 hours',
    terminal: 'T-1088',
    lat: 36.1078,
    lng: -115.1641,
  },
  {
    id: 'loc-wag-sands',
    kind: 'walgreens',
    name: 'Walgreens · Sands Ave',
    address: '3339 S Las Vegas Blvd, Las Vegas, NV',
    hours: '6 AM – 12 AM',
    terminal: 'T-3047',
    lat: 36.1243,
    lng: -115.1693,
  },
  {
    id: 'loc-711-tropicana',
    kind: 'seven',
    name: '7-Eleven · E Tropicana Ave',
    address: '145 E Tropicana Ave, Las Vegas, NV',
    hours: 'Open 24 hours',
    terminal: 'T-1131',
    lat: 36.1006,
    lng: -115.1694,
  },
  {
    id: 'loc-cvs-audrie',
    kind: 'cvs',
    name: 'CVS Pharmacy · Audrie St',
    address: '3655 Audrie St, Las Vegas, NV',
    hours: '7 AM – 11 PM',
    terminal: 'T-2305',
    lat: 36.1128,
    lng: -115.1681,
  },
]

export const locationById = (id) => LOCATIONS.find((l) => l.id === id)
