import { useMemo, useState } from 'react'
import { Sprout, Save, CheckCircle2, Droplets, Bug, Wheat, CalendarDays, Beaker } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CROP_KB } from '../data/mockData.js'

const CROPS = Object.keys(CROP_KB)
const SOILS = ['Loam', 'Clay', 'Sandy', 'Silt', 'Black', 'Red', 'Alluvial']
const today = () => new Date().toISOString().slice(0, 10)

export default function CropAdvisory() {
  const { addReport, addHistory, pushToast } = useApp()
  const [crop, setCrop] = useState('Wheat')
  const [soil, setSoil] = useState('Loam')
  const [area, setArea] = useState('2.5')
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  const seasons = useMemo(() => CROP_KB[crop]?.seasons || [], [crop])
  const [season, setSeason] = useState(CROP_KB.Wheat.seasons[0])

  const onCrop = (e) => {
    const c = e.target.value
    setCrop(c)
    setSeason(CROP_KB[c].seasons[0])
    setResult(null)
  }

  const generate = (e) => {
    e.preventDefault()
    const kb = CROP_KB[crop]
    setResult({
      crop,
      season,
      soil,
      area,
      ...kb,
    })
    setSaved(false)
  }

  const save = () => {
    if (!result) return
    addReport({
      type: 'advisory',
      title: `${crop} Crop Advisory`,
      crop,
      date: today(),
      summary: `${season} · Sowing: ${result.sowing.split(';')[0]}`,
      detail: {
        stage: `${crop} — ${season} season`,
        nextIrrigation: result.irrigation,
        advice: [`Fertilizer: ${result.fertilizer}`, `Expected yield: ${result.yield}`, ...result.tips],
      },
    })
    addHistory({ type: 'advisory', text: `Generated ${crop.toLowerCase()} crop advisory`, date: today() })
    setSaved(true)
    pushToast('Advisory saved to Saved Reports.')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico"><Sprout size={24} /></span>
          Crop Advisory
        </div>
        <p className="page-sub">Pick your crop and field details to get a season plan: sowing, irrigation, fertilizer, pests and yield.</p>
      </div>

      <form className="card pad-lg" onSubmit={generate} style={{ marginBottom: 20 }}>
        <div className="form-grid-3">
          <div className="field">
            <label className="label">Crop</label>
            <select className="select" value={crop} onChange={onCrop}>
              {CROPS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Season</label>
            <select className="select" value={season} onChange={(e) => setSeason(e.target.value)}>
              {seasons.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Soil type</label>
            <select className="select" value={soil} onChange={(e) => setSoil(e.target.value)}>
              {SOILS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="form-grid">
          <div className="field">
            <label className="label">Area (acres)</label>
            <input className="input" type="number" min="0.1" step="0.1" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button className="btn btn-primary btn-block" type="submit">
              <Sprout size={18} /> Generate Advisory
            </button>
          </div>
        </div>
      </form>

      {result && (
        <div className="stack" style={{ gap: 16 }}>
          <div className="grid-2">
            <div className="card pad-lg">
              <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                <span className="feature-ico ico-green" style={{ width: 42, height: 42 }}><CalendarDays size={20} /></span>
                <span className="section-title">Sowing window</span>
              </div>
              <p>{result.sowing}</p>
            </div>
            <div className="card pad-lg">
              <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                <span className="feature-ico ico-teal" style={{ width: 42, height: 42 }}><Droplets size={20} /></span>
                <span className="section-title">Irrigation</span>
              </div>
              <p>{result.irrigation}</p>
            </div>
          </div>

          <div className="grid-2">
            <div className="card pad-lg">
              <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                <span className="feature-ico ico-purple" style={{ width: 42, height: 42 }}><Beaker size={20} /></span>
                <span className="section-title">Fertilizer plan</span>
              </div>
              <p>{result.fertilizer}</p>
              <div className="row-between mt-16">
                <span className="muted">Expected yield</span>
                <span className="pill pill-green"><Wheat size={13} /> {result.yield}</span>
              </div>
            </div>
            <div className="card pad-lg">
              <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                <span className="feature-ico ico-orange" style={{ width: 42, height: 42 }}><Bug size={20} /></span>
                <span className="section-title">Pest & disease watch</span>
              </div>
              <div className="chips">
                {result.pests.map((p) => <span className="chip" key={p}>{p}</span>)}
              </div>
              <div className="label mt-16">Key tips</div>
              <ul className="bullet-list">{result.tips.map((tp, i) => <li key={i}>{tp}</li>)}</ul>
            </div>
          </div>

          <div className="row" style={{ gap: 10 }}>
            <button className="btn btn-primary" onClick={save} disabled={saved}>
              {saved ? <CheckCircle2 size={18} /> : <Save size={18} />} {saved ? 'Saved' : 'Save Advisory'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
