import { MARKET_FALLBACK } from '../data/mockData.js'

/* Government of India open data — "Current Daily Price of Various Commodities".
   Needs a free api-key; ships with data.gov.in's public sample key.
   Any failure (CORS / rate-limit / offline) is caught by the caller which
   then uses the bundled sample rows. */
const RESOURCE = '9ef84268-d588-465a-a308-a864a43d0070'
const API_KEY =
  import.meta.env.VITE_DATA_GOV_API_KEY ||
  '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'

export async function fetchMarketPrices({ state } = {}) {
  const params = new URLSearchParams({
    'api-key': API_KEY,
    format: 'json',
    limit: '120',
  })
  if (state) params.set('filters[state]', state)

  const res = await fetch(`https://api.data.gov.in/resource/${RESOURCE}?${params.toString()}`)
  if (!res.ok) throw new Error('Market request failed')
  const data = await res.json()
  const records = data.records || []
  if (!records.length) throw new Error('No market records')

  const rows = records
    .map((r) => ({
      commodity: r.commodity,
      market: r.market,
      state: r.state,
      district: r.district,
      min: Number(r.min_price) || 0,
      max: Number(r.max_price) || 0,
      modal: Number(r.modal_price) || 0,
      date: r.arrival_date,
      trend: null,
    }))
    .filter((r) => r.modal > 0)

  if (!rows.length) throw new Error('No usable market records')
  return { live: true, rows }
}

export function fallbackMarket() {
  return { live: false, rows: MARKET_FALLBACK }
}

/** Build an illustrative 7-point price series for a commodity's trend chart. */
export function buildTrendSeries(modal, trendPct = 0) {
  const points = 7
  const start = modal / (1 + (trendPct || 0) / 100)
  const series = []
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1)
    const base = start + (modal - start) * t
    const wobble = base * 0.012 * Math.sin(i * 1.7)
    series.push({ day: `D${i + 1}`, price: Math.round(base + wobble) })
  }
  series[points - 1].price = Math.round(modal)
  return series
}
