import { useState } from 'react'
import { FlaskConical, Save, CheckCircle2, RotateCcw, Beaker } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { CROP_KB } from '../data/mockData.js'
import { formatDate } from '../utils/format.js'

const LEVELS = ['Low', 'Medium', 'High']
const SOILS = ['Loam', 'Clay', 'Sandy', 'Silt', 'Black', 'Red', 'Alluvial']
const CROPS = Object.keys(CROP_KB)
const today = () => new Date().toISOString().slice(0, 10)

const NUTRIENT_ADVICE = {
  n: {
    Low: 'Nitrogen is low — top-dress ~45 kg Urea/acre in 2 splits.',
    Medium: 'Nitrogen is adequate — maintain with a light split top-dressing.',
    High: 'Nitrogen is high — skip extra urea to avoid lodging & disease.',
  },
  p: {
    Low: 'Phosphorus is low — apply DAP or SSP as a basal dose before sowing.',
    Medium: 'Phosphorus is sufficient for most crops.',
    High: 'Phosphorus is high — no phosphatic fertilizer needed this season.',
  },
  k: {
    Low: 'Potassium is low — add ~20 kg MOP/acre to improve grain filling.',
    Medium: 'Potassium is in a comfortable range.',
    High: 'Potassium is high — reduce potash application.',
  },
}

function analyzeSoil({ n, p, k, ph, moisture, crop }) {
  let score = 100
  const penalize = (lvl, low, med) => (lvl === 'Low' ? low : lvl === 'Medium' ? med : 0)
  score -= penalize(n, 24, 8)
  score -= penalize(p, 18, 6)
  score -= penalize(k, 16, 5)
  if (ph < 5.5 || ph > 8.5) score -= 20
  else if (ph < 6 || ph > 7.8) score -= 10
  if (moisture < 25) score -= 10
  else if (moisture > 90) score -= 5
  score = Math.max(5, Math.min(100, Math.round(score)))

  const recommendation = [NUTRIENT_ADVICE.n[n], NUTRIENT_ADVICE.p[p], NUTRIENT_ADVICE.k[k]]
  if (ph < 6) recommendation.push('Soil is acidic — apply agricultural lime (~200 kg/acre) before sowing.')
  else if (ph > 7.8) recommendation.push('Soil is alkaline — add gypsum and organic matter to improve it.')
  else recommendation.push('pH is in the ideal 6.0–7.5 range — no correction needed.')
  if (moisture < 30) recommendation.push('Moisture is low — plan an irrigation before sowing/top-dressing.')
  recommendation.push('Add 4–5 t/acre well-rotted farmyard manure to build organic matter.')
  if (crop && CROP_KB[crop]) recommendation.push(`For ${crop}: target ${CROP_KB[crop].fertilizer}`)

  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
  const tone = score >= 60 ? 'pill-green' : score >= 40 ? 'pill-amber' : 'pill-amber'
  return { score, label, tone, recommendation }
}

export default function SoilNutrition() {
  const { addReport, addHistory, pushToast } = useApp()
  const [form, setForm] = useState({ n: 'Medium', p: 'Medium', k: 'Medium', ph: 6.5, moisture: 45, soil: 'Loam', crop: 'Wheat' })
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  const set = (key) => (e) => {
    const v = e.target.type === 'range' ? Number(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [key]: v }))
  }

  const submit = (e) => {
    e.preventDefault()
    setResult(analyzeSoil(form))
    setSaved(false)
  }

  const save = () => {
    if (!result) return
    addReport({
      type: 'soil',
      title: 'Soil Health Report',
      crop: form.crop,
      date: today(),
      summary: `NPK: ${form.n[0]}${form.p[0]}${form.k[0]} | pH: ${form.ph} | ${result.label}`,
      detail: { n: form.n, p: form.p, k: form.k, ph: form.ph, recommendation: result.recommendation },
    })
    addHistory({ type: 'soil', text: `Soil health checked — ${result.label} (pH ${form.ph})`, date: today() })
    setSaved(true)
    pushToast('Soil report saved.')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico"><FlaskConical size={24} /></span>
          Soil Nutrition
        </div>
        <p className="page-sub">Enter your soil test values to get a health score and tailored fertilizer advice.</p>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <form className="card pad-lg" onSubmit={submit}>
          <div className="form-grid-3">
            {['n', 'p', 'k'].map((key) => (
              <div className="field" key={key}>
                <label className="label">{{ n: 'Nitrogen (N)', p: 'Phosphorus (P)', k: 'Potassium (K)' }[key]}</label>
                <select className="select" value={form[key]} onChange={set(key)}>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="field">
            <label className="label">Soil pH — {form.ph}</label>
            <div className="range-row">
              <input type="range" min="3.5" max="9.5" step="0.1" value={form.ph} onChange={set('ph')} />
              <span className="range-val">{form.ph}</span>
            </div>
          </div>

          <div className="field">
            <label className="label">Moisture — {form.moisture}%</label>
            <div className="range-row">
              <input type="range" min="0" max="100" step="1" value={form.moisture} onChange={set('moisture')} />
              <span className="range-val">{form.moisture}%</span>
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label className="label">Soil type</label>
              <select className="select" value={form.soil} onChange={set('soil')}>
                {SOILS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Target crop</label>
              <select className="select" value={form.crop} onChange={set('crop')}>
                {CROPS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button className="btn btn-primary btn-block" type="submit">
            <Beaker size={18} /> Analyze Soil
          </button>
        </form>

        <div className="card pad-lg">
          {!result ? (
            <div className="empty" style={{ padding: '40px 20px' }}>
              <span className="empty-ico"><FlaskConical size={26} /></span>
              <div style={{ fontWeight: 600 }}>Awaiting soil values</div>
              <p className="muted" style={{ fontSize: 14 }}>Fill the form and press Analyze to see recommendations.</p>
            </div>
          ) : (
            <div className="stack" style={{ gap: 16 }}>
              <div className="row-between">
                <div>
                  <div className="muted" style={{ fontSize: 13 }}>Soil health score</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 40, lineHeight: 1 }}>
                    {result.score}<span className="muted" style={{ fontSize: 18 }}>/100</span>
                  </div>
                </div>
                <span className={`pill ${result.tone}`} style={{ fontSize: 14, padding: '7px 16px' }}>{result.label}</span>
              </div>
              <div className="meter" style={{ height: 10 }}><span style={{ width: `${result.score}%` }} /></div>

              <div className="grid-4" style={{ gap: 10 }}>
                {[['N', form.n], ['P', form.p], ['K', form.k], ['pH', form.ph]].map(([k, v]) => (
                  <div className="stat-tile" key={k}>
                    <div className="soft" style={{ fontSize: 12 }}>{k}</div>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div>
                <div className="label">Recommendations</div>
                <ul className="bullet-list">{result.recommendation.map((r, i) => <li key={i}>{r}</li>)}</ul>
              </div>

              <div className="row" style={{ gap: 10 }}>
                <button className="btn btn-primary" onClick={save} disabled={saved}>
                  {saved ? <CheckCircle2 size={18} /> : <Save size={18} />} {saved ? 'Saved' : 'Save Report'}
                </button>
                <button className="btn btn-ghost" onClick={() => setResult(null)}>
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
