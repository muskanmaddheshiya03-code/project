import { useMemo, useState } from 'react'
import {
  Sparkles,
  MapPin,
  CalendarDays,
  Thermometer,
  Droplets,
  FlaskConical,
  IndianRupee,
  Wand2,
  RotateCcw,
  Save,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useWeather } from '../hooks/useWeather.js'
import { useMarketPrices } from '../hooks/useMarketPrices.js'
import { CROP_KB } from '../data/mockData.js'
import { formatTemp, inr } from '../utils/format.js'

const today = () => new Date().toISOString().slice(0, 10)

/* Which agronomic season are we in right now? (Indian cropping calendar) */
function currentSeason() {
  const m = new Date().getMonth() + 1 // 1–12
  if (m >= 6 && m <= 9) return 'Kharif' // monsoon
  if (m >= 10 || m <= 2) return 'Rabi' // winter
  return 'Zaid' // summer
}

/* Water availability the farmer has on the plot → a 1–4 supply level. */
const WATER_OPTS = [
  { key: 'rainfed', label: 'Rain-fed only', supply: 1 },
  { key: 'limited', label: 'Limited (1 irrigation)', supply: 2 },
  { key: 'canal', label: 'Canal / assured', supply: 3 },
  { key: 'tubewell', label: 'Tubewell / abundant', supply: 4 },
]

/* Agronomic ranges to score against. Seasons come from CROP_KB;
   this table adds the temperature band, water need (1–4), ideal pH
   window and nitrogen demand that CROP_KB doesn't carry. */
const CROP_AGRO = {
  Wheat: { tMin: 10, tMax: 25, water: 2, ph: [6.0, 7.5], nNeed: 'High', ico: 'ico-green' },
  Paddy: { tMin: 22, tMax: 36, water: 4, ph: [5.5, 7.0], nNeed: 'High', ico: 'ico-teal' },
  Maize: { tMin: 18, tMax: 32, water: 2, ph: [5.5, 7.5], nNeed: 'High', ico: 'ico-orange' },
  Mustard: { tMin: 10, tMax: 25, water: 1, ph: [6.0, 7.5], nNeed: 'Medium', ico: 'ico-purple' },
  Chana: { tMin: 15, tMax: 29, water: 1, ph: [6.0, 8.0], nNeed: 'Low', ico: 'ico-green' },
  Sugarcane: { tMin: 20, tMax: 38, water: 4, ph: [6.0, 7.5], nNeed: 'High', ico: 'ico-teal' },
  Potato: { tMin: 12, tMax: 24, water: 2, ph: [5.5, 6.5], nNeed: 'High', ico: 'ico-orange' },
  Tomato: { tMin: 18, tMax: 30, water: 3, ph: [6.0, 7.0], nNeed: 'Medium', ico: 'ico-purple' },
  Cotton: { tMin: 21, tMax: 36, water: 2, ph: [6.0, 8.0], nNeed: 'Medium', ico: 'ico-green' },
}

const CROPS = Object.keys(CROP_AGRO)
const N_RANK = { Low: 1, Medium: 2, High: 3 }
const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, Math.round(v)))

/* Weighted contribution of each signal to the final match score. */
const WEIGHTS = { season: 0.3, temp: 0.18, water: 0.18, soil: 0.17, market: 0.17 }

function seasonScore(crop, season) {
  if (season === 'Any') return 85
  const seasons = CROP_KB[crop]?.seasons || []
  if (seasons.includes('Annual')) return 80
  return seasons.includes(season) ? 100 : 20
}

function tempScore(crop, temp) {
  if (temp == null) return 70 // neutral when live weather is unavailable
  const { tMin, tMax } = CROP_AGRO[crop]
  if (temp >= tMin && temp <= tMax) return 100
  const dist = temp < tMin ? tMin - temp : temp - tMax
  return clamp(100 - dist * 9)
}

function waterScore(crop, supply) {
  const need = CROP_AGRO[crop].water
  if (supply >= need) return 100
  return clamp(100 - (need - supply) * 28)
}

function soilScore(crop, soil) {
  const [lo, hi] = CROP_AGRO[crop].ph
  let s
  if (soil.ph >= lo && soil.ph <= hi) s = 100
  else {
    const dist = soil.ph < lo ? lo - soil.ph : soil.ph - hi
    s = clamp(100 - dist * 22)
  }
  const need = N_RANK[CROP_AGRO[crop].nNeed]
  const have = N_RANK[soil.n]
  if (have < need) s -= (need - have) * 12
  return clamp(s)
}

/* Mandi momentum for the crop, from the (live or bundled) price feed. */
function marketInfo(crop, rows) {
  const matches = rows.filter((r) => r.commodity === crop)
  if (!matches.length) return { modal: null, trend: null, score: 60 }
  const modal = Math.round(matches.reduce((a, r) => a + (r.modal || 0), 0) / matches.length)
  const trends = matches.map((r) => r.trend).filter((t) => t != null)
  const trend = trends.length ? trends.reduce((a, t) => a + t, 0) / trends.length : null
  const score = trend != null ? clamp(60 + trend * 8, 40, 100) : 60
  return { modal, trend, score }
}

function buildReasons(crop, parts, ctx, mkt) {
  const kb = CROP_KB[crop]
  const agro = CROP_AGRO[crop]
  const out = []
  out.push(
    parts.season >= 80
      ? `In season for ${ctx.season === 'Any' ? 'the year' : ctx.season}`
      : `Off-season for ${ctx.season} (best: ${kb.seasons.join('/')})`
  )
  if (ctx.temp != null) {
    out.push(
      parts.temp >= 85
        ? `Temperature suits it (likes ${agro.tMin}–${agro.tMax}°C)`
        : `Current ${ctx.temp}°C is outside its ${agro.tMin}–${agro.tMax}°C comfort band`
    )
  }
  out.push(
    parts.water >= 90
      ? 'Your water availability covers its needs'
      : 'Needs more water than currently available'
  )
  out.push(
    parts.soil >= 80
      ? 'Soil pH & nutrients are a good fit'
      : 'Soil pH / nitrogen not ideal — amend before sowing'
  )
  if (mkt.modal != null) {
    if (mkt.trend != null) {
      const dir = mkt.trend >= 0 ? 'rising' : 'easing'
      out.push(`Mandi ${inr(mkt.modal)}/qtl, ${dir} ${Math.abs(mkt.trend).toFixed(1)}%`)
    } else {
      out.push(`Mandi price ${inr(mkt.modal)}/qtl`)
    }
  }
  return out
}

function verdict(score) {
  if (score >= 80) return { label: 'Excellent match', tone: 'pill-green' }
  if (score >= 62) return { label: 'Good match', tone: 'pill-green' }
  if (score >= 45) return { label: 'Fair match', tone: 'pill-amber' }
  return { label: 'Weak match', tone: 'pill-amber' }
}

function FactorBar({ label, value }) {
  return (
    <div className="stack" style={{ gap: 4 }}>
      <div className="row-between" style={{ fontSize: 12 }}>
        <span className="soft">{label}</span>
        <span style={{ fontWeight: 600 }}>{value}</span>
      </div>
      <div className="meter" style={{ height: 6 }}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function CropRecommendation() {
  const { location, user, units, savedReports, addReport, addHistory, pushToast } = useApp()
  const { data: weather, loading: wxLoading } = useWeather(location)
  const stateName = location.admin1 || user.state
  const { rows: marketRows } = useMarketPrices(stateName)

  const temp = weather?.current?.temp ?? null

  // pre-fill soil from the most recent saved Soil Health Report, if any
  const lastSoil = savedReports.find((r) => r.type === 'soil' && r.detail && r.detail.n)

  const [season, setSeason] = useState(currentSeason)
  const [water, setWater] = useState('canal')
  const [soil, setSoil] = useState(() => ({
    n: lastSoil?.detail?.n || 'Medium',
    p: lastSoil?.detail?.p || 'Medium',
    k: lastSoil?.detail?.k || 'Medium',
    ph: lastSoil?.detail?.ph ?? 6.5,
  }))
  const [shown, setShown] = useState(false)
  const [saved, setSaved] = useState(false)

  const waterSupply = WATER_OPTS.find((w) => w.key === water)?.supply ?? 3
  const waterLabel = WATER_OPTS.find((w) => w.key === water)?.label ?? ''

  const ranked = useMemo(() => {
    const ctx = { season, temp, water: waterSupply, soil }
    return CROPS.map((crop) => {
      const mkt = marketInfo(crop, marketRows)
      const parts = {
        season: seasonScore(crop, season),
        temp: tempScore(crop, temp),
        water: waterScore(crop, waterSupply),
        soil: soilScore(crop, soil),
        market: mkt.score,
      }
      const total = clamp(
        parts.season * WEIGHTS.season +
          parts.temp * WEIGHTS.temp +
          parts.water * WEIGHTS.water +
          parts.soil * WEIGHTS.soil +
          parts.market * WEIGHTS.market
      )
      return { crop, total, parts, mkt, reasons: buildReasons(crop, parts, ctx, mkt) }
    }).sort((a, b) => b.total - a.total)
  }, [season, temp, waterSupply, soil, marketRows])

  const setSoilKey = (key) => (e) => {
    const v = e.target.type === 'range' ? Number(e.target.value) : e.target.value
    setSoil((s) => ({ ...s, [key]: v }))
    setSaved(false)
  }

  const recommend = () => {
    setShown(true)
    setSaved(false)
  }

  const save = () => {
    const top = ranked[0]
    if (!top) return
    addReport({
      type: 'advisory',
      title: 'Crop Recommendation',
      crop: top.crop,
      date: today(),
      summary: `Top pick: ${top.crop} · ${top.total}% match · ${season}`,
      detail: {
        season,
        temperature: temp,
        water: waterLabel,
        soil: { ...soil },
        ranked: ranked.slice(0, 5).map((r) => ({ crop: r.crop, score: r.total })),
      },
    })
    addHistory({
      type: 'advisory',
      text: `Crop recommendation — ${top.crop} best match (${top.total}%)`,
      date: today(),
    })
    setSaved(true)
    pushToast('Recommendation saved to reports.')
  }

  const top = ranked[0]
  const rest = ranked.slice(1)

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico">
            <Sparkles size={24} />
          </span>
          Crop Recommendation
        </div>
        <p className="page-sub">
          Combines your location, season, live weather &amp; temperature, water availability, soil
          nutrition and mandi prices to rank the crops that fit best right now.
        </p>
      </div>

      {/* Inputs */}
      <form
        className="card pad-lg"
        onSubmit={(e) => {
          e.preventDefault()
          recommend()
        }}
      >
        {/* live signals (read from location + weather) */}
        <div className="chips" style={{ marginBottom: 16 }}>
          <span className="chip">
            <MapPin size={13} /> {location.name}
            {stateName ? `, ${stateName}` : ''}
          </span>
          <span className="chip">
            <Thermometer size={13} />{' '}
            {temp != null ? formatTemp(temp, units.temp) : wxLoading ? 'Loading…' : 'N/A'}
          </span>
          {weather?.current?.label && (
            <span className="chip">
              <Droplets size={13} /> {weather.current.humidity}% RH
            </span>
          )}
        </div>

        <div className="form-grid-3">
          <div className="field">
            <label className="label">
              <CalendarDays size={14} /> Season
            </label>
            <select className="select" value={season} onChange={(e) => setSeason(e.target.value)}>
              {['Kharif', 'Rabi', 'Zaid', 'Any'].map((s) => (
                <option key={s} value={s}>
                  {s === currentSeason() ? `${s} (now)` : s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">
              <Droplets size={14} /> Water availability
            </label>
            <select className="select" value={water} onChange={(e) => setWater(e.target.value)}>
              {WATER_OPTS.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">
              <Thermometer size={14} /> Temperature (live)
            </label>
            <input
              className="input"
              value={temp != null ? formatTemp(temp, units.temp) : 'Unavailable'}
              readOnly
            />
          </div>
        </div>

        <div className="form-grid-3">
          {[
            ['n', 'Soil Nitrogen (N)'],
            ['p', 'Soil Phosphorus (P)'],
            ['k', 'Soil Potassium (K)'],
          ].map(([key, lbl]) => (
            <div className="field" key={key}>
              <label className="label">{lbl}</label>
              <select className="select" value={soil[key]} onChange={setSoilKey(key)}>
                {['Low', 'Medium', 'High'].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="field">
          <label className="label">Soil pH — {soil.ph}</label>
          <div className="range-row">
            <input type="range" min="3.5" max="9.5" step="0.1" value={soil.ph} onChange={setSoilKey('ph')} />
            <span className="range-val">{soil.ph}</span>
          </div>
        </div>

        {lastSoil && (
          <div className="note" style={{ marginBottom: 14 }}>
            <Info size={14} /> Soil values pre-filled from your saved report ({lastSoil.date}). Adjust
            if your field differs.
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit">
          <Wand2 size={18} /> Recommend Crops
        </button>
      </form>

      {/* Results */}
      {!shown ? (
        <div className="card empty" style={{ marginTop: 20, padding: '44px 20px' }}>
          <span className="empty-ico">
            <Sparkles size={26} />
          </span>
          <div style={{ fontWeight: 600 }}>No recommendation yet</div>
          <p className="muted" style={{ fontSize: 14 }}>
            Set your season, water and soil above, then press Recommend Crops.
          </p>
        </div>
      ) : (
        <div className="stack" style={{ gap: 18, marginTop: 20 }}>
          {/* what fed the engine */}
          <div className="card pad-lg">
            <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>
              Signals used
            </div>
            <div className="grid-4" style={{ gap: 10 }}>
              {[
                ['Location', `${location.name}`, <MapPin size={14} key="i" />],
                ['Season', season, <CalendarDays size={14} key="i" />],
                [
                  'Temperature',
                  temp != null ? formatTemp(temp, units.temp) : 'N/A',
                  <Thermometer size={14} key="i" />,
                ],
                ['Water', waterLabel, <Droplets size={14} key="i" />],
                ['Soil NPK', `${soil.n[0]}/${soil.p[0]}/${soil.k[0]}`, <FlaskConical size={14} key="i" />],
                ['Soil pH', soil.ph, <FlaskConical size={14} key="i" />],
              ].map(([k, v, icon]) => (
                <div className="stat-tile" key={k}>
                  <div className="soft" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                    {icon} {k}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* top pick */}
          {top && (
            <div className="card pad-lg" style={{ borderColor: 'var(--primary)' }}>
              <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
                <div className="row" style={{ gap: 14 }}>
                  <span className={`feature-ico ${CROP_AGRO[top.crop].ico}`}>
                    <Sparkles size={22} />
                  </span>
                  <div>
                    <div className="soft" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4 }}>
                      TOP RECOMMENDATION
                    </div>
                    <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 26, lineHeight: 1.1 }}>
                      {top.crop}
                    </div>
                    <div className="muted" style={{ fontSize: 13 }}>
                      {CROP_KB[top.crop].sowing} · Est. {CROP_KB[top.crop].yield}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 40, lineHeight: 1 }}>
                    {top.total}
                    <span className="muted" style={{ fontSize: 18 }}>%</span>
                  </div>
                  <span className={`pill ${verdict(top.total).tone}`}>{verdict(top.total).label}</span>
                </div>
              </div>

              <div className="grid-4" style={{ gap: 12, marginTop: 16 }}>
                <FactorBar label="Season" value={top.parts.season} />
                <FactorBar label="Temperature" value={top.parts.temp} />
                <FactorBar label="Water" value={top.parts.water} />
                <FactorBar label="Soil" value={top.parts.soil} />
              </div>

              <ul className="bullet-list" style={{ marginTop: 14 }}>
                {top.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>

              <div className="row" style={{ gap: 10, marginTop: 4 }}>
                <button className="btn btn-primary" onClick={save} disabled={saved} type="button">
                  {saved ? <CheckCircle2 size={18} /> : <Save size={18} />} {saved ? 'Saved' : 'Save Recommendation'}
                </button>
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={() => {
                    setShown(false)
                    setSaved(false)
                  }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          )}

          {/* ranked list */}
          <div className="card pad-lg">
            <div className="section-title" style={{ fontSize: 15, marginBottom: 4 }}>
              Full ranking
            </div>
            <div className="stack" style={{ gap: 12, marginTop: 8 }}>
              {rest.map((r, i) => {
                const v = verdict(r.total)
                return (
                  <div
                    key={r.crop}
                    className="row-between"
                    style={{
                      gap: 12,
                      flexWrap: 'wrap',
                      paddingBottom: 12,
                      borderBottom: i < rest.length - 1 ? '1px solid var(--border)' : 'none',
                    }}
                  >
                    <div className="row" style={{ gap: 12, minWidth: 200 }}>
                      <span className="soft" style={{ fontWeight: 700, width: 20 }}>
                        {i + 2}
                      </span>
                      <span className={`feature-ico ${CROP_AGRO[r.crop].ico}`} style={{ width: 36, height: 36 }}>
                        <Sparkles size={16} />
                      </span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.crop}</div>
                        <div className="soft" style={{ fontSize: 12 }}>
                          {r.mkt.modal == null ? (
                            'No mandi data'
                          ) : r.mkt.trend != null ? (
                            <span className={`trend ${r.mkt.trend >= 0 ? 'up' : 'down'}`}>
                              {r.mkt.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {inr(r.mkt.modal)}/qtl
                            </span>
                          ) : (
                            `${inr(r.mkt.modal)}/qtl`
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 120 }}>
                        <div className="meter" style={{ height: 8 }}>
                          <span style={{ width: `${r.total}%` }} />
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, width: 42, textAlign: 'right' }}>{r.total}%</span>
                      <span className={`pill ${v.tone}`}>{v.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="disclaimer">
            <Info size={16} />
            <span>
              Guidance only, based on current signals and typical agronomy. Confirm with your local
              KVK / agri-extension officer before sowing.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
