import { Link } from 'react-router-dom'
import { ClipboardList, Check, X, Sprout, ArrowRight, Inbox } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import StatusPill from '../../components/sell/StatusPill.jsx'

export default function Reservations() {
  const { sell, acceptReservation, rejectReservation, pushToast } = useApp()
  const t = useT()

  const listingOf = (id) => sell.listings.find((l) => l.id === id)
  const incoming = sell.orders.filter((o) => listingOf(o.listingId)?.mine)
  const mineRes = sell.orders.filter((o) => o.buyerMine)

  const accept = (o) => {
    acceptReservation(o.id)
    pushToast(t('sell.status.reservation_confirmed'))
  }
  const reject = (o) => {
    rejectReservation(o.id)
    pushToast(t('sell.status.cancelled'), 'info')
  }

  const Empty = ({ label }) => (
    <div className="empty" style={{ padding: '28px 20px' }}>
      <span className="empty-ico">
        <Inbox size={22} />
      </span>
      <p className="muted">{label}</p>
    </div>
  )

  return (
    <div className="page stack" style={{ gap: 22 }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div className="page-title">
          <span className="ico">
            <ClipboardList size={24} />
          </span>
          {t('sell.reservations.title')}
        </div>
        <p className="page-sub">{t('sell.reservations.sub')}</p>
      </div>

      {/* Incoming — user is the farmer */}
      <div className="card">
        <div className="section-head" style={{ padding: '16px 18px 0' }}>
          <div>
            <div className="section-title">{t('sell.incoming')}</div>
            <div className="muted" style={{ fontSize: 13 }}>
              {t('sell.incomingSub')}
            </div>
          </div>
        </div>
        {incoming.length === 0 ? (
          <Empty label={t('sell.noReservations')} />
        ) : (
          <div style={{ padding: '6px 8px 10px' }}>
            {incoming.map((o) => (
              <div className="order-row" key={o.id}>
                <span className="or-ic" style={{ background: 'var(--teal)' }}>
                  <Sprout size={20} />
                </span>
                <div className="or-main">
                  <div className="or-title">
                    {o.crop} · {o.quantity} {o.unit}
                  </div>
                  <div className="or-sub">
                    {t('sell.buyer')}: {o.buyer} · {inr(o.expectedPrice)}/{o.unit} · {formatDate(o.createdAt)}
                  </div>
                </div>
                <div className="order-actions">
                  {o.status === 'reservation_pending' ? (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => accept(o)}>
                        <Check size={15} /> {t('sell.accept')}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => reject(o)}>
                        <X size={15} /> {t('sell.reject')}
                      </button>
                    </>
                  ) : (
                    <>
                      <StatusPill status={o.status} />
                      <Link className="btn btn-ghost btn-sm" to={`/sell/order/${o.id}`}>
                        {t('sell.viewDetails')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My reservations — user is the consumer */}
      <div className="card">
        <div className="section-head" style={{ padding: '16px 18px 0' }}>
          <div>
            <div className="section-title">{t('sell.myReservations')}</div>
            <div className="muted" style={{ fontSize: 13 }}>
              {t('sell.myReservationsSub')}
            </div>
          </div>
        </div>
        {mineRes.length === 0 ? (
          <Empty label={t('sell.noReservations')} />
        ) : (
          <div style={{ padding: '6px 8px 10px' }}>
            {mineRes.map((o) => {
              const listing = listingOf(o.listingId)
              const reconfirm = o.status === 'awaiting_consumer'
              return (
                <div className="order-row" key={o.id}>
                  <span className="or-ic" style={{ background: 'var(--primary)' }}>
                    <Sprout size={20} />
                  </span>
                  <div className="or-main">
                    <div className="or-title">
                      {o.crop} · {o.quantity} {o.unit}
                    </div>
                    <div className="or-sub">
                      {t('sell.farmer')}: {listing?.farmer?.name || '—'} · {formatDate(o.createdAt)}
                    </div>
                  </div>
                  <div className="order-actions">
                    <StatusPill status={o.status} />
                    <Link
                      className={`btn btn-sm ${reconfirm ? 'btn-primary' : 'btn-ghost'}`}
                      to={`/sell/order/${o.id}`}
                    >
                      {reconfirm ? t('sell.confirmPurchase') : t('sell.viewDetails')}
                      {reconfirm && <ArrowRight size={14} />}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
