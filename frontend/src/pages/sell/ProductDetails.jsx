import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, MapPin, CalendarDays, User, Sprout, PackageOpen, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import { remainingQty, newReservation } from '../../data/sellData.js'
import ProduceImage from '../../components/sell/ProduceImage.jsx'
import VerificationBadge from '../../components/sell/VerificationBadge.jsx'
import QuantityStepper from '../../components/sell/QuantityStepper.jsx'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { sell, user, reserveProduce, pushToast } = useApp()
  const t = useT()
  const listing = sell.listings.find((l) => l.id === id)
  const [qty, setQty] = useState(1)

  if (!listing) {
    return (
      <div className="page">
        <div className="card empty" style={{ minHeight: 260 }}>
          <span className="empty-ico">
            <PackageOpen size={26} />
          </span>
          <p className="muted">{t('sell.noResults')}</p>
          <Link className="btn btn-primary" to="/sell/marketplace">
            {t('sell.backToMarket')}
          </Link>
        </div>
      </div>
    )
  }

  const harvested = listing.status === 'harvested' && listing.harvest
  const price = harvested ? listing.harvest.finalPrice : listing.price
  const grade = harvested ? listing.harvest.grade : listing.grade
  const remaining = remainingQty(listing, sell.orders)
  const canHarvest = !harvested && listing.harvestDate <= todayISO()
  const incoming = sell.orders.filter((o) => o.listingId === listing.id && o.status === 'reservation_pending')

  const reserve = () => {
    if (qty > remaining) return pushToast(t('sell.qtyExceeds'), 'error')
    reserveProduce(newReservation({ listing, quantity: qty, buyer: user.name, at: todayISO() }))
    pushToast(t('sell.reservedPlaced'))
    navigate('/sell/reservations')
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link className="link-more" to="/sell/marketplace" style={{ marginBottom: 8 }}>
          <ArrowLeft size={15} /> {t('sell.backToMarket')}
        </Link>
        <div className="page-title" style={{ fontSize: 24 }}>
          {listing.crop}
        </div>
      </div>

      <div className="product-layout">
        {/* Left: imagery + description */}
        <div className="stack">
          <ProduceImage crop={listing.crop} images={harvested ? listing.harvest.images : listing.images} className="tall" iconSize={64} />
          <div className="card pad">
            <div className="section-title" style={{ fontSize: 15, marginBottom: 8 }}>
              {t('sell.f.description')}
            </div>
            <p className="muted" style={{ fontSize: 14 }}>
              {listing.description || '—'}
            </p>
          </div>
        </div>

        {/* Right: details + action */}
        <div className="stack">
          <div className="card pad-lg">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <span className="produce-price" style={{ fontSize: 24 }}>
                {inr(price)}
                <span className="muted" style={{ fontSize: 13, fontWeight: 500 }}>
                  {' '}
                  /{listing.unit}
                </span>
              </span>
              <span className="pill pill-gray">
                {t('sell.gradePrefix')} {grade}
              </span>
            </div>

            <div className="kv-grid" style={{ marginBottom: 14 }}>
              <div className="kv">
                <div className="k">
                  <User size={11} /> {t('sell.farmer')}
                </div>
                <div className="v">{listing.farmer.name}</div>
              </div>
              <div className="kv">
                <div className="k">
                  <MapPin size={11} /> {t('sell.f.location')}
                </div>
                <div className="v">{listing.location}</div>
              </div>
              <div className="kv">
                <div className="k">
                  <CalendarDays size={11} /> {t('sell.expectedHarvest')}
                </div>
                <div className="v">{formatDate(listing.harvestDate)}</div>
              </div>
              <div className="kv">
                <div className="k">{harvested ? t('sell.actualQuantity') : t('sell.expectedQuantity')}</div>
                <div className="v">
                  {(harvested ? listing.harvest.actualQuantity : listing.quantity)} {listing.unit}
                </div>
              </div>
            </div>

            <VerificationBadge />
          </div>

          {/* Action card */}
          {listing.mine ? (
            <div className="card pad-lg stack" style={{ gap: 12 }}>
              <div className="note">
                <Info size={14} /> {t('sell.ownListingNote')}
              </div>
              {incoming.length > 0 && (
                <div className="muted" style={{ fontSize: 13.5 }}>
                  {incoming.length} {t('sell.status.reservation_pending')}
                </div>
              )}
              <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                {canHarvest && (
                  <Link className="btn btn-primary" to={`/sell/harvest/${listing.id}`}>
                    <Sprout size={16} /> {t('sell.confirmHarvest')}
                  </Link>
                )}
                <Link className="btn btn-ghost" to="/sell/my-produce">
                  {t('sell.myProduce.title')}
                </Link>
                <Link className="btn btn-ghost" to="/sell/reservations">
                  {t('sell.reservations.title')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="card pad-lg stack" style={{ gap: 14 }}>
              <div className="disclaimer">
                <Info size={16} />
                <span>{t('sell.reserveNote')}</span>
              </div>
              {remaining > 0 ? (
                <>
                  <div>
                    <label className="label">{t('sell.f.quantity')}</label>
                    <QuantityStepper value={qty} onChange={setQty} min={1} max={remaining} unit={listing.unit} />
                    <div className="muted mt-8" style={{ fontSize: 12.5 }}>
                      {t('sell.remaining')}: {remaining} {listing.unit} · {t('sell.expected')}{' '}
                      {inr(price * qty)}
                    </div>
                  </div>
                  <button className="btn btn-primary btn-lg btn-block" onClick={reserve}>
                    {listing.availability?.startsWith('Pre-order') ? t('sell.preorder') : t('sell.reserve')}
                  </button>
                </>
              ) : (
                <div className="note" style={{ background: 'var(--surface-2)' }}>
                  <Info size={14} /> {t('sell.reserved')} 100%
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
