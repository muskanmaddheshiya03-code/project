import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sprout, ImageIcon, Users, PackageOpen } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import { GRADES } from '../../data/sellData.js'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function HarvestConfirm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sell, submitHarvest, pushToast } = useApp()
  const t = useT()

  const listing = sell.listings.find((l) => l.id === id)
  const alreadyHarvested = listing && listing.status === 'harvested'

  const [form, setForm] = useState(() => ({
    actualQuantity: listing ? String(listing.quantity) : '',
    finalPrice: listing ? String(listing.price) : '',
    grade: listing?.grade || 'A',
    harvestDate: todayISO(),
    notes: '',
  }))
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (!listing) {
    return (
      <div className="page">
        <div className="card empty" style={{ minHeight: 260 }}>
          <span className="empty-ico">
            <PackageOpen size={26} />
          </span>
          <p className="muted">{t('sell.noProduce')}</p>
          <Link className="btn btn-primary" to="/sell/my-produce">
            {t('sell.myProduce.title')}
          </Link>
        </div>
      </div>
    )
  }

  const willNotify = sell.orders.filter(
    (o) => o.listingId === listing.id && ['reservation_confirmed', 'awaiting_harvest'].includes(o.status)
  ).length

  const submit = (e) => {
    e.preventDefault()
    if (!(Number(form.actualQuantity) > 0)) return pushToast(t('sell.f.actualQty'), 'error')
    if (!(Number(form.finalPrice) > 0)) return pushToast(t('sell.f.finalPrice'), 'error')
    submitHarvest(listing.id, {
      actualQuantity: Number(form.actualQuantity),
      finalPrice: Number(form.finalPrice),
      grade: form.grade,
      images: [],
      harvestDate: form.harvestDate,
      notes: form.notes.trim(),
    })
    pushToast(t('sell.status.harvest_confirmed'))
    navigate('/sell/my-produce')
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link className="link-more" to="/sell/my-produce" style={{ marginBottom: 8 }}>
          <ArrowLeft size={15} /> {t('sell.myProduce.title')}
        </Link>
        <div className="page-title">
          <span className="ico">
            <Sprout size={24} />
          </span>
          {t('sell.harvest.title')}
        </div>
        <p className="page-sub">
          {listing.crop} · {t('sell.harvest.sub')}
        </p>
      </div>

      {alreadyHarvested ? (
        <div className="card empty" style={{ minHeight: 200 }}>
          <span className="empty-ico">
            <Sprout size={24} />
          </span>
          <p className="muted">{t('sell.harvested')}</p>
          <Link className="btn btn-primary" to={`/sell/product/${listing.id}`}>
            {t('sell.viewDetails')}
          </Link>
        </div>
      ) : (
        <div className="product-layout">
          {/* Expected reference */}
          <div className="stack">
            <div className="card pad-lg">
              <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>
                {t('sell.expected')}
              </div>
              <div className="kv-grid">
                <div className="kv">
                  <div className="k">{t('sell.expectedQuantity')}</div>
                  <div className="v">
                    {listing.quantity} {listing.unit}
                  </div>
                </div>
                <div className="kv">
                  <div className="k">{t('sell.expectedPrice')}</div>
                  <div className="v">
                    {inr(listing.price)}/{listing.unit}
                  </div>
                </div>
                <div className="kv">
                  <div className="k">{t('sell.grade')}</div>
                  <div className="v">{listing.grade}</div>
                </div>
                <div className="kv">
                  <div className="k">{t('sell.expectedHarvest')}</div>
                  <div className="v">{formatDate(listing.harvestDate)}</div>
                </div>
              </div>
            </div>
            {willNotify > 0 && (
              <div className="note">
                <Users size={14} /> {willNotify} · {t('sell.myReservationsSub')}
              </div>
            )}
          </div>

          {/* Actuals form */}
          <form className="card pad-lg" onSubmit={submit}>
            <div className="section-title" style={{ fontSize: 15, marginBottom: 14 }}>
              {t('sell.final')}
            </div>
            <div className="form-grid">
              <div className="field">
                <label className="label">{t('sell.f.actualQty')}</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.actualQuantity}
                  onChange={set('actualQuantity')}
                />
              </div>
              <div className="field">
                <label className="label">{t('sell.f.finalPrice')} (₹/{listing.unit})</label>
                <input className="input" type="number" min="0" value={form.finalPrice} onChange={set('finalPrice')} />
              </div>
              <div className="field">
                <label className="label">{t('sell.f.availableGrade')}</label>
                <select className="select" value={form.grade} onChange={set('grade')}>
                  {GRADES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label className="label">{t('sell.f.harvestDate')}</label>
                <input className="input" type="date" value={form.harvestDate} onChange={set('harvestDate')} />
              </div>
            </div>
            <div className="field">
              <label className="label">{t('sell.f.harvestImages')}</label>
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
              <label className="label">{t('sell.f.notes')}</label>
              <textarea className="textarea" value={form.notes} onChange={set('notes')} />
            </div>
            <button className="btn btn-primary btn-lg" type="submit">
              <Sprout size={16} /> {t('sell.submitFinal')}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
