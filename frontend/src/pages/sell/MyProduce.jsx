import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageOpen, Plus, Pencil, Trash2, MapPin, Sprout, ShoppingBasket } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import { UNITS, GRADES, AVAILABILITY, categoryOf, remainingQty } from '../../data/sellData.js'
import ProduceImage from '../../components/sell/ProduceImage.jsx'
import StatusPill from '../../components/sell/StatusPill.jsx'
import Modal from '../../components/common/Modal.jsx'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function MyProduce() {
  const { sell, updateListing, removeListing, pushToast } = useApp()
  const t = useT()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(null)

  const mine = sell.listings.filter((l) => l.mine)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const openEdit = (l) => {
    setForm({ ...l })
    setEditing(l)
  }
  const save = () => {
    if (!form.crop?.trim()) {
      pushToast(t('sell.f.crop'), 'error')
      return
    }
    updateListing({
      id: editing.id,
      crop: form.crop,
      category: categoryOf(form.crop),
      quantity: Number(form.quantity),
      unit: form.unit,
      price: Number(form.price),
      harvestDate: form.harvestDate,
      location: form.location,
      grade: form.grade,
      availability: form.availability,
      description: form.description,
    })
    pushToast(t('common.saved'))
    setEditing(null)
  }
  const del = (l) => {
    removeListing(l.id)
    pushToast(t('common.delete'), 'info')
  }

  return (
    <div className="page">
      <div className="page-head">
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">
              <span className="ico">
                <PackageOpen size={24} />
              </span>
              {t('sell.myProduce.title')}
            </div>
            <p className="page-sub">{t('sell.myProduce.sub')}</p>
          </div>
          <Link className="btn btn-primary" to="/sell/add-produce">
            <Plus size={18} /> {t('sell.addProduceCta')}
          </Link>
        </div>
      </div>

      {mine.length === 0 ? (
        <div className="card empty" style={{ minHeight: 240 }}>
          <span className="empty-ico">
            <PackageOpen size={26} />
          </span>
          <div style={{ fontWeight: 600 }}>{t('sell.noProduce')}</div>
          <p className="muted">{t('sell.noProduceSub')}</p>
          <Link className="btn btn-primary" to="/sell/add-produce">
            <Plus size={18} /> {t('sell.addProduceCta')}
          </Link>
        </div>
      ) : (
        <div className="produce-grid">
          {mine.map((l) => {
            const harvested = l.status === 'harvested' && l.harvest
            const canHarvest = !harvested && l.harvestDate <= todayISO()
            const incoming = sell.orders.filter(
              (o) => o.listingId === l.id && o.status === 'reservation_pending'
            ).length
            const remaining = remainingQty(l, sell.orders)
            return (
              <div className="card produce-card" key={l.id}>
                <ProduceImage crop={l.crop} images={l.images}>
                  <span className="pt-badge">
                    <StatusPill status={harvested ? 'harvest_confirmed' : 'reservation_confirmed'} />
                  </span>
                  <span className="pt-cat pill pill-gray">{l.category}</span>
                </ProduceImage>
                <div className="produce-body">
                  <div className="row-between">
                    <div className="produce-title">{l.crop}</div>
                    <span className="pill pill-gray">
                      {harvested ? t('sell.harvested') : t('sell.listed')}
                    </span>
                  </div>
                  <div className="produce-farmer">
                    <MapPin size={12} /> {l.location}
                  </div>
                  <div className="kv-grid">
                    <div className="kv">
                      <div className="k">{harvested ? t('sell.finalPriceLabel') : t('sell.expectedPrice')}</div>
                      <div className="v">
                        {inr(harvested ? l.harvest.finalPrice : l.price)}/{l.unit}
                      </div>
                    </div>
                    <div className="kv">
                      <div className="k">{harvested ? t('sell.actualQuantity') : t('sell.expectedQuantity')}</div>
                      <div className="v">
                        {harvested ? l.harvest.actualQuantity : l.quantity} {l.unit}
                      </div>
                    </div>
                    <div className="kv">
                      <div className="k">{t('sell.remaining')}</div>
                      <div className="v">
                        {remaining} {l.unit}
                      </div>
                    </div>
                    <div className="kv">
                      <div className="k">{t('sell.expectedHarvest')}</div>
                      <div className="v">{formatDate(l.harvestDate)}</div>
                    </div>
                  </div>
                  {incoming > 0 && (
                    <div className="note">
                      <ShoppingBasket size={14} /> {incoming} {t('sell.status.reservation_pending')}
                    </div>
                  )}
                  <div className="produce-foot" style={{ flexWrap: 'wrap' }}>
                    {canHarvest ? (
                      <Link className="btn btn-primary btn-sm" to={`/sell/harvest/${l.id}`}>
                        <Sprout size={15} /> {t('sell.confirmHarvest')}
                      </Link>
                    ) : (
                      <Link className="btn btn-soft btn-sm" to={`/sell/product/${l.id}`}>
                        {t('sell.viewDetails')}
                      </Link>
                    )}
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(l)} aria-label={t('common.edit')}>
                      <Pencil size={15} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(l)} aria-label={t('common.delete')}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && form && (
        <Modal
          title={t('sell.manageListing')}
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>
                {t('common.cancel')}
              </button>
              <button className="btn btn-primary" onClick={save}>
                {t('common.save')}
              </button>
            </>
          }
        >
          <div className="field">
            <label className="label">{t('sell.f.crop')}</label>
            <input className="input" value={form.crop} onChange={set('crop')} />
          </div>
          <div className="form-grid">
            <div className="field">
              <label className="label">{t('sell.f.expectedQty')}</label>
              <input className="input" type="number" min="1" value={form.quantity} onChange={set('quantity')} />
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
              <label className="label">{t('sell.f.expectedPrice')}</label>
              <input className="input" type="number" min="0" value={form.price} onChange={set('price')} />
            </div>
            <div className="field">
              <label className="label">{t('sell.f.harvestDate')}</label>
              <input className="input" type="date" value={form.harvestDate} onChange={set('harvestDate')} />
            </div>
            <div className="field">
              <label className="label">{t('sell.f.grade')}</label>
              <select className="select" value={form.grade} onChange={set('grade')}>
                {GRADES.map((g) => (
                  <option key={g}>{g}</option>
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
            <label className="label">{t('sell.f.description')}</label>
            <textarea className="textarea" value={form.description} onChange={set('description')} />
          </div>
        </Modal>
      )}
    </div>
  )
}
