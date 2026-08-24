import { useMemo, useState } from 'react'
import { ShoppingCart, Search, X } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { CATEGORIES } from '../../data/sellData.js'
import ProduceCard from '../../components/sell/ProduceCard.jsx'

const priceOf = (l) => (l.status === 'harvested' && l.harvest ? l.harvest.finalPrice : l.price)

export default function Marketplace() {
  const { sell } = useApp()
  const t = useT()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [loc, setLoc] = useState('All')
  const [maxPrice, setMaxPrice] = useState('')

  // Marketplace = produce from other farmers (the user shops here as a consumer).
  const source = useMemo(() => sell.listings.filter((l) => !l.mine), [sell.listings])
  const locations = useMemo(() => ['All', ...new Set(source.map((l) => l.location))], [source])

  const results = source.filter((l) => {
    const text = `${l.crop} ${l.category} ${l.farmer.name} ${l.location}`.toLowerCase()
    if (q && !text.includes(q.toLowerCase())) return false
    if (cat !== 'All' && l.category !== cat) return false
    if (loc !== 'All' && l.location !== loc) return false
    if (maxPrice && priceOf(l) > Number(maxPrice)) return false
    return true
  })

  const clear = () => {
    setQ('')
    setCat('All')
    setLoc('All')
    setMaxPrice('')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico">
            <ShoppingCart size={24} />
          </span>
          {t('sell.marketplace.title')}
        </div>
        <p className="page-sub">{t('sell.marketplace.sub')}</p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="field" style={{ flex: 1, minWidth: 220 }}>
          <label className="label">{t('search.placeholder')}</label>
          <div className="search" style={{ width: '100%' }}>
            <Search className="search-ico" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('sell.filter.searchPh')} />
            {q && (
              <button className="search-clear" onClick={() => setQ('')} aria-label={t('common.clear')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="field" style={{ minWidth: 150 }}>
          <label className="label">{t('sell.filter.location')}</label>
          <select className="select" value={loc} onChange={(e) => setLoc(e.target.value)}>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l === 'All' ? t('sell.filter.all') : l}
              </option>
            ))}
          </select>
        </div>
        <div className="field" style={{ minWidth: 130 }}>
          <label className="label">{t('sell.filter.maxPrice')}</label>
          <input
            className="input"
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="₹"
          />
        </div>
        <button className="btn btn-ghost" onClick={clear}>
          {t('common.clear')}
        </button>
      </div>

      <div className="chips" style={{ marginBottom: 18 }}>
        {['All', ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'All' ? t('sell.filter.all') : c}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="card empty" style={{ minHeight: 220 }}>
          <span className="empty-ico">
            <Search size={24} />
          </span>
          <p className="muted">{t('sell.noResults')}</p>
        </div>
      ) : (
        <div className="produce-grid">
          {results.map((l) => (
            <ProduceCard key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  )
}
