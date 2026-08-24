import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Check, ImageIcon, ShieldCheck, Loader2, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { uid } from '../../data/mockData.js'
import { UNITS, GRADES, AVAILABILITY, categoryOf } from '../../data/sellData.js'
import VerificationBadge from '../../components/sell/VerificationBadge.jsx'

const todayISO = () => new Date().toISOString().slice(0, 10)
const CHECK_KEYS = [
  'sell.verify.profile',
  'sell.verify.farm',
  'sell.verify.crop',
  'sell.verify.images',
  'sell.verify.location',
  'sell.verify.harvest',
]

export default function AddProduce() {
  const { user, addListing, verifyListing, pushToast } = useApp()
  const t = useT()
  const navigate = useNavigate()

  const EMPTY = {
    crop: '',
    quantity: '',
    unit: 'Quintal',
    price: '',
    harvestDate: '',
    location: `${user.district}, ${user.state}`,
    grade: 'A',
    availability: AVAILABILITY[0],
    description: '',
  }
  const [form, setForm] = useState(EMPTY)
  const [stage, setStage] = useState('form') // form | verifying | done
  const [checkStep, setCheckStep] = useState(0)
  const newIdRef = useRef(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.crop.trim()) return pushToast(t('sell.f.crop'), 'error')
    if (!(Number(form.quantity) > 0)) return pushToast(t('sell.f.expectedQty'), 'error')
    if (!(Number(form.price) > 0)) return pushToast(t('sell.f.expectedPrice'), 'error')
    if (!form.harvestDate) return pushToast(t('sell.f.harvestDate'), 'error')

    const id = uid()
    newIdRef.current = id
    addListing({
      id,
      mine: true,
      farmer: { name: user.name, village: '', district: user.district, state: user.state },
      crop: form.crop.trim(),
      category: categoryOf(form.crop.trim()),
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      harvestDate: form.harvestDate,
      location: form.location,
      images: [],
      description: form.description,
      grade: form.grade,
      availability: form.availability,
      verified: { info: false, quality: false },
      status: 'listed',
      harvest: null,
      createdAt: todayISO(),
    })
    setCheckStep(0)
    setStage('verifying')
  }

  // Animate the verification checklist, then flip verified.info = true.
  useEffect(() => {
    if (stage !== 'verifying') return
    const timers = []
    CHECK_KEYS.forEach((_, i) => timers.push(setTimeout(() => setCheckStep(i + 1), 480 * (i + 1))))
    timers.push(
      setTimeout(() => {
        verifyListing(newIdRef.current)
        setStage('done')
        pushToast(t('sell.verify.infoVerified'))
      }, 480 * (CHECK_KEYS.length + 1))
    )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])

  return (
    <div className="page">
      <div className="page-head">
        <div className="page-title">
          <span className="ico">
            <PlusCircle size={24} />
          </span>
          {t('sell.addProduce.title')}
        </div>
        <p className="page-sub">{t('sell.addProduce.sub')}</p>
      </div>

      {stage === 'form' && (
        <form className="card pad-lg" onSubmit={submit} style={{ maxWidth: 760 }}>
          <div className="field">
            <label className="label">{t('sell.f.crop')}</label>
            <input className="input" value={form.crop} onChange={set('crop')} placeholder="Wheat, Tomato, Onion…" />
          </div>
          <div className="form-grid">
            <div className="field">
              <label className="label">{t('sell.f.expectedQty')}</label>
              <input className="input" type="number" min="1" value={form.quantity} onChange={set('quantity')} placeholder="50" />
            </div>
            <div className="field">
              <label className="label">{t('sell.f.unit')}</label>
              <select className="select" value={form.unit} onChange={set('unit')}>
                {UNITS.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">{t('sell.f.expectedPrice')} (₹/{form.unit})</label>
              <input className="input" type="number" min="0" value={form.price} onChange={set('price')} placeholder="2300" />
            </div>
            <div className="field">
              <label className="label">{t('sell.f.harvestDate')}</label>
              <input className="input" type="date" value={form.harvestDate} onChange={set('harvestDate')} />
            </div>
            <div className="field">
              <label className="label">{t('sell.f.grade')}</label>
              <select className="select" value={form.grade} onChange={set('grade')}>
                {GRADES.map((g) => (
                  <option key={g}>
                    {t('sell.gradePrefix')} {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="label">{t('sell.f.availability')}</label>
              <select className="select" value={form.availability} onChange={set('availability')}>
                {AVAILABILITY.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="label">{t('sell.f.location')}</label>
            <input className="input" value={form.location} onChange={set('location')} />
          </div>
          <div className="field">
            <label className="label">{t('sell.f.images')}</label>
            <div className="dropzone" style={{ padding: '24px' }}>
              <span className="dz-ico">
                <ImageIcon size={26} />
              </span>
              <div className="muted" style={{ fontSize: 13 }}>
                {t('sell.uploadImages')} — a crop-themed tile is used in this demo.
              </div>
            </div>
          </div>
          <div className="field">
            <label className="label">{t('sell.f.description')}</label>
            <textarea className="textarea" value={form.description} onChange={set('description')} placeholder="Variety, irrigation, handling…" />
          </div>
          <button className="btn btn-primary btn-lg" type="submit">
            {t('sell.submitListing')}
          </button>
        </form>
      )}

      {(stage === 'verifying' || stage === 'done') && (
        <div className="card pad-lg" style={{ maxWidth: 620 }}>
          <div className="row" style={{ gap: 10, marginBottom: 14 }}>
            <span className="feature-ico ico-green" style={{ width: 46, height: 46 }}>
              {stage === 'done' ? <ShieldCheck size={22} /> : <Loader2 size={22} className="spin" />}
            </span>
            <div>
              <div className="feature-title">{t('sell.verify.title')}</div>
              <div className="muted" style={{ fontSize: 13 }}>
                {stage === 'done' ? t('sell.verify.infoNote') : t('sell.verify.checking')}
              </div>
            </div>
          </div>

          <div className="verify-list">
            {CHECK_KEYS.map((k, i) => {
              const state = stage === 'done' || i < checkStep ? 'done' : i === checkStep ? 'active' : 'pending'
              return (
                <div className={`verify-row ${state}`} key={k}>
                  <span className="vr-ic">
                    {state === 'done' ? (
                      <Check size={16} />
                    ) : state === 'active' ? (
                      <Loader2 size={14} className="spin" />
                    ) : (
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                    )}
                  </span>
                  <span>{t(k)}</span>
                </div>
              )
            })}
          </div>

          {stage === 'done' && (
            <div className="stack mt-16" style={{ gap: 14 }}>
              <VerificationBadge />
              <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => navigate('/sell/my-produce')}>
                  {t('sell.myProduce.title')} <ArrowRight size={16} />
                </button>
                <Link
                  className="btn btn-ghost"
                  to="/sell/add-produce"
                  onClick={() => {
                    setForm(EMPTY)
                    setStage('form')
                  }}
                >
                  {t('sell.addProduceCta')}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
