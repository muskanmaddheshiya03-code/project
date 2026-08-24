import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Package,
  Check,
  X,
  Sprout,
  CreditCard,
  Ban,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useT } from '../../i18n/strings.js'
import { inr, formatDate } from '../../utils/format.js'
import { isTerminal } from '../../data/sellData.js'
import StatusPill from '../../components/sell/StatusPill.jsx'
import OrderTimeline from '../../components/sell/OrderTimeline.jsx'
import ExpectedVsFinal from '../../components/sell/ExpectedVsFinal.jsx'
import ProduceImage from '../../components/sell/ProduceImage.jsx'
import Modal from '../../components/common/Modal.jsx'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    sell,
    acceptReservation,
    rejectReservation,
    confirmPurchase,
    cancelOrder,
    markUnableToFulfill,
    advanceOrder,
    pushToast,
  } = useApp()
  const t = useT()
  const [showPay, setShowPay] = useState(false)

  const order = sell.orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="page">
        <div className="card empty" style={{ minHeight: 260 }}>
          <span className="empty-ico">
            <Package size={26} />
          </span>
          <p className="muted">{t('sell.noOrders')}</p>
          <Link className="btn btn-primary" to="/sell/orders">
            {t('sell.orders.title')}
          </Link>
        </div>
      </div>
    )
  }

  const listing = sell.listings.find((l) => l.id === order.listingId)
  const harvest = listing?.harvest || null
  const isFarmer = !!listing?.mine
  const isConsumer = !!order.buyerMine
  const canHarvest = listing && listing.status !== 'harvested' && listing.harvestDate <= todayISO()
  const terminal = isTerminal(order.status)

  const pay = () => {
    confirmPurchase(order.id)
    setShowPay(false)
    pushToast(t('sell.status.order_confirmed'))
  }

  return (
    <div className="page">
      <div className="page-head">
        <Link className="link-more" to="/sell/orders" style={{ marginBottom: 8 }}>
          <ArrowLeft size={15} /> {t('sell.orders.title')}
        </Link>
        <div className="row-between" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="page-title" style={{ fontSize: 23 }}>
            <span className="ico">
              <Package size={22} />
            </span>
            {order.crop}
          </div>
          <StatusPill status={order.status} />
        </div>
        <p className="page-sub">
          {t('sell.orderId')}: {order.id} · {t('sell.orderDetail.title')}
        </p>
      </div>

      <div className="product-layout">
        {/* Left: timeline + harvest evidence */}
        <div className="stack">
          <div className="card pad-lg">
            <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>
              {t('sell.timeline')}
            </div>
            <OrderTimeline order={order} />
          </div>

          {harvest && (
            <div className="card pad-lg">
              <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>
                {t('sell.harvestedOn')} {formatDate(harvest.harvestDate)}
              </div>
              <ProduceImage crop={order.crop} images={harvest.images} className="tall" iconSize={54} />
              {harvest.notes && (
                <p className="muted" style={{ fontSize: 14, marginTop: 12 }}>
                  {harvest.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right: expected vs final + counterparty + actions */}
        <div className="stack">
          <div className="card pad-lg">
            <div className="section-title" style={{ fontSize: 15, marginBottom: 12 }}>
              {t('sell.expected')} / {t('sell.final')}
            </div>
            <ExpectedVsFinal order={order} harvest={harvest} unit={order.unit} />
            <div className="kv-grid" style={{ marginTop: 14 }}>
              <div className="kv">
                <div className="k">{isConsumer ? t('sell.farmer') : t('sell.buyer')}</div>
                <div className="v">{isConsumer ? listing?.farmer?.name || '—' : order.buyer}</div>
              </div>
              <div className="kv">
                <div className="k">{t('sell.f.location')}</div>
                <div className="v">{listing?.location || '—'}</div>
              </div>
            </div>
          </div>

          {/* Contextual actions */}
          <div className="card pad-lg stack" style={{ gap: 12 }}>
            {/* Farmer — incoming reservation */}
            {isFarmer && order.status === 'reservation_pending' && (
              <>
                <div className="muted" style={{ fontSize: 13.5 }}>
                  {t('sell.consumerRequested')}
                </div>
                <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      acceptReservation(order.id)
                      pushToast(t('sell.status.reservation_confirmed'))
                    }}
                  >
                    <Check size={16} /> {t('sell.accept')}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      rejectReservation(order.id)
                      pushToast(t('sell.status.cancelled'), 'info')
                    }}
                  >
                    <X size={16} /> {t('sell.reject')}
                  </button>
                </div>
              </>
            )}

            {/* Farmer — confirmed, needs harvest */}
            {isFarmer && (order.status === 'reservation_confirmed' || order.status === 'awaiting_harvest') && (
              <>
                {canHarvest ? (
                  <>
                    <div className="disclaimer">
                      <Info size={16} />
                      <span>{t('sell.harvestReady')}</span>
                    </div>
                    <Link className="btn btn-primary" to={`/sell/harvest/${listing.id}`}>
                      <Sprout size={16} /> {t('sell.confirmHarvest')}
                    </Link>
                  </>
                ) : (
                  <div className="note">
                    <Info size={14} /> {t('sell.cannotHarvestYet')}
                  </div>
                )}
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    markUnableToFulfill(order.id)
                    pushToast(t('sell.status.unable_to_fulfill'), 'info')
                  }}
                >
                  <Ban size={16} /> {t('sell.unable')}
                </button>
              </>
            )}

            {/* Consumer — reconfirm after harvest */}
            {isConsumer && order.status === 'awaiting_consumer' && (
              <>
                <div className="card pad" style={{ background: 'var(--surface-2)', border: 'none' }}>
                  <div className="row" style={{ gap: 8, fontWeight: 600, marginBottom: 4 }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} /> {t('sell.readyTitle')}
                  </div>
                  <div className="muted" style={{ fontSize: 13 }}>
                    {t('sell.readyDesc')}
                  </div>
                </div>
                <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={() => setShowPay(true)}>
                    <CreditCard size={16} /> {t('sell.confirmPurchase')}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      cancelOrder(order.id)
                      pushToast(t('sell.status.cancelled'), 'info')
                    }}
                  >
                    {t('sell.cancelReservation')}
                  </button>
                </div>
              </>
            )}

            {/* Consumer — waiting on farmer */}
            {isConsumer &&
              ['reservation_pending', 'reservation_confirmed', 'awaiting_harvest'].includes(order.status) && (
                <>
                  <div className="note">
                    <Info size={14} /> {t('sell.pendingFarmer')}
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      cancelOrder(order.id)
                      pushToast(t('sell.status.cancelled'), 'info')
                    }}
                  >
                    {t('sell.cancelReservation')}
                  </button>
                </>
              )}

            {/* Demo — advance fulfilment */}
            {['order_confirmed', 'preparing', 'out_for_delivery'].includes(order.status) && (
              <>
                <div className="muted" style={{ fontSize: 13 }}>
                  {t('sell.advanceDemo')}
                </div>
                <button className="btn btn-primary" onClick={() => advanceOrder(order.id)}>
                  {t('sell.advanceDemo')} <ArrowRight size={16} />
                </button>
              </>
            )}

            {order.status === 'delivered' && (
              <div className="disclaimer" style={{ borderColor: 'var(--primary)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />
                <span>{t('sell.status.delivered')}</span>
              </div>
            )}

            {terminal && (
              <div className="note">
                <Info size={14} /> <StatusPill status={order.status} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showPay && (
        <Modal
          title={t('sell.confirmPurchase')}
          onClose={() => setShowPay(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setShowPay(false)}>
                {t('common.cancel')}
              </button>
              <button className="btn btn-primary" onClick={pay}>
                <CreditCard size={16} /> {t('sell.confirmPurchase')}
              </button>
            </>
          }
        >
          <div className="stack" style={{ gap: 12 }}>
            <div className="exp-row">
              <span className="k">{order.crop}</span>
              <span className="v">
                {order.quantity} {order.unit}
              </span>
            </div>
            <div className="exp-row">
              <span className="k">{t('sell.finalPriceLabel')}</span>
              <span className="v">
                {inr(order.finalPrice ?? order.expectedPrice)}/{order.unit}
              </span>
            </div>
            <div className="exp-row" style={{ fontWeight: 700 }}>
              <span className="k">{t('sell.total')}</span>
              <span className="v">{inr((order.finalPrice ?? order.expectedPrice) * order.quantity)}</span>
            </div>
            <div className="disclaimer">
              <Info size={16} />
              <span>{t('sell.reserveNote')}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
