import { useEffect, useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { LineChart as LineIcon, Search, RefreshCw, TrendingUp, TrendingDown, ArrowUpDown, Info } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useMarketPrices } from '../hooks/useMarketPrices.js'
import { buildTrendSeries } from '../api/market.js'
import { inr } from '../utils/format.js'

const chartColors = (dark) => ({
  grid: dark ? '#253128' : '#e6ebe6',
  axis: dark ? '#a2b3a8' : '#6b7c74',
  line: '#2f9e5b',
})

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: 'var(--shadow)' }}>
      <div className="soft" style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{inr(payload[0].value)}</div>
    </div>
  )
}

export default function MarketPrice() {
  const { location, user } = useApp()
  const stateName = location.admin1 || user.state
  const { rows, live, loading, refresh } = useMarketPrices(stateName)

  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('commodity')
  const [sortDir, setSortDir] = useState('asc')
  const [sel, setSel] = useState('')

  const commodities = useMemo(() => [...new Set(rows.map((r) => r.commodity))], [rows])

  useEffect(() => {
    if (rows.length && !rows.some((r) => r.commodity === sel)) setSel(rows[0].commodity)
  }, [rows, sel])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = rows.filter(
      (r) => !q || r.commodity?.toLowerCase().includes(q) || r.market?.toLowerCase().includes(q)
    )
    const dir = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'number' || typeof bv === 'number') return ((av || 0) - (bv || 0)) * dir
      return String(av || '').localeCompare(String(bv || '')) * dir
    })
  }, [rows, query, sortKey, sortDir])

  const sortBy = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const selRow = rows.find((r) => r.commodity === sel)
  const series = selRow ? buildTrendSeries(selRow.modal, selRow.trend || 0) : []
  const { grid, axis, line } = chartColors(document.documentElement.dataset.theme === 'dark')

  return (
    <div className="page">
      <div className="page-head">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">
              <span className="ico"><LineIcon size={24} /></span>
              Market Prices (Mandi)
            </div>
            <p className="page-sub">Daily modal prices in ₹/quintal for {stateName}.</p>
          </div>
          <button className="btn btn-ghost" onClick={refresh} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {!live && !loading && (
        <div className="note" style={{ marginBottom: 16 }}>
          <Info size={14} /> Showing bundled sample prices — the live data.gov.in feed was unavailable.
        </div>
      )}

      {/* Trend chart */}
      <div className="card pad-lg" style={{ marginBottom: 20 }}>
        <div className="row-between" style={{ marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span className="section-title">Price trend — {sel || '—'}</span>
            <div className="muted" style={{ fontSize: 13 }}>Illustrative 7-day movement</div>
          </div>
          <div className="row" style={{ gap: 10 }}>
            {selRow?.trend != null && (
              <span className={`trend ${selRow.trend >= 0 ? 'up' : 'down'}`}>
                {selRow.trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {Math.abs(selRow.trend).toFixed(2)}%
              </span>
            )}
            <select className="select" style={{ width: 'auto', height: 40 }} value={sel} onChange={(e) => setSel(e.target.value)}>
              {commodities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="mkt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={line} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={line} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={grid} vertical={false} />
              <XAxis dataKey="day" stroke={axis} tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke={axis} tickLine={false} axisLine={false} fontSize={12} width={64} tickFormatter={(v) => inr(v)} />
              <Tooltip content={<PriceTooltip />} />
              <Area type="monotone" dataKey="price" stroke={line} strokeWidth={2} fill="url(#mkt)" dot={false} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="card mkt-card">
        <div className="mkt-head">
          <span className="section-title">All markets ({filtered.length})</span>
          <div className="search" style={{ width: 260 }}>
            <Search className="search-ico" size={18} />
            <input placeholder="Search crop or market…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="wrap-scroll">
          <table className="table mkt-table">
            <thead>
              <tr>
                <th className="th-sortable" onClick={() => sortBy('commodity')}>Commodity <ArrowUpDown size={12} /></th>
                <th className="th-sortable" onClick={() => sortBy('market')}>Market</th>
                <th className="th-sortable" onClick={() => sortBy('min')}>Min</th>
                <th className="th-sortable" onClick={() => sortBy('max')}>Max</th>
                <th className="th-sortable" onClick={() => sortBy('modal')}>Modal (₹/qtl)</th>
                <th className="th-sortable" onClick={() => sortBy('trend')} style={{ textAlign: 'right' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="center muted" style={{ padding: 30 }}>Loading prices…</td></tr>
              )}
              {!loading && filtered.map((r, i) => (
                <tr key={`${r.commodity}-${r.market}-${i}`}>
                  <td style={{ fontWeight: 600 }}>{r.commodity}</td>
                  <td className="muted">{r.market}</td>
                  <td>{inr(r.min)}</td>
                  <td>{inr(r.max)}</td>
                  <td className="num">{inr(r.modal)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {r.trend == null ? (
                      <span className="soft">—</span>
                    ) : (
                      <span className={`trend ${r.trend >= 0 ? 'up' : 'down'}`}>
                        {r.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(r.trend).toFixed(2)}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && !filtered.length && (
                <tr><td colSpan={6} className="center muted" style={{ padding: 30 }}>No commodities match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
