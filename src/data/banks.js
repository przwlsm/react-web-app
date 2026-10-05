export const BANKS = [
  { id: 'chase', name: 'Chase', mark: 'CH', from: '#1668E3', to: '#0A3A8F' },
  { id: 'bofa', name: 'Bank of America', mark: 'BA', from: '#D2243B', to: '#7C0F22' },
  { id: 'wells', name: 'Wells Fargo', mark: 'WF', from: '#C98A12', to: '#8A4B08' },
  { id: 'citi', name: 'Citi', mark: 'CI', from: '#1E88C9', to: '#0B4A7A' },
  { id: 'capone', name: 'Capital One', mark: 'CO', from: '#2B4A6F', to: '#0E2238' },
  { id: 'usbank', name: 'U.S. Bank', mark: 'US', from: '#3D4FB8', to: '#1C2670' },
  { id: 'pnc', name: 'PNC', mark: 'PN', from: '#F07C1F', to: '#B04A05' },
  { id: 'td', name: 'TD Bank', mark: 'TD', from: '#24A657', to: '#0C6A32' },
  { id: 'other', name: 'Other', mark: '••', from: '#4A5A54', to: '#1E2925' },
]

export const bankById = (id) => BANKS.find((b) => b.id === id) ?? BANKS[BANKS.length - 1]

export const bankGradient = (bank) => ({
  backgroundImage: `linear-gradient(135deg, ${bank.from}, ${bank.to})`,
})
